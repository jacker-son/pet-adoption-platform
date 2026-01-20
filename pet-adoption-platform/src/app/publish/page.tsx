'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PetPublishForm } from '@/components/publish/PetPublishForm';
import { PetFormData } from '@/lib/utils/validation';
import { LoadingOverlay } from '@/components/ui/Loading';
import Link from 'next/link';

export default function PublishPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
            if (!user) {
                router.push('/auth/login');
            }
        };
        checkAuth();
    }, [supabase, router]);

    const handleSubmit = async (data: PetFormData, images: File[]) => {
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }

            let mainImageUrl = null;

            // Upload images
            const uploadedUrls: string[] = [];
            for (const image of images) {
                const fileName = `${user.id}/${Date.now()}-${image.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('pet-photos')
                    .upload(fileName, image);

                if (uploadError) {
                    console.error('Upload error:', uploadError);
                    continue;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('pet-photos')
                    .getPublicUrl(uploadData.path);

                uploadedUrls.push(publicUrl);
            }

            if (uploadedUrls.length > 0) {
                mainImageUrl = uploadedUrls[0];
            }

            // Create pet
            const { data: pet, error: petError } = await supabase
                .from('pets')
                .insert({
                    publisher_id: user.id,
                    name: data.name,
                    species: data.species,
                    breed: data.breed || null,
                    age_years: data.age_years || null,
                    age_months: data.age_months || null,
                    gender: data.gender || null,
                    size: data.size || null,
                    color: data.color || null,
                    description: data.description || null,
                    health_status: data.health_status || null,
                    vaccination_status: data.vaccination_status || null,
                    sterilized: data.sterilized || false,
                    location_city: data.location_city || null,
                    location_province: data.location_province || null,
                    adoption_requirements: data.adoption_requirements || null,
                    main_image_url: mainImageUrl,
                    status: 'available',
                })
                .select()
                .single();

            if (petError) {
                throw petError;
            }

            // Insert pet images
            if (uploadedUrls.length > 0 && pet) {
                const imageInserts = uploadedUrls.map((url, index) => ({
                    pet_id: pet.id,
                    image_url: url,
                    display_order: index,
                }));

                await supabase.from('pet_images').insert(imageInserts);
            }

            // Update user role to publisher
            await supabase
                .from('users_profile')
                .update({ role: 'publisher' })
                .eq('id', user.id);

            router.push(`/pets/${pet.id}`);
        } catch (error) {
            console.error('Error publishing pet:', error);
            alert('发布失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated === null) {
        return <LoadingOverlay />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen py-8">
            {isLoading && <LoadingOverlay />}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🐾</div>
                    <h1 className="text-3xl font-bold mb-2">发布待领养宠物</h1>
                    <p className="text-[var(--color-text-muted)]">
                        填写宠物信息，帮助它找到温暖的家
                    </p>
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl p-6 mb-8">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        💡 发布小贴士
                    </h3>
                    <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
                        <li>• 上传清晰的照片，越多越能吸引领养人</li>
                        <li>• 详细描述宠物的性格和习惯</li>
                        <li>• 如实填写健康状况和疫苗信息</li>
                        <li>• 明确提出您的领养要求</li>
                    </ul>
                </div>

                {/* Form */}
                <div className="bg-[var(--color-card)] rounded-2xl p-6 md:p-8 border border-[var(--color-border)]">
                    <PetPublishForm onSubmit={handleSubmit} isLoading={isLoading} />
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <Link href="/pets" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                        ← 返回宠物列表
                    </Link>
                </div>
            </div>
        </div>
    );
}
