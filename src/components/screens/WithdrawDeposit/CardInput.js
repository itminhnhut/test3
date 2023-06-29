import React, { useEffect, useMemo, useState } from 'react';
import TradingInputV2 from 'components/trade/TradingInputV2';
import Card from './components/common/Card';
import { useDispatch, useSelector } from 'react-redux';
import { SyncAltIcon } from 'components/svg/SvgIcon';
import { formatBalanceFiat, getExactBalanceFiat, formatNanNumber } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Skeletor from 'components/common/Skeletor';
import { useRouter } from 'next/router';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_ORDER_PRICE, API_CHECK_LIMIT_WITHDRAW } from 'redux/actions/apis';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import useGetPartner from './hooks/useGetPartner';
import { ALLOWED_ASSET_ID } from './constants';
import Tooltip from 'components/common/Tooltip';
import { find } from 'lodash';
import RecommendAmount from './components/RecommendAmount';
import TabV2 from 'components/common/V2/TabV2';
import { SET_ALLOWED_SUBMIT_ORDER } from 'redux/actions/types';

const CardInput = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { partner, accountBank, maximumAllowed, minimumAllowed } = useSelector((state) => state.withdrawDeposit);
    const wallets = useSelector((state) => state.wallet.SPOT);

    // const [isOpenModalAddPhone, setIsOpenModalAddPhone] = useState(false);
    const router = useRouter();
    const { side, assetId } = router.query;

    const [state, set] = useState({
        amount: '',
        tip: ''
    });
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const configs = useSelector((state) => state.utils.assetConfig);
    const assetConfig = useMemo(() => {
        return find(configs, { id: +assetId });
    }, [configs, assetId]);
    // const { assetCode = '' } = assetConfig;
    const assetCode = assetConfig?.assetCode || '';

    const orderConfig = partner?.orderConfig?.[side.toLowerCase()];
    // Setting DEFAULT amount
    useEffect(() => {
        if (minimumAllowed) {
            setState({ amount: minimumAllowed });
        }
    }, [minimumAllowed]);

    const { data: limitWithdraw, loading: loadingLimitWithdraw } = useFetchApi(
        { url: API_CHECK_LIMIT_WITHDRAW, params: { side: side, assetId: ALLOWED_ASSET_ID['VNDC'] } },
        Boolean(side),
        [side]
    );

    const {
        data: rate,
        loading: loadingRate,
        error
    } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, Boolean(side) && Boolean(assetId), [side, assetId]);

    useGetPartner({ assetId, side, amount: state.amount, rate, assetConfig });

    const availableAsset = useMemo(
        () => getExactBalanceFiat(wallets?.[+assetId]?.value - wallets?.[+assetId]?.locked_value, assetCode),

        [wallets, assetId, assetCode]
    );

    const onMaxHandler = () => {
        let max = maximumAllowed;
        if (rate && max > limitWithdraw?.remain / rate) {
            max = limitWithdraw?.remain / rate;
        }
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
            } else if (side === SIDE.SELL && +state.amount > limitWithdraw?.remain / rate) {
                isValid = false;
                msg = t('dw_partner:error.reach_limit_withdraw', {
                    asset: assetCode
                });
            }
        }

        return { isValid, msg, isError: !isValid };
    }, [orderConfig, state.amount, availableAsset, minimumAllowed, maximumAllowed, assetCode, hasRendered, limitWithdraw, rate]);

    const handleFocusInput = () => {
        if (!hasRendered) {
            setHasRendered(true);
        }
    };

    const [tipValidator, setTipValidator] = useState({ isValid: true, msg: '', isError: false });

    const validateTip = (tipAmount) => {
        let isValid = true;
        let msg = '';

        if (tipAmount && (tipAmount + '').length > 21) {
            isValid = false;
            msg = t('dw_partner:error.invalid_amount');
        }

        if (tipAmount && tipAmount < 5000) {
            isValid = false;
            msg = t('dw_partner:error.min_amount', { amount: formatBalanceFiat(5000), asset: 'VND' });
        }

        // const maxTip = state.amount * rate - 50000;
        const maxTip = state.amount * rate;
        if (side === 'SELL' && +tipAmount > maxTip) {
            isValid = false;
            msg = t('dw_partner:error.max_amount', { amount: formatBalanceFiat(maxTip), asset: 'VND' });
        }

        setTipValidator({ isValid, msg, isError: !isValid });
    };

    const handleChangeTip = (input = '') => {
        const numberValue = input.value;
        setState({ tip: numberValue });
        validateTip(numberValue);
    };

    useEffect(() => {
        validateTip(state.tip);
    }, [state.amount, rate]);

    const amountWillReceived = state.amount * rate; //+ (side === SIDE.BUY ? +state.tip : -state.tip);

    useEffect(() => {
        let isCanSubmitOrder = true;

        isCanSubmitOrder =
            tipValidator.isError ||
            // !partner ||
            // loadingPartner ||
            validator?.isError ||
            // (!partnerBank && side === SIDE.BUY) ||
            (side === SIDE.SELL && (+state.amount > availableAsset || +state.amount > limitWithdraw?.remain / rate || !accountBank));

        dispatch({
            type: SET_ALLOWED_SUBMIT_ORDER,
            payload: isCanSubmitOrder
        });
    }, [tipValidator, validator, side, state.amount, availableAsset, limitWithdraw, rate, accountBank]);

    return (
        <>
            <Tooltip place="top" className={`max-w-[360px] !px-6 !py-3`} effect="solid" isV3 id="min_amount_description">
                <div className="max-w-[300px] text-sm z-50">{t('dw_partner:min_amount_description')}</div>
            </Tooltip>
            <Tooltip place="top" className={`max-w-[360px] !px-6 !py-3`} effect="solid" isV3 id="max_amount_description">
                <div className="max-w-[300px] text-sm z-50">{t('dw_partner:max_amount_description')}</div>
            </Tooltip>
            <Tooltip
                overridePosition={(e) => {
                    if (e?.left < 0)
                        return {
                            left: e.left < 16 ? 16 : e.left,
                            top: e.top
                        };
                    return e;
                }}
                place={'top'}
                className={`max-w-[360px] !px-6 !py-3 mr-4 `}
                effect="solid"
                isV3
                id="partner_bonus_tooltip"
            />
            {/* <div className="max-w-[300px] py-2 text-sm z-50">{t('dw_partner:partner_bonus_tooltip')}</div>
            </Tooltip> */}

            <Card className="w-full">
                <div className="mb-4">
                    <div className="w-full mb-2 flex justify-between ">
                        <label htmlFor="TradingInputV2" className="txtSecond-3 ">
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
                    <div className="flex -m-1">
                        <div className="w-3/4 xsm:flex-1 p-1">
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
                                            pathname: PATHS.WITHDRAW_DEPOSIT.PARTNER,
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
                <RecommendAmount amount={state.amount} setAmount={(value) => setState({ amount: value })} loadingRate={loadingRate} />

                {side === SIDE.SELL && (
                    <>
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
                            value={state.tip}
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
                            errorEmpty={false}
                            // onFocus={handleFocusInput}
                            renderTail={<span className="txtSecond-4">VND</span>}
                        />
                        <div className="txtSecond-5 !text-xs mb-4 mt-2">{t('common:min')}: 5,000 VND</div>
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <TabV2
                                //  chipClassName="!bg-white hover:!bg-gray-6"
                                variants="suggestion"
                                isOverflow={true}
                                activeTabKey={+state.tip}
                                onChangeTab={(key) => handleChangeTip({ value: key })}
                                tabs={[5000, 10000, 20000].map((suggestItem) => ({
                                    key: suggestItem,
                                    children: formatNanNumber(suggestItem, 0)
                                }))}
                            />
                        </div>
                    </>
                )}

                <div className="space-y-2">
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">{t('dw_partner:rate')}</div>
                        <div className="txtPri-1 flex items-center space-x-1">
                            <span>1 {assetCode} ≈</span>
                            <span>{loadingRate ? <Skeletor width="40px" height="15px" /> : formatBalanceFiat(rate, 'VNDC')}</span>
                            <span>VND</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div data-tip="" className="inline-flex !cursor-default" data-for="min_amount_description">
                            <div className="txtSecond-2 nami-underline-dotted">{t('dw_partner:min_amount')}</div>
                        </div>
                        <div className="txtPri-1 flex items-center">
                            {loadingRate ? <Skeletor width="50px" /> : formatBalanceFiat(minimumAllowed, assetCode)}

                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div data-tip="" className="inline-flex !cursor-default" data-for="max_amount_description">
                            <div className="txtSecond-2 nami-underline-dotted">{t('dw_partner:max_amount')}</div>
                        </div>
                        <div className="txtPri-1 flex items-center">
                            {loadingRate ? <Skeletor width="50px" /> : formatBalanceFiat(maximumAllowed, assetCode)}

                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>

                    {side === 'SELL' && (
                        <>
                            <div className="flex items-center justify-between ">
                                <div className="txtSecond-2">{t('dw_partner:daily_limit')}</div>
                                <div className="txtPri-1 flex items-center">
                                    {loadingLimitWithdraw ? <Skeletor width="50px" /> : !limitWithdraw ? '--' : formatBalanceFiat(limitWithdraw?.limit, 'VNDC')}
                                    <span className="ml-1">{'VNDC'}</span>
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
                                        formatBalanceFiat(limitWithdraw?.remain, 'VNDC')
                                    )}{' '}
                                    <span className="ml-1">{'VNDC'}</span>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between ">
                        {/* <div className="txtSecond-2">{t(`dw_partner:${side === SIDE.BUY ? 'will_transfer' : 'will_received'}`)}</div> */}
                        <div className="txtSecond-2">{t(`dw_partner:vnd_amount`)}</div>

                        {/* <Tooltip place="top" effect="solid" isV3 id="will-transfer-receive">
                            <div className="max-w-[300px] ">{formatBalanceFiat(input * rate, 'VNDC')}</div>
                        </Tooltip> */}

                        <div data-tip="" className="inline-flex txtPri-1 space-x-1 !cursor-default">
                            {loadingRate ? (
                                <Skeletor width="70px" />
                            ) : (
                                <div className=" max-w-[150px] truncate">{formatNanNumber(amountWillReceived < 0 ? 0 : amountWillReceived, 'VNDC')}</div>
                            )}

                            <div className="">VND</div>
                        </div>
                    </div>
                    {state.tip && (
                        <div className="flex items-center justify-between ">
                            <div className="txtSecond-2">{t(`dw_partner:partner_bonus`)}</div>
                            <div data-tip="" className="inline-flex txtPri-1 space-x-1 !cursor-default">
                                {formatNanNumber(state.tip)} VND
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

export default CardInput;
