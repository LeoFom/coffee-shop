import Image from 'next/image';

interface SpecialProductCardProps {
  title: string;
  oldPrice: number;
  newPrice: number;
  discount: string;
  imageUrl: string;
}

export default function SpecialProductCard({ title, oldPrice, newPrice, discount, imageUrl }: SpecialProductCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Контейнер изображения с бейджем скидки */}
      <div className="relative h-72 w-full rounded-2xl bg-card-gray p-6 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
        <div className="absolute top-4 right-4 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-brand-brown font-medium text-sm z-10">
          {discount}
        </div>
        <div className="relative w-full h-full">
          {/* Placeholder, замени на реальное изображение */}
          <div className="absolute inset-0 flex items-center justify-center text-brand-muted">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Информация о товаре */}
      <div>
        <p className="text-sm text-brand-muted mb-1">Product name</p>
        <h3 className="text-lg font-serif text-brand-brown font-semibold leading-tight mb-2">{title}</h3>

        <div className="flex items-end gap-2 mb-4">
          <span className="text-brand-muted line-through text-sm">${oldPrice.toFixed(2)}</span>
          <span className="text-xl font-bold text-brand-brown">${newPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-between items-center px-1">
        <button className="text-sm font-medium text-brand-brown hover:underline flex items-center gap-1">
          Add to cart <span className="text-lg">→</span>
        </button>
        <button className="text-brand-muted hover:text-red-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}