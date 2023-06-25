import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Montserrat } from "next/font/google";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { classNames } from "utils";

const font_montserrat = Montserrat({ subsets: ["latin"] });

type LeaderboardEntry = {
  d: number;
  p: string;
  s: number;
};

export const LeaderboardDialog = ({
  wallet,
  opened,
  setOpened,
}: {
  wallet: any;
  opened: boolean;
  setOpened: any;
}) => {
  if (!wallet) return <></>;

  const [data, setData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = () => {
      fetch("https://bitby.click/jumper/scores/get")
        .then((response) => response.json())
        .then((json: LeaderboardEntry[]) => {
          // first 50 of leaderboard
          const sortedData = json.sort((a, b) => b.s - a.s).slice(0, 50);
          setData(sortedData);
        })
        .catch((error) => console.error("Error:", error));
    };
    fetchLeaderboard();
  }, [opened]);

  return (
    <Transition.Root show={opened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpened(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative h-[70vh] w-full max-w-4xl transform overflow-auto rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 md:h-[65vh]">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "mb-2 flex justify-between text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                <p className="mt-1 text-lg md:text-xl">Leaderboard</p>
                <button onClick={() => setOpened(false)}>
                  <XMarkIcon className="flex h-7 w-7" />
                </button>
              </Dialog.Title>
              <div className="flex flex-col items-center justify-center">
                <div className={"mt-2 flex flex-col items-center gap-2"}>
                  <div className={classNames("flex flex-col", font_montserrat.className)}>
                    {data ? (
                      <>
                        <table className="mt-2 w-full table-auto">
                          <thead>
                            <tr>
                              <th className="px-4 py-2">#</th>
                              <th className="px-4 py-2">Wallet</th>
                              <th className="px-4 py-2">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((entry, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-gray-300" : ""}>
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="w-full px-4 py-2 md:line-clamp-5 md:overflow-hidden md:overflow-ellipsis">
                                  {entry.p}
                                </td>
                                <td className="px-4 py-2">{entry.s}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          className={classNames(
                            "mx-auto my-4 block w-full cursor-pointer rounded-md bg-purpleColor px-3 py-2 text-sm font-black text-white hover:bg-purpleColor/90 disabled:cursor-not-allowed disabled:opacity-50",
                            font_montserrat.className,
                          )}
                          onClick={() => {
                            setOpened(false);
                          }}
                        >
                          Close
                        </button>
                      </>
                    ) : (
                      <p>Loading..</p>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
