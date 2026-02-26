
import type { Prisma, Category } from '@prisma/client';
import { WebsiteSettings } from '../constraint';
import { prisma } from '../db/db';



const defaultCategories = [
  { name: 'AI 聊天', slug: 'ai-chat' },
  { name: 'AI 绘画', slug: 'ai-art' },
  { name: 'AI 写作', slug: 'ai-writing' },
  { name: 'AI 编程', slug: 'ai-coding' },
  { name: 'AI 工具', slug: 'ai-tools' },
  { name: '大语言模型', slug: 'llm' },
];

interface WebsiteInput {
  title: string;
  url: string;
  description: string;
  category_slug: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
}

const defaultWebsites: WebsiteInput[] = [
  // 对话类（ai-chat）
  {
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI 开发的 AI 聊天助手，能够进行自然对话并协助完成各种任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chat.openai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic 开发的 AI 助手，擅长写作、分析和编程等任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://claude.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Gemini',
    url: 'https://gemini.google.com',
    description: 'Google 推出的多模态大模型助手，支持聊天、搜索、代码和创作。',
    category_slug: 'ai-chat',
    thumbnail: 'https://gemini.google.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    description: '基于大模型的 AI 搜索与问答助手，擅长信息检索与总结。',
    category_slug: 'ai-chat',
    thumbnail: 'https://www.perplexity.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Poe',
    url: 'https://poe.com',
    description: 'Quora 推出的多模型对话平台，聚合 ChatGPT、Claude 等多个模型。',
    category_slug: 'ai-chat',
    thumbnail: 'https://poe.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Character.AI',
    url: 'https://character.ai',
    description: '创建和体验不同人格角色的对话式 AI 平台。',
    category_slug: 'ai-chat',
    thumbnail: 'https://character.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Kimi 智能助手',
    url: 'https://kimi.moonshot.cn',
    description: 'Moonshot AI 推出的中文长文本对话助手，支持长文理解与创作。',
    category_slug: 'ai-chat',
    thumbnail: 'https://kimi.moonshot.cn/favicon.ico',
    status: 'approved',
  },
  {
    title: '通义千问',
    url: 'https://tongyi.aliyun.com',
    description: '阿里云推出的大模型对话助手，支持多种办公与创作场景。',
    category_slug: 'ai-chat',
    thumbnail: 'https://tongyi.aliyun.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '文心一言',
    url: 'https://yiyan.baidu.com',
    description: '百度基于文心大模型打造的中文对话和创作助手。',
    category_slug: 'ai-chat',
    thumbnail: 'https://yiyan.baidu.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '讯飞星火',
    url: 'https://xinghuo.xfyun.cn',
    description: '科大讯飞推出的中文认知大模型助手，支持问答、写作和编程。',
    category_slug: 'ai-chat',
    thumbnail: 'https://xinghuo.xfyun.cn/favicon.ico',
    status: 'approved',
  },

  // 绘画 / 多媒体（ai-art）
  {
    title: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '强大的 AI 绘画工具，可以通过文字描述生成高质量图片。',
    category_slug: 'ai-art',
    thumbnail: 'https://www.midjourney.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'DALL·E',
    url: 'https://labs.openai.com',
    description: 'OpenAI 推出的文本生成图像模型，可以根据提示生成创意图片。',
    category_slug: 'ai-art',
    thumbnail: 'https://labs.openai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Leonardo AI',
    url: 'https://leonardo.ai',
    description: '专注于游戏和设计领域的 AI 图像生成平台。',
    category_slug: 'ai-art',
    thumbnail: 'https://leonardo.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Stable Diffusion – DreamStudio',
    url: 'https://dreamstudio.ai',
    description: '官方 Stable Diffusion 在线生成平台，支持多种风格和参数控制。',
    category_slug: 'ai-art',
    thumbnail: 'https://dreamstudio.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Adobe Firefly',
    url: 'https://firefly.adobe.com',
    description: 'Adobe 推出的生成式 AI 工具，支持图片和文本效果生成。',
    category_slug: 'ai-art',
    thumbnail: 'https://firefly.adobe.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Runway',
    url: 'https://runwayml.com',
    description: '面向创作者的视频与视觉生成 AI 平台，提供 Gen-2 等模型。',
    category_slug: 'ai-art',
    thumbnail: 'https://runwayml.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Canva AI 设计',
    url: 'https://www.canva.com',
    description: '集成多种 AI 能力的在线设计工具，支持文生图、自动排版等。',
    category_slug: 'ai-art',
    thumbnail: 'https://www.canva.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Krea AI',
    url: 'https://www.krea.ai',
    description: '支持实时提示、风格控制的 AI 绘画与设计工具。',
    category_slug: 'ai-art',
    thumbnail: 'https://www.krea.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Civitai',
    url: 'https://civitai.com',
    description: 'Stable Diffusion 模型与作品社区，提供模型下载与分享。',
    category_slug: 'ai-art',
    thumbnail: 'https://civitai.com/favicon.ico',
    status: 'approved',
  },

  // 写作 / 文案（ai-writing）
  {
    title: 'Jasper',
    url: 'https://www.jasper.ai',
    description: '面向营销与文案创作的 AI 写作助手，支持多种内容模版。',
    category_slug: 'ai-writing',
    thumbnail: 'https://www.jasper.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Copy.ai',
    url: 'https://www.copy.ai',
    description: '专注广告、邮件和社交媒体文案的 AI 写作工具。',
    category_slug: 'ai-writing',
    thumbnail: 'https://www.copy.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Notion AI',
    url: 'https://www.notion.so/product/ai',
    description: '集成在 Notion 中的 AI 助手，用于写作、总结和整理知识。',
    category_slug: 'ai-writing',
    thumbnail: 'https://www.notion.so/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Grammarly',
    url: 'https://www.grammarly.com',
    description: '英文写作与语法检查工具，提供智能改写和风格建议。',
    category_slug: 'ai-writing',
    thumbnail: 'https://www.grammarly.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'QuillBot',
    url: 'https://quillbot.com',
    description: '支持改写、总结和语法检查的 AI 写作辅助工具。',
    category_slug: 'ai-writing',
    thumbnail: 'https://quillbot.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Writesonic',
    url: 'https://writesonic.com',
    description: '营销内容与长文创作的 AI 平台，支持博客、广告文案等。',
    category_slug: 'ai-writing',
    thumbnail: 'https://writesonic.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Wordtune',
    url: 'https://www.wordtune.com',
    description: '提供句子改写与风格优化的英语写作助手。',
    category_slug: 'ai-writing',
    thumbnail: 'https://www.wordtune.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Rytr',
    url: 'https://rytr.me',
    description: '轻量级多语言 AI 写作工具，适合快速生成各类文本。',
    category_slug: 'ai-writing',
    thumbnail: 'https://rytr.me/favicon.ico',
    status: 'approved',
  },

  // 编程 / 开发（ai-coding）
  {
    title: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'GitHub 和 OpenAI 合作开发的 AI 编程助手，提供智能代码补全。',
    category_slug: 'ai-coding',
    thumbnail: 'https://github.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Replit Ghostwriter',
    url: 'https://replit.com/site/ghostwriter',
    description: '集成在 Replit 在线 IDE 中的 AI 编程助手。',
    category_slug: 'ai-coding',
    thumbnail: 'https://replit.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Tabnine',
    url: 'https://www.tabnine.com',
    description: '支持多种编辑器的本地与云端 AI 代码补全工具。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.tabnine.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Codeium',
    url: 'https://codeium.com',
    description: '免费商用的多语言 AI 代码补全与聊天助手。',
    category_slug: 'ai-coding',
    thumbnail: 'https://codeium.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Cursor',
    url: 'https://www.cursor.com',
    description: '面向开发者的 AI 编程编辑器，支持多模型与项目级理解。',
    category_slug: 'ai-coding',
    thumbnail: 'https://www.cursor.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Amazon CodeWhisperer',
    url: 'https://aws.amazon.com/codewhisperer/',
    description: '亚马逊推出的 AI 代码生成与建议服务，集成在 AWS 开发生态中。',
    category_slug: 'ai-coding',
    thumbnail: 'https://aws.amazon.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Sourcegraph Cody',
    url: 'https://sourcegraph.com/cody',
    description: '基于代码索引的 AI 编程助手，擅长大仓库的代码理解与重构建议。',
    category_slug: 'ai-coding',
    thumbnail: 'https://sourcegraph.com/favicon.ico',
    status: 'approved',
  },

  // 工具 / 效率（ai-tools）
  {
    title: 'Zapier AI',
    url: 'https://zapier.com/ai',
    description: '基于工作流自动化的 AI 助手，可连接上百种 SaaS 应用。',
    category_slug: 'ai-tools',
    thumbnail: 'https://zapier.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Make',
    url: 'https://www.make.com',
    description: '可视化自动化平台，支持集成多种 AI 服务和 API。',
    category_slug: 'ai-tools',
    thumbnail: 'https://www.make.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Otter.ai',
    url: 'https://otter.ai',
    description: '会议记录与语音转写的 AI 工具，支持自动摘要和行动项提取。',
    category_slug: 'ai-tools',
    thumbnail: 'https://otter.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Descript',
    url: 'https://www.descript.com',
    description: '面向播客和视频创作者的一体化音视频编辑与配音 AI 工具。',
    category_slug: 'ai-tools',
    thumbnail: 'https://www.descript.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'ElevenLabs',
    url: 'https://elevenlabs.io',
    description: '高质量多语言 AI 语音合成平台，支持克隆声音与情感控制。',
    category_slug: 'ai-tools',
    thumbnail: 'https://elevenlabs.io/favicon.ico',
    status: 'approved',
  },
  {
    title: 'HeyGen',
    url: 'https://www.heygen.com',
    description: '支持数字人和口型同步的视频生成平台，适合营销和培训视频。',
    category_slug: 'ai-tools',
    thumbnail: 'https://www.heygen.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Synthesia',
    url: 'https://www.synthesia.io',
    description: '以虚拟数字人演讲为核心的视频生成服务，支持多语言字幕。',
    category_slug: 'ai-tools',
    thumbnail: 'https://www.synthesia.io/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Gamma',
    url: 'https://gamma.app',
    description: '面向演示文稿和知识文档的 AI 生成与排版工具。',
    category_slug: 'ai-tools',
    thumbnail: 'https://gamma.app/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Tome',
    url: 'https://beta.tome.app',
    description: 'AI 驱动的故事化演示与文档创建平台。',
    category_slug: 'ai-tools',
    thumbnail: 'https://beta.tome.app/favicon.ico',
    status: 'approved',
  },
  {
    title: 'OpusClip',
    url: 'https://www.opus.pro',
    description: '长视频智能剪辑为短视频的 AI 工具，适合内容创作者。',
    category_slug: 'ai-tools',
    thumbnail: 'https://www.opus.pro/favicon.ico',
    status: 'approved',
  },

  // 大模型 / 平台（llm）
  {
    title: 'OpenAI',
    url: 'https://openai.com',
    description: '提供 GPT、DALL·E、Whisper 等多种生成式 AI 模型与 API 的平台。',
    category_slug: 'llm',
    thumbnail: 'https://openai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Anthropic',
    url: 'https://www.anthropic.com',
    description: 'Claude 大模型的开发公司，提供安全和可控性更强的 AI 能力。',
    category_slug: 'llm',
    thumbnail: 'https://www.anthropic.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    description: '开源模型与数据集社区，托管 Transformer、Diffusion 等众多模型。',
    category_slug: 'llm',
    thumbnail: 'https://huggingface.co/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Mistral AI',
    url: 'https://mistral.ai',
    description: '欧洲团队打造的开源与商业大模型提供商。',
    category_slug: 'llm',
    thumbnail: 'https://mistral.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'xAI',
    url: 'https://x.ai',
    description: '由 Elon Musk 创建的大模型公司，推出 Grok 等模型。',
    category_slug: 'llm',
    thumbnail: 'https://x.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'OpenRouter',
    url: 'https://openrouter.ai',
    description: '聚合多家大模型 API 的路由平台，可统一调用多种模型。',
    category_slug: 'llm',
    thumbnail: 'https://openrouter.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    description: 'Google 提供的 Gemini 等大模型在线体验与 API 平台。',
    category_slug: 'llm',
    thumbnail: 'https://aistudio.google.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Azure OpenAI Service',
    url: 'https://azure.microsoft.com/en-us/products/ai-services/openai-service',
    description: '微软 Azure 提供的企业级 GPT 模型托管与推理服务。',
    category_slug: 'llm',
    thumbnail: 'https://azure.microsoft.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Moonshot AI',
    url: 'https://www.moonshot.cn',
    description: 'Kimi 背后的大模型公司，专注中文长文本能力。',
    category_slug: 'llm',
    thumbnail: 'https://www.moonshot.cn/favicon.ico',
    status: 'approved',
  },
  {
    title: '智谱 AI',
    url: 'https://www.zhipuai.cn',
    description: '清华系大模型公司，推出 GLM 系列模型与 API 服务。',
    category_slug: 'llm',
    thumbnail: 'https://www.zhipuai.cn/favicon.ico',
    status: 'approved',
  },
] as WebsiteInput[];


