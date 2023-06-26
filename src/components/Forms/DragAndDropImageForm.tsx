import { FileUploader } from "react-drag-drop-files";
import Image from "next/image";
import { useState } from "react";
import classNames from "classnames";
import { PhotoIcon } from "@heroicons/react/24/outline";

import { Label } from "components";

const fileTypes = ["JPEG", "PNG", "JPG"];

interface IDragAndDropProps {
  name: string;
  label: string;
  className?: string;
  handleChange: (file: File) => void;
  hoverTitle?: string;
  multipleFiles?: boolean;
}

export const DragAndDropImageForm = ({
  label,
  name,
  className,
  multipleFiles = false,
  hoverTitle = "Drag and drop file here",
  handleChange,
  ...props
}: IDragAndDropProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string | undefined>();
  const [preview, setPreview] = useState("");

  const onTypeError = (err = 1) => {
    setErrorMessages(err.toString());
    setError(true);
  };
  const onSizeError = (err = 1) => {
    setErrorMessages(err.toString());
    setError(true);
  };
  const localHandleChange = (file: File) => {
    setFile(file);
    setError(false);
    setPreview(() => URL.createObjectURL(file));
  };
  return (
    <div className={"flex gap-10"}>
      <div className={"flex flex-col"}>
        <Label label={label} />
        <FileUploader
          hoverTitle={hoverTitle}
          multiple={multipleFiles}
          handleChange={(file: File) => {
            localHandleChange(file);
            handleChange(file);
          }}
          name={name}
          disabled={false}
          maxSize={1}
          types={fileTypes}
          onSizeError={onSizeError}
          onTypeError={onTypeError}
          {...props}
        >
          <div
            className={classNames(
              "border-base-200 hover:border-Pink-1 focus:text-Black-1 mt-2 flex max-h-80 flex-col justify-center rounded-xl border-2 border-dashed text-center",
              className,
            )}
          >
            {error ? (
              <p className="text-error mt-1">Error: {errorMessages}</p>
            ) : (
              <>
                {file ? (
                  <div className={"flex h-full w-full flex-col p-3"}>
                    <div className={"relative h-full w-full overflow-hidden"}>
                      <Image alt={""} src={preview} fill={true} />
                    </div>
                    <div>
                      <p className="text-primary mt-1">File is accepted ✅</p>
                      {/* <p className={"truncate"}>File name: {file?.name}</p> */}
                    </div>
                  </div>
                ) : (
                  <div className={"flex flex-col items-center"}>
                    <PhotoIcon width={"50"} height={"50"} />
                  </div>
                )}
              </>
            )}
          </div>
        </FileUploader>
      </div>
      <div className="flex flex-col justify-center text-grayColor">
        <p>PNG, JPEG and JPG files only.</p>
        <p>Max size 1mb.</p>
      </div>
    </div>
  );
};
