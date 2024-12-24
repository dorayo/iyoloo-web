// scripts/scan-i18n.ts
import fs from 'fs';
import path from 'path';
import {glob} from 'glob';
import chalk from 'chalk';
import { pinyin } from '@napi-rs/pinyin'
import translate from 'translate-google';

// 常用中英对照词典
const commonTranslations: Record<string, string> = {
  '提交': 'submit',
  '选择': 'select',
  '登录': 'login',
  '注册': 'register',
  '成功': 'success',
  '失败': 'fail',
  '离线': 'offline',
  '在线': 'online',
  '确认': 'confirm',
  '取消': 'cancel',
  '请': 'please',
  '错误': 'error',
  // 可以继续添加常用词对照
};

// 扩展翻译字典，包含键名和翻译
interface TranslationEntry {
  key: string;      // 生成的键名
  en: string;       // 英文翻译
}

const translationDict: Record<string, TranslationEntry> = {
  '返回': { key: 'back', en: 'Back' },
  '提交': { key: 'submit', en: 'Submit' },
  '选择': { key: 'select', en: 'Select' },
  '登录': { key: 'login', en: 'Login' },
  '注册': { key: 'register', en: 'Register' },
  '成功': { key: 'success', en: 'Success' },
  '失败': { key: 'fail', en: 'Failed' },
  '离线': { key: 'offline', en: 'Offline' },
  '在线': { key: 'online', en: 'Online' },
  '确认': { key: 'confirm', en: 'Confirm' },
  '取消': { key: 'cancel', en: 'Cancel' },
  '请': { key: 'please', en: 'Please' },
  '错误': { key: 'error', en: 'Error' },
  '开始': { key: 'start', en: 'Start' },
  '结束': { key: 'end', en: 'End' },
  '保存': { key: 'save', en: 'Save' },
  '删除': { key: 'delete', en: 'Delete' },
  '编辑': { key: 'edit', en: 'Edit' },
  '查看': { key: 'view', en: 'View' },
  // ... 添加更多翻译
};

interface I18nItem {
  key: string;
  zh: string;
  en?: string;
  files: string[];
}

interface ScanResult {
  items: I18nItem[];
  statistics: {
    totalFiles: number;
    totalStrings: number;
    filesWithChinese: string[];
  };
}

// 配置项
const config = {
  // 扫描的目录
  scanDirs: [
    './src/app',
    './src/components',
    './src/pages',
  ],
  // 扫描的文件类型
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  // 排除的目录
  excludeDirs: ['node_modules', '.next', 'dist', 'build'],
  // 排除的文件
  excludeFiles: [],
  // 已存在的翻译
  existingTranslations: './src/locales',
  // 输出目录
  outputDir: './i18n-scan',
};

// 匹配中文字符的正则表达式
const chineseRegex = /[\u4e00-\u9fa5]+/g;
// 匹配注释的正则表达式
const commentRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g;
// 匹配 JSX 属性中的中文

function generateKey(chinese: string, filePath: string): string {
  // 1. 获取基础前缀
  let prefix = '';
  if (filePath.includes('/components/')) {
    prefix = 'components';
  } else if (filePath.includes('/pages/')) {
    prefix = 'pages';
  } else {
    prefix = 'common';
  }

  // 2. 获取类别
  let category = '';
  if (chinese.length <= 4) {
    category = 'labels';
  } else if (chinese.includes('成功') || chinese.includes('失败') || chinese.includes('错误')) {
    category = 'messages';
  } else if (chinese.includes('请') || chinese.includes('必须')) {
    category = 'validation';
  } else {
    category = 'content';
  }

  // 3. 生成语义化key
  let key = generateSemanticKey(chinese);

  return `${prefix}.${category}.${key}`;
}



function generatePinyinKey(chinese: string): string {
  const pinyinResult = pinyin(chinese);
  return pinyinResult
    .join('')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+(\w)/g, (_, char) => char.toUpperCase());
}


function generateSemanticKey(chinese: string): string {
  // 1. 检查是否有直接对照的翻译
  for (const [cn, en] of Object.entries(commonTranslations)) {
    if (chinese.includes(cn)) {
      chinese = chinese.replace(cn, en);
    }
  }

  // 2. 对于没有对照的词，转换为拼音
  if (/[\u4e00-\u9fa5]/.test(chinese)) {
    // 使用新库的 pinyin 方法
    const pinyinResult = pinyin(chinese);
    chinese = pinyinResult.join('');
  }

  // 3. 规范化处理
  return chinese
    // 转为小写
    .toLowerCase()
    // 移除特殊字符
    .replace(/[^\w\s]/g, '')
    // 将空格转为驼峰命名
    .replace(/\s+(\w)/g, (_, char) => char.toUpperCase())
    // 限制长度
    .slice(0, 30);
}

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

