import Chart from 'components/chart/FuturesChart';
import { useTranslation } from 'next-i18next';

const FuturesChart = ({
    pair,
    initTimeFrame
}) => {
    const { t } = useTranslation();
    if (!pair) return null;
    return (
        <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark h-full dragHandleArea">
            <div className="spot-chart h-full flex flex-col">
                <Chart t={t} symbol={pair} initTimeFrame={initTimeFrame}/>
            </div>
        </div>
    );
};

export default FuturesChart;