interface FooterLinkInput {
  title: string;
  url: string;
}

const defaultFooterLinks: FooterLinkInput[] = [
  { title: 'GitHub', url: 'https://github.com' }
];
export async function initializeData() {
  try {
    // 初始化分类
    await Promise.all(
      defaultCategories.map(category =>
        prisma.category.upsert({
          where: { slug: category.slug },
          update: category,
          create: category,
        })
      )
    );

    // 获取所有分类的映射
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map((c: Category) => [c.slug, c.id])
    );

    // 初始化网站
    await Promise.all(
    defaultWebsites.map(async website => {
        const { category_slug, ...websiteData } = website;
        const category_id = categoryMap.get(category_slug);
        
        if (category_id) {
          const createData: Prisma.WebsiteCreateInput = {
            ...websiteData,
            category: { 
              connect: { id: Number(category_id) } 
            }
          };

          const updateData: Prisma.WebsiteUpdateInput = {
            ...websiteData,
            category: { 
              connect: { id: Number(category_id) } 
            }
          };

          const existingWebsite = await prisma.website.findFirst({
            where: { url: website.url }
          });

          if (existingWebsite) {
            return prisma.website.update({
              where: { id: existingWebsite.id },
              data: updateData
            });
          } else {
            return prisma.website.create({
              data: createData
            });
          }
        }
      })
    );

    // 初始化页脚链接
    await Promise.all(
      defaultFooterLinks.map(async link => {
        const existingLink = await prisma.footerLink.findUnique({
          where: { url: link.url }
        });

        if (existingLink) {
          return prisma.footerLink.update({
            where: { id: existingLink.id },
            data: link
          });
        } else {
          return prisma.footerLink.create({
            data: link
          });
        }
      })
    );

    console.log('数据初始化完成');
  } catch (error) {
    console.error('数据初始化失败:', error);
    throw error;
  }
}

