import React, { useEffect, useMemo, useState } from 'react';
import TradingInputV2 from 'components/trade/TradingInputV2';
import dynamic from 'next/dynamic';
import Card from './components/common/Card';
import { useSelector } from 'react-redux';
import { SyncAltIcon } from 'components/svg/SvgIcon';
import { getAssetCode, formatBalanceFiat, getExactBalanceFiat } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Skeletor from 'components/common/Skeletor';
import { useRouter } from 'next/router';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_ORDER_PRICE, API_CHECK_LIMIT_WITHDRAW } from 'redux/actions/apis';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import useMakeOrder from './hooks/useMakeOrder';
import useGetPartner from './hooks/useGetPartner';

const ModalOtp = dynamic(() => import('./components/ModalOtp'));
const RecommendAmount = dynamic(() => import('./components/RecommendAmount'));

const CardInput = () => {
    const { t } = useTranslation();
    const { input, partner, partnerBank, accountBank, loadingPartner, maximumAllowed, minimumAllowed } = useSelector((state) => state.withdrawDeposit);
    const wallets = useSelector((state) => state.wallet.SPOT);

    const router = useRouter();

    const [state, set] = useState({
        amount: '',
        loadingConfirm: false,
        showOtp: false,
        otpExpireTime: null
    });
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));
    const { side, assetId } = router.query;
    const assetCode = getAssetCode(+assetId);
    const orderConfig = partner?.orderConfig?.[side.toLowerCase()];
    // Setting DEFAULT amount
    useEffect(() => {
        if (minimumAllowed) {
            setState({ amount: minimumAllowed });
        }
    }, [minimumAllowed]);

    const { data: limitWithdraw, loading: loadingLimitWithdraw } = useFetchApi(
        { url: API_CHECK_LIMIT_WITHDRAW, params: { side: side, assetId: assetId } },
        Boolean(side) && Boolean(assetId),
        [side, assetId]
    );

    const {
        data: rate,
        loading: loadingRate,
        error
    } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, Boolean(side) && Boolean(assetId), [side, assetId]);

    useGetPartner({ assetId, side, amount: state.amount, rate });
    const { onMakeOrderHandler } = useMakeOrder({ setState, input });

    const availableAsset = useMemo(
        () => getExactBalanceFiat(wallets?.[+assetId]?.value - wallets?.[+assetId]?.locked_value, assetCode),

        [wallets, assetId, assetCode]
    );

    const onMaxHandler = () => {
        let max = maximumAllowed;
        if (availableAsset < max) {
            max = availableAsset;
        }
        setState({ amount: formatBalanceFiat(max, assetCode) });
    };

    const [hasRendered, setHasRendered] = useState(false);
    const validator = useMemo(() => {
        if (!hasRendered) {
            return { isValid: true, msg: '', isError: false };
        }

        if (!state.amount)
            return {
                isValid: false,
                msg: t('dw_partner:error.miss_input'),
                isError: true
            };

        let isValid = true,
            msg = null;
        if (maximumAllowed === 0 || minimumAllowed === 0) {
        } else {
            if (+state.amount > availableAsset && side === SIDE.SELL) {
                isValid = false;
                msg = t('wallet:errors.invalid_insufficient_balance');
            } else if (+state.amount > maximumAllowed) {
                isValid = false;
                msg = t('dw_partner:error.max_amount', {
                    amount: formatBalanceFiat(maximumAllowed, assetCode),
                    asset: assetCode
                });
            } else if (+state.amount < minimumAllowed) {
                isValid = false;
                msg = t('dw_partner:error.min_amount', {
                    amount: formatBalanceFiat(minimumAllowed, assetCode),
                    asset: assetCode
                });
            } else if (side === 'SELL' && +state.amount > limitWithdraw?.remain) {
                isValid = false;
                msg = t('dw_partner:error.reach_limit_withdraw', {
                    asset: assetCode
                });
            }
        }

        return { isValid, msg, isError: !isValid };
    }, [orderConfig, state.amount, availableAsset, minimumAllowed, maximumAllowed, assetCode, hasRendered, limitWithdraw]);

    const handleFocusInput = () => {
        if (!hasRendered) {
            setHasRendered(true);
        }
    };

    return (
        <>
            <Card className="w-full">
                <div className="mb-4">
                    <div className="w-full mb-2 flex justify-between ">
                        <label htmlFor="TradingInput" className="txtSecond-3 ">
                            {t('common:amount')}
                        </label>
                        {side === SIDE.SELL && (
                            <div className="flex space-x-1 text-sm font-semibold items-center">
                                <div className="txtSecond-3">{t('common:available_balance')}:</div>
                                <button
                                    disabled={+state.amount === maximumAllowed || +state.amount === availableAsset || loadingRate}
                                    className="font-semibold"
                                    onClick={onMaxHandler}
                                >
                                    {formatBalanceFiat(availableAsset, assetCode)} {assetCode}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap -m-1">
                        <div className="flex-1 p-1">
                            <TradingInputV2
                                id="TradingInputV2"
                                value={loadingRate ? '' : state.amount}
                                allowNegative={false}
                                thousandSeparator={true}
                                containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                                inputClassName="!text-left !ml-0"
                                onValueChange={({ value }) => setState({ amount: value })}
                                validator={validator}
                                errorTooltip={false}
                                decimalScale={assetCode === 'VNDC' ? 0 : 4}
                                allowedDecimalSeparators={[',', '.']}
                                clearAble
                                placeHolder={loadingRate ? '...' : t('dw_partner:enter_amount')}
                                errorEmpty
                                onFocus={handleFocusInput}
                                renderTail={
                                    side === SIDE.SELL && (
                                        <ButtonV2
                                            variants="text"
                                            disabled={+state.amount === maximumAllowed || +state.amount === availableAsset || loadingRate}
                                            onClick={onMaxHandler}
                                            className="uppercase font-semibold text-teal !h-10 "
                                        >
                                            MAX
                                        </ButtonV2>
                                    )
                                }
                            />
                        </div>
                        <div className="w-24 p-1">
                            <ButtonV2
                                className="!text-dominant w-full bg-gray-12 dark:bg-dark-2 hover:opacity-80"
                                variants="text"
                                onClick={() => {
                                    router.push(
                                        {
                                            pathname: PATHS.WITHDRAW_DEPOSIT.DEFAULT,
                                            query: { side, assetId: +assetId === 72 ? 22 : 72 }
                                        },
                                        undefined,
                                        { shallow: true }
                                    );
                                }}
                            >
                                <span className="uppercase">{assetCode}</span>
                                <SyncAltIcon className=" rotate-90" size={16} />
                            </ButtonV2>
                        </div>
                    </div>
                </div>
                {/* <div>
                    <RecommendAmount setAmount={(value) => setState({ amount: value })} assetCode={assetCode} amount={state.amount} loadingRate={loadingRate} />
                </div> */}
                <div className="space-y-2 mb-10">
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">{t('dw_partner:rate')}</div>
                        <div className="txtPri-1 flex items-center space-x-1">
                            <span>1 {assetCode} =</span>
                            <span>{loadingRate ? <Skeletor width="40px" height="15px" /> : formatBalanceFiat(rate, 'VNDC')}</span>
                            <span>VND</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">{t('dw_partner:min_amount')}</div>
                        <div className="txtPri-1 flex items-center">
                            {loadingRate ? <Skeletor width="50px" /> : formatBalanceFiat(minimumAllowed, assetCode)}

                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>

                    {side === 'SELL' && (
                        <>
                            <div className="flex items-center justify-between ">
                                <div className="txtSecond-2">{t('dw_partner:daily_limit')}</div>
                                <div className="txtPri-1 flex items-center">
                                    {loadingLimitWithdraw ? (
                                        <Skeletor width="50px" />
                                    ) : !limitWithdraw ? (
                                        '--'
                                    ) : (
                                        formatBalanceFiat(limitWithdraw?.limit, assetCode)
                                    )}
                                    <span className="ml-1">{assetCode}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between ">
                                <div className="txtSecond-2">{t('dw_partner:rest_daily_limit')}</div>
                                <div className="txtPri-1 flex items-center">
                                    {loadingLimitWithdraw ? (
                                        <Skeletor width="50px" />
                                    ) : !limitWithdraw ? (
                                        '--'
                                    ) : (
                                        formatBalanceFiat(limitWithdraw?.remain, assetCode)
                                    )}{' '}
                                    <span className="ml-1">{assetCode}</span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">{t('dw_partner:max_amount')}</div>
                        <div className="txtPri-1 flex items-center">
                            {loadingRate ? <Skeletor width="50px" /> : formatBalanceFiat(maximumAllowed, assetCode)}

                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">{t(`dw_partner:${side === SIDE.BUY ? 'will_transfer' : 'will_received'}`)}</div>

                        {/* <Tooltip place="top" effect="solid" isV3 id="will-transfer-receive">
                            <div className="max-w-[300px] ">{formatBalanceFiat(input * rate, 'VNDC')}</div>
                        </Tooltip> */}

                        <div data-tip="" className="inline-flex txtPri-1 space-x-1 !cursor-default">
                            {loadingRate ? (
                                <Skeletor width="70px" />
                            ) : (
                                <div className=" max-w-[150px] truncate">{formatBalanceFiat(state.amount * rate, 'VNDC')}</div>
                            )}

                            <div className="">VND</div>
                        </div>
                    </div>
                </div>
                <ButtonV2
                    loading={state.loadingConfirm || loadingPartner}
                    onClick={() => onMakeOrderHandler()}
                    disabled={
                        !partner ||
                        loadingPartner ||
                        !validator?.isValid ||
                        (!partnerBank && side === SIDE.BUY) ||
                        (side === SIDE.SELL && +state.amount > availableAsset)
                    }
                    className="disabled:cursor-default"
                >
                    {t(`common:${side.toLowerCase()}`) + ` ${assetCode}`}
                </ButtonV2>
            </Card>

            <ModalOtp
                onConfirm={(otp) => onMakeOrderHandler(otp)}
                isVisible={state.showOtp}
                otpExpireTime={state.otpExpireTime}
                onClose={() => {
                    setState({ showOtp: false });
                }}
                loading={state.loadingConfirm}
            />
        </>
    );
};

export default CardInput;
