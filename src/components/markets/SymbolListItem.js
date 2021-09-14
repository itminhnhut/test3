import { useEffect, useState } from 'react';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import { formatPrice, render24hChange } from 'src/redux/actions/utils';
import { setUserSymbolList } from 'actions/market';
import { IconStar, IconStarFilled } from '../common/Icons';

const SymbolListItem = (props) => {
    const { symbolString, publicSocket, exchangeConfig, originTicker, currentId, favorite, changeSymbolList, watchList } = props;
    const [symbolTicker, setSymbolTicker] = useState(null);
    const [favoriteId, setFavoriteId] = useState('');

    useEffect(() => {
        if (watchList && watchList.length) {
            setFavoriteId(watchList.filter(list => list.type === 'FAVORITE')?.[0]?.id);
        }
        if (originTicker) {
            setSymbolTicker(originTicker);
        }
    }, []);

    const handleSetFavorite = async (symbol) => {
        let newFavoriteList = [];

        if (favorite && favorite.length) {
            const isFav = favorite.includes(symbol);
            if (!isFav) {
                newFavoriteList = await [...favorite, symbol];
            } else {
                newFavoriteList = await favorite.filter(item => item !== symbol);
            }
        } else {
            newFavoriteList.push(symbol);
        }
        changeSymbolList(newFavoriteList);
        return setUserSymbolList(favoriteId, newFavoriteList);
    };

    const listenerHandler = debounce((data) => {
        setSymbolTicker(data);
    }, 1000);

    useEffect(() => {
        if (publicSocket && symbolString) {
            const event = `spot:mini_ticker:update:${symbolString}`;
            publicSocket.removeListener(event, listenerHandler);
            publicSocket.on(event, listenerHandler);
        }
        return function cleanup() {
            const event = `spot:mini_ticker:update:${symbolString}`;
            if (publicSocket && symbolString) {
                publicSocket.removeListener(event, listenerHandler);
            }
        };
    }, [publicSocket, symbolString]);

    const base = symbolTicker?.b;
    const quote = symbolTicker?.q;
    const up = symbolTicker?.u;

    const isFavorite = favorite && favorite.length && favorite.includes(base);

    return (
        <div
            className={`px-3 py-1.5 flex items-center cursor-pointer hover:bg-blue-50 ${currentId === `${base}_${quote}` ? 'bg-black-200' : ' '}`}
        >
            <div onClick={() => handleSetFavorite(base)} className="mr-1.5 cursor-pointer">
                {isFavorite ? <IconStarFilled /> : <IconStar />}
            </div>
            <Link href={`/spot/${base}_${quote}`} prefetch={false} shallow>
                <div className="flex items-center w-full">
                    <div
                        className="flex-1 text-xs font-semibold leading-table flex items-center truncate min-w-0 mr-1.5"
                    >
                        {base} <span className="text-black-500">/{quote}</span>
                    </div>
                    <div
                        className={`flex-1 text-xs font-semibold leading-table text-right mr-1.5 ${!up ? 'text-mint' : 'text-pink'}`}
                    >
                        {formatPrice(+symbolTicker?.p, exchangeConfig, quote)}
                    </div>
                    <div
                        className="flex-1 text-mint font-semibold text-xs leading-table text-right"
                    >{render24hChange(symbolTicker)}
                    </div>
                </div>

            </Link>

        </div>
    );
};

export default SymbolListItem;