export async function initializeSettings() {
  const requiredSettings = [
    { key: WebsiteSettings.title, value: 'AI导航' },
    { key: WebsiteSettings.description, value: '发现、分享和收藏优质AI工具与资源' },
    { key: WebsiteSettings.keywords, value: 'AI导航,AI工具,人工智能,AI资源' },
    { key: WebsiteSettings.logo, value: '/static/logo.png' },
    { key: WebsiteSettings.siteIcp, value: '' },
    { key: WebsiteSettings.siteFooter, value: '© 2024 AI导航. All rights reserved.' },
    { key: WebsiteSettings.allowSubmissions, value: 'true' },
    { key: WebsiteSettings.requireApproval, value: 'true' },
    { key: WebsiteSettings.itemsPerPage, value: '12' },
    { key: WebsiteSettings.adminPassword, value: process.env.ADMIN_PASSWORD || 'admin' },
    { key: WebsiteSettings.siteUrl, value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
    { key: WebsiteSettings.siteEmail, value: process.env.SITE_EMAIL || 'admin@example.com' },
    { key: WebsiteSettings.siteCopyright, value: '© 2024 AI导航. All rights reserved.' },
    { key: WebsiteSettings.googleAnalytics, value: process.env.GOOGLE_ANALYTICS || '' },
    { key: WebsiteSettings.baiduAnalytics, value: process.env.BAIDU_ANALYTICS || '' },
  ];
  
  await Promise.all(
    requiredSettings.map(setting =>
      prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      })
    )
  );
}

module.exports = {
  initializeData,
  initializeSettings
}; 

// 如果作为脚本直接执行，则自动运行初始化逻辑
async function runInit() {
  try {
    await initializeData();
    await initializeSettings();
    console.log('所有数据初始化完成');
  } catch (error) {
    console.error('初始化脚本执行失败:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

// 通过命令行执行时（pnpm run init-data），才会触发
if (process.argv[1]?.includes('init-data')) {
  void runInit();
}