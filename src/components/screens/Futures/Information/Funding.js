import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatNumber } from 'redux/actions/utils';
import { getMarketWatch } from 'redux/selectors';
import Countdown from 'react-countdown-now';
import { PublicSocketEvent } from 'redux/actions/const';
import Emitter from 'redux/actions/emitter';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import Tooltip from 'components/common/Tooltip';
import { useTranslation } from 'next-i18next';

const Funding = ({ pairPrice, symbol }) => {
    const ticker = pairPrice ? pairPrice : useSelector((state) => getMarketWatch(state, symbol));
    // if (ticker?.buyFundingRate) return '-/-';

    const formatFunding = (value) => {
        return `${formatNumber(value * 100, 4, 0, true)}%`;
    };
    return (
        <div>
            {formatFunding(ticker?.buyFundingRate)} / {formatFunding(ticker?.sellFundingRate)}
        </div>
    );
};

const FundingCountdown = ({ pairPrice, symbol, tooltip }) => {
    const { t } = useTranslation();
    const timesync = useSelector((state) => state.utils.timesync);
    const [ticker, setTicker] = useState(pairPrice);

    useEffect(() => {
        setTicker(pairPrice);
    }, [pairPrice]);

    useEffect(() => {
        if (pairPrice) return;
        Emitter.on(PublicSocketEvent.FUTURES_TICKER_UPDATE + symbol, async (data) => {
            if (data?.s && data?.p > 0) {
                const _pairPrice = FuturesMarketWatch.create(data);
                setTicker(_pairPrice);
            }
        });
    }, [symbol]);

    if (!ticker) return '-';
    return (
        <>
            {tooltip && (
                <Tooltip id={`funding_countdown_${symbol}`} place="bottom" effect="solid" isV3 className="max-w-[300px] whitespace-pre-wrap">
                    <div className="text-3 font-normal text-white leading-[18px]">{t('common:countdown_tooltip')}</div>
                </Tooltip>
            )}
            <Countdown
                now={() => (timesync ? timesync.now() : Date.now())}
                date={ticker?.fundingTime}
                renderer={({ hours, minutes, seconds }) => {
                    return (
                        <span>
                            {hours}:{minutes}:{seconds}
                        </span>
                    );
                }}
            />
        </>
    );
};

Funding.Countdown = FundingCountdown;
export default Funding;
