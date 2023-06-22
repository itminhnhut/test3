import ModalV2 from 'components/common/V2/ModalV2';
import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-US';
import CalendarIcon from 'components/svg/CalendarIcon';
import React, { useRef, useState } from 'react';
import { Calendar } from 'react-date-range';
import { formatTime, isFunction } from 'redux/actions/utils';
import colors from 'styles/colors';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { ChevronRight, ChevronLeft, X } from 'react-feather';

const MobileDatePicker = ({ initDate, onChange, months, wrapperClassname, text, colorX = '#e2e8f0', onClickOutside, minDate, maxDate }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState();
    const [theme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const handleOutside = () => {
        if (showPicker) {
            if (isFunction(onClickOutside)) onClickOutside();
            setShowPicker(false);
        }
    };

    const onDatesChange = (e) => {
        setDate(e);
        // handleOutside();
    };

    const onConfirm = () => {
        if (!initDate || new Date(initDate).getDate() !== date.getDate()) {
            onChange(date);
        }
        setShowPicker(false);
    };

    const navigatorRenderer = (focusedDate, changeShownDate, props) => {
        return (
            <div className="flex items-center justify-between w-full max-w-[24em] absolute top-4 left-0 right-0 m-auto px-2 text-txtSecondary dark:text-txtSecondary-dark">
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                        <ChevronLeft color="currentColor" size={20} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                        <ChevronRight color="currentColor" size={20} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={classNames('relative', wrapperClassname)}>
            {text ? (
                <div onClick={() => setShowPicker(true)}>{text}</div>
            ) : (
                <div
                    className={classNames(
                        'relative py-3 text-sm px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer',
                        {
                            '!border-teal': showPicker
                        }
                    )}
                    onClick={() => setShowPicker(true)}
                >
                    <div className="flex flex-1 items-center justify-between">
                        <div className={classNames('px-2 leading-5', { 'text-txtSecondary dark:text-txtSecondary-dark': !date?.startDate && !date?.endDate })}>
                            {date ? formatTime(date, 'dd/MM/yyyy') : 'DD/MM/YYYY'}
                        </div>
                        {date ? (
                            <div className="" onClick={() => onDatesChange(null)}>
                                <X size={16} color={colorX} />
                            </div>
                        ) : (
                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                <CalendarIcon color="currentColor" />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ModalV2
                isVisible={showPicker}
                onBackdropCb={() => setShowPicker(false)}
                className="!min-w-0 !translate-x-0 !translate-y-0 !max-w-none !top-auto !left-0 !bottom-0 !rounded-none"
            >
                <h3 className="mb-4 text-xl font-semibold">{t('common:time')}</h3>
                <div className="date-range-picker flex flex-col justify-center mt-2 w-full !shadow-none !p-0 !rounded-none !border-none !bg-transparent">
                    <DatePickerWrapper noDatePicked={date?.startDate === date?.endDate} isDark={theme === THEME_MODE.DARK}>
                        <Calendar
                            className="h-full p-0 single-select w-full"
                            date={date}
                            months={months ?? 1}
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
                    <ButtonV2 onClick={onConfirm} className="mt-2 w-auto">
                        {t('common:global_btn.apply')}
                    </ButtonV2>
                </div>
            </ModalV2>
        </div>
    );
};

const DatePickerWrapper = styled.div`
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
    padding: 0;

    .rdrMonth {
        padding: 0;
        .rdrMonthName {
            padding-left: 0;
            padding-right: 0;
        }
    }
`;

export default MobileDatePicker;
