import Header from '@/components/layout/Header';
import Hero from '@/components/sections/home-page/Hero';
import Ticker from '@/components/sections/home-page/Ticker';
import RecentProducts from '@/components/sections/home-page/RecentProducts';
import PromoBanner from '@/components/sections/home-page/PromoBanner';
// Сюда же импортируем WeekendSpecials, Features, Newsletter, Footer

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg font-sans text-brand-text">
      <Header />
      <Hero />
      <Ticker />
      <RecentProducts />
      <PromoBanner />
      {/*<WeekendSpecials />*/}
      {/*<Features />*/}
      {/*<Newsletter />*/}
      {/*<Footer />*/}
    </main>
  );
}