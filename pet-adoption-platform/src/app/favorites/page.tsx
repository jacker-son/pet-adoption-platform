'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PetCard } from '@/components/pets/PetCard';
import { LoadingPage } from '@/components/ui/Loading';
import { Pet } from '@/lib/types/database.types';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Pet[]>([]);
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
                .from('favorites')
                .select(`
          pet:pets (*)
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            const pets = (data || [])
                .map((f) => f.pet as unknown as Pet | null)
                .filter((p): p is Pet => p !== null);

            setFavorites(pets);
            setLoading(false);
        };

        fetchData();
    }, [router, supabase]);

    if (loading) return <LoadingPage />;

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">我的收藏 ❤️</h1>
                        <p className="text-[var(--color-text-muted)] mt-1">您收藏的宠物都在这里</p>
                    </div>
                    <Link href="/pets" className="btn btn-outline">
                        浏览更多
                    </Link>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((pet) => (
                            <PetCard key={pet.id} pet={pet} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">💔</div>
                        <h3 className="text-xl font-semibold mb-2">还没有收藏宠物</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">浏览宠物列表，点击心形图标添加收藏</p>
                        <Link href="/pets" className="btn btn-primary">
                            去看看可爱的宠物
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
