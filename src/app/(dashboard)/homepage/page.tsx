"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImagePreviewProps {
  images: (string | null)[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps>  = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrevious,
  onNext,
}) => {
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft" && hasPrevious) {
        onPrevious();
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext, onClose]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[90vh] max-w-[90vw] border-none bg-black/90 p-0">
        <button
          onClick={() => onClose()}
          className="absolute right-4 top-4 flex items-center justify-center rounded-full p-2 text-white transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex h-full min-h-[80vh] w-full items-center justify-center">
          {/* Previous Button */}
          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="absolute left-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <img
            src={images[currentIndex] || ""}
            alt={`Preview ${currentIndex + 1}`}
            className="max-h-[80vh] max-w-[80vw] object-contain"
          />

          {/* Next Button */}
          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/90">
          {currentIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function PersonalCenter() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const initialUserId = userId ? parseInt(userId, 10) : 1;
  const { toast } = useToast();

  const [userInfo, setUserInfo] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [hobbyNames, setHobbyNames] = useState<string[]>([]);
  const [languageName, setLanguageName] = useState("");
  const [regionName, setRegionName] = useState("");

  const { data: regions } = api.system.getRegionList.useQuery({
    language: "zh-CN",
  });
  const { data: languages } = api.system.getLanguageList.useQuery();

  const { data: hobbies } = api.system.getHobbyList.useQuery({
    language: "zh-CN",
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { data: userData } = api.user.getUserInfo.useQuery({
    userId: initialUserId,
  });

  const { data: curUser } = api.user.getCurrentUser.useQuery();

  // 获取相册列表数据
  const utils = api.useContext();
  const { data: albumsData, isLoading: albumsLoading } =
    api.user.getUserAlbums.useQuery({
      userId: initialUserId,
      page: 1,
      pageSize: 50,
    });

  // 添加相册mutation
  const addAlbumMutation = api.user.addAlbum.useMutation({
    onSuccess: () => {
      // 刷新相册列表
      utils.user.getUserAlbums.invalidate({ userId: initialUserId });
    },
  });

  // console.log(555,albumsData)

  useEffect(() => {
    if (userData && hobbies && languages && regions) {
      setUserInfo(userData);

      // Extract hobby names
      const hobbyNames =
        userData?.userInfo?.interest?.split(",")?.map((id) => {
          return hobbies?.find((hobby) => hobby.id === parseInt(id, 10))?.hobby;
        }).filter(Boolean).map(String) || [];

      // console.log(3333,hobbyNames)
      setHobbyNames(hobbyNames);

      // Extract language name
      const languageName =
        languages?.find((language) => language.code === userData.language)
          ?.language || "";
      setLanguageName(languageName);

      // Extract region name
      const regionName = regions?.find((region) => {
        const regionId = userData?.region;
        if (regionId == null) return false; // 或者根据业务逻辑返回合适的默认值
        return region.id === parseInt(regionId, 10);
      })?.region || "";
      setRegionName(regionName);
    }
  }, [userData, hobbies]);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  // 上传相册
  const handleAlbumChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // 显示上传中状态
      toast({
        title: "上传中",
        description: "正在上传相册图片...",
      });

      // 文件验证
      if (!file.type.startsWith("image/")) {
        throw new Error("请选择图片文件");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("图片大小不能超过10MB");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "album");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "上传失败");
      }

      // 保存到数据库
      await addAlbumMutation.mutateAsync({
        url: data.url,
        top: false,
      });

      toast({
        title: "上传成功",
        description: "相册已更新",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "请重试",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // 清理 input 值，允许重复上传相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle album image click
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsPreviewOpen(true);
  };

  // Navigation handlers
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      Math.min((albumsData?.albums?.length || 1) - 1, prev + 1),
    );
  };

  const albumImages = albumsData?.albums?.map((album) => album.url) || [];

  return (
    <div className="flex flex-1 flex-col gap-5 min-w-0 w-full">
      {/* Back Navigation */}
      <div className="flex items-center">
        {/* <img src="/api/placeholder/9/15" alt="back" className="w-2.5 h-4" /> */}
        <button className="flex" onClick={handleBackClick}>
          <ChevronLeft color="white" />
          <span className="ml-1.5 text-white">返回</span>
        </button>
        <span className="ml-3.5 text-sm text-white">我的主页</span>
      </div>

      {/* User Detail Card */}
      <Card className="bg-[#D5D4EE] p-4">
        <div className="flex justify-between">
          <div className="flex">
            {/* Avatar and SVIP Badge */}
            <div className="relative">
              <div className="border-3 rounded-full border-yellow-400 p-0.5">
                <Avatar className="h-[126px] w-[126px]">
                  <AvatarImage
                    src={
                      userData?.avatar ||
                      "/images/606d18e1ed6ef79895bd45fd7d384401.png"
                    }
                    alt="avatar"
                    className="rounded-full"
                  />
                </Avatar>
              </div>
              {(userInfo?.userAccount?.vipLevel ?? 0 > 0) ? (
                <div className="absolute bottom-1 right-1 flex items-center rounded-full bg-yellow-400 px-2 py-0.5">
                  <img
                    src="/images/4834b47190c84fad10e766cb795e2f12.png"
                    alt="SVIP"
                    className="h-5"
                  />
                </div>
              ) : null}
            </div>

            {/* User Info */}
            <div className="ml-8 pt-2.5">
              <h3 className="text-2xl font-bold text-gray-800">
                {userData?.nickname}
              </h3>
              <div className="mt-2.5 flex items-center">
                <span className="text-xs text-gray-600">
                  ID：{userData?.account}
                </span>
                <img
                  src="/images/a59df0715ec3aa8ddd267014c5e4494f.png"
                  alt="location"
                  className="ml-2 w-1"
                />
                <span className="ml-2 text-xs text-gray-500">{regionName}</span>
                {/* <span className="ml-2 text-gray-500 text-xs">52km</span> */}
                <span className="ml-2 text-xs text-gray-500">
                  {languageName}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                个人介绍：{userData?.userInfo?.personalSign}
              </p>
              <div className="mt-6 flex gap-2.5">
                {hobbyNames?.map((hobby, index) => (
                    <div
                      key={index}
                      className="flex h-6 w-10 items-center justify-center rounded border border-indigo-600 bg-indigo-50/10 text-center"
                    >
                      <span className="text-xs text-gray-500">{hobby}</span>
                    </div>
                  ))}
                {/* <div className="w-10 h-6 rounded border border-indigo-600 bg-indigo-50/10"></div>
                    <div className="w-10 h-6 rounded border border-indigo-600 bg-indigo-50/10"></div> */}
              </div>
            </div>
          </div>

          {/* Action Button */}
          {/* <button className="h-8 px-4 bg-indigo-600 rounded text-white">
                关注
              </button> */}
        </div>

        {/* Progress Bar */}
        {/* <div className="mt-3 flex items-center px-4 py-2.5 bg-[#9997C5]/50 rounded-3xl">
              <img src="/images/e07e46fe3e904fbd188742b38a34d2d5.png" alt="time" className="rounded-full" />
              <span className="ml-6 text-gray-800 text-xs">12:00:00</span>
              <div className="mx-1.5 flex-1 flex items-center">
                <div className="w-full h-1.5 bg-white/50 rounded-3xl">
                  <div className="w-[60%] h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-3xl shadow-md"></div>
                </div>
              </div>
              <span className="ml-3 text-gray-800 text-xs">30:00:00</span>
            </div> */}
      </Card>

      {/* Albums Section */}
      <Card className="bg-[#D5D4EE] p-4">
        <h2 className="text-lg font-bold text-gray-800">我的相册</h2>
        <div className="mt-3.5 grid grid-cols-9 gap-4">
          {curUser?.id == initialUserId ? (
            <button
              onClick={handleSelectFile}
              disabled={isUploading}
              className="bg-[url('/images/4234da587983854c324caed5a86fabbb.png'))] relative h-[94px] w-[94px] rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-indigo-600"
            >
              {isUploading ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
                  <span className="text-sm text-gray-500">上传中...</span>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <Plus className="h-6 w-6 text-gray-400" />
                  <span className="mt-1 text-xs text-gray-500">添加照片</span>
                </div>
              )}
            </button>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAlbumChange}
          />
          {albumsData?.albums?.map((album, i) => (
              <div
                key={i}
                onClick={() => handleImageClick(i)}
                className="transform cursor-pointer transition-transform hover:scale-105"
              >
                <img
                  key={i}
                  src={album?.url || ""}
                  alt={`album-${i}`}
                  className="bg- h-[94px] w-[94px] rounded-lg object-contain"
                />
              </div>
            ))}
        </div>
      </Card>
      {/* Image Preview */}
      <ImagePreview
        images={albumImages}
        currentIndex={currentImageIndex}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPrevious={handlePreviousImage}
        onNext={handleNextImage}
      />
      {/* Posts Section */}
      {/* <Card className="bg-[#D5D4EE] p-4">
            <h2 className="text-lg font-bold text-gray-800">我的动态</h2>
            <div className="mt-5 flex gap-3">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="w-[308px] overflow-hidden">
                  <div className="relative h-[228px] bg-cover bg-center" 
                       style={{backgroundImage: `url('/images/f10b8d476e20086af56a34d207a0255d.png')`}}>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-lg border border-white">
                      <span className="text-xs text-white">1/3</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-gray-800">开心的一天开心的一天开心的一天</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">2024-11-25 12:00:00</span>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <img src="/images/2bd360381b025e714727744e242465a3.png" className="w-6 h-6" />
                          <span className="ml-1 text-xs text-gray-500">2</span>
                        </div>
                        <div className="flex items-center">
                          <img src="/images/145f434f45ccad3daded789b96be14f4.png" className="w-6 h-6" />
                          <span className="ml-1 text-xs text-gray-500">15</span>
                        </div>
                        <img src="/images/73f80b0a1a56c4a0dd82dc0ae83601b4.png" className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card> */}
    </div>
  );
}
