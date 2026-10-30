import LoginClient from "./LoginClient";

export const metadata = {
  robots: {index:false,follow:false},
  title: "访客使用 | 留学Hub 九万里AI",
  description: "浏览院校、比较专业，使用本机清单。",
};

export default function LoginPage() {
  return <LoginClient />;
}
