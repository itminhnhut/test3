import classNames from "classnames";
import { Popover, Transition } from '@headlessui/react';
import SvgFilter from "components/svg/SvgFilter";
import { ArrowDropDownIcon } from "components/svg/SvgIcon";
import { Fragment } from "react";
import CheckCircle from "components/svg/CheckCircle";
import { days } from "../Section/NaoPerformance";
import { format } from "date-fns";


const RangePopover = ({ language, active = {}, onChange, popoverClassName = '', range = { startDate: undefined, endDate: undefined } }) => {
    const popOverClasses = classNames('relative flex', popoverClassName);

    const showActive = () => {
        if (active.value === 'custom' && range?.startDate && range?.endDate) {
            return `${format(range.startDate, 'dd/MM/yyyy')} - ${format(range.endDate, 'dd/MM/yyyy')}`;
        }
        return active[language];
    }

    return (
        <Popover className={popOverClasses}>
            {({ open, close }) => (
                <>
                    <Popover.Button>
                        <div className="h-10 flex justify-center items-center">
                            <div className="sm:hidden">
                                <SvgFilter size={24} color="currentColor" className="text-txtPrimary dark:text-txtPrimary-dark" />
                            </div>
                            <div className="hidden sm:flex px-4 py-3 items-center gap-x-1 bg-gray-12 dark:bg-dark-2 font-semibold text-txtSecondary dark:text-txtSecondary-dark rounded-md !font-SF-Pro !text-base">
                                {showActive()}
                                <ArrowDropDownIcon size={16} color="currentColor" className={`transition-all ${open ? 'rotate-180' : ''}`} />
                            </div>
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
                        <Popover.Panel className="absolute min-w-[8rem] sm:min-w-[10rem] shadow-onlyLight top-8 left-auto right-0 z-50 bg-bgPrimary dark:bg-dark-4 border border-divider dark:border-divider-dark rounded-md mt-3">
                            <div className="text-sm sm:text-base flex flex-col text-txtPrimary dark:text-txtPrimary-dark sm:py-3">
                                {days.map((day, index) => {
                                    const isActive = active.value === day.value;
                                    return (
                                        <div
                                            key={day.value}
                                            onClick={() => {
                                                onChange(day.value);
                                                close();
                                            }}
                                            className={classNames(
                                                'flex justify-between items-center py-3 my-1 px-4 cursor-pointer',
                                                'first:rounded-t-md last:rounded-b-md hover:bg-hover-1 dark:hover:bg-hover-dark'
                                            )}
                                        >
                                            <span>{day[language]}</span>
                                            {isActive && <CheckCircle color="currentColor" size={16} />}
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

export default RangePopover