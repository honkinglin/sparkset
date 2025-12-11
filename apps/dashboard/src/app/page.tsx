import DatasourceManager from '../components/datasource/manager';
import { PageHeader } from '../components/page-header';
import { fetchDatasources } from '../lib/api';

const Page = async () => {
  const datasources = await fetchDatasources().catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader title="数据源管理" description="管理数据库连接，同步表结构信息" />

      <DatasourceManager initial={datasources} />
    </div>
  );
};

export default Page;
