import MyContainer from '@/ui/MyContainer';
import Button from '@/ui/ButtonSecond';

export default function Newsletter() {
  return (
    <section className="py-24 bg-white">
      <MyContainer>
        <div className="bg-card-pink rounded-3xl p-10 md:p-16 relative overflow-hidden flex justify-end">

          {/* Декоративное изображение чашки слева */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/20 hidden lg:flex items-center justify-center">
            <div className="text-brand-brown/40">Cup Image</div>
          </div>

          {/* Контент формы */}
          <div className="relative z-10 w-full lg:w-1/2 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4">
              Join in and get %25 OFF!
            </h2>
            <p className="text-brand-muted mb-8">
              Subscribe to our newsletter and get %25 OFF discount code.
            </p>

            <form
              className="w-full max-w-md relative flex items-center"
              // onSubmit={(e) => e.preventDefault()}
            >
              <div className="absolute left-4 text-brand-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full pl-12 pr-32 py-4 rounded-full border-none focus:ring-2 focus:ring-brand-brown outline-none shadow-sm"
              />
              <Button className="absolute right-1 top-1 bottom-1 px-6 py-0 shadow-md">
                Subscribe
              </Button>
            </form>
          </div>

        </div>
      </MyContainer>
    </section>
  );
}