import React, { useMemo } from 'react';
import TradingInput from 'components/trade/TradingInput';
import Card from './components/Card';
import { useDispatch, useSelector } from 'react-redux';
import { setInput } from 'src/redux/actions/withdrawDeposit';
import { SyncAltIcon } from '../../svg/SvgIcon';

const CardInput = () => {
    const { input } = useSelector((state) => state.withdrawDeposit);
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
                    <button className="rounded-md bg-gray-12 dark:!bg-dark-2 text-dominant font-semibold p-3 flex items-center space-x-2">
                        VNDC
                        <SyncAltIcon className="rotate-90" size={16} />
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default CardInput;
