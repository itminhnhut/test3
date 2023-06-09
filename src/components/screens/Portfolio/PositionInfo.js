import { useState, useMemo } from 'react';
import HeaderTooltip from './HeaderTooltip';
import { formatNanNumber } from 'redux/actions/utils';
import Tooltip from 'components/common/Tooltip';
import CollapseV2 from 'components/common/V2/CollapseV2';
import colors from 'styles/colors';
import { isNaN } from 'lodash';
import ModalV2 from 'components/common/V2/ModalV2';
import MCard from 'components/common/MCard';
import { formatNumber } from 'utils/reference-utils';

const deltaClipPath = 0.8;

const TooltipProfit = ({ type, totalProfit, totalProfitPosition, isVndc, t, ...rest }) => (
    <Tooltip {...rest} id={`${type}_profit_tooltip`} place="top" className="max-w-[520px] !p-3">
        <div className="text-base">
            <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('portfolio:profit_position')}</div>
            <ul className="list-disc marker:text-xs ml-5 mt-2">
                <li>{`${t('common:amount')}: ${totalProfitPosition}`}</li>
                <li>
                    {`${t('portfolio:total_profit')}: `} <span className="text-green-3 dark:text-green-2 font-semibold">+{formatNanNumber(totalProfit, isVndc ? 0 : 4)}</span>
                </li>
            </ul>
        </div>
    </Tooltip>
);

const TooltipLoss = ({ type, totalLoss, totalLossPosition, isVndc, t, ...rest }) => (
    <Tooltip {...rest} id={`${type}_loss_tooltip`} place="top" className="max-w-[520px] !p-3">
        <div className="text-base">
            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('portfolio:loss_position')}</div>
            <ul className="list-disc marker:text-xs ml-5 mt-2">
                <li>{`${t('common:amount')}: ${totalLossPosition}`}</li>
                <li>
                    {`${t('portfolio:total_loss')}: `} <span className="text-red-2 font-semibold">{formatNanNumber(totalLoss, isVndc ? 0 : 4)}</span>
                </li>
            </ul>
        </div>
    </Tooltip>
);

