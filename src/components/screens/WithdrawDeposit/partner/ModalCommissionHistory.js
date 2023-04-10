import React, { useState, useEffect } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { formatAbbreviateNumber, formatNanNumber, formatPercentage, formatSwapRate, formatTime, getAssetCode } from 'redux/actions/utils';
import OrderStatusTag from 'components/common/OrderStatusTag';
import AssetLogo from 'components/wallet/AssetLogo';
import FetchApi from 'utils/fetch-api';
import { API_GET_COMMISSION_HISTORY_PARTNER } from 'redux/actions/apis';
import Skeletor from 'components/common/Skeletor';
import { WalletTypeById } from 'components/screens/TransactionHistory/ModalHistory';

const ModalCommissionHistory = ({ onClose, isVisible, t, transaction, id = '', sideCommission }) => {
    if (!transaction) return null;

    const { money_use, _id, created_at, currency, wallet_type } = transaction;
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    const getDetail = () => {
        setLoading(true);
        FetchApi({
            url: API_GET_COMMISSION_HISTORY_PARTNER + '/' + id
        })
            .then((res, err) => {
                setDetails({ typeCommission: res?.data?.additionalData?.type });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getDetail();
    }, [id]);

    return (
        <ModalV2
            isVisible={isVisible}
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider `}
            wrapClassName="bg-center bg-cover bg-no-repeat bg-tx-history-detail dark:bg-tx-history-detail-dark !font-semibold"
        >
            <div>
                <h1 className="text-2xl">{sideCommission}</h1>
                <div className="flex flex-col items-center justify-center my-6">
                    <AssetLogo assetCode={getAssetCode(currency)} size={80} useNextImg />
                    <div className="mt-6 text-2xl">{formatNanNumber(money_use, +currency === 72 ? 0 : 4) + ' ' + getAssetCode(currency)}</div>
                    <OrderStatusTag status={1} className="m-auto mt-3 !font-normal" />
                </div>
                {/* Card ID */}
                <div className="rounded-xl bg-gray-13 dark:bg-dark-4 p-4">
                    <div className="flex justify-between py-3">
                        <span className="txtSecond-4">ID</span>
                        <span className="text-teal">{_id}</span>
                    </div>
                    <div className="flex justify-between py-3 my-1">
                        <span className="txtSecond-4">{t('common:time')}</span>
                        <span>{formatTime(created_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between py-3 my-1">
                        <span className="txtSecond-4">{t('transaction-history:modal_detail.wallet_type')}</span>
                        <span>{WalletTypeById?.[wallet_type]}</span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="txtSecond-4">{t('reference:referral.commission_type')}</span>
                        {loading ? <Skeletor width={100} /> : <span className="capitalize">{details?.typeCommission}</span>}
                    </div>
                </div>
            </div>
        </ModalV2>
    );
};

export default React.memo(ModalCommissionHistory);
