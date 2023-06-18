import {QuestionMarkCircleIcon} from "@heroicons/react/20/solid";
import classNames from "classnames";
import {ReactNode} from "react";

export const Label = ({label, className}: { label: string; className?: string }) => (
    <label className="label">
        <span className={classNames("input-label", className)}>{label}</span>
    </label>
);
export const LabeledInput = ({
                                 label,
                                 children,
                                 className,
                             }: {
    label?: string;
    children: ReactNode;
    className?: string;
}) => (
    <div className={classNames("flex flex-col border-2 border-lightGrayColor py-2 rounded-md pt-1", className)}>
        {label && <Label label={label}/>}
        <div className="mt-1">{children}</div>
    </div>
);
