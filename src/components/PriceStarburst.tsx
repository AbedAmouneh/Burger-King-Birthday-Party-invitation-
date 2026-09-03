import { Starburst } from "./Stickers";
import { FEE } from "@/lib/event";

/**
 * The fee has to be unmissable, and a promo starburst is both the loudest way
 * to say a number and exactly the right artifact for a 90s counter display.
 * This is the page's signature element.
 */
export function PriceStarburst() {
  return (
    <div className="relative mx-auto aspect-square w-[15rem] max-w-full">
      <Starburst
        points={18}
        className="absolute inset-0 h-full w-full drop-shadow-[0_6px_0_rgba(61,27,14,0.45)]"
      />
      <div className="absolute inset-0 flex -rotate-[6deg] flex-col items-center justify-center px-8 text-center">
        <span className="font-pixel text-[10px] tracking-[0.14em] text-brown/80 uppercase">
          Royal tribute
        </span>
        <span className="font-display mt-1 text-[2.6rem] leading-[0.85] text-flame">
          {FEE.amount}
        </span>
        <span className="font-pixel mt-1.5 text-[10px] tracking-[0.1em] text-brown uppercase">
          {FEE.per}
        </span>
      </div>
    </div>
  );
}
