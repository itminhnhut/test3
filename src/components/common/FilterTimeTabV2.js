import { useTranslation } from 'next-i18next';
import { useState, useEffect, Fragment } from 'react';
import { TIME_FILTER } from 'components/screens/WithdrawDeposit/constants';
import classNames from 'classnames';
import { CalendarFillIcon } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { convertDateToMs, formatTime } from 'redux/actions/utils';
import colors from 'styles/colors';
import DatePickerV2 from './DatePicker/DatePickerV2';
import { DateRangePicker } from 'react-date-range';

import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-US';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { differenceInMonths, subMonths } from 'date-fns';
import toast from 'utils/toast';
import { isNumber } from 'lodash';

const FilterTimeTabV2 = ({
    filter,
    setFilter,
    className,
    positionCalendar,
    isTabAll = false,
    timeFilter = TIME_FILTER,
    defaultFilter = null,
    isMobile = false,
    isDark,
    maxMonths
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [timeTab, setTimeTab] = useState(defaultFilter ? defaultFilter : isTabAll ? timeFilter[0].value : timeFilter[1].value);
    const [isCustomDay, setIsCustomDay] = useState(false);
    const [prevFilter, setPrevFilter] = useState(null);
    const {
        t,
        i18n: { language }
    } = useTranslation();

    useEffect(() => {
        const date = new Date();

        if (timeTab === 'all') {
            setFilter({
                range: {
                    startDate: null,
                    endDate: convertDateToMs(Date.now(), 'endOf'),
                    key: 'selection'
                }
            });
        } else if (timeTab !== 'custom') {
            let interval = null;
            switch (timeTab) {
                case 'd':
                    date.setDate(date.getDate() - 0);
                    break;
                case 'w':
                    date.setDate(date.getDate() - 6);
                    break;
                case 'm':
                    date.setDate(date.getDate() - 30);
                    interval = 'w';
                    break;
                default:
                    break;
            }
            date.toLocaleDateString();
            setFilter({
                range: {
                    startDate: convertDateToMs(date.getTime()), // date.getTime(),
                    endDate: convertDateToMs(Date.now(), 'endOf'), // Date.now(),
                    key: 'selection',
                    interval
                }
            });
            return;
        }
    }, [timeTab]);

    const [date, setDate] = useState();

    useEffect(() => {
        if (!filter?.range?.startDate && !filter?.range?.endDate) {
            setDate({ ...filter?.range, ...(!filter?.range?.key && { key: 'selection' }) });
        }
    }, [filter]);

    const handleOutside = () => {
        if (showPicker) {
            setTimeTab(prevFilter);
            setIsCustomDay(false);

            setDate(filter?.range);
            setShowPicker(false);
        }
    };

    const onDatesChange = (e) => {
        setDate({
            ...(e?.selection || {})
        });
    };

    const navigatorRenderer = (focusedDate, changeShownDate, props) => {
        return (
            <div className="flex items-center justify-between px-4 w-full absolute top-4">
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                        <ChevronLeft color={isDark ? colors.darkBlue5 : colors.gray['1']} size={20} />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                        <ChevronRight color={isDark ? colors.darkBlue5 : colors.gray['1']} size={20} />
                    </div>
                </div>
            </div>
        );
    };

    const onChange = (e) => {
        const monthsDifference = differenceInMonths(e?.selection?.startDate, e?.selection?.endDate);
        if (Math.abs(monthsDifference) >= 3) {
            toast({
                text: t('common:global_notice.max_months_filter', { maxMonths: maxMonths }),
                type: 'error',
                className: '!max-w-[358px] !min-w-[358px] !mx-auto mt'
            });
            throw 'error';
        } else {
            const startDate = e?.selection?.startDate;
            const endDate = e?.selection?.endDate;

            setFilter({
                range: {
                    startDate: startDate
                        ? convertDateToMs(isNumber(startDate) ? startDate : startDate.getTime())
                        : maxMonths
                        ? convertDateToMs(subMonths(new Date(), maxMonths))
                        : null, // date.getTime(),
                    endDate: endDate ? convertDateToMs(isNumber(endDate) ? endDate : endDate.getTime(), 'endOf') : null,
                    key: 'selection'
                }
            });
            setIsCustomDay(true);
        }
    };

    const onConfirm = () => {
        onChange({ selection: date });
        setShowPicker(false);
    };

    return (
        <Fragment>
            <div className={isMobile && 'w-full overflow-hidden'}>
                <div className={`flex gap-2 md:gap-3 items-center ${isMobile && 'overflow-x-auto no-scrollbar'} h-full ${className}`}>
                    {timeFilter.map((item, i) => {
                        if (i === 0 && !isTabAll) return null;
                        return (
                            <div
                                key={item.value}
                                onClick={() => {
                                    setTimeTab(item.value);
                                    setIsCustomDay(false);
                                }}
                                className={classNames(' border rounded-full cursor-pointer font-normal whitespace-nowrap', {
                                    'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== item.value,
                                    'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === item.value,
                                    'text-base px-5 py-3': !isMobile,
                                    'text-sm px-4 py-2': isMobile
                                })}
                            >
                                {t(item.localized)}
                            </div>
                        );
                    })}

                    {isMobile ? (
                        <div
                            onClick={() => {
                                setTimeTab((prev) => {
                                    setPrevFilter(prev);
                                    setShowPicker(true);
                                    return 'custom';
                                });
                            }}
                            className={classNames('border rounded-full cursor-pointer font-normal select-none flex items-center', {
                                'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== 'custom',
                                'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === 'custom',
                                'text-base px-5 py-3': !isMobile,
                                'text-sm px-4 py-2': isMobile
                            })}
                        >
                            {!isMobile && <CalendarFillIcon className="mr-2" color={timeTab === 'custom' ? colors.teal : '#8694b2'} size={20} />}
                            <span className="whitespace-nowrap">
                                {isCustomDay
                                    ? `${formatTime(filter?.range?.startDate, 'dd/MM/yyyy')} - ${formatTime(filter?.range?.endDate, 'dd/MM/yyyy')}`
                                    : t('common:custom_2')}
                            </span>
                        </div>
                    ) : (
                        <DatePickerV2
                            initDate={filter?.range}
                            onChange={onChange}
                            month={isMobile ? 1 : 2}
                            hasShadow
                            position={positionCalendar || 'right'}
                            onClickOutside={() => {
                                // TODO: not reload setTimeTab when not choose custom confirm
                                setTimeTab(prevFilter);
                                setIsCustomDay(false);
                            }}
                            text={
                                <div
                                    onClick={() =>
                                        setTimeTab((prev) => {
                                            setPrevFilter(prev);
                                            return 'custom';
                                        })
                                    }
                                    className={classNames('border rounded-full cursor-pointer font-normal select-none flex items-center', {
                                        'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== 'custom',
                                        'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === 'custom',
                                        'text-base px-5 py-3': !isMobile,
                                        'text-sm px-4 py-2': isMobile
                                    })}
                                >
                                    {!isMobile && <CalendarFillIcon className="mr-2" color={timeTab === 'custom' ? colors.teal : '#8694b2'} size={20} />}
                                    <span className="whitespace-nowrap">
                                        {isCustomDay
                                            ? `${formatTime(filter?.range?.startDate, 'dd/MM/yyyy')} - ${formatTime(filter?.range?.endDate, 'dd/MM/yyyy')}`
                                            : t('common:custom_2')}
                                    </span>
                                </div>
                            }
                        />
                    )}
                </div>
            </div>
            <ModalV2 isVisible={showPicker} onBackdropCb={handleOutside} wrapClassName="px-6" className="dark:bg-dark" isMobile={true}>
                <h1 className="text-xl font-semibold text-gray-15 dark:text-gray-4">{t('common:time')}</h1>
                <div className={classNames('date-range-picker flex flex-col justify-center mt-2 w-full !bg-transparent !border-none !shadow-none')}>
                    <DateRangePicker
                        className={classNames(`h-full px-[10px] w-full`)}
                        date={date}
                        ranges={[{ ...date, endDate: !date?.startDate && !date?.endDate ? new Date() : date?.endDate }]}
                        months={1}
                        onChange={onDatesChange}
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
                    />
                </div>
                <ButtonV2 onClick={onConfirm} className="mt-2 mb-8">
                    {t('common:global_btn.apply')}
                </ButtonV2>
            </ModalV2>
        </Fragment>
    );
};

export default FilterTimeTabV2;
