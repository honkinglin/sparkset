import ActionManager from '@/components/action/manager';
import { PageHeader } from '@/components/page-header';
import { fetchActions } from '@/lib/api';
import { getDictionary, hasLocale } from '@/i18n/dictionaries';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!hasLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }
  const dict = await getDictionary(locale);
  const t = (key: string) => dict[key] || key;

  const actions = await fetchActions().catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Actions')}
        description={t('Manage reusable actions, supporting SQL, API and file operations')}
      />

      <ActionManager initial={actions} />
    </div>
  );
};

export default Page;
