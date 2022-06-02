import React, { memo, useMemo } from 'react';
import TradingLabel from 'components/trade/TradingLabel';
import { useTranslation } from 'next-i18next';
import { formatNumber, formatCurrency } from 'redux/actions/utils';
import { useSelector, useDispatch } from 'react-redux'
import { getS3Url, setTransferModal } from 'redux/actions/utils';

const OrderMarginMobile = ({ marginAndValue, pairConfig, availableAsset }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const quoteAsset = pairConfig?.quoteAsset ?? '';

    const openTransferModal = () => {
        dispatch(setTransferModal({ isVisible: true, asset: quoteAsset }))
    }

    const Available = () => {
        return (
            <div className="flex items-center flex-wrap">
                {formatNumber(availableAsset * 100000000 ?? 0, 0)}&nbsp;
                {/*<img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' onClick={openTransferModal} />*/}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full justify-around">
            <div className="flex justify-between text-xs font-medium ">
                <div className="mr-1 text-txtSecondary dark:text-txtSecondary-dark min-w-[50px]">{t('futures:mobile:available')}</div>
                <div className="flex items-end justify-end text-right" style={{ wordBreak: 'break-word' }}>
                    {formatNumber(availableAsset ?? 0, 0)}
                    {/*<img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} className='min-w-[16px]' onClick={openTransferModal} />*/}
                </div>
            </div>
            <div className="flex justify-between text-xs font-medium ">
                <div className="mr-1 text-txtSecondary dark:text-txtSecondary-dark min-w-[50px]">{t('futures:margin')}</div>
                <div className="flex items-center flex-wrap justify-end	text-right" style={{ wordBreak: 'break-word' }}>
                    {`${marginAndValue?.marginLength > 7 ? formatCurrency(marginAndValue?.margin) : formatNumber(
                        marginAndValue?.margin,
                        pairConfig?.pricePrecision || 2
                    )}`}
                </div>
            </div>
        </div>
    );
};

export default OrderMarginMobile;
