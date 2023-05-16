import { Montserrat } from "next/font/google";
import { classNames } from "utils";
import Link from "next/link";
const font_montserrat = Montserrat({ subsets: ["latin"] });

export default function Page404() {
  return (
    <main className="flex min-h-[85vh] flex-col pl-16 py-6 mt-40 pr-10 z-10 rounded-lg bg-bgMain">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className={classNames(font_montserrat.className, "text-4xl font-medium mb-4")}>
          Hello there! You're quite early!
        </p>
        <div
          className={classNames(
            font_montserrat.className,
            "text-2xl leading-6 flex flex-col justify-start items-start gap-2 "
          )}
        >
          <p>Our P2P Swap feature is currently in the works.</p>
          <p>Stay tuned, as it will be available later this week.</p>
        </div>
        <Link href="/">
          <button
            className={classNames(
              "w-full block mx-auto my-4 px-3 mt-10 text-sm py-2 bg-yellowColor text-white font-black rounded-md hover:bg-[#e5a44a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              font_montserrat.className
            )}
          >
            Back to staking
          </button>
        </Link>
      </div>
    </main>
  );
}
