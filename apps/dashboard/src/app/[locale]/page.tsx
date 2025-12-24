import DatasourceManager from '@/components/datasource/manager';
import { PageHeader } from '@/components/page-header';
import { fetchDatasources } from '@/lib/api';

interface Props {
  params: Promise<{ locale: string }>;
}

const Page = async ({ params }: Props) => {
  await params;

  const datasources = await fetchDatasources().catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="Datasource Management"
        descriptionKey="Manage database connections and sync schema"
      />

      <DatasourceManager initial={datasources} />
    </div>
  );
};

export default Page;
