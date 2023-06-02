import Chart from 'components/chart/FuturesChart';
import { useTranslation } from 'next-i18next';

const FuturesChart = ({ pair, initTimeFrame, isVndcFutures, ordersList, chartKey, ...props }) => {
    const { t } = useTranslation();
    if (!pair) return null;
    return (
        <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark h-full dragHandleArea">
            <div className="spot-chart h-full flex flex-col">
                <Chart t={t} chartKey={chartKey} symbol={pair} initTimeFrame={initTimeFrame} ordersList={ordersList} isVndcFutures={isVndcFutures} {...props} />
            </div>
        </div>
    );
};

export default FuturesChart;
