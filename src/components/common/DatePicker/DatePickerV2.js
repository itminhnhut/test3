import React, { useRef, useState, Fragment, useMemo, useEffect, useCallback } from 'react';
import colors from 'styles/colors';
import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-US';
import { useSelector } from 'react-redux';
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
import styled from 'styled-components';
import { isFunction } from 'lodash';
import { differenceInMonths } from 'date-fns';

const DatePickerV2 = ({
    initDate,
    isCalendar,
    onChange,
    month,
    position,
    wrapperClassname,
    wrapperClassNameDate,
    wrapperClassNameContent,
    text,
    colorX = '#e2e8f0',
    onClickOutside,
    customHeaderCalendar,
    maxMonths,
    minDate,
    maxDate,
    ignoreAuth,
    placeHolder
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const wrapperRef = useRef(null);

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { user } = useSelector((state) => state.auth);
    const auth = user || ignoreAuth;

    const [theme] = useDarkMode();

    // Handle custom
    const [date, setDate] = useState();

    const handleOutside = () => {
        if (showPicker) {
            if (isFunction(onClickOutside)) onClickOutside();
            if (!isCalendar) {
                setDate({ ...initDate, ...(!initDate?.key && { key: 'selection' }) });
            }
            setShowPicker(false);
        }
    };

    useOutsideClick(wrapperRef, handleOutside);
    const Component = !isCalendar ? DateRangePicker : Calendar;

    useEffect(() => {
        if (!initDate?.startDate && !initDate?.endDate && !isCalendar) {
            setDate({ ...initDate, ...(!initDate?.key && { key: 'selection' }) });
        } else if (isCalendar) {
            setDate(initDate);
        }
    }, [initDate]);

    const onDatesChange = (e) => {
        if (isCalendar) {
            onChange(e);
            handleOutside();
        } else {
            setDate({
                ...(e?.selection || {})
            });
        }
    };

    const onConfirm = () => {
        if (initDate?.startDate !== date?.startDate || initDate !== date?.endDate) onChange({ selection: date });
        setShowPicker(false);
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

    const issetValue = isCalendar ? date : date?.startDate || date?.endDate;

    const clearInputData = () => {
        const selection = {
            startDate: null,
            endDate: null,
            key: date?.key || 'selector'
        };
        setDate({ ...selection });
        if (!showPicker) onChange({ ...selection });
    };

    // Handle X Close button
    const flag = useRef(false);

    const onHandleClick = (key) => {
        switch (key) {
            case 'clear':
                flag.current = true;

                if (isCalendar) {
                    onDatesChange(null);
                } else {
                    clearInputData();
                }
                break;
            case 'show_modal':
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                setShowPicker(!showPicker);
                break;
            default:
                break;
        }
    };

    return (
        <div className={classNames('relative', wrapperClassname)} ref={wrapperRef}>
            {text ? (
                <div className={classNames({ 'cursor-not-allowed': !auth })} onClick={() => auth && setShowPicker(!showPicker)}>
                    {text}
                </div>
            ) : (
                <div
                    className={classNames(
                        'relative py-3 text-sm px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer',
                        {
                            '!border-teal': showPicker
                        }
                    )}
                    onClick={() => onHandleClick('show_modal')}
                >
                    <div className={classNames('flex flex-1 items-center justify-between max-w-full', wrapperClassNameContent)}>
                        <div
                            className={classNames(
                                'px-2 leading-5',
                                { 'dark:text-gray-7 text-gray-1': !date?.startDate && !date?.endDate },
                                wrapperClassNameDate
                            )}
                        >
                            {isCalendar && (date ? formatTime(date, 'dd/MM/yyyy') : 'DD/MM/YYYY')}
                            {!isCalendar &&
                                (date?.startDate ? formatTime(date?.startDate, 'dd/MM/yyyy') : 'DD/MM/YYYY') +
                                    ' - ' +
                                    (date?.endDate ? formatTime(date?.endDate, 'dd/MM/yyyy') : 'DD/MM/YYYY')}
                        </div>
                        {issetValue ? (
                            <div className="" onClick={() => onHandleClick('clear')}>
                                <X size={16} color={colorX} />
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
                    className={classNames('date-range-picker flex flex-col justify-center mt-2 w-full', {
                        '!left-0 !absolute z-50 !w-auto': position === 'left',
                        '!right-0 !absolute z-50 !w-auto': position === 'right',
                        'absolute left-1/2 z-50 !w-auto -translate-x-1/2': position === 'center'
                    })}
                >
                    {customHeaderCalendar && customHeaderCalendar()}
                    <DatePickerWrapper noDatePicked={date?.startDate === date?.endDate} isDark={theme === THEME_MODE.DARK}>
                        <Component
                            className={classNames(`h-full px-[10px] ${isCalendar ? 'single-select' : ''} w-full`)}
                            date={date}
                            ranges={!isCalendar ? [{ ...date, endDate: !date?.startDate && !date?.endDate ? new Date() : date?.endDate }] : []}
                            months={month ?? 1}
                            onChange={onDatesChange}
                            // moveRangeOnFirstSelection={isCalendar}
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
                            moveRangeOnFirstSelection={false}
                            showSelectionPreview={true}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </DatePickerWrapper>
                    <ButtonV2
                        disabled={maxMonths && Math.abs(differenceInMonths(date?.startDate, date?.endDate)) >= maxMonths}
                        onClick={onConfirm}
                        className="mx-6 mt-2 mb-8 w-auto"
                    >
                        {t('common:global_btn.apply')}
                    </ButtonV2>
                </div>
            </Transition>
        </div>
    );
};
export default DatePickerV2;

const DatePickerWrapper = styled.div`
    .rdrMonthName {
        text-transform: capitalize;
    }
    ${({ noDatePicked, isDark }) =>
        noDatePicked
            ? `
            .rdrInRange {
                background-color: transparent !important;
            }
            .rdrDayNumber {
                color: ${isDark ? colors.gray['4'] : colors.gray['15']} !important;
            }

`
            : null};
`;
