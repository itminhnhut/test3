import { IconLoading } from 'src/components/common/Icons';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState,useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PublicSocketEvent } from 'src/redux/actions/const';
import { getRecentTrade } from 'src/redux/actions/market';
import { formatNumber, formatTime, getSymbolString, getDecimalPrice, getDecimalQty } from 'src/redux/actions/utils';

let temp = [];
const Trades = (props) => {
    const { publicSocket, symbol, layoutConfig, isPro } = props;
    const router = useRouter();
    const [recentTrade, setRecentTrade] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('common');
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const { base, quote } = symbol;

    const [height, setHeight] = useState(0);
    const ref = useRef(null);
    // const MAX_LENGTH = Math.floor((layoutHeight - 6) * 17.8 / 26);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref.current, layoutConfig?.h]);

    const MAX_LENGTH = Math.round((height - 80) / 20);

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

    const decimals = useMemo(() => {
        const config = exchangeConfig.find((rs) => rs.symbol === `${symbol.base}${symbol.quote}`);
        return { price: getDecimalPrice(config), qty: getDecimalQty(config) };
    }, [exchangeConfig, symbol]);

    return (
        <div className={`p-4 ${isPro ? '' : 'pr-6'} bg-bgSpotContainer dark:bg-bgSpotContainer-dark row-span-1 h-[95%] overflow-hidden`} ref={ref}>
            <h3 className="font-semibold text-sm mb-4 text-txtPrimary dark:text-txtPrimary-dark dragHandleArea">{t('trades')}</h3>
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-1 justify-start text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium">
                    {t('common:price')} ({quote})
                </div>
                <div className="flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium">
                    {t('common:quantity')} ({base})
                </div>
                <div className="flex flex-1 justify-end text-txtSecondary dark:text-txtSecondary-dark text-xxs font-medium">{t('common:time')}</div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100%-12px)]">
                {loading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <IconLoading color="#0c0e14" />
                    </div>
                ) : (
                    recentTrade &&
                    recentTrade.map((trade, index) => {
                        const {
                            S: side,
                            // s,
                            p: price,
                            q: quantity,
                            // Q: quoteQuantity,
                            t: timestamp
                        } = trade;
                        // const [p, q] = order;
                        return (
                            <div className="flex py-[1px]  cursor-pointer hover:bg-teal-lightTeal dark:hover:bg-darkBlue-3" key={index}>
                                <div className={'flex-1 text-xs font-medium leading-table ' + (side === 'SELL' ? 'text-red' : 'text-teal')}>
                                    {formatNumber(price, decimals.price)}
                                </div>
                                <div className="flex-1 text-txtPrimary dark:text-txtPrimary-dark font-medium text-xs leading-table text-right">
                                    {formatNumber(quantity, decimals.qty)}
                                </div>
                                <div className="flex-1 text-txtPrimary dark:text-txtPrimary-dark font-medium text-xs leading-table text-right">
                                    {formatTime(timestamp, 'HH:mm:ss')}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Trades;
