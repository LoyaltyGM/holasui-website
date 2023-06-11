import {ChevronDownIcon} from "@heroicons/react/24/outline";
import {classNames, formatSuiAddress} from "utils";
import Image from "next/image";
import {LabeledInput} from "../Forms/Inputs";
import ImageSuiToken from "/public/img/SuiToken.png";
import {ISwapInformation} from "types";

export const SwapInformation = ({userObjectIds, setShowCollection, setCoinAmount, coinAmount = null, recipientAddress = '', isRecipient = false} : ISwapInformation) => {
    return (
        <div className="md:w-1/2 w-full px-3 md:mb-0 mb-2">
            <div
                className="h-[45vh] md:h-[30vh] mb-2 flex flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-purpleColor/20 border-purpleColor text-purpleColor"
                onClick={() => setShowCollection(true)}
            >
                <button
                    className="bg-purpleColor content-center items-center rounded-md font-bold text-white w-full flex justify-between px-3 py-2">
                    <p>Your Collection</p>
                    <ChevronDownIcon className="h-5 w-5 "/>
                </button>
                <div
                    className={
                        "grid md:grid-cols-4 grid-cols-3 overflow-auto gap-1 h-[27vh] md:gap-4 md:mt-4 md:h-[20vh]"
                    }
                >
                    {userObjectIds?.map((object) => {
                        return (
                            <div
                                key={object.id}
                                className={classNames(
                                    "border bg-white flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                                    ""
                                )}
                            >
                                <Image src={object.url} alt="collection_img" width={90} height={130}
                                       className="mt-1"/>
                            </div>
                        );
                    })}
                    {coinAmount !== 0 && coinAmount !== null ? (
                        <p className="text-2xl text-center border bg-white flex items-center justify-center rounded-md">{`${coinAmount} SUI`}</p>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="md:flex justify-between">
                    <p className="mt-2">You want</p>
                    {isRecipient && recipientAddress ? (
                        <p className="md:mt-2 mt-0">{`From Wallet: ${formatSuiAddress(recipientAddress)}`}</p>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* Your Sui Value */}
            <LabeledInput label={""}>
                <div className="relative">
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Image src={ImageSuiToken} alt="token" className="h-5 w-5" aria-hidden="true"/>
                    </div>
                    <input
                        type={"text"}
                        name="sui_amount"
                        className={"input-field w-full pl-10 bg-white"}
                        placeholder="Sui Amount Send"
                        pattern={"[0-9]*"}
                        onChange={(e) => setCoinAmount(Number(e.target.value))}
                    />
                </div>
            </LabeledInput>
        </div>)
}