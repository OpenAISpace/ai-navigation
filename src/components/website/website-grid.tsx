"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtomValue, useAtom } from "jotai";
import { isAdminModeAtom, isCompactModeAtom, websitesAtom } from "@/lib/atoms";
import { useToast } from "@/hooks/use-toast";
import { WebsiteCard } from "./website-card";
import { CompactCard } from "./compact-card";
import { ViewModeToggle } from "./view-mode-toggle";
import { cn } from "@/lib/utils/utils";
import type { Website, Category } from "@/lib/types";
import { Globe, Loader2 } from "lucide-react";

interface WebsiteGridProps {
  websites: Website[];
  categories: Category[];
  className?: string;
}

const PAGE_SIZE = 20;

export default function WebsiteGrid({
  websites,
  categories,
  className,
}: WebsiteGridProps) {
  const isAdmin = useAtomValue(isAdminModeAtom);
  const { toast } = useToast();
  const [isCompact, setIsCompact] = useAtom(isCompactModeAtom);
  const [, setWebsites] = useAtom(websitesAtom);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 重置可见数量当网站列表变化时
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [websites.length]);

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && visibleCount < websites.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, websites.length));
            setIsLoading(false);
          }, 300);
        }
      },
      { rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [websites.length, isLoading, visibleCount]);

  const visibleWebsites = websites.slice(0, visibleCount);
  const hasMore = visibleCount < websites.length;

  const handleVisit = (website: Website) => {
    window.open(website.url, "_blank");

    fetch(`/api/websites/${website.id}/visit`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data?.visits !== undefined) {
          setWebsites((prevWebsites) =>
            prevWebsites.map((w) =>
              w.id === website.id ? { ...w, visits: data.data.visits } : w
            )
          );
        } else {
          setWebsites((prevWebsites) =>
            prevWebsites.map((w) =>
              w.id === website.id ? { ...w, visits: w.visits + 1 } : w
            )
          );
        }
      })
      .catch(console.error);

    fetch(`/api/websites/active`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: website.url, id: website.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200 && data.data?.active !== undefined) {
          setWebsites((prevWebsites) =>
            prevWebsites.map((w) =>
              w.id === website.id ? { ...w, active: data.data.active } : w
            )
          );
        }
      })
      .catch(console.error);
  };

  const handleStatusUpdate = async (id: number, status: Website["status"]) => {
    await fetch(`/api/websites/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    setWebsites(
      websites.map((website) =>
        website.id === id ? { ...website, status } : website
      )
    );
    toast({
      title: "状态已更新",
      description: status === "approved" ? "网站已通过审核" : "网站已被拒绝",
    });
  };

  const handleLike = (id: number, newLikes: number) => {
    setWebsites((prevWebsites) =>
      prevWebsites.map((w) => (w.id === id ? { ...w, likes: newLikes } : w))
    );
  };

  return (
    <motion.div className={cn("relative min-h-[500px]", className)}>
      <ViewModeToggle isCompact={isCompact} onChange={setIsCompact} />

      <AnimatePresence mode="wait">
        {!websites || websites.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto">
                <Globe className="w-10 h-10 text-primary/40" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground/80">
                  暂无网站
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  当前分类下还没有添加任何网站
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "grid gap-y-4 gap-x-3",
              isCompact
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}
          >
            {visibleWebsites.map((website, index) => (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.15,
                  delay: Math.min(index * 0.02, 0.2),
                  ease: "easeOut",
                }}
              >
                {isCompact ? (
                  <CompactCard
                    website={website}
                    onVisit={handleVisit}
                    onLike={handleLike}
                  />
                ) : (
                  <WebsiteCard
                    website={website}
                    category={categories.find(
                      (c) => c.id === website.category_id
                    )}
                    isAdmin={isAdmin}
                    onVisit={handleVisit}
                    onStatusUpdate={handleStatusUpdate}
                    onLike={handleLike}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>加载中...</span>
            </div>
          ) : null}
        </div>
      )}

      {/* 显示加载状态 */}
      {websites.length > 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          {visibleCount} / {websites.length} 个网站
          {hasMore ? " · 向下滚动加载更多" : " · 已加载全部"}
        </div>
      )}
    </motion.div>
  );
}
