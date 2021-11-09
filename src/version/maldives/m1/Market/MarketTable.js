import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MCard from 'components/common/MCard'
import colors from 'styles/colors'
import ReTable from 'components/common/ReTable'
import Link from 'next/link'
import AssetLogo from 'components/wallet/AssetLogo'
import MarketLabel from 'components/common/MarketLabel'

import { memo, useCallback, useState } from 'react'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { initMarketWatchItem } from 'utils'
import { formatPrice, render24hChange } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'
import { IconStarFilled } from 'components/common/Icons'
import { Search, X } from 'react-feather'
import { useWindowSize } from 'utils/customHooks'
import { LANGUAGE_TAG } from 'hooks/useLanguage'
import { EMPTY_VALUE } from 'constants/constants'
import { remove } from 'lodash'

const MarketTable = memo(({ loading, data, parentState, ...restProps }) => {

    // Use Hooks
    const { t, i18n: { language } } = useTranslation(['common', 'table'])
    const [currentTheme] = useDarkMode()
    const { width } = useWindowSize()

    // Render Handler
    const renderTab = useCallback(() => {
        return tab.map((item, index) => {
            const style = {
                color: restProps.tabIndex === index ? currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4
                    : currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5,
                fontWeight: restProps.tabIndex === index ? 600 : 500,
            }
            return (
                <div key={item.key}
                     onClick={() => parentState({ tabIndex: index })}
                     style={{ ...style }}
                     className="relative mr-12 pb-4 capitalize select-none font-medium cursor-pointer flex items-center">
                    {item.key === 'favorite' && <IconStarFilled size={16} color={colors.yellow}/>}
                    <span className={item.key === 'favorite' ? 'ml-2' : ''}>{item.localized ? t(item.localized) : item.key}</span>
                    {restProps.tabIndex === index && <div className="absolute left-1/2 bottom-0 w-[40px] h-[1px] bg-dominant -translate-x-1/2"/>}
                </div>)
        })
    }, [currentTheme, restProps.tabIndex])

    const renderSubTab = useCallback(() => {
        return subTab.map((item, index) => {
            return (
                <div key={item.key}
                     onClick={() => parentState({ subTabIndex: index })}
                     className={restProps.subTabIndex === index ?
                        'text-[14px] font-medium px-3 py-1 mr-3 rounded-md bg-bgTabActive dark:bg-bgTabActive-dark text-textTabLabelActive cursor-pointer select-none'
                        : 'text-[14px] font-medium px-3 py-1 mr-3 rounded-md bg-bgTabInactive dark:bg-bgTabInactive-dark text-textTabLabelInactive dark:text-textTabLabelInactive-dark cursor-pointer select-none'}>
                    {item.localized ? t(item.localized) : <span className="uppercase">{item.key}</span>}
                </div>
            )
        })
    }, [restProps.subTabIndex])

    const renderTable = useCallback(() => {
        const modifyColumns = []
        const translater = (key) => {
            switch (key) {
                case 'pair':
                    return language === 'vi' ? 'Cặp' : 'Pair'
                case 'last_price':
                    return language === 'vi' ? 'Giá gần nhất' : 'Last Price'
                case 'change_24h':
                    return language === 'vi' ? 'Thay đổi 24h' : 'Change 24h'
                case 'market_cap':
                    return language === 'vi' ? 'Market Cap' : 'Market Cap'
                case 'volume_24h':
                    return language === 'vi' ? 'Khối lượng 24h' : 'Volume 24h'
                case '24h_high':
                    return language === 'vi' ? 'Cao nhất 24h' : '24h High'
                case '24h_low':
                    return language === 'vi' ? 'Thấp nhất 24h' : '24h Low'
                default:
                    return null
            }
        }
        columns.forEach(c => {
            let item = c
            if (c.key !== 'star' && c.key !== 'operation') {
                item = {...c, title: translater(c.key)}
            }
            modifyColumns.push(item)
        })

        // if (tab[restProps.tabIndex]?.key === 'favorite') {
        //     remove(modifyColumns, o => o.key === 'star')
        // }

        return (
            <ReTable sort
                     useRowHover
                     data={dataHandler(data, language, width)}
                     columns={modifyColumns}
                     rowKey={item => item?.key}
                     loading={loading}
                     scroll={{ x: true }}
                     tableStyle={{
                         paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                         tableStyle: { minWidth: '888px !important' },
                         headerStyle: {},
                         rowStyle: {},
                         // rowRadius: '12px',
                         shadowWithFixedCol: width < 1366
                     }}
            />
        )
    }, [data, width, language])

    return (
        <div className="market_table px-4 lg:px-0">
            <div style={{ backgroundColor: currentTheme === THEME_MODE.DARK ? '#071026' : '#FCFCFC' }}
                 className="py-[40px] px-[20px] h-full rounded-tr-[20px] rounded-tl-[20px]">
                <div className="flex flex-col justify-start md:justify-between md:flex-row md:items-center">
                    <div className="text-[26px] font-bold mb-4 md:mb-0">
                        {t('common:market')}
                    </div>
                    <div
                        className="flex items-center py-[10px] px-[18px] rounded-[6px] bg-get-grey4 dark:bg-get-darkBlue3 cursor-pointer">
                        <Search color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} size={20}/>
                        <input className="bg-transparent outline-none px-2"
                               value={restProps.search}
                               onChange={({target: { value }}) => parentState({search: value})}/>
                        <X className={restProps.search ? 'visible' : 'invisible'}
                           onClick={() => parentState({ search: '' })}
                           color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5}
                           size={20}/>
                    </div>
                </div>
                <div className="mt-[20px] flex items-center overflow-auto">
                    {renderTab()}
                </div>
                <MCard style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)' } : {}}
                       addClass="pt-5 pb-0 px-0 overflow-hidden">
                    <div className="flex items-center px-3 md:px-7">
                        {renderSubTab()}
                    </div>
                    <div className="mt-5">
                        {renderTable()}
                    </div>
                </MCard>
            </div>
        </div>
    )
})

