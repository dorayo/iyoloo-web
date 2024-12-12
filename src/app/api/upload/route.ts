// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { env } from "~/env";

// 定义上传类型
type UploadType = 'avatar' | 'album';

// 不同类型的配置
const typeConfig = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    path: 'avatars'
  },
  album: {
    maxSize: 10 * 1024 * 1024, // 10MB
    path: 'albums'
  }
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = (formData.get('type') as UploadType) || 'avatar'; // 默认为avatar
    
    const config = typeConfig[type];
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed' }, { status: 400 });
    }

    // 验证文件大小
    if (file.size > config.maxSize) {
      return NextResponse.json({ 
        error: `File size exceeds ${config.maxSize / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // 生成OSS参数
    const date = new Date().toUTCString();
    const fileExt = file.name.split('.').pop();
    const ossPath = `${config.path}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const contentType = file.type;
    const buffer = Buffer.from(await file.arrayBuffer());

    // 生成签名
    const signature = crypto
      .createHmac('sha1', env.OSS_ACCESS_KEY_SECRET)
      .update(`PUT\n\n${contentType}\n${date}\n/${env.OSS_BUCKET}/${ossPath}`)
      .digest('base64');

    // 构建OSS URL
    const ossUrl = `https://${env.OSS_BUCKET}.${env.OSS_REGION}.aliyuncs.com/${ossPath}`;
    
    // 上传到OSS
    const response = await fetch(ossUrl, {
      method: 'PUT',
      headers: {
        'Date': date,
        'Content-Type': contentType,
        'Authorization': `OSS ${env.OSS_ACCESS_KEY_ID}:${signature}`,
      },
      body: buffer
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    return NextResponse.json({ 
      url: ossUrl,
      success: true 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed',
      success: false 
    }, { 
      status: 500 
    });
  }
}