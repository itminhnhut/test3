import { useTranslation } from 'next-i18next';
import { ArrowForwardIcon, SystemInfoCircleFilled } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useCallback, useEffect, useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { ApiStatus, UserSocketEvent } from 'redux/actions/const';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { useRouter } from 'next/router';
import FetchApi from 'utils/fetch-api';
import toast from 'utils/toast';
import { X } from 'react-feather';
import colors from 'styles/colors';
import CustomOtpInput from 'components/screens/WithdrawDeposit/components/CustomOtpInput';
import MCard from 'components/common/MCard';
import { CountdownClock } from './components/common/CircleCountdown';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { API_CANCEL_AUTO_SUGGEST_ORDER, API_CONTINUE_AUTO_SUGGEST_ORDER } from 'redux/actions/apis';
import { useSelector } from 'react-redux';
import ModalLoading from 'components/common/ModalLoading';
import { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import { formatNumber } from 'utils/reference-utils';

const PartnerModalDetailsOrderSuggest = ({ showProcessSuggestPartner, onBackdropCb }) => {
    console.log('______', showProcessSuggestPartner);
    const handleAcceptOrder = () => {
        console.log('____ok');
    };

    const { side, quoteQty, baseAssetId, userMetadata , transferMetadata} = showProcessSuggestPartner;

    return (
        <ModalV2
            // loading={loading}
            isVisible={showProcessSuggestPartner}
            onBackdropCb={onBackdropCb}
            // isVisible={!!showProcessSuggestPartner}
            // isVisible={true}
            className="!max-w-[488px]"
            // wrapClassName="p-8 flex flex-col items-center txtSecond-4 "
        >
            <div className="flex flex-col items-center w-full">
                <SystemInfoCircleFilled />
                <h1 className="txtPri-3 mt-6 mb-10">Thông tin giao dịch</h1>
            </div>

            <div className="flex flex-col gap-y-3 w-full txtPri-2 !font-semibold">
                <div className="flex justify-between">
                    <span className="txtSecond-4">Loại giao dịch</span>
                    <span className="text-teal">{side}</span>
                </div>
                <div className="flex justify-between">
                    <span className="txtSecond-4">Số lượng</span>
                    <span>{`${formatNumber(quoteQty, baseAssetId === 72 ? 0 : 4)} ${baseAssetId === 72 ? 'VNDC' : 'USDT'}`}</span>
                </div>
                <div className="flex justify-between">
                    <span className="txtSecond-4">Ngân hàng</span>
                    <span className='max-w-[280px] truncate'>{transferMetadata?.bankName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="txtSecond-4">Người dùng</span>
                    <div>
                        <span>{userMetadata.name}</span>
                        <div className="text-right txtSecond-4">{userMetadata.code}</div>
                    </div>
                </div>
            </div>
            <ButtonV2 className="mt-10" onClick={handleAcceptOrder}>
                Nhận lệnh
            </ButtonV2>
        </ModalV2>
    );
};

export default PartnerModalDetailsOrderSuggest;
