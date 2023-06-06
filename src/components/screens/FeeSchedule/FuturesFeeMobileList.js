import { range } from 'lodash';
import Link from 'next/link';
import { PATHS } from 'constants/paths';
import { TRADING_MODE } from 'redux/actions/const';
import { useState } from 'react';
import AssetLogo from 'components/wallet/AssetLogo';

export default function FuturesFeeMobileList({ t, data = [], currentQuote, loading = true }) {
    const [isShowMore, setIsShowMore] = useState(false);

    return (
        <div>
            <div className="divide-y divide-divider dark:divide-divider-dark space-y-8">
                {
                    // LOADING
                    loading &&
                        range(0, 5).map((i) => {
                            return (
                                <div key={i} className="pt-8 animate-pulse">
                                    <div className="flex justify-between mb-6">
                                        <div className="w-28 h-7 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                        <div className="w-28 h-7 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                    </div>

                                    <div className="flex justify-between items-center mb-3">
                                        <div className="w-40 h-3 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                        <div className="w-48 h-3 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="w-40 h-3 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                        <div className="w-48 h-3 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                    </div>
                                </div>
                            );
                        })
                }
                {(data || [])
                    .filter((c) => {
                        const quote = c?.name.substring(c?.name?.length - 4);
                        return quote === currentQuote;
                    })
                    .slice(0, isShowMore ? undefined : 10)
                    .map((item) => {
                        return (
                            <div key={item.name} className="pt-8">
                                <div className="flex justify-between mb-6">
                                    <div>
                                        <p className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('common:pair')}</p>
                                        <Link href={PATHS.FUTURES.TRADE.getPair(TRADING_MODE.FUTURES, { pair: item?.name })}>
                                            <a className="font-semibold hover:!underline">{item?.name}</a>
                                        </Link>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('common:max_leverage')}</p>
                                        <span className="font-semibold">{item.max_leverage}x</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm mb-3">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('fee-structure:fee_open_close')}</div>
                                    <div>
                                        {item?.place_order_fee * 100}%&nbsp;/&nbsp;{item?.close_order_fee * 100}%
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('fee-structure:fee_nami_open_close')}</span>
                                    <p className="whitespace-nowrap">
                                        {item?.place_order_fee_promote * 100}%&nbsp;/&nbsp;{item?.close_order_fee_promote * 100}%
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div className="text-center mt-8">
                <span className="text-teal font-semibold cursor-pointer" onClick={() => setIsShowMore(!isShowMore)}>
                    {isShowMore ? t('fee-structure:show_less') : t('fee-structure:show_more')}
                </span>
            </div>
        </div>
    );
}

export function FuturesFeeMobileListV2({ t, data = [], loading = true }) {
    const [isShowMore, setIsShowMore] = useState(false);

    return (
        <div>
            <div className="flex justify-between mt-6">
                <div>
                    <p className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">Coin/Token</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb-1">{t('fee-structure:fee_open_close')}</p>
                </div>
            </div>
            <div>
                {
                    // LOADING
                    loading &&
                        range(0, 5).map((i) => {
                            return (
                                <div key={i} className="pt-8 animate-pulse">
                                    <div className="flex justify-between mb-6">
                                        <div className="w-28 h-7 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                        <div className="w-28 h-7 bg-darkBlue-5 dark:bg-dark-2 rounded-md" />
                                    </div>
                                </div>
                            );
                        })
                }
                {(data || []).map((item) => {
                    return (
                        <div key={item.assetId} className="mt-4">
                            <div className="flex justify-between items-center text-sm mt-4">
                                <div className="flex items-center font-semibold text-sm sm:text-base">
                                    <AssetLogo assetCode={item.assetCode} size={32} />
                                    <div className="whitespace-nowrap truncate ml-2">
                                        <span className="text-txtPrimary dark:text-txtPrimary-dark">{item.assetCode}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-semibold">{`${item.ratio} / ${item.ratio}`}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
