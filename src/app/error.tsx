"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center space-y-6">
        <h1 className="text-8xl md:text-[10rem] font-syne font-extrabold uppercase tracking-tighter text-foreground leading-none animate-pulse">
            FAULT
        </h1>
        <p className="font-inter text-sm md:text-base uppercase tracking-widest text-foreground/40 font-bold max-w-sm mx-auto leading-relaxed">
            The digital infrastructure encountered an structural error.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-12">
            <button
                onClick={() => reset()}
                className="group relative px-12 py-5 border border-foreground bg-foreground overflow-hidden transition-all hover:bg-background"
            >
                <span className="relative z-10 font-inter text-[10px] font-extrabold uppercase tracking-[0.5em] text-background group-hover:text-foreground">
                    Try Again
                </span>
                <div className="absolute inset-x-0 bottom-0 h-0 bg-background transition-all duration-500 ease-[0.76, 0, 0.24, 1] group-hover:h-full"></div>
            </button>
            
            <a
                href="/"
                className="group relative px-12 py-5 border border-border-custom overflow-hidden transition-colors hover:border-foreground"
            >
                <span className="relative z-10 font-inter text-[10px] font-extrabold uppercase tracking-[0.5em] text-foreground">
                    Emergency Exit
                </span>
                <div className="absolute inset-0 bg-foreground scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[0.76, 0, 0.24, 1]"></div>
                <span className="absolute inset-0 z-20 flex items-center justify-center font-inter text-[10px] font-extrabold uppercase tracking-[0.5em] text-background opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Emergency Exit
                </span>
            </a>
        </div>
      </div>
      
      {error.digest && (
        <p className="mt-12 font-inter text-[8px] uppercase tracking-[0.3em] font-medium text-foreground/20">
          Digest ID: {error.digest}
        </p>
      )}
    </div>
  );
}
