import React, { useState, useEffect } from 'react';
import Modal from 'components/common/ReModal';
import { useTranslation } from 'next-i18next';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import { ButtonNao } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import CalenderIcon from 'components/svg/CalenderIcon';
import { formatTime } from 'redux/actions/utils';
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
import { DateRangePicker, Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import colors from 'styles/colors';
import { navigatorRenderer } from './DateRangePicker'

const NaoFilter = ({ onCancel, onConfirm, filter, days, range }) => {
    const { t, i18n: { language } } = useTranslation();
    const [data, setData] = useState(filter);
    const [customTime, setCustomTime] = useState(false)
    const [date, setDate] = useState(range)
    const [showPicker, setShowPicker] = useState(false)

    const onReset = () => {
        setData(filter)
        setDate(range)
    }

    const onChangePicker = (e) => {
        const start = new Date(e?.startDate).getTime()
        const end = new Date(e?.endDate).getTime()
        setData({ ...data, from: start, to: end, id: null })
        setDate(e)
        setCustomTime(true)
    }

    const _onConfirm = () => {
        if (onConfirm) onConfirm(data, date)
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onCancel}
            modalClassName="z-[99999999999]"
            onusClassName="min-h-[363px] rounded-t-[16px] bg-nao-tooltip"
        >
            <div className="overflow-hidden relative ">
                <div className={`${!showPicker ? 'translate-x-0' : '-translate-x-full absolute'} transition-all flex flex-col justify-between h-full`}>
                    <div className="text-2xl leading-8 font-semibold">{t('common:filter')}</div>
                    <div className="mt-8 flex flex-col space-y-6">
                        <div>
                            <div className="text-sm font-semibold">{t('common:global_label:type')}</div>
                            <div className="flex items-center justify-between space-x-5 mt-6">
                                <ButtonNao
                                    className={classNames('w-full', { '!bg-nao-bg3 !font-normal': data.marginCurrency !== WalletCurrency.VNDC })}
                                    onClick={() => setData({ ...data, marginCurrency: WalletCurrency.VNDC })}
                                >
                                    Futures VNDC
                                </ButtonNao>
                                <ButtonNao
                                    className={classNames('w-full', { '!bg-nao-bg3 !font-normal': data.marginCurrency !== WalletCurrency.USDT })}
                                    onClick={() => setData({ ...data, marginCurrency: WalletCurrency.USDT })}
                                >
                                    Futures USDT
                                </ButtonNao>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold">{t('common:global_label:date')}</div>
                            <div className="text-sm grid grid-cols-3 gap-5 pt-6">
                                {days.map((day, index) => {
                                    return (
                                        <div
                                            key={day.id}
                                            onClick={() => {
                                                setData({ ...data, ...day })
                                                setCustomTime(false)
                                            }}
                                            className={classNames('py-2 px-4 cursor-pointer leading-6 bg-onus-bg3 rounded-md text-center', { 'bg-nao-blue2 font-medium': day?.id === data?.id })}>
                                            <span>{day[language]}</span>
                                        </div>
                                    );
                                })}
                                <div onClick={() => setShowPicker(true)}
                                    className={classNames('py-2 px-4 cursor-pointer leading-6 bg-onus-bg3 rounded-md relative col-span-3', { 'bg-nao-blue2 font-medium': customTime || !data?.id })}>
                                    <div className="flex items-center space-x-3 justify-center">
                                        <CalenderIcon />
                                        <div>{formatTime(date.startDate, 'dd/MM/yyyy')}</div>
                                        <span>-</span>
                                        <div>{formatTime(date.endDate, 'dd/MM/yyyy')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between space-x-5 mt-8">
                        <ButtonNao border className={'w-full'} onClick={onReset}>
                            {t('common:reset')}
                        </ButtonNao>
                        <ButtonNao onClick={_onConfirm} className="w-full">{t('common:confirm')}</ButtonNao>
                    </div>
                </div>
                <div className={`${showPicker ? 'translate-x-0 min-h-[360px]' : 'translate-x-full absolute'} transition-all`}>
                    <div className="text-2xl leading-8 font-semibold">{t('common:custom_date')}</div>
                    <DatePicker showPicker={showPicker} range={date} onBack={() => setShowPicker(false)} onConfirm={onChangePicker} />

                </div>
            </div>
        </Modal>
    );
};


const DatePicker = ({ range, onBack, showPicker, onConfirm }) => {
    const { t, i18n: { language } } = useTranslation();
    const [isRange, setIsRange] = useState(false)
    const [datePicker, setDatePicker] = useState(range)

    useEffect(() => {
        setDatePicker(range)
    }, [showPicker, range])

    const Component = isRange ? DateRangePicker : Calendar

    const onDatesChange = (e) => {
        if (isRange) {
            setDatePicker(e[range.key])
        } else {
            setDatePicker({
                key: range.key,
                startDate: e,
                endDate: e,
            })
        }
    }

    const _onConfirm = () => {
        if (onConfirm) onConfirm(datePicker)
        if (onBack) onBack();
    }

    return (
        <div className="mt-8 relative">
            <div className="flex items-center justify-center bg-onus-bg3 rounded-lg mx-5 text-xs font-semibold p-[2px]">
                <div onClick={() => setIsRange(false)} className={`py-[5px] cursor-pointer rounded-lg w-full h-full text-center ${!isRange ? 'bg-onus-bg2' : 'text-onus-grey'}`} >
                    {t('common:one_day')}
                </div>
                <div onClick={() => setIsRange(true)} className={`py-[5px] cursor-pointer rounded-lg w-full h-full text-center ${isRange ? 'bg-onus-bg2' : 'text-onus-grey'}`}  >
                    {t('common:several_days')}
                </div>
            </div>
            <div className="date-range-picker flex justify-center mt-6">
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
            </div>
            <div className="flex items-center justify-between space-x-5 mt-8">
                <ButtonNao border className={'w-full'} onClick={onBack}>
                    {t('common:back')}
                </ButtonNao>
                <ButtonNao onClick={_onConfirm} className="w-full">{t('common:confirm')}</ButtonNao>
            </div>
        </div>
    )
}

export default NaoFilter;