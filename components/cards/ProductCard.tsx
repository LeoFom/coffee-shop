import Image from 'next/image';

interface ProductCardProps {
  title: string;
  category: string;
  price: number;
  bgColor: string;
  imageUrl: string;
}

export default function ProductCard({ title, category, price, bgColor, imageUrl }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Изображение с подложкой */}
      <div
        className="relative h-80 w-full rounded-2xl p-6 transition-transform duration-300 group-hover:-translate-y-2 flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {/* Placeholder для картинки, заменишь на реальный src */}
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* Текстовый блок */}
      <div className="mt-4 text-center">
        <p className="text-sm text-brand-muted mb-1">{category}</p>
        <h3 className="text-xl font-serif text-brand-brown font-semibold">{title}</h3>
        <p className="text-lg font-medium text-brand-brown mt-1">${price}</p>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-between items-center mt-4 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="text-sm font-medium text-brand-brown hover:underline flex items-center gap-1">
          Add to cart <span className="text-lg">→</span>
        </button>
        <button className="text-brand-muted hover:text-red-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>
    </div>
  );
}