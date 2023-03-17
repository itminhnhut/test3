import React, { useMemo } from 'react';
import TradingInput from 'components/trade/TradingInput';
import Card from './components/common/Card';
import { useDispatch, useSelector } from 'react-redux';
import { setInput } from 'redux/actions/withdrawDeposit';
import { SyncAltIcon } from 'components/svg/SvgIcon';
import { switchAsset } from 'redux/actions/withdrawDeposit';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const CardInput = () => {
    const { input, assetId } = useSelector((state) => state.withdrawDeposit);
    const dispatch = useDispatch();

    const validator = useMemo(() => {
        let isValid = true,
            msg = null;
        if (input > 100) {
            isValid = false;
            msg = 'Amount must not be greater than 100';
        }
        return { isValid, msg, isError: !isValid };
    }, [input]);

    return (
        <Card className="min-h-[300px]">
            <div className="flex space-x-2 pt-6 relative">
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
                        // renderTail={<></>}
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
        </Card>
    );
};

export default CardInput;
