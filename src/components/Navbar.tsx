import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto bg-surface/80 backdrop-blur-md border border-border-custom px-2 py-2 hover:bg-surface transition-colors duration-300 flex items-center justify-center">
        <Image 
          src="/logo/logo.jpg" 
          alt="AAD Logo" 
          width={52} 
          height={52} 
          className="object-contain"
        />
      </div>
      
      <div className="hidden md:flex gap-10 items-center font-inter text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 pointer-events-auto bg-surface/80 backdrop-blur-md border border-border-custom px-8 py-3.5 hover:text-foreground transition-all duration-500">
        <Link href="#work" className="hover:text-foreground transition-colors">Work</Link>
        <Link href="#stack" className="hover:text-foreground transition-colors">Stack</Link>
        <Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link>
      </div>
      
      <div className="pointer-events-auto">
        <button className="bg-foreground text-background px-6 py-3 font-syne font-bold uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md">
          Hire Me
        </button>
      </div>
    </nav>
  );
}
