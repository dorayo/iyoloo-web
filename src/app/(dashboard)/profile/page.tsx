
'use client'
import React, { useState,useEffect } from 'react';

import { ChevronLeft, Camera, ChevronDown, CalendarIcon  } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from '~/trpc/react'
import { useToast } from "@/hooks/use-toast"
// import { type OSSCredentials } from "~/type/oss";

export default function ProfileInfo() {

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 }, 
    (_, i) => (currentYear - i).toString()
  );
  const months = Array.from(
    { length: 12 }, 
    (_, i) => (i + 1).toString().padStart(2, '0')
  );
  const days = Array.from(
    { length: 31 }, 
    (_, i) => (i + 1).toString().padStart(2, '0')
  );

// State for form data
  const [formData, setFormData] = useState({
    nickname: '',
    gender: '',
    height: '',
    weight: '',
    occupation: '',
    region: '',
    language: '',
    personalSign: '',
    interest: '',
    avatar: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const { toast } = useToast();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  // const getOssCredentials = api.oss.getUploadCredentials.useMutation();

  // Fetch system data
  const { data: occupations } = api.system.getOccupationList.useQuery({
    language: 'zh-CN'
  });

  const { data: regions } = api.system.getRegionList.useQuery({
    language: 'zh-CN'
  });

  const { data: languages } = api.system.getLanguageList.useQuery();

  const { data: hobbies } = api.system.getHobbyList.useQuery({
    language: 'zh-CN'
  });

// Fetch current user data
  const { data: userData, isLoading } = api.user.getCurrentUser.useQuery();

  useEffect(() => {
    if (userData) {
      const birthday = userData.userInfo.birthday ? new Date(userData.userInfo.birthday) : new Date();

      setFormData({
        nickname: userData.nickname || '',
        gender: userData.userInfo.gender?.toString() || '',
        height: userData.userInfo.height?.toString() || '',
        weight: userData.userInfo.weight?.toString() || '',
        occupation: userData.userInfo.occupation || '',
        region: userData.region || '',
        language: userData.language || '',
        personalSign: userData.userInfo.personalSign || '',
        interest: userData.userInfo.interest || '',
        avatar: userData.avatar || '',
        birthYear: birthday.getFullYear().toString(),
        birthMonth: (birthday.getMonth() + 1).toString().padStart(2, '0'),
        birthDay: birthday.getDate().toString().padStart(2, '0'),
      });
      if (userData.userInfo.interest) {
        setSelectedHobbies(userData.userInfo.interest.split(','));
      }
    }
  }, [userData]);

// Update user mutation
  const updateUser = api.user.updateUserInfo.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file upload for avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(333,file)
    if (!file) return;
      // Create preview
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setAvatarPreview(reader.result as string);
      // };
      // reader.readAsDataURL(file);

      // TODO: Implement file upload API call
      // const formData = new FormData();
      // formData.append('avatar', file);
      // Upload logic here
      try {
        // 显示加载状态
        toast({
          title: "上传中",
          description: "正在处理头像上传...",
        });
    
        // 验证文件
        if (!file.type.startsWith('image/')) {
          throw new Error('请选择图片文件');
        }
    
        if (file.size > 5 * 1024 * 1024) { // 5MB限制
          throw new Error('图片大小不能超过5MB');
        }
    
        // 创建本地预览
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    
        // // 获取上传凭证
        // const credentials = await getOssCredentials.mutateAsync({
        //   fileName: file.name,
        //   fileType: file.type,
        // });
    
        // // 准备表单数据
        // const formData = new FormData();
        // formData.append('key', credentials.key);
        // formData.append('policy', credentials.policy);
        // formData.append('OSSAccessKeyId', credentials.accessKeyId);
        // formData.append('success_action_status', credentials.success_action_status);
        // formData.append('signature', credentials.signature);
        // formData.append('file', file);
    
        // // 上传到OSS
        // const uploadResponse = await fetch(credentials.ossHost, {
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     // 不设置 Content-Type，让浏览器自动设置带 boundary 的值
        //     'Origin': window.location.origin,
        //   },
        //   // 添加 credentials 设置
        //   credentials: 'omit', // 不发送 cookies
        //   mode: 'cors',  // 明确指定 CORS 模式
        // });
    
        // if (!uploadResponse.ok) {
        //   throw new Error('上传失败');
        // }
    
        // // 构建文件URL
        // const fileUrl = `${credentials.ossHost}/${credentials.key}`;

        // 方法二  // 创建FormData
        const formData = new FormData();
        formData.append('file', file);

        // 上传到我们的API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || '上传失败');
        }
    
        // 更新用户头像
        await updateUser.mutateAsync({
          avatar: data.url,
        });
    
        toast({
          title: "上传成功",
          description: "头像已更新",
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "上传失败",
          description: error instanceof Error ? error.message : "请重试",
          variant: "destructive",
        });
    
        setAvatarPreview('');
      }
    
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBirthdayChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        birthday: date
      }));
    }
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobby)) {
        return prev.filter(h => h !== hobby);
      } else {
        return [...prev, hobby];
      }
    });
  };

  const handleSave = () => {
     console.log(formData,selectedHobbies)
     const birthday = new Date(
      parseInt(formData.birthYear),
      parseInt(formData.birthMonth) - 1,
      parseInt(formData.birthDay)
    );
    updateUser.mutate({
      nickname: formData.nickname,
      birthday: birthday,
      gender: formData.gender ? parseInt(formData.gender) : undefined,
      height: formData.height ? parseFloat(formData.height) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      occupation: formData.occupation?.toString(),
      region: formData.region?.toString(),
      language: formData.language,
      personalSign: formData.personalSign,
      interest: selectedHobbies.join(','),
      avatar: avatarPreview || formData.avatar
    });
  };

  const handleBackClick = () => {
    window.history.back();
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }


  return (
    <div className="w-full min-h-screen">
      <div className="flex items-center gap-3 px-6 py-4">
        <button className="flex items-center" onClick={handleBackClick}>
          <ChevronLeft className="w-4 h-4 text-white" />
          <span className="text-white">返回</span>
        </button>
        <span className="text-white">个人信息</span>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <Card className="bg-purple-100 p-6">
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center justify-between">
              <Label className="text-gray-600">头像：</Label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={avatarPreview || formData.avatar || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="rounded-full w-16 h-16 object-cover"
                  />
                  <label htmlFor="avatar-upload">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute -bottom-2 -right-2 bg-white cursor-pointer"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>
                <span className="text-indigo-600">编辑头像</span>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Label className="text-gray-600 w-24">昵称：</Label>
                <Input 
                  className="max-w-xl bg-purple-50/30 border-gray-200" 
                  value={formData.nickname}
                  onChange={handleInputChange('nickname')}
                />
              </div>

              <div className="flex items-center">
                <Label className="text-gray-600 w-24">ID：</Label>
                <span className="text-gray-900">{userData?.account}</span>
              </div>

              <div className="flex items-center">
                <Label className="text-gray-600 w-24">邮箱：</Label>
                <span className="text-gray-900">{userData?.email}</span>
              </div>

              {/* Birthday Selection */}
              <div className="flex items-center">
                <Label className="text-gray-600 w-24">生日：</Label>
                <div className="flex gap-4">
                  <Select
                    value={formData.birthYear}
                    onValueChange={(value) => handleSelectChange('birthYear')(value)}
                  >
                    <SelectTrigger className="w-[120px] bg-purple-50/30">
                      <SelectValue placeholder="年" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.birthMonth}
                    onValueChange={(value) => handleSelectChange('birthMonth')(value)}
                  >
                    <SelectTrigger className="w-[100px] bg-purple-50/30">
                      <SelectValue placeholder="月" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.birthDay}
                    onValueChange={(value) => handleSelectChange('birthDay')(value)}
                  >
                    <SelectTrigger className="w-[100px] bg-purple-50/30">
                      <SelectValue placeholder="日" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center">
                <Label className="text-gray-600 w-24">性别：</Label>
                <span className="text-gray-900">{userData?.userInfo?.gender==1?'男':'女'}</span>

              </div>

               {/* Occupation Selection */}
               <div className="flex items-center">
                <Label className="text-gray-600 w-24">职业：</Label>
                <Select
                  value={formData.occupation}
                  onValueChange={handleSelectChange('occupation')}
                >
                  <SelectTrigger className="bg-purple-50/30">
                    <SelectValue placeholder="请选择职业" />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations?.map((occupation) => (
                      <SelectItem key={occupation.id} value={occupation.id.toString()}>
                        {occupation.occupation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region Selection */}
              <div className="flex items-center">
                <Label className="text-gray-600 w-24">地区：</Label>
                <Select
                  value={formData.region}
                  onValueChange={handleSelectChange('region')}
                >
                  <SelectTrigger className="bg-purple-50/30">
                    <SelectValue placeholder="请选择地区" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions?.map((region) => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Selection */}
              <div className="flex items-center">
                <Label className="text-gray-600 w-24">语言：</Label>
                <Select
                  value={formData.language}
                  onValueChange={handleSelectChange('language')}
                >
                  <SelectTrigger className="bg-purple-50/30">
                    <SelectValue placeholder="请选择语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages?.map((language) => (
                      <SelectItem key={language.id} value={language.code}>
                        {language.language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Physical Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Label className="text-gray-600 w-24">身高(CM)：</Label>
                  <Input 
                    className="bg-purple-50/30" 
                    value={formData.height}
                    onChange={handleInputChange('height')}
                  />
                </div>
                <div className="flex items-center">
                  <Label className="text-gray-600 w-24">体重(KG)：</Label>
                  <Input 
                    className="bg-purple-50/30" 
                    value={formData.weight}
                    onChange={handleInputChange('weight')}
                  />
                </div>
              </div>

              {/* Bio Section */}
              <div className="flex">
                <Label className="text-gray-600 w-24 pt-2">个人介绍：</Label>
                <Textarea 
                  className="min-h-[100px] bg-purple-50/30" 
                  value={formData.personalSign}
                  onChange={handleInputChange('personalSign')}
                />
              </div>

              <div className="flex">
                <Label className="text-gray-600 w-24 pt-2">兴趣爱好：</Label>
                <div className="flex-1 bg-purple-50/30 rounded-md p-4">
                  <div className="grid grid-cols-5 gap-2">
                    {hobbies?.map((hobby) => (
                      <button
                        key={hobby.id}
                        onClick={() => handleHobbyToggle(hobby.id.toString())}
                        className={`border rounded-md px-2 py-1 text-sm transition-colors ${
                          selectedHobbies.includes(hobby.id.toString())
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-300 hover:border-indigo-400'
                        }`}
                      >
                        {hobby.hobby}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button 
                  variant="outline" 
                  className="w-24 text-indigo-300"
                  onClick={handleBackClick}
                >
                  取消
                </Button>
                <Button 
                  className="w-24 bg-indigo-600"
                  onClick={handleSave}
                  disabled={updateUser.isLoading}
                >
                  {updateUser.isLoading ? "保存中..." : "保存"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}