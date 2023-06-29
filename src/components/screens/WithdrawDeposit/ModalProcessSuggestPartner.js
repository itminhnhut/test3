import { useTranslation } from 'next-i18next';
import { ArrowForwardIcon } from 'components/svg/SvgIcon';
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

const ModalProcessSuggestPartner = ({ showProcessSuggestPartner, onBackdropCb }) => {
    const [state, setState] = useState({ side: SIDE.BUY, countdownTime: null, timeExpire: null });
    const router = useRouter();

    useEffect(() => {
        if (!showProcessSuggestPartner) return;
        const { side, countdownTime, timeExpire } = showProcessSuggestPartner;
        setState({ side, countdownTime, timeExpire });
    }, [showProcessSuggestPartner]);

    const [isAwaitSocketNotFoundPartner, setIsAwaitSocketNotFoundPartner] = useState(false);
    const [isNotFoundPartner, setIsNotFoundPartner] = useState(false);
    const [isLoadingContinue, setIsLoadingContinue] = useState(false);
    const [isErrorContinue, setIsErrorContinue] = useState('');
    const [isAccepted, setIsAccepted] = useState(false);

    const { t } = useTranslation();

    const userSocket = useSelector((state) => state.socket.userSocket);

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST, (data) => {
                // make sure the socket displayingId is the current details/[id] page
                if (!data) return;
                console.log('_______data socket: ', data);

                // lệnh bị timeout / tất cả partner từ chối:
                if (data?.status === 2 && data?.displayingId) return forceUpdateState();

                // partner chấp nhận:
                if (data?.status === 0 && data?.partnerAcceptStatus === 1) return handlePartnerAccept();
            });
        }

        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.USER_CREATE_ORDER, (data) => {
                    console.log('socket removeListener USER_CREATE_ORDER:', data);
                });
            }
        };
    }, [userSocket]);

    const handleCancelOrderSuggest = async () => {
        const { status, data, code } = await FetchApi({
            url: API_CANCEL_AUTO_SUGGEST_ORDER,
            options: {
                method: 'POST'
            },
            params: {
                displayingId: showProcessSuggestPartner?.displayingId
            }
        });

        onBackdropCb();
    };

    const forceUpdateState = () => {
        setIsAwaitSocketNotFoundPartner(false);
        setIsNotFoundPartner(true);
    };

    const handlePartnerAccept = () => {
        setIsAccepted(true);
        setTimeout(() => {
            router.push(`withdraw-deposit/partner/details/${showProcessSuggestPartner.displayingId}`)
        }, 500);
    };

    const handleContinueFindPartner = async () => {
        setIsLoadingContinue(true);
        try {
            const { status, data } = await FetchApi({
                url: API_CONTINUE_AUTO_SUGGEST_ORDER,
                options: {
                    method: 'POST'
                },
                params: {
                    displayingId: showProcessSuggestPartner?.displayingId
                }
            });

            if (status === ApiStatus.SUCCESS && data) {
                const { side, countdownTime, timeExpire } = data;
                setIsNotFoundPartner(false);

                setState({ side, countdownTime, timeExpire });
            } else {
                setIsErrorContinue(status ?? data);
            }
        } catch (error) {
        } finally {
            setIsLoadingContinue(false);
        }
    };

    return (
        <>
            <ModalV2
                isVisible={!!showProcessSuggestPartner}
                // isVisible={true}
                // onBackdropCb={onBackdropCb}
                closeButton={false}
                className="!max-w-[488px]"
                wrapClassName="p-8 flex flex-col items-center txtSecond-4 "
            >
                <div className="w-[124px] h-[124px] bg-dominant"></div>
                <h1 classNamwe="txtPri-3 mt-6 mb-4">{isAccepted ? 'Đã tìm được đối tác cho bạn ' : 'Đang tìm đối tác cho bạn...'}</h1>
                <div className="text-center">Nami Exchange sẽ tìm ra đối tác phù hợp với giao dịch của bạn nhất</div>
                <div className="p-1 mt-4">
                    <CountdownClock
                        key={state.timeExpire}
                        countdownTime={state.countdownTime}
                        onComplete={() => setIsAwaitSocketNotFoundPartner(true)}
                        timeExpire={state.timeExpire}
                    />
                </div>
                <MCard addClass={'w-full mt-6 !p-4'}>
                    <div className="flex items-center justify-between">
                        <span>Loại giao dịch</span>
                        <span className="text-teal font-semibold">{t(`common:${state.side.toLowerCase()}`)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span>Số lượng</span>
                        <span className="text-gray-15 dark:text-gray-4 font-semibold">20,000,000 VNDC</span>
                    </div>
                </MCard>
                <ButtonV2 onClick={handleCancelOrderSuggest} className="mt-10" variants="secondary">
                    Huỷ lệnh
                </ButtonV2>
            </ModalV2>

            <AlertModalV2
                isVisible={isNotFoundPartner}
                // isVisible={true}
                onClose={() => {
                    setIsNotFoundPartner(false);
                    setTimeout(() => {
                        onBackdropCb();
                    }, 200);
                }}
                type="warning"
                title="Tiếp tục tìm kiếm đối tác"
                message="Hệ thống hiện tại chưa tìm được đối tác phù hợp với giao dịch của bạn."
                isButton={true}
                customButton={
                    <ButtonV2 loading={isLoadingContinue} onClick={handleContinueFindPartner}>
                        Tiếp tục
                    </ButtonV2>
                }
            />

            <AlertModalV2
                isVisible={isErrorContinue}
                // isVisible={true}
                onClose={() => {
                    setIsErrorContinue('');
                    setTimeout(() => {
                        onBackdropCb();
                    }, 200);
                }}
                type="error"
                title={isErrorContinue}
                message="Hệ thống hiện tại không thể tìm được đối tác phù hợp với bạn. Vui lòng thử lại sau ít phút."
            />

            <ModalLoading isVisible={isAwaitSocketNotFoundPartner} onBackdropCb={() => setIsAwaitSocketNotFoundPartner(false)} />
        </>
    );
};

export default ModalProcessSuggestPartner;
