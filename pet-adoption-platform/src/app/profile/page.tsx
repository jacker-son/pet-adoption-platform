'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LoadingPage, LoadingOverlay } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormData } from '@/lib/utils/validation';
import { PROVINCES, CITIES } from '@/lib/constants';
import { UserProfile } from '@/lib/types/database.types';
import { formatDate } from '@/lib/utils/format';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    const selectedProvince = watch('province');
    const cities = selectedProvince ? CITIES[selectedProvince] || [] : [];

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            const { data } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                reset({
                    username: data.username || '',
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    city: data.city || '',
                    province: data.province || '',
                    bio: data.bio || '',
                });
            }
            setLoading(false);
        };

        fetchData();
    }, [router, supabase, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        if (!profile) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('users_profile')
                .update({
                    username: data.username || null,
                    full_name: data.full_name || null,
                    phone: data.phone || null,
                    address: data.address || null,
                    city: data.city || null,
                    province: data.province || null,
                    bio: data.bio || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (error) throw error;

            setProfile((prev) => prev ? { ...prev, ...data } : null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <LoadingPage />;
    if (!profile) return null;

    const roleLabels: Record<string, string> = {
        user: '普通用户',
        publisher: '宠物发布者',
        admin: '管理员',
    };

    return (
        <div className="min-h-screen py-8">
            {saving && <LoadingOverlay />}

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                        {profile.full_name?.[0] || profile.username?.[0] || 'U'}
                    </div>
                    <h1 className="text-2xl font-bold">{profile.full_name || profile.username || '未设置昵称'}</h1>
                    <p className="text-[var(--color-text-muted)]">
                        {roleLabels[profile.role || 'user']} · 注册于 {formatDate(profile.created_at!)}
                    </p>
                </div>

                <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]">
                    {isEditing ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <Input
                                    label="用户名"
                                    placeholder="设置一个唯一的用户名"
                                    error={errors.username?.message}
                                    {...register('username')}
                                />
                                <Input
                                    label="姓名"
                                    placeholder="您的真实姓名"
                                    error={errors.full_name?.message}
                                    {...register('full_name')}
                                />
                            </div>

                            <Input
                                label="手机号码"
                                placeholder="联系电话"
                                error={errors.phone?.message}
                                {...register('phone')}
                            />

                            <div className="grid gap-6 md:grid-cols-2">
                                <Select
                                    label="省份"
                                    options={PROVINCES.map(p => ({ value: p, label: p }))}
                                    placeholder="请选择"
                                    {...register('province')}
                                />
                                <Select
                                    label="城市"
                                    options={cities.map(c => ({ value: c, label: c }))}
                                    placeholder="请先选择省份"
                                    disabled={!selectedProvince}
                                    {...register('city')}
                                />
                            </div>

                            <Input
                                label="详细地址"
                                placeholder="您的详细地址"
                                error={errors.address?.message}
                                {...register('address')}
                            />

                            <Textarea
                                label="个人简介"
                                placeholder="介绍一下自己..."
                                rows={3}
                                error={errors.bio?.message}
                                {...register('bio')}
                            />

                            <div className="flex gap-4">
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">
                                    取消
                                </Button>
                                <Button type="submit" isLoading={saving} className="flex-1">
                                    保存
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
                                <h2 className="font-semibold text-lg">个人资料</h2>
                                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                    编辑
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <div>
                                    <span className="text-sm text-[var(--color-text-muted)]">用户名</span>
                                    <p>{profile.username || '未设置'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-[var(--color-text-muted)]">手机号码</span>
                                    <p>{profile.phone || '未设置'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-[var(--color-text-muted)]">地区</span>
                                    <p>{[profile.province, profile.city].filter(Boolean).join(' ') || '未设置'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-[var(--color-text-muted)]">详细地址</span>
                                    <p>{profile.address || '未设置'}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-[var(--color-text-muted)]">个人简介</span>
                                    <p>{profile.bio || '未设置'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <Link href="/my-pets" className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)] text-center hover:border-[var(--color-primary)] transition-colors">
                        <span className="text-2xl">🐕</span>
                        <p className="font-medium mt-1">我的宠物</p>
                    </Link>
                    <Link href="/my-applications" className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)] text-center hover:border-[var(--color-primary)] transition-colors">
                        <span className="text-2xl">📋</span>
                        <p className="font-medium mt-1">我的申请</p>
                    </Link>
                    <Link href="/favorites" className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)] text-center hover:border-[var(--color-primary)] transition-colors">
                        <span className="text-2xl">❤️</span>
                        <p className="font-medium mt-1">我的收藏</p>
                    </Link>
                    <Link href="/applications/received" className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-border)] text-center hover:border-[var(--color-primary)] transition-colors">
                        <span className="text-2xl">📥</span>
                        <p className="font-medium mt-1">收到的申请</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
