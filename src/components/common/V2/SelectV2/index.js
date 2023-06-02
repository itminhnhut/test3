import React, { useMemo, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'components/svg/ChevronDown';
import classNames from 'classnames';
const SelectV2 = ({ options = [], value, onChange, keyExpr = 'value', displayExpr = 'title', className = '', position = 'bottom' }) => {
    const title = useMemo(() => {
        return options.find((rs) => rs?.[keyExpr] === value)?.[displayExpr];
    }, [options, value, keyExpr, displayExpr]);

    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button className={`w-full h-11 sm:h-12 bg-gray-10 dark:bg-dark-2 rounded-md px-3 ${className}`}>
                        <div className="flex items-center justify-between">
                            <div className="w-full text-left whitespace-nowrap">{title}</div>
                            <ChevronDown className={`${open ? '!rotate-0' : ''} transition-all`} />
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
                        <Popover.Panel
                            className={classNames('absolute right-0 z-[99] w-full', { 'top-0 mt-2': position === 'bottom', 'bottom-full mb-2': position === 'top' })}
                        >
                            <div className="overflow-hidden rounded-md shadow-card_light border-[0.5px] border-divider dark:border-divider-dark bg-white dark:bg-darkBlue-3">
                                <div className="relative py-2">
                                    {options.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={classNames('px-4 py-2 hover:bg-hover dark:hover:bg-hover-dark text-txtSecondary dark:text-txtSecondary-dark cursor-pointer', {
                                                    '!text-txtPrimary dark:!text-white font-semibold': value === item?.[keyExpr]
                                                })}
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
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default SelectV2;
