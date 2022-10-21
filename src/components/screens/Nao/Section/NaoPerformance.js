import React, { Fragment, useEffect, useState, memo } from 'react';
import { TextLiner, CardNao, ButtonNao } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'components/svg/ChevronDown';
import fetchApi from 'utils/fetch-api';
import { API_NAO_DASHBOARD_STATISTIC, API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatPrice, formatTime, getS3Url } from 'redux/actions/utils';
import { DefaultFuturesFee } from 'redux/actions/const';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import colors from 'styles/colors';
import { Check } from 'react-feather';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import DateRangePicker from 'components/screens/Nao/Section/DateRangePicker'
import CalenderIcon from 'components/svg/CalenderIcon';
import FilterIcon from 'components/svg/FilterIcon'
import { startOfDay, endOfDay, subDays, addWeeks, addMonths } from 'date-fns'
import NaoFilter from 'components/screens/Nao/Section/NaoFilter'
import { useRouter } from 'next/router';
import useWindowSize from 'hooks/useWindowSize';

const filterFeeAsset = [
    {
        id: WalletCurrency.NA0,
        label: 'NAO',
        ratio: '0.036'
    },
    {
        id: WalletCurrency.NAMI,
        label: 'NAMI',
        ratio: '0.045'
    },
    {
        id: WalletCurrency.ONUS,
        label: 'ONUS',
        ratio: '0.045'
    },
    {
        id: WalletCurrency.VNDC,
        label: 'VNDC',
        ratio: '0.06'
    },
    {
        id: WalletCurrency.USDT,
        label: 'USDT',
        ratio: '0.06'
    },
];

