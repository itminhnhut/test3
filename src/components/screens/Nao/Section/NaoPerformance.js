import React, { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { ButtonNao, CardNao, TextLiner } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import fetchApi from 'utils/fetch-api';
import { API_GET_REFERENCE_CURRENCY, API_NAO_DASHBOARD_STATISTIC } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatPrice, formatTime, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import colors from 'styles/colors';
import { Check } from 'react-feather';
import { assetCodeFromId, WalletCurrency } from 'utils/reference-utils';
import { useRouter } from 'next/router';
import useWindowSize from 'hooks/useWindowSize';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import SvgFilter from 'components/svg/SvgFilter';
import CheckCircle from 'components/svg/CheckCircle';

export const days = [
    {
        en: 'Today',
        vi: 'Hôm nay',
        value: 'd'
    },
    {
        en: 'Yesterday',
        vi: 'Hôm qua',
        value: '-d'
    },
    {
        en: '7 days',
        vi: '7 ngày',
        value: 'w'
    },
    {
        en: '30 days',
        vi: '30 ngày',
        value: 'm'
    },
    {
        en: '60 days',
        vi: '60 ngày',
        value: '2m'
    }
];

const filterFeeAsset = [
    {
        id: WalletCurrency.NA0 ?? 447,
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
    }
];

const NaoPerformance = memo(() => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const router = useRouter();
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({
        day: 'd',
        marginCurrency: WalletCurrency.VNDC
    });
    const [fee, setFee] = useState(WalletCurrency.VNDC);
    const [referencePrice, setReferencePrice] = useState({});

    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // const [getQueryByName , updateQuery] = useAddQuery('date')

    useEffect(() => {
        const { date } = router.query;
        if (date) {
            setFilter({
                ...filter,
                day: date
            });
        }
    }, [router.isReady]);

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
                    range: filter.day,
                    marginCurrency: filter.marginCurrency,
                    userCategory: 2
                }
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
                }
            });
            if (data) {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [`${current.base}/${current.quote}`]: current.price
                        };
                    }, {})
                );
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
        return Object.keys(dataSource?.feeRevenue).reduce((newItem, item) => {
            const asset = assetConfig.find((rs) => rs.id === Number(item));
            if (asset) {
                assets.push({
                    id: asset.id,
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit,
                    value: dataSource.feeRevenue[item]
                });
            }
            return assets;
        }, []);
    }, [dataSource, assetConfig]);

    const feeFilter = useMemo(() => {
        const _fee = assets.find((rs) => rs.id === fee);
        return {
            total: _fee ? formatNumber(_fee?.value, _fee?.assetDigit) + ' ' + _fee?.assetCode : '-',
            ratio: filterFeeAsset.find((rs) => rs.id === fee)?.ratio ?? '0.06'
        };
    }, [fee, assets]);

    const handleChangeMarginCurrency = (currency) => {
        setFilter({
            ...filter,
            marginCurrency: currency
        });
        setFee(currency);
    };

    const updateDateRangeUrl = (dateValue) => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    date: dateValue
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    const handleChangeDateRange = (day) => {
        if (day !== filter.day) {
            setFilter({
                ...filter,
                day
            });
            updateDateRangeUrl(day);
        }
    };

    return (
        <section id="nao_performance" className="pt-6 sm:pt-20 text-sm sm:text-base">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div className='space-y-2 flex flex-col'>
                    <TextLiner className="">{t('nao:onus_performance:title')}</TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:onus_performance:description')}</span>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end">
                    <RangePopover
                        language={language}
                        active={days.find((d) => d.value === filter.day)}
                        onChange={handleChangeDateRange}
                        className="flex order-last"
                        popoverClassName={'lg:mr-2 '}
                    />
                    <div className="order-first gap-2 flex gap-last">
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                { '!border-teal bg-teal/10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.VNDC }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.VNDC)}
                        >
                            Futures VNDC
                        </button>
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                { '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.USDT }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.USDT)}
                        >
                            Futures USDT
                        </button>
                    </div>
                </div>
            </div>
            <div className="pt-5 sm:pt-6 flex items-center flex-wrap gap-4 sm:gap-5">
                <CardNao className="rounded-lg">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                        {t('nao:onus_performance:total_volume')}
                    </label>
                    <div className="pt-4">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">
                            {dataSource ? formatNumber(dataSource?.notionalValue, 0) + ` ${assetCodeFromId(filter.marginCurrency)}` : '-'}
                        </div>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {dataSource
                                ? '$' + formatPrice(referencePrice[`${assetCodeFromId(filter.marginCurrency)}/USD`] * dataSource?.notionalValue, 3)
                                : '-'}{' '}
                        </span>
                    </div>
                </CardNao>
                <CardNao className="rounded-lg">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                        {t('nao:onus_performance:total_orders')}
                    </label>
                    <div className="pt-4">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">
                            {dataSource ? formatNumber(dataSource?.count * 2, 0) : '-'}
                        </div>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">
                            {dataSource ? formatNumber(dataSource?.userCount, 0) + ' ' + t('nao:onus_performance:users') : '-'}
                        </span>
                    </div>
                </CardNao>
                <CardNao noBg className="bg-bgPrimary dark:bg-bgPrimary-dark">
                    <div className="flex items-center justify-between">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark font-semibold text-base sm:text-lg">
                            {t('nao:onus_performance:total_fee')}
                        </label>
                        <Popover className="relative flex">
                            {({ open, close }) => (
                                <>
                                    <Popover.Button>
                                        <div className="px-2 py-[6px] bg-gray-12 dark:bg-dark-2 rounded-md flex items-center justify-between text-gray-15 dark:text-white min-w-[72px] space-x-1">
                                            {filterFeeAsset.find((a) => a.id === fee)?.label || '--'}
                                            <ArrowDropDownIcon size={16} color="currentColor" className={`transition-all ${open ? 'rotate-180' : ''}`} />
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
                                        <Popover.Panel className="absolute top-8 mt-3 right-0 z-5 bg-white dark:bg-dark-4 rounded-md border border-divider dark:border-divider-dark">
                                            <div className="py-[2] min-w-[72px] shadow-onlyLight text-sm flex flex-col">
                                                {assets.map((item, index) => (
                                                    <span
                                                        onClick={() => {
                                                            setFee(item?.id);
                                                            close();
                                                        }}
                                                        key={index}
                                                        className={`px-4 py-3 cursor-pointer hover:bg-hover-1 dark:hover:bg-hover-dark flex items-center space-x-4`}
                                                    >
                                                        <span>{item?.assetCode}</span>
                                                        {item?.id === fee && <CheckCircle color="currentColor" size={16} />}
                                                    </span>
                                                ))}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                    <div className="pt-4">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark text-xl sm:text-2xl font-semibold pb-2">{feeFilter.total}</div>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{feeFilter.ratio}%</span>
                    </div>
                </CardNao>
            </div>
            {dataSource?.lastTimeUpdate && (
                <div className="text-xs sm:text-sm mt-3 sm:mt-4 text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 5 })}: {formatTime(new Date(dataSource?.lastTimeUpdate))}
                </div>
            )}
        </section>
    );
});

export const RangePopover = ({ language, active = {}, onChange, popoverClassName = '' }) => {
    const popOverClasses = classNames('relative flex', popoverClassName);
    return (
        <Popover className={popOverClasses}>
            {({ open, close }) => (
                <>
                    <Popover.Button>
                        <div className="h-10 flex justify-center items-center">
                            <div className="sm:hidden">
                                <SvgFilter size={24} color="currentColor" className="text-txtPrimary dark:text-txtPrimary-dark" />
                            </div>
                            <div className="hidden sm:flex px-4 py-3 items-center gap-x-1 bg-gray-12 dark:bg-dark-2 font-semibold text-txtSecondary dark:text-txtSecondary-dark rounded-md !font-SF-Pro !text-base">
                                {active[language]}
                                <ArrowDropDownIcon size={16} color="currentColor" className={`transition-all ${open ? 'rotate-180' : ''}`} />
                            </div>
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
                        <Popover.Panel className="absolute min-w-[8rem] sm:min-w-[10rem] shadow-onlyLight top-8 left-auto right-0 z-50 bg-bgPrimary dark:bg-dark-4 border border-divider dark:border-divider-dark rounded-md mt-3">
                            <div className="text-sm sm:text-base flex flex-col text-txtPrimary dark:text-txtPrimary-dark sm:py-3">
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
                                                'flex justify-between items-center py-3 my-1 px-4 cursor-pointer',
                                                'first:rounded-t-md last:rounded-b-md hover:bg-hover-1 dark:hover:bg-hover-dark'
                                            )}
                                        >
                                            <span>{day[language]}</span>
                                            {isActive && <CheckCircle color="currentColor" size={16} />}
                                        </div>
                                    );
                                })}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

const Days = styled.div.attrs({
    className: 'px-4 py-2 rounded-[6px] cursor-pointer text-txtPrimary dark:text-txtPrimary-dark text-sm bg-gray-12 dark:bg-dark-2 select-none text-center'
})`
    background: ${({ active }) => (active ? colors.teal : '')};
    font-weight: ${({ active }) => (active ? '600' : '400')};
`;

export default NaoPerformance;
