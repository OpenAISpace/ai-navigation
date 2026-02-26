import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateWebsiteActive() {
  try {
    // 获取所有需要检查的网站
    const websites = await prisma.website.findMany({
      where: {
        status: "approved",
      },
      select: {
        id: true,
        url: true,
        title: true,
      },
    });

    console.log(`开始检查 ${websites.length} 个网站的可访问性`);

    // 使用 Promise.allSettled 并行检查（每次最多5个）
    const batchSize = 5;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < websites.length; i += batchSize) {
      const batch = websites.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (website) => {
          try {
            const result = await fetch(`/api/websites/active`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ url: website.url, id: website.id }),
            }).then((res) => res.json());

            if (result.code === 200) {
              successCount++;
            } else {
              failCount++;
            }
          } catch (error) {
            failCount++;
            if (error instanceof Error) {
              console.log(
                `检查网站 [${website.title}] (ID: ${website.id}) 失败: ${error.message}`
              );
            }
          }
        })
      );

      // 每批之间添加短暂延迟，避免请求过快
      if (i + batchSize < websites.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 进度提示
      const progress = Math.min(i + batchSize, websites.length);
      console.log(`进度: ${progress}/${websites.length}`);
    }

    console.log(`网站检查完成 - 成功: ${successCount}, 失败: ${failCount}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log("检查网站过程中发生错误:", error.message);
    } else {
      console.log("检查网站过程中发生未知错误");
    }
  } finally {
    await prisma.$disconnect();
  }
}
