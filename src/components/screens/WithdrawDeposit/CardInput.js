import React, { useCallback, useMemo } from 'react';
import TradingInput from 'components/trade/TradingInput';
import Card from './components/common/Card';
import { useDispatch, useSelector } from 'react-redux';
import { setInput } from 'redux/actions/withdrawDeposit';
import { SyncAltIcon } from 'components/svg/SvgIcon';
import { switchAsset } from 'redux/actions/withdrawDeposit';
import { formatPrice } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Skeletor from 'components/common/Skeletor';

import { useRouter } from 'next/router';
import RecommendAmount from './components/RecommendAmount';
import useFetchApi from 'hooks/useFetchApi';
import { API_GET_ORDER_PRICE } from 'redux/actions/apis';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const CardInput = () => {
    const { input, assetId, partner } = useSelector((state) => state.withdrawDeposit);
    console.log('partner:', partner);
    const wallets = useSelector((state) => state.wallet.SPOT);

    const dispatch = useDispatch();
    const router = useRouter();
    const side = router?.query?.side;

    const orderConfig = useMemo(() => partner?.orderConfig?.[side.toLowerCase()], [partner]);
    const availableAsset = useMemo(
        () => wallets?.[assetId]?.value - wallets?.[assetId]?.locked_value,

        [wallets, assetId]
    );
    const { data: rate, loading: loadingRate, error } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, Boolean(side), [side, assetId]);

    const validator = useMemo(() => {
        let isValid = true,
            msg = null;
        if (!orderConfig?.max || !orderConfig?.min) {
        } else {
            const { min, max } = orderConfig;
            if (input > max) {
                isValid = false;
                msg = `Amount must not be greater than ${max}`;
            }
            if (input < min) {
                isValid = false;
                msg = `Amount must not be smaller than ${min}`;
            }
        }

        return { isValid, msg, isError: !isValid };
    }, [input, partner, orderConfig]);

    const renderingMinMaxPartner = useCallback(
        (price) => {
            return !partner ? (
                <Skeletor width={100} />
            ) : (
                <div>
                    {formatPrice(price, 0)} <span>{assetId === 72 ? 'VNDC' : 'USDT'}</span>
                </div>
            );
        },
        [assetId, partner]
    );

    console.log('availableAsset:', availableAsset);

    return (
        <Card className="min-h-[444px]">
            <div className="flex mb-4 space-x-2 pt-6 relative">
                <div className="flex-1 ">
                    <label htmlFor="HAHA" className="txtSecond-3 absolute left-0 top-0">
                        Số lượng
                    </label>
                    <TradingInput
                        id="HAHA"
                        value={input}
                        allowNegative={false}
                        thousandSeparator={true}
                        containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                        inputClassName="!text-left !ml-0"
                        onValueChange={({ value }) => dispatch(setInput(value))}
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
                                    onClick={() => dispatch(setInput(availableAsset))}
                                    className="uppercase font-semibold text-teal !h-10"
                                >
                                    Max
                                </ButtonV2>
                            )
                        }
                    />
                </div>
                <div className="w-24">
                    <ButtonV2
                        className="!text-dominant"
                        variants="secondary"
                        onClick={() => {
                            dispatch(switchAsset(assetId));
                        }}
                    >
                        <span>{assetId === 72 ? 'VNDC' : 'USDT'}</span>
                        <SyncAltIcon className="rotate-90" size={16} />
                    </ButtonV2>
                </div>
            </div>

            <RecommendAmount />
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
                    <div className="txtSecond-2">Số lượng nạp tối thiểu</div>
                    <div className="txtPri-1">{renderingMinMaxPartner(orderConfig?.min)}</div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số lượng nạp tối đa</div>
                    <div className="txtPri-1">{renderingMinMaxPartner(orderConfig?.max)}</div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số tiền cần chuyển</div>
                    <div className="txtPri-1">{formatPrice(input * rate)} VNDC</div>
                </div>
            </div>
            <ButtonV2 disabled={!partner} className="disabled:cursor-default">
                Xác nhận
            </ButtonV2>
        </Card>
    );
};

export default CardInput;
