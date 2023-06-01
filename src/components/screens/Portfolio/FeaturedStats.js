import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import PriceChangePercent from 'components/common/PriceChangePercent';
import colors from 'styles/colors';
import Tooltip from 'components/common/Tooltip';
import { formatNanNumber } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import classNames from 'classnames';
import HeaderTooltip from './HeaderTooltip';
import CollapseV2 from 'components/common/V2/CollapseV2';
import { API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';

const FeaturedStats = ({ className, user, t, isMobile, isDark, dataOverview, loadingOverview, typeCurrency }) => {
    const [usdRate, setUsdRate] = useState();
    useEffect(() => {
        FetchApi({
            url: API_GET_REFERENCE_CURRENCY,
            params: { base: 'VNDC,USDT', quote: 'USD' }
        })
            .then(({ data = [] }) => {
                const baseCurrency = typeCurrency === ALLOWED_ASSET_ID.VNDC ? 'VNDC' : 'USDT';
                setUsdRate(data.find((obj) => obj.base === baseCurrency)?.price);
            })
            .catch((err) => console.error(err));
    }, [typeCurrency]);

    const isVnd = typeCurrency === ALLOWED_ASSET_ID.VNDC;

    const renderSumVolumns = useCallback(() => {
        const totalVolume = dataOverview?.totalVolume?.value;
        const swapValue = formatNanNumber(totalVolume * usdRate, 4) + ' USD';
        return (
            <div className={isMobile ? 'p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4' : 'flex-auto px-6 py-4'}>
                <span>{t('transaction-history:modal_detail.volume')}</span>
                <div className="text-base md:text-2xl font-semibold text-gray-15 dark:text-gray-4 mt-2 md:mt-4">
                    {loadingOverview ? <Skeletor width={150} /> : formatNanNumber(totalVolume, typeCurrency === ALLOWED_ASSET_ID.VNDC ? 0 : 4)}
                </div>
                <div className="mt-1 md:mt-2">{loadingOverview ? <Skeletor width={150} /> : swapValue}</div>
            </div>
        );
    }, [isMobile, loadingOverview, dataOverview, usdRate]);

    const renderSumPnl = useCallback(() => {
        const totalPnl = dataOverview?.totalPnl?.value;
        const sign = totalPnl > 0 ? '+ ' : '';

        return (
            <div className={isMobile ? 'p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4' : 'flex-auto px-6 py-4'}>
                <span>{t('portfolio:pnl')}</span>
                <div
                    className={classNames('text-base md:text-2xl font-semibold mt-2 md:mt-4 text-gray-15 dark:text-gray-4', {
                        '!text-green-3 !dark:text-green-2': totalPnl > 0,
                        '!text-red-2 !dark:text-red': totalPnl < 0
                    })}
                >
                    {loadingOverview ? <Skeletor width={150} /> : `${sign} ${formatNanNumber(totalPnl, isVnd ? 0 : 4)}`}
                </div>
                {loadingOverview ? (
                    <Skeletor width={50} />
                ) : totalPnl === 0 ? (
                    <div className="mt-1 md:mt-2">0%</div>
                ) : (
                    <PriceChangePercent
                        priceChangePercent={totalPnl / dataOverview?.totalMargin?.value}
                        className="!justify-start text-xs leading-[16px] md:text-base mt-1 md:mt-2"
                    />
                )}
            </div>
        );
    }, [isMobile, loadingOverview, dataOverview]);

    const renderOtherSummary = useCallback(() => {
        const totalMargin = dataOverview?.totalMargin?.value;
        const swapValue = formatNanNumber(totalMargin * usdRate, 4) + ' USD';
        const avgLeverage = formatNanNumber(dataOverview?.avgLeverage?.value, 0);

        return (
            <div className={isMobile ? 'mt-4 p-4 text-gray-1 dark:text-gray-7 rounded-xl bg-gray-13 dark:bg-dark-4' : 'flex-auto md:px-6 py-4'}>
                <div className="flex items-center justify-between">
                    <span>{t('futures:margin')}</span>
                    {loadingOverview ? (
                        <Skeletor width={200} />
                    ) : (
                        <div className="text-right">
                            <span className="txtPri-1">{formatNanNumber(totalMargin, isVnd ? 0 : 4)}</span>
                            <span className="txtSecond-2">{` (${swapValue})`}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span>{t('portfolio:position')}</span>
                    {loadingOverview ? (
                        <Skeletor width={200} />
                    ) : (
                        <div className="text-right">
                            <span className="txtPri-1">{dataOverview?.totalPositions?.value}</span>
                            <span className="txtSecond-2">{` (${dataOverview?.countLongPositions?.doc_count} ${t('common:buy')} - ${dataOverview?.countShortPositions?.doc_count} ${t('common:sell')})`}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span>{t('portfolio:avg_leverage')}</span>
                    {loadingOverview ? <Skeletor width={50} /> : <span className="txtPri-1">{avgLeverage ? `${avgLeverage}X` : '-'}</span>}
                </div>
            </div>
        );
    });

    return (
        <div className={className}>
            <Tooltip id={'key_statistic'} place="top" className="max-w-[520px]" />
            {isMobile ? (
                <CollapseV2
                    className="w-full"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={
                        <HeaderTooltip
                            isMobile={isMobile}
                            title={t('portfolio:key_metrics')}
                            tooltipContent={t('portfolio:key_metrics_tooltip')}
                            tooltipId={'key_metrics_tooltip'}
                        />
                    }
                    labelClassname="text-base font-semibold"
                    isDividerBottom={true}
                >
                    <div className="mt-6">
                        <div className="mt-6 text-gray-1 dark:text-gray-7">
                            <div className="grid grid-cols-2 gap-x-3">
                                {renderSumVolumns()}
                                {renderSumPnl()}
                            </div>
                            {renderOtherSummary()}
                        </div>
                    </div>
                </CollapseV2>
            ) : (
                <>
                    <HeaderTooltip
                        isMobile={isMobile}
                        title={t('portfolio:key_metrics')}
                        tooltipContent={t('portfolio:key_metrics_tooltip')}
                        tooltipId={'key_metrics_tooltip'}
                    />
                    <div className=" text-gray-1 dark:text-gray-7 mt-8 rounded-xl flex px-6 py-3 bg-gray-13 dark:bg-dark-4">
                        {renderSumVolumns()}
                        <div className="vertical-divider"></div>
                        {renderSumPnl()}
                        <div className="vertical-divider"></div>
                        {renderOtherSummary()}
                    </div>
                </>
            )}
        </div>
    );
};

export default FeaturedStats;
