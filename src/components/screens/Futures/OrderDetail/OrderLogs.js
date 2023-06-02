import React, { useMemo } from 'react';
import get from 'lodash/get';
import TableV2 from 'components/common/V2/TableV2';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import { fees } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber, formatTime, TypeTable } from 'redux/actions/utils';

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

const OrderLogs = ({ orderDetail, decimals }) => {
    const allAssets = useSelector((state) => getAllAssets(state));
    const { t } = useTranslation();

    const getTypeLabel = (key) => {
        switch (key) {
            case 'MODIFY_MARGIN':
                return t('futures:mobile:adjust_margin:adjust_position_margin');
            case 'REMOVE_MARGIN_FUNDING_FEE':
                return t('futures:mobile:adjust_margin:remove_margin_funding');
            case 'MODIFY':
                return t('futures:tp_sl:modify_tpsl');
            case 'ADD_VOLUME':
                return t('futures:mobile:adjust_margin:added_volume');
            case 'PARTIAL_CLOSE':
                return t('futures:mobile:adjust_margin:close_partially');

            default:
                return null;
        }
    };

    const formatModify = (item, key) => {
        return {
            before: item?.metadata?.[key]?.before,
            after: item?.metadata?.[key]?.after
        };
    };

    const renderFee = (order, key, negative = false) => {
        const currency = get(order, `fee_metadata[${key}].currency`, get(order, 'margin_currency', null));
        if (!order || !currency) return '_';
        const assetDigit = allAssets?.[currency]?.assetDigit ?? 0;
        const decimalFunding = currency === 72 ? 0 : 6;
        const decimal = key === 'funding_fee.total' ? decimalFunding : currency === 72 ? assetDigit : assetDigit + 2;
        const assetCode = allAssets?.[currency]?.assetCode ?? '';
        const data = get(order, `fee_metadata[${key}].value`, get(order, key, 0));
        const prefix = negative ? (data < 0 ? '-' : '+') : '';
        return data ? prefix + formatNumber(Math.abs(data), decimal) + ' ' + assetCode : '_';
    };

    const dataTable = useMemo(() => {
        const dataFilter = orderDetail?.futuresorderlogs.map((item) => {
            return {
                type_modify: getTypeLabel(item?.type),
                time: formatTime(item?.createdAt, 'HH:mm:ss dd/MM/yyyy'),
                type_order: {
                    label: item?.type === 'ADD_VOLUME' ? t('common:from') : t('common:to'),
                    value: item?.metadata?.child_id,
                    type: item?.metadata?.child_id ? <TypeTable type="type" data={{ type: item?.metadata?.type }} /> : '_'
                },
                sl_tp: {
                    sl: formatModify(item, 'modify_sl'),
                    tp: formatModify(item, 'modify_tp')
                },
                vol_margin: {
                    volume: formatModify(item, 'modify_order_value'),
                    margin: formatModify(item, 'modify_margin')
                },
                open_liq: {
                    open_price: formatModify(item, 'modify_open_price'),
                    liq_price: formatModify(item, 'modify_liq_price')
                },
                leverage: formatModify(item, 'modify_leverage'),
                pnl: {
                    profit: item?.metadata?.profit,
                    percent: item?.metadata?.profit
                        ? (item?.metadata?.profit / (item?.metadata?.modify_margin?.before - item?.metadata?.modify_margin?.after)) * 100
                        : 0
                },
                fee: {
                    place_order: renderFee(item?.metadata, 'place_order'),
                    close_order: renderFee(item?.metadata, 'close_order')
                }
            };
        });
        return dataFilter;
    }, [orderDetail]);

    const getValue = (number, decimal = 0) => {
        if (number) {
            return formatNumber(number, decimal, 0, true);
        } else {
            return '_';
        }
    };

    const renderOrderType = (e) => (
        <div className="space-y-2">
            <Row>
                <Item>{t('futures:order_table:mobile:order')}:</Item>
                <Item>
                    {!e?.value ? (
                        '_'
                    ) : (
                        <>
                            {e?.label}&nbsp;
                            <Link href={`/futures/order/${e?.value}`}>
                                <a className="text-teal">#{e?.value}</a>
                            </Link>
                        </>
                    )}
                </Item>
            </Row>
            <Row>
                <Item>{t('common:type')}:</Item>
                <Item>{e.type}</Item>
            </Row>
        </div>
    );

    const renderLogs = (e, key) => {
        let data = {
            top: { label: '', key: '', className: '', decimal: 0 },
            bottom: { label: '', key: '', className: '', decimal: 0 }
        };
        switch (key) {
            case 'sl_tp':
                data = {
                    top: { label: 'SL', key: 'sl', className: 'text-red', decimal: decimals.price },
                    bottom: { label: 'TP', key: 'tp', className: 'text-teal', decimal: decimals.price }
                };
                break;
            case 'vol_margin':
                data = {
                    top: { label: t('futures:mobile:volume'), key: 'volume', decimal: decimals.symbol },
                    bottom: { label: t('futures:margin'), key: 'margin', decimal: decimals.symbol }
                };
                break;
            case 'open_liq':
                data = {
                    top: { label: t('common:open'), key: 'open_price', decimal: decimals.price },
                    bottom: { label: t('futures:order_history:liquidate'), key: 'liq_price', decimal: decimals.price }
                };
                break;
            case 'leverage':
                return <span>{e?.after ? getValue(e?.before, 0) + 'x' + ' > ' + getValue(e?.after, 0) + 'x' : '_'}</span>;
            case 'pnl':
                const negative = e?.profit > 0 ? '+' : '';
                return (
                    <span className={e?.profit && (e?.profit < 0 ? 'text-red' : 'text-teal')}>
                        {`${negative}${getValue(e?.profit, decimals.symbol)}`} {e?.profit ? `(${negative}${formatNumber(e?.percent, 2, 0, true)}%)` : null}
                    </span>
                );
            case 'fee':
                return (
                    <div className="space-y-2">
                        <Row>
                            <Item>{t('common:open')}:</Item>
                            <Item>{e?.place_order}</Item>
                        </Row>
                        <Row>
                            <Item>{t('common:close')}:</Item>
                            <Item>{e?.close_order}</Item>
                        </Row>
                    </div>
                );
            default:
                break;
        }

        return (
            <div className="space-y-2">
                <Row>
                    <Item>{data.top.label}:</Item>
                    <Item className={data.top.className}>
                        {e?.[data.top.key].after
                            ? getValue(e?.[data.top.key].before, data.top.decimal) + ' > ' + getValue(e?.[data.top.key].after, data.top.decimal)
                            : '_'}
                    </Item>
                </Row>
                <Row>
                    <Item>{data.bottom.label}:</Item>
                    <Item className={data.bottom.className}>
                        {e?.[data.bottom.key].after
                            ? getValue(e?.[data.bottom.key].before, data.bottom.decimal) + ' > ' + getValue(e?.[data.bottom.key].after, data.bottom.decimal)
                            : '_'}
                    </Item>
                </Row>
            </div>
        );
    };

    const columns = [
        {
            dataIndex: 'type_modify',
            title: t('futures:mobile:adjust_margin:adjustment_type'),
            width: 180
        },
        {
            dataIndex: 'time',
            title: t('common:time'),
            width: 180
        },
        {
            dataIndex: 'type_order',
            title: (
                <span>
                    {t('futures:order_table:mobile:order')} / {t('common:order_type')}
                </span>
            ),
            width: 200,
            render: renderOrderType
        },
        {
            dataIndex: 'sl_tp',
            title: (
                <span>
                    {t('futures:stop_loss')} / {t('futures:take_profit')}
                </span>
            ),
            width: 300,
            render: (row) => renderLogs(row, 'sl_tp')
        },
        {
            dataIndex: 'vol_margin',
            title: (
                <span>
                    {t('futures:volume')} / {t('futures:margin')}
                </span>
            ),
            width: 300,
            render: (row) => renderLogs(row, 'vol_margin')
        },
        {
            dataIndex: 'open_liq',
            title: (
                <span>
                    {t('futures:order_table:open_price')} / {t('futures:mobile:liq_price')}
                </span>
            ),
            width: 300,
            render: (row) => renderLogs(row, 'open_liq')
        },
        {
            dataIndex: 'leverage',
            title: <span>{t('futures:leverage:leverage')}</span>,
            width: 200,
            render: (row) => renderLogs(row, 'leverage')
        },
        {
            dataIndex: 'pnl',
            title: <span>{t('futures:mobile:adjust_margin:est_pnl')}</span>,
            width: 200,
            render: (row) => renderLogs(row, 'pnl')
        },
        {
            dataIndex: 'fee',
            title: (
                <span>
                    {t('futures:mobile:open_fee')} / {t('futures:mobile:close_fee')}
                </span>
            ),
            width: 300,
            render: (row) => renderLogs(row, 'fee')
        }
    ];

    return (
        <TableV2
            useRowHover
            data={dataTable}
            columns={columns}
            rowKey={(item) => `${item?.key}`}
            limit={10}
            skip={0}
            tableStyle={{ padding: '12px 16px' }}
            noBorder={true}
            pagingClassName="border-none"
            className="border border-divider dark:border-divider-dark rounded-xl"
        />
    );
};

const Row = styled.div.attrs({
    className: `flex items-center space-x-1`
})``;

const Item = styled.div.attrs(({ tooltip }) => ({
    className: `first:text-txtSecondary dark:first:text-txtSecondary-dark whitespace-nowrap ${
        tooltip ? 'border-b border-dashed border-divider dark:border-divider-dark' : ''
    }`
}))``;

export default OrderLogs;
