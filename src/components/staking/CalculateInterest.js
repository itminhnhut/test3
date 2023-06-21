import TradingInputV2 from 'components/trade/TradingInputV2';
import React, { useMemo, useState } from 'react';
import SelectV2 from 'components/common/V2/SelectV2';
import { useTranslation } from 'next-i18next';
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, getExactBalanceFiat } from 'redux/actions/utils';
import dynamic from 'next/dynamic';

const APYInterestChart = dynamic(() => import('./APYInterestChart'), { ssr: false });

const STAKING_CURRENCIES = [
    {
        value: 72,
        code: 'VNDC',
        apyPercent: 12.79,
        dayInterestPercent: 0.035, // apyPercent / 365
        title: (
            <div className="font-semibold flex items-center  space-x-2">
                <AssetLogo size={24} assetId={72} />
                <span className="">VNDC</span>
                <span className=" text-teal">12.79%/năm</span>
            </div>
        )
    },
    {
        value: 22,
        code: 'USDT',
        apyPercent: 6,
        dayInterestPercent: 0.016, // apyPercent / 365
        title: (
            <div className="font-semibold flex items-center  space-x-2">
                <AssetLogo size={24} assetId={22} />
                <span className="">USDT</span>
                <span className=" text-teal">6%/năm</span>
            </div>
        )
    }
];

export const STAKING_RANGE = {
    72: {
        min: 10e3, // 10k
        max: 2e9, // 2 tỷ,
        DEFAULT: 100e6
    },
    22: {
        DEFAULT: 5e3,
        min: 5,
        max: 20e3 // 20k
    }
};

const initState = {
    stakingCurrency: STAKING_CURRENCIES[0],
    amountStaking: STAKING_RANGE[72].DEFAULT
};

const CalculateInterest = () => {
    const { t } = useTranslation();

    const [state, set] = useState(initState);
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const validator = useMemo(() => {
        const { value } = state.stakingCurrency;
        let isValid = true,
            msg = '',
            isError = false;

        if (state.amountStaking < STAKING_RANGE[value].min) {
            return {
                isValid: false,
                isError: true,
                msg: 'Số lượng Stake phải >= ' + formatNumber(STAKING_RANGE[value].min, value === 72 ? 0 : 4)
            };
        }
        if (state.amountStaking > STAKING_RANGE[value].max) {
            return {
                isValid: false,
                isError: true,
                msg: 'Số lượng Stake phải <= ' + formatNumber(STAKING_RANGE[value].max, value === 72 ? 0 : 4)
            };
        }

        return {
            isValid,
            msg,
            isError
        };
    }, [state.stakingCurrency.value, state.amountStaking]);

    return (
        <section className="mt-[88px] lg:mt-[118px] px-3 py-10 md:px-20 md:py-[60px] dark:bg-dark-4 bg-white border-divider dark:border-divider-dark border rounded-xl">
            <div className="text-center space-y-3 mb-10 md:mb-[60px]">
                <div className="text-2xl md:text-5xl font-semibold">Tính toán lợi nhuận</div>
                <div className="text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark">
                    Chọn loại tài sản số và nhập số lượng để tham khảo lợi nhuận nhận được qua thời gian từ chương trình Nhận lãi ngày của Nami Exchange
                </div>
            </div>
            <div className="flex flex-wrap -mx-5">
                <div className="px-5 mb-10 md:mb-0 md:max-w-[460px] w-full space-y-7">
                    <div className="space-y-2">
                        <label className="txtSecond-5">Lựa chọn Token</label>
                        <SelectV2
                            onChange={(_, currency) => {
                                setState({ stakingCurrency: currency, amountStaking: STAKING_RANGE[currency.value].DEFAULT });
                            }}
                            options={STAKING_CURRENCIES}
                            value={state.stakingCurrency.value}
                            popoverClassName="!top-full !z-[11] "
                            className="txtPri-1 !bg-gray-12 dark:!bg-dark-2"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="staking_amount_input" className="txtSecond-5">
                            {t('common:amount')}
                        </label>
                        <TradingInputV2
                            id="staking_amount_input"
                            value={state.amountStaking}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                            inputClassName="!text-left !ml-0 txtPri-2"
                            onValueChange={({ value }) => setState({ amountStaking: value })}
                            decimalScale={state.stakingCurrency.value === 72 ? 0 : 4}
                            allowedDecimalSeparators={[',', '.']}
                            clearAble
                            placeHolder="0"
                            validator={validator}
                            errorTooltip={false}
                        />
                    </div>
                </div>
                <div className="px-5 w-full md:w-auto md:flex-grow">
                    <APYInterestChart
                        amount={state.amountStaking}
                        currencyDayInterest={state.stakingCurrency.dayInterestPercent}
                        currencyApy={state.stakingCurrency.apyPercent}
                        currencyId={state.stakingCurrency.value}
                    />
                </div>
            </div>
        </section>
    );
};

export default CalculateInterest;
