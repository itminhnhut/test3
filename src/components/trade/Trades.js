import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { formatPrice, formatTime, getSymbolString } from 'src/redux/actions/utils';
import { getRecentTrade } from 'src/redux/actions/market';
import { PublicSocketEvent } from 'src/redux/actions/const';
import { useAsync } from 'react-use';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { IconLoading } from 'components/common/Icons';

let temp = [];
const Trades = (props) => {
    const { publicSocket, symbol, layoutConfig } = props;
    const router = useRouter();
    const [recentTrade, setRecentTrade] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('common');
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);

    const [height, setHeight] = useState(0);
    const ref = useRef(null);
    // const MAX_LENGTH = Math.floor((layoutHeight - 6) * 17.8 / 26);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref.current, layoutConfig?.h]);

    const MAX_LENGTH = Math.round((height - 122) / 26);

    const fetchRecentTrade = async () => {
        const newRecentTrade = await getRecentTrade(getSymbolString(symbol));
        temp = newRecentTrade || [];
        temp = temp.slice(0, MAX_LENGTH);
        setRecentTrade(temp);
        setLoading(false);
    };

    useEffect(() => {
        fetchRecentTrade();
    }, [symbol, MAX_LENGTH]);

    const handleRouteChange = () => {
        setLoading(true);
    };

    const updateRecent = (data) => {
        if (data?.s === `${symbol.base}${symbol.quote}`) {
            setLoading(false);
            temp.unshift(data);
            temp = temp.slice(0, MAX_LENGTH);
            setRecentTrade(temp);
        }
    };

    useEffect(() => {
        if (publicSocket) {
            publicSocket.emit('subscribe:recent_trade', getSymbolString(symbol));
            publicSocket.removeListener(PublicSocketEvent.SPOT_RECENT_TRADE_ADD, updateRecent);
            publicSocket.on(PublicSocketEvent.SPOT_RECENT_TRADE_ADD, updateRecent);
        }
        router.events.on('routeChangeStart', handleRouteChange);
        return function cleanup() {
            if (publicSocket) {
                publicSocket.removeListener(PublicSocketEvent.SPOT_RECENT_TRADE_ADD, updateRecent);
                router.events.off('routeChangeStart', handleRouteChange);
            }
        };
    }, [publicSocket, MAX_LENGTH, symbol]);

    return (
        <div className="h-full bg-bgContainer dark:bg-bgContainer-dark pb-6 row-span-1 h-full" ref={ref}>
            <h3 className="font-semibold border-b border-divider dark:border-divider-dark text-txtPrimary dark:text-txtPrimary-dark pt-3 pb-2 mb-2 px-3 dragHandleArea">{t('trades')}</h3>
            <div className="ats-tbheader px-3">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex flex-1 justify-start text-txtSecondary dark:text-txtSecondary-dark text-xs font-medium">{t('common:price')}</div>
                    <div className="flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs font-medium">{t('common:quantity')}</div>
                    <div className="flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xs font-medium">{t('common:time')}</div>
                </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100%-12px)]">
                {loading ? <div className="flex items-center justify-center w-full h-full"><IconLoading color="#09becf" /></div> : (recentTrade && recentTrade.map((trade, index) => {
                    const {
                        S: side,
                        // s,
                        p: price,
                        q: quantity,
                        // Q: quoteQuantity,
                        t: timestamp,
                    } = trade;
                        // const [p, q] = order;
                    return (
                        <div className="flex py-1 px-3 cursor-pointer hover:bg-teal-50 dark:hover:bg-darkBlue-3" key={index}>
                            <div className={'flex-1 text-xs font-semibold leading-table ' + ((side === 'SELL') ? 'text-pink' : 'text-mint')}>{formatPrice(price, exchangeConfig, symbol?.quote)}</div>
                            <div className="flex-1 text-txtPrimary dark:text-txtPrimary-dark font-semibold text-xs leading-table text-right">{formatPrice(quantity, exchangeConfig, symbol?.base)}</div>
                            <div className="flex-1 text-txtPrimary dark:text-txtPrimary-dark font-semibold text-xs leading-table text-right">{formatTime(timestamp, 'HH:mm:ss')}</div>
                        </div>);
                }))}
            </div>
        </div>
    );
};

export default Trades;
