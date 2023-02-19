import { memo, useCallback, useState, useEffect } from 'react';
import { Search, X } from 'react-feather';
import { useSelector } from 'react-redux';

import FuturesPairListItems from './PairListItems';
import FuturesPairListItemV2 from './PairListItemV2';
import Star from 'components/svg/Star';
import { BxsStarIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { orderBy, pick } from 'lodash';
import SearchBoxV2 from 'components/common/SearchBoxV2';

const FuturesPairList = memo(({ mode, setMode, isAuth, activePairList, onSelectPair = null, className = '' }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const favoritePairs = useSelector((state) => state.futures.favoritePairs);
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;

    const pairConfigs = useSelector((state) => state.futures.pairConfigs);

    // Sort function:
    const [sortBy, setSortBy] = useState({}); // undefined = default, true => desc, false => asc
    // const [pairTicker, setPairTicker] = useState(null);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const [dataTable, setDataTable] = useState([]);
    useEffect(() => {
        let data =
            mode === ''
                ? pairConfigs
                : pairConfigs?.filter((i) => {
                      if (mode === 'Starred') return favoritePairs.find((rs) => rs.replace('_', '') === i.symbol);
                      return i.quoteAsset === mode;
                  });

        data = data.map((item) => pick(item, ['pair', 'symbol', 'baseAsset', 'quoteAsset', 'pricePrecision']));

        data.forEach((item) => {
            const pairTicker = marketWatch[item?.pair]
            if(pairTicker){
                item?.lastPrice = pairTicker?.lastPrice
                item?.priceChangePercent = pairTicker?.priceChangePercent
            }
        });
         // sort by field
         if (Object.keys(sortBy)?.length) {
            const _s = Object.entries(sortBy)[0];
            if(_s[1] !== undefined) {
                data = orderBy(data, [(o) => {
                    const value =  o[`${_s[0]}`]
                    return value ? value : _s[1] ? 1000000 : -1000000} ], [`${_s[1] ? 'asc' : 'desc'}`]
                );
            }
        }

        // filter search
        if (search) {
            console.log("search: ", search);
            const _search = search?.replace('/', '').toLowerCase();
            data = data?.filter((o) => o?.pair?.toLowerCase().includes(_search));
        }

        setDataTable(data);
    }, [mode, favoritePairs, pairConfigs, marketWatch, sortBy, search]);
    
    // End sort function,
    const renderPairListItemsV2 = useCallback(() => {
        return dataTable?.map((pair) => {
            const isFavorite = favoritePairs.find((rs) => rs.replace('_', '') === pair.symbol);
            return (
                <FuturesPairListItemV2
                    key={`futures_pairListItems_${pair?.pair}`}
                    pairConfig={pair}
                    isDark={isDark}
                    isFavorite={isFavorite}
                    isAuth={isAuth}
                    onSelectPair={onSelectPair}
                />
            );
        });
    }, [dataTable]);


    const onHandleMode = (key) => {
        setMode(key !== mode ? key : '');
    };

    const renderModes = useCallback(
        () => (
            <div className="px-4 flex items-center text-sm gap-3 text-txtSecondary dark:text-txtSecondary-dark hover:text-gray-15 dark:hover:text-gray-14 select-none">
                {isAuth && (
                    <BxsStarIcon
                        onClick={() => onHandleMode('Starred')}
                        fill={mode === 'Starred' ? colors.yellow[2] : isDark ? colors.gray[7] : colors.gray[1]}
                        className="cursor-pointer"
                    />
                )}
                <div
                    onClick={() => onHandleMode('USDT')}
                    className={mode === 'USDT' && 'text-green-3 font-semibold'}
                >
                    USDT
                </div>
                <div
                    onClick={() => onHandleMode('VNDC')}
                    className={mode === 'VNDC' && 'text-green-3 font-semibold'}
                >
                    VNDC
                </div>
            </div>
        ),
        [mode, isDark, isAuth]
    );

    const setSorter = (key) => {
        setSortBy(prev => prev?.[key] === undefined ? { [key]:true } : prev?.[key] ? { [key]:false } : { [key]:undefined })
    }

    return (
        <div
            className={`${
                !activePairList ? 'hidden' : ''
            } py-4 min-w-[400px] border border-divider dark:border-divider-dark bg-white dark:bg-dark-4
            shadow-card_light dark:shadow-popover rounded-md ${className}`}
        >
            <div className="max-h-[352px] flex flex-col">
                <div className="px-4 mb-7">
                    <SearchBoxV2
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                        wrapperClassname='py-2'
                    />
                    {/* <div className="py-2 px-3 flex items-center rounded-md bg-gray-5 dark:bg-dark-2 border border-transparent focus-within:border-teal">
                        <Search size={16} className="text-txtSecondary dark:text-txtSecondary-dark" />
                        <input
                            className="text-sm w-full px-2.5 text-txtPrimary dark:text-txtPrimary-dark placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark"
                            value={search}
                            onChange={(e) => setSearch(e.target?.value.trim())}
                            placeholder={t('common:search')}
                        />
                        {search && <X size={16} className="cursor-pointer" color="#8694b2" onClick={() => setSearch('')} />}
                    </div> */}
                </div>

                {renderModes()}

                <div
                    style={{
                        height: ORDERS_HEADER_HEIGHT
                    }}
                    className="px-4 mt-7 mb-4 flex items-center justify-between font-normal text-xs text-txtSecondary dark:text-txtSecondary-dark"
                >
                    <div onClick={() =>setSorter('symbol') } style={{ flex: '1 1 0%' }} className="flex justify-start items-center select-none">
                        {t('common:asset')}
                        <Sorter isUp={sortBy?.[`symbol`]} />
                    </div>
                    <div onClick={() =>setSorter('lastPrice') } style={{ flex: '1 1 0%' }} className="flex justify-end items-center select-none">
                        {t('common:last_price')}
                        <Sorter isUp={sortBy?.[`lastPrice`]} />
                    </div>
                    <div onClick={() => setSorter('priceChangePercent')} style={{ flex: '1 1 0%' }} className="flex justify-end items-center select-none">
                    {t('futures:24h_change')}
                        <Sorter isUp={sortBy?.[`priceChangePercent`]} />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">{renderPairListItemsV2()}</div>
            </div>
        </div>
    );
});

const Sorter = ({ isUp }) => {
    let active;
    if (isUp === undefined) {
        active = 1;
    } else if (isUp) {
        active = 2;
    } else {
        active = 3;
    }
    return (
        <SorterWrapper>
            <CaretUpFilled style={active === 2 ? { color: colors.teal } : undefined} />
            <CaretDownFilled style={active === 3 ? { color: colors.teal } : undefined} />
        </SorterWrapper>
    );
};

const SorterWrapper = styled.span`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding-left: 10px;
    margin-top: -2px;

    span:first-child {
        transform: translateY(2px);
    }

    span {
        width: 7px;
        height: 7px;

        svg {
            width: 100%;
            height: auto;
        }
    }
`;

const ORDERS_HEADER_HEIGHT = 20;

export default FuturesPairList;
