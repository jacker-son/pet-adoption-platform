'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LoadingPage } from '@/components/ui/Loading';
import { formatRelativeTime } from '@/lib/utils/format';

interface MessageWithSender {
    id: string;
    subject: string | null;
    content: string;
    read: boolean;
    created_at: string;
    sender: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            const { data } = await supabase
                .from('messages')
                .select(`
          id,
          subject,
          content,
          read,
          created_at,
          sender:users_profile!messages_sender_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
                .eq('recipient_id', user.id)
                .order('created_at', { ascending: false });

            setMessages((data || []) as unknown as MessageWithSender[]);
            setLoading(false);
        };

        fetchData();
    }, [router, supabase]);

    const markAsRead = async (messageId: string) => {
        await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', messageId);

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === messageId ? { ...msg, read: true } : msg
            )
        );
    };

    if (loading) return <LoadingPage />;

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">消息通知 💬</h1>
                        {unreadCount > 0 && (
                            <p className="text-[var(--color-primary)] mt-1">{unreadCount} 条未读消息</p>
                        )}
                    </div>
                </div>

                {messages.length > 0 ? (
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => !msg.read && markAsRead(msg.id)}
                                className={`bg-[var(--color-card)] rounded-2xl p-4 border transition-all cursor-pointer ${msg.read
                                        ? 'border-[var(--color-border)]'
                                        : 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-medium flex-shrink-0">
                                        {msg.sender?.full_name?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium">{msg.sender?.full_name || '系统通知'}</span>
                                            <span className="text-sm text-[var(--color-text-muted)]">{formatRelativeTime(msg.created_at)}</span>
                                            {!msg.read && (
                                                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                                            )}
                                        </div>
                                        {msg.subject && (
                                            <h3 className="font-medium mb-1">{msg.subject}</h3>
                                        )}
                                        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold mb-2">暂无消息</h3>
                        <p className="text-[var(--color-text-muted)]">新的消息通知会显示在这里</p>
                    </div>
                )}
            </div>
        </div>
    );
}
