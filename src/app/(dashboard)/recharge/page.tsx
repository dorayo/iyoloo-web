'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, X } from "lucide-react";
import { useParams, useSearchParams } from 'next/navigation'

import { api } from "~/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"

import { PayPalButton } from "@/components/ui/PayPalButton";
import { set } from 'date-fns';

const PricingPage = () => {

  const { toast } = useToast()
  
  const params = useParams()
  const searchParams = useSearchParams()
  const type1 = searchParams.get('type')
  const initialType = type1 ? parseInt(type1, 10) : 1;

  const [type, setType] = useState<number>(initialType);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<number>(1); // 'vip' | 'svip | 'coins' | 'translate'
  const [selectedOption, setSelectedOption] = useState<PaymentOption | null>(null);
  const [showPaypal, setShowPaypal] = useState(false);

  const { data: accountInfo } = api.user.getUserAccount.useQuery();

  // 在PricingPage组件中:
  const { data: vipOptions } = api.goods.getVipOptions.useQuery({ 
    vipLevel: modalType // 获取VIP选项
  });

  const { data: goldCoinOptions } = api.goods.getGoldCoinOptions.useQuery();

  const { data: translateOptions } = api.goods.getTranslateOptions.useQuery();
  // console.log('33333',goldCoinOptions,translateOptions,vipOptions)

 const handleChangeType = (type: number) => {
    // console.log(type)
    setType(type);
    setSelectedOption(null); 
  }

  const handleChangeModal = (type: number) => {
    setShowModal(true);
    setModalType(type);
  }

  const handleBackClick = () => {
    window.history.back();
  }

  const handlePaymentSuccess = async () => {
    try {
      // 根据modalType选择不同的充值接口  
      toast.success("充值成功！");
      // 刷新用户账户信息
      // utils.user.getCurrentUser.invalidate();
      
    } catch (error) {
      toast.error("充值失败，请联系客服");
      console.error("Recharge error:", error);
    }
  };

  const handlePaymentError = (error: any) => {
    toast.error("Payment failed. Please try again.");
    console.error("Payment error:", error);
  };


  // 处理选项选择
  const handleOptionSelect = (option: PaymentOption) => {
    console.log('Selected option:', option); // 调试日志
    setSelectedOption(option);
    setShowPaypal(false);
  };



  return (
    <div className="w-full max-w-6xl bg-[rgb(45,27,105)] rounded-lg">
      {/* Navigation */}
      <div className="flex items-center gap-4  py-4">
        <button className="flex items-center gap-2 text-white hover:text-white/90 cursor-pointer" onClick={handleBackClick}>
          <ChevronLeft className="w-4 h-4" />
          <span>返回</span>
        </button>
        <span className="text-white">{type < 3?'升级会员':'金币/翻译包'}</span>
      </div>

      {/* Tabs */}
      <div className="px-6 bg-[rgb(213,212,238)] rounded">
        <div className="flex gap-8 relative">
          <div className="relative">
            <button className={`px-2 py-3 ${type < 3 ?'text-[rgb(79,70,229)]':'text-[rgb(153,150,196)]'} font-medium`} onClick={() => handleChangeType(1)}>
              升级会员
            </button>
            {type < 3 &&
            <div className="absolute bottom-0 left-1/2 w-12 h-1 bg-[rgb(79,70,229)] transform -translate-x-1/2"></div>
            }
          </div>
          <div className="relative">
            <button className={`px-2 py-3 ${type > 2?'text-[rgb(79,70,229)]':'text-[rgb(153,150,196)]'}`} onClick={() => handleChangeType(3)}>
              金币/翻译包
            </button>
            {type > 2  &&
            <div className="absolute bottom-0 left-1/2 w-12 h-1 bg-[rgb(79,70,229)] transform -translate-x-1/2"></div>
            }
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      {type < 3 &&
      <div className="flex gap-5 justify-center  py-8">
        {/* Free Tier */}
        <Card className="w-80 bg-[rgb(213,212,238)]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[rgb(51,51,51)]">免费版</CardTitle>
            <p className="text-sm text-[rgb(102,102,102)]">基础体验</p>
            <div className="mt-6">
              <span className="text-3xl font-bold text-[rgb(79,70,229)]">$0</span>
              <span className="text-sm text-[rgb(102,102,102)]">/人/月</span>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-6 bg-[rgb(139,92,246)]/50 hover:bg-[rgb(139,92,246)]/60">
              免费体验
            </Button>
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">免费发送动态</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">每日免费发送5条消息</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* VIP Tier */}
        <Card className="w-80 bg-[rgb(213,212,238)] relative">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-[rgb(51,51,51)]">VIP</CardTitle>
              <span className="px-2 py-1 bg-yellow-400 text-xs rounded-md">VIP</span>
            </div>
            <p className="text-sm text-[rgb(102,102,102)]">特权体验</p>
            {accountInfo?.vipExpiration == 1?
            <p className="text-sm text-[rgb(102,102,102)]">
              您的VIP将于 <span className="text-[rgb(79,70,229)] font-bold">{accountInfo?.vip_expiration}</span> 后到期
            </p>:null}
            <div className="mt-6">
              <span className="text-sm text-[rgb(102,102,102)]">最低</span>
              <span className="text-3xl font-bold text-[rgb(79,70,229)] ml-1">$12.5</span>
              <span className="text-sm text-[rgb(102,102,102)]">/人/月</span>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-6 bg-gradient-to-r from-[rgb(139,92,246)] to-[rgb(79,70,229)] hover:from-[rgb(139,92,246)]/90 hover:to-[rgb(79,70,229)]/90"
            onClick={() => handleChangeModal(1)}>
              立即购买
            </Button>
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">免费发送动态</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">可无限发送不翻译消息</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">每月200免费翻译字符</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">在朋友圈可以免费查看10张模糊图片</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">携带VIP会员标识</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SVIP Tier */}
        <Card className="w-80 bg-[rgb(213,212,238)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-[rgb(51,51,51)]">SVIP</CardTitle>
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-xs rounded-md">SVIP</span>
            </div>
            <p className="text-sm text-[rgb(102,102,102)]">尊贵体验</p>
            {accountInfo?.vipExpiration == 2?
            <p className="text-sm text-[rgb(102,102,102)]">
              您的SVIP将于 <span className="text-[rgb(79,70,229)] font-bold">{accountInfo?.vip_expiration}</span> 后到期
            </p>:null}
            <div className="mt-6">
              <span className="text-sm text-[rgb(102,102,102)]">最低</span>
              <span className="text-3xl font-bold text-[rgb(79,70,229)] ml-1">$199</span>
              <span className="text-sm text-[rgb(102,102,102)]">/人/月</span>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-6 bg-gradient-to-r from-[rgb(139,92,246)] to-[rgb(79,70,229)] hover:from-[rgb(139,92,246)]/90 hover:to-[rgb(79,70,229)]/90"
            onClick={() => handleChangeModal(2)}>
              立即购买
            </Button>
            <div className="space-y-4">
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">免费发送动态</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">免费发送消息</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">每月800免费翻译字符</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">可无限免费查看朋友圈的模糊图片</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">找到一直默默关心你的他/她</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">查看对方是否已读消息</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">每天免费5次AI智能匹配</p>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-[rgb(108,103,190)]" />
                <p className="text-sm text-[rgb(51,51,51)]">携带SVIP会员标识</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      }


       {/* Main Content */}
       {type > 2 && 
          <div className="flex gap-5  py-8">
            {/* Gold Coin Section */}
            <Card className="w-80  bg-[rgb(213,212,238)]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[rgb(51,51,51)]">金币</h2>
                <div className="text-[rgb(102,102,102)]">
                  当前可用金币{" "}
                  <span className="text-[rgb(79,70,229)] font-bold">{accountInfo?.goldCoin || 0}</span> 个
                </div>
                <div className="mt-6">
                  <span className="text-3xl font-bold text-[rgb(79,70,229)]">$0.99</span>
                  <span className="text-[rgb(102,102,102)] ml-2">/1金币</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6 bg-gradient-to-r from-[rgb(139,92,246)] to-[rgb(79,70,229)] hover:from-[rgb(139,92,246)]/90 hover:to-[rgb(79,70,229)]/90"
                  onClick={() => handleChangeModal(3)}>
                  立即购买
                </Button>
                <div className="h-px bg-[rgba(153,151,197,0.5)] mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">打招呼</span>
                    <span className="text-[rgb(51,51,51)]">用金币和新朋友打招呼</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">看照片</span>
                    <span className="text-[rgb(51,51,51)]">可以看朋友圈模糊图片</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">翻译文字</span>
                    <span className="text-[rgb(51,51,51)]">1金币翻译1字符</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">发语音</span>
                    <span className="text-[rgb(51,51,51)]">1金币发送一条语音</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Translation Package Section */}
            <Card className="w-80  bg-[rgb(213,212,238)]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[rgb(51,51,51)]">翻译包</h2>
                <div className="text-[rgb(102,102,102)]">
                  当前可用字符{" "}
                  <span className="text-[rgb(79,70,229)] font-bold">{accountInfo?.character || 0}</span> 个
                </div>
                <div className="mt-6">
                  <span className="text-3xl font-bold text-[rgb(79,70,229)]">$0.07</span>
                  <span className="text-[rgb(102,102,102)] ml-2">/1字符</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6 bg-gradient-to-r from-[rgb(139,92,246)] to-[rgb(79,70,229)] hover:from-[rgb(139,92,246)]/90 hover:to-[rgb(79,70,229)]/90"
                  onClick={() => handleChangeModal(4)}>
                  立即购买
                </Button>
                <div className="h-px bg-[rgba(153,151,197,0.5)] mb-6"></div>
                <div className="space-y-4">
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">翻译聊天</span>
                    <span className="text-[rgb(51,51,51)]">翻译聊天对话</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">语音转文字</span>
                    <span className="text-[rgb(51,51,51)]">语音转文字并且翻译</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-[rgb(108,103,190)] w-24">翻译朋友圈</span>
                    <span className="text-[rgb(51,51,51)]">翻译朋友圈文案</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        }

      {/* Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[rgb(213,212,238)] w-[619px] p-12 rounded-lg relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-center mb-6">充值规格</h2>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              {modalType < 3 ? (
                <>
                  {vipOptions?.map((option) => (
                    <div className={`p-4 border ${selectedOption?.id === option.id ? 'border-[rgb(79,70,229)] bg-[rgba(79,70,229,0.2)]' : 'border-gray-400'} rounded-lg flex justify-between items-center`} key={option.value}
                      onClick={() => handleOptionSelect(option)}>
                      <span>{option.month}个月{modalType==1?'VIP':'SVIP'}</span>
                      <span>${option.amount}</span>
                    </div>
                  ))}
                  
                </>
              ) : modalType === 3 ? (
                <>
                  {goldCoinOptions?.map((option) => (
                    <div key={option.id} className={`p-4 border ${selectedOption?.id === option.id ? 'border-[rgb(79,70,229)] bg-[rgba(79,70,229,0.2)]' : 'border-gray-400' } rounded-lg flex justify-between items-center`}
                      onClick={() => handleOptionSelect(option)}>
                      <span>{option.goldCoin}金币</span>
                      <span>${option.amount}</span>
                    </div>
                  ))}
                </>
              ) : <>
              {translateOptions?.map((option) => (
                <div key={option.id} className={`p-4 border ${selectedOption?.id === option.id  ? 'border-[rgb(79,70,229)] bg-[rgba(79,70,229,0.2)]' : 'border-gray-400'} rounded-lg flex justify-between items-center`}
                  onClick={() => handleOptionSelect(option)}>
                  <span>{option.character}翻译包</span>
                  <span>${option.amount}</span>
                </div>
              ))}
            </>}
            </div>

            {/* Payment Method */}
            <div className="mt-12 mb-10">
              <h3 className="text-xl font-bold text-center mb-6">支付方式</h3>
              {/* <div className="p-2 border border-[rgba(79,70,229,0.5)] bg-white/20 rounded flex justify-between items-center">
                <span>PayPal</span>
                <img src="/images/4b13141cf6c0be2300da62e073bfa4a3.png" alt="dropdown" />
              </div> */}
            </div>

            {/* Confirm Button */}
            {!showPaypal && <Button 
              className="w-full mt-12 bg-gradient-to-r from-[rgb(139,92,246)] to-[rgb(79,70,229)] py-4"
              onClick={() => setShowPaypal(true)}
            >
              确认充值
            </Button>}
            {selectedOption&&showPaypal?
            <PayPalButton
              productType={modalType == 1? 'vip' : modalType == 2? 'svip' : modalType == 3? 'goldCoin' : 'translate'}
              selectedOption={selectedOption}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />:null}
          </div>
        </div>
      )}


    </div>
  );
};

export default PricingPage;