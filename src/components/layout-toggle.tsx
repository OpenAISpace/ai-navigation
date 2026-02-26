"use client";

import { useAtom } from "jotai";
import { layoutModeAtom } from "@/lib/atoms/index";
import { LayoutGrid, LayoutList, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/ui/common/button";
import { cn } from "@/lib/utils/utils";

interface LayoutToggleProps {
  className?: string;
  onToggleSidebar?: (expanded: boolean) => void;
}

export function LayoutToggle({ className, onToggleSidebar }: LayoutToggleProps) {
  const [layoutMode, setLayoutMode] = useAtom(layoutModeAtom);

  const handleLayoutChange = (mode: "top" | "sidebar") => {
    setLayoutMode(mode);
    if (mode === "sidebar" && onToggleSidebar) {
      onToggleSidebar(true);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground mr-2">布局:</span>
      <Button
        variant={layoutMode === "top" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLayoutChange("top")}
        className={cn("gap-1", layoutMode === "top" && "bg-primary")}
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="hidden sm:inline">顶部</span>
      </Button>
      <Button
        variant={layoutMode === "sidebar" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLayoutChange("sidebar")}
        className={cn("gap-1", layoutMode === "sidebar" && "bg-primary")}
      >
        <LayoutList className="w-4 h-4" />
        <span className="hidden sm:inline">侧边栏</span>
      </Button>
    </div>
  );
}

// 侧边栏展开/收起按钮
interface SidebarToggleProps {
  expanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export function SidebarToggle({ expanded, onToggle }: SidebarToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onToggle(!expanded)}
      className="fixed left-4 top-20 z-50 bg-background/80 backdrop-blur-xl border border-border/40 shadow-lg"
    >
      {expanded ? (
        <PanelLeftClose className="w-5 h-5" />
      ) : (
        <PanelLeft className="w-5 h-5" />
      )}
    </Button>
  );
}
