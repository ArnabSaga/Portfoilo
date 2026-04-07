import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6">
      <div className="relative">
        <h1 className="text-[25vw] md:text-[20rem] font-syne font-extrabold uppercase tracking-tighter text-foreground leading-[0.8] mix-blend-difference">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <h2 className="text-2xl md:text-4xl font-syne font-bold uppercase tracking-widest text-background mix-blend-difference">
                Lost In Space
            </h2>
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-8">
        <p className="font-inter text-sm md:text-base uppercase tracking-widest text-foreground/40 font-bold max-w-xs text-center leading-relaxed">
          The architectural coordinates you requested do not exist in our current digital structure.
        </p>
        
        <Link 
            href="/"
            className="group relative px-12 py-5 border border-border-custom overflow-hidden transition-colors hover:border-foreground"
        >
            <span className="relative z-10 font-inter text-[10px] font-extrabold uppercase tracking-[0.5em] text-foreground">
                Return to Base
            </span>
            <div className="absolute inset-0 bg-foreground scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[0.76, 0, 0.24, 1]"></div>
            <span className="absolute inset-0 z-20 flex items-center justify-center font-inter text-[10px] font-extrabold uppercase tracking-[0.5em] text-background opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Return to Base
            </span>
        </Link>
      </div>
    </div>
  );
}
