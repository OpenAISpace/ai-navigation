"use client";

import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { selectedCategoryAtom } from "@/lib/atoms/index";
import { cn } from "@/lib/utils/utils";
import type { Category } from "@/lib/types";
import { useState, useEffect } from "react";
import { Folder, FolderOpen } from "lucide-react";

interface CategorySidebarProps {
  categories: Category[];
  className?: string;
  collapsed?: boolean;
}

export function CategorySidebar({ categories, className, collapsed = false }: CategorySidebarProps) {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  // 收起模式只显示图标
  if (collapsed) {
    return (
      <div className={cn("flex flex-col gap-1.5 px-1", className)}>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={cn(
              "w-full h-11 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
              selectedCategory === category.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-background/60"
            )}
            title={category.name}
          >
            {selectedCategory === category.id ? (
              <FolderOpen className="w-4 h-4" />
            ) : (
              <Folder className="w-4 h-4" />
            )}
            {selectedCategory === category.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  // 展开模式显示完整分类名
  return (
    <div className={cn("flex flex-col gap-1 px-2", className)}>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={cn(
            "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2.5 group",
            selectedCategory === category.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.99 }}
        >
          {selectedCategory === category.id ? (
            <FolderOpen className="w-4 h-4 shrink-0" />
          ) : (
            <Folder className="w-4 h-4 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          )}
          <span className="truncate">{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
