// types/oss.ts
export interface OSSCredentials {
  accessKeyId: string;
  policy: string;
  signature: string;
  key: string;
  ossHost: string;
  success_action_status: string;
}