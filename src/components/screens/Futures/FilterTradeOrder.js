import React, {Fragment, useMemo} from "react";
import classNames from "classnames";
import {Popover, Transition} from "@headlessui/react";
import {ChevronDown} from "react-feather";

export const FilterTradeOrder = ({label = '', options = [], value = '', onChange}) => {
    const currentOption = useMemo(() => options.find(o => o.value === value), [value])

    const Option = ({value: optionValue, label: optionLabel, disabled, close}) => {
        return <span
            className={
                classNames(`text-txtSecondary dark:text-txtSecondary-dark py-[1px] my-[2px] hover:text-teal cursor-pointer`, {
                    '!text-txtPrimary !dark:text-txtPrimary-dark': optionValue === value,
                    '!pointer-events-none': disabled
                })
            }
            onClick={() => {
                if (optionValue === value) {
                    onChange('')
                } else {
                    onChange(optionValue)
                }
                close()
            }}
        >{optionLabel || optionValue}</span>
    }
    return <Popover className="relative">
        {({open, close}) => (
            <>
                <Popover.Button>
                    <div
                        className="px-[8px] flex items-center py-[1px] mr-2 text-xs font-medium cursor-pointer hover:opacity-80 rounded-md text-txtSecondary dark:text-txtSecondary-dark">
                        {currentOption?.label || currentOption?.value || label}
                        <ChevronDown size={16} className="ml-1"/>
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
                    <Popover.Panel className="absolute left-0 z-50 bg-white dark:bg-bgPrimary-dark">
                        <div
                            className="min-w-[134px] max-h-[204px] overflow-y-auto pl-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                            {options.map(option => {
                                return <Option key={option.value} value={option.value} label={option.label} close={close}/>
                            })}
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
        )}
    </Popover>
}