// 添加异步翻译函数
async function translateToEnglish(text: string): Promise<string> {
  try {
    const result = await translate(text, { to: 'en' });
    return result.text;
  } catch (error) {
    console.error(`Translation failed for: ${text}`, error);
    return ''; // 翻译失败返回空字符串
  }
}

// 修改生成翻译的函数为异步
async function generateTranslations(chinese: string): Promise<{ key: string; en: string }> {
  // 1. 检查是否有直接对照的翻译
  for (const [cn, entry] of Object.entries(translationDict)) {
    if (chinese.includes(cn)) {
      return {
        key: entry.key,
        en: entry.en
      };
    }
  }

  // 2. 如果没有找到对应翻译，使用翻译API
  const key = generatePinyinKey(chinese);
  const translation = await translateToEnglish(chinese);
  
  return {
    key,
    en: translation
  };
}

async function scanFile(filePath: string): Promise<I18nItem[]> {
  const items: I18nItem[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 移除注释
  const contentWithoutComments = content.replace(commentRegex, '');
  
  // 匹配中文字符
  let match;
  while ((match = chineseRegex.exec(contentWithoutComments)) !== null) {
    const chinese = match[0];
    const key = generateKey(chinese, filePath); // 传入文件路径
    
    // 检查是否已存在该条目
    const existingItem = items.find(item => item.zh === chinese);
    if (existingItem) {
      if (!existingItem.files.includes(filePath)) {
        existingItem.files.push(filePath);
      }
    } else {
      items.push({
        key,
        zh: chinese,
        files: [filePath],
      });
    }
  }

  return items;
}

async function scanFiles(): Promise<ScanResult> {
  const result: ScanResult = {
    items: [],
    statistics: {
      totalFiles: 0,
      totalStrings: 0,
      filesWithChinese: [],
    },
  };

  // 获取所有需要扫描的文件
  const files = config.scanDirs.reduce((acc, dir) => {
    const pattern = `${dir}/**/*{${config.extensions.join(',')}}`;
    return [...acc, ...glob.sync(pattern, {
      ignore: config.excludeDirs.map(d => `**/${d}/**`),
    })];
  }, [] as string[]);

  result.statistics.totalFiles = files.length;

  // 扫描每个文件
  for (const file of files) {
    const normalizedPath = normalizePath(file);
    const items = await scanFile(normalizedPath);
    
    if (items.length > 0) {
      result.statistics.filesWithChinese.push(normalizedPath);
      result.statistics.totalStrings += items.length;
      result.items.push(...items);
    }
  }

  return result;
}

// 修改生成翻译文件的函数

// 修改主函数为异步
async function generateTranslationFiles(result: ScanResult): Promise<void> {
  const translations = {
    zh: {} as Record<string, any>,
    en: {} as Record<string, any>
  };

  // 使用 Promise.all 处理所有翻译
  await Promise.all(
    result.items.map(async (item) => {
      const { key, en } = await generateTranslations(item.zh);
      translations.zh[key] = item.zh;
      translations.en[key] = en;
    })
  );

  // 写入文件
  fs.writeFileSync(
    path.join(config.outputDir, 'zh.json'),
    JSON.stringify(translations.zh, null, 2),
    'utf-8'
  );

  fs.writeFileSync(
    path.join(config.outputDir, 'en.json'),
    JSON.stringify(translations.en, null, 2),
    'utf-8'
  );
}

async function main() {
  console.log(chalk.blue('开始扫描中文内容...'));
  
  const startTime = Date.now();
  const result = await scanFiles();
  const endTime = Date.now();

  console.log(chalk.green('\n扫描完成!'));
  console.log(chalk.yellow('\n统计信息:'));
  console.log(`总扫描文件数: ${chalk.cyan(result.statistics.totalFiles)}`);
  console.log(`包含中文的文件数: ${chalk.cyan(result.statistics.filesWithChinese.length)}`);
  console.log(`找到的中文字符串数: ${chalk.cyan(result.statistics.totalStrings)}`);
  console.log(`耗时: ${chalk.cyan(endTime - startTime)}ms`);

  generateTranslationFiles(result);

  console.log(chalk.green('\n生成的文件:'));
  console.log(chalk.cyan(`- ${config.outputDir}/zh.json`));
  console.log(chalk.cyan(`- ${config.outputDir}/en.json`));
  console.log(chalk.cyan(`- ${config.outputDir}/scan-report.json`));
}

main().catch(console.error);