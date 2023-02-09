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

const DatePicker = ({ date, isCalendar, onChange, allwaysOpen = false, month, hasShadow, wrapperClassname, text, isnamiv2 = false }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const wrapperRef = useRef(null);
    const [showPicker, setShowPicker] = useState(allwaysOpen);
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
        isCalendar ? onDatesChange(null) : onDatesChange({ [date['key']]: { startDate: null, endDate: new Date(), key: date['key'] } });
    };

    const issetValue = isCalendar ? date : date?.startDate;

    return (
        <div className={classNames("relative", wrapperClassname)} ref={wrapperRef}>
            {allwaysOpen ? null :
                text ? <div onClick={() => setShowPicker(!showPicker)}>{text}</div> : <div
                    className={classNames(
                        `relative py-2 text-sm font-medium px-3 flex items-center justify-between bg-dark-2 rounded-md w-auto`,
                        {
                            '!border-teal': showPicker,
                            'bg-hover-dark border-none !rounded-md text-gray-6': isnamiv2
                        },
                    )}
                >
                    <div className="flex items-center w-auto" onClick={() => setShowPicker(!showPicker)}>
                        <CalendarIcon />
                        <div className={classNames("text-darkBlue leading-6 px-2", { 'text-gray-6': isnamiv2 })}>
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
                </div>}
            <Transition
                show={allwaysOpen || showPicker}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <div
                    className={classNames("relative date-range-picker flex justify-center mt-2 w-full", isnamiv2 ? 'black-background' : 'nami-exchange',
                        {
                            'white-background': allwaysOpen,
                            '!left-0 !absolute z-20 !w-auto !bg-white': month && !text,
                            '!right-0 !absolute z-20 !w-auto !bg-white': text,
                        })}
                >
                    <Component
                        className={classNames(`relative h-full ${isCalendar ? 'single-select' : ''} w-full`, { 'datepicker-shadow': hasShadow, 'black-background': isnamiv2 })}
                        date={date}
                        ranges={!isCalendar ? [date] : []}
                        months={month ?? 1}
                        onChange={onDatesChange}
                        moveRangeOnFirstSelection={isCalendar}
                        direction="horizontal"
                        staticRanges={[]}
                        inputRanges={[]}
                        weekStartsOn={0}
                        rangeColors={[isnamiv2 ? colors.teal : colors.teal]}
                        editableDateInputs={true}
                        retainEndDateOnFirstSelection
                        navigatorRenderer={navigatorRenderer}
                        locale={language === 'vi' ? vi : en}
                        isnamiv2={isnamiv2}
                    />
                </div>
            </Transition>
        </div>
    );
};
export default DatePicker;