const PositionInfo = ({
    type = 'buy',
    t,
    total,
    totalLoss,
    totalProfit,
    totalLossPosition,
    totalProfitPosition,
    isNeverTrade,
    isVndc = true,
    isMobile = false,
    isDark,
    setIsOpen
}) => {
    const percentClipPath = useMemo(() => {
        return (totalLossPosition / total) * 100;
    }, [totalLossPosition, total]);
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="py-6 px-4 md:p-8 rounded-xl bg-gray-13 dark:bg-dark-4 static">
            {isMobile ? (
                <CollapseV2
                    key={`Collapse_${type}`}
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={
                        <HeaderTooltip
                            isMobile
                            title={t('portfolio:side_position', {side: t(`common:${type.toLowerCase()}`)})}
                            tooltipContent={t('portfolio:side_position_tooltip', {side: t(`common:${type.toLowerCase()}`)})}
                            tooltipId={`${type}_position_tooltip`}
                        />
                    }
                    labelClassname="text-base font-semibold"
                    setIsOpen={setIsOpen}
                >
                    <div>
                        <div className="mt-6 md:mt-12 mb-6 text-lg md:text-2xl font-semibold">
                            {t(`common:position:sum_${type.toLowerCase()}`)}: {isNeverTrade ? '-' : total}
                        </div>

                        {isNeverTrade || isNaN(percentClipPath) ? (
                            <div className="w-full h-2 bg-bgBtnV2-disabled dark:bg-dark-6" />
                        ) : percentClipPath === 100 ? (
                            <>
                                <div className="w-full h-2 bg-red-2" data-for={`${type}_loss_tooltip`} onClick={() => setShowDetails(true)} />
                            </>
                        ) : percentClipPath === 0 ? (
                            <>
                                <div className="w-full h-2 bg-green-3 dark:bg-green-2" onClick={() => setShowDetails(true)} />
                            </>
                        ) : (
                            <div className="w-full h-2 relative" onClick={() => setShowDetails(true)}>
                                <div
                                    style={{
                                        clipPath: `polygon(0 0,${percentClipPath}% 0, ${percentClipPath - deltaClipPath}% 100%, 0% 100%)`
                                    }}
                                    className="h-full bg-red-2 w-full absolute right-0"
                                />
                                <div
                                    style={{
                                        clipPath: `polygon(${percentClipPath + deltaClipPath}% 0, 100% 0, 100% 100%, ${percentClipPath}% 100%)`
                                    }}
                                    className="h-full bg-green-3 dark:bg-green-2 w-full absolute left-0"
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between mt-2 md:mt-3 py-1.5 txtSecond-5">
                            <div>{t('portfolio:total_loss')}: {isNeverTrade ? '-' : `${formatNanNumber((totalLossPosition / total) * 100, 2)}%`}</div>
                            <div>{t('portfolio:total_profit')}: {isNeverTrade ? '-' : `${formatNanNumber((totalProfitPosition / total) * 100, 2)}%`}</div>
                        </div>
                    </div>
                </CollapseV2>
            ) : (
                <>
                    <HeaderTooltip
                        isMobile
                        title={t('portfolio:side_position', {side: t(`common:${type.toLowerCase()}`)})}
                        tooltipContent={t('portfolio:side_position_tooltip', {side: t(`common:${type.toLowerCase()}`)})}
                        tooltipId={`${type}_position_tooltip`}
                    />
                    <div className="mt-6 md:mt-12 mb-6 text-lg md:text-2xl font-semibold">
                        {t(`common:position:sum_${type.toLowerCase()}`)}: {isNeverTrade ? '-' : total}
                    </div>

                    {isNeverTrade || isNaN(percentClipPath) ? (
                        <div className="w-full h-2 bg-bgBtnV2-disabled dark:bg-dark-6" />
                    ) : percentClipPath === 100 ? (
                        <>
                            <div className="w-full h-2 bg-red-2" data-for={`${type}_loss_tooltip`} data-tip="" />
                            <TooltipLoss totalLoss={totalLoss} totalLossPosition={totalLossPosition} isVndc={isVndc} type={type} t={t} />
                        </>
                    ) : percentClipPath === 0 ? (
                        <>
                            <div className="w-full h-2 bg-green-3 dark:bg-green-2" data-for={`${type}_profit_tooltip`} data-tip="" />
                            <TooltipProfit totalProfit={totalProfit} totalProfitPosition={totalProfitPosition} isVndc={isVndc} type={type} t={t} />
                        </>
                    ) : (
                        <div className="w-full h-2 relative" id={`${type}_bar`}>
                            <div
                                style={{
                                    clipPath: `polygon(0 0,${percentClipPath}% 0, ${percentClipPath - deltaClipPath}% 100%, 0% 100%)`
                                }}
                                className="h-full bg-red-2 w-full absolute right-0"
                                data-for={`${type}_loss_tooltip`}
                                data-tip=""
                            />
                            <div
                                style={{
                                    clipPath: `polygon(${percentClipPath + deltaClipPath}% 0, 100% 0, 100% 100%, ${percentClipPath}% 100%)`
                                }}
                                className="h-full bg-green-3 dark:bg-green-2 w-full absolute left-0"
                                data-for={`${type}_profit_tooltip`}
                                data-tip=""
                            />
                            <TooltipLoss
                                overridePosition={(e) => {
                                    var element = document.getElementById(`${type}_bar`);
                                    var positionInfo = element.getBoundingClientRect();
                                    var width = positionInfo.width;
                                    var widthLoss = (width * percentClipPath) / 100;
                                    var widthProfit = width - widthLoss;
                                    let delta;
                                    if (percentClipPath < 50) {
                                        delta = widthLoss / 2 + (widthProfit - width / 2);
                                    } else {
                                        delta = width / 2 - widthLoss / 2;
                                    }
                                    return {
                                        left: e.left - delta,
                                        top: e.top
                                    };
                                }}
                                totalLoss={totalLoss}
                                totalLossPosition={totalLossPosition}
                                isVndc={isVndc}
                                type={type}
                                t={t}
                            />
                            <TooltipProfit
                                overridePosition={(e) => {
                                    var element = document.getElementById(`${type}_bar`);
                                    var positionInfo = element.getBoundingClientRect();
                                    var width = positionInfo.width;
                                    var widthLoss = (width * percentClipPath) / 100;
                                    var widthProfit = width - widthLoss;
                                    let delta;
                                    if (percentClipPath < 50) {
                                        delta = width / 2 - widthProfit / 2;
                                    } else {
                                        delta = widthProfit / 2 + (widthLoss - width / 2);
                                    }
                                    return {
                                        left: e.left + delta,
                                        top: e.top
                                    };
                                }}
                                totalProfit={totalProfit}
                                totalProfitPosition={totalProfitPosition}
                                isVndc={isVndc}
                                type={type}
                                t={t}
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-2 md:mt-3 py-1.5 txtSecond-5">
                        <div>{t('portfolio:total_loss')}: {isNeverTrade ? '-' : `${formatNanNumber((totalLossPosition / total) * 100, 2)}%`}</div>
                        <div>{t('portfolio:total_profit')}: {isNeverTrade ? '-' : `${formatNanNumber((totalProfitPosition / total) * 100, 2)}%`}</div>
                    </div>
                </>
            )}
            <ModalV2 isVisible={showDetails} onBackdropCb={() => setShowDetails(false)} wrapClassName="px-6" className="dark:bg-dark" isMobile={true}>
                <div className="text-gray-15 dark:text-gray-4 text-sm font-semibold">
                    <h1 className="text-xl">{t('portfolio:position_statistic_by_side', {side: t(`common:${type}`)})}</h1>
                    <span className="txtSecond-5 mt-2">{`Tổng lệnh ${type}: ${total} lệnh`}</span>

                    <h1 className="my-6 text-base font-semibold">{t('portfolio:total_loss')}</h1>
                    <MCard addClass={'!p-4'}>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-3">{t('common:amount')}</span>
                            <span>{formatNumber(totalLossPosition, 0)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <span className="txtSecond-3">{t('portfolio:total_loss')}</span>
                            <span className={totalLoss < 0 && 'text-red-2'}>{formatNanNumber(totalLoss, isVndc ? 0 : 4)}</span>
                        </div>
                    </MCard>

                    <h1 className="mt-8 mb-6 text-base">{t('portfolio:total_profit')}</h1>
                    <MCard addClass={'!p-4'}>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-3">{t('common:amount')}</span>
                            <span>{formatNumber(totalProfitPosition, 0)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <span className="txtSecond-3">{t('portfolio:total_profit')}</span>
                            <span className={totalProfit > 0 && 'text-green-3 dark:text-green-2'}>+{formatNanNumber(totalProfit, isVndc ? 0 : 4)}</span>
                        </div>
                    </MCard>
                </div>
            </ModalV2>
        </div>
    );
};

export default PositionInfo;
