'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { applicationSchema, ApplicationFormData } from '@/lib/utils/validation';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingPage, LoadingOverlay } from '@/components/ui/Loading';
import { PROVINCES, CITIES } from '@/lib/constants';
import { Pet } from '@/lib/types/database.types';
import { getSpeciesLabel, formatPetAge, formatLocation } from '@/lib/utils/format';

export default function AdoptPage() {
    const params = useParams();
    const petId = params.petId as string;
    const router = useRouter();
    const supabase = createClient();

    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
    });

    const selectedProvince = watch('applicant_province');
    const cities = selectedProvince ? CITIES[selectedProvince] || [] : [];

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUserId(user.id);

            const { data: petData } = await supabase
                .from('pets')
                .select('*')
                .eq('id', petId)
                .single();

            if (!petData || petData.status !== 'available') {
                router.push('/pets');
                return;
            }

            // Check if already applied
            const { data: existingApplication } = await supabase
                .from('adoption_applications')
                .select('id')
                .eq('pet_id', petId)
                .eq('applicant_id', user.id)
                .single();

            if (existingApplication) {
                router.push('/my-applications');
                return;
            }

            setPet(petData);
            setLoading(false);
        };

        fetchData();
    }, [petId, router, supabase]);

    const onSubmit = async (data: ApplicationFormData) => {
        if (!userId || !pet) return;

        setSubmitting(true);
        try {
            const { error } = await supabase.from('adoption_applications').insert({
                pet_id: pet.id,
                applicant_id: userId,
                publisher_id: pet.publisher_id,
                applicant_name: data.applicant_name,
                applicant_phone: data.applicant_phone,
                applicant_address: data.applicant_address,
                applicant_city: data.applicant_city || null,
                applicant_province: data.applicant_province || null,
                living_situation: data.living_situation || null,
                has_experience: data.has_experience || false,
                experience_details: data.experience_details || null,
                has_other_pets: data.has_other_pets || false,
                other_pets_details: data.other_pets_details || null,
                reason: data.reason,
                additional_info: data.additional_info || null,
                status: 'pending',
            });

            if (error) throw error;

            // Send notification message
            await supabase.from('messages').insert({
                sender_id: userId,
                recipient_id: pet.publisher_id,
                subject: `收到新的领养申请 - ${pet.name}`,
                content: `${data.applicant_name} 对您发布的宠物 ${pet.name} 提交了领养申请。`,
            });

            router.push('/my-applications');
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('提交失败，请重试');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingPage />;
    if (!pet) return null;

    return (
        <div className="min-h-screen py-8">
            {submitting && <LoadingOverlay />}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">📝</div>
                    <h1 className="text-3xl font-bold mb-2">领养申请</h1>
                    <p className="text-[var(--color-text-muted)]">
                        请认真填写以下信息，帮助我们了解您
                    </p>
                </div>

                {/* Pet Info Card */}
                <div className="bg-[var(--color-muted)] rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[var(--color-card)] flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden">
                        {pet.main_image_url ? (
                            <img src={pet.main_image_url} alt={pet.name} className="w-full h-full object-cover" />
                        ) : (
                            '🐾'
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{pet.name}</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            {getSpeciesLabel(pet.species)} · {formatPetAge(pet.age_years, pet.age_months)} · {formatLocation(pet.location_province, pet.location_city)}
                        </p>
                    </div>
                    <Link href={`/pets/${pet.id}`} className="text-[var(--color-primary)] text-sm hover:underline">
                        查看详情
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--color-card)] rounded-2xl p-6 md:p-8 border border-[var(--color-border)] space-y-6">
                    <h3 className="font-semibold text-lg border-b border-[var(--color-border)] pb-3">个人信息</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Input
                            label="您的姓名"
                            placeholder="请输入真实姓名"
                            required
                            error={errors.applicant_name?.message}
                            {...register('applicant_name')}
                        />
                        <Input
                            label="联系电话"
                            placeholder="请输入联系电话"
                            required
                            error={errors.applicant_phone?.message}
                            {...register('applicant_phone')}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Select
                            label="所在省份"
                            options={PROVINCES.map(p => ({ value: p, label: p }))}
                            placeholder="请选择"
                            {...register('applicant_province')}
                        />
                        <Select
                            label="所在城市"
                            options={cities.map(c => ({ value: c, label: c }))}
                            placeholder="请先选择省份"
                            disabled={!selectedProvince}
                            {...register('applicant_city')}
                        />
                    </div>

                    <Input
                        label="详细地址"
                        placeholder="请输入您的详细地址"
                        required
                        error={errors.applicant_address?.message}
                        {...register('applicant_address')}
                    />

                    <Textarea
                        label="居住情况"
                        placeholder="描述您的居住环境，如：自有房屋/租房、有无阳台/院子、楼层等"
                        rows={3}
                        {...register('living_situation')}
                    />

                    <div className="border-t border-[var(--color-border)] pt-6">
                        <h3 className="font-semibold text-lg mb-4">养宠经验</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="has_experience"
                                    className="w-5 h-5"
                                    {...register('has_experience')}
                                />
                                <label htmlFor="has_experience">我有养宠经验</label>
                            </div>

                            <Textarea
                                label=""
                                placeholder="请描述您的养宠经验（可选）"
                                rows={3}
                                {...register('experience_details')}
                            />

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="has_other_pets"
                                    className="w-5 h-5"
                                    {...register('has_other_pets')}
                                />
                                <label htmlFor="has_other_pets">家中有其他宠物</label>
                            </div>

                            <Textarea
                                label=""
                                placeholder="请描述家中其他宠物的情况（可选）"
                                rows={3}
                                {...register('other_pets_details')}
                            />
                        </div>
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-6">
                        <h3 className="font-semibold text-lg mb-4">领养理由</h3>

                        <Textarea
                            label="为什么想要领养这只宠物？"
                            placeholder="请详细说明您的领养理由..."
                            rows={4}
                            required
                            error={errors.reason?.message}
                            {...register('reason')}
                        />

                        <Textarea
                            label="补充信息"
                            placeholder="还有什么想补充的？（可选）"
                            rows={3}
                            className="mt-4"
                            {...register('additional_info')}
                        />
                    </div>

                    <div className="border-t border-[var(--color-border)] pt-6 flex gap-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1">
                            返回
                        </Button>
                        <Button type="submit" isLoading={submitting} className="flex-1">
                            提交申请
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
