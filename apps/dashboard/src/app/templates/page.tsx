import ActionTable from '../../components/action-table';
import { PageHeader } from '../../components/page-header';
import { fetchActions } from '../../lib/api';

const TemplatesPage = async () => {
  const actions = await fetchActions().catch(() => []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="可复用查询模板"
        description="模板来源于 /actions 接口，可在 CLI 或 API 创建，前端支持一键执行。"
      />
      <ActionTable actions={actions} />
    </div>
  );
};

export default TemplatesPage;
