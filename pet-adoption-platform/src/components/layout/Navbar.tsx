'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { NAV_LINKS } from '@/lib/constants';
import { User } from '@supabase/supabase-js';

export function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsProfileOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-[var(--color-card)] border-b border-[var(--color-border)] backdrop-blur-lg bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-3xl group-hover:animate-bounce-soft">🐾</span>
                        <span className="text-xl font-bold gradient-text">宠爱之家</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-medium">
                                        {user.email?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <svg
                                        className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[var(--color-card)] rounded-xl shadow-lg border border-[var(--color-border)] py-2 animate-slide-down">
                                        <div className="px-4 py-2 border-b border-[var(--color-border)]">
                                            <p className="text-sm font-medium truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            👤 个人资料
                                        </Link>
                                        <Link
                                            href="/my-pets"
                                            className="block px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            🐕 我的宠物
                                        </Link>
                                        <Link
                                            href="/my-applications"
                                            className="block px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            📋 我的申请
                                        </Link>
                                        <Link
                                            href="/applications/received"
                                            className="block px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            📥 收到的申请
                                        </Link>
                                        <Link
                                            href="/favorites"
                                            className="block px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            ❤️ 我的收藏
                                        </Link>
                                        <Link
                                            href="/messages"
                                            className="block px-4 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            💬 消息通知
                                        </Link>
                                        <hr className="my-2 border-[var(--color-border)]" />
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            🚪 退出登录
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth/login" className="btn btn-primary text-sm py-2">
                                登录
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--color-border)] animate-slide-down">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
