import ResumeBuilderClient from './ResumeBuilderClient';

export const metadata = {
  title: "AI留学申请简历 - 留学Hub",
  description: "填写信息或上传基础简历，生成适合海外院校申请的英文CV",
};

export default function ResumePage() {
  return <ResumeBuilderClient />;
}
