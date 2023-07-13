import { Montserrat } from "next/font/google";
import { classNames } from "utils";
import Link from "next/link";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export default function Page404() {
  return (
    <main className="z-[9] mt-40 flex min-h-[85vh] flex-col rounded-lg bg-basicColor py-6 pl-16 pr-10">
      <div className="z-[9] w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className={classNames(font_montserrat.className, "text-4xl font-bold")}>404</p>
        <p className={classNames(font_montserrat.className, "text-2xl")}>
          Oppsss we can't find this page
        </p>
        <Link href="/">
          <button
            className={classNames(
              "mx-auto my-4 block w-full cursor-pointer rounded-md bg-yellowColor px-3 py-2 text-sm font-black text-white hover:bg-[#e5a44a] disabled:cursor-not-allowed disabled:opacity-50",
              font_montserrat.className,
            )}
          >
            Back to home
          </button>
        </Link>
      </div>
    </main>
  );
}
