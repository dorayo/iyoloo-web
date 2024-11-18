import { Poppins, Noto_Sans_SC, Noto_Sans_JP } from 'next/font/google'

// 加载 Poppins 字体 (英文和拉丁语系)
export const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

// 加载中文字体
export const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sc',
  preload: true,
})

// 加载日文字体
export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-jp',
  preload: false, // 设为 false 可以优化初始加载时间
})