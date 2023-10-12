import React, { useMemo, Fragment } from "react";
import colors from "styles/colors";
import { Popover, Transition } from "@headlessui/react";
import { ChevronDown } from "react-feather";
import SortIcon from 'components/screens/Nao_futures/SortIcon';

const Selectbox = ({
    options = [],
    value,
    onChange,
    keyExpr = "value",
    displayExpr = "title",
    className = "",
}) => {
    const title = useMemo(() => {
        return options.find((rs) => rs?.[keyExpr] === value)?.[displayExpr];
    }, [options, value, keyExpr, displayExpr]);

    return (
        <Popover className="relative" style={{ flexGrow: 1 }}>
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={`w-full h-[44px] bg-gray-12 dark:bg-dark-2 rounded-md px-4 ${className}`}
                    >
                        <div className="flex items-center justify-between text-sm font-medium">
                            <div className="w-full text-left whitespace-nowrap">{title}</div>
                            <SortIcon size={20} color="currentColor" activeColor="currentColor" className="text-gray-1 dark:text-gray-7" />
                            {/* <ChevronDown
                                color={colors.onus.grey}
                                size={16}
                                className={`${
                                    open ? "rotate-180" : ""
                                } transition-all`}
                            /> */}
                        </div>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="w-full absolute z-50 bg-gray-12 dark:bg-dark-2 rounded-md mt-3">
                            <div className="overflow-y-auto overflow-x-hidden px-3 py-4 shadow-onlyLight font-medium text-sm flex flex-col space-y-2">
                                {options.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={`${
                                                value === item?.[keyExpr]
                                                    ? ""
                                                    : "text-txtSecondary dark:text-txtSecondary-dark"
                                            } py-[2px]`}
                                            onClick={() => {
                                                onChange(item?.[keyExpr], item);
                                                close();
                                            }}
                                        >
                                            {item?.[displayExpr]}
                                        </div>
                                    );
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default Selectbox;
