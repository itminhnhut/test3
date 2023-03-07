import React, { useRef, useState, Fragment, useMemo } from 'react';
import colors from 'styles/colors';
import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-US';
import { DateRangePicker, Calendar } from 'react-date-range';
import { ChevronRight, ChevronLeft, X } from 'react-feather';
import { Transition } from '@headlessui/react';
import useOutsideClick from 'hooks/useOutsideClick';
import CalendarIcon from 'components/svg/CalendarIcon';
import { useTranslation } from 'next-i18next';
import { formatTime } from 'redux/actions/utils';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const DatePicker = ({ date, isCalendar, onChange, month, wrapperClassname, className, text, showConfirmButton, dateRangeClassName }) => {
    const [showPicker, setShowPicker] = useState(false);
    const wrapperRef = useRef(null);

    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [theme] = useDarkMode();

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
            <div className="flex items-center justify-between px-4 w-full absolute top-4">
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                        <ChevronLeft color={theme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} size={20} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                        <ChevronRight color={theme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} size={20} />
                    </div>
                </div>
            </div>
        );
    };

    const onClear = (e) => {
        e.stopPropagation();

        isCalendar
            ? onDatesChange(null)
            : onDatesChange({
                  [date['key']]: {
                      startDate: null,
                      endDate: new Date(),
                      key: date['key']
                  }
              });
    };

    const issetValue = isCalendar ? date : date?.startDate;

    return (
        <div className={classNames('relative', wrapperClassname)} ref={wrapperRef}>
            {text ? (
                <div onClick={() => setShowPicker(!showPicker)}>{text}</div>
            ) : (
                <div
                    className={classNames(
                        'relative py-3 text-sm px-3 flex items-center justify-between rounded-md w-auto cursor-pointer  bg-gray-12 dark:bg-dark-2',
                        {
                            '!border-teal': showPicker
                        }
                    )}
                    onClick={() => setShowPicker(!showPicker)}
                >
                    <div className="flex flex-1 items-center justify-between">
                        <div className="px-2 leading-5">
                            {isCalendar && (date ? formatTime(date, 'dd/MM/yyyy') : 'DD/MM/YYYY')}
                            {!isCalendar &&
                                (date?.startDate
                                    ? formatTime(date?.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(date?.endDate, 'dd/MM/yyyy')
                                    : 'DD/MM/YYYY - DD/MM/YYYY')}
                        </div>

                        {issetValue ? (
                            <div className="" onClick={onClear}>
                                <X size={16} />
                            </div>
                        ) : (
                            <CalendarIcon color={theme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} />
                        )}
                    </div>
                </div>
            )}
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
                <div
                    className={classNames(
                        {
                            '!left-0 !absolute z-20 !w-auto': month && !text,
                            '!right-0 !absolute z-20 !w-auto': text,
                            [className]: className,
                            'flex-col': showConfirmButton
                        },
                        'date-range-picker flex justify-center mt-2 w-full'
                    )}
                >
                    <Component
                        className={classNames(`h-full ${isCalendar ? 'single-select' : ''} w-full `)}
                        date={date}
                        ranges={!isCalendar ? [date] : []}
                        months={month ?? 1}
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
                        color={colors.teal}
                        monthDisplayFormat="MMMM yyyy"
                    />

                    {showConfirmButton &&
                        (typeof showConfirmButton === 'function' && React.isValidElement(showConfirmButton()) ? (
                            showConfirmButton({ onDismiss: handleOutside })
                        ) : (
                            <div className="p-4">
                                <ButtonV2 onClick={handleOutside}>Confirm</ButtonV2>
                            </div>
                        ))}
                </div>
            </Transition>
        </div>
    );
};
export default DatePicker;
