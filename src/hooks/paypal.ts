// utils/paypal.ts
import { env } from "~/env"; // 环境变量

interface PayPalVerificationResult {
  verified: boolean;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  payerId?: string;
  payerEmail?: string;
  error?: string;
}

/**
 * 获取PayPal访问令牌
 */
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * 验证PayPal支付
 * @param orderId PayPal订单ID
 * @param expectedAmount 预期支付金额
 * @param currency 货币类型，默认USD
 */
export async function verifyPayPalPayment(
  orderId: string,
  expectedAmount?: number,
  currency = "USD",
): Promise<PayPalVerificationResult> {
  try {
    const accessToken = await getPayPalAccessToken();

    // 获取订单详情
    const response = await fetch(
      `${env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch PayPal order: ${response.statusText}`);
    }

    const order = await response.json();

    // 基础验证
    if (!order?.id || !order.status) {
      return {
        verified: false,
        orderId,
        status: "INVALID",
        amount: 0,
        currency,
        error: "Invalid order data",
      };
    }

    // 验证支付状态
    if (order.status !== "COMPLETED") {
      return {
        verified: false,
        orderId,
        status: order.status,
        amount: 0,
        currency,
        error: `Invalid order status: ${order.status}`,
      };
    }

    // 获取支付单元和金额信息
    const purchaseUnit = order.purchase_units[0];
    if (!purchaseUnit?.payments?.captures?.[0]) {
      return {
        verified: false,
        orderId,
        status: order.status,
        amount: 0,
        currency,
        error: "Missing payment information",
      };
    }

    const payment = purchaseUnit.payments.captures[0];
    const actualAmount = parseFloat(payment.amount.value);
    const actualCurrency = payment.amount.currency_code;

    // 验证金额（如果提供了预期金额）
    if (
      expectedAmount !== undefined &&
      Math.abs(actualAmount - expectedAmount) > 0.01
    ) {
      return {
        verified: false,
        orderId,
        status: order.status,
        amount: actualAmount,
        currency: actualCurrency,
        error: `Amount mismatch: expected ${expectedAmount} but got ${actualAmount}`,
      };
    }

    // 验证货币类型
    if (actualCurrency !== currency) {
      return {
        verified: false,
        orderId,
        status: order.status,
        amount: actualAmount,
        currency: actualCurrency,
        error: `Currency mismatch: expected ${currency} but got ${actualCurrency}`,
      };
    }

    // 验证支付状态
    if (payment.status !== "COMPLETED") {
      return {
        verified: false,
        orderId,
        status: payment.status,
        amount: actualAmount,
        currency: actualCurrency,
        error: `Payment not completed: ${payment.status}`,
      };
    }

    // 获取付款人信息（如果有）
    const payer = order.payer || {};

    // 验证成功
    return {
      verified: true,
      orderId,
      status: order.status,
      amount: actualAmount,
      currency: actualCurrency,
      payerId: payer.payer_id,
      payerEmail: payer.email_address,
    };
  } catch (error) {
    return {
      verified: false,
      orderId,
      status: "ERROR",
      amount: 0,
      currency,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
