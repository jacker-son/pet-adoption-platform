import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PetCard } from '@/components/pets/PetCard';
import { Pet } from '@/lib/types/database.types';

async function getFeaturedPets(): Promise<Pet[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('pets')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(6);
  return data || [];
}

async function getStats() {
  const supabase = await createClient();
  const [petsResult, applicationsResult] = await Promise.all([
    supabase.from('pets').select('id', { count: 'exact', head: true }),
    supabase.from('adoption_applications').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
  ]);
  return {
    totalPets: petsResult.count || 0,
    adoptedPets: applicationsResult.count || 0,
  };
}

export default async function HomePage() {
  const [featuredPets, stats] = await Promise.all([
    getFeaturedPets(),
    getStats(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-warm)] to-[var(--color-secondary)]/10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                给它们一个
                <span className="gradient-text block">温暖的家</span>
              </h1>
              <p className="text-lg md:text-xl text-[var(--color-text-muted)] mb-8 max-w-lg">
                在宠爱之家，每一只等待爱的毛孩子都期待着遇见你。让领养代替购买，开启一段美好的缘分。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/pets" className="btn btn-primary text-lg px-8 py-3">
                  浏览宠物 🐾
                </Link>
                <Link href="/publish" className="btn btn-outline text-lg px-8 py-3">
                  发布宠物
                </Link>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4 animate-slide-up">
              <div className="space-y-4">
                <div className="bg-[var(--color-card)] rounded-2xl p-6 shadow-lg card-hover">
                  <span className="text-4xl">🐕</span>
                  <h3 className="font-semibold mt-2">狗狗</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">忠诚可爱的伙伴</p>
                </div>
                <div className="bg-[var(--color-card)] rounded-2xl p-6 shadow-lg card-hover">
                  <span className="text-4xl">🐈</span>
                  <h3 className="font-semibold mt-2">猫咪</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">温柔优雅的精灵</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-[var(--color-card)] rounded-2xl p-6 shadow-lg card-hover">
                  <span className="text-4xl">🐰</span>
                  <h3 className="font-semibold mt-2">兔子</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">软萌可爱的天使</p>
                </div>
                <div className="bg-[var(--color-card)] rounded-2xl p-6 shadow-lg card-hover">
                  <span className="text-4xl">🐦</span>
                  <h3 className="font-semibold mt-2">鸟类</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">歌声悦耳的朋友</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[var(--color-card)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stats.totalPets}+</div>
              <div className="text-[var(--color-text-muted)] mt-1">待领养宠物</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stats.adoptedPets}+</div>
              <div className="text-[var(--color-text-muted)] mt-1">成功领养</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">100%</div>
              <div className="text-[var(--color-text-muted)] mt-1">免费领养</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text">❤️</div>
              <div className="text-[var(--color-text-muted)] mt-1">用爱守护</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              等待领养的小可爱 🐾
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              它们都在等待一个温暖的家，也许你就是它们命中注定的那个人
            </p>
          </div>

          {featuredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🐾</div>
              <p className="text-[var(--color-text-muted)]">暂无宠物信息</p>
              <Link href="/publish" className="btn btn-primary mt-4">
                发布第一只宠物
              </Link>
            </div>
          )}

          {featuredPets.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/pets" className="btn btn-outline text-lg">
                查看全部宠物 →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-[var(--color-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              如何领养宠物？
            </h2>
            <p className="text-[var(--color-text-muted)]">
              简单几步，开启你和毛孩子的幸福旅程
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '🔍', title: '浏览宠物', desc: '在平台上查找你心仪的毛孩子' },
              { step: '02', icon: '📝', title: '提交申请', desc: '填写领养申请表，介绍自己' },
              { step: '03', icon: '💬', title: '沟通确认', desc: '与发布者沟通，了解更多信息' },
              { step: '04', icon: '🏠', title: '接它回家', desc: '完成领养，给它一个温暖的家' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-[var(--color-card)] rounded-2xl p-6 text-center h-full border border-[var(--color-border)] card-hover">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-sm text-[var(--color-primary)] font-medium mb-2">STEP {item.step}</div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[var(--color-border)] text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              准备好迎接新成员了吗？
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              每一次领养，都是一次生命的拯救。加入我们，一起传递爱与温暖。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pets" className="bg-white text-[var(--color-primary)] font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
                开始领养
              </Link>
              <Link href="/publish" className="bg-white/20 backdrop-blur-sm font-semibold px-8 py-3 rounded-xl hover:bg-white/30 transition-all">
                发布宠物
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
