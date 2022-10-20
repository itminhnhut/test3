import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ArrowRight, Copy } from 'react-feather';
import { renderCellTable, VndcFutureOrderType, getTypesLabel, fees } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import styled from 'styled-components';
import { countDecimals, emitWebViewEvent, formatNumber, formatTime, getS3Url } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import OrderOpenDetail from './OrderOpenDetail';
import Tooltip from 'components/common/Tooltip';
import { THEME_MODE } from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import { listTimeFrame, MenuTime } from 'components/TVChartContainer/MobileTradingView/ChartOptions';
import { useRouter } from 'next/router';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus, ChartMode } from 'redux/actions/const';
import colors from 'styles/colors';
import { getType } from "components/screens/Futures/PlaceOrder/Vndc/OrderButtonsGroupVndc";

const MobileTradingView = dynamic(
    () => import('components/TVChartContainer/MobileTradingView').then(mode => mode.MobileTradingView),
    { ssr: false },
);

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        return Object.keys(params)
            .reduce((newItem, item) => {
                const asset = utils.assetConfig.find(rs => rs.id === params[item].currency);
                if (asset) {
                    assets[item] = {
                        assetCode: asset?.assetCode,
                        assetDigit: asset?.assetDigit
                    };
                }
                return assets;
            }, {});
    }
);

const getAllAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        return fees.reduce((newItem, item) => {
            const asset = utils.assetConfig.find(rs => rs.id === item?.assetId);
            if (asset) {
                assets[item?.assetId] = {
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit
                };
            }
            return assets;
        }, {});
    }
);

