import dynamic from 'next/dynamic';

const SpotChart = dynamic(
    () => import('src/components/TVChartContainer/').then(mod => mod.TVChartContainer),
    { ssr: false },
);

export default (props) => <SpotChart {...props} />;
