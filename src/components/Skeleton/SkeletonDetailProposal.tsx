export const SkeletonProposalPage = () => {
  const Title = () => {
    return (
      <div className={"mb-10 mt-16 flex justify-between"}>
        <p className={"text-4xl font-bold w-20 h-8 bg-gray2Color animate-pulse text-gray2Color"}>
          Title
        </p>
        <div
          className={
            "flex content-center items-center rounded-xl border w-[45px] h-[12px] bg-gray2Color animate-pulse px-5 py-1 text-purpleColor"
          }
        ></div>
      </div>
    );
  };
  return (
    <>
      <div className="flex h-8 w-full animate-pulse rounded-2xl bg-gray2Color" />
      <Title />
    </>
  );
};
