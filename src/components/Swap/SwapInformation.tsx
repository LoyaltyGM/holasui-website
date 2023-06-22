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
    <div className="md:w-full w-full px-3 md:mb-0 mb-2 ">
      <div
        className="h-[45vh] md:h-[30vh] mb-2 flex flex-col cursor-pointer justify-between w-full py-2 px-2 font-normal border-2 rounded-lg bg-white border-grayColor text-purpleColor"
        onClick={() => setShowCollection(true)}
      >
        <div className={"grid md:grid-cols-4 grid-cols-3 overflow-auto gap-1 h-[27vh] md:gap-4 md:mt-4 md:h-[20vh]"}>
          {coinAmount !== 0 && coinAmount !== null ? (
            <div className="text-2xl text-center gap-2 w-24 h-24 border bg-white flex items-center justify-center rounded-md">
              <Image src={ImageSuiToken} alt="token" className="h-[25px] w-[26px]" aria-hidden="true" />
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
                  "border bg-white w-24 h-24 flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                  ""
                )}
              >
                <Image src={object.url} alt="collection_img" width={90} height={90} className="mt-1" />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center text-center content-center items-center">
          <button
            className={classNames(
              " text-center content-center items-center rounded-md font-medium text-white w-full flex justify-between px-3 py-2",
              isRecipient ? "bg-pinkColor" : "bg-purpleColor"
            )}
          >
            {isRecipient ? <p>Specify NFTs</p> : <p>Select NFTs</p>}
          </button>
        </div>
      </div>
      {/* Your Sui Value */}
      <LabeledInput>
        <div className="relative">
          <div className="pointer-events-none border-grayColor absolute inset-y-0 left-0 flex items-center pl-3 pr-3">
            <Image src={ImageSuiToken} alt="token" className="h-[25px] w-[26px]" aria-hidden="true" />
          </div>
          <input
            type={"text"}
            name="sui_amount"
            className={"input-field border-grayColor w-full pl-12 bg-white"}
            placeholder="Sui Amount Send"
            pattern={"[0-9]*"}
            onChange={(e) => setCoinAmount(Number(e.target.value))}
          />
        </div>
      </LabeledInput>
    </div>
  );
};
