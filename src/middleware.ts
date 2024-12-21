import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 定义公开路由 - 包含营销页面和认证页面
const publicPaths = [
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/(marketing)(.*)", // marketing路由组
  "/(auth)(.*)",
  "/pricing(.*)",
  "/home(.*)",
];

const isPublicRoute = createRouteMatcher(publicPaths);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const { userId } = await auth();

  console.log("路由中转: ", userId, pathname);

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // // 2. 处理公共路由
  // if (isPublicRoute(request)) {
  //     return NextResponse.next()
  // }else{
  //   if(userId){
  //     if(pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')){
  //       return NextResponse.redirect(new URL('/homepage', request.url))
  //     }else{
  //       return NextResponse.next()
  //     }

  //   }else{
  //     return NextResponse.redirect(new URL('/sign-in', request.url))
  //   }
  // }

  // 确保auth状态在服务端和客户端一致
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
