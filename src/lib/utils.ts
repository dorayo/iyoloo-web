import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createUpdateData<T extends Record<string, unknown>>(
  input: Partial<T>,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(input).filter(([_, value]) => value !== undefined),
  ) as Partial<T>;
}

export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${month}-${day} ${hours}:${minutes}`;
};

/**
 * 转换环信图片URL为可访问的URL
 * @param originalUrl 原始环信URL
 * @returns 转换后的可访问URL
 */
export const transformImageUrl = (originalUrl: string): string => {
  // 如果URL为空，返回默认图片
  if (!originalUrl) {
    return "/images/default-image.png";
  }

  try {
    // 解析原始URL
    const url = new URL(originalUrl);

    // 提取文件路径和参数
    const pathMatch = /\/(\d+)\/([^/]+)\/chatfiles\/([^?]+)/.exec(url.pathname);
    if (!pathMatch) {
      throw new Error("Invalid image URL format");
    }

    const [, orgName, appName, fileName] = pathMatch;
    const secret = url.searchParams.get("share-secret");

    // 构建新的URL（使用环信的公共访问域名）
    // 注意：这里的域名需要根据实际环境配置
    const baseUrl =
      process.env.NEXT_PUBLIC_EASEMOB_IMG_URL || "https://a1.easemob.com";

    // 构建新的URL路径
    const newPath = `//${baseUrl}/${orgName}/${appName}/chatfiles/${fileName}`;

    // 添加必要的参数
    const params = new URLSearchParams();
    if (secret) {
      params.append("share-secret", secret);
    }
    params.append("em-redirect", "true");

    // 返回完整的URL
    return `${newPath}?${params.toString()}`;
  } catch (error) {
    console.error("Error transforming image URL:", error);
    // 发生错误时返回默认图片
    return "/images/default-image.png";
  }
};

/**
 * 带缓存的图片URL转换
 */
const urlCache = new Map<string, string>();

export const transformImageUrlWithCache = (originalUrl: string): string => {
  // 检查缓存
  if (urlCache.has(originalUrl)) {
    return urlCache.get(originalUrl)!;
  }

  // 转换URL
  const transformedUrl = transformImageUrl(originalUrl);

  // 存入缓存
  urlCache.set(originalUrl, transformedUrl);

  return transformedUrl;
};

/**
 * 处理缩略图URL
 */
export const getThumbImageUrl = (
  originalUrl: string,
  size: "small" | "medium" | "large" = "medium",
): string => {
  const transformedUrl = transformImageUrl(originalUrl);

  // 添加缩略图参数
  const thumbSize = {
    small: "100x100",
    medium: "200x200",
    large: "400x400",
  }[size];

  const url = new URL(transformedUrl);
  url.searchParams.append("thumbnail", thumbSize);

  return url.toString();
};
