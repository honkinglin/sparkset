import { Onboarding } from '@/components/onboarding';
import { fetchAIProviders, fetchDatasources } from '@/lib/api';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const OnboardingPage = async ({ params }: PageProps) => {
  await params;

  const [datasources, aiProviders] = await Promise.all([
    fetchDatasources().catch(() => []),
    fetchAIProviders().catch(() => []),
  ]);

  return <Onboarding datasourceCount={datasources.length} aiProviderCount={aiProviders.length} />;
};

export default OnboardingPage;
