import React, { useMemo } from 'react';
import { formatNumber, formatTime, getUnit, getDecimalQty, getDecimalPrice, TypeTable, CopyText, ReasonClose, FeeMetaFutures } from 'redux/actions/utils';
import { ShareIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import ChevronDown from 'components/svg/ChevronDown';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Link from 'next/link';
import { fees, getTypesLabel, renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const OrderDetailHistory = ({ orderDetail, decimals, setShowShareModal, isDark, general, pairConfig }) => {
    const { t } = useTranslation();

    const renderDetailAddedVol = () => {
        const id_to = orderDetail?.metadata?.dca_order_metadata?.dca_order?.[0]?.displaying_id;
        const price = +orderDetail?.status === VndcFutureOrderType.Status.PENDING ? orderDetail?.price : orderDetail?.open_price;
        return (
            <>
                <div>
                    <Row>
                        <Item>ID</Item>
                        <Item>
                            <CopyText text={orderDetail?.displaying_id} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:mobile:reason_close')}</Item>
                        <Item>
                            <ReasonClose order={orderDetail} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('common:order_type')}</Item>
                        <Item>
                            <TypeTable type="type" data={orderDetail} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:mobile:open_fee')}</Item>
                        <Item>
                            <FeeMetaFutures order={orderDetail} mode="open_fee" />
                        </Item>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Item>{t('futures:leverage:leverage')}</Item>
                        <Item className="text-teal">{orderDetail?.leverage}x</Item>
                    </Row>
                    <Row>
                        <Item>{t('common:to')}</Item>
                        <Item>
                            <Link href={`/futures/order/${id_to}`}>
                                <a className="text-teal">#{id_to}</a>
                            </Link>
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:volume')}</Item>
                        <Item>{`${formatNumber(orderDetail?.order_value, decimals.symbol)} (${formatNumber(orderDetail?.quantity, 6)} ${
                            pairConfig?.baseAsset
                        })`}</Item>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Item>{t('futures:mobile:open_time')}</Item>
                        <Item>{formatTime(orderDetail?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:open_price')}</Item>
                        <Item>{price ? formatNumber(price, decimals.price) : '-'}</Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:margin')}</Item>
                        <Item>{formatNumber(orderDetail?.margin, decimals.symbol)}</Item>
                    </Row>
                </div>
            </>
        );
    };
    const renderDetailPartialClose = () => {
        const price = orderDetail?.status === VndcFutureOrderType.Status.PENDING ? orderDetail?.price : orderDetail?.open_price;
        const from_id = orderDetail?.metadata?.partial_close_metadata?.partial_close_from;
        return (
            <>
                <div>
                    <Row>
                        <Item>ID</Item>
                        <Item>
                            <CopyText text={orderDetail?.displaying_id} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:mobile:reason_close')}</Item>
                        <Item>
                            <ReasonClose order={orderDetail} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:open_price')}</Item>
                        <Item>{formatNumber(orderDetail?.open_price, decimals.price)}</Item>
                    </Row>
                    <Row>
                        <Item>{t('common:order_type')}</Item>
                        <Item>
                            <TypeTable type="type" data={orderDetail} />
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:margin')}</Item>
                        <Item>{formatNumber(orderDetail?.margin, decimals.symbol)}</Item>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Item>{t('futures:leverage:leverage')}</Item>
                        <Item className="text-teal">{orderDetail?.leverage}x</Item>
                    </Row>
                    <Row>
                        <Item>{t('common:from')}</Item>
                        <Item>
                            <Link href={`/futures/order/${from_id}`}>
                                <a className="text-teal">#{from_id}</a>
                            </Link>
                        </Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:close_price')}</Item>
                        <Item>{price ? formatNumber(price, decimals.price) : '-'}</Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:volume')}</Item>
                        <Item>{`${formatNumber(orderDetail?.order_value, decimals.symbol)} (${formatNumber(orderDetail?.quantity, 6)} ${
                            pairConfig?.baseAsset
                        })`}</Item>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Item>{t('futures:mobile:open_time')}</Item>
                        <Item>{formatTime(orderDetail?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:close_price')}</Item>
                        <Item>{price ? formatNumber(orderDetail?.close_price, decimals.price) : '-'}</Item>
                    </Row>
                </div>
            </>
        );
    };

    const renderDetail = () => {};

    const renderDetails = () => {
        const mainOrder = orderDetail?.metadata?.dca_order_metadata?.is_main_order || orderDetail?.metadata?.partial_close_metadata?.is_main_order;
        if ((orderDetail?.reason_close_code === 5 || orderDetail?.metadata?.dca_order_metadata) && !mainOrder) {
            return renderDetailAddedVol();
        } else if ((orderDetail?.reason_close_code === 6 || orderDetail?.metadata?.partial_close_metadata) && !mainOrder) {
            return renderDetailPartialClose();
        } else {
            return renderDetail();
        }
    };

    return (
        <div className="grid grid-cols-12 rounded-md border border-divider dark:border-divider-dark">
            <div className="col-span-4 px-8 py-6 border-r border-divider dark:border-divider-dark">
                {orderDetail?.metadata?.dca_order_metadata && (
                    <div className="text-teal text-sm bg-teal/[0.1] px-4 py-1 mb-6 w-max rounded-full">{t('futures:mobile:adjust_margin:order_completed')}</div>
                )}
                <div className="flex items-center space-x-1 text-xs leading-5 text-txtSecondary dark:text-txtSecondary-dark">
                    <span>ID #{orderDetail?.displaying_id}</span>
                    <span>•</span>
                    <span>{formatTime(orderDetail?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                </div>
                <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold">{orderDetail?.symbol}</span>
                        <span className="py-0.5 px-1 bg-gray-11 dark:bg-dark-2 rounded-[3px] text-xs font-semibold">{orderDetail?.leverage}x</span>
                    </div>
                    <div className={`flex items-center text-xs leading-4 ${general.isBuy ? 'text-teal' : 'text-red'}`}>
                        {orderDetail?.metadata?.dca_order_metadata && <span>{t('futures:mobile:adjust_margin:added_volume')}&nbsp;/&nbsp;</span>}
                        {orderDetail?.metadata?.partial_close_metadata && <span>{t('futures:mobile:adjust_margin:close_partially')}&nbsp;/&nbsp;</span>}
                        <TypeTable type="side" data={orderDetail} />
                        <span>&nbsp;/&nbsp;</span>
                        <TypeTable type="type" data={orderDetail} />
                    </div>
                </div>
                {!orderDetail?.metadata?.dca_order_metadata && (
                    <div className="mt-6 space-y-2 text-sm">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">PNL (%ROE)</div>
                        <div className={`${general.profit < 0 ? 'text-red' : 'text-teal'} space-x-1`}>
                            <span className="text-2xl font-semibold">
                                {general.profit < 0 ? '' : '+'}
                                {formatNumber(general.profit, decimals.symbol, 0, true)}
                            </span>
                            <span>({formatNumber(general.percent, 2, 0, true)}%)</span>
                        </div>
                    </div>
                )}
                {!orderDetail?.metadata?.dca_order_metadata && (
                    <ButtonV2 className="space-x-2 mt-6" onClick={() => setShowShareModal(true)}>
                        <ShareIcon color={isDark ? colors.white : colors.darkBlue} className="cursor-pointer" />
                        <span>{t('common:share')}</span>
                    </ButtonV2>
                )}
            </div>
            <div className="col-span-8 p-6 grid grid-cols-3 gap-8 text-sm bg-dark-4 rounded-r-md">{renderDetails()}</div>
        </div>
    );
};

const Row = styled.div.attrs({
    className: `flex items-center justify-between h-10`
})``;

const Item = styled.div.attrs(({ tooltip }) => ({
    className: `first:text-txtSecondary dark:first:text-txtSecondary-dark last:font-semibold whitespace-nowrap ${
        tooltip ? 'border-b border-dashed border-divider dark:border-divider-dark' : ''
    }`
}))``;

export default OrderDetailHistory;
