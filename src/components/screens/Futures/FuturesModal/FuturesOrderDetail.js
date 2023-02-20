import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { CopyText, formatNumber, formatTime } from 'redux/actions/utils';
import MiniTickerData from 'components/screens/Futures/MiniTickerData';
import { DefaultFuturesFee } from 'redux/actions/const';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { fees, getTypesLabel, renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import get from 'lodash/get';
import Tooltip from 'components/common/Tooltip';

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
const FuturesOrderDetail = ({ isVisible, onClose, order, decimals, lastPrice }) => {
    const { t } = useTranslation();
    const allAssets = useSelector((state) => getAllAssets(state));
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const _lastPrice = marketWatch ? marketWatch[order?.symbol]?.lastPrice : lastPrice;
    const status = order?.status;

    const price = useMemo(() => {
        return +(status === VndcFutureOrderType.Status.PENDING
            ? order?.price
            : status === VndcFutureOrderType.Status.ACTIVE
            ? order?.open_price
            : order?.close_price);
    }, [order]);

    const renderQuoteprice = useCallback(() => {
        return order?.side === VndcFutureOrderType.Side.BUY ? (
            <MiniTickerData key={order?.displaying_id + 'bid'} initPairPrice={marketWatch} dataKey={'bid'} symbol={order?.symbol} />
        ) : (
            <MiniTickerData key={order?.displaying_id + 'ask'} initPairPrice={marketWatch} dataKey={'ask'} symbol={order?.symbol} />
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

    const renderReasonClose = () => {
        switch (order?.reason_close_code) {
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

    const renderFeeOther = (order, key, negative = false) => {
        if (!order) return '-';
        const currency = order?.fee_metadata[key]?.currency ?? order?.margin_currency;
        const assetDigit = allAssets?.[currency]?.assetDigit ?? 0;
        const decimalFunding = currency === 72 ? 0 : 6;
        const decimal = key === 'funding_fee.total' ? decimalFunding : currency === 72 ? assetDigit : assetDigit + 2;
        const assetCode = allAssets?.[currency]?.assetCode ?? '';
        const data = order?.fee_metadata[key] ? order?.fee_metadata[key]['value'] : get(order, key, 0);
        const prefix = negative ? (data < 0 ? '-' : '+') : '';
        return data ? prefix + formatNumber(Math.abs(data), decimal) + ' ' + assetCode : '-';
    };

    return (
        <ModalV2 className="!max-w-[800px]" isVisible={isVisible} onBackdropCb={onClose}>
            <Tooltip id={'funding_fee'} place="top" effect="solid" isV3 className="max-w-[300px]" />
            <Tooltip
                id={'liquidate_fee'}
                place="top"
                effect="solid"
                isV3
                className="max-w-[300px]"
                overridePosition={(e) => ({
                    left: 0,
                    top: e.top
                })}
            />
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
                        <Item className="text-red" F>
                            {formatNumber(order?.sl, decimals.price)}
                        </Item>
                    </Row>
                    <FeeMeta mode="open_fee" order={order} allAssets={allAssets} t={t} />
                    <Row>
                        <Item data-tip={t('futures:mobile:info_liquidate_fee')} data-for="liquidate_fee" tooltip>
                            {t('futures:mobile:liquidate_fee')}
                        </Item>
                        <Item>{renderFeeOther(order, 'liquidate_order')}</Item>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Item>{t('common:leverage')}</Item>
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
                        <Item>{renderReasonClose()}</Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:take_profit')}</Item>
                        <Item className="text-teal">{formatNumber(order?.tp, decimals.price)}</Item>
                    </Row>
                    <FeeMeta mode="close_fee" order={order} allAssets={allAssets} t={t} />
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

const FeeMeta = ({ order, mode = 'open_fee', allAssets, t }) => {
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
        const metadata = order?.fee_data ?? order?.fee_metadata;
        const feeFilter = metadata?.[mode === 'open_fee' ? 'place_order' : 'close_order'];
        const fee = feeFilter ? convertObject(feeFilter) : [];
        return fee;
    }, [order]);

    const decimal = fee_metadata[0]?.asset === 72 ? allAssets[fee_metadata[0]?.asset]?.assetDigit : allAssets[fee_metadata[0]?.asset]?.assetDigit + 2;

    return (
        <>
            <Row className="flex items-center justify-between w-full">
                <Item>{t(`futures:mobile:${mode}`)}</Item>
                <Item onClick={() => fee_metadata.length > 1 && setVisible(!visible)}>
                    {fee_metadata.length > 1
                        ? visible
                            ? t('common:global_btn:close')
                            : t('common:view_all')
                        : !fee_metadata[0]?.value
                        ? '-'
                        : formatNumber(fee_metadata[0]?.value, decimal) + ' ' + allAssets[fee_metadata[0]?.asset]?.assetCode}
                </Item>
            </Row>
            {/* {visible && (
                <div className="mt-3 text-sm font-medium w-full grid grid-cols-2 gap-2">
                    {fee_metadata.map((rs, idx) => (
                        <div className={idx % 2 === 0 ? 'text-left' : 'text-right'} key={idx}>
                            {formatNumber(rs.value, rs.asset === 72 ? allAssets[rs.asset].assetDigit : allAssets[rs.asset].assetDigit + 2)}{' '}
                            {allAssets[rs.asset].assetCode}
                        </div>
                    ))}
                </div>
            )} */}
        </>
    );
};

export default FuturesOrderDetail;
