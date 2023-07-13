import { classNames } from "utils";
import Image from "next/image";
import { LabeledInput } from "components/Forms/Inputs";
import ImageSuiToken from "/public/img/SuiToken.png";
import { ISwapInformation } from "types";

export const SwapInformation = ({
  userObjectIds,
  setShowCollection,
  setCoinAmount,
  coinAmount = null,
  recipientAddress = "",
  isRecipient = false,
}: ISwapInformation) => {
  return (
    <div className="mb-2 w-full px-3 md:mb-0 md:w-full ">
      <div
        className="mb-2 flex h-[45vh] w-full cursor-pointer flex-col justify-between rounded-lg border-2 border-grayColor bg-white px-2 py-2 font-normal text-purpleColor md:h-[30vh]"
        onClick={() => setShowCollection(true)}
      >
        <div
          className={
            "grid h-[27vh] grid-cols-3 gap-1 overflow-auto md:mt-4 md:h-[20vh] md:grid-cols-4 md:gap-4"
          }
        >
          {coinAmount !== 0 && coinAmount !== null ? (
            <div className="flex h-24 w-24 items-center justify-center gap-2 rounded-md border bg-white text-center text-2xl">
              <Image
                src={ImageSuiToken}
                alt="token"
                className="h-[25px] w-[26px]"
                aria-hidden="true"
              />
              <p>{`${coinAmount}`}</p>
            </div>
          ) : (
            <></>
          )}
          {userObjectIds?.map((object) => {
            return (
              <div
                key={object.id}
                className={classNames(
                  "flex h-24 w-24 cursor-pointer flex-col content-center items-center justify-center rounded-md border bg-white  p-2",
                  "",
                )}
              >
                <Image
                  src={object.url}
                  alt="collection_img"
                  width={90}
                  height={90}
                  className="mt-1"
                />
              </div>
            );
          })}
        </div>
        <div className="flex content-center items-center justify-center text-center">
          <button
            className={classNames(
              " flex w-full content-center items-center justify-between rounded-md px-3 py-2 text-center font-medium text-white",
              isRecipient ? "bg-pinkColor" : "bg-purpleColor",
            )}
          >
            {isRecipient ? <p>Specify NFTs</p> : <p>Select NFTs</p>}
          </button>
        </div>
      </div>
      {/* Your Sui Value */}
      <LabeledInput>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-grayColor pl-3 pr-3">
            <Image
              src={ImageSuiToken}
              alt="token"
              className="h-[25px] w-[26px]"
              aria-hidden="true"
            />
          </div>
          <input
            type={"text"}
            name="sui_amount"
            className={"input-field w-full border-grayColor bg-white pl-12"}
            placeholder="Sui Amount Send"
            pattern={"[0-9]*"}
            onChange={(e) => setCoinAmount(Number(e.target.value))}
          />
        </div>
      </LabeledInput>
    </div>
  );
};
