import ActionManager from '../../components/action/manager';
import { PageHeader } from '../../components/page-header';
import { fetchActions } from '../../lib/api';

const Page = async () => {
  const actions = await fetchActions().catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Actions"
        description="管理可复用的 Action，支持 SQL、API 和文件操作等类型"
      />

      <ActionManager initial={actions} />
    </div>
  );
};

export default Page;
