'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Pet } from '@/lib/types/database.types';
import { PetCard } from '@/components/pets/PetCard';
import { PetFilters } from '@/components/pets/PetFilters';
import { PetSearch } from '@/components/pets/PetSearch';
import { LoadingPage } from '@/components/ui/Loading';

export default function PetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        species: '',
        gender: '',
        size: '',
        province: '',
        city: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const supabase = createClient();

    const fetchPets = useCallback(async () => {
        setLoading(true);
        let query = supabase
            .from('pets')
            .select('*')
            .eq('status', 'available')
            .order('created_at', { ascending: false });

        if (search) {
            query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%,description.ilike.%${search}%`);
        }
        if (filters.species) {
            query = query.eq('species', filters.species);
        }
        if (filters.gender) {
            query = query.eq('gender', filters.gender);
        }
        if (filters.size) {
            query = query.eq('size', filters.size);
        }
        if (filters.province) {
            query = query.eq('location_province', filters.province);
        }
        if (filters.city) {
            query = query.eq('location_city', filters.city);
        }

        const { data } = await query;
        setPets(data || []);
        setLoading(false);
    }, [supabase, search, filters]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            species: '',
            gender: '',
            size: '',
            province: '',
            city: '',
        });
        setSearch('');
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        找到你的 <span className="gradient-text">心动毛孩</span> 🐾
                    </h1>
                    <p className="text-[var(--color-text-muted)]">
                        在这里找到等待你的那个它
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-2xl mx-auto mb-8">
                    <PetSearch onSearch={setSearch} initialQuery={search} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        筛选条件
                        {Object.values(filters).some(v => v !== '') && (
                            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span>
                        )}
                    </button>

                    {/* Filters Sidebar */}
                    <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            <PetFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClear={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Pet Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <LoadingPage />
                        ) : pets.length > 0 ? (
                            <>
                                <p className="text-sm text-[var(--color-text-muted)] mb-4">
                                    找到 {pets.length} 只待领养宠物
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {pets.map((pet) => (
                                        <PetCard key={pet.id} pet={pet} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold mb-2">没有找到符合条件的宠物</h3>
                                <p className="text-[var(--color-text-muted)] mb-4">
                                    尝试调整筛选条件或清除搜索
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="btn btn-outline"
                                >
                                    清除所有筛选
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
