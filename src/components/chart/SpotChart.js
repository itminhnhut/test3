import dynamic from 'next/dynamic';
import useDarkMode from 'hooks/useDarkMode';
import { ChartMode } from 'redux/actions/const';
import { useState } from 'react';

const SpotChart = dynamic(() => import('src/components/TVChartContainer/').then((mod) => mod.TVChartContainer), { ssr: false });

export default (props) => {
    const [currentTheme] = useDarkMode();
    const [chartKey, setChartKey] = useState('nami-spot-chart');
    return <SpotChart key={chartKey} reNewComponentKey={() => setChartKey(Math.random().toString())} {...props} theme={currentTheme} mode={ChartMode.SPOT} />;
};
