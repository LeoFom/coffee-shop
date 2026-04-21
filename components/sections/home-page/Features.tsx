import Container from '@/ui/Container';
import Button from '@/ui/ButtonSecond';

const FEATURES_DATA = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
    ),
    title: 'Active community',
    desc: 'You can reach out whenever you want!'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
    ),
    title: 'Best product design',
    desc: 'We worked a lot to make a great experience'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    ),
    title: 'Premium quality',
    desc: 'A premium quality coffee is what our customers deserve'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
    ),
    title: 'The best material',
    desc: 'Our product is made by premium materials'
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container className="flex flex-col lg:flex-row gap-16 items-center">

        {/* Левая часть - Изображение с отзывом */}
        <div className="w-full lg:w-1/2 relative">
          <div className="w-full h-[500px] rounded-full bg-card-sand/30 relative flex items-center justify-center">
            {/* Заглушка для зерен */}
            <div className="text-brand-brown/40 font-serif">Coffee Beans Image</div>
          </div>

          {/* Плавающая карточка отзыва */}
          <div className="absolute bottom-10 left-0 md:-left-10 bg-white p-4 rounded-xl shadow-xl flex gap-4 items-center max-w-sm border border-brand-brown/5">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div>
              <h4 className="font-bold text-brand-brown text-sm">Brooklyn Simmons</h4>
              <p className="text-xs text-brand-muted mt-1 leading-snug">
                Coffeo is on of the most successful company... customer relationship is very good.
              </p>
            </div>
          </div>
        </div>

        {/* Правая часть - Контент */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl font-serif font-bold text-brand-brown mb-4 leading-tight">
            We care about the quality of our <span className="underline decoration-brand-accent">products</span>
          </h2>
          <p className="text-brand-muted mb-12">
            Drinking coffee is one of the most global things you do each days here i can spend a long and comfortable time with this workspace facilities
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            {FEATURES_DATA.map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-brown/5 text-brand-brown flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-bold text-brand-brown mb-1">{feature.title}</h4>
                  <p className="text-sm text-brand-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button>Explore our products →</Button>
        </div>

      </Container>
    </section>
  );
}