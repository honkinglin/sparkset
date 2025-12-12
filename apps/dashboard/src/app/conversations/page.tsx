import { ConversationList } from '../../components/conversation/list';
import { PageHeader } from '../../components/page-header';
import { fetchConversations } from '../../lib/api';

const ConversationsPage = async () => {
  const conversations = await fetchConversations().catch(() => []);

  // 按创建时间倒序排列
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="会话历史" description="查看和管理历史对话记录" />
      <ConversationList conversations={sortedConversations} />
    </div>
  );
};

export default ConversationsPage;
