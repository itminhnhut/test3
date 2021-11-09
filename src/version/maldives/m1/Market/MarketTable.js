import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MCard from 'components/common/MCard'
import colors from 'styles/colors'

import { memo, useCallback, useState } from 'react'
import { initMarketWatchItem, log } from 'utils'
import { render24hChange } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'
import { IconStarFilled } from 'components/common/Icons'
import { Search, X } from 'react-feather'

const MarketTable = memo(({ loading, data }) => {
    // * Init State
    const [state, set] = useState({
        tabIndex: 0,
        subTabIndex: 0,
        search: ''
    })
    const setState = (state) => set(prevState => ({ ...prevState, ...state }))

    // Use Hooks
    const { t } = useTranslation(['common'])
    const [currentTheme] = useDarkMode()

    // Render Handler
    const renderTab = useCallback(() => {
        return tab.map((item, index) => {
            const style = {
                color: state.tabIndex === index ? currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4
                    : currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5,
                fontWeight: state.tabIndex === index ? 600 : 500,
            }
            return (
                <div key={item.key}
                     onClick={() => setState({ tabIndex: index })}
                     style={{ ...style }}
                     className="relative mr-12 pb-4 capitalize select-none font-medium cursor-pointer flex items-center">
                    {item.key === 'favorite' && <IconStarFilled size={16} color={colors.yellow}/>}
                    <span className={item.key === 'favorite' ? 'ml-2' : ''}>{item.localized ? t(item.localized) : item.key}</span>
                    {state.tabIndex === index && <div className="absolute left-1/2 bottom-0 w-[40px] h-[1px] bg-dominant -translate-x-1/2"/>}
                </div>)
        })
    }, [currentTheme, state.tabIndex])

    const renderSubTab = useCallback(() => {
        return subTab.map((item, index) => {
            return (
                <div
                    onClick={() => setState({ subTabIndex: index })}
                    className={state.subTabIndex === index ?
                        'text-[14px] font-medium px-4 py-2 mr-3 rounded-xl bg-bgTabActive text-textTabLabelActive cursor-pointer select-none'
                        : 'text-[14px] font-medium px-4 py-2 mr-3 rounded-xl bg-bgTabInactive text-textTabLabelInactive cursor-pointer select-none'}>
                    {item.localized ? t(item.localized) : <span className="uppercase">{item.key}</span>}
                </div>
            )
        })
    }, [state.subTabIndex])

    const renderTable = useCallback(() => {
        const d = dataHandler(data)
        return <div>Table</div>
    }, [data])

    return (
        <div className="market_table px-4 lg:px-0">
            <div style={{ backgroundColor: currentTheme === THEME_MODE.DARK ? '#071026' : '#FCFCFC' }}
                 className="py-[40px] px-[20px] h-full rounded-tr-[20px] rounded-tl-[20px]">
                <div className="flex items-center justify-between">
                    <div className="text-[26px] font-bold">
                        {t('common:market')}
                    </div>
                    <div
                        className="flex items-center py-[10px] px-[18px] rounded-[6px] bg-get-grey4 dark:bg-get-darkBlue3 cursor-pointer">
                        <Search color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} size={20}/>
                        <input className="bg-transparent outline-none px-2"
                               value={state.search}
                               onChange={({target: { value }}) => setState({search: value})}/>
                        <X className={state.search ? 'visible' : 'invisible'}
                           onClick={() => setState({ search: '' })}
                           color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5}
                           size={20}/>
                    </div>
                </div>
                <div className="mt-[20px] flex items-center">
                    {renderTab()}
                </div>
                <MCard style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)' } : {}}
                       addClass="px-7 py-5">
                    <div className="flex items-center">
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

const column = [
    { label: 'Coin', title: 'coin' },
    { label: 'Last Price', title: 'last_price', className: 'testClass' },
    { label: 'Change 24h', title: 'change_24h' },
    { label: 'Market Cap', title: 'market_cap' },
    { label: 'Volume 24h', title: 'volume_24h' },
    { label: '24h High', title: '24h_high' },
    { label: '24h Low', title: '24h_low' }
]

const dataHandler = (arr) => {
    if (!Array.isArray(arr) || !arr || !arr.length) return
    const result = []

    arr.slice(0, 10).forEach(item => {
        const { baseAsset, quoteAsset, lastPrice, volume24h, high, low } = initMarketWatchItem(item)
        result.push({
            coin: `${baseAsset}/${quoteAsset}`,
            last_price: lastPrice,
            change_24h: render24hChange(item),
            market_cap: null,
            volume24h,
            '24h_high': high,
            '24h_low': low
        })
    })

    return result
}

export default MarketTable
