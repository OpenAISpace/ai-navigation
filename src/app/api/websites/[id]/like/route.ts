import { NextResponse } from "next/server";
import { AjaxResponse } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import { invalidateCache } from "@/lib/db/cache";

const prisma = new PrismaClient();

// POST /api/websites/[id]/like - Add like
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const websiteId = parseInt((await params).id);
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { likes: { increment: 1 } },
    });

    // 清除网站列表缓存
    invalidateCache("approved-websites");

    return NextResponse.json(AjaxResponse.ok({ likes: updatedWebsite.likes }));
  } catch (error) {
    console.error("Failed to like website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to like website"), {
      status: 500,
    });
  }
}

// DELETE /api/websites/[id]/like - Remove like
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const websiteId = parseInt((await params).id);
    const updatedWebsite = await prisma.website.update({
      where: { id: websiteId },
      data: { likes: { decrement: 1 } },
    });

    return NextResponse.json(AjaxResponse.ok({ likes: updatedWebsite.likes }));
  } catch (error) {
    console.error("Failed to unlike website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to unlike website"), {
      status: 500,
    });
  }
}
