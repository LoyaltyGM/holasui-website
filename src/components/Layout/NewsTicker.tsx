export const NewsTicker = () => {
  // TODO: need to fix animation 33% percent
  const dotsClasses = "text-[3rem] mb-1 leading-1";
  const textClasses = "mx-4 text-4xl";
  return (
    <div className="relative z-[20] flex overflow-x-hidden bg-yellowColor font-bold text-white">
      <div className="z-20 animate-marquee whitespace-nowrap py-1 uppercase">
        <span className="mx-4 text-4xl">SUI X KUCOIN HACK</span>
        <span className={dotsClasses}>·</span>
        <span className="mx-4 text-4xl">ATTRIBUTES DAO</span>
        <span className={dotsClasses}>·</span>
        <span className="mx-4 text-4xl">HOLA EVERYONE!</span>
        <span className={dotsClasses}>·</span>
        <span className="mx-4 text-4xl">DAO CONSTRUCTOR</span>
        <span className={dotsClasses}>·</span>
      </div>

      <div className="absolute top-0 z-20 animate-marquee2 whitespace-nowrap py-1 uppercase">
        <span className="mx-4 text-4xl">SUI X KUCOIN HACK</span>
        <span className={dotsClasses}>·</span>
        <span className="mx-4 text-4xl">ATTRIBUTES DAO</span>
        <span className={dotsClasses}>·</span>
        <span className="mx-4 text-4xl">HOLA EVERYONE!</span>
        <span className={dotsClasses}>·</span>
        <span className="mx-4 text-4xl">DAO CONSTRUCTOR</span>
        <span className={dotsClasses}>·</span>
      </div>
    </div>
  );
};
