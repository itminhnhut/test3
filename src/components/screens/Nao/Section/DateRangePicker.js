import React, { useState, useEffect, Fragment, useRef } from 'react';
import colors from 'styles/colors'
import { useTranslation } from 'next-i18next';
import { formatTime } from 'redux/actions/utils';
import { useOutsideAlerter, ButtonNao } from 'components/screens/Nao/NaoStyle';
import { Transition } from '@headlessui/react';
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { DateRangePicker, Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { ChevronLeft, ChevronRight } from 'react-feather'

const ReactDateRangePicker = ({ date, onChange, dateFormat = 'yyyy-MM-dd', customLabel, prefix, className = '', onClose }) => {
    const { t, i18n: { language } } = useTranslation();
    const [showPicker, setShowPicker] = useState(false)
    const [datePicker, setDatePicker] = useState(date)
    const [isRange, setIsRange] = useState(false);
    const wrapperRef = useRef(null)


    const handleOutside = () => {
        setShowPicker(false)
    }

    useEffect(() => {
        if (onClose && !showPicker) onClose()
    }, [showPicker])

    useOutsideAlerter(wrapperRef, handleOutside)

    useEffect(() => {
        setDatePicker(date)
    }, [showPicker, date])



    const onDatesChange = (e) => {
        if (isRange) {
            setDatePicker(e[date.key])
        } else {
            setDatePicker({
                key: date.key,
                startDate: e,
                endDate: e,
            })
        }
    }

    const onConfirm = () => {
        if (onChange) onChange(datePicker)
        setShowPicker(false)
    }

    const Component = isRange ? DateRangePicker : Calendar

    return (
        <div className={`flex flex-col space-y-2 bg-nao-bg3 rounded-xl`}>
            <div ref={wrapperRef} className="date-range-picker relative ">
                <div onClick={() => setShowPicker(true)}>
                    {customLabel ? customLabel() :
                        <div>
                            {prefix} {datePicker?.startDate ? formatTime(datePicker?.startDate, dateFormat) + ' - ' + formatTime(datePicker?.endDate, dateFormat) : ''}
                        </div>
                    }
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
                    <div className={`${className} right-0 absolute z-10 top-[3.5rem] bg-nao-bg3 rounded-xl pt-5`}>
                        <div className="flex items-center justify-center bg-onus-bg3 rounded-lg mx-5 text-xs font-semibold p-[2px]">
                            <div onClick={() => setIsRange(false)} className={`py-[5px] cursor-pointer rounded-lg w-full h-full text-center ${!isRange ? 'bg-onus-bg2' : 'text-onus-grey'}`} >
                                {t('common:one_day')}
                            </div>
                            <div onClick={() => setIsRange(true)} className={`py-[5px] cursor-pointer rounded-lg w-full h-full text-center ${isRange ? 'bg-onus-bg2' : 'text-onus-grey'}`}  >
                                {t('common:several_days')}
                            </div>
                        </div>
                        <Component
                            className={`relative h-full ${!isRange ? 'single-select' : ''}`}
                            date={datePicker.startDate}
                            ranges={[datePicker]}
                            months={1}
                            onChange={onDatesChange}
                            moveRangeOnFirstSelection={!isRange}
                            direction="horizontal"
                            staticRanges={[]}
                            inputRanges={[]}
                            weekStartsOn={0}
                            rangeColors={[colors.nao.blue2]}
                            editableDateInputs={true}
                            retainEndDateOnFirstSelection
                            navigatorRenderer={navigatorRenderer}
                            locale={language === 'vi' ? vi : en}
                        />
                        <div className="px-5 pb-5">
                            <ButtonNao onClick={onConfirm}>{t('common:confirm_2')}</ButtonNao>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    );
};

export const navigatorRenderer = (focusedDate, changeShownDate, props) => {
    const year = new Date(focusedDate).getFullYear()
    return (
        <div className="flex items-center justify-between absolute px-4 w-full top-[3px] sm:top-[23px]">
            <div className="flex items-center space-x-2">
                <div className="cursor-pointer rotate-180" onClick={() => changeShownDate(year - 1, 'setYear')}>
                    <ChevronsIcon />
                </div>
                <div className="cursor-pointer" onClick={() => changeShownDate(-1, 'monthOffset')}>
                    <ChevronLeft color={colors.onus.bg2} size={20} />
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="cursor-pointer" onClick={() => changeShownDate(1, 'monthOffset')}>
                    <ChevronRight color={colors.onus.bg2} size={20} />
                </div>
                <div className="cursor-pointer" onClick={() => changeShownDate(year + 1, 'setYear')}>
                    <ChevronsIcon />
                </div>
            </div>
        </div>
    )
}

export const ChevronsIcon = () => {
    return (
        <div className="flex items-center">
            <ChevronRight color={colors.onus.bg2} size={18} className="-mr-3" />
            <ChevronRight color={colors.onus.bg2} size={18} />
        </div>
    )
}


export default ReactDateRangePicker;