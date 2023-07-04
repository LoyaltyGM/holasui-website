export const SkeletonDAOMain = () => {
  return (
    <>
      {/*Skeleton Animation*/}
      {/*Bradcrumbs Header*/}
      <div className="mt-24 flex h-8 w-full animate-pulse rounded-2xl bg-gray2Color" />
      {/*InfoDao*/}
      <div className={"mt-10"}>
        <div className={"flex w-full justify-between"}>
          <div className={"flex w-full justify-between"}>
            <div className={"mr-4 flex w-full gap-4"}>
              <div
                className={
                  "h-[150px] max-h-[150px] min-h-[150px]  w-full min-w-[150px] max-w-[150px] animate-pulse rounded-full bg-gray2Color"
                }
              />
              <div className={"w-full"}>
                <div
                  className={
                    "flex h-10 w-3/4 content-center items-center justify-start gap-3 rounded-2xl bg-gray2Color"
                  }
                ></div>
                <div
                  className={"mt-4 h-20 min-w-full animate-pulse rounded-2xl bg-gray2Color"}
                ></div>
              </div>
            </div>

            <div className={"flex w-1/4 flex-col justify-center"}>
              <button className={"button-secondary button-shadow animate-pulse"} disabled>
                <p className={""}>Create SubDAO</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*Treasury*/}
      <div
        className={
          "mt-12 min-h-[125px] w-full animate-pulse content-center items-center justify-between rounded-xl bg-gray2Color px-8 py-6"
        }
      />
    </>
  );
};

export const SkeletonSubDAO = () => {
  return <div className={"mt-14 h-56 animate-pulse rounded-xl bg-gray2Color"}></div>;
};
