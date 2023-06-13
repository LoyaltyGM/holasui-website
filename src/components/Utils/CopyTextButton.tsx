import { CheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useBoolean, useCopyToClipboard } from "usehooks-ts";

export const CopyTextButton = ({ copyText }: { copyText: string }) => {
  const { value: isCopied, setTrue, setFalse } = useBoolean();
  const [, copy] = useCopyToClipboard();

  const handleClick = () => {
    setTrue();
    copy(copyText).then();

    setTimeout(() => {
      setFalse();
    }, 500);
  };

  return (
    <div className={"flex gap-2 items-center hover:text-base-content/50 hover:cursor-pointer"} onClick={handleClick}>
      {copyText}
      {isCopied ? <CheckIcon className="h-6" /> : <ClipboardDocumentIcon className="h-6" />}
    </div>
  );
};