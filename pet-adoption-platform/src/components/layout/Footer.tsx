import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-[var(--color-card)] border-t border-[var(--color-border)] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🐾</span>
                            <span className="text-xl font-bold gradient-text">宠爱之家</span>
                        </Link>
                        <p className="text-[var(--color-text-muted)] mb-4 max-w-sm">
                            我们致力于帮助每一只等待爱的小动物找到温暖的家。让领养代替购买，给它们一个新的开始。
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                            </a>
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">快速链接</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/pets" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    浏览宠物
                                </Link>
                            </li>
                            <li>
                                <Link href="/publish" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    发布宠物
                                </Link>
                            </li>
                            <li>
                                <Link href="/success-stories" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    领养故事
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="font-semibold mb-4">帮助与支持</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    领养须知
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    常见问题
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    联系我们
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                    隐私政策
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--color-border)] mt-8 pt-8 text-center text-[var(--color-text-muted)] text-sm">
                    <p>© 2026 宠爱之家 PetLove. 让每一只宠物都有家 ❤️</p>
                </div>
            </div>
        </footer>
    );
}
