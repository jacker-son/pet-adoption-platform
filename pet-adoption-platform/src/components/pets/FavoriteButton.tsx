'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface FavoriteButtonProps {
    petId: string;
    size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({ petId, size = 'md' }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    useEffect(() => {
        const checkFavorite = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('pet_id', petId)
                    .single();
                setIsFavorite(!!data);
            }
        };
        checkFavorite();
    }, [petId, supabase]);

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        if (!userId) {
            // Redirect to login
            window.location.href = '/auth/login';
            return;
        }

        setIsLoading(true);

        try {
            if (isFavorite) {
                await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', userId)
                    .eq('pet_id', petId);
                setIsFavorite(false);
            } else {
                await supabase
                    .from('favorites')
                    .insert({ user_id: userId, pet_id: petId });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 ${isLoading ? 'opacity-50' : ''}`}
            aria-label={isFavorite ? '取消收藏' : '添加收藏'}
        >
            <svg
                className={`${iconSizes[size]} transition-all duration-300 ${isFavorite
                        ? 'text-red-500 fill-red-500 scale-110'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
        </button>
    );
}
