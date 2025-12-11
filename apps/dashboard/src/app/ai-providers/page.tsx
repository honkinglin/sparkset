import AIProviderManager from '../../components/ai-provider/manager';
import { PageHeader } from '../../components/page-header';
import { fetchAIProviders } from '../../lib/api';

const Page = async () => {
  const providers = await fetchAIProviders().catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Provider 配置"
        description="管理 AI SDK v6 支持的 Provider 配置，设置默认 Provider"
      />

      <AIProviderManager initial={providers} />
    </div>
  );
};

export default Page;
