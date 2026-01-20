'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LoadingPage, LoadingOverlay } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { getApplicationStatusLabel, getApplicationStatusColor, formatDate, getSpeciesLabel, formatLocation } from '@/lib/utils/format';

interface ApplicationWithDetails {
    id: string;
    status: string;
    created_at: string;
    applicant_name: string;
    applicant_phone: string;
    applicant_address: string;
    applicant_city: string | null;
    applicant_province: string | null;
    living_situation: string | null;
    has_experience: boolean;
    experience_details: string | null;
    has_other_pets: boolean;
    other_pets_details: string | null;
    reason: string;
    additional_info: string | null;
    pet: {
        id: string;
        name: string;
        species: string;
        main_image_url: string | null;
    };
    applicant: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export default function ReceivedApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | null>(null);
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
          *,
          pet:pets (
            id,
            name,
            species,
            main_image_url
          ),
          applicant:users_profile!adoption_applications_applicant_id_fkey (
            id,
            full_name,
            avatar_url
          )
        `)
                .eq('publisher_id', user.id)
                .order('created_at', { ascending: false });

            setApplications((data || []) as unknown as ApplicationWithDetails[]);
            setLoading(false);
        };

        fetchData();
    }, [router, supabase]);

    const handleReview = async () => {
        if (!selectedApp || !reviewAction) return;

        setProcessing(true);
        try {
            // Update application status
            await supabase
                .from('adoption_applications')
                .update({
                    status: reviewAction,
                    reviewed_at: new Date().toISOString(),
                    review_notes: reviewNotes || null,
                })
                .eq('id', selectedApp.id);

            // If approved, update pet status to pending
            if (reviewAction === 'approved') {
                await supabase
                    .from('pets')
                    .update({ status: 'pending' })
                    .eq('id', selectedApp.pet.id);
            }

            // Send notification message
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('messages').insert({
                    sender_id: user.id,
                    recipient_id: selectedApp.applicant.id,
                    application_id: selectedApp.id,
                    subject: `领养申请${reviewAction === 'approved' ? '已通过' : '未通过'} - ${selectedApp.pet.name}`,
                    content: reviewAction === 'approved'
                        ? `恭喜！您对 ${selectedApp.pet.name} 的领养申请已通过审核。${reviewNotes ? `\n\n发布者留言：${reviewNotes}` : ''}`
                        : `很抱歉，您对 ${selectedApp.pet.name} 的领养申请未通过审核。${reviewNotes ? `\n\n原因：${reviewNotes}` : ''}`,
                });
            }

            // Update local state
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === selectedApp.id
                        ? { ...app, status: reviewAction }
                        : app
                )
            );

            setSelectedApp(null);
            setReviewNotes('');
            setReviewAction(null);
        } catch (error) {
            console.error('Error reviewing application:', error);
            alert('操作失败，请重试');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <LoadingPage />;

    const pendingApps = applications.filter((app) => app.status === 'pending');
    const reviewedApps = applications.filter((app) => app.status !== 'pending');

    return (
        <div className="min-h-screen py-8">
            {processing && <LoadingOverlay />}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">收到的申请</h1>
                        <p className="text-[var(--color-text-muted)] mt-1">审核他人对您发布宠物的领养申请</p>
                    </div>
                    <Link href="/my-pets" className="btn btn-outline">
                        我的宠物
                    </Link>
                </div>

                {applications.length > 0 ? (
                    <>
                        {/* Pending Applications */}
                        {pendingApps.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    ⏳ 待审核 <span className="text-sm font-normal text-[var(--color-text-muted)]">({pendingApps.length})</span>
                                </h2>
                                <div className="space-y-4">
                                    {pendingApps.map((app) => (
                                        <div
                                            key={app.id}
                                            className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]"
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-xl bg-[var(--color-muted)] overflow-hidden flex-shrink-0">
                                                    {app.pet.main_image_url ? (
                                                        <img src={app.pet.main_image_url} alt={app.pet.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{app.applicant_name}</span>
                                                        <span className="text-sm text-[var(--color-text-muted)]">想要领养</span>
                                                        <Link href={`/pets/${app.pet.id}`} className="font-semibold text-[var(--color-primary)] hover:underline">
                                                            {app.pet.name}
                                                        </Link>
                                                    </div>
                                                    <p className="text-sm text-[var(--color-text-muted)]">
                                                        {formatDate(app.created_at)} · {formatLocation(app.applicant_province, app.applicant_city)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 text-sm mb-4">
                                                <div>
                                                    <span className="text-[var(--color-text-muted)]">联系电话：</span>
                                                    {app.applicant_phone}
                                                </div>
                                                <div>
                                                    <span className="text-[var(--color-text-muted)]">地址：</span>
                                                    {app.applicant_address}
                                                </div>
                                                {app.living_situation && (
                                                    <div>
                                                        <span className="text-[var(--color-text-muted)]">居住情况：</span>
                                                        {app.living_situation}
                                                    </div>
                                                )}
                                                <div className="flex gap-4">
                                                    <span className={app.has_experience ? 'text-green-600' : 'text-[var(--color-text-muted)]'}>
                                                        {app.has_experience ? '✓ 有养宠经验' : '✗ 无养宠经验'}
                                                    </span>
                                                    <span className={app.has_other_pets ? 'text-blue-600' : 'text-[var(--color-text-muted)]'}>
                                                        {app.has_other_pets ? '✓ 有其他宠物' : '✗ 无其他宠物'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-[var(--color-muted)] rounded-xl p-4 mb-4">
                                                <div className="text-sm text-[var(--color-text-muted)] mb-1">领养理由</div>
                                                <p>{app.reason}</p>
                                            </div>

                                            <div className="flex gap-3">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => {
                                                        setSelectedApp(app);
                                                        setReviewAction('approved');
                                                    }}
                                                    className="flex-1"
                                                >
                                                    ✓ 通过
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        setSelectedApp(app);
                                                        setReviewAction('rejected');
                                                    }}
                                                    className="flex-1"
                                                >
                                                    ✗ 拒绝
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviewed Applications */}
                        {reviewedApps.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4">已审核</h2>
                                <div className="space-y-4">
                                    {reviewedApps.map((app) => (
                                        <div
                                            key={app.id}
                                            className="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)] flex items-center gap-4"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-[var(--color-muted)] overflow-hidden">
                                                {app.pet.main_image_url ? (
                                                    <img src={app.pet.main_image_url} alt={app.pet.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">🐾</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {app.applicant_name} → {app.pet.name}
                                                </p>
                                                <p className="text-sm text-[var(--color-text-muted)]">{formatDate(app.created_at)}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm ${getApplicationStatusColor(app.status)}`}>
                                                {getApplicationStatusLabel(app.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📥</div>
                        <h3 className="text-xl font-semibold mb-2">暂无收到申请</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">发布宠物后，领养申请将会显示在这里</p>
                        <Link href="/publish" className="btn btn-primary">
                            发布宠物
                        </Link>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <Modal
                isOpen={!!selectedApp && !!reviewAction}
                onClose={() => {
                    setSelectedApp(null);
                    setReviewAction(null);
                    setReviewNotes('');
                }}
                title={reviewAction === 'approved' ? '确认通过申请' : '确认拒绝申请'}
                size="md"
            >
                <div className="space-y-4">
                    <p>
                        {reviewAction === 'approved'
                            ? `确定通过 ${selectedApp?.applicant_name} 对 ${selectedApp?.pet.name} 的领养申请吗？`
                            : `确定拒绝 ${selectedApp?.applicant_name} 对 ${selectedApp?.pet.name} 的领养申请吗？`
                        }
                    </p>

                    <Textarea
                        label={reviewAction === 'approved' ? '备注信息（可选）' : '拒绝理由（可选）'}
                        placeholder={reviewAction === 'approved' ? '如：联系方式、接宠时间等' : '如：条件不符合等'}
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={3}
                    />

                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setSelectedApp(null);
                                setReviewAction(null);
                                setReviewNotes('');
                            }}
                            className="flex-1"
                        >
                            取消
                        </Button>
                        <Button
                            variant={reviewAction === 'approved' ? 'primary' : 'danger'}
                            onClick={handleReview}
                            isLoading={processing}
                            className="flex-1"
                        >
                            确认
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
