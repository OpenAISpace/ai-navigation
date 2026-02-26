import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AjaxResponse } from "@/lib/utils";
import { invalidateCache } from "@/lib/db/cache";

interface CheckUrlResponse {
  isAlive: boolean;
}

const prisma = new PrismaClient();

async function checkUrl(url: string): Promise<CheckUrlResponse> {
  // 确保 URL 有协议前缀
  let checkUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    checkUrl = "https://" + url;
  }

  const fetchOptions = {
    redirect: "follow" as const,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    },
  };

  // 尝试多种检测方法
  const checkMethods = [
    // 方法1: HEAD 请求
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(checkUrl, {
          ...fetchOptions,
          method: "HEAD",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        // 2xx, 301, 302, 303, 307, 308 都认为是可访问的
        if (response.ok || response.status === 301 || response.status === 302 || response.status === 303 || response.status === 307 || response.status === 308) {
          return true;
        }
        // 4xx 客户端错误，通常说明网站可访问只是可能需要认证
        if (response.status >= 400 && response.status < 500) {
          return true;
        }
      } catch {
        // 失败
      }
      return null;
    },

    // 方法2: GET 请求（不获取完整内容）
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const response = await fetch(checkUrl, {
          ...fetchOptions,
          method: "GET",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok || response.status < 400) {
          return true;
        }
        if (response.status >= 400 && response.status < 500) {
          return true;
        }
      } catch {
        // 失败
      }
      return null;
    },

    // 方法3: 尝试 http 协议（如果 https 失败）
    async () => {
      if (checkUrl.startsWith("https://")) {
        const httpUrl = checkUrl.replace("https://", "http://");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          const response = await fetch(httpUrl, {
            ...fetchOptions,
            method: "GET",
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok || response.status < 400) {
            return true;
          }
        } catch {
          // 失败
        }
      }
      return null;
    },
  ];

  // 依次尝试每种方法
  for (const method of checkMethods) {
    try {
      const result = await method();
      if (result === true) {
        return { isAlive: true };
      }
      // 如果返回 null，继续下一个方法
      // 如果返回 false，说明确认不可访问
      if (result === false) {
        return { isAlive: false };
      }
    } catch {
      continue;
    }
  }

  // 所有方法都失败或超时，保守起见返回 false
  return { isAlive: false };
}

export async function POST(request: Request) {
  try {
    const { url, id: websiteId } = await request.json();

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid website ID"), {
        status: 400,
      });
    }

    if (!url) {
      return NextResponse.json(AjaxResponse.fail("url必须传递"));
    }

    const result = await checkUrl(url);

    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { active: result.isAlive ? 1 : 0 },
    });

    // 清除缓存，确保下次获取最新数据
    invalidateCache("approved-websites");

    return NextResponse.json(
      AjaxResponse.ok({ active: updatedWebsite.active })
    );
  } catch {
    return NextResponse.json(AjaxResponse.fail("校验页面链接失败"));
  }
}
