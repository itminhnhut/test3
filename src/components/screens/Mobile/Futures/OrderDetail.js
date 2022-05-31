import React, { useState, useEffect, useMemo } from 'react';
import Portal from 'components/hoc/Portal'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { ChevronLeft, ArrowRight } from "react-feather";
import KlineChart from 'components/KlineChart/KlineChart'
import ms from 'ms'
import ChartTimer from './Chart/ChartTimer';
import Indicators from './Chart/Indicators';
import { renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType'
import styled from 'styled-components';
import { formatNumber, formatTime, countDecimals } from 'redux/actions/utils'
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { API_ORDER_DETAIL } from 'redux/actions/apis'
import fetchApi from 'utils/fetch-api'
import { ApiStatus } from 'redux/actions/const'
import TableNoData from 'components/common/table.old/TableNoData';
import { listTimeFrame } from "components/KlineChart/kline.service";

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        return Object.keys(params).reduce((newItem, item) => {
            const asset = utils.assetConfig.find(rs => rs.id === params[item].currency);
            if (asset) {
                assets[item] = {
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit
                };
            }
            return assets;
        }, {})
    }
);

// const closest = (arr, num) => {
//     return arr.reduce((acc, val) => {
//         if (Math.abs(val - num) < Math.abs(acc)) {
//             return val - num;
//         } else {
//             return acc;
//         }
//     }, Infinity) + num;
// }

const getResolution = (order) => {
    const timestamp = new Date(order?.closed_at).getTime() - new Date(order?.opened_at).getTime();
    const item = listTimeFrame.reduce((prev, curr) => {
        return (Math.abs(curr.value - timestamp) < Math.abs(prev?.value - timestamp) ? curr : prev);
    });
    return item?.value ?? ms('1m')
}


const OrderDetail = ({ isVisible = true, onClose, order, pairConfig, pairParent, isVndcFutures }) => {
    const { t } = useTranslation()

    const [resolution, setResolution] = useState(getResolution(order))
    const [mainIndicator, setMainIndicator] = useState()
    const [subIndicator, setSubIndicator] = useState()
    const [candle, setCandle] = useState('candle_solid');
    const assetConfig = useSelector(state => getAssets(state, {
        ...order?.fee_metadata,
        swap: { currency: order?.margin_currency },
        order_value: { currency: order?.order_value_currency }
    }))
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: order.displaying_id
                },
            })
            if (status === ApiStatus.SUCCESS) {
                setDataSource(data?.futuresorderlogs ?? [])
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }, [])

    const renderReasonClose = (row) => {
        switch (row?.reason_close_code) {
            case 0:
                return t('futures:order_history:normal')
            case 1:
                return t('futures:order_history:hit_sl')
            case 2:
                return t('futures:order_history:hit_tp')
            case 3:
                return t('futures:order_history:liquidate')
            default:
                return '';
        }
    }

    const renderFee = (order, key) => {
        const decimal = assetConfig ? assetConfig[key]?.assetDigit : 0
        const assetCode = assetConfig ? assetConfig[key]?.assetCode : '';
        const data = order?.fee_metadata[key] ? order?.fee_metadata[key]['value'] : order[key];
        return data ? formatNumber(data, decimal) + ' ' + assetCode : '-'
    }

    const getValue = (number) => {
        return formatNumber(number, 0, 0, true) + ' VNDC';
    }

    const renderModify = (metadata, key) => {
        let value = null;
        switch (key) {
            case 'price':
                value = metadata?.modify_price ?
                    <div className="flex items-center py-[4px] justify-between">
                        <div className="text-left">{getValue(metadata?.modify_price?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right"> {getValue(metadata?.modify_price?.after)}</div>
                    </div> : getValue(metadata?.price)
                return value;
            case 'take_profit':
                value = metadata?.modify_tp ?
                    <div className="flex items-center py-[4px] justify-between">
                        <div className="text-left">{getValue(metadata?.modify_tp?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_tp?.after)}</div>
                    </div> : null
                return value;
            case 'stop_loss':
                value = metadata?.modify_sl ?
                    <div className="flex items-center py-[4px] justify-between">
                        <div className="text-left">{getValue(metadata?.modify_sl?.before)}</div>
                        &nbsp;<ArrowRight size={14} />&nbsp;
                        <div className="text-right">{getValue(metadata?.modify_sl?.after)} </div>
                    </div> : null
                return value;

            default:
                return value;
        }
    }

    const decimal = useMemo(() => {
        const decimalScalePrice = pairConfig?.filters.find(rs => rs.filterType === 'PRICE_FILTER');
        return countDecimals(decimalScalePrice?.tickSize) ?? 0;
    }, [pairConfig])

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div className={classNames(
                'flex flex-col absolute top-0 left-0 h-full w-full z-[20] bg-white dark:bg-darkBlue-1',
                { invisible: !isVisible },
                { visible: isVisible }
            )}
            >
                <div className='fixed top-0 w-full bg-white dark:bg-darkBlue-1 z-[10] flex items-center min-h-[50px] px-[16px]' onClick={() => onClose()}>
                    <ChevronLeft size={24} />
                    <span className='font-medium text-sm pl-[10px]'>{t('futures:mobile:order_detail')}  </span>

                </div>
                <div className='flex justify-center items-center pt-[25px] mt-[50px] font-semibold'>
                    <span className="mr-[8px]">{pairConfig?.baseAsset + '/' + pairConfig?.quoteAsset}</span>
                    <span className={order?.side === VndcFutureOrderType.Side.BUY ? 'text-teal' : 'text-red'}>{renderCellTable('side', order)} / {renderCellTable('type', order)}</span>
                </div>
                <div className="shadow-order_detail py-[10px] dark:bg-darkBlue-1 ">
                    <div className="min-h-[300px]">
                        <ChartTimer pair={order.symbol} pairConfig={pairConfig}
                            isVndcFutures={isVndcFutures} resolution={resolution}
                            setResolution={setResolution}
                            candle={candle} setCandle={setCandle}
                            className="py-[10px]"
                            showSymbol={false}
                            showIconGuide={false}
                            pairParent={pairParent}
                        />
                        <div className="h-[300px]">
                            <KlineChart
                                symbolInfo={{ exchange: 'NAMI_FUTURES', symbol: order.symbol, pricePrecision: decimal }}
                                resolution={resolution}
                                mainIndicator={mainIndicator}
                                subIndicator={subIndicator}
                                chartId={'order-detail'}
                                pairParent={pairParent}
                                candle={candle}
                                shapeTemplate={[order]}
                            />
                        </div>
                        <Indicators
                            setMainIndicator={setMainIndicator} mainIndicator={mainIndicator}
                            setSubIndicator={setSubIndicator} subIndicator={subIndicator} />
                    </div>
                    <div className="px-[16px]">
                        <div className="py-[24px]">
                            <div className="font-semibold mb-[6px]">{t('futures:mobile:order_details')}</div>
                            <Row>
                                <Label>ID</Label>
                                <Span>{order?.displaying_id}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:leverage:leverage')}</Label>
                                <Span>{order?.leverage}x</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:realized_pnl')}</Label>
                                <Span>{formatNumber(String(order?.profit).replace(',', ''), 0, 0, true)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:order_table:volume')}</Label>
                                <Span>{`${formatNumber(order?.order_value, assetConfig?.order_value?.assetDigit ?? 0)} (${order?.quantity} ${pairConfig?.baseAsset})`}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:margin')}</Label>
                                <Span>{formatNumber(order?.margin, assetConfig?.swap?.assetDigit ?? 0)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:open_time')}</Label>
                                <Span>{formatTime(order?.opened_at, 'yyyy-MM-dd HH:mm:ss')}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:order_table:open_price')}</Label>
                                <Span>{formatNumber(order?.open_price, 0)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:close_time')}</Label>
                                <Span>{formatTime(order?.closed_at, 'yyyy-MM-dd HH:mm:ss')}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:order_table:close_price')}</Label>
                                <Span>{formatNumber(order?.close_price, 0)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:reason_close')}</Label>
                                <Span>{renderReasonClose(order)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:take_profit')}</Label>
                                <Span>{formatNumber(order?.tp)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:stop_loss')}</Label>
                                <Span>{formatNumber(order?.sl)}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:open_fee')}</Label>
                                <Span>{renderFee(order, 'place_order')}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:close_fee')}</Label>
                                <Span>{renderFee(order, 'close_order')}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:liquidate_fee')}</Label>
                                <Span>{renderFee(order, 'liquidate_order')}</Span>
                            </Row>
                            <Row>
                                <Label>{t('futures:mobile:swap_fee')}</Label>
                                <Span>{renderFee(order, 'swap')}</Span>
                            </Row>
                        </div>
                        <div>
                            <div className="font-semibold mb-[6px]">{t('futures:order_history:adjustment_detail')}</div>
                            {dataSource.length > 0 ?
                                dataSource.map((item, index) => (
                                    <div key={index} className="border-b border-divider dark:border-divider-dark last:border-0">
                                        <Row>
                                            <Label>{t('common:time')}</Label>
                                            <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss')}</Span>
                                        </Row>
                                        {item?.metadata?.modify_tp &&
                                            <Row>
                                                <Label>{t('futures:take_profit')}</Label>
                                                <Span>{renderModify(item?.metadata, 'take_profit')}</Span>
                                            </Row>
                                        }
                                        {item?.metadata?.modify_sl &&
                                            <Row>
                                                <Label>{t('futures:stop_loss')}</Label>
                                                <Span>{renderModify(item?.metadata, 'stop_loss')}</Span>
                                            </Row>
                                        }
                                        {item?.metadata?.modify_price &&
                                            <Row>
                                                <Label>{t('futures:price')}</Label>
                                                <Span>{renderModify(item?.metadata, 'price')}</Span>
                                            </Row>
                                        }
                                    </div>
                                ))
                                : <TableNoData className="min-h-[300px]" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

const Row = styled.div.attrs({
    className: 'flex items-center justify-between py-[6px]'
})``


const Label = styled.div.attrs({
    className: 'text-gray-1 dark:text-txtSecondary-dark text-sm font-medium'
})``

const Span = styled.div.attrs({
    className: 'text-sm font-medium'
})``

export default OrderDetail;