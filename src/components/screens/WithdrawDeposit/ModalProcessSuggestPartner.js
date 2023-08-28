import { useTranslation } from 'next-i18next';
import ModalV2 from 'components/common/V2/ModalV2';
import { useEffect, useMemo, useRef, useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { ApiStatus, MIN_TIP, UserSocketEvent } from 'redux/actions/const';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { useRouter } from 'next/router';
import FetchApi from 'utils/fetch-api';
import MCard from 'components/common/MCard';
import { CountdownClock } from './components/common/CircleCountdown';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { API_CANCEL_AUTO_SUGGEST_ORDER, API_CONTINUE_AUTO_SUGGEST_ORDER, API_GET_ORDER_DETAILS, API_GET_ORDER_PRICE } from 'redux/actions/apis';
import { useDispatch, useSelector } from 'react-redux';
import ModalLoading from 'components/common/ModalLoading';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { formatNumber } from 'utils/reference-utils';
import TradingInputV2 from 'components/trade/TradingInputV2';
import useFetchApi from 'hooks/useFetchApi';
import TabV2 from 'components/common/V2/TabV2';
import { formatBalanceFiat, formatNanNumber, getS3Url } from 'redux/actions/utils';
import { setFee } from 'redux/actions/withdrawDeposit';
import CollapseV2 from 'components/common/V2/CollapseV2';
import Tooltip from 'components/common/Tooltip';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from './constants';
import { find } from 'lodash';

const ModalProcessSuggestPartner = ({ showProcessSuggestPartner, onBackdropCb }) => {
    const { fee } = useSelector((state) => state.withdrawDeposit);
    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const [state, setState] = useState({ side: SIDE.BUY, countdownTime: null, timeExpire: null, baseQty: 0, baseAssetId: ALLOWED_ASSET_ID['VNDC'], displayingId: '' });
    const router = useRouter();
    const [currentTheme] = useDarkMode();

    const baseAssetConfig = useMemo(
        () =>
            find(assetConfigs, {
                id: state.baseAssetId
            }),
        [assetConfigs, state.baseAssetId]
    );

    useEffect(() => {
        if (!showProcessSuggestPartner) return;
        const { side, countdownTime, timeExpire, baseQty, baseAssetId, displayingId } = showProcessSuggestPartner;
        setState({ side, countdownTime, timeExpire, baseQty, baseAssetId, displayingId });
    }, [showProcessSuggestPartner]);

    const [isAwaitSocketNotFoundPartner, setIsAwaitSocketNotFoundPartner] = useState(false);
    const isAwaitSocketNotFoundPartnerRef = useRef(isAwaitSocketNotFoundPartner);
    isAwaitSocketNotFoundPartnerRef.current = isAwaitSocketNotFoundPartner;

    const [isNotFoundPartner, setIsNotFoundPartner] = useState(false);
    const [isLoadingContinue, setIsLoadingContinue] = useState(false);
    const [isErrorContinue, setIsErrorContinue] = useState('');

    const { t } = useTranslation();

    const userSocket = useSelector((state) => state.socket.userSocket);

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST, (data) => {
                // make sure the socket displayingId is the current details/[id] page
                if (!data) return;

                // lệnh bị timeout / tất cả partner từ chối:
                if (data?.status === 2 && data?.displayingId === showProcessSuggestPartner?.displayingId) return forceUpdateState();

                // partner chấp nhận:
                if (data?.status === 0 && data?.partnerAcceptStatus === 1) return handlePartnerAccept(data.displayingId);
            });
        }

        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.USER_CREATE_ORDER, (data) => {
                    console.log('socket removeListener USER_CREATE_ORDER:', data);
                });
            }
        };
    }, [userSocket, showProcessSuggestPartner]);

    const handleCancelOrderSuggest = async () => {
        return await FetchApi({
            url: API_CANCEL_AUTO_SUGGEST_ORDER,
            options: {
                method: 'POST'
            },
            params: {
                displayingId: showProcessSuggestPartner?.displayingId
            }
        });

        // onBackdropCb();
    };

    const forceUpdateState = () => {
        setIsAwaitSocketNotFoundPartner(false);
        setIsNotFoundPartner(true);
    };

    const handlePartnerAccept = (orderId) => {
        onBackdropCb();
        router.push(`/withdraw-deposit/partner/details/${orderId}`);
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
                    displayingId: showProcessSuggestPartner?.displayingId,
                    fee: fee
                }
            });

            console.log(t(`dw_partner:alert_suggest_${status.toLowerCase().trim()}`, { displayingId: state?.displayingId }));

            if (status === ApiStatus.SUCCESS && data) {
                const { side, countdownTime, timeExpire, displayingId } = data;
                setIsNotFoundPartner(false);

                setState((prev) => ({ ...prev, side, countdownTime, timeExpire, displayingId }));
            } else {
                setIsErrorContinue(t(`dw_partner:alert_suggest_${status.toLowerCase().trim()}`, { displayingId: state?.displayingId }));
            }
        } catch (error) {
            console.log('________error catch: ', error);
        } finally {
            setIsLoadingContinue(false);
        }
    };

    const handleAwaitSocketOrderTimeout = () => {
        if (isNotFoundPartner) return;
        setIsAwaitSocketNotFoundPartner(true);

        setTimeout(() => {
            if (!isAwaitSocketNotFoundPartnerRef.current) return;
            // nếu 5s mà còn chưa nhận được socket thì phải force get api coi tình trạng Order thế nào.
            FetchApi({
                url: API_GET_ORDER_DETAILS,
                options: { method: 'GET' },
                params: {
                    displayingId: state.displayingId
                }
            })
                .then(({ data, status }) => {
                    if (isNotFoundPartner || isErrorContinue) return;
                    if (status === ApiStatus.SUCCESS) {
                        setIsNotFoundPartner(true);
                    } else {
                        setIsErrorContinue(t(`dw_partner:alert_suggest_${status.toLowerCase().trim()}`, { displayingId: state?.displayingId }));
                    }
                })
                .finally(setIsAwaitSocketNotFoundPartner(false));
        }, 5000);
    };

    // Tip handle:
    const { side, assetId } = router.query;
    const dispatch = useDispatch();
    const {
        data: rate,
        loading: loadingRate,
        error
    } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, Boolean(side) && Boolean(assetId), [side, assetId]);

    const [tipValidator, setTipValidator] = useState({ isValid: true, msg: '', isError: false });

    const validateTip = (tipAmount) => {
        let isValid = true;
        let msg = '';

        if (tipAmount && (tipAmount + '').length > 21) {
            isValid = false;
            msg = t('dw_partner:error.invalid_amount');
        }

        if (!tipAmount || tipAmount < MIN_TIP) {
            isValid = false;
            msg = t('dw_partner:error.min_amount', { amount: formatBalanceFiat(MIN_TIP), asset: 'VND' });
        }

        // const maxTip = state.amount * rate - 50000;
        const maxTip = state.baseQty * rate;
        if (side === 'SELL' && +tipAmount > maxTip) {
            isValid = false;
            msg = t('dw_partner:error.max_amount', { amount: formatBalanceFiat(maxTip), asset: 'VND' });
        }

        setTipValidator({ isValid, msg, isError: !isValid });
    };

    const handleChangeTip = (input = '') => {
        const numberValue = input.value;
        dispatch(setFee(numberValue));
        // setState({ fee: numberValue });
        validateTip(numberValue);
    };

    useEffect(() => {
        validateTip(fee);
    }, [state.baseQty, rate]);

    return (
        <>
            <ModalV2
                isVisible={!!showProcessSuggestPartner}
                closeButton={false}
                className="!max-w-[488px]"
                wrapClassName="p-8 flex flex-col items-center txtSecond-4 "
            >
                <video className="pointer-events-none" width="124" height="124" loop muted autoPlay preload="none" playsInline>
                    <source src={getS3Url(`/images/screen/partner/suggestion_${currentTheme === THEME_MODE.DARK ? 'dark' : 'light'}.mp4`)} type="video/mp4" />
                </video>

                <h1 className="txtPri-3 mt-6 mb-4">{t('dw_partner:looking_for_partner_loading')}</h1>
                <div className="text-center">{t('dw_partner:auto_suggestion_des_more')}</div>
                <div className="p-1 mt-4">
                    <CountdownClock
                        key={state.timeExpire}
                        countdownTime={state.countdownTime}
                        onComplete={handleAwaitSocketOrderTimeout}
                        timeExpire={state.timeExpire}
                    />
                </div>
                <div className={'w-full bg-gray-13 dark:bg-dark-4 rounded-xl mt-6 p-4'}>
                    <div className="flex items-center justify-between">
                        <span>{t('dw_partner:transaction_type')}</span>
                        <span className={`font-semibold ${state.side === SIDE.BUY ? 'text-green-3 dark:text-green-2' : 'text-red-2'}`}>
                            {t(`common:${state.side.toLowerCase()}`)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span>{t('common:amount')}</span>
                        <span className="text-gray-15 dark:text-gray-4 font-semibold">{`${formatNumber(state.baseQty, baseAssetConfig?.assetDigit || 0)} ${
                            ALLOWED_ASSET[+state?.baseAssetId]
                        }`}</span>
                    </div>
                    {state.side === SIDE.SELL && (
                        <div className="flex items-center justify-between mt-3">
                            <span>{t('common:transaction_fee')}</span>
                            <span className="text-gray-15 dark:text-gray-4 font-semibold">{`${formatNumber(fee)} VND`}</span>
                        </div>
                    )}
                </div>
                <ButtonV2
                    onClick={() => {
                        handleCancelOrderSuggest();
                        onBackdropCb();
                    }}
                    className="mt-10 !bg-gray-12 dark:!bg-dark-2"
                    variants="secondary"
                >
                    {t('dw_partner:cancel')}
                </ButtonV2>
            </ModalV2>

            {/* Popup tiếp tục tìm kiếm */}
            <AlertModalV2
                isVisible={isNotFoundPartner}
                // isVisible={!!showProcessSuggestPartner}
                onClose={() => {
                    setIsNotFoundPartner(false);
                    setTimeout(() => {
                        onBackdropCb();
                    }, 200);
                }}
                type="warning"
                title={t('dw_partner:keep_looking_for_partners')}
                message={t('dw_partner:keep_looking_for_partner_des')}
                isButton={true}
                customButton={
                    <ButtonV2 disabled={state.side === SIDE.SELL && !tipValidator?.isValid} loading={isLoadingContinue} onClick={handleContinueFindPartner}>
                        {t('common:continue')}
                    </ButtonV2>
                }
            >
                {state.side === SIDE.SELL && (
                    <div className="w-full mt-6">
                        <Tooltip place={'right'} className={`max-w-[360px] !w-auto !px-6 !py-3 !mr-4`} effect="solid" isV3 id="partner_bonus_tooltip" />
                        <TradingInputV2
                            id="TradingInputV2"
                            label={
                                <h1
                                    data-tip={t('dw_partner:partner_bonus_tooltip')}
                                    data-for="partner_bonus_tooltip"
                                    className="txtSecond-3 border-b border-dashed border-darkBlue-5 w-fit"
                                >
                                    {t('dw_partner:partner_bonus')}
                                </h1>
                            }
                            value={fee}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                            inputClassName="!text-left !ml-0"
                            onValueChange={handleChangeTip}
                            validator={tipValidator}
                            errorTooltip={false}
                            decimalScale={0}
                            allowedDecimalSeparators={[',', '.']}
                            clearAble
                            placeHolder={loadingRate ? '...' : t('dw_partner:enter_amount')}
                            errorEmpty
                            renderTail={<span className="txtSecond-4">VND</span>}
                        />
                        <div className="txtSecond-5 !text-xs mb-4 mt-2">{t('common:min')}: 2,000 VND</div>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <TabV2
                                //  chipClassName="!bg-white hover:!bg-gray-6"
                                variants="suggestion"
                                isOverflow={true}
                                activeTabKey={+fee}
                                onChangeTab={(key) => handleChangeTip({ value: key })}
                                tabs={[MIN_TIP, 5000, 10000, 20000].map((suggestItem) => ({
                                    key: suggestItem,
                                    children: formatNanNumber(suggestItem, 0)
                                }))}
                            />
                        </div>
                        <CollapseV2
                            key={`collapse_${state.displayingId}`}
                            // divLabelClassname="w-full justify-between"
                            chrevronStyled={{ size: 20 }}
                            label={t('dw_partner:transaction_info')}
                            labelClassname="!text-base font-semibold"
                            // setIsOpen={setIsCollapse}
                        >
                            <div className="txtSecond-4">
                                <div className="flex items-center justify-between">
                                    <span>{t('dw_partner:transaction_type')}</span>
                                    <span className={`font-semibold ${state.side === SIDE.BUY ? 'text-teal' : 'text-red-2'}`}>
                                        {t(`common:${state.side.toLowerCase()}`)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span>{t('common:amount')}</span>
                                    <span className="text-gray-15 dark:text-gray-4 font-semibold">{`${formatNumber(
                                        state.baseQty,
                                        baseAssetConfig?.assetDigit || 0
                                    )} ${ALLOWED_ASSET[+state?.baseAssetId]}}`}</span>
                                </div>
                                {state.side && (
                                    <div className="flex items-center justify-between mt-3">
                                        <span>{t('common:transaction_fee')}</span>
                                        <span className="text-gray-15 dark:text-gray-4 font-semibold">{`${formatNumber(fee)} VND`}</span>
                                    </div>
                                )}
                            </div>
                        </CollapseV2>
                    </div>
                )}
            </AlertModalV2>

            {/* Popup lỗi */}
            <AlertModalV2
                isVisible={isErrorContinue}
                // isVisible={true}
                onClose={() => {
                    setIsErrorContinue('');
                    setTimeout(() => {
                        setIsNotFoundPartner(false);
                        onBackdropCb();
                    }, 200);
                }}
                type="error"
                title={t('common:failure')}
                message={isErrorContinue}
            />

            {isAwaitSocketNotFoundPartner && (
                <ModalLoading
                    animateModal={false}
                    isVisible={isAwaitSocketNotFoundPartner}
                    // onBackdropCb={() => setIsAwaitSocketNotFoundPartner(false)}
                />
            )}
        </>
    );
};

export default ModalProcessSuggestPartner;
