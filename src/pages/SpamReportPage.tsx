import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Header } from '../components/ui/Header';
import { cn } from '../lib/utils';

export const SpamReportPage = () => {
  const { xiiId } = useParams();
  const { xiis, updateXii, themeColor } = useStore();
  const navigate = useNavigate();
  const [spamReason, setSpamReason] = useState('');

  const xii = xiis.find(x => x.id === xiiId);

  if (!xii) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-tg-hint">Персонаж не найден</div>
      </div>
    );
  }

  const spamReasons = [
    'Навязчивое поведение',
    'Оскорбления',
    'Слишком много сообщений',
    'Не хочу общаться',
    'Другое'
  ];

  const submitSpamReport = () => {
    updateXii(xii.id, { isBanned: true, spamReason });
    navigate(`/settings/${xii.id}`);
  };

  return (
    <div className="flex-1 bg-transparent flex flex-col h-full overflow-y-auto relative">
      <Header title="Жалоба на спам" showBack onBack={() => navigate(`/settings/${xii.id}`)} />
      
      <div className="p-6 space-y-8 max-w-2xl mx-auto w-full pb-32 md:pb-20">
        <GlassCard>
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Жалоба на спам</h2>
            <p className="text-sm text-tg-hint">
              Пожалуйста, укажите причину, по которой вы хотите отключить этого xiis. 
              Это поможет нам улучшить алгоритмы.
            </p>
          </div>
        </GlassCard>

        <GlassCard title="Выберите причину">
          <div className="space-y-3">
            {spamReasons.map(reason => (
              <div 
                key={reason}
                onClick={() => setSpamReason(reason)}
                className={cn(
                  "p-4 rounded-2xl cursor-pointer border-2 transition-all glass-effect",
                  spamReason === reason 
                    ? "border-tg-light-blue bg-tg-light-blue/20 text-tg-light-blue" 
                    : "border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                )}
                style={{
                  borderColor: spamReason === reason ? themeColor : undefined,
                  color: spamReason === reason ? themeColor : undefined,
                  backgroundColor: spamReason === reason ? `${themeColor}20` : undefined
                }}
              >
                <span className="text-sm font-medium">{reason}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="flex gap-4">
          <Button 
            variant="secondary"
            onClick={() => navigate(`/settings/${xii.id}`)}
            className="flex-1 py-4 rounded-2xl font-bold"
          >
            Отмена
          </Button>
          <Button 
            onClick={submitSpamReport}
            disabled={!spamReason}
            className="flex-1 py-4 text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
            style={{ 
              backgroundColor: spamReason ? '#ef4444' : undefined,
              boxShadow: spamReason ? '0 10px 15px -3px rgba(239, 68, 68, 0.3)' : undefined
            }}
          >
            Заблокировать
          </Button>
        </div>
      </div>
    </div>
  );
};
