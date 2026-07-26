import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-card py-4 px-8 flex justify-between items-center">
      <div className="text-2xl serif-heading text-[#E8D7A5] font-bold">HNM</div>
      <div className="hidden md:flex gap-8">
        <Link href="/" className="text-gray-200 hover:text-[#E8D7A5] transition-colors font-light">Home</Link>
        <Link href="#products" className="text-gray-200 hover:text-[#E8D7A5] transition-colors font-light">Products</Link>
        <Link href="#about" className="text-gray-200 hover:text-[#E8D7A5] transition-colors font-light">About</Link>
      </div>
    </nav>
  );
}