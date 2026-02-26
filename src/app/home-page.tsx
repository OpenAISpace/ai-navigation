"use client";

import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { websitesAtom } from "@/lib/atoms";
import {
  categoriesAtom,
  searchQueryAtom,
  selectedCategoryAtom,
} from "@/lib/atoms";
import WebsiteGrid from "@/components/website/website-grid";
import { PersistentHeader } from "@/components/header/persistent-header";
import { Typewriter } from "@/ui/animation/typewriter";
import { Brain, Cpu, Sparkles, Zap } from "lucide-react";
import type { Website, Category } from "@/lib/types";
import { useTheme } from "next-themes";
import { WaveText } from "@/ui/animation/wave-text";

interface HomePageProps {
  initialWebsites: Website[];
  initialCategories: Category[];
}

export default function HomePage({
  initialWebsites,
  initialCategories,
}: HomePageProps) {
  const [websites, setWebsites] = useAtom(websitesAtom);
  // console.log("🚀 ~ websites:", websites);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory] = useAtom(selectedCategoryAtom);
  const { scrollY } = useScroll();
  const { theme } = useTheme();
  // Enhanced scroll-based animations
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -100]);
  const isScrolled = useTransform(scrollY, (value) => value > 300);

  // 初始化数据
  useEffect(() => {
    setWebsites(initialWebsites);
    setCategories(initialCategories);
  }, [initialWebsites, initialCategories, setWebsites, setCategories]);

  // 处理搜索和分类过滤 - 使用 useMemo 缓存结果
  const filteredWebsites = useMemo(() => {
    if (!websites) return [];

    return websites.filter((website) => {
      const matchesSearch =
        !searchQuery ||
        website.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        website.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || website.category_id === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [websites, searchQuery, selectedCategory]);

  // 处理主题切换
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // const handleVisit = (website: Website) => {
  //   fetch(`/api/websites/${website.id}/visit`, { method: "POST" });
  //   window.open(website.url, "_blank");
  // };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background - 添加 will-change 优化性能 */}
      <motion.div
        className="fixed inset-0 -z-10 overflow-hidden"
        initial={false}
        style={{ willChange: "opacity" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <motion.div
          initial={false}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </motion.div>

      {/* Persistent Header */}
      <PersistentHeader
        searchQuery={searchQuery}
        onSearchChange={(searchQuery) => setSearchQuery(searchQuery)}
        categories={categories}
        isScrolled={isScrolled.get()}
      />

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Hero Section */}
        <motion.div
          className="relative py-16"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroTranslateY,
          }}
        >
          {/* Floating Icons */}
          <AnimatePresence mode="popLayout">
            {[
              {
                Icon: Brain,
                position: "left-1/4 top-1/4",
                size: "w-12 h-12",
              },
              { Icon: Cpu, position: "right-1/4 top-1/3", size: "w-10 h-10" },
              {
                Icon: Sparkles,
                position: "left-1/3 bottom-1/4",
                size: "w-8 h-8",
              },
              {
                Icon: Zap,
                position: "right-1/3 bottom-1/3",
                size: "w-9 h-9",
              },
            ].map(({ Icon, position, size }, index) => (
              <motion.div
                key={index}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${position}`}
                initial={false}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.2,
                    duration: 0.8,
                  },
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: 10,
                  transition: { duration: 0.3 },
                }}
              >
                <Icon className={`${size} text-primary/20`} />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
            {/* Title */}
            <motion.div className="space-y-3 sm:space-y-4">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight sm:leading-normal">
                <WaveText className="text-primary">
                  发现探索AI新世界的乐趣
                </WaveText>
              </div>
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-muted-foreground/90"
              >
                <Typewriter
                  text="发现、分享和收藏优质AI工具与资源，让你的人工智能生活更美好"
                  speed={80}
                  delay={500}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Website Grid */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="container mx-auto px-4 pb-24"
        >
          <WebsiteGrid
            websites={filteredWebsites}
            categories={categories}
            // onVisit={handleVisit}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
