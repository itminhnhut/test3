import React, { useEffect, useMemo, useState } from 'react';
import TradingInput from 'components/trade/TradingInput';
import Card from './components/common/Card';
import { useDispatch, useSelector } from 'react-redux';
import { setInput, setLoadingPartner } from 'redux/actions/withdrawDeposit';
import { SyncAltIcon } from 'components/svg/SvgIcon';
import { switchAsset } from 'redux/actions/withdrawDeposit';
import { formatPrice, formatBalance } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Skeletor from 'components/common/Skeletor';
import { useRouter } from 'next/router';
import RecommendAmount from './components/RecommendAmount';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_ORDER_PRICE } from 'redux/actions/apis';
import { createNewOrder } from 'redux/actions/withdrawDeposit';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';
import { PATHS } from 'constants/paths';
import { useDebounce } from 'react-use';
import Tooltip from 'components/common/Tooltip';
import { useTranslation } from 'next-i18next';

const CardInput = () => {
    const { input, assetId, partner, partnerBank, accountBank, loadingPartner } = useSelector((state) => state.withdrawDeposit);
    const wallets = useSelector((state) => state.wallet.SPOT);
    const [loadingConfirm, setLoadingConfirm] = useState(false);
    const { t } = useTranslation();

    const [amount, setAmount] = useState('');

    useEffect(() => {
        dispatch(setLoadingPartner(true));
    }, [amount]);

    useDebounce(
        () => {
            dispatch(setInput(amount));
        },
        500,
        [amount]
    );

    const dispatch = useDispatch();
    const router = useRouter();
    const side = router?.query?.side;

    const orderConfig = partner?.orderConfig?.[side.toLowerCase()];

    const availableAsset = useMemo(
        () => wallets?.[assetId]?.value - wallets?.[assetId]?.locked_value,

        [wallets, assetId]
    );
    const { data: rate, loading: loadingRate, error } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, Boolean(side), [side, assetId]);

    const validator = () => {
        let isValid = true,
            msg = null;
        if (!orderConfig?.max || !orderConfig?.min) {
        } else {
            const { min, max } = orderConfig;
            if (input > max) {
                isValid = false;
                msg = `Amount must not be greater than ${formatPrice(max, 0)}`;
            }
            if (input < min) {
                isValid = false;
                msg = `Amount must not be smaller than ${formatPrice(min, 0)}`;
            }
        }

        return { isValid, msg, isError: !isValid };
    };

    const onMakeOrderHandler = async () => {
        try {
            setLoadingConfirm(true);
            const orderResponse = await createNewOrder({
                assetId,
                bankAccountId: side === SIDE.BUY ? partnerBank?._id : accountBank?._id,
                partnerId: partner?.partnerId,
                quantity: input,
                side
            });

            if (orderResponse && orderResponse.status === ApiStatus.SUCCESS) {
                toast({ text: `Bạn đã đặt thành công lệnh mua ${assetId === 72 ? 'VNDC' : 'USDT'} #${orderResponse.data.displayingId} `, type: 'success' });
                router.push(PATHS.WITHDRAW_DEPOSIT.DETAIL + '/' + orderResponse.data.displayingId);
            }
        } catch (error) {
            console.log('error:', error);
        } finally {
            setLoadingConfirm(false);
        }
    };

    return (
        <Card className="min-h-[444px]">
            <div className="flex mb-4 -m-1 pt-6 relative">
                <div className="flex-1 p-1 ">
                    <label htmlFor="HAHA" className="txtSecond-3 absolute left-0 top-0">
                        Số lượng
                    </label>
                    <TradingInput
                        id="HAHA"
                        value={amount}
                        allowNegative={false}
                        thousandSeparator={true}
                        containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                        inputClassName="!text-left !ml-0"
                        onValueChange={({ value }) => setAmount(value)}
                        validator={validator()}
                        errorTooltip={false}
                        allowedDecimalSeparators={[',', '.']}
                        clearAble
                        placeHolder="Nhập số lượng tài sản"
                        renderTail={
                            side === SIDE.SELL && (
                                <ButtonV2
                                    variants="text"
                                    disabled={+input === availableAsset}
                                    onClick={() => setAmount(availableAsset)}
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
                                    query: { assetId: assetId === 72 ? 22 : 72, side }
                                },
                                // undefined,
                                // { shallow: true }
                            );
                            // dispatch(switchAsset(assetId));
                        }}
                    >
                        <span>{assetId === 72 ? 'VNDC' : 'USDT'}</span>
                        <SyncAltIcon className="rotate-90" size={16} />
                    </ButtonV2>
                </div>
            </div>

            <RecommendAmount setAmount={setAmount} amount={amount} />
            <div className="space-y-2 mb-10">
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Giá quy đổi</div>
                    <div className="txtPri-1 flex items-center space-x-1">
                        <span>1 {assetId === 72 ? 'VNDC' : 'USDT'} =</span>
                        <span>{loadingRate ? <Skeletor width="40px" height="15px" /> : formatPrice(rate)}</span>
                        <span>VND</span>
                    </div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số lượng {t(`payment-method:${side?.toLowerCase()}`)} tối thiểu</div>
                    <div className="txtPri-1 flex items-center">
                        {loadingPartner ? <Skeletor width="50px" /> : !partner ? '--' : formatPrice(orderConfig?.min, 0)}{' '}
                        <span className="ml-1">{assetId === 72 ? 'VNDC' : 'USDT'}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2"> Giới hạn trong ngày</div>
                    <div className="txtPri-1 flex items-center">
                        {loadingPartner ? <Skeletor width="50px" /> : !partner ? '--' : formatPrice(partner?.partnerMetadata?.maintainVolume, 0)}{' '}
                        <span className="ml-1">{assetId === 72 ? 'VNDC' : 'USDT'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số lượng {t(`payment-method:${side?.toLowerCase()}`)} tối đa</div>
                    <div className="txtPri-1 flex items-center">
                        {loadingPartner ? <Skeletor width="50px" /> : !partner ? '--' : formatPrice(orderConfig?.max, 0)}{' '}
                        <span className="ml-1">{assetId === 72 ? 'VNDC' : 'USDT'}</span>
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
                loading={loadingConfirm || loadingPartner}
                onClick={onMakeOrderHandler}
                disabled={!partner || loadingPartner}
                className="disabled:cursor-default"
            >
                Xác nhận
            </ButtonV2>
        </Card>
    );
};

export default CardInput;
