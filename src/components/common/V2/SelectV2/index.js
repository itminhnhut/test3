import React, { useMemo, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'components/svg/ChevronDown';
import classNames from 'classnames';
const SelectV2 = ({
    options = [],
    value,
    onChange,
    name = '',
    keyExpr = 'value',
    displayExpr = 'title',
    className = '',
    popoverPanelClassName = '',
    popoverClassName = '',
    position = 'bottom',
    optionClassName,
    wrapperClassName,
    chevronStyle,
    activeIcon,
    prefix
}) => {
    const title = useMemo(() => {
        return options.find((rs) => rs?.[keyExpr] === value)?.[displayExpr] ?? '';
    }, [options, value, keyExpr, displayExpr]);

    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button className={classNames('w-full h-11 sm:h-12 bg-gray-10 dark:bg-dark-2 rounded-md px-3', className)}>
                        <div className="flex items-center justify-between">
                            <div className="w-full text-left whitespace-nowrap">
                                {prefix}
                                {title}
                            </div>
                            <ChevronDown
                                className={classNames('transition-all', {
                                    '!rotate-0': open
                                })}
                                {...chevronStyle}
                            />
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
                            className={classNames(
                                'absolute right-0 z-[99] w-full',
                                {
                                    'top-full mt-2': position === 'bottom',
                                    'bottom-full mb-2': position === 'top'
                                },
                                popoverPanelClassName
                            )}
                        >
                            <div
                                className={classNames(
                                    'overflow-hidden rounded-md shadow-card_light border-[0.5px] border-divider dark:border-divider-dark bg-white dark:bg-darkBlue-3',
                                    popoverClassName
                                )}
                            >
                                <div className={classNames('relative py-2', wrapperClassName)}>
                                    {options.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={classNames(
                                                    'px-4 py-2 hover:bg-hover dark:hover:bg-hover-dark cursor-pointer',
                                                    {
                                                        'text-txtPrimary dark:text-txtPrimary-dark font-semibold': value === item?.[keyExpr],
                                                        'text-txtSecondary dark:text-txtSecondary-dark': value !== item?.[keyExpr]
                                                    },
                                                    {
                                                        'dark:!text-gray-4 !text-gray-15 font-normal': value === item?.[keyExpr] && name === 'customer'
                                                    },
                                                    optionClassName
                                                )}
                                                onClick={() => {
                                                    onChange(item?.[keyExpr], item);
                                                    close();
                                                }}
                                            >
                                                <span>{item?.[displayExpr] ?? ''}</span>
                                                {value === item?.[keyExpr] ? activeIcon : undefined}
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
