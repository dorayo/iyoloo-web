"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { useToast } from "@/hooks/use-toast";

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();

  // Sync user mutation
  const syncUser = api.user.syncUser.useMutation({
    onSuccess: (data) => {
      // Get user info to check if registration is complete
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get user info query
  const { data: userData, refetch } = api.user.getCurrentUser.useQuery(
    undefined,
    {
      enabled: false, // Don't run automatically
    },
  );

  // Handle query success
  useEffect(() => {
    if (userData) {
      // Check if user has completed registration
      if (
        !userData.userInfo.gender ||
        !userData.language ||
        !userData.userInfo.birthday
      ) {
        router.push("/info"); // Redirect to info page if incomplete
      } else {
        router.push("/homepage?id=" + userData.id); // Redirect to dashboard if complete
      }
    }
  }, [userData, router]);

  useEffect(() => {
    if (!isAuthLoaded || !isUserLoaded) return;

    if (userId && user) {
      // Sync user data when logged in
      syncUser.mutate({
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        nickname: user.firstName + " " + user.lastName,
        avatarUrl: user.imageUrl,
      });
    }
  }, [isAuthLoaded, isUserLoaded, userId, user]);

  return (
    <div className="mb-60 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <div className="flex justify-center p-5">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
