"use client";

import { motion } from "framer-motion";
import { Card } from "@/ui/common/card";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import { Heart, Globe, ArrowUpRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  cardHoverVariants,
  sharedLayoutTransition,
} from "@/ui/animation/variants/animations";
import type { Website } from "@/lib/types";
import { useState, useRef, useEffect } from "react";
import { WebsiteThumbnail } from "./website-thumbnail";
import { toast } from "@/hooks/use-toast";
import { useCardTilt } from "@/hooks/use-card-tilt";

interface CompactCardProps {
  website: Website;
  onVisit: (website: Website) => void;
  onLike?: (id: number, newLikes: number) => void;
}

export function CompactCard({ website, onVisit, onLike }: CompactCardProps) {
  const [likes, setLikes] = useState(website.likes);
  const [isLiking, setIsLiking] = useState(false);
  const prevLikesRef = useRef(website.likes);
  const { cardRef, tiltProps } = useCardTilt({
    maxTiltDegree: 10, // 减小倾斜角度
    scale: 1.02, // 减小缩放比例
    transitionZ: 10, // 减小Z轴位移
  });

  // 当 website.likes 从外部更新时，同步本地状态
  useEffect(() => {
    if (website.likes !== prevLikesRef.current) {
      setLikes(website.likes);
      prevLikesRef.current = website.likes;
    }
  }, [website.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击
    const key = `website-${website.id}-liked`;
    const lastLiked = localStorage.getItem(key);
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (isLiking) return;

    if (lastLiked && now - parseInt(lastLiked) < oneDay) {
      toast({
        title: "已点赞",
        description: "你已经点赞了，请过段时间再来吧 (｡•́︿•̀｡)",
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
      {...tiltProps}
      className="card-container"
      onClick={() => onVisit(website)}
      style={{ cursor: "pointer" }}
    >
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        layoutId={`website-${website.id}`}
        transition={sharedLayoutTransition}
      >
        <Card
          className={cn(
            "group relative flex flex-col overflow-hidden",
            "bg-background",
            "border-primary/15 dark:border-white/10",
            "hover:border-primary/20 dark:hover:border-primary/20",
            "hover:bg-background",
            "shadow-sm hover:shadow-lg",
            "transition-colors duration-300",
            "rounded-2xl sm:rounded-lg"
          )}
        >
          {/* Content */}
          <div className="relative py-2 px-3 sm:p-3 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <WebsiteThumbnail
                url={website.url}
                thumbnail={website.thumbnail}
                thumbnail_base64={website.thumbnail_base64}
                title={website.title}
                className="w-9 h-9 sm:w-10 sm:h-10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium text-sm flex-1 truncate group-hover:text-primary transition-colors">
                    {website.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{website.visits}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {website.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  disabled={isLiking}
                  className={cn(
                    "h-8 w-8 p-0",
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
                      <Loader2 className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      whileTap={{ scale: 1.4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart className="h-4 w-4" />
                    </motion.div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
