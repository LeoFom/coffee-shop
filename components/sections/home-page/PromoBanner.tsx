import MyContainer from '@/ui/MyContainer';
import Button from '@/ui/ButtonSecond';

export default function PromoBanner() {
  return (
    <section className="py-12 bg-white">
      <MyContainer>
        <div className="bg-[#F6E6E6] rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between relative">
          <div className="max-w-md relative z-10">
            <h2 className="text-4xl font-serif font-bold text-brand-brown mb-6 leading-tight">
              Check out our<br/>best coffee beans
            </h2>
            <Button>Explore our products →</Button>
          </div>

          {/* Контейнер для мешка, overflow: visible здесь реализуется за счет абсолютного позиционирования и выхода за границы родителя */}
          <div className="mt-8 md:mt-0 relative w-full md:w-1/2 h-64">
            <div className="absolute -top-16 -right-10 w-full h-[120%] bg-brand-brown/10 rounded-full blur-2xl hidden md:block"></div>
            {/* Сюда вставляем <Image /> мешка. object-fit: contain */}
            <div className="absolute inset-0 flex items-center justify-center text-brand-brown">
              [Bag Image Placeholder]
            </div>
          </div>
        </div>
      </MyContainer>
    </section>
  );
}