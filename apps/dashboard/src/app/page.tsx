import { Button } from '../components/ui/button';

const mockTemplates = [
  { id: 1, name: '本周取消订单数', type: 'sql', updatedAt: '2025-12-01' },
  { id: 2, name: '活跃用户地区分布', type: 'sql', updatedAt: '2025-11-28' },
];

const mockSessions = [
  {
    id: 101,
    title: 'GMV 周报',
    lastMessage: '生成了跨库订单+用户查询',
    updatedAt: '2025-12-08',
  },
  {
    id: 102,
    title: '退款监控',
    lastMessage: '退款率超过 5%',
    updatedAt: '2025-12-07',
  },
];

const Page = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-300">Sparkline AI 运营助手</p>
          <h1 className="text-3xl font-semibold tracking-tight">查询工作台</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost">同步 Schema</Button>
          <Button>新建查询</Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">对话记录</p>
              <h2 className="text-xl font-semibold">最近会话</h2>
            </div>
            <Button variant="ghost" size="sm">
              查看全部
            </Button>
          </div>
          <div className="divide-y divide-white/5">
            {mockSessions.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.lastMessage}</p>
                </div>
                <span className="text-xs text-slate-400">{item.updatedAt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">模板</p>
              <h2 className="text-lg font-semibold">可复用查询</h2>
            </div>
            <Button variant="ghost" size="sm">
              查看全部
            </Button>
          </div>
          <div className="space-y-3">
            {mockTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-lg bg-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{tpl.name}</p>
                  <p className="text-xs text-slate-400 uppercase">{tpl.type}</p>
                </div>
                <span className="text-xs text-slate-400">更新 {tpl.updatedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">实时结果预览</p>
            <h2 className="text-xl font-semibold">示例数据</h2>
          </div>
          <Button size="sm" variant="ghost">
            下载 CSV
          </Button>
        </div>
        <div className="overflow-auto border border-white/10 rounded-xl">
          <table className="table w-full text-sm">
            <thead className="bg-white/5 text-left">
              <tr>
                <th className="px-4 py-2">用户</th>
                <th className="px-4 py-2">地区</th>
                <th className="px-4 py-2">订单数</th>
                <th className="px-4 py-2">退款率</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Alice', '杭州', '34', '2.1%'],
                ['Bob', '上海', '21', '1.5%'],
                ['Carol', '北京', '18', '3.2%'],
              ].map((row, idx) => (
                <tr key={idx} className="border-t border-white/10">
                  {row.map((cell, i) => (
                    <td key={i} className="px-4 py-3 text-slate-100/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Page;
