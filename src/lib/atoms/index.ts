import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Website, Category, FooterSettings } from "@/lib/types";
// 使用 atomWithStorage 来持久化存储设置
export const websitesAtom = atom<Website[]>([]);
export const categoriesAtom = atom<Category[]>([]);
export const searchQueryAtom = atom("");
export const selectedCategoryAtom = atom<number | null>(1);
export const isAdminModeAtom = atomWithStorage("isAdminMode", false);
export const isCompactModeAtom = atomWithStorage("isCompactMode", false);
export const layoutModeAtom = atomWithStorage<"top" | "sidebar">("layoutMode", "top");

// OSS 设置
export interface OSSSettings {
  provider: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
}

export const ossSettingsAtom = atomWithStorage<OSSSettings>("ossSettings", {
  provider: "aliyun",
  region: "oss-cn-hangzhou",
  bucket: "",
  accessKeyId: "",
  accessKeySecret: "",
  endpoint: "",
});

export const footerSettingsAtom = atom<FooterSettings>({
  copyright: "© 2024 网站导航",
  icpBeian: "京ICP备XXXXXXXX号",
  links: [],
  customHtml: "",
});
