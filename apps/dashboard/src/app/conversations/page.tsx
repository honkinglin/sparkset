import { MessageSquare } from 'lucide-react';
import { PageHeader } from '../../components/page-header';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Card, CardContent } from '../../components/ui/card';

const ConversationsPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="会话历史" description="查看和管理历史对话记录" />

      <Card>
        <CardContent className="pt-6">
          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertTitle>功能即将上线</AlertTitle>
            <AlertDescription>会话列表功能正在开发中，敬请期待。</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationsPage;
