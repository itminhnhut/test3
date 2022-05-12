import React, { memo, useMemo } from 'react';
import TradingLabel from 'components/trade/TradingLabel';
import { useTranslation } from 'next-i18next';
import { formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux'
import { getS3Url } from 'redux/actions/utils';

const OrderMarginMobile = ({ marginAndValue, pairConfig, availableAsset }) => {
    const { t } = useTranslation();


    const formatCash = n => {
        if (n < 1e3) return formatNumber(n, 0, 0, true);
        if (n >= 1e6 && n < 1e9) return formatNumber(+(n / 1e6).toFixed(4), 4, 0, true) + "M";
        if (n >= 1e9 && n < 1e12) return formatNumber(+(n / 1e9).toFixed(4), 4, 0, true) + "B";
        if (n >= 1e12) return formatNumber(+(n / 1e12).toFixed(4), 4, 0, true) + "T";
    };

    return (
        <div className="flex flex-col h-full justify-around">
            <div className="flex items-center justify-between">
                <TradingLabel
                    label={t('futures:avlb')}
                    value={`${formatNumber(
                        availableAsset,
                        0
                    )} ${pairConfig?.quoteAsset}`}
                    containerClassName='text-xs flex flex-wrap justify-between w-full mr-[10px]'
                />
                <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' />
            </div>
            <TradingLabel
                label={t('futures:margin')}
                value={`${marginAndValue?.marginLength > 7 ? formatCash(marginAndValue?.margin) : formatNumber(
                    marginAndValue?.margin,
                    pairConfig?.pricePrecision || 2
                )} ${pairConfig?.quoteAsset}`}
                containerClassName='text-xs flex flex-wrap justify-between'
            />

        </div>
    );
};

export default OrderMarginMobile;