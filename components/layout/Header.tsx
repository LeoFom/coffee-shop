import Link from 'next/link';
import Container from '../ui/Container';
import Button from '../ui/ButtonSecond';

export default function Header() {
  return (
    <header className="w-full py-6 absolute top-0 z-50">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-brown rounded-full"></div>
          <span className="font-serif font-bold text-2xl text-brand-brown tracking-tighter">Coffeo</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="#" className="text-brand-brown font-medium hover:text-opacity-70 flex items-center gap-1">
            Product <span className="text-xs">▼</span>
          </Link>
          <Link href="#" className="text-brand-brown font-medium hover:text-opacity-70">Special offers</Link>
          <Link href="#" className="text-brand-brown font-medium hover:text-opacity-70">The process</Link>
          <Link href="#" className="text-brand-brown font-medium hover:text-opacity-70">Packing</Link>
          <Link href="#" className="text-brand-brown font-medium hover:text-opacity-70">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-black/5 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
          <button className="p-2 hover:bg-black/5 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg></button>
          <Button variant="primary" className="hidden md:flex">Log in / Sign up</Button>
        </div>
      </Container>
    </header>
  );
}