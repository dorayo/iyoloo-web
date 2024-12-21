"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useToast } from "@/hooks/use-toast";

export default function RegistrationForm() {
  const [gender, setGender] = useState("male");
  const [year, setYear] = useState("2000");
  const [month, setMonth] = useState("11");
  const [day, setDay] = useState("27");

  const router = useRouter();
  const { toast } = useToast();

  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate year options from 1910 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1910 + 1 }, (_, i) =>
    String(currentYear - i),
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const { data: languages } = api.system.getLanguageList.useQuery();

  const { data: user } = api.user.getCurrentUser.useQuery();

  // API mutation
  const updateUser = api.user.updateUserInfo.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "个人信息已更新",
      });
      router.push("/homepage?id=" + user?.id);
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form validation
  const validateForm = () => {
    if (!gender) {
      toast({
        title: "Error",
        description: "请选择性别",
        variant: "destructive",
      });
      return false;
    }
    if (!year || !month || !day) {
      toast({
        title: "Error",
        description: "请选择生日",
        variant: "destructive",
      });
      return false;
    }
    if (!language) {
      toast({
        title: "Error",
        description: "请选择语言",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    const birthDate = new Date(`${year}-${month}-${day}`);

    updateUser.mutate({
      gender: gender === "male" ? 1 : 0,
      birthday: birthDate,
      language: language,
    });
  };

  return (
    <Card className="mx-auto mb-8 w-[980px] bg-[#D5D4EE] p-8">
      <CardContent>
        <h2 className="mb-18 text-center text-3xl text-gray-800">个人信息</h2>

        {/* Gender Selection */}
        <RadioGroup
          defaultValue="male"
          className="grid grid-cols-2 gap-8 px-12"
          onValueChange={setGender}
        >
          <div className="relative">
            <RadioGroupItem value="male" id="male" className="peer sr-only" />
            <Label
              htmlFor="male"
              className="flex cursor-pointer flex-col items-center peer-data-[state=checked]:font-bold peer-data-[state=checked]:text-indigo-600"
            >
              <div
                className={`mb-6 h-28 w-28 rounded-full p-0.5 ${gender === "male" ? "bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5]" : "bg-gradient-to-r from-[#8B5CF6]/20 to-[#4F46E5]/20"}`}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <img
                    src="/images/fe1c2aa5745e5350e8bb0a3387441e4c.png"
                    className="h-full w-full rounded-full"
                  />
                </div>
              </div>
              {gender === "male" && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <img
                    src="/images/218fe72db9dffba53ccaa9302d38dfb2.png"
                    className="h-8 w-8"
                  />
                </div>
              )}
              <span className="text-base">我是男性</span>
            </Label>
          </div>

          <div className="relative">
            <RadioGroupItem
              value="female"
              id="female"
              className="peer sr-only"
            />
            <Label
              htmlFor="female"
              className="flex cursor-pointer flex-col items-center peer-data-[state=checked]:font-bold peer-data-[state=checked]:text-indigo-600"
            >
              <div
                className={`mb-6 h-28 w-28 rounded-full p-0.5 ${gender === "female" ? "bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5]" : "bg-gradient-to-r from-[#8B5CF6]/20 to-[#4F46E5]/20"}`}
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                  <img
                    src="/images/c9c8fb9960a27ad7dec36f7b91445081.png"
                    className="h-full w-full rounded-full"
                  />
                </div>
              </div>
              {gender === "female" && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <img
                    src="/images/218fe72db9dffba53ccaa9302d38dfb2.png"
                    className="h-8 w-8"
                  />
                </div>
              )}
              <span className="text-base">我是女性</span>
            </Label>
          </div>
        </RadioGroup>

        {/* Date Selection */}
        <div className="mt-8 flex gap-4">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="flex-1 border-gray-200 bg-[#9996C4]/30 text-center font-bold">
              <SelectValue placeholder="年" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="flex-1 border-gray-200 bg-[#9996C4]/30 text-center font-bold">
              <SelectValue placeholder="月" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="flex-1 border-gray-200 bg-[#9996C4]/30 text-center font-bold">
              <SelectValue placeholder="日" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Selection */}
        <div className="mt-11">
          <Select
            defaultValue="zh-CN"
            value={language}
            onValueChange={setLanguage}
          >
            <SelectTrigger className="w-full border-gray-200 bg-[#9996C4]/30 text-center font-bold">
              <SelectValue placeholder="选择语言" />
            </SelectTrigger>
            <SelectContent>
              {languages?.map((language) => (
                <SelectItem key={language.id} value={language.code!}>
                  {language.language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="mt-20 flex justify-center">
          <Button
            className="h-14 w-[375px] bg-gradient-to-r from-[#8B5CF6] to-[#4F46E5] text-xl font-bold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "提交中..." : "去寻找你的朋友吧"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
