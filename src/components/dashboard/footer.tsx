export default function Footer() {
  return (
    <footer className="mt-12 bg-[#1E1247] py-3.5">
      <div className="flex items-center justify-between px-[348px] text-white/85">
        <div className="space-x-2">
          <a
            href="https://file.iyoloo.net/agreement/iyoloo_about_zh_CN.htm"
            target="_blank"
          >
            关于我们
          </a>
          <span>|</span>
          <a
            href="https://file.iyoloo.net/agreement/iyoloo_security_zh_CN.htm"
            target="_blank"
          >
            交友安全
          </a>
          <span>|</span>
          <a
            href="https://file.iyoloo.net/agreement/iyoloo_use_zh_CN.htm"
            target="_blank"
          >
            隐私条款
          </a>
          <span>|</span>
          <a
            href="https://file.iyoloo.net/agreement/iyoloo_question_zh_CN.htm"
            target="_blank"
          >
            帮助中心
          </a>
        </div>
        <a href="https://beian.miit.gov.cn/" target="_blank">
          豫ICP备2022017547号
        </a>
      </div>
    </footer>
  );
}
