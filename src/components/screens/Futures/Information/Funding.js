import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { convertSymbol, formatFundingRateV2 } from 'redux/actions/utils';
import { getMarketWatch } from 'redux/selectors';
import Countdown from 'react-countdown-now';
import Tooltip from 'components/common/Tooltip';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

const Funding = ({ pairPrice, symbol, className = '', buyClassName = '', sellClassName = '' }) => {
    const marketWatch = useSelector((state) => getMarketWatch(state, convertSymbol(symbol)));
    const ticker = pairPrice ?? marketWatch;
    const publicSocket = useSelector((state) => state.socket.publicSocket);

    useEffect(() => {
        if (!symbol || ticker || !publicSocket) return;
        const _symbol = convertSymbol(symbol);
        publicSocket.emit('subscribe:futures:ticker', _symbol);
    }, [publicSocket, symbol]);

    return (
        <div className={`flex items-center space-x-1 ${className}`}>
            <span className={classNames('text-teal', buyClassName)}>{formatFundingRateV2(ticker?.buyFundingRate)}</span>
            <span>/</span>
            <span className={classNames('text-red', sellClassName)}>{formatFundingRateV2(ticker?.sellFundingRate)}</span>
        </div>
    );
};

const FundingCountdown = ({ pairPrice, symbol, tooltip, className = '' }) => {
    const { t } = useTranslation();
    const marketWatch = useSelector((state) => getMarketWatch(state, convertSymbol(symbol)));
    const timesync = useSelector((state) => state.utils.timesync);
    const ticker = pairPrice ?? marketWatch;

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
                        <span className={className}>
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
