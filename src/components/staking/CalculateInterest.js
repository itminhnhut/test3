import TradingInputV2 from 'components/trade/TradingInputV2';
import React, { useMemo, useState } from 'react';
import SelectV2 from 'components/common/V2/SelectV2';
import { useTranslation } from 'next-i18next';
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, getExactBalanceFiat, roundByExactDigit } from 'redux/actions/utils';
import dynamic from 'next/dynamic';

const APYInterestChart = dynamic(() => import('./APYInterestChart'), { ssr: false });

const APY_PERCENT = {
    VNDC: 12.79,
    USDT: 6
};
const DAYS_IN_YEAR = 365;

const getDayInterestPercent = (apy) => roundByExactDigit(apy / DAYS_IN_YEAR, 4);

const STAKING_CURRENCIES = [
    {
        value: 72,
        code: 'VNDC',
        dayInterestPercent: getDayInterestPercent(APY_PERCENT['VNDC']),
        title: ({ t }) => {
            return (
                <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark flex items-center gap-2">
                    <div className="w-6 h-6">
                        <AssetLogo size={24} assetId={72} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="">VNDC</div>
                        <div className="text-teal">
                            {APY_PERCENT['VNDC']}%/{t('common:year')}
                        </div>
                    </div>
                </div>
            );
        }
    },
    {
        value: 22,
        code: 'USDT',
        dayInterestPercent: getDayInterestPercent(APY_PERCENT['USDT']),
        title: ({ t }) => (
            <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark flex items-center gap-2">
                <div className="w-6">
                    <AssetLogo size={24} assetId={22} />
                </div>
                <div className="">USDT</div>
                <div className="text-teal">
                    {APY_PERCENT['USDT']}%/{t('common:year')}
                </div>
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
                <div className="text-2xl md:text-5xl font-semibold">{t('staking:calculate_interest.head_title')}</div>
                <div className="text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark">{t('staking:calculate_interest.sub_title')} </div>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap -mx-5">
                <div className="px-5 mb-10 lg:mb-0 lg:max-w-[440px] w-full space-y-7">
                    <div className="space-y-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('staking:calculate_interest.select_asset')}</div>
                        <SelectV2
                            titleParams={{ t }}
                            onChange={(_, currency) => {
                                setState({ stakingCurrency: currency, amountStaking: STAKING_RANGE[currency.value].DEFAULT });
                            }}
                            options={STAKING_CURRENCIES}
                            value={state.stakingCurrency.value}
                            popoverPanelClassName="!top-full !z-[11] "
                            popoverClassName="dark:!bg-dark-2"
                            className="txtPri-1 !bg-gray-12 dark:!bg-dark-2"
                            optionClassName="!px-3"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('common:quantity')}</div>
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
                            // validator={validator}
                            errorTooltip={false}
                        />
                    </div>
                </div>
                <div className="px-5 w-full lg:w-auto lg:flex-grow">
                    <APYInterestChart
                        amount={state.amountStaking}
                        currencyDayInterest={state.stakingCurrency.dayInterestPercent}
                        currencyId={state.stakingCurrency.value}
                    />
                </div>
            </div>
        </section>
    );
};

export default CalculateInterest;
