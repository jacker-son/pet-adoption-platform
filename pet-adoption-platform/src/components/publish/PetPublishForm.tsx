'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { petSchema, PetFormData } from '@/lib/utils/validation';
import { PET_SPECIES, PET_GENDERS, PET_SIZES, PROVINCES, CITIES } from '@/lib/constants';
import { useState } from 'react';

interface PetPublishFormProps {
    onSubmit: (data: PetFormData, images: File[]) => Promise<void>;
    initialData?: Partial<PetFormData>;
    isLoading?: boolean;
}

export function PetPublishForm({ onSubmit, initialData, isLoading }: PetPublishFormProps) {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PetFormData>({
        resolver: zodResolver(petSchema),
        defaultValues: initialData,
    });

    const selectedProvince = watch('location_province');
    const cities = selectedProvince ? CITIES[selectedProvince] || [] : [];

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + images.length > 8) {
            alert('最多上传8张图片');
            return;
        }

        setImages((prev) => [...prev, ...files]);

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const onFormSubmit = handleSubmit((data) => {
        onSubmit(data, images);
    });

    return (
        <form onSubmit={onFormSubmit} className="space-y-8">
            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium mb-2">宠物照片（最多8张）</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--color-muted)]">
                            <img src={preview} alt={`预览 ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600"
                            >
                                ×
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded-full">
                                    主图
                                </div>
                            )}
                        </div>
                    ))}

                    {previews.length < 8 && (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)] transition-colors">
                            <svg className="w-8 h-8 text-[var(--color-text-muted)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-sm text-[var(--color-text-muted)]">添加照片</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">第一张图片将作为主图展示</p>
            </div>

            {/* Basic Info */}
            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="宠物名字"
                    placeholder="给它起个名字吧"
                    required
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Select
                    label="种类"
                    options={PET_SPECIES.map(s => ({ value: s.value, label: s.label }))}
                    placeholder="请选择"
                    required
                    error={errors.species?.message}
                    {...register('species')}
                />

                <Input
                    label="品种"
                    placeholder="如：金毛寻回犬、英短蓝猫"
                    error={errors.breed?.message}
                    {...register('breed')}
                />

                <Input
                    label="颜色"
                    placeholder="如：金色、黑白花"
                    error={errors.color?.message}
                    {...register('color')}
                />
            </div>

            {/* Age & Gender & Size */}
            <div className="grid gap-6 md:grid-cols-4">
                <Input
                    label="年龄（岁）"
                    type="number"
                    min={0}
                    max={50}
                    placeholder="0"
                    error={errors.age_years?.message}
                    {...register('age_years', { valueAsNumber: true })}
                />

                <Input
                    label="月龄（月）"
                    type="number"
                    min={0}
                    max={11}
                    placeholder="0"
                    error={errors.age_months?.message}
                    {...register('age_months', { valueAsNumber: true })}
                />

                <Select
                    label="性别"
                    options={PET_GENDERS.map(g => ({ value: g.value, label: g.label }))}
                    placeholder="请选择"
                    error={errors.gender?.message}
                    {...register('gender')}
                />

                <Select
                    label="体型"
                    options={PET_SIZES.map(s => ({ value: s.value, label: s.label }))}
                    placeholder="请选择"
                    error={errors.size?.message}
                    {...register('size')}
                />
            </div>

            {/* Location */}
            <div className="grid gap-6 md:grid-cols-2">
                <Select
                    label="省份"
                    options={PROVINCES.map(p => ({ value: p, label: p }))}
                    placeholder="请选择省份"
                    error={errors.location_province?.message}
                    {...register('location_province')}
                />

                <Select
                    label="城市"
                    options={cities.map(c => ({ value: c, label: c }))}
                    placeholder="请先选择省份"
                    disabled={!selectedProvince}
                    error={errors.location_city?.message}
                    {...register('location_city')}
                />
            </div>

            {/* Health Info */}
            <div className="grid gap-6 md:grid-cols-2">
                <Input
                    label="健康状况"
                    placeholder="如：健康、需要定期检查"
                    error={errors.health_status?.message}
                    {...register('health_status')}
                />

                <Input
                    label="疫苗情况"
                    placeholder="如：已全部接种、待接种"
                    error={errors.vaccination_status?.message}
                    {...register('vaccination_status')}
                />
            </div>

            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    id="sterilized"
                    className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    {...register('sterilized')}
                />
                <label htmlFor="sterilized" className="text-sm font-medium">已绝育</label>
            </div>

            {/* Description */}
            <Textarea
                label="详细介绍"
                placeholder="介绍一下这只小可爱的性格、习惯、特点..."
                hint="越详细的介绍越能帮助找到合适的领养人"
                rows={5}
                error={errors.description?.message}
                {...register('description')}
            />

            {/* Adoption Requirements */}
            <Textarea
                label="领养要求"
                placeholder="您对领养人有什么要求？如：有养宠经验、家中无其他宠物等"
                rows={4}
                error={errors.adoption_requirements?.message}
                {...register('adoption_requirements')}
            />

            {/* Submit */}
            <div className="flex justify-end gap-4">
                <Button type="button" variant="ghost">
                    保存草稿
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    发布宠物
                </Button>
            </div>
        </form>
    );
}
