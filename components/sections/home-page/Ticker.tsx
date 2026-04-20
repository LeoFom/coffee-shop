export default function Ticker() {
  return (
    <div className="w-full bg-brand-brown py-4 overflow-hidden flex whitespace-nowrap">
      <div className="animate-marquee flex items-center">
        {/* Повторяем контент для плавного цикла */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-white font-serif text-2xl mx-8">C o f f e o</span>
            <span className="w-2 h-2 rounded-full bg-white/50"></span>
          </div>
        ))}
      </div>
    </div>
  );
}