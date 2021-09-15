import { formatPrice } from 'src/redux/actions/utils';
import { useEffect, useState } from 'react';
import Emitter from 'src/redux/actions/emitter';
import { PublicSocketEvent } from 'src/redux/actions/const';
import { useAsync } from 'react-use';
import { getSymbolString } from 'redux/actions/utils';
import { getMarketWatch } from 'redux/actions/market';
import { IconLoading } from 'components/common/Icons';
import { useRouter } from 'next/router';

const LastPrice = (props) => {
    const { symbol, colored, exchangeConfig } = props;
    const router = useRouter();

    const [symbolTicker, setSymbolTicker] = useState(null);
    const [loading, setLoading] = useState(true);

    useAsync(async () => {
        // Get symbol list
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

    if (!symbolTicker) return null;

    return (
        <>
            {
                // eslint-disable-next-line no-nested-ternary
                loading ? <div className="flex items-center justify-center w-full h-full"><IconLoading color="#09becf" /></div> :
                    colored
                        ? (
                            <div className={symbolTicker?.u ? 'text-mint' : 'text-pink'}>
                                {formatPrice(symbolTicker?.p, exchangeConfig, symbol?.base)}
                            </div>
                        )
                        : <div>{formatPrice(symbolTicker?.p, exchangeConfig, symbol?.base)}</div>
            }

        </>
    );
};

export default LastPrice;
