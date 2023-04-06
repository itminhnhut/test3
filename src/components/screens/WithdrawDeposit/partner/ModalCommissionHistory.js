import React, { useEffect, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import TagV2 from 'components/common/V2/TagV2';
import { formatPrice, formatWallet, formatTime, getSymbolObject, shortHashAddress, getAssetCode } from 'redux/actions/utils';
import { X } from 'react-feather';
import { API_GET_WALLET_TRANSACTION_HISTORY } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { get, isNumber, isString } from 'lodash';
import classNames from 'classnames';
import { WalletType, EarnWalletType } from 'redux/actions/const';
import OrderStatusTag from 'components/common/OrderStatusTag';
import AssetLogo from 'components/wallet/AssetLogo';

const ModalCommissionHistory = ({ onClose, isVisible, t, transaction, typeCommission }) => {
    if (!transaction) return null;

    const { money_use, _id, created_at, currency } = transaction;

    return (
        <ModalV2
            // isVisible={true}
            isVisible={isVisible}
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider `}
            wrapClassName="bg-center bg-cover bg-no-repeat bg-tx-history-detail dark:bg-tx-history-detail-dark !font-semibold"
        >
            <div>
                <h1 className="text-2xl">Hoa hồng nạp</h1>
                <div className="flex flex-col items-center justify-center my-6">
                    <AssetLogo assetCode={'VNDC'} size={80} useNextImg />
                    <div className="mt-6 text-2xl">+{formatPrice(money_use) + ' ' + getAssetCode(currency)}</div>
                    <OrderStatusTag status={1} className="m-auto mt-3" />
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
                    <div className="flex justify-between py-3">
                        <span className="txtSecond-4">{t('reference:referral.commission_type')}</span>
                        <span>{typeCommission}</span>
                    </div>
                </div>
            </div>
        </ModalV2>
    );
};

export default React.memo(ModalCommissionHistory);
