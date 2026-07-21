'use client';
import MyContainer from '@/ui/MyContainer';
import Button from '@/ui/ButtonSecond';
import {getTasks} from "@/lib/features/api/tasks/getTasks";

export default function Hero() {
  return (
    <section className="pb-16 bg-brand-bg relative overflow-hidden min-h-[90vh] flex items-center">
      <MyContainer className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Левая колонка */}
        <div className="max-w-xl">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-brand-brown leading-none tracking-tighter mb-6">
            COFFEO
          </h1>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-brown mb-4">
            An online coffee store
          </h2>
          <p className="text-brand-text mb-8 text-lg">
            Straight to your doorstep. We don&#39;t roast our beans until we have your order. Every order is roasted and shipped the same day.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Button
              onClick={getTasks}
            >Explore our products →</Button>
            <Button variant="outline">Log in / sign up</Button>
          </div>

          {/* Статистика */}
          <div className="flex gap-12 border-t border-brand-brown/20 pt-8">
            <div>
              <p className="text-sm text-brand-muted mb-1">Our products</p>
              <p className="text-3xl font-serif font-bold text-brand-brown">+1000</p>
            </div>
            <div>
              <p className="text-sm text-brand-muted mb-1">Total sales</p>
              <p className="text-3xl font-serif font-bold text-brand-brown">+340k</p>
            </div>
            <div>
              <p className="text-sm text-brand-muted mb-1">Total sales</p>
              <p className="text-3xl font-serif font-bold text-brand-brown">+340k</p>
            </div>
          </div>
        </div>

        {/* Правая колонка (Splash-эффект) */}
        <div className="relative h-[600px] w-full hidden lg:block">
          {/* Сюда нужно вставить картинку летящего стакана с кофе. Используем next/image */}
          <div className="absolute inset-0 bg-brand-brown/5 rounded-full blur-3xl scale-75"></div>
          {/* Пример заглушки: */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-brand-brown/20 rounded-xl rotate-12 flex items-center justify-center text-brand-brown">
            Image Placeholder
          </div>
        </div>

      </MyContainer>
    </section>
  );
}