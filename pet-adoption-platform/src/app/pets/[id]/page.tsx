import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PetImageCarousel } from '@/components/pets/PetImageCarousel';
import { FavoriteButton } from '@/components/pets/FavoriteButton';
import { formatPetAge, getSpeciesLabel, getGenderLabel, getSizeLabel, formatLocation, getStatusLabel, getStatusColor, formatDate } from '@/lib/utils/format';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PetDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch pet with images
    const { data: pet, error } = await supabase
        .from('pets')
        .select(`
      *,
      pet_images (*),
      users_profile!pets_publisher_id_fkey (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
        .eq('id', id)
        .single();

    if (error || !pet) {
        notFound();
    }

    const publisher = pet.users_profile as { id: string; username: string | null; full_name: string | null; avatar_url: string | null };
    const images = (pet.pet_images || []).sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order);

    const speciesEmoji: Record<string, string> = {
        dog: '🐕',
        cat: '🐈',
        bird: '🐦',
        rabbit: '🐰',
        other: '🐾',
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
                    <Link href="/" className="hover:text-[var(--color-primary)]">首页</Link>
                    <span>/</span>
                    <Link href="/pets" className="hover:text-[var(--color-primary)]">宠物列表</Link>
                    <span>/</span>
                    <span className="text-[var(--color-foreground)]">{pet.name}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Images */}
                    <div>
                        <PetImageCarousel
                            images={images}
                            mainImage={pet.main_image_url}
                            petName={pet.name}
                        />
                    </div>

                    {/* Details */}
                    <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl">{speciesEmoji[pet.species]}</span>
                                    <h1 className="text-3xl font-bold">{pet.name}</h1>
                                </div>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pet.status || 'available')}`}>
                                    {getStatusLabel(pet.status || 'available')}
                                </div>
                            </div>
                            <FavoriteButton petId={pet.id} size="lg" />
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-[var(--color-muted)] rounded-xl p-4">
                                <div className="text-sm text-[var(--color-text-muted)]">种类 / 品种</div>
                                <div className="font-medium">{getSpeciesLabel(pet.species)} {pet.breed && `· ${pet.breed}`}</div>
                            </div>
                            <div className="bg-[var(--color-muted)] rounded-xl p-4">
                                <div className="text-sm text-[var(--color-text-muted)]">年龄</div>
                                <div className="font-medium">{formatPetAge(pet.age_years, pet.age_months)}</div>
                            </div>
                            <div className="bg-[var(--color-muted)] rounded-xl p-4">
                                <div className="text-sm text-[var(--color-text-muted)]">性别</div>
                                <div className="font-medium">{getGenderLabel(pet.gender)}</div>
                            </div>
                            <div className="bg-[var(--color-muted)] rounded-xl p-4">
                                <div className="text-sm text-[var(--color-text-muted)]">体型</div>
                                <div className="font-medium">{getSizeLabel(pet.size)}</div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-[var(--color-text-muted)] mb-6">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{formatLocation(pet.location_province, pet.location_city)}</span>
                        </div>

                        {/* Health Info */}
                        {(pet.health_status || pet.vaccination_status || pet.sterilized !== null) && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">健康信息</h3>
                                <div className="flex flex-wrap gap-2">
                                    {pet.vaccination_status && (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            💉 {pet.vaccination_status}
                                        </span>
                                    )}
                                    {pet.sterilized && (
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            ✓ 已绝育
                                        </span>
                                    )}
                                    {pet.health_status && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                                            🏥 {pet.health_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        {pet.description && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">详细介绍</h3>
                                <p className="text-[var(--color-text-muted)] whitespace-pre-line">{pet.description}</p>
                            </div>
                        )}

                        {/* Adoption Requirements */}
                        {pet.adoption_requirements && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">领养要求</h3>
                                <div className="bg-[var(--color-warm)] rounded-xl p-4">
                                    <p className="text-sm whitespace-pre-line">{pet.adoption_requirements}</p>
                                </div>
                            </div>
                        )}

                        {/* Publisher Info */}
                        <div className="border-t border-[var(--color-border)] pt-6 mb-6">
                            <h3 className="font-semibold mb-3">发布者信息</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-medium text-lg">
                                    {publisher?.full_name?.[0] || publisher?.username?.[0] || 'U'}
                                </div>
                                <div>
                                    <div className="font-medium">{publisher?.full_name || publisher?.username || '匿名用户'}</div>
                                    <div className="text-sm text-[var(--color-text-muted)]">发布于 {formatDate(pet.created_at!)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {pet.status === 'available' && (
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={`/adopt/${pet.id}`}
                                    className="flex-1 btn btn-primary text-lg py-4"
                                >
                                    🐾 申请领养
                                </Link>
                                <button className="btn btn-outline py-4">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    分享
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
