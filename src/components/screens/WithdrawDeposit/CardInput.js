import React, { useEffect, useMemo, useState } from 'react';
import TradingInput from 'components/trade/TradingInput';
import Card from './components/common/Card';
import { useDispatch, useSelector } from 'react-redux';
import { setInput, setLoadingPartner } from 'redux/actions/withdrawDeposit';
import { SyncAltIcon } from 'components/svg/SvgIcon';
import { formatPrice, formatBalance, getAssetCode } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Skeletor from 'components/common/Skeletor';
import { useRouter } from 'next/router';
import RecommendAmount from './components/RecommendAmount';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_ORDER_PRICE } from 'redux/actions/apis';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { PATHS } from 'constants/paths';
import { useDebounce } from 'react-use';
import Tooltip from 'components/common/Tooltip';
import { useTranslation } from 'next-i18next';
import ModalOtp from './components/ModalOtp';
import useMakeOrder from './hooks/useMakeOrder';

const CardInput = () => {
    const { t } = useTranslation();
    const { input, partner, partnerBank, accountBank, loadingPartner } = useSelector((state) => state.withdrawDeposit);
    const wallets = useSelector((state) => state.wallet.SPOT);
    const dispatch = useDispatch();
    const router = useRouter();

    const [state, set] = useState({
        amount: '',
        loadingConfirm: false,
        showOtp: false,
        needOtp: false
    });

    const { side, assetId } = router.query;
    const assetCode = getAssetCode(+assetId);
    const orderConfig = partner?.orderConfig?.[side.toLowerCase()];

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    useDebounce(
        () => {
            dispatch(setInput(state.amount));
        },
        500,
        [state.amount]
    );

    const { onMakeOrderWithOtpHandler, onMakeOrderSuccess, onMakeOrderHandler } = useMakeOrder({ setState, input });

    useEffect(() => {
        dispatch(setLoadingPartner(true));
    }, [state.amount]);

    // reset needOtp state
    useEffect(() => setState({ needOtp: false }), [state.amount, partner, accountBank]);

    const availableAsset = useMemo(
        () => wallets?.[+assetId]?.value - wallets?.[+assetId]?.locked_value,

        [wallets, assetId]
    );
    const {
        data: rate,
        loading: loadingRate,
        error
    } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, Boolean(side) && Boolean(assetId), [side, assetId]);

    const validator = useMemo(() => {
        let isValid = true,
            msg = null;
        if (!orderConfig?.max || !orderConfig?.min) {
        } else {
            const { min, max } = orderConfig;

            if (state.amount > availableAsset && side === SIDE.SELL) {
                isValid = false;
                msg = `Amount must not be greater than your ${assetCode} balance`;
            }

            if (state.amount > max) {
                isValid = false;
                msg = `Amount must not be greater than ${formatPrice(max, 0)}`;
            }
            if (state.amount < min) {
                isValid = false;
                msg = `Amount must not be smaller than ${formatPrice(min, 0)}`;
            }
        }

        return { isValid, msg, isError: !isValid };
    }, [orderConfig, state.amount, availableAsset]);

    return (
        <>
            <Card className="w-full">
                <div className="flex mb-4 -m-1 pt-6 relative">
                    <div className="flex-1 p-1 ">
                        <label htmlFor="HAHA" className="txtSecond-3 absolute left-0 top-0">
                            Số lượng
                        </label>
                        <TradingInput
                            id="HAHA"
                            value={state.amount}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                            inputClassName="!text-left !ml-0"
                            onValueChange={({ value }) => setState({ amount: value })}
                            validator={validator}
                            errorTooltip={false}
                            allowedDecimalSeparators={[',', '.']}
                            clearAble
                            placeHolder="Nhập số lượng tài sản"
                            renderTail={
                                side === SIDE.SELL && (
                                    <ButtonV2
                                        variants="text"
                                        disabled={+input === availableAsset}
                                        onClick={() => setState({ amount: availableAsset })}
                                        className="uppercase font-semibold text-teal !h-10 "
                                    >
                                        Max
                                    </ButtonV2>
                                )
                            }
                        />
                    </div>
                    <div className="w-24 p-1">
                        <ButtonV2
                            className="!text-dominant bg-gray-12 dark:bg-dark-2 hover:opacity-80"
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
                            <SyncAltIcon className="rotate-90" size={16} />
                        </ButtonV2>
                    </div>
                </div>

                <RecommendAmount setAmount={(value) => setState({ amount: value })} assetCode={assetCode} amount={state.amount} />
                <div className="space-y-2 mb-10">
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">Giá quy đổi</div>
                        <div className="txtPri-1 flex items-center space-x-1">
                            <span>1 {assetCode} =</span>
                            <span>{loadingRate ? <Skeletor width="40px" height="15px" /> : formatPrice(rate)}</span>
                            <span>VND</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">Số lượng {t(`payment-method:${side?.toLowerCase()}`)} tối thiểu</div>
                        <div className="txtPri-1 flex items-center">
                            {loadingPartner ? <Skeletor width="50px" /> : !partner ? '--' : formatPrice(orderConfig?.min, 0)}{' '}
                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2"> Giới hạn trong ngày</div>
                        <div className="txtPri-1 flex items-center">
                            {loadingPartner ? <Skeletor width="50px" /> : !partner ? '--' : formatPrice(partner?.partnerMetadata?.maintainVolume, 0)}{' '}
                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">Số lượng {t(`payment-method:${side?.toLowerCase()}`)} tối đa</div>
                        <div className="txtPri-1 flex items-center">
                            {loadingPartner ? <Skeletor width="50px" /> : !partner ? '--' : formatPrice(orderConfig?.max, 0)}{' '}
                            <span className="ml-1">{assetCode}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between ">
                        <div className="txtSecond-2">Số tiền cần chuyển</div>

                        <Tooltip place="top" effect="solid" isV3 id="rating">
                            <div className="max-w-[300px] ">{formatBalance(input * rate, 0)}</div>
                        </Tooltip>

                        <div data-tip="" className="inline-flex txtPri-1 space-x-1 !cursor-default" data-for="rating" id="rating">
                            <div className=" max-w-[150px] truncate">{formatBalance(input * rate, 0)}</div>
                            <div className="">VNDC</div>
                        </div>
                    </div>
                </div>
                <ButtonV2
                    loading={state.loadingConfirm || loadingPartner}
                    onClick={!state.needOtp ? onMakeOrderHandler : () => setState({ showOtp: true })}
                    disabled={
                        !partner ||
                        (!partnerBank && side === SIDE.BUY) ||
                        loadingPartner ||
                        !validator.isValid ||
                        (side === SIDE.SELL && state.amount > availableAsset)
                    }
                    className="disabled:cursor-default transition"
                >
                    {t('common:confirm')}
                </ButtonV2>
            </Card>
            <ModalOtp
                onSuccess={onMakeOrderSuccess}
                onConfirm={onMakeOrderWithOtpHandler}
                isVisible={state.showOtp}
                onClose={() => setState({ showOtp: false })}
                assetCode={assetCode}
            />
        </>
    );
};

export default CardInput;
