import Skeletor from 'components/common/Skeletor';
import React from 'react';
import { MIN_MARGIN, MIN_MAX_RATIO, MOBILE_ROWS_PER_PAGE } from './InsuranceRules';
import { formatNumber, getSymbolObject } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import NoData from 'components/common/V2/TableV2/NoData';
import Tooltip from 'components/common/Tooltip';

const TableMobileView = ({ filterRulesData, loading, isSearch, page }) => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8 mb-6">
            {loading ? (
                // LOADING
                [...Array(2).keys()].map((key) => (
                    <div key={key} className="space-y-4 last:pb-0 pb-4 last:border-0 border-b border-divider dark:border-divider-dark">
                        <div className="flex items-center font-semibold space-x-2">
                            <Skeletor circle width={24} height={24} />
                            <Skeletor width={70} />
                        </div>
                        <div className="flex items-center text-sm justify-between">
                            <Skeletor width={100} />
                            <Skeletor width={100} />
                        </div>
                        <div className="flex items-center text-sm justify-between">
                            <Skeletor width={100} />
                            <Skeletor width={100} />
                        </div>
                        <div className="flex items-center text-sm justify-between">
                            <Skeletor width={100} />
                            <Skeletor width={100} />
                        </div>
                        <div className="flex items-center text-sm justify-between">
                            <Skeletor width={100} />
                            <Skeletor width={100} />
                        </div>
                    </div>
                ))
            ) : // NO DATA
            !filterRulesData?.length && isSearch ? (
                <NoData loading={loading} isSearch className="!text-base" />
            ) : (
                // MAPPING DATA
                [...filterRulesData].slice(0, MOBILE_ROWS_PER_PAGE * page)?.map((rule, i) => {
                    const symbolObject = getSymbolObject(rule?.symbol);
                    return (
                        <>
                            <div key={rule.symbol + i} className="space-y-4 last:pb-0 pb-4 last:border-0 border-b border-divider dark:border-divider-dark">
                                <Tooltip
                                    className="p-6 max-w-[247px] text-center"
                                    id={`avg_changing_detail_mobile_${rule?.symbol}`}
                                    place="top"
                                    effect="solid"
                                    isV3
                                >
                                    {t('futures:insurance.difference_description')}
                                </Tooltip>
                                <Tooltip className="p-6 max-w-[247px] text-center" id={`minmax_ratio_${rule?.symbol}`} place="top" effect="solid" isV3>
                                    {t('futures:insurance.min_max_margin_ratio_description')}
                                </Tooltip>
                                <div className="flex items-center font-semibold space-x-2">
                                    <AssetLogo assetCode={symbolObject?.baseAsset} size={24} useNextImg />
                                    <div className="">{rule?.symbol}</div>
                                </div>
                                <div className="flex items-center text-sm justify-between">
                                    <div
                                        data-for={`avg_changing_detail_mobile_${rule?.symbol}`}
                                        data-tip=""
                                        className="text-txtSecondary dark:text-txtSecondary-dark nami-underline-dotted"
                                    >
                                        {t('futures:insurance.difference')}
                                    </div>
                                    <div>{formatNumber(rule?.avg_changing * 100, 2)}%</div>
                                </div>
                                <div className="flex items-center text-sm justify-between">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:insurance.max_leverage')}</div>
                                    <div>{rule?.max_leverage}x</div>
                                </div>
                                <div className="flex items-center text-sm justify-between">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:insurance.min_margin')}</div>
                                    <div>{MIN_MARGIN} USDT</div>
                                </div>
                                <div className="flex items-center text-sm justify-between">
                                    <div
                                        data-for={`minmax_ratio_${rule?.symbol}`}
                                        data-tip=""
                                        className="nami-underline-dotted text-txtSecondary dark:text-txtSecondary-dark"
                                    >
                                        {t('futures:insurance.min_max_margin_ratio')}
                                    </div>
                                    <div className="">
                                        {MIN_MAX_RATIO.min}%/{MIN_MAX_RATIO.max}%
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })
            )}
        </div>
    );
};

export default TableMobileView;
