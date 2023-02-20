import SpotChart from 'src/components/chart/SpotChart';
import { useTranslation } from 'next-i18next';

const Chart = (props) => {
    const {
        symbol,
        isOnSidebar,
        favorite,
        watchList,
        changeSymbolList,
        chartSize,
        parentCallback,
        initTimeFrame,
        extendsIndicators,
        clearExtendsIndicators,
        isPro,
        chartKey
    } = props;
    const { t } = useTranslation();
    if (!symbol) return null;
    return (
        <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark h-full">
            <div className="spot-chart h-full flex flex-col">
                <SpotChart
                    isOnSidebar={isOnSidebar}
                    symbol={`${symbol?.base}${symbol?.quote}`}
                    interval="60"
                    chartSize={chartSize}
                    t={t}
                    initTimeFrame={initTimeFrame}
                    extendsIndicators={extendsIndicators}
                    clearExtendsIndicators={clearExtendsIndicators}
                    changeSymbolList={changeSymbolList}
                    watchList={watchList}
                    favorite={favorite}
                    parentCallback={parentCallback}
                    isPro={isPro}
                    chartKey={chartKey}
                />
            </div>
        </div>
    );
};

export default Chart;
