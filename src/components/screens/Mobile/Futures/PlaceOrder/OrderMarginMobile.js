import React, { memo, useMemo } from 'react';
import TradingLabel from 'components/trade/TradingLabel';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatCurrency } from 'redux/actions/utils';
import { useSelector } from 'react-redux'
import { getS3Url } from 'redux/actions/utils';

const OrderMarginMobile = ({ marginAndValue, pairConfig, availableAsset }) => {
    const { t } = useTranslation();
    const quoteAsset = pairConfig?.quoteAsset ?? '';
    return (
        <div className="flex flex-col h-full justify-around">
            <div className="flex items-center justify-between">
                <TradingLabel
                    label={t('futures:avlb') + ' ' + quoteAsset}
                    value={`${formatNumber(
                        availableAsset ?? 0,
                        0
                    )}`}
                    containerClassName='text-xs flex flex-wrap justify-between w-full'
                />&nbsp;
                <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
            </div>
            <TradingLabel
                label={t('futures:margin')}
                value={`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                    marginAndValue?.margin,
                    pairConfig?.pricePrecision || 2
                )} ${quoteAsset}`}
                containerClassName='text-xs flex flex-wrap justify-between'
            />

        </div>
    );
};

export default OrderMarginMobile;