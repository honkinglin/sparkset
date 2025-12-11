'use client';

export default function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return <div className="p-6 text-destructive">加载查询页面出错，请检查 API 服务。</div>;
}
