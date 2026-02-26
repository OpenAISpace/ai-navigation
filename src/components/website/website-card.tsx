"use client";

import { motion } from "framer-motion";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import {
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  Heart,
  Circle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website, Category } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/common/tooltip";

interface WebsiteCardProps {
  website: Website;
  category?: Category;
  isAdmin: boolean;
  onVisit: (website: Website) => void;
  onStatusUpdate: (id: number, status: Website["status"]) => void;
  onLike?: (id: number, newLikes: number) => void;
}

export function WebsiteCard({
  website,
  category,
  isAdmin,
  onVisit,
  onStatusUpdate,
  onLike,
}: WebsiteCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const [isLiking, setIsLiking] = useState(false);
  const prevLikesRef = useRef(website.likes);
  const { cardRef, tiltProps } = useCardTilt();

  // 当 website.likes 从外部更新时，同步本地状态
  useEffect(() => {
    if (website.likes !== prevLikesRef.current) {
      setLikes(website.likes);
      prevLikesRef.current = website.likes;
    }
  }, [website.likes]);

  const statusColors: Record<Website["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    approved: "bg-green-500/10 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400",
    all: "",
  };

  const statusText: Record<Website["status"], string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝",
    all: "",
  };

  const handleLike = async () => {
    // 如果正在加载中或已点赞，则不处理
    const key = `website-${website.id}-liked`;
    const lastLiked = localStorage.getItem(key);
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (isLiking) return;

    if (lastLiked && now - parseInt(lastLiked) < oneDay) {
      toast({
        title: "已点赞",
        description: "每天只能点赞一次哦，明天再来吧 (｡•́︿•̀｡)",
      });
      return;
    }

    setIsLiking(true);

    try {
      const response = await fetch(`/api/websites/${website.id}/like`, {
        method: "POST",
      });
      const data = await response.json();
      localStorage.setItem(key, now.toString());
      // 使用 API 返回的最新 likes 数
      let newLikes: number;
      if (data.code === 200 && data.data?.likes !== undefined) {
        newLikes = data.data.likes;
        setLikes(newLikes);
      } else {
        newLikes = likes + 1;
        setLikes(newLikes);
      }
      // 回调父组件更新全局状态
      onLike?.(website.id, newLikes);
      toast({
        title: "点赞成功",
        description: "感谢您的支持！",
      });
    } catch (error) {
      console.error("点赞失败:", error);
      toast({
        title: "点赞失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={tiltProps.onMouseMove}
      onMouseEnter={tiltProps.onMouseEnter}
      onMouseLeave={tiltProps.onMouseLeave}
      className="card-container relative [perspective:1000px]"
    >
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
        className="h-full"
        style={{ willChange: "transform" }}
      >
        <Card
          className={cn(
            "group relative flex flex-col overflow-hidden",
            "bg-background",
            "border-white/5 dark:border-white/10",
            "hover:bg-background/95",
            "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
            "dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)]",
            "transition-all duration-500 ease-out",
            "rounded-2xl sm:rounded-lg"
          )}
        >
          {/* 状态指示点 */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-0 right-0 z-10 w-6 h-6 flex justify-center items-center">
                  <Circle
                    className={cn(
                      "w-2 h-2",
                      website.active
                        ? "fill-green-500 text-green-500"
                        : "fill-red-500 text-red-500"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{website.active ? "网站可访问" : "网站不可访问"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Background Gradient */}
          <div className="absolute inset-0 z-[3]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
          </div>

          {/* Card Content Container */}
          <div className="relative z-[4] flex flex-col flex-1">
            {/* Website Icon and Status */}
            <div className="relative p-2 sm:p-3 flex items-center justify-between card-content">
              <div className="flex items-center gap-2 sm:gap-3 max-w-[75%]">
                <WebsiteThumbnail
                  url={website.url}
                  thumbnail={website.thumbnail}
                  thumbnail_base64={website.thumbnail_base64}
                  title={website.title}
                />
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "font-normal text-[10px] sm:text-xs",
                      statusColors[website.status]
                    )}
                  >
                    {statusText[website.status]}
                  </Badge>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] sm:text-xs font-normal",
                  "bg-background shrink-0",
                  "absolute top-1.5 right-1.5 sm:static",
                  "rounded-xl sm:rounded-lg"
                )}
              >
                {category?.name || "未分类"}
              </Badge>
            </div>

            {/* Description */}
            <div className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {website.description}
              </p>
            </div>

            {/* Stats and Actions */}
            <div className="relative px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between border-t border-border/5">
              {/* Stats */}
              <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
                <span>{website.visits} 次访问</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{likes}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVisit(website)}
                  className={cn(
                    "h-7 sm:h-8 px-3 sm:flex-1 text-xs sm:text-sm",
                    "bg-white/[0.02] backdrop-blur-xl border-white/10",
                    "hover:bg-white/[0.04] hover:border-white/20 hover:text-primary",
                    "dark:bg-white/[0.01] dark:hover:bg-white/[0.02]",
                    "transition-all duration-300"
                  )}
                >
                  <span className="hidden sm:inline">访问网站</span>
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8 p-0",
                    "bg-white/[0.02] backdrop-blur-xl border-white/10",
                    "hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500",
                    "dark:bg-white/[0.01] dark:hover:bg-red-500/10",
                    "transition-all duration-300",
                    isLiking && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isLiking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileTap={{ scale: 1.4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.div>
                  )}
                </Button>

                {isAdmin && website.status !== "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStatusUpdate(website.id, "approved")}
                    className={cn(
                      "h-7 sm:h-8 px-1.5 sm:px-2",
                      "bg-white/[0.02] backdrop-blur-xl border-white/10",
                      "hover:bg-green-500/5 hover:border-green-500/20 hover:text-green-500",
                      "dark:bg-white/[0.01] dark:hover:bg-green-500/10",
                      "transition-all duration-300"
                    )}
                  >
                    <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}

                {isAdmin && website.status !== "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onStatusUpdate(website.id, "rejected");
                    }}
                    className={cn(
                      "h-7 sm:h-8 px-1.5 sm:px-2",
                      "bg-white/[0.02] backdrop-blur-xl border-white/10",
                      "hover:bg-red-500/5 hover:border-red-500/20 hover:text-red-500",
                      "dark:bg-white/[0.01] dark:hover:bg-red-500/10",
                      "transition-all duration-300"
                    )}
                  >
                    <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
