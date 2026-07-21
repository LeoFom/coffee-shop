import Link from 'next/link';
import MyContainer from "@/ui/MyContainer";

const FOOTER_LINKS = {
  Privacy: [
    { label: 'Terms of use', href: '#' },
    { label: 'Privacy policy', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
  Services: [
    { label: 'Shop', href: '#' },
    { label: 'Order ahead', href: '#' },
    { label: 'Menu', href: '#' },
  ],
  'About us': [
    { label: 'Find a location', href: '#' },
    { label: 'About us', href: '#' },
    { label: 'Our story', href: '#' },
  ],
  Information: [
    { label: 'Plans & pricing', href: '#' },
    { label: 'Jobs', href: '#' },
    { label: 'Sell your product', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-brown pt-20 pb-8 text-white">
      <MyContainer>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">

          {/* Динамический рендер колонок со ссылками */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-lg mb-6">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Социальные сети */}
          <div>
            <h4 className="font-bold text-lg mb-6">Social media</h4>
            <div className="flex gap-4">
              {/* Заглушки для иконок соцсетей */}
              {['Twitter', 'Instagram', 'Facebook', 'YouTube', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label={social}>
                  <div className="w-4 h-4 bg-white/50 rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Нижняя панель */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>Copyright © 2022, Coffeo.io</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Favicon</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white">Support</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white">Blog</Link>
          </div>
        </div>
      </MyContainer>
    </footer>
  );
}