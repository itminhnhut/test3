import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CopyText, formatNumber, formatTime, ReasonClose, FeeMetaFutures, countDecimals } from 'redux/actions/utils';
import MiniTickerData from 'components/screens/Futures/MiniTickerData';
import { DefaultFuturesFee, ApiStatus } from 'redux/actions/const';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { fees, VndcFutureOrderType, renderCellTable, getTypesLabel } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import get from 'lodash/get';
import Tooltip from 'components/common/Tooltip';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ArrowRight, Copy } from 'react-feather';
import colors from 'styles/colors';
import { ChevronUp, ChevronDown } from 'react-feather';
import { useRouter } from 'next/router';

const getAllAssets = createSelector([(state) => state.utils, (utils, params) => params], (utils, params) => {
    const assets = {};
    return fees.reduce((newItem, item) => {
        const asset = utils.assetConfig.find((rs) => rs.id === item?.assetId);
        if (asset) {
            assets[item?.assetId] = {
                assetCode: asset?.assetCode,
                assetDigit: asset?.assetDigit
            };
        }
        return assets;
    }, {});
});
const FuturesOrderDetailModal = ({ isVisible, onClose, order, decimals, lastPrice }) => {
    const { t } = useTranslation();
    const allAssets = useSelector((state) => getAllAssets(state));
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const pairTicker = marketWatch[order?.symbol];
    const _lastPrice = pairTicker ? pairTicker?.lastPrice : lastPrice;

    const price = order?.status === VndcFutureOrderType.Status.PENDING ? order?.price : order?.open_price;

    const renderQuoteprice = useCallback(() => {
        return order?.side === VndcFutureOrderType.Side.BUY ? (
            <MiniTickerData key={order?.displaying_id + 'bid'} initPairPrice={pairTicker} dataKey={'bid'} symbol={order?.symbol} />
        ) : (
            <MiniTickerData key={order?.displaying_id + 'ask'} initPairPrice={pairTicker} dataKey={'ask'} symbol={order?.symbol} />
        );
    }, [order]);

    const renderLiqPrice = (row) => {
        const size = row?.side === VndcFutureOrderType.Side.SELL ? -row?.quantity : row?.quantity;
        const number = row?.side === VndcFutureOrderType.Side.SELL ? -1 : 1;
        const swap = row?.swap || 0;
        const liqPrice =
            (size * row?.open_price + (row?.fee_data?.place_order?.['22'] || 0) + (row?.fee_data?.place_order?.['72'] || 0) + swap - row?.margin) /
            (row?.quantity * (number - DefaultFuturesFee.Nami));
        return liqPrice > 0 ? formatNumber(liqPrice, 0, decimals.price, false) : '-';
    };

    const renderFeeOther = (order, key, negative = false) => {
        const currency = get(order, `fee_metadata[${key}].currency`, get(order, 'margin_currency', null));
        if (!order || !currency) return '-';
        const assetDigit = allAssets?.[currency]?.assetDigit ?? 0;
        const decimalFunding = currency === 72 ? 0 : 6;
        const decimal = key === 'funding_fee.total' ? decimalFunding : currency === 72 ? assetDigit : assetDigit + 2;
        const assetCode = allAssets?.[currency]?.assetCode ?? '';
        const data = get(order, `fee_metadata[${key}].value`, get(order, key, 0));
        const prefix = negative ? (data < 0 ? '-' : '+') : '';
        return data ? prefix + formatNumber(Math.abs(data), decimal) + ' ' + assetCode : '-';
    };
    return (
        <ModalV2 className="!max-w-[884px]" isVisible={isVisible} onBackdropCb={onClose} wrapClassName="pb-4">
            <Tooltip id={'funding_fee'} place="top" effect="solid" isV3 className="max-w-[300px]" />
            <Tooltip
                id={'liquidate_fee'}
                place="top"
                effect="solid"
                isV3
                className="max-w-[300px] after:!left-[25%]"
                overridePosition={(e) => ({
                    left: 0,
                    top: e.top
                })}
            />
            <div>
                <div className="text-2xl font-semibold mb-8">{t('futures:mobile:order_detail')}</div>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <Row>
                            <Item>ID</Item>
                            <Item>
                                <CopyText text={order?.displaying_id} />
                            </Item>
                        </Row>
                        <Row>
                            <Item>{t('common:volume')}</Item>
                            <Item>{formatNumber(order?.order_value, decimals.symbol)}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:open_time')}</Item>
                            <Item>{formatTime(order?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:order_table:open_price')}</Item>
                            <Item>{formatNumber(price, decimals.price)}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:quote_price')}</Item>
                            <Item>{renderQuoteprice()}</Item>
                        </Row>
                        <Row>
                            <Item>{t('common:last_price')}</Item>
                            <Item>{formatNumber(_lastPrice, decimals.price)}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:stop_loss')}</Item>
                            <Item className="text-red">{order?.sl ? formatNumber(order?.sl, decimals.price) : '-'}</Item>
                        </Row>
                        <Row>
                            <Item className="w-full">
                                <FeeMeta mode="open_fee" orderDetail={order} allAssets={allAssets} t={t} />
                            </Item>
                        </Row>
                        <Row>
                            <Item data-tip={t('futures:mobile:info_liquidate_fee')} data-for="liquidate_fee" tooltip>
                                {t('futures:mobile:liquidate_fee')}
                            </Item>
                            <Item>{renderFeeOther(order, 'liquidate_order')}</Item>
                        </Row>
                    </div>
                    <div>
                        <Row>
                            <Item>{t('futures:leverage:leverage')}</Item>
                            <Item className="text-teal">{order?.leverage}x</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:margin')}</Item>
                            <Item>{formatNumber(order?.margin, decimals.symbol)}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:close_time')}</Item>
                            <Item>{order?.closed_at ? formatTime(order?.closed_at, 'HH:mm:ss dd/MM/yyyy') : '-'}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:order_table:close_price')}</Item>
                            <Item>{order?.close_price ? formatNumber(order?.close_price, decimals.price) : '-'}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:liq_price')}</Item>
                            <Item>{renderLiqPrice(order)}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:reason_close')}</Item>
                            <Item>
                                <ReasonClose order={order} />
                            </Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:take_profit')}</Item>
                            <Item className="text-teal">{order?.tp ? formatNumber(order?.tp, decimals.price) : '-'}</Item>
                        </Row>
                        <Row>
                            <Item>{t('futures:mobile:close_fee')}</Item>
                            <Item>
                                <FeeMetaFutures order={order} mode="close_fee" />
                            </Item>
                        </Row>
                        <Row>
                            <Item data-tip={t('futures:funding_rate_des')} data-for="funding_fee" tooltip>
                                {t('futures:funding_fee')}
                            </Item>
                            <Item className={order?.funding_fee?.total && (order?.funding_fee?.total > 0 ? 'text-teal' : 'text-red')}>
                                {renderFeeOther(order, 'funding_fee.total', true)}
                            </Item>
                        </Row>
                    </div>
                </div>
            </div>
            <AdjustmentHistory
                id={order?.displaying_id}
                onClose={useCallback(() => {
                    onClose();
                }, [])}
            />
        </ModalV2>
    );
};
const Row = styled.div.attrs({
    className: `flex items-center justify-between`
})``;

const Item = styled.div.attrs(({ tooltip }) => ({
    className: `first:text-txtSecondary dark:first:text-txtSecondary-dark last:font-semibold my-2 ${
        tooltip ? 'border-b border-dashed border-divider dark:border-divider-dark' : ''
    }`
}))``;

const Label = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-gray-1 text-left dark:text-txtSecondary-dark ${isTabOpen ? 'text-xs' : 'text-base'}`
}))``;

const Span = styled.div.attrs(({ isTabOpen }) => ({
    className: `text-base text-right font-semibold ${isTabOpen ? 'text-xs' : 'text-base'}`
}))``;

const AdjustmentHistory = React.memo(({ id, onClose }) => {
    const router = useRouter();
    const [dataSource, setDataSource] = useState([]);
    const allAssets = useSelector((state) => getAllAssets(state));
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const [orderDetail, setOrderDetail] = useState(null);
    const checking = useRef(false);
    const mount = useRef(false);
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const ordersList = useSelector((state) => state?.futures?.ordersList);
    const decimalSymbol = allAssets?.[orderDetail?.margin_currency]?.assetDigit ?? 0;
    const decimalUsdt = allAssets?.[orderDetail?.margin_currency]?.assetDigit ?? 0;
    const isHistory = useMemo(() => {
        return orderDetail?.status === VndcFutureOrderType.Status.CLOSED;
    }, [orderDetail]);

    useEffect(() => {
        if (id) getAdjustmentDetail();
    }, []);

    let a = true;
    useEffect(() => {
        orderDetail;
        if (!mount.current && Array.isArray(ordersList) && ordersList.length > 0 && orderDetail) {
            mount.current = true;
            return;
        }
        if (Array.isArray(ordersList) && orderDetail && !isHistory) {
            const order = ordersList.find((item) => item.displaying_id === orderDetail?.displaying_id);
            if (!order) {
                onClose();
            } else {
                const mainOrder = order?.metadata?.dca_order_metadata?.is_main_order || order?.metadata?.partial_close_metadata?.is_main_order;
                if (mainOrder && !checking.current) {
                    checking.current = true;
                    getAdjustmentDetail();
                }
            }
        }
    }, [ordersList, orderDetail, isHistory]);

    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find((rs) => rs.symbol === orderDetail?.symbol);
    }, [orderDetail, allPairConfigs]);
    const isVndcFutures = pairConfigDetail?.quoteAsset === 'VNDC';

    const getColor = (key, value) => {
        if (key === 'tp') {
            return value > 0 ? '' : '!text-txtPrimary dark:!text-txtPrimary-dark';
        } else {
            return value > 0 ? '' : '!text-txtPrimary dark:!text-txtPrimary-dark';
        }
    };

    const decimalPrice = useMemo(() => {
        const decimalScalePrice = pairConfigDetail?.filters.find((rs) => rs.filterType === 'PRICE_FILTER');
        return countDecimals(decimalScalePrice?.tickSize) ?? 0;
    }, [pairConfigDetail]);

    const getAdjustmentDetail = async () => {
        try {
            const { status, data, message } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: id
                }
            });
            if (status === ApiStatus.SUCCESS) {
                setOrderDetail(data);
                setDataSource(data?.futuresorderlogs ?? []);
            }
        } catch (e) {
            console.log(e);
        } finally {
            checking.current = false;
        }
    };

    const redirect = (url) => {
        router.push(url);
    };

    const renderLogAddVolume = (item) => {
        return (
            <>
                <Row>
                    <Item>
                        <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    </Item>
                    <Item>
                        <Span>{t('futures:mobile:adjust_margin:added_volume')}</Span>
                    </Item>
                </Row>
                {item?.metadata?.modify_leverage && (
                    <Row>
                        <Item>
                            <Label>{t('futures:leverage:leverage')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderModify(item.metadata, 'leverage')}</Span>
                        </Item>
                    </Row>
                )}
                <Row>
                    <Item>
                        <Label>{t('common:from')}</Label>
                    </Item>
                    <Item>
                        <Span
                            className="text-teal cursor-pointer"
                            onClick={() => redirect(`/futures/order/${item?.metadata?.child_id}`)}
                        >{`#${item?.metadata?.child_id}`}</Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('futures:margin')}</Label>
                    </Item>
                    <Item>
                        <Span>{renderModify(item?.metadata, 'margin')}</Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('common:time')}</Label>
                    </Item>
                    <Item>
                        <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss.SSS')}</Span>
                    </Item>
                </Row>
                {item?.metadata?.modify_open_price && (
                    <Row>
                        <Item>
                            <Label>{t('futures:order_table:open_price')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderModify(item?.metadata, 'open_price')}</Span>
                        </Item>
                    </Row>
                )}
                <Row>
                    <Item>
                        <Label>{t('common:order_type')}</Label>
                    </Item>
                    <Item>
                        <Span>{renderCellTable('type', item.metadata, t, language)}</Span>
                    </Item>
                </Row>
                {item?.metadata?.modify_liq_price && (
                    <Row>
                        <Label>{t('futures:mobile:liq_price')}</Label>
                        <Span>{renderModify(item?.metadata, 'liq_price')}</Span>
                    </Row>
                )}
                <Row>
                    <Item>
                        <Label>{t('futures:order_table:volume')}</Label>
                    </Item>
                    <Item>
                        <Span>{renderModify(item?.metadata, 'volume')}</Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('futures:mobile:open_fee')}</Label>
                    </Item>
                    <Item>
                        <Span>{renderFee(item?.metadata, 'place_order')}</Span>
                    </Item>
                </Row>
            </>
        );
    };

    const renderFee = (orderDetail, key, negative = false) => {
        if (!orderDetail) return '-';
        const currency = orderDetail?.fee_metadata[key]?.currency ?? orderDetail?.margin_currency;
        const assetDigit = allAssets?.[currency]?.assetDigit ?? 0;
        const decimalFunding = currency === 72 ? 0 : 6;
        const decimal = key === 'funding_fee.total' ? decimalFunding : currency === 72 ? assetDigit : assetDigit + 2;
        const assetCode = allAssets?.[currency]?.assetCode ?? '';
        const data = orderDetail?.fee_metadata[key] ? orderDetail?.fee_metadata[key]['value'] : get(orderDetail, key, 0);
        const prefix = negative ? (data < 0 ? '-' : '+') : '';
        return data ? prefix + formatNumber(Math.abs(data), decimal) + ' ' + assetCode : '-';
    };

    const renderLogModifySlTp = (item) => {
        return (
            <>
                <Row>
                    <Item>
                        <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    </Item>
                    <Item>
                        <Span>{t('futures:tp_sl:modify_tpsl')}</Span>
                    </Item>
                </Row>
                {item?.metadata?.modify_sl && (
                    <Row>
                        <Item>
                            <Label>{t('futures:stop_loss')}</Label>
                        </Item>
                        <Item>
                            <Span className="text-red-2">{renderModify(item?.metadata, 'stop_loss')}</Span>
                        </Item>
                    </Row>
                )}
                <Row>
                    <Item>
                        <Label>{t('common:time')}</Label>
                    </Item>
                    <Item>
                        <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss.SSS')}</Span>
                    </Item>
                </Row>
                {item?.metadata?.modify_tp && (
                    <Row>
                        <Item>
                            <Label>{t('futures:take_profit')}</Label>
                        </Item>
                        <Item>
                            <Span className="text-green-2">{renderModify(item?.metadata, 'take_profit')}</Span>
                        </Item>
                    </Row>
                )}
                {item?.metadata?.modify_price && (
                    <Row>
                        <Item>
                            <Label>{t('futures:price')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderModify(item?.metadata, 'price')}</Span>
                        </Item>
                    </Row>
                )}
                {item?.metadata?.modify_margin && (
                    <Row>
                        <Item>
                            <Label>{t('futures:margin')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderModify(item?.metadata, 'margin')}</Span>
                        </Item>
                    </Row>
                )}
            </>
        );
    };

    const renderLogModifyMargin = (item) => {
        return (
            <>
                <Row>
                    <Item>
                        <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    </Item>
                    <Item>
                        <Span>{t('futures:mobile:adjust_margin:adjust_position_margin')}</Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('futures:margin')}</Label>
                    </Item>
                    <Item>
                        <Span>{renderModify(item?.metadata, 'margin')}</Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('common:time')}</Label>
                    </Item>
                    <Item>
                        <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss.SSS')}</Span>
                    </Item>
                </Row>
            </>
        );
    };

    const renderLogRemoveMarginFunding = (item) => {
        return (
            <>
                <Row>
                    <Item>
                        <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                    </Item>
                    <Item>
                        <Span>
                            {t('futures:mobile:adjust_margin:remove_margin_funding')} <span className="lowercase">({t('futures:funding_fee')})</span>
                        </Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('common:time')}</Label>
                    </Item>
                    <Item>
                        <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss.SSS')}</Span>
                    </Item>
                </Row>
                <Row>
                    <Item>
                        <Label>{t('futures:mobile:adjust_margin:remove_margin_funding')}</Label>
                    </Item>
                    <Item>
                        <Span>{renderModify(item?.metadata, 'remove_margin_funding')}</Span>
                    </Item>
                </Row>
            </>
        );
    };

    const renderModify = (metadata, key) => {
        let value = null;
        switch (key) {
            case 'price':
                value = metadata?.modify_price ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_price?.before)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className="text-right"> {getValue(metadata?.modify_price?.after)}</div>
                    </div>
                ) : (
                    getValue(metadata?.price)
                );
                return value;
            case 'take_profit':
                value = metadata?.modify_tp ? (
                    <div className="flex items-center justify-between">
                        <div className={`text-left ${getColor('tp', metadata?.modify_tp?.before)}`}>{getValue(metadata?.modify_tp?.before)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className={`text-right ${getColor('tp', metadata?.modify_tp?.after)}`}>{getValue(metadata?.modify_tp?.after)}</div>
                    </div>
                ) : null;
                return value;
            case 'stop_loss':
                value = metadata?.modify_sl ? (
                    <div className="flex items-center justify-between">
                        <div className={`text-left ${getColor('sl', metadata?.modify_sl?.before)}`}>{getValue(metadata?.modify_sl?.before)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className={`text-right ${getColor('sl', metadata?.modify_sl?.after)}`}>{getValue(metadata?.modify_sl?.after)} </div>
                    </div>
                ) : null;
                return value;
            case 'margin':
                value = metadata?.modify_margin ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_margin?.before, true)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className="text-right">{getValue(metadata?.modify_margin?.after, true)} </div>
                    </div>
                ) : null;
                return value;
            case 'volume':
                value = metadata?.modify_order_value ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_order_value?.before, true)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className="text-right">{getValue(metadata?.modify_order_value?.after, true)} </div>
                    </div>
                ) : null;
                return value;
            case 'leverage':
                value = metadata?.modify_leverage ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left text-green-2">{getValue(metadata?.modify_leverage?.before, true)}x</div>
                        &nbsp;
                        <ArrowRight size={14} color={colors.teal} />
                        &nbsp;
                        <div className="text-right text-green-2">{getValue(metadata?.modify_leverage?.after, true)}x</div>
                    </div>
                ) : null;
                return value;
            case 'open_price':
                value = metadata?.modify_open_price ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_open_price?.before)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className="text-right">{getValue(metadata?.modify_open_price?.after)} </div>
                    </div>
                ) : null;
                return value;
            case 'liq_price':
                value = metadata?.modify_liq_price ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.modify_liq_price?.before)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className="text-right">{getValue(metadata?.modify_liq_price?.after)} </div>
                    </div>
                ) : null;
                return value;
            case 'remove_margin_funding':
                value = metadata?.remove_margin ? (
                    <div className="flex items-center justify-between">
                        <div className="text-left">{getValue(metadata?.remove_margin?.before, true)}</div>
                        &nbsp;
                        <ArrowRight size={14} />
                        &nbsp;
                        <div className="text-right">{getValue(metadata?.remove_margin?.after, true)} </div>
                    </div>
                ) : null;
                return value;
            default:
                return value;
        }
    };

    const renderLogPartialClose = (item) => {
        const ratio = Math.abs(item?.metadata?.profit / (item?.metadata?.modify_margin?.before - item?.metadata?.modify_margin?.after)) * 100;
        return (
            <>
                <div>
                    <Row>
                        <Item>
                            <Label>{t('futures:mobile:adjust_margin:adjustment_type')}</Label>
                        </Item>
                        <Item>
                            <Span>{t('futures:mobile:adjust_margin:close_partially')}</Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>{t('common:to')}</Label>
                        </Item>
                        <Item>
                            <Span
                                className="text-teal cursor-pointer"
                                onClick={() => redirect(`/futures/order/${item?.metadata?.child_id}`)}
                            >{`#${item?.metadata?.child_id}`}</Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>{t('common:order_type')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderCellTable('type', item.metadata, t, language)}</Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>{t('common:time')}</Label>
                        </Item>
                        <Item>
                            <Span>{formatTime(item?.createdAt, 'yyyy-MM-dd HH:mm:ss.SSS')}</Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>{t('futures:order_table:volume')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderModify(item?.metadata, 'volume')}</Span>
                        </Item>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Item>
                            <Label>{t('futures:margin')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderModify(item?.metadata, 'margin')}</Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>{t('futures:order_table:open_price')}</Label>
                        </Item>
                        <Item>
                            <Span>{formatNumber(item?.metadata?.open_price, decimalPrice)}</Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>PNL</Label>
                        </Item>
                        <Item>
                            <Span className={+item?.metadata?.profit > 0 ? 'text-green-2' : 'text-red-2'}>
                                {formatNumber(item?.metadata?.profit, isVndcFutures ? decimalUsdt : decimalUsdt + 2, 0, true)} (
                                {formatNumber(ratio, 2, 0, true)}%)
                            </Span>
                        </Item>
                    </Row>
                    <Row>
                        <Item className="w-full">
                            <FeeMeta mode="open_fee" orderDetail={item?.metadata} allAssets={allAssets} t={t} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>
                            <Label>{t('futures:mobile:close_fee')}</Label>
                        </Item>
                        <Item>
                            <Span>{renderFee(item?.metadata, 'close_order')}</Span>
                        </Item>
                    </Row>
                </div>
            </>
        );
    };

    const getValue = (number, symbol = false) => {
        if (number) {
            return formatNumber(number, symbol ? decimalSymbol : decimalPrice, 0, true);
        } else {
            return t('futures:not_set');
        }
    };

    return (
        <>
            <div className="mt-10">
                {dataSource.length > 0 && (
                    <div>
                        <div className="font-semibold mb-8 text-2xl">{t('futures:order_history:adjustment_history')}</div>
                        {dataSource.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-2 gap-x-8 border border-divider dark:border-transparent dark:bg-dark-4 p-4 rounded-xl text-base mb-4"
                            >
                                {item?.type === 'MODIFY_MARGIN' && renderLogModifyMargin(item)}
                                {item?.type === 'REMOVE_MARGIN_FUNDING_FEE' && renderLogRemoveMarginFunding(item)}
                                {item?.type === 'MODIFY' && renderLogModifySlTp(item)}
                                {item?.type === 'ADD_VOLUME' && renderLogAddVolume(item)}
                                {item?.type === 'PARTIAL_CLOSE' && renderLogPartialClose(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
});

const FeeMeta = React.memo(({ orderDetail, mode = 'open_fee', allAssets, t }) => {
    const [visible, setVisible] = useState(false);

    const convertObject = (obj) => {
        if (obj?.currency) {
            return [
                {
                    asset: +obj?.currency,
                    value: obj?.value ?? 0
                }
            ];
        } else {
            const arr = [];
            Object.keys(obj).map((key) => {
                arr.push({
                    asset: +key,
                    value: obj[key]
                });
            });
            return arr;
        }
    };

    const fee_metadata = useMemo(() => {
        const metadata = orderDetail?.fee_data ?? orderDetail?.fee_metadata;
        const feeFilter = metadata?.[mode === 'open_fee' ? 'place_order' : 'close_order'];
        const fee = feeFilter ? convertObject(feeFilter) : [];
        return fee;
    }, [orderDetail]);

    const decimal = fee_metadata[0]?.asset === 72 ? allAssets[fee_metadata[0]?.asset]?.assetDigit : allAssets[fee_metadata[0]?.asset]?.assetDigit + 2;

    return (
        <>
            <div className="flex items-center justify-between w-full">
                <Label className="font-normal">{t(`futures:mobile:${mode}`)}</Label>
                <Span className={fee_metadata.length > 1 ? 'cursor-pointer' : 'text-gray-4'} onClick={() => fee_metadata.length > 1 && setVisible(!visible)}>
                    {fee_metadata.length > 1 ? (
                        visible ? (
                            <ChevronUp size={24} color="#8694b2" />
                        ) : (
                            <ChevronDown size={24} color="#8694b2" />
                        )
                    ) : !fee_metadata[0]?.value ? (
                        '-'
                    ) : (
                        formatNumber(fee_metadata[0]?.value, decimal) + ' ' + allAssets[fee_metadata[0]?.asset]?.assetCode
                    )}
                </Span>
            </div>
            {visible && (
                <div className="mt-2 rounded-md w-full grid grid-cols-2 gap-2 border dark:border-divider-dark p-3">
                    {fee_metadata.map((rs, idx) => (
                        <div className={`text-base font-semibold text-gray-4 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`} key={idx}>
                            {formatNumber(rs.value, rs.asset === 72 ? allAssets[rs.asset].assetDigit : allAssets[rs.asset].assetDigit + 2)}{' '}
                            {allAssets[rs.asset].assetCode}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
});
export default FuturesOrderDetailModal;
