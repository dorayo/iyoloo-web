// lib/easemob.ts

import axios from 'axios';
import { z } from 'zod';

interface TokenCache {
  token: string;
  expiresAt: number;
}

// Zod schema for user creation response
const userResponseSchema = z.object({
  action: z.string(),
  application: z.string(),
  path: z.string(),
  uri: z.string(),
  entities: z.array(
    z.object({
      uuid: z.string(),
      type: z.string(),
      created: z.number(),
      modified: z.number(),
      username: z.string(),
      activated: z.boolean(),
    })
  ),
  timestamp: z.number(),
  duration: z.number(),
  organization: z.string(),
  applicationName: z.string(),
});

let tokenCache: TokenCache | null = null;

// 环信配置参数 - 建议放在环境变量中
const EASEMOB_CONFIG = {
  ORG_NAME: '1130220622140887', // 从appKey解析
  APP_NAME: 'iyoloo',
  CLIENT_ID: process.env.EASEMOB_CLIENT_ID,     // 从环信后台获取
  CLIENT_SECRET: process.env.EASEMOB_CLIENT_SECRET, // 从环信后台获取
  BASE_URL: process.env.EASEMOB_API_URL
};

export async function getEasemobToken(): Promise<string> {
  try {
    // 检查缓存是否有效
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
      return tokenCache.token;
    }

    // 获取新token
    const response = await axios.post(
      `${EASEMOB_CONFIG.BASE_URL}/${EASEMOB_CONFIG.ORG_NAME}/${EASEMOB_CONFIG.APP_NAME}/token`,
      {
        grant_type: 'client_credentials',
        client_id: EASEMOB_CONFIG.CLIENT_ID,
        client_secret: EASEMOB_CONFIG.CLIENT_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.access_token) {
      throw new Error('Failed to get Easemob token');
    }

    // 缓存token，设置过期时间比实际提前5分钟
    const expiresIn = (response.data.expires_in || 7200) * 1000; // 转换为毫秒
    tokenCache = {
      token: response.data.access_token,
      expiresAt: Date.now() + expiresIn - 5 * 60 * 1000 // 提前5分钟过期
    };

    return tokenCache.token;

  } catch (error) {
    // 实现重试逻辑
    return await retryGetToken(error);
  }
}

// 重试逻辑
async function retryGetToken(error: any, retries = 3): Promise<string> {
  if (retries === 0) {
    console.error('Failed to get Easemob token after retries:', error);
    throw error;
  }

  // 指数退避策略
  const delay = Math.pow(2, 3 - retries) * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  try {
    tokenCache = null; // 清除可能失效的缓存
    return await getEasemobToken();
  } catch (retryError) {
    return retryGetToken(retryError, retries - 1);
  }
}

// 创建环信用户的函数可以这样使用token
export async function createEasemobUser(username: string, password: string) {
  const token = await getEasemobToken();
  
  const response = await axios.post(
    `${EASEMOB_CONFIG.BASE_URL}/${EASEMOB_CONFIG.ORG_NAME}/${EASEMOB_CONFIG.APP_NAME}/users`,
    {
      username,
      password
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (response.status !== 200) {
    throw new Error('Failed to create Easemob user');
  }

  const parsedResponse = userResponseSchema.parse(response.data);
  return parsedResponse;
}

// 可选：添加删除用户方法
export async function deleteEasemobUser(username: string) {
  const token = await getEasemobToken();
  
  await axios.delete(
    `${EASEMOB_CONFIG.BASE_URL}/${EASEMOB_CONFIG.ORG_NAME}/${EASEMOB_CONFIG.APP_NAME}/users/${username}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

}