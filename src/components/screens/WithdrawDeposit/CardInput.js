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

const CardInput = () => {
    const { input, assetId, selectedPartner } = useSelector((state) => state.withdrawDeposit);
    const dispatch = useDispatch();
    const router = useRouter();
    const side = router?.query?.side;

    const orderConfig = selectedPartner?.orderConfig?.[side.toLowerCase()];

    const { data: rate, loading: loadingRate, error } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId, side } }, [side, assetId]);

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
    }, [input, selectedPartner, orderConfig]);

    const renderingMinMaxPartner = useCallback(
        (price) => {
            return !selectedPartner ? (
                <Skeletor width={100} />
            ) : (
                <div>
                    {formatPrice(price, 0)} <span>{assetId === 72 ? 'VNDC' : 'USDT'}</span>
                </div>
            );
        },
        [assetId, selectedPartner]
    );

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
                    />
                </div>
                <div className="w-24">
                    <ButtonV2 className="!text-dominant" variants="secondary" onClick={() => dispatch(switchAsset(assetId))}>
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
                        <span>1 {assetId === 72 ? 'VNDC' : 'USDT'} </span> =
                        <span className="flex ml-1 items-center">{loadingRate ? <Skeletor width="50px" height="20px" /> : formatPrice(rate)}</span> VND
                    </div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số lượng nạp tối thiểu</div>
                    <div className="txtPri-1">{renderingMinMaxPartner(selectedPartner?.orderConfig[side.toLowerCase()]?.min)}</div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số lượng nạp tối đa</div>
                    <div className="txtPri-1">{renderingMinMaxPartner(selectedPartner?.orderConfig[side.toLowerCase()]?.max)}</div>
                </div>
                <div className="flex items-center justify-between ">
                    <div className="txtSecond-2">Số tiền cần chuyển</div>
                    <div className="txtPri-1">{formatPrice(input * rate)} VNDC</div>
                </div>
            </div>
            <ButtonV2 disabled={!selectedPartner} className="disabled:cursor-default">
                Xác nhận
            </ButtonV2>
        </Card>
    );
};

export default CardInput;