const OrderDetail = ({
    order,
    pairConfig,
    pairParent,
    isTabHistory = false,
    isDark,
    getDetail,
    isModal,
    onClose,
    isVndcFutures
}) => {
    const { t, i18n: { language } } = useTranslation();
    // const assetConfig = useSelector(state => getAssets(state, {
    //     ...order?.fee_metadata,
    //     swap: { currency: order?.margin_currency },
    //     order_value: { currency: order?.order_value_currency }
    // }));

    const allAssets = useSelector(state => getAllAssets(state));
    const decimalSymbol = allAssets?.[order?.margin_currency]?.assetDigit ?? 0;
    const decimalUsdt = allAssets?.[order?.margin_currency]?.assetDigit ?? 0;
    const [resolution, setResolution] = useState('15');
    const [dataSource, setDataSource] = useState([]);
    const [chartKey, setChartKey] = useState('nami-mobile-chart');
    const router = useRouter();

    const renderReasonClose = (row) => {
        switch (row?.reason_close_code) {
            case 0:
                return t('futures:order_history:normal');
            case 1:
                return t('futures:order_history:hit_sl');
            case 2:
                return t('futures:order_history:hit_tp');
            case 3:
                return t('futures:order_history:liquidate');
            case 5:
                return t('futures:mobile:adjust_margin:added_volume');
            case 6:
                return t('futures:mobile:adjust_margin:close_partially');
            default:
                return '-';
        }
    };

    const renderFee = (order, key) => {
        if (!order) return '-';
        const currency = order?.fee_metadata[key]?.currency ?? order?.margin_currency
        const assetDigit = allAssets?.[currency]?.assetDigit ?? 0;
        const decimal = currency === 72 ? assetDigit : assetDigit + 2;
        const assetCode = allAssets?.[currency]?.assetCode ?? '';
        const data = order?.fee_metadata[key] ? order?.fee_metadata[key]['value'] : order[key];
        return data ? formatNumber(data, decimal) + ' ' + assetCode : '-';

    };

    const getValue = (number, symbol = false) => {
        if (number) {
            return formatNumber(number, symbol ? decimalSymbol : decimalPrice, 0, true);
        } else {
            return t('futures:not_set');
        }
    };
    const renderSlTp = (value) => {
        if (value) {
            return formatNumber(value, decimalPrice, 0, true);
        }
        return t('futures:not_set');
    };

    const getColor = (key, value) => {
        if (key === 'tp') {
            return value > 0 ? '' : '!text-onus-white';
        } else {
            return value > 0 ? '' : '!text-onus-white';
        }
    };

    const renderModify = (metadata, key) => {
        let value = null;
        switch (key) {
            case 'price':
                value = metadata?.modify_price ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_price?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right"> {getValue(metadata?.modify_price?.after)}</div>
                    </div> : getValue(metadata?.price);
                return value;
            case 'take_profit':
                value = metadata?.modify_tp ?
                    <div className="flex items-center justify-between">
                        <div className={`text-left ${getColor('tp', metadata?.modify_tp?.before)}`}>
                            {getValue(metadata?.modify_tp?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className={`text-right ${getColor('tp', metadata?.modify_tp?.after)}`}>
                            {getValue(metadata?.modify_tp?.after)}</div>
                    </div> : null;
                return value;
            case 'stop_loss':
                value = metadata?.modify_sl ?
                    <div className="flex items-center justify-between">
                        <div className={`text-left ${getColor('sl', metadata?.modify_sl?.before)}`}>
                            {getValue(metadata?.modify_sl?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className={`text-right ${getColor('sl', metadata?.modify_sl?.after)}`}>
                            {getValue(metadata?.modify_sl?.after)} </div>
                    </div> : null;
                return value;
            case 'margin':
                value = metadata?.modify_margin ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_margin?.before, true)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_margin?.after, true)} </div>
                    </div> : null;
                return value;
            case 'volume':
                value = metadata?.modify_order_value ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_order_value?.before, true)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_order_value?.after, true)} </div>
                    </div> : null;
                return value;
            case 'leverage':
                value = metadata?.modify_leverage ?
                    <div className="flex items-center justify-between">
                        <div className="text-left text-onus-green">{getValue(metadata?.modify_leverage?.before, true)}x</div>
                        &nbsp;<ArrowRight size={14} color={colors.onus.green} />&nbsp;
                        <div className="text-right text-onus-green">{getValue(metadata?.modify_leverage?.after, true)}x</div>
                    </div> : null;
                return value;
            case 'open_price':
                value = metadata?.modify_open_price ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_open_price?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_open_price?.after)} </div>
                    </div> : null;
                return value;
            case 'liq_price':
                value = metadata?.modify_liq_price ?
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_liq_price?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_liq_price?.after)} </div>
                    </div> : null;
                return value;
            default:
                return value;
        }
    };

    const renderSwapHours = (order) => {
        if (order.opened_at) {
            let closeTime = Date.now();
            if (order.closed_at) {
                closeTime = new Date(order.closed_at);
            }
            const time = Math.floor((closeTime - new Date(order.opened_at).getTime()) / (60 * 60 * 1000));
            return `(${time} ${t('futures:mobile:hours')})`;
        }
        return null;
    };
    const decimalPrice = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
        return countDecimals(decimalScalePrice?.tickSize) ?? 0;
    }, [pairConfig]);

    const forceFetchOrder = (data) => {
        if (!isModal) {
            getDetail();
        }
    };

    useEffect(() => {
        if (isModal) {
            getAdjustmentDetail();
        } else {
            emitWebViewEvent('order_detail');
        }
    }, []);

    const oldOrder = useRef(null);
    useEffect(() => {
        if (!isModal) {
            setDataSource(order?.futuresorderlogs ?? []);
        } else {
            if (JSON.stringify(oldOrder.current) === JSON.stringify(order)) return;
            oldOrder.current = order;
            getAdjustmentDetail();
        }
    }, [order, isModal]);

    useEffect(() => {
        setChartKey(Math.random()
            .toString())
    }, [pairParent])

    const redirect = (url) => {
        router.push(url)
    }

    const getAdjustmentDetail = async () => {
        try {
            const {
                status,
                data,
                message
            } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: order.displaying_id
                },
            });
            if (status === ApiStatus.SUCCESS) {
                setDataSource(data?.futuresorderlogs ?? []);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const renderLogModifyMargin = (item) => {
        return (
            <>
                <Row>
                    <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    <Span>{t('futures:mobile:adjust_margin:adjust_position_margin')}</Span>
                </Row>
                <Row>
                    <Label>{t('common:time')}</Label>
                    <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:margin')}</Label>
                    <Span>{renderModify(item?.metadata, 'margin')}</Span>
                </Row>
            </>
        )
    }

    const renderLogModifySlTp = (item) => {
        return (
            <>
                <Row>
                    <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    <Span>{t('futures:tp_sl:modify_tpsl')}</Span>
                </Row>
                <Row>
                    <Label>{t('common:time')}</Label>
                    <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                {item?.metadata?.modify_tp &&
                    <Row>
                        <Label>{t('futures:take_profit')}</Label>
                        <Span
                            className="text-onus-green">{renderModify(item?.metadata, 'take_profit')}</Span>
                    </Row>
                }
                {item?.metadata?.modify_sl &&
                    <Row>
                        <Label>{t('futures:stop_loss')}</Label>
                        <Span
                            className="text-onus-red">{renderModify(item?.metadata, 'stop_loss')}</Span>
                    </Row>
                }
                {item?.metadata?.modify_price &&
                    <Row>
                        <Label>{t('futures:price')}</Label>
                        <Span>{renderModify(item?.metadata, 'price')}</Span>
                    </Row>
                }
                {item?.metadata?.modify_margin &&
                    <Row>
                        <Label>{t('futures:margin')}</Label>
                        <Span>{renderModify(item?.metadata, 'margin')}</Span>
                    </Row>
                }
            </>
        )
    }

    const renderLogPartialClose = (item) => {
        const ratio = Math.abs(item?.metadata?.profit / (item?.metadata?.modify_margin?.before - item?.metadata?.modify_margin?.after)) * 100
        return (
            <>
                <Row>
                    <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    <Span>{t('futures:mobile:adjust_margin:close_partially')}</Span>
                </Row>
                <Row>
                    <Label>{t('common:to')}</Label>
                    <Span className="text-onus-base" onClick={() => redirect(`/mobile/futures/order/${item?.metadata?.child_id}`)}>{`#${item?.metadata?.child_id}`}</Span>
                </Row>
                <Row>
                    <Label>{t('common:time')}</Label>
                    <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                <Row>
                    <Label>{t('common:order_type')}</Label>
                    <Span>{renderCellTable('type', item.metadata, t, language)}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:volume')}</Label>
                    <Span>{renderModify(item?.metadata, 'volume')}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:margin')}</Label>
                    <Span>{renderModify(item?.metadata, 'margin')}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:open_price')}</Label>
                    <Span>{formatNumber(item?.metadata?.open_price, decimalPrice)}</Span>
                </Row>
                <Row>
                    <Label>PNL</Label>
                    <Span className={+item?.metadata?.profit > 0 ? 'text-onus-green' : 'text-onus-red'}>
                        {formatNumber(item?.metadata?.profit, isVndcFutures ? decimalUsdt : decimalUsdt + 2, 0, true)} ({formatNumber(ratio, 2, 0, true)}%)</Span>
                </Row>
                <Row className="flex-col items-start w-full">
                    <FeeMeta
                        mode="open_fee"
                        order={item?.metadata}
                        allAssets={allAssets}
                        t={t}
                        isVndcFutures={isVndcFutures}
                    />
                </Row>
                <Row>
                    <Label>{t('futures:mobile:close_fee')}</Label>
                    <Span>{renderFee(item?.metadata, 'close_order')}</Span>
                </Row>
            </>
        )
    }

    const renderLogAddVolume = (item) => {
        return (
            <>
                <Row>
                    <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    <Span>{t('futures:mobile:adjust_margin:added_volume')}</Span>
                </Row>
                <Row>
                    <Label>{t('common:from')}</Label>
                    <Span className="text-onus-base" onClick={() => redirect(`/mobile/futures/order/${item?.metadata?.child_id}`)}>{`#${item?.metadata?.child_id}`}</Span>
                </Row>
                <Row>
                    <Label>{t('common:time')}</Label>
                    <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:volume')}</Label>
                    <Span>{renderModify(item?.metadata, 'volume')}</Span>
                </Row>
                <Row>
                    <Label>{t('common:order_type')}</Label>
                    <Span>{renderCellTable('type', item.metadata, t, language)}</Span>
                </Row>
                {item?.metadata?.modify_leverage &&
                    <Row>
                        <Label>{t('futures:leverage:leverage')}</Label>
                        <Span>{renderModify(item.metadata, 'leverage')}</Span>
                    </Row>
                }
                <Row>
                    <Label>{t('futures:margin')}</Label>
                    <Span>{renderModify(item?.metadata, 'margin')}</Span>
                </Row>
                {item?.metadata?.modify_open_price &&
                    <Row>
                        <Label>{t('futures:order_table:open_price')}</Label>
                        <Span>{renderModify(item?.metadata, 'open_price')}</Span>
                    </Row>
                }
                {/* {item?.metadata?.modify_liq_price && */}
                {/*     <Row> */}
                {/*         <Label>{t('futures:mobile:liq_price')}</Label> */}
                {/*         <Span>{renderModify(item?.metadata, 'liq_price')}</Span> */}
                {/*     </Row> */}
                {/* } */}
                <Row>
                    <Label>{t('futures:mobile:open_fee')}</Label>
                    <Span>{renderFee(item?.metadata, 'place_order')}</Span>
                </Row>
            </>
        )
    }

    const renderDetails = (order) => {
        const mainOrder = order?.metadata?.dca_order_metadata?.is_main_order || order?.metadata?.partial_close_metadata?.is_main_order
        if ((order?.reason_close_code === 5 || order?.metadata?.dca_order_metadata) && !mainOrder) {
            return renderDetailAddedVol()
        } else if ((order?.reason_close_code === 6 || order?.metadata?.partial_close_metadata) && !mainOrder) {
            return renderDetailPartialClose()
        } else {
            return renderDetail()
        }
    }

    const renderDetailAddedVol = () => {
        const price = order?.status === VndcFutureOrderType.Status.PENDING ? order?.price : order?.open_price;
        const id_to = order?.metadata?.dca_order_metadata?.dca_order?.[0]?.displaying_id;
        return (
            <>
                <Row>
                    <Label>ID</Label>
                    <Span className="flex items-center"
                        onClick={() => navigator.clipboard.writeText(order?.displaying_id)}>
                        {order?.displaying_id}
                        <Copy color={colors.onus.grey} size={16} className="ml-2 " />
                    </Span>
                </Row>
                <Row>
                    <Label>{t('futures:mobile:open_time')}</Label>
                    <Span>{formatTime(order?.opened_at, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:mobile:reason_close')}</Label>
                    <Span>{renderReasonClose(order)}</Span>
                </Row>
                <Row>
                    <Label>{t('common:to')}</Label>
                    <Span className="text-onus-base" onClick={() => redirect(`/mobile/futures/order/${id_to}`)}>#{id_to}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:open_price')}</Label>
                    <Span>{price ? formatNumber(price, decimalPrice) : '-'}</Span>
                </Row>
                <Row>
                    <Label>{t('common:order_type')}</Label>
                    <Span>{getTypesLabel(String(order?.type).toUpperCase(), t)}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:volume')}</Label>
                    <Span>{`${formatNumber(order?.order_value, decimalSymbol)} (${formatNumber(order?.quantity, 6)} ${pairConfig?.baseAsset})`}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:leverage:leverage')}</Label>
                    <Span className="text-onus-green">{order?.leverage}x</Span>
                </Row>
                <Row>
                    <Label>{t('futures:margin')}</Label>
                    <Span>{formatNumber(order?.margin, decimalSymbol)}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:mobile:open_fee')}</Label>
                    <Span>{renderFee(order, 'place_order')}</Span>
                </Row>
            </>
        )
    }

    const renderDetailPartialClose = () => {
        const price = order?.status === VndcFutureOrderType.Status.PENDING ? order?.price : order?.open_price;
        const from_id = order?.metadata?.partial_close_metadata?.partial_close_from;
        return (
            <>
                <Row>
                    <Label>ID</Label>
                    <Span className="flex items-center"
                        onClick={() => navigator.clipboard.writeText(order?.displaying_id)}>
                        {order?.displaying_id}
                        <Copy color={colors.onus.grey} size={16} className="ml-2 " />
                    </Span>
                </Row>
                <Row>
                    <Label>{t('futures:mobile:open_time')}</Label>
                    <Span>{formatTime(order?.opened_at, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:mobile:reason_close')}</Label>
                    <Span>{renderReasonClose(order)}</Span>
                </Row>
                <Row>
                    <Label>{t('common:from')}</Label>
                    <Span className="text-onus-base" onClick={() => redirect(`/mobile/futures/order/${from_id}`)}>#{from_id}</Span>
                </Row>
                <Row>
                    <Label>{t('common:order_type')}</Label>
                    <Span>{getTypesLabel(String(order?.type).toUpperCase(), t)}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:close_price')}</Label>
                    <Span>{price ? formatNumber(price, decimalPrice) : '-'}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:open_price')}</Label>
                    <Span>{order?.open_price ? formatNumber(order?.open_price, decimalPrice) : '-'}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:order_table:volume')}</Label>
                    <Span>{`${formatNumber(order?.order_value, decimalSymbol)} (${formatNumber(order?.quantity, 6)} ${pairConfig?.baseAsset})`}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:leverage:leverage')}</Label>
                    <Span className="text-onus-green">{order?.leverage}x</Span>
                </Row>
                <Row>
                    <Label>{t('futures:margin')}</Label>
                    <Span>{formatNumber(order?.margin, decimalSymbol)}</Span>
                </Row>
                <Row className="flex-col items-start w-full">
                    <FeeMeta
                        mode="open_fee"
                        order={order}
                        allAssets={allAssets}
                        t={t}
                        isVndcFutures={isVndcFutures}
                    />
                </Row>
                <Row>
                    <Label>{t('futures:mobile:close_fee')}</Label>
                    <Span>{renderFee(order, 'close_order')}</Span>
                </Row>
                <Row>
                    <Label>PNL</Label>
                    <Span className={+order?.profit > 0 ? 'text-onus-green' : 'text-onus-red'}>
                        {formatNumber(order?.profit, isVndcFutures ? decimalUsdt : decimalUsdt + 2, 0, true)} ({formatNumber(Math.abs(order?.profit / order?.margin) * 100, 2, 0, true)}%)</Span>
                </Row>
            </>
        )
    }

    const renderDetail = () => {
        const price = order?.status === VndcFutureOrderType.Status.PENDING ? order?.price : order?.open_price;
        const isAddedVolOrClose = (order?.metadata?.dca_order_metadata || order?.metadata?.partial_close_metadata) && order?.status === VndcFutureOrderType.Status.PENDING
        return (
            <>
                <Row>
                    <Label>ID</Label>
                    <Span className="flex items-center"
                        onClick={() => navigator.clipboard.writeText(order?.displaying_id)}>
                        {order?.displaying_id}
                        <Copy color={colors.onus.grey} size={16} className="ml-2 " />
                    </Span>
                </Row>
                <Row>
                    <Label>{t('futures:leverage:leverage')}</Label>
                    <Span className="text-onus-green">{order?.leverage}x</Span>
                </Row>
                {isTabHistory && !isAddedVolOrClose &&
                    <Row>
                        <Label>PNL</Label>
                        <Span className={+order?.profit > 0 ? 'text-onus-green' : 'text-onus-red'}>
                            {formatNumber(order?.profit, isVndcFutures ? decimalUsdt : decimalUsdt + 2, 0, true)} ({formatNumber(order?.profit / order?.margin * 100, 2, 0, true)}%)</Span>
                    </Row>
                }
                <Row>
                    <Label>{t('futures:order_table:volume')}</Label>
                    <Span>{`${formatNumber(order?.order_value, decimalSymbol)} (${formatNumber(order?.quantity, 6)} ${pairConfig?.baseAsset})`}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:margin')}</Label>
                    <Span>{formatNumber(order?.margin, decimalSymbol)}</Span>
                </Row>
                <Row>
                    <Label>{t('futures:mobile:open_time')}</Label>
                    <Span>{formatTime(order?.opened_at, 'yyyy-MM-dd HH:mm:ss')}</Span>
                </Row>
                {order?.type !== VndcFutureOrderType.Type.MARKET && order.status === VndcFutureOrderType.Status.CLOSED && !order.open_price &&
                    <Row>
                        <Label>{t(`futures:${order?.type === VndcFutureOrderType.Type.LIMIT ? 'limit_price' : 'stop_price'}`)}</Label>
                        <Span>{formatNumber(order?.price, decimalPrice)}</Span>
                    </Row>
                }
                <Row>
                    <Label>{t('futures:order_table:open_price')}</Label>
                    <Span>{price ? formatNumber(price, decimalPrice) : '-'}</Span>
                </Row>
                {!isAddedVolOrClose && <>
                    <Row>
                        <Label>{t('futures:mobile:close_time')}</Label>
                        <Span>{order?.closed_at ? formatTime(order?.closed_at, 'yyyy-MM-dd HH:mm:ss') : '-'}</Span>
                    </Row>
                    <Row>
                        <Label>{t('futures:order_table:close_price')}</Label>
                        <Span>{order?.close_price ? formatNumber(order?.close_price, decimalPrice) : '-'}</Span>
                    </Row>
                    <Row>
                        <Label>{t('futures:mobile:reason_close')}</Label>
                        <Span>{renderReasonClose(order)}</Span>
                    </Row>
                    <Row>
                        <Label>{t('futures:take_profit')}</Label>
                        <Span
                            className={'text-onus-green'}>{renderSlTp(order?.tp)}</Span>
                    </Row>
                    <Row>
                        <Label>{t('futures:stop_loss')}</Label>
                        <Span
                            className={'text-onus-red'}>{renderSlTp(order?.sl)}</Span>
                    </Row>
                </>
                }
                <Row className="flex-col items-start w-full">
                    <FeeMeta
                        mode="open_fee"
                        order={order}
                        allAssets={allAssets}
                        t={t}
                        isVndcFutures={isVndcFutures}
                    />
                </Row>
                {!isAddedVolOrClose && <>
                    <Row>
                        <Label>{t('futures:mobile:close_fee')}</Label>
                        <Span>{renderFee(order, 'close_order')}</Span>
                    </Row>
                    <Tooltip id="liquidate-fee" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                        className="!mx-7 !-mt-2 !px-3 !py-5 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-[30%]"
                        overridePosition={(e) => ({
                            left: 0,
                            top: e.top
                        })}
                    >
                        <div>
                            <label
                                className="text-sm font-semibold">{t('futures:mobile:liquidate_fee')}</label>
                            <div className="text-sm mt-3">{t('futures:mobile:info_liquidate_fee')}</div>
                        </div>
                    </Tooltip>
                    <Row>
                        <Label className="flex">
                            {t('futures:mobile:liquidate_fee')}
                            <div className="px-2" data-tip="" data-for="liquidate-fee"
                                id="tooltip-liquidate-fee">
                                <img src={getS3Url('/images/icon/ic_help.png')} height={20} width={20} />
                            </div>
                        </Label>
                        <Span>{renderFee(order, 'liquidate_order')}</Span>
                    </Row>
                    {!!order?.swap && <>
                        <Tooltip id="swap-fee" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                            className="!mx-7 !-mt-2 !px-3 !py-5 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-[30%]"
                            overridePosition={(e) => ({
                                left: 0,
                                top: e.top
                            })}
                        >
                            <div>
                                <label className="text-sm font-semibold">{t('futures:mobile:swap_fee')}</label>
                                <div className="text-sm mt-3">{t('futures:mobile:info_swap_fee')}</div>
                            </div>
                        </Tooltip>
                        <Row>
                            <Label className="flex">
                                {t('futures:mobile:swap_fee')}
                                <div className="px-2" data-tip="" data-for="swap-fee" id="tooltip-swap-fee">
                                    <img src={getS3Url('/images/icon/ic_help.png')} height={20} width={20} />
                                </div>
                            </Label>
                            <Span>{renderFee(order, 'swap')} {renderSwapHours(order)}</Span>
                        </Row>
                    </>
                    }
                    <Tooltip id="funding-fee" place="top" effect="solid" backgroundColor="bg-darkBlue-4"
                        className="!mx-7 !-mt-2 !px-3 !py-5 !bg-onus-bg2 !opacity-100 !rounded-lg after:!border-t-onus-bg2 after:!left-[30%]"
                        overridePosition={(e) => ({
                            left: 0,
                            top: e.top
                        })}
                    >
                        <div>
                            <label className="text-sm font-semibold">{t('futures:funding_rate')}</label>
                            <div className="text-sm mt-3">{t('futures:funding_rate_des')}</div>
                        </div>
                    </Tooltip>
                    <Row>
                        <Label className="flex">
                            {t('futures:funding_fee')}
                            <div className="px-2" data-tip="" data-for="funding-fee" id="tooltip-funding-fee">
                                <img src={getS3Url('/images/icon/ic_help.png')} height={20} width={20} />
                            </div>
                        </Label>
                        <Span>{renderFee(order, 'funding')}</Span>
                    </Row>
                </>
                }
            </>
        )
    }

    const resolutionLabel = useMemo(() => {
        return listTimeFrame.find(item => item.value === resolution)?.text;
    }, [resolution]);

    const orderList = useMemo(() => [order], [order]);
    const classNameSide = order?.side === VndcFutureOrderType.Side.BUY ? 'text-onus-green' : 'text-onus-red';

    return (
        <div className={'bg-onus overflow-hidden'}>
            <div className="relative overflow-auto h-full overflow-x-hidden">
                <div
                    className="relative w-full bg-onus z-[10] flex items-center justify-between min-h-[50px] px-[16px]"
                >
                    <div className="flex items-center" onClick={() => onClose && onClose()}>
                        {/* <ChevronLeft size={24} /> */}
                        {/* <span className="font-medium text-sm">{t('common:back')}</span> */}
                    </div>
                    <div
                        className="flex flex-col justify-center items-center mt-[10px] absolute translate-x-[-50%] left-1/2">
                        <span className="font-semibold">{pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}</span>
                        <div className={`text-xs font-medium whitespace-nowrap ${classNameSide}`}>
                            {order?.metadata?.dca_order_metadata && !order?.metadata?.dca_order_metadata?.is_main_order && <>{t('futures:mobile:adjust_margin:added_volume')}&nbsp;/&nbsp;</>}
                            {order?.metadata?.partial_close_metadata && !order?.metadata?.partial_close_metadata?.is_main_order && <>{t('futures:mobile:adjust_margin:close_partially')}&nbsp;/&nbsp;</>}
                            {renderCellTable('side', order, t, language)} / {renderCellTable('type', order, t, language)}
                        </div>
                    </div>
                    <MenuTime
                        value={resolution}
                        onChange={setResolution}
                        keyValue="value"
                        displayValue="text"
                        options={listTimeFrame}
                        classNameButton="pl-2 py-2"
                        classNamePanel="rounded-md right-0"
                        label={<div
                            className="text-sm text-onus-grey font-medium">{resolutionLabel}</div>}
                    />
                </div>

                <div className="shadow-order_detail py-[10px] bg-onus h-full">
                    <div className="min-h-[350px] spot-chart max-w-full"
                        style={{ height: `calc(var(--vh, 1vh) * 100 - 300px)` }}>
                        <MobileTradingView
                            t={t}
                            key={chartKey}
                            containerId="nami-mobile-detail-tv"
                            symbol={order.symbol}
                            pairConfig={pairConfig}
                            initTimeFrame={resolution}
                            onIntervalChange={setResolution}
                            isVndcFutures={true}
                            ordersList={orderList}
                            theme={THEME_MODE.DARK}
                            mode={ChartMode.FUTURES}
                            showSymbol={false}
                            showIconGuide={false}
                            showTimeFrame={false}
                            isDetail={true}
                            // classNameChart="!h-[350px]"
                            styleChart={{ height: `calc(100% - 40px)` }}
                            renderProfit={order.status === VndcFutureOrderType.Status.CLOSED}
                            reNewComponentKey={() => setChartKey(Math.random()
                                .toString())} // Change component key will remount component
                        />
                    </div>
                    <div className="px-[16px] bg-onus">
                        {!isTabHistory &&
                            <OrderOpenDetail order={order} decimalPrice={decimalPrice} isDark={isDark}
                                pairConfig={pairConfig} onClose={onClose} decimalSymbol={decimalSymbol}
                                forceFetchOrder={forceFetchOrder} isTabHistory={isTabHistory}
                                isVndcFutures={isVndcFutures}
                            />
                        }
                        <div className="pt-5">
                            <div className="font-semibold mb-4">{t('futures:mobile:order_detail')}</div>
                            <div className="bg-onus-bg3 px-3 rounded-lg">
                                {renderDetails(order)}
                            </div>
                        </div>
                        {dataSource.length > 0 &&
                            <div className="pb-2.5 pt-8">
                                <div
                                    className="font-semibold mb-4 text-lg">{t('futures:order_history:adjustment_history')}</div>
                                {dataSource.map((item, index) => (
                                    <div key={index} className="bg-onus-bg3 px-3 rounded-lg mb-3">
                                        {item?.type === 'MODIFY_MARGIN' && renderLogModifyMargin(item)}
                                        {item?.type === 'MODIFY' && renderLogModifySlTp(item)}
                                        {item?.type === 'ADD_VOLUME' && renderLogAddVolume(item)}
                                        {item?.type === 'PARTIAL_CLOSE' && renderLogPartialClose(item)}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const Row = styled.div.attrs({
    className: 'flex items-center justify-between py-3 border-b border-onus-input2 last:border-0'
})``;

const Label = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-gray-1 text-left text-onus-grey ${isTabOpen ? 'text-xs' : 'text-sm'} font-normal`
}))``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-sm text-right font-medium ${isTabOpen ? 'text-xs' : 'text-sm'}`
}))``;


const FeeMeta = ({ order, mode = 'open_fee', allAssets, t, isVndcFutures }) => {
    const [visible, setVisible] = useState(false);

    const convertObject = (obj) => {
        if (obj?.currency) {
            return [{ asset: +obj?.currency, value: obj?.value ?? 0 }]
        } else {
            const arr = []
            Object.keys(obj).map(key => {
                arr.push({ asset: +key, value: obj[key] })
            })
            return arr
        }

    }

    const fee_metadata = useMemo(() => {
        const metadata = order?.fee_data ?? order?.fee_metadata
        const feeFilter = metadata?.[mode === 'open_fee' ? 'place_order' : 'close_order']
        const fee = feeFilter ? convertObject(feeFilter) : []
        return fee
    }, [order])

    const decimal = fee_metadata[0]?.asset === 72 ? allAssets[fee_metadata[0]?.asset]?.assetDigit : allAssets[fee_metadata[0]?.asset]?.assetDigit + 2;

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <Label>{t(`futures:mobile:${mode}`)}</Label>
                <Span
                    className={fee_metadata.length > 1 ? 'text-onus-base' : ''}
                    onClick={() => fee_metadata.length > 1 && setVisible(!visible)}>
                    {fee_metadata.length > 1 ? visible ? t('common:global_btn:close') : t('common:view_all') :
                        !fee_metadata[0]?.value ? '-' :
                            formatNumber(fee_metadata[0]?.value, decimal)
                            + ' ' + allAssets[fee_metadata[0]?.asset]?.assetCode
                    }
                </Span>
            </div>
            {visible && <div className="mt-3 text-sm font-medium w-full grid grid-cols-2 gap-2">
                {fee_metadata.map((rs, idx) => (
                    <div className={idx % 2 === 0 ? 'text-left' : 'text-right'} key={idx}>
                        {formatNumber(rs.value, rs.asset === 72 ? allAssets[rs.asset].assetDigit : allAssets[rs.asset].assetDigit + 2)} {allAssets[rs.asset].assetCode}
                    </div>
                ))}
            </div>
            }
        </>
    )
}

export default OrderDetail;
