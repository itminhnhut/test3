import TradingInputV2 from 'components/trade/TradingInputV2';
import React, { useState } from 'react';
import SelectV2 from 'components/common/V2/SelectV2';
import { useTranslation } from 'next-i18next';
import APYInterestChart from './APYInterestChart';

const INITIAL_STAKING_CURRENCY = {
    value: 72,
    title: 'VNDC'
};

const STAKING_CURRENCIES = [
    {
        value: 72,
        title: 'VNDC'
    },
    {
        value: 4,
        title: 'USDT'
    }
];

const CalculateInterest = () => {
    const { t } = useTranslation();
    const [stakingCurrency, setStakingCurrency] = useState(INITIAL_STAKING_CURRENCY);
    const [amountStaking, setAmountStaking] = useState('');
    return (
        <section className="mt-[88px] lg:mt-[118px] px-3 py-10 md:px-20 md:py-[60px] dark:bg-dark-4 bg-white border-divider dark:border-divider-dark border rounded-xl">
            <div className="text-center space-y-3 mb-10 md:mb-[60px]">
                <div className="text-2xl md:text-5xl font-semibold">Tính toán lợi nhuận</div>
                <div className="text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark">
                    Chọn loại tài sản số và nhập số lượng để tham khảo lợi nhuận nhận được qua thời gian từ chương trình Nhận lãi ngày của Nami Exchange
                </div>
            </div>
            <div className="flex flex-wrap -m-5">
                <div className="p-5 md:max-w-[460px] w-full space-y-7">
                    <div className="space-y-2">
                        <label className="txtSecond-5">Lựa chọn Token</label>
                        <SelectV2
                            onChange={(_, value) => {
                                setStakingCurrency(value);
                            }}
                            options={STAKING_CURRENCIES}
                            value={stakingCurrency.value}
                            popoverClassName="!top-full !z-10"
                            className="txtPri-1"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="staking_amount_input" className="txtSecond-5">
                            {t('common:amount')}
                        </label>
                        <TradingInputV2
                            id="staking_amount_input"
                            value={amountStaking}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                            inputClassName="!text-left !ml-0 txtPri-2"
                            onValueChange={({ value }) => setAmountStaking(value)}
                            decimalScale={stakingCurrency.value === 72 ? 0 : 4}
                            allowedDecimalSeparators={[',', '.']}
                            clearAble
                            placeHolder="Amount"
                        />
                    </div>
                    <div className="p-3"></div>
                </div>
                <div className="p-5 flex-grow min-h-[400px]">
                    <APYInterestChart />
                </div>
            </div>
        </section>
    );
};

export default CalculateInterest;
