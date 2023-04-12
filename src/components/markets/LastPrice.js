import { formatPrice } from 'src/redux/actions/utils';
import { useEffect, useMemo, useState } from 'react';
import Emitter from 'src/redux/actions/emitter';
import { PublicSocketEvent } from 'src/redux/actions/const';
import { useAsync } from 'react-use';
import { getSymbolString, getDecimalPrice, getDecimalQty, formatNumber } from 'redux/actions/utils';
import { getMarketWatch } from 'redux/actions/market';
import { useRouter } from 'next/router';
import { PulseLoader } from 'react-spinners';
import colors from '../../styles/colors';
import { useSelector } from 'react-redux';

const LastPrice = (props) => {
    const { symbol, colored, exchangeConfig } = props;
    const router = useRouter();
    const [symbolTicker, setSymbolTicker] = useState(null);
    const [loading, setLoading] = useState(true);

    const decimals = useMemo(() => {
        const config = exchangeConfig.find((rs) => rs.symbol === `${symbol.base}${symbol.quote}`);
        return { price: getDecimalPrice(config) };
    }, [exchangeConfig, symbol]);

    useAsync(async () => {
        // Get symbol list
        setLoading(true);
        const result = await getMarketWatch(getSymbolString(symbol));
        if (result) {
            await setSymbolTicker(result?.[0]);
        }
        setLoading(false);
    }, [symbol]);

    const handleRouteChange = () => {
        setLoading(true);
    };

    useEffect(() => {
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            if (data?.s === `${symbol.base}${symbol.quote}`) {
                setLoading(false);
                setSymbolTicker(data);
            }
        });
        router.events.on('routeChangeStart', handleRouteChange);
        return function cleanup() {
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [Emitter, symbol]);

    return (
        <>
            {
                // eslint-disable-next-line no-nested-ternary
                loading ? (
                    <div style={props.styles ? { ...props.styles } : undefined} className={`flex items-center justify-center w-full h-full`}>
                        <PulseLoader size={3} color={colors.teal} />
                    </div>
                ) : colored ? (
                    <div style={props.styles ? { ...props.styles } : undefined} className={`${symbolTicker && symbolTicker?.u ? 'text-teal' : 'text-red'}`}>
                        {symbolTicker ? formatNumber(symbolTicker?.p, decimals.price) : '---'}
                    </div>
                ) : (
                    <div style={props.styles ? { ...props.styles } : undefined}>{symbolTicker ? formatNumber(symbolTicker?.p, decimals.price) : '---'}</div>
                )
            }
        </>
    );
};

export default LastPrice;
