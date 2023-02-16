import dynamic from 'next/dynamic';
import useDarkMode from 'hooks/useDarkMode';
import { ChartMode } from 'redux/actions/const';
import { useSelector } from 'react-redux';

const FuturesChart = dynamic(() => import('src/components/TVChartContainer/').then((mod) => mod.TVChartContainer), { ssr: false });

export default (props) => {
    const [currentTheme] = useDarkMode();
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    return <FuturesChart {...props} theme={currentTheme} mode={ChartMode.FUTURES} exchangeConfig={exchangeConfig} />;
};
