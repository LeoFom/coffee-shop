import Hero from '@/components/sections/home-page/Hero';
import Ticker from '@/components/sections/home-page/Ticker';
import RecentProducts from '@/components/sections/home-page/RecentProducts';
import PromoBanner from '@/components/sections/home-page/PromoBanner';
import WeekendSpecials from "@/sections/home-page/WeekendSpecials";
import Features from "@/sections/home-page/Features";
import Newsletter from "@/sections/home-page/Newsletter";
import Footer from "@/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg font-sans text-brand-text">
      <Hero />
      <Ticker />
      <RecentProducts />
      <PromoBanner />
      <WeekendSpecials/>
      <Features />
      <Newsletter />
      <Footer />
    </main>
  );
}