import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '宠爱之家 - 宠物领养平台',
  description: '帮助每一只等待爱的小动物找到温暖的家。浏览待领养宠物，开始您的领养之旅。',
  keywords: ['宠物领养', '宠物', '领养', '狗', '猫', '救助'],
  openGraph: {
    title: '宠爱之家 - 宠物领养平台',
    description: '帮助每一只等待爱的小动物找到温暖的家',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
