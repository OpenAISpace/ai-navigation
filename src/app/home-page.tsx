"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useAtom } from "jotai";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { websitesAtom, layoutModeAtom } from "@/lib/atoms";
import {
  categoriesAtom,
  searchQueryAtom,
  selectedCategoryAtom,
} from "@/lib/atoms";
import WebsiteGrid from "@/components/website/website-grid";
import { PersistentHeader } from "@/components/header/persistent-header";
import { CategorySidebar } from "@/components/category-sidebar";
import { LayoutToggle } from "@/components/layout-toggle";
import { Typewriter } from "@/ui/animation/typewriter";
import { Brain, Cpu, Sparkles, Zap, PanelLeftClose, PanelLeftOpen, LayoutGrid } from "lucide-react";
import type { Website, Category } from "@/lib/types";
import { useTheme } from "next-themes";
import { WaveText } from "@/ui/animation/wave-text";
import { Button } from "@/ui/common/button";

interface HomePageProps {
  initialWebsites: Website[];
  initialCategories: Category[];
}

export default function HomePage({
  initialWebsites,
  initialCategories,
}: HomePageProps) {
  const [websites, setWebsites] = useAtom(websitesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory] = useAtom(selectedCategoryAtom);
  const [layoutMode, setLayoutMode] = useAtom(layoutModeAtom);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // 检测底部栏可见性
  useEffect(() => {
    if (layoutMode !== "sidebar") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footerEl = document.querySelector("footer");
    if (footerEl) {
      observer.observe(footerEl);
    }

    return () => observer.disconnect();
  }, [layoutMode]);
  const { scrollY } = useScroll();
  const { theme } = useTheme();

  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const heroTranslateY = useTransform(scrollY, [0, 400], [0, -100]);

  useEffect(() => {
    setWebsites(initialWebsites);
    setCategories(initialCategories);
  }, [initialWebsites, initialCategories, setWebsites, setCategories]);

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

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const currentCategoryName = useMemo(() => {
    const category = categories.find(c => c.id === Number(selectedCategory));
    return category?.name || "全部";
  }, [categories, selectedCategory]);

  const sidebarWidth = sidebarExpanded ? "w-64" : "w-16";

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
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

      {/* 顶部布局 */}
      {layoutMode === "top" && (
        <>
          <PersistentHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            isScrolled={false}
          />

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              className="relative py-16"
              style={{
                opacity: heroOpacity,
                scale: heroScale,
                y: heroTranslateY,
              }}
            >
              <AnimatePresence mode="popLayout">
                {[
                  { Icon: Brain, position: "left-1/4 top-1/4", size: "w-12 h-12" },
                  { Icon: Cpu, position: "right-1/4 top-1/3", size: "w-10 h-10" },
                  { Icon: Sparkles, position: "left-1/3 bottom-1/4", size: "w-8 h-8" },
                  { Icon: Zap, position: "right-1/3 bottom-1/3", size: "w-9 h-9" },
                ].map(({ Icon, position, size }, index) => (
                  <motion.div
                    key={index}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${position}`}
                    initial={false}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: index * 0.2, duration: 0.8 },
                    }}
                    whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.3 } }}
                  >
                    <Icon className={`${size} text-primary/20`} />
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
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

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="container mx-auto px-4 pb-24"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">全部网站</h2>
                <LayoutToggle />
              </div>
              <WebsiteGrid
                websites={filteredWebsites}
                categories={categories}
              />
            </motion.div>
          </motion.div>
        </>
      )}

      {/* 侧边栏布局 */}
      {layoutMode === "sidebar" && (
        <div className="flex min-h-screen">
          {/* 侧边栏 */}
          <motion.aside
            initial={false}
            animate={{ width: sidebarExpanded ? 220 : 56 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`fixed left-0 top-14 bg-background/50 backdrop-blur-sm border-r border-border/40 z-40 flex flex-col transition-all duration-300 ${footerVisible ? 'bottom-12' : 'bottom-0'}`}
          >
            {/* 分类列表 */}
            <div className="flex-1 overflow-y-auto py-3">
              <CategorySidebar
                categories={categories}
                collapsed={!sidebarExpanded}
              />
            </div>

            {/* 底部操作区 */}
            <div className="mt-auto p-2 border-t border-border/30">
              <AnimatePresence mode="wait">
                {sidebarExpanded ? (
                  <motion.div
                    key="expanded-footer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center justify-between"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarExpanded(false)}
                      className="gap-1.5 h-9"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                      <span>收起</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLayoutMode("top")}
                      className="gap-1.5 h-9 text-muted-foreground hover:text-foreground"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span>顶部</span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-2 items-center py-1"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSidebarExpanded(true)}
                      className="h-9 w-9 rounded-lg"
                      title="展开侧边栏"
                    >
                      <PanelLeftOpen className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLayoutMode("top")}
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
                      title="切换到顶部布局"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>

          {/* 主内容区 */}
          <motion.div
            initial={false}
            animate={{ marginLeft: sidebarExpanded ? 220 : 56 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 min-h-screen"
          >
            {/* 顶部栏 - 包含搜索和分类筛选 */}
            <PersistentHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              isScrolled={false}
            />

            {/* 内容区域 */}
            <div className="container mx-auto px-4 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{currentCategoryName}</h2>
                <span className="text-sm text-muted-foreground">
                  {filteredWebsites.length} 个网站
                </span>
              </div>
              <WebsiteGrid
                websites={filteredWebsites}
                categories={categories}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
