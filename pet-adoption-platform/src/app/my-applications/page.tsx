'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LoadingPage } from '@/components/ui/Loading';
import { getApplicationStatusLabel, getApplicationStatusColor, formatDate, getSpeciesLabel } from '@/lib/utils/format';

interface ApplicationWithPet {
    id: string;
    status: string;
    created_at: string;
    pet: {
        id: string;
        name: string;
        species: string;
        main_image_url: string | null;
    };
}

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationWithPet[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('');
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
                .from('adoption_applications')
                .select(`
          id,
          status,
          created_at,
          pet:pets (
            id,
            name,
            species,
            main_image_url
          )
        `)
                .eq('applicant_id', user.id)
                .order('created_at', { ascending: false });

            setApplications((data || []) as unknown as ApplicationWithPet[]);
            setLoading(false);
        };

        fetchData();
    }, [router, supabase]);

    const filteredApplications = filter
        ? applications.filter((app) => app.status === filter)
        : applications;

    if (loading) return <LoadingPage />;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">我的申请</h1>
                        <p className="text-[var(--color-text-muted)] mt-1">查看所有领养申请状态</p>
                    </div>
                    <Link href="/pets" className="btn btn-outline">
                        浏览宠物
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { value: '', label: '全部' },
                        { value: 'pending', label: '待审核' },
                        { value: 'approved', label: '已通过' },
                        { value: 'rejected', label: '已拒绝' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === tab.value
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Applications List */}
                {filteredApplications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => (
                            <div
                                key={app.id}
                                className="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)] flex items-center gap-4"
                            >
                                <Link href={`/pets/${app.pet.id}`} className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-xl bg-[var(--color-muted)] overflow-hidden flex items-center justify-center text-3xl">
                                        {app.pet.main_image_url ? (
                                            <img src={app.pet.main_image_url} alt={app.pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            '🐾'
                                        )}
                                    </div>
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <Link href={`/pets/${app.pet.id}`} className="font-semibold text-lg hover:text-[var(--color-primary)]">
                                        {app.pet.name}
                                    </Link>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {getSpeciesLabel(app.pet.species)} · 申请时间：{formatDate(app.created_at)}
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getApplicationStatusColor(app.status || 'pending')}`}>
                                        {getApplicationStatusLabel(app.status || 'pending')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-semibold mb-2">暂无申请记录</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">
                            {filter ? '没有符合筛选条件的申请' : '您还没有提交过领养申请'}
                        </p>
                        <Link href="/pets" className="btn btn-primary">
                            浏览宠物
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
