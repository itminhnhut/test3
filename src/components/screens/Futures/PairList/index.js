import { memo, useCallback, useState } from 'react';
import { Search, X } from 'react-feather';
import { useSelector } from 'react-redux';

import FuturesPairListItems from './PairListItems';
import Star from 'components/svg/Star';
import colors from 'styles/colors';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';

const FuturesPairList = memo(({ mode, setMode, isAuth, activePairList, onSelectPair = null, className = '' }) => {
    const { t } = useTranslation();
    const [keyword, setKeyWord] = useState('');
    const [sortBy, setSortBy] = useState({}); // null = default, 1 => desc, 2 => asc
    const favoritePairs = useSelector((state) => state.futures.favoritePairs);
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;

    const pairConfigs = useSelector((state) => state.futures.pairConfigs);

    const onSort = (field, value) => setSortBy({ field, value });

    const renderPairListItems = useCallback(() => {
        let data =
            mode === ''
                ? pairConfigs
                : pairConfigs?.filter((i) => {
                      if (mode === 'Starred') return favoritePairs.find((rs) => rs.replace('_', '') === i.symbol);
                      return i.quoteAsset === mode;
                  });
        // sort by field
        if (Object.keys(sortBy)?.length) {
        }

        // filter keyword
        if (keyword) {
            data = data?.filter((o) => o?.pair?.toLowerCase().includes(keyword?.toLowerCase()));
        }

        return data?.map((pair) => {
            const isFavorite = favoritePairs.find((rs) => rs.replace('_', '') === pair.symbol);
            return (
                <FuturesPairListItems
                    key={`futures_pairListItems_${pair?.pair}`}
                    pairConfig={pair}
                    isDark={isDark}
                    isFavorite={isFavorite}
                    isAuth={isAuth}
                    onSelectPair={onSelectPair}
                />
            );
        });
    }, [pairConfigs, sortBy, keyword, mode, favoritePairs, isAuth]);

    const onHandleMode = (key) => {
        setMode(key !== mode ? key : '');
    };

    const renderModes = useCallback(
        () => (
            <div className="px-4 flex items-center">
                {isAuth && (
                    <Star
                        onClick={() => onHandleMode('Starred')}
                        size={14}
                        fill={mode === 'Starred' ? colors.yellow : isDark ? colors.darkBlue5 : colors.grey2}
                        className="cursor-pointer"
                    />
                )}
                <div
                    onClick={() => onHandleMode('USDT')}
                    className={classNames('ml-3 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark hover:text-dominant', {
                        '!text-dominant': mode === 'USDT'
                    })}
                >
                    USDT
                </div>
                <div
                    onClick={() => onHandleMode('VNDC')}
                    className={classNames('ml-3 font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark hover:text-dominant', {
                        '!text-dominant': mode === 'VNDC'
                    })}
                >
                    VNDC
                </div>
            </div>
        ),
        [mode, isDark, isAuth]
    );
    return (
        <div
            className={`${
                !activePairList ? 'hidden' : ''
            } py-4 min-w-[400px] bg-bgTabInactive dark:bg-bgTabInactive-dark dark:border border-divider dark:border-divider-dark drop-shadow-onlyLight rounded-md ${className}`}
        >
            <div className="max-h-[300px] flex flex-col">
                <div className="px-4 mb-7">
                    <div className="py-2 px-3 flex items-center rounded-md bg-gray-5 dark:bg-namiv2-gray">
                        <Search size={16} className="text-txtSecondary dark:text-txtSecondary-dark" />
                        <input
                            className="text-sm w-full px-2.5"
                            value={keyword}
                            onChange={(e) => setKeyWord(e.target?.value.trim())}
                            placeholder={t('common:search')}
                        />
                        {keyword && <X size={16} className="cursor-pointer" onClick={() => setKeyWord('')} />}
                    </div>
                </div>

                {renderModes()}

                <div
                    style={{
                        height: ORDERS_HEADER_HEIGHT
                    }}
                    className="px-4 mt-7 mb-5 flex items-center justify-between font-normal text-xs text-txtSecondary dark:text-txtSecondary-dark"
                >
                    <div style={{ flex: '1 1 0%' }} className="justify-start">
                        Contract
                    </div>
                    <div style={{ flex: '1 1 0%' }} className="justify-end text-right">
                        {t('common:last_price')}
                    </div>
                    <div style={{ flex: '1 1 0%' }} className="justify-end text-right">
                        {t('futures:24h_change')}
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">{renderPairListItems()}</div>
            </div>
        </div>
    );
});

const ORDERS_HEADER_HEIGHT = 20;

export default FuturesPairList;