const NaoPerformance = memo(() => {

    const days = useMemo(() => {
        const now = new Date();
        return [
            {
                id: 'today',
                en: 'Today',
                vi: 'Hôm nay',
                from: startOfDay(now).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: 'yesterday',
                en: 'Yesterday',
                vi: 'Hôm qua',
                from: startOfDay(subDays(now, 1)).valueOf(),
                to: endOfDay(subDays(now, 1)).valueOf(),
            },
            {
                id: '7days',
                en: '7 days',
                vi: '7 ngày',
                from: startOfDay(addWeeks(now, -1)).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: '30days',
                en: '30 days',
                vi: '30 ngày',
                from: startOfDay(addMonths(now, -1)).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: '60days',
                en: '60 days',
                vi: '60 ngày',
                from: startOfDay(addMonths(now, -2)).valueOf(),
                to: endOfDay(now).valueOf(),
            },
            {
                id: 'all',
                en: 'All Time',
                vi: 'Tất cả',
                from: null,
                to: null,
            }
        ];
    }, [])

    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize()
    const router =  useRouter()
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        marginCurrency: WalletCurrency.VNDC,
        ...days[0]
    });
    const [fee, setFee] = useState(WalletCurrency.VNDC);
    const [referencePrice, setReferencePrice] = useState({});

    const assetConfig = useSelector(state => state.utils.assetConfig);
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })

    // const [getQueryByName , updateQuery] = useAddQuery('date')

    useEffect(()=> {
        const { date } = router.query;
        if (date) setFilter({...filter, day: date});
    }, [router.isReady])

    useEffect(() => {
        getRef();
    }, []);

    useEffect(() => {
        getData();
    }, [filter]);

    const getData = async () => {
        setLoading(true);
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC,
                options: { method: 'GET' },
                params: {
                    from: filter?.from,
                    to: filter?.to,
                    marginCurrency: filter.marginCurrency
                },
            });
            setDataSource(!(data?.error || data?.status) ? data : null);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: {
                    base: 'VNDC,USDT',
                    quote: 'USD'
                },
            });
            if (data) {
                setReferencePrice(data.reduce((acm, current) => {
                    return {
                        ...acm,
                        [`${current.base}/${current.quote}`]: current.price,
                    };
                }, {}));
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const assets = useMemo(() => {
        if (!dataSource?.feeRevenue) return [];
        const assets = [];
        let first = true;
        return Object.keys(dataSource?.feeRevenue)
            .reduce((newItem, item) => {
                const asset = assetConfig.find(rs => rs.id === Number(item));
                if (asset) {
                    assets.push({
                        id: asset.id,
                        assetCode: asset?.assetCode,
                        assetDigit: asset?.assetDigit,
                        value: dataSource.feeRevenue[item],
                    });
                }
                return assets;
            }, []);
    }, [dataSource, assetConfig]);

    const feeFilter = useMemo(() => {
        const _fee = assets.find(rs => rs.id === fee);
        return {
            total: _fee ? formatNumber(_fee?.value, _fee?.assetDigit) + ' ' + _fee?.assetCode : '-',
            ratio: filterFeeAsset.find(rs => rs.id === fee)?.ratio ?? '0.06'
        };
    }, [fee, assets]);

    const handleChangeMarginCurrency = (currency) => {
        setFilter({ ...filter, marginCurrency: currency })
        setFee(currency)
    }

    const renderLabel = () => (
        <div className={classNames('py-2 px-4 cursor-pointer leading-6 bg-nao-bg3 rounded-md relative', { 'bg-nao-blue2 font-medium': !filter?.id })}>
            <div className="flex items-center space-x-3">
                <CalenderIcon />
                <div>
                    {t('common:custom')}: {date.startDate ? formatTime(date.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(date.endDate, 'dd/MM/yyyy') : null}
                </div>
            </div>
        </div>

    )

    const getDatePicker = (e) => {
        const start = startOfDay(e?.startDate).valueOf()
        const end = endOfDay(e?.endDate).valueOf()
        setFilter({ ...filter, from: start, to: end, id: null })
    }

    const onChangePicker = (e) => {
        getDatePicker(e)
        setDate(e)
    }

    const onConfirmFilter = (dataFilter, range) => {
        setFilter({ ...filter, ...dataFilter })
        setDate(range)
        setShowFilterModal(false)
    }

    const onReset = () => {
        setFilter({
            marginCurrency: WalletCurrency.VNDC,
            ...days[0]
        })
        setDate({
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        })
    }

    const timelLabel = useMemo(() => {
        const day = days.find(rs => rs.id === filter.id);
        return day ? day[language] : formatTime(date.startDate, 'dd/MM/yyyy') + '-' + formatTime(date.endDate, 'dd/MM/yyyy')
    }, [filter, date])

    return (
        <section id="nao_performance" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div>
                    <TextLiner liner={width < 992 } className='text-nao lg:text-white'>{t('nao:onus_performance:title')}</TextLiner>
                    <span
                        className="text-sm sm:text-[1rem] text-nao-grey">{t('nao:onus_performance:description')}</span>
                </div>
                <div className="flex flex-wrap space-x-2 justify-between lg:justify-start w-full">
                    {/* <RangePopover language={language} active={days.find(d => d.value === filter.day)}
                                  onChange={day => { setFilter({...filter, day}) }}/> */}
                    <div className="items-center space-x-2 hidden lg:flex">
                        <ButtonNao
                            className={classNames({ '!bg-nao-bg3 !font-normal': filter.marginCurrency !== WalletCurrency.VNDC })}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.VNDC)}
                        >Futures VNDC</ButtonNao>
                        <ButtonNao
                            className={classNames({ '!bg-nao-bg3 !font-normal': filter.marginCurrency !== WalletCurrency.USDT })}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.USDT)}
                        >Futures USDT</ButtonNao>
                    </div>
                    <div className="flex items-center space-x-2 lg:hidden">
                        <ButtonNao>{filter.marginCurrency === WalletCurrency.VNDC ? 'Futures VNDC' : 'Futures USDT'}</ButtonNao>
                        <ButtonNao> {timelLabel} </ButtonNao>
                    </div>
                    <div className={!filter?.id ? 'mt-2' : ''}>
                        <div onClick={() => setShowFilterModal(true)} className="flex items-center lg:hidden space-x-1 bg-nao-bg3 p-2 rounded-md">
                            <FilterIcon />
                            <span>{t('common:filter')}</span>
                        </div>
                        {showFilterModal && <NaoFilter days={days} filter={filter} onConfirm={onConfirmFilter} range={date} onCancel={() => setShowFilterModal(false)} />}
                    </div>
                </div>
            </div>
            <div className="mt-10 hidden lg:flex items-center justify-between">
                <div className="flex items-center text-sm space-x-2">
                    {days.map((day, index) => {
                        return (
                            <div
                                key={day.id}
                                onClick={() => {
                                    setFilter({ ...filter, ...day })
                                }}
                                className={classNames('py-2 px-4 cursor-pointer leading-6 bg-nao-bg3 rounded-md', { 'bg-nao-blue2 font-medium': day?.id === filter?.id })}>
                                <span>{day[language]}</span>
                            </div>
                        );
                    })}
                    <DateRangePicker
                        date={date}
                        onChange={onChangePicker}
                        customLabel={renderLabel} />

                </div>
                <div onClick={onReset} className="px-4 py-2 text-nao-blue2 text-sm bg-nao-bg3 rounded-md cursor-pointer">{t('common:reset')}</div>
            </div>
            <div className="pt-5 sm:pt-6 flex items-center flex-wrap gap-5">
                <CardNao>
                    <label
                        className="text-nao-text font-medium sm:text-lg">{t('nao:onus_performance:total_volume')}</label>
                    <div className="pt-4">
                        <div
                            className="text-nao-white text-[1.375rem] font-semibold pb-2 leading-8">{dataSource ? formatNumber(dataSource?.notionalValue, 0) + ` ${assetCodeFromId(filter.marginCurrency)}` : '-'}</div>
                        <span
                            className="text-sm text-nao-grey">{dataSource ? '$' + formatPrice(referencePrice[`${assetCodeFromId(filter.marginCurrency)}/USD`] * dataSource?.notionalValue, 3) : '-'} </span>
                    </div>
                </CardNao>
                <CardNao>
                    <label
                        className="text-nao-text font-medium sm:text-lg">{t('nao:onus_performance:total_orders')}</label>
                    <div className="pt-4">
                        <div
                            className="text-nao-white text-[1.375rem] font-semibold pb-2 leading-8">{dataSource ? formatNumber(dataSource?.count * 2, 0) : '-'}</div>
                        <span
                            className="text-sm text-nao-grey">{dataSource ? formatNumber(dataSource?.userCount, 0) + ' ' + t('nao:onus_performance:users') : '-'}</span>
                    </div>
                </CardNao>
                <CardNao noBg>
                    <div className="flex items-center justify-between">
                        <label
                            className="text-nao-text font-medium sm:text-lg">{t('nao:onus_performance:total_fee')}</label>
                        <Popover className="relative flex">
                            {({
                                open,
                                close
                            }) => (
                                <>
                                    <Popover.Button>
                                        <div
                                            className="text-sm px-2 py-1 bg-nao-bg3 rounded-md flex items-center justify-between text-nao-white min-w-[72px]">
                                            {filterFeeAsset.find(a => a.id === fee)?.label || '--'}
                                            <img alt="" src={getS3Url('/images/nao/ic_arrow_bottom.png')} height="16"
                                                width="16" />
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
                                        <Popover.Panel
                                            className="absolute top-8 left-0 z-50 bg-nao-bg3 rounded-md mt-1">
                                            <div
                                                className="px-2 py-[2] min-w-[72px] shadow-onlyLight font-medium text-xs flex flex-col">
                                                {assets.map((item, index) => (
                                                    <span onClick={() => {
                                                        setFee(item?.id);
                                                        close();
                                                    }} key={index}
                                                        className={`py-[1px] my-[2px] cursor-pointer ${item?.assetCode === fee ? 'text-nao-white' : 'text-nao-text'}`}>{item?.assetCode}</span>
                                                ))}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                    <div className="pt-4">
                        <div
                            className="text-nao-white text-[1.375rem] font-semibold pb-2 leading-8">{feeFilter.total}</div>
                        <span className="text-sm text-nao-grey">{feeFilter.ratio}%</span>
                    </div>
                </CardNao>
            </div>
        </section>
    );
});

