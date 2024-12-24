"use client";
// components/ui/PayPalButton.tsx
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PaymentOption {
  id?: number;
  amount?: number;
  month?: number;
  goldCoin?: number;
  character?: number;
}

interface PayPalButtonProps {
  productType: "vip" | "svip" | "goldCoin" | "translate";
  selectedOption: PaymentOption;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export const PayPalButton = ({
  productType,
  selectedOption,
  onSuccess,
  onError,
  onCancel,
}: PayPalButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // tRPC mutations
  const initializePayment = api.payment.initializePayment.useMutation();
  const completePayment = api.payment.completePayment.useMutation();

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
    currency: "USD",
    intent: "capture",
    // components: "buttons",
    // fundingSource: FUNDING.PAYPAL
  };

  const getProductDetails = () => {
    switch (productType) {
      case "vip":
      case "svip":
        return {
          vipLevel: productType === "vip" ? 1 : 2,
          month: selectedOption.month,
        };
      case "goldCoin":
        return {
          goldCoin: selectedOption.goldCoin,
        };
      case "translate":
        return {
          character: selectedOption.character,
        };
      default:
        return {};
    }
  };

  const handlePayPalError = (error: any) => {
    console.error("PayPal error:", error);
    setIsProcessing(false);
    toast({
      title: "支付失败",
      description: error.message || "处理支付时发生错误，请重试",
      variant: "destructive",
    });
    onError?.(error);
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="relative">
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}

        <PayPalButtons
          disabled={isProcessing}
          forceReRender={[selectedOption.amount]}
          style={{
            layout: "vertical",
            shape: "rect",
            label: "pay",
          }}
          createOrder={async (data, actions) => {
            try {
              setIsProcessing(true);

              // 创建本地订单
              const { orderNo } = await initializePayment.mutateAsync({
                amount: selectedOption?.amount?.toString() || "0",
                productType,
                productDetails: getProductDetails(),
              });

              // 创建PayPal订单
              return actions.order.create({
                intent: "CAPTURE", // 添加 intent 属性
                purchase_units: [
                  {
                    amount: {
                      value: selectedOption?.amount?.toString() || "0",
                      currency_code: "USD",
                    },
                    custom_id: orderNo, // 存储本地订单号
                  },
                ],
                application_context: {
                  shipping_preference: "NO_SHIPPING",
                },
              });
            } catch (error) {
              handlePayPalError(error);
              throw error;
            } finally {
              setIsProcessing(false);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              setIsProcessing(true);

              // 捕获支付
              const order = await actions.order?.capture();
              if (!order || !order.id) {
                throw new Error("捕获支付失败，未获取到订单信息");
              }
              const orderNo = (order?.purchase_units?.[0] as any)?.custom_id;
              // 完成支付并充值
              await completePayment.mutateAsync({
                orderNo,
                paypalOrderId: order.id,
                productType,
                expectedAmount: Number(selectedOption.amount),
              });

              toast({
                title: "支付成功",
                description: "您的购买已完成",
              });

              onSuccess?.();
            } catch (error) {
              handlePayPalError(error);
            } finally {
              setIsProcessing(false);
            }
          }}
          onError={(error) => {
            handlePayPalError(error);
          }}
          onCancel={() => {
            setIsProcessing(false);
            toast({
              title: "支付已取消",
              description: "您取消了本次支付",
            });
            onCancel?.();
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
};