const tab = [
    { key: 'favorite', localized: null },
    { key: 'exchange', localized: null },
    { key: 'futures', localized: null },
    { key: 'zones', localized: null }
]

const subTab = [
    { key: 'all', localized: 'common:all' },
    { key: 'usdt', localized: null },
    { key: 'vndc', localized: null }
]

const columns = [
    { key: 'star', dataIndex: 'star', title: '', fixed: 'left', align: 'left', width: 80 },
    { key: 'pair', dataIndex: 'pair', title: 'Coin', fixed: 'left', align: 'left', width: 168 },
    { key: 'last_price', dataIndex: 'last_price', title: 'Last Price', align: 'left', width: 168 },
    { key: 'change_24h', dataIndex: 'change_24h', title: 'Change 24h', align: 'right', width: 128 },
    { key: 'market_cap', dataIndex: 'market_cap', title: 'Market Cap', align: 'right', width: 168 },
    { key: 'volume_24h', dataIndex: 'volume_24h', title: 'Volume 24h', align: 'right', width: 168 },
    { key: '24h_high', dataIndex: '24h_high', title: '24h High', align: 'right', width: 128 },
    { key: '24h_low', dataIndex: '24h_low', title: '24h Low', align: 'right', width: 128 },
    { key: 'operation', dataIndex: 'operation', title: '', align: 'center', width: 128 }
]


const dataHandler = (arr, lang, w) => {
    if (!Array.isArray(arr) || !arr || !arr.length) return
    const result = []

    arr.slice(0, 20).forEach(item => {
        const {
            baseAsset, baseAssetId, quoteAsset, quoteAssetId,
            lastPrice, volume24h, high, low, supply, label
        } = initMarketWatchItem(item)

        result.push({
            key: `market_row___${baseAsset}_${quoteAsset}`,
            star: renderFavAction(`${baseAssetId}_${quoteAssetId}`),
            pair: renderPair(baseAsset, quoteAsset, label, w),
            last_price: <span className="whitespace-nowrap">{formatPrice(lastPrice)}</span>,
            change_24h: render24hChange(item),
            market_cap: renderMarketCap(lastPrice, supply),
            volume_24h: <span className="whitespace-nowrap">{formatPrice(volume24h)}</span>,
            '24h_high': <span className="whitespace-nowrap">{formatPrice(high)}</span>,
            '24h_low': <span className="whitespace-nowrap">{formatPrice(low)}</span>,
            operation: renderTradeLink(baseAsset, quoteAsset, lang)
        })
    })

    return result
}

const renderPair = (b, q, lbl, w) => {
    return (
        <div className="flex items-center">
            <AssetLogo assetCode={null} size={w >= 1024 ? 32 : 28}/>
            <div className="ml-3 whitespace-nowrap">
                <span className="font-bold">{b}</span>
                <span className="font-normal text-textSecondary dark:text-textSecondary-dark">/{q}</span>
            </div>
            <MarketLabel labelType={lbl}/>
        </div>
    )
}

const renderMarketCap = (price, supply) => {
    return '10,000,000'
}

const renderFavAction = (pairKey) => {
    return (
        <div className="flex items-center">
            <StarOutlined style={{ color: colors.grey3 }} size={24}/>
        </div>
    )
}

const renderTradeLink = (b, q, lang) => {
    return (
        <Link href={`/trade/${b}-${q}`}>
            <a className="text-dominant re_table__link">
                {lang === LANGUAGE_TAG.VI ? 'Giao dịch' : 'Trade'}
            </a>
        </Link>
    )
}

export default MarketTable
