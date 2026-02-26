import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AjaxResponse } from "@/lib/utils";
import { invalidateCache } from "@/lib/db/cache";

const prisma = new PrismaClient();

// POST /api/websites/[id]/visit
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const websiteId = parseInt(params.id);

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid website ID"), {
        status: 400,
      });
    }

    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { visits: { increment: 1 } },
    });

    // 清除网站列表缓存
    invalidateCache("approved-websites");

    return NextResponse.json(
      AjaxResponse.ok({ visits: updatedWebsite.visits })
    );
  } catch (error) {
    console.error("Failed to increment visits:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to increment visits"), {
      status: 500,
    });
  }
}
