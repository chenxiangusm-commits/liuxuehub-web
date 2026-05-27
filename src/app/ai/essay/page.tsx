import EssayClient from './EssayClient';

export const metadata = {
  title: "AI Essay/小文书 - 留学Hub",
  description: "根据学校题目生成 Essay 成稿和思路",
};

export default function EssayPage() {
  return <EssayClient />;
}
