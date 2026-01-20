'use client';

import { PET_SPECIES, PET_GENDERS, PET_SIZES, PROVINCES, CITIES } from '@/lib/constants';

interface PetFiltersProps {
    filters: {
        species: string;
        gender: string;
        size: string;
        province: string;
        city: string;
    };
    onFilterChange: (key: string, value: string) => void;
    onClear: () => void;
}

export function PetFilters({ filters, onFilterChange, onClear }: PetFiltersProps) {
    const cities = filters.province ? CITIES[filters.province] || [] : [];

    const hasFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    筛选
                </h3>
                {hasFilters && (
                    <button
                        onClick={onClear}
                        className="text-sm text-[var(--color-primary)] hover:underline"
                    >
                        清除筛选
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {/* Species */}
                <div>
                    <label className="block text-sm font-medium mb-2">种类</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onFilterChange('species', '')}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.species === ''
                                    ? 'bg-[var(--color-primary)] text-white'
                                    : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                }`}
                        >
                            全部
                        </button>
                        {PET_SPECIES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => onFilterChange('species', s.value)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.species === s.value
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium mb-2">性别</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onFilterChange('gender', '')}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.gender === ''
                                    ? 'bg-[var(--color-secondary)] text-white'
                                    : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                }`}
                        >
                            全部
                        </button>
                        {PET_GENDERS.map((g) => (
                            <button
                                key={g.value}
                                onClick={() => onFilterChange('gender', g.value)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.gender === g.value
                                        ? 'bg-[var(--color-secondary)] text-white'
                                        : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                    }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size */}
                <div>
                    <label className="block text-sm font-medium mb-2">体型</label>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onFilterChange('size', '')}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.size === ''
                                    ? 'bg-[var(--color-accent)] text-gray-800'
                                    : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                }`}
                        >
                            全部
                        </button>
                        {PET_SIZES.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => onFilterChange('size', s.value)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${filters.size === s.value
                                        ? 'bg-[var(--color-accent)] text-gray-800'
                                        : 'bg-[var(--color-muted)] hover:bg-[var(--color-border)]'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Province */}
                <div>
                    <label className="block text-sm font-medium mb-2">省份</label>
                    <select
                        value={filters.province}
                        onChange={(e) => {
                            onFilterChange('province', e.target.value);
                            onFilterChange('city', '');
                        }}
                        className="w-full px-4 py-2 bg-[var(--color-muted)] border-0 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                        <option value="">全部省份</option>
                        {PROVINCES.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                {/* City */}
                {filters.province && cities.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium mb-2">城市</label>
                        <select
                            value={filters.city}
                            onChange={(e) => onFilterChange('city', e.target.value)}
                            className="w-full px-4 py-2 bg-[var(--color-muted)] border-0 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary)]"
                        >
                            <option value="">全部城市</option>
                            {cities.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}
