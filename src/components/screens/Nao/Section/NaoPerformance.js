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

const days = [
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

    const assetConfig = useSelector(state => state.utils.assetConfig);

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
        setFilter({
            ...filter,
            marginCurrency: currency
        });
        setFee(currency);
    };

    const updateDateRangeUrl = (dateValue) => {
        router.push({
            pathname: router.pathname,
            query: {
                date: dateValue,
            }
        });
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
        <section id="nao_performance" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div>
                    <TextLiner liner={width < 992}
                               className="text-nao lg:text-white">{t('nao:onus_performance:title')}</TextLiner>
                    <span
                        className="text-sm sm:text-[1rem] text-nao-grey">{t('nao:onus_performance:description')}</span>
                </div>
                <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end">
                    <RangePopover language={language} active={days.find(d => d.value === filter.day)}
                                  onChange={handleChangeDateRange} className="flex order-last lg:order-first"
                                  popoverClassName={'lg:mr-2 '}/>
                    <div className="order-first gap-2 lg:order-last flex gap-last">
                        <ButtonNao
                            className={classNames({ '!bg-nao-bg3 !font-normal': filter.marginCurrency !== WalletCurrency.VNDC })}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.VNDC)}
                        >Futures VNDC</ButtonNao>
                        <ButtonNao
                            className={classNames({ '!bg-nao-bg3 !font-normal': filter.marginCurrency !== WalletCurrency.USDT })}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.USDT)}
                        >Futures USDT</ButtonNao>
                    </div>
                </div>
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
                                                 width="16"/>
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
            {
                dataSource?.lastTimeUpdate && <div
                    className="mt-6 text-sm text-nao-grey font-medium leading-6">{t('nao:contest:last_updated_time_dashboard', { minute: 5 })}: {formatTime(new Date(dataSource?.lastTimeUpdate))}</div>
            }
        </section>
    );
});

const RangePopover = ({
    language,
    active = {},
    onChange,
    popoverClassName = '',
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
                        <img alt="" src={getS3Url('/images/nao/ic_arrow_bottom.png')} height="16" width="16"/>
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
                        className="absolute min-w-[14.5rem] shadow-onlyLight top-8 left-0 md:left-auto md:right-0 z-50 bg-nao-bg3 rounded-xl mt-3">
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
                                        {isActive && <Check size={16} color={colors.onus.base}/>}
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
