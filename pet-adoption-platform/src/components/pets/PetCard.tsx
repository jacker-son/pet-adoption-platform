'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Pet } from '@/lib/types/database.types';
import { formatPetAge, getSpeciesLabel, getGenderLabel, formatLocation, getStatusLabel, getStatusColor } from '@/lib/utils/format';
import { FavoriteButton } from './FavoriteButton';

interface PetCardProps {
    pet: Pet;
    showFavorite?: boolean;
}

export function PetCard({ pet, showFavorite = true }: PetCardProps) {
    const speciesEmoji: Record<string, string> = {
        dog: '🐕',
        cat: '🐈',
        bird: '🐦',
        rabbit: '🐰',
        other: '🐾',
    };

    return (
        <Link href={`/pets/${pet.id}`} className="block group">
            <div className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] card-hover">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted)]">
                    {pet.main_image_url ? (
                        <Image
                            src={pet.main_image_url}
                            alt={pet.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                            {speciesEmoji[pet.species] || '🐾'}
                        </div>
                    )}

                    {/* Status Badge */}
                    {pet.status !== 'available' && (
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pet.status || 'available')}`}>
                            {getStatusLabel(pet.status || 'available')}
                        </div>
                    )}

                    {/* Favorite Button */}
                    {showFavorite && (
                        <div className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
                            <FavoriteButton petId={pet.id} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate group-hover:text-[var(--color-primary)] transition-colors">
                            {pet.name}
                        </h3>
                        <span className="text-lg flex-shrink-0">{speciesEmoji[pet.species]}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded-full text-xs text-[var(--color-text-muted)]">
                            {getSpeciesLabel(pet.species)}
                        </span>
                        <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded-full text-xs text-[var(--color-text-muted)]">
                            {getGenderLabel(pet.gender)}
                        </span>
                        <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded-full text-xs text-[var(--color-text-muted)]">
                            {formatPetAge(pet.age_years, pet.age_months)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{formatLocation(pet.location_province, pet.location_city)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