const RangePopover = ({
    language,
    active = {},
    onChange,
    popoverClassName='',
}) => {
    const popOverClasses = classNames('relative flex', popoverClassName);
    return <Popover className={popOverClasses}>
        {({
            open,
            close
        }) => (
            <>
                <Popover.Button>
                    <div
                        className="text-sm pl-4 pr-2 h-10 bg-nao-bg3 rounded-md flex items-center justify-between text-nao-white min-w-[72px]">
                        <span className="mr-1">{active[language]}</span>
                        <img alt="" src={getS3Url('/images/nao/ic_arrow_bottom.png')} height="16" width="16" />
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
                    <Popover.Panel className="absolute min-w-[14.5rem] shadow-onlyLight top-8 left-0 md:left-auto md:right-0 z-50 bg-nao-bg3 rounded-xl mt-3">
                        <div className="font-medium text-xs flex flex-col">
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
                                            'flex justify-between items-center py-2 px-4 cursor-pointer leading-6',
                                            'first:rounded-t-xl last:rounded-b-xl hover:bg-onus-2',
                                        )}>
                                        <span>{day[language]}</span>
                                        {isActive && <Check size={16} color={colors.onus.base} />}
                                    </div>
                                );
                            })}
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
        )}
    </Popover>;
};

const Days = styled.div.attrs({
    className: 'px-4 py-2 rounded-[6px] cursor-pointer text-nao-white text-sm bg-nao-bg3 select-none text-center'
})`
    background: ${({ active }) => active ? colors.nao.blue2 : ''};
    font-weight: ${({ active }) => active ? '600' : '400'}
`;

export default NaoPerformance;
