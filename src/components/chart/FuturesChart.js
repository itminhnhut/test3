import dynamic from 'next/dynamic';
import useDarkMode from 'hooks/useDarkMode';
import { ChartMode } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { FuturesSettings } from 'redux/reducers/futures';
const FuturesChart = dynamic(() => import('src/components/TVChartContainer/').then((mod) => mod.TVChartContainer), { ssr: false });

export default (props) => {
    const [currentTheme] = useDarkMode();
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const settings = useSelector((state) => state.futures.settings);
    const [chartKey, setChartKey] = useState('nami-spot-chart');
    const isShowSlTPLine = settings?.user_setting?.[FuturesSettings.show_sl_tp_order_line] ?? true;

    return (
        <FuturesChart
            {...props}
            key={chartKey}
            reNewComponentKey={() => setChartKey(Math.random().toString())}
            theme={currentTheme}
            mode={ChartMode.FUTURES}
            exchangeConfig={exchangeConfig}
            isShowSlTPLine={isShowSlTPLine}
        />
    );
};
