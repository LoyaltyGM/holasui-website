export const NewsTicker = () => {
  // TODO: need to fix animation 33% percent
  const dotsClasses = "text-[3rem] mb-1 leading-1";
  return (
    <div className="mb-1 hidden overflow-x-hidden bg-yellowColor text-white md:flex">
      <div className="flex w-full animate-marquee space-x-4 py-1 font-bold">
        <div className="flex content-center items-center justify-center space-x-4 whitespace-nowrap">
          <span className="text-3xl">SUI X KUCOIN HACKATON</span>
          <span className={dotsClasses}>·</span>
          <span className="text-3xl">JOIN OUR COMMUNITY</span>
          <span className={dotsClasses}>·</span>
          <span className="text-3xl">ATTRIBUTES DAO!</span>
          <span className={dotsClasses}>·</span>
        </div>

        <div className="flex content-center items-center justify-center space-x-4 whitespace-nowrap">
          <span className="text-3xl">SUI X KUCOIN HACKATON</span>
          <span className={dotsClasses}>·</span>
          <span className="text-3xl">JOIN OUR COMMUNITY</span>
          <span className={dotsClasses}>·</span>
          <span className="text-3xl">ATTRIBUTES DAO!</span>
          <span className={dotsClasses}>·</span>
        </div>

        <div className="flex content-center items-center justify-center space-x-4 whitespace-nowrap">
          <span className="text-3xl">SUI X KUCOIN HACKATON</span>
          <span className={dotsClasses}>·</span>
          <span className="text-3xl">JOIN OUR COMMUNITY</span>
          <span className={dotsClasses}>·</span>
          <span className="text-3xl">ATTRIBUTES DAO!</span>
          <span className={dotsClasses}>·</span>
        </div>
      </div>
    </div>
  );
};
