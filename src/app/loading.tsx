export default function Loading() {
  const labelCls =
    "font-inter text-[0.625rem] font-bold uppercase tracking-[0.28em] text-white/50";
  const nameCls =
    "font-syne text-[clamp(3.2rem,10vw,10rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.04em] text-white";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[#060606] px-6 py-6 sm:px-10 sm:py-8 min-[1025px]:px-14 min-[1025px]:py-10"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className={labelCls}>Portfolio / Entry</span>
        <span className={labelCls}>Portfolio / 2026</span>
      </div>

      {/* Top rule */}
      <div className="mt-4 h-px w-full bg-white/15" />

      {/* Center — name composition */}
      <div className="flex flex-1 items-center">
        <div className="w-full py-4">
          <p className={nameCls}>ACHYUTA</p>
          <p className={`${nameCls} pl-[10%] min-[1025px]:pl-[16%]`}>ARNAB</p>
          <p className={`${nameCls} pl-[24%] min-[1025px]:pl-[34%]`}>DEY</p>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="h-px w-full bg-white/15" />

      {/* Bottom bar */}
      <div className="mt-4 flex items-center justify-between">
        <span className={labelCls}>Creative Web Developer</span>
        <span className={labelCls}>Architectural Systems</span>
      </div>
    </div>
  );
}
