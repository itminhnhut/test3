import React, { Fragment, useEffect, useState } from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';
import classNames from 'classnames';
import styled from 'styled-components';
import { Popover, Transition } from '@headlessui/react';
import ChevronDown from 'components/svg/ChevronDown';
import fetchApi from 'utils/fetch-api';
import { API_NAO_DASHBOARD_STATISTIC, API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatPrice, getS3Url } from 'redux/actions/utils';
import { DefaultFuturesFee } from 'redux/actions/const';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const days = [
    { en: '1 day', vi: '1 ngày', value: 'd' },
    { en: '7 days', vi: '7 ngày', value: 'w' },
    { en: '30 days', vi: '1 tháng', value: 'm' },
    { en: '60 days', vi: '2 tháng', value: '2m' }
]


const NaoPlatform = () => {
    const { t, i18n: { language } } = useTranslation()
    const [dataSource, setDataSource] = useState(null);
    const [loading, setLoading] = useState(false);
    const filter = useRef(null);
    const [fee, setFee] = useState('VNDC');
    const [referencePrice, setReferencePrice] = useState({})
    const assetConfig = useSelector(state => state.utils.assetConfig);

    useEffect(() => {
        getData('d');
        getRef();
    }, [])

    const getData = async (day) => {
        if (filter.current === day) return;
        filter.current = day;
        try {
            const data = await fetchApi({
                url: API_NAO_DASHBOARD_STATISTIC,
                options: { method: 'GET' },
                params: { range: filter.current },
            })
            setDataSource(data)
        } catch (e) {
            console.log(e)
        } finally {
            if (loading) setLoading(false);
        }
    }

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: { base: 'VNDC,USDT', quote: 'USD' },
            });
            if (data) {
                setReferencePrice(data.reduce((acm, current) => {
                    return {
                        ...acm,
                        [`${current.base}/${current.quote}`]: current.price,
                    }
                }, {}))
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

    const assets = useMemo(() => {
        if (!dataSource) return [];
        const assets = [];
        return Object.keys(dataSource.feeRevenue).reduce((newItem, item) => {
            const asset = assetConfig.find(rs => rs.id === Number(item));
            if (asset) {
                assets.push({
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit,
                    value: dataSource.feeRevenue[item]
                })
            }
            return assets;
        }, []);
    }, [dataSource, assetConfig])

    const _fee = useMemo(() => {
        return assets.find(rs => rs.assetCode === fee)
    }, [fee, assets])

    return (
        <section className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-5">
                <div>
                    <TextLiner>Platform performance</TextLiner>
                    <span className="text-nao-grey">Lorem ipsum doren sitala ipsum doren sitala ipsum doren.</span>
                </div>
                <div className="flex space-x-2">
                    {days.map((day, i) => {
                        return <Days key={i} active={day.value === filter.current}
                            onClick={() => getData(day.value)}>{day[language]}</Days>
                    })}
                </div>
            </div>
            <div className="pt-5 sm:pt-6 flex items-center flex-wrap gap-5">
                <CardNao>
                    <label className="text-nao-text font-medium text-lg">Total Volume</label>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2">{dataSource ? formatNumber(dataSource?.notionalValue, 0) + ' VNDC' : '-'}</div>
                        <span className="text-sm text-nao-grey">{dataSource ? formatPrice(referencePrice[`VNDC/USD`] * dataSource?.notionalValue, 4) + ' USD' : '-'} </span>
                    </div>
                </CardNao>
                <CardNao>
                    <label className="text-nao-text font-medium text-lg">Trades</label>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2">{dataSource ? formatNumber(dataSource?.count, 0) : '-'}</div>
                        <span className="text-sm text-nao-grey">{dataSource ? formatNumber(dataSource?.userCount, 0) + ' Users' : '-'}</span>
                    </div>
                </CardNao>
                <CardNao noBg className="">
                    <div className="flex items-center justify-between">
                        <label className="text-nao-text font-medium text-lg">Fees</label>
                        <Popover className="relative">
                            {({ open, close }) => (
                                <>
                                    <Popover.Button >
                                        <div className="text-sm px-2 py-1 bg-nao-bg3 rounded-md flex items-center justify-between text-nao-white min-w-[72px]">
                                            {fee}
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
                                        <Popover.Panel className="absolute left-0 z-50 bg-nao-bg3 rounded-md mt-1">
                                            <div className="px-2 py-[2] min-w-[72px] shadow-onlyLight font-medium text-xs flex flex-col">
                                                {assets.map((item, index) => (
                                                    <span onClick={() => { setFee(item?.assetCode); close() }} key={index}
                                                        className={`py-[1px] my-[2px] cursor-pointer ${item?.assetCode === fee ? 'text-nao-text' : 'text-nao-white'}`}>{item?.assetCode}</span>
                                                ))}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                    </div>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2">{_fee ? formatNumber(_fee?.value, _fee?.assetDigit) + ' ' + _fee?.assetCode : '-'}</div>
                        <span className="text-sm text-nao-grey">{DefaultFuturesFee.NamiFrameOnus * 100}%</span>
                    </div>
                </CardNao>
            </div>
        </section>
    );
};

const Days = styled.div.attrs({
    className: 'px-4 py-2 rounded-[6px] cursor-pointer text-nao-white text-sm bg-nao-bg3 select-none'
})` 
    background:${({ active }) => active ? `linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)` : ''};
    font-weight:${({ active }) => active ? '600' : '400'}
`

export default NaoPlatform;