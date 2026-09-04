import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OwnerNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useApp();
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#166534]">{t('notif.badge')}</span>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('notif.title')}</h1>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 text-xs font-bold text-[#166534] hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('notif.markAllRead')}</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500">{t('notif.noNotifs')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer hover:border-slate-300 ${
                n.isRead ? 'bg-white border-slate-200/80 opacity-80' : 'bg-emerald-50/50 border-emerald-200 shadow-xs'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#166534] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      title="Delete notification"
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link to={n.link} className="inline-block text-xs font-bold text-[#166534] hover:underline pt-1">
                    {t('notif.openAction')}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
