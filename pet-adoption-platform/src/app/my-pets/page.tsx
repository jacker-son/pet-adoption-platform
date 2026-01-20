'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LoadingPage, LoadingOverlay } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { getStatusLabel, getStatusColor, formatDate, getSpeciesLabel } from '@/lib/utils/format';
import { Pet } from '@/lib/types/database.types';

export default function MyPetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);
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
                .from('pets')
                .select('*')
                .eq('publisher_id', user.id)
                .order('created_at', { ascending: false });

            setPets(data || []);
            setLoading(false);
        };

        fetchData();
    }, [router, supabase]);

    const handleRemove = async (petId: string) => {
        if (!confirm('确定要下架这只宠物吗？')) return;

        setRemoving(petId);
        try {
            await supabase
                .from('pets')
                .update({ status: 'removed' })
                .eq('id', petId);

            setPets((prev) =>
                prev.map((pet) =>
                    pet.id === petId ? { ...pet, status: 'removed' } : pet
                )
            );
        } catch (error) {
            console.error('Error removing pet:', error);
            alert('操作失败，请重试');
        } finally {
            setRemoving(null);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <div className="min-h-screen py-8">
            {removing && <LoadingOverlay />}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">我的宠物</h1>
                        <p className="text-[var(--color-text-muted)] mt-1">管理您发布的待领养宠物</p>
                    </div>
                    <Link href="/publish" className="btn btn-primary">
                        发布新宠物
                    </Link>
                </div>

                {pets.length > 0 ? (
                    <div className="space-y-4">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className="bg-[var(--color-card)] rounded-2xl p-4 border border-[var(--color-border)] flex items-center gap-4"
                            >
                                <Link href={`/pets/${pet.id}`} className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-xl bg-[var(--color-muted)] overflow-hidden flex items-center justify-center text-3xl">
                                        {pet.main_image_url ? (
                                            <img src={pet.main_image_url} alt={pet.name} className="w-full h-full object-cover" />
                                        ) : (
                                            '🐾'
                                        )}
                                    </div>
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <Link href={`/pets/${pet.id}`} className="font-semibold text-lg hover:text-[var(--color-primary)]">
                                        {pet.name}
                                    </Link>
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        {getSpeciesLabel(pet.species)} · 发布于 {formatDate(pet.created_at!)}
                                    </p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(pet.status || 'available')}`}>
                                        {getStatusLabel(pet.status || 'available')}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                    <Link
                                        href={`/my-pets/${pet.id}/edit`}
                                        className="btn btn-ghost text-sm py-1.5"
                                    >
                                        编辑
                                    </Link>
                                    {pet.status === 'available' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemove(pet.id)}
                                            disabled={removing === pet.id}
                                        >
                                            下架
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🐕</div>
                        <h3 className="text-xl font-semibold mb-2">还没有发布宠物</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">发布您的第一只待领养宠物</p>
                        <Link href="/publish" className="btn btn-primary">
                            立即发布
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
