import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDate, getSpeciesLabel } from '@/lib/utils/format';

async function getSuccessStories() {
    const supabase = await createClient();
    const { data } = await supabase
        .from('adoption_applications')
        .select(`
      id,
      created_at,
      reviewed_at,
      applicant_name,
      pet:pets (
        id,
        name,
        species,
        breed,
        main_image_url,
        location_city,
        location_province
      )
    `)
        .eq('status', 'approved')
        .order('reviewed_at', { ascending: false })
        .limit(12);

    return data || [];
}

export default async function SuccessStoriesPage() {
    const stories = await getSuccessStories();

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        领养成功故事
                    </h1>
                    <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
                        每一次领养都是一段美好故事的开始。这些小可爱们已经找到了温暖的家，感谢每一位领养者的爱心。
                    </p>
                </div>

                {stories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => {
                            const pet = story.pet as unknown as {
                                id: string;
                                name: string;
                                species: string;
                                breed: string | null;
                                main_image_url: string | null;
                                location_city: string | null;
                                location_province: string | null;
                            };

                            return (
                                <div
                                    key={story.id}
                                    className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] card-hover"
                                >
                                    <div className="relative aspect-[4/3] bg-[var(--color-muted)]">
                                        {pet.main_image_url ? (
                                            <img
                                                src={pet.main_image_url}
                                                alt={pet.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                                🐾
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium">
                                            ✓ 已领养
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{pet.name}</h3>
                                        <p className="text-sm text-[var(--color-text-muted)] mb-3">
                                            {getSpeciesLabel(pet.species)}
                                            {pet.breed && ` · ${pet.breed}`}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-medium">
                                                {story.applicant_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium">{story.applicant_name}</p>
                                                <p className="text-[var(--color-text-muted)] text-xs">
                                                    {formatDate(story.reviewed_at!)} 领养成功
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📖</div>
                        <h3 className="text-xl font-semibold mb-2">暂无成功案例</h3>
                        <p className="text-[var(--color-text-muted)] mb-4">第一个领养成功的故事将会出现在这里</p>
                        <Link href="/pets" className="btn btn-primary">
                            浏览待领养宠物
                        </Link>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        想成为下一个温暖的家吗？
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-6 max-w-lg mx-auto">
                        还有更多毛孩子在等待着遇见你。开始你们的幸福旅程吧！
                    </p>
                    <Link href="/pets" className="btn btn-primary text-lg px-8">
                        开始领养之旅 🐾
                    </Link>
                </div>
            </div>
        </div>
    );
}
