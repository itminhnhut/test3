import React, { memo, useMemo, useState, useEffect } from 'react';
import useDarkMode from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ChartMode } from 'redux/actions/const';
import { IconRefresh } from 'components/common/Icons';
import colors from 'styles/colors';
import { useRef } from 'react';

const MobileTradingView = dynamic(
    () => import('components/TVChartContainer/MobileTradingView/').then(mod => mod.MobileTradingView),
    { ssr: false },
);

const ChartMobile = memo(({
    pairConfig,
    isVndcFutures,
    setCollapse,
    collapse,
    forceRender,
    isFullScreen,
    decimals
}) => {
    const [chartKey, setChartKey] = useState('nami-mobile-chart');
    const [themeMode] = useDarkMode();
    const { t } = useTranslation();
    const [fullChart, setFullChart] = useState(false);
    const refChart = useRef(null);

    const style = useMemo(() => {
        if (fullChart) return { height: '100vw' };
        if (typeof window !== 'undefined') {
            const vh = window.innerHeight * 0.01;
            return { height: !isFullScreen ? 400 : `calc(100% - 230px)` };
        } else {
            return { height: `calc(100% - 230px)` };
        }
    }, [isFullScreen, typeof window, fullChart]);

    useEffect(() => {
        const el = document.querySelector('#chart-mobile');
        const elFutures = document.querySelector('#futures-mobile');
        if (!el) return;
        if (fullChart) {
            el.classList.add('chart-full-screen')
            elFutures.classList.add('!overflow-hidden')
        } else {
            el.classList.remove('chart-full-screen')
            elFutures.classList.remove('!overflow-hidden')
        }
    }, [fullChart])

    return (
        <div id="chart-mobile" className={`spot-chart ${!fullChart ? 'max-w-full h-full' : ''}`} style={style}>
            <MobileTradingView
                refChart={ref => refChart.current = ref}
                t={t}
                key={chartKey}
                symbol={pairConfig?.symbol}
                pairConfig={pairConfig}
                initTimeFrame="15"
                isVndcFutures={isVndcFutures}
                theme={themeMode}
                mode={ChartMode.FUTURES}
                isFullScreen={isFullScreen}
                showIconGuide={!fullChart}
                styleChart={{ minHeight: `calc(100% - ${fullChart ? '56' : '90'}px)` }}
                reNewComponentKey={() => setChartKey(Math.random()
                    .toString())} // Change component key will remount component
                fullChart={fullChart}
                setFullChart={setFullChart}
            />
            {fullChart &&
                <div className="absolute right-4 bottom-3" onClick={() => refChart.current.resetComponent()}>
                    <IconRefresh color={colors.onus.white} />
                </div>
            }
        </div>
    );
});

export default ChartMobile;
