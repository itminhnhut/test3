import React, { useEffect, useRef, useState, Fragment, useMemo } from 'react';
import colors from 'styles/colors';
import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-US';
import { DateRangePicker, Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { ChevronRight, ChevronLeft, X } from 'react-feather';
import { Transition } from '@headlessui/react';
import useOutsideClick from 'hooks/useOutsideClick';
import CalendarIcon from 'components/svg/CalendarIcon';
import { useTranslation } from 'next-i18next';
import { formatTime } from 'redux/actions/utils';
import classNames from 'classnames';

const DatePicker = ({ date, isCalendar, onChange }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const wrapperRef = useRef(null);
    const [showPicker, setShowPicker] = useState(false);
    const handleOutside = () => {
        setShowPicker(false);
    };
    useOutsideClick(wrapperRef, handleOutside);
    const Component = !isCalendar ? DateRangePicker : Calendar;

    const onDatesChange = (e) => {
        onChange(e);
        if (isCalendar) {
            handleOutside();
        }
    };

    const navigatorRenderer = (focusedDate, changeShownDate, props) => {
        return (
            <div className="flex items-center justify-between absolute px-4 w-full top-[12px]">
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                        <ChevronLeft color={colors.onus.bg2} size={20} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                        <ChevronRight color={colors.onus.bg2} size={20} />
                    </div>
                </div>
            </div>
        );
    };

    const onClear = () => {
        isCalendar ? onDatesChange(null) : onDatesChange({ [date['key']]: { startDate: null, endDate: new Date(''), key: date['key'] } });
    };

    const issetValue = isCalendar ? date : date?.startDate;

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className={classNames(
                    `py-[9px] text-sm font-medium px-3 flex items-center justify-between bg-gray-4 rounded-[4px] border-[0.5px] border-white`,
                    {
                        '!border-teal': showPicker
                    }
                )}
            >
                <div className="flex items-center w-full" onClick={() => setShowPicker(true)}>
                    <CalendarIcon />
                    <div className="text-darkBlue leading-6 px-2">
                        {isCalendar && (date ? formatTime(date, 'dd/MM/yyyy') : 'DD/MM/YYYY')}

                        {!isCalendar &&
                            (date?.startDate
                                ? formatTime(date?.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(date?.endDate, 'dd/MM/yyyy')
                                : 'DD/MM/YYYY - DD/MM/YYYY')}
                    </div>
                </div>
                {issetValue && (
                    <div className="" onClick={onClear}>
                        <X size={16} />
                    </div>
                )}
            </div>
            <Transition
                show={showPicker}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <div className="relative date-range-picker nami-exchange flex justify-center mt-2 w-full">
                    <Component
                        className={`relative h-full ${isCalendar ? 'single-select' : ''} w-full`}
                        date={date}
                        ranges={!isCalendar ? [date] : []}
                        months={1}
                        onChange={onDatesChange}
                        moveRangeOnFirstSelection={isCalendar}
                        direction="horizontal"
                        staticRanges={[]}
                        inputRanges={[]}
                        weekStartsOn={0}
                        rangeColors={[colors.teal]}
                        editableDateInputs={true}
                        retainEndDateOnFirstSelection
                        navigatorRenderer={navigatorRenderer}
                        locale={language === 'vi' ? vi : en}
                    />
                </div>
            </Transition>
        </div>
    );
};
export default DatePicker;
