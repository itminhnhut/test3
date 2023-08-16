import classNames from 'classnames';
import { Popover, Transition } from '@headlessui/react';
import SvgFilter from 'components/svg/SvgFilter';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import vi from 'date-fns/locale/vi';
import en from 'date-fns/locale/en-US';
import { Fragment, useRef, useState } from 'react';
import CheckCircle from 'components/svg/CheckCircle';
import { addDays, format, isValid } from 'date-fns';
import styled from 'styled-components';
import colors from 'styles/colors';
import { DateRangePicker } from 'react-date-range';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import ButtonV2 from './ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import { ChevronLeft, ChevronRight } from 'react-feather';
import useOutsideClick from 'hooks/useOutsideClick';
import ModalV2 from './ModalV2';
import { useWindowSize } from 'utils/customHooks';

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

    .rdrDayDisabled {
        background-color: transparent;
    }

    .rdrMonth {
        max-width: calc(100% - 3rem);
        padding-left: 0;
        padding-right: 0;
    }
`;

const RangePopover = ({
    days,
    fallbackDay = 'd',
    language,
    active = {},
    onChange,
    popoverClassName = '',
    range = { startDate: undefined, endDate: new Date() },
    setRange,
    textPopoverClassName = ''
}) => {
    const popOverClasses = classNames('relative flex', popoverClassName);
    const { t } = useTranslation();
    const invalidRange = !isValid(range.startDate) || !isValid(range.endDate);
    const [internalRange, setInternalRange] = useState({ ...range, endDate: new Date() });
    const shouldShowPicker = active.value === 'custom' && invalidRange;
    const [showPicker, setShowPicker] = useState(shouldShowPicker);
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;
    const wrapperRef = useRef(null);
    const { width } = useWindowSize();
    const isMobile = width < 820;
    const isCustom = active.value === 'custom';
    const handleOutside = () => {
        if (showPicker) {
            if (invalidRange) {
                onChange(fallbackDay);
            }

            setShowPicker(false);
            // uncomment this code block to clear previous input

            // setInternalRange({
            //     ...range,
            //     endDate: range?.endDate || new Date()
            // });
            return;
        }
    };

    useOutsideClick(wrapperRef, () => !isMobile && handleOutside());
    const onConfirm = () => {
        setShowPicker(false);
        if (!isValid(internalRange.startDate) && !isValid(internalRange.endDate)) {
            onChange('d');
            // uncomment this code block to clear previous input

            // setInternalRange({
            //     ...range,
            //     endDate: range?.endDate || new Date()
            // });
            return;
        }
        if (!isValid(internalRange.startDate)) {
            internalRange.startDate = internalRange.endDate;
        } else if (!isValid(internalRange.endDate)) {
            internalRange.endDate = internalRange.startDate;
        }
        if (range?.startDate !== internalRange.startDate || range?.endDate !== internalRange.endDate) {
            setRange?.({ ...internalRange, endDate: addDays(internalRange.endDate, 1) });
        }
    };

    const showActive = () => {
        if (active.value === 'custom' && isValid(range?.startDate) && isValid(range?.endDate)) {
            return `${format(range.startDate, 'dd/MM/yyyy')} - ${format(addDays(range.endDate, -1), 'dd/MM/yyyy')}`;
        }
        return active[language];
    };

    const navigatorRenderer = (focusedDate, changeShownDate, props) => {
        return (
            <div className="flex items-center justify-between px-4 w-full absolute top-4 text-txtSecondary dark:text-txtSecondary-dark">
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
        <Popover className={popOverClasses}>
            {({ open, close }) => (
                <>
                    <Popover.Button>
                        <div className="flex justify-center items-center">
                            <div className="sm:hidden ml-auto">
                                <SvgFilter size={24} color="currentColor" className="text-txtPrimary dark:text-txtPrimary-dark" />
                            </div>
                            <div
                                className={`hidden sm:flex px-4 py-2 items-center gap-x-1 bg-gray-12 dark:bg-dark-2 font-semibold text-txtSecondary dark:text-txtSecondary-dark rounded-md !font-SF-Pro whitespace-nowrap ${textPopoverClassName}`}
                            >
                                {showActive()}
                                <ArrowDropDownIcon size={16} color="currentColor" className={`transition-all ${open ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </Popover.Button>
                    <div className="wrapper" ref={wrapperRef}>
                        <Transition
                            show={open && !showPicker}
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
                                                    if (day.value === 'custom') {
                                                        setShowPicker(true);
                                                    } else {
                                                        setRange?.({ startDate: undefined, endDate: undefined, key: 'selection' });
                                                    }
                                                    close();
                                                }}
                                                className={classNames(
                                                    'flex justify-between items-center py-3 my-1 px-4 cursor-pointer space-x-1',
                                                    'first:rounded-t-md last:rounded-b-md hover:bg-hover-1 dark:hover:bg-hover-dark'
                                                )}
                                            >
                                                <span className="whitespace-nowrap">{isCustom && isActive ? showActive() : day[language]}</span>
                                                {isActive && <CheckCircle color="currentColor" size={16} />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Popover.Panel>
                        </Transition>

                        {showPicker && (
                            <>
                                <div className="hidden mb:block">
                                    <Transition
                                        show
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <div className="date-range-picker flex flex-col justify-center mt-2 top-full !right-0 !absolute z-20 !w-auto">
                                            <DatePickerWrapper
                                                noDatePicked={
                                                    !internalRange.startDate || !internalRange.endDate || internalRange?.startDate === internalRange?.endDate
                                                }
                                                isDark={isDark}
                                            >
                                                <DateRangePicker
                                                    className="h-full px-[10px] w-full"
                                                    ranges={[internalRange]}
                                                    months={2}
                                                    // onChange={setInternalRange}
                                                    onChange={(e) => setInternalRange(e?.selection || {})}
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
                                                    maxDate={new Date()}
                                                />
                                            </DatePickerWrapper>
                                            <ButtonV2 className="mx-6 mt-2 mb-8 w-auto" onClick={onConfirm}>
                                                {t('common:global_btn.apply')}
                                            </ButtonV2>
                                        </div>
                                    </Transition>
                                </div>
                                {isMobile && (
                                    <ModalV2
                                        isVisible
                                        onBackdropCb={handleOutside}
                                        className=""
                                        isMobile
                                        containerClassName="!bg-black-800/[0.6] dark:!bg-black-800/[0.8]"
                                    >
                                        <div className="text-xl text-txtPrimary dark:text-txtPrimary-dark font-semibold">{t('nao:pool:duration')}</div>
                                        <div className="date-range-picker flex flex-col justify-center !bg-transparent !pt-8 !shadow-none !border-none max-w-[24em]ß">
                                            <DatePickerWrapper
                                                noDatePicked={
                                                    !internalRange.startDate || !internalRange.endDate || internalRange?.startDate === internalRange?.endDate
                                                }
                                                isDark={isDark}
                                            >
                                                <DateRangePicker
                                                    className="h-full px-[10px] w-full"
                                                    ranges={[internalRange]}
                                                    months={1}
                                                    // onChange={setInternalRange}
                                                    onChange={(e) => setInternalRange(e?.selection || {})}
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
                                                    maxDate={new Date()}
                                                />
                                            </DatePickerWrapper>
                                            <ButtonV2 className="mb-4 w-full" onClick={onConfirm}>
                                                {t('common:global_btn.apply')}
                                            </ButtonV2>
                                        </div>
                                    </ModalV2>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </Popover>
    );
};

export default RangePopover;
