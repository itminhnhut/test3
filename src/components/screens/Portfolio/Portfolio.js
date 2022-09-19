import React from 'react'
import { useState } from 'react'
import Button from '../../common/Button'
import ExchangePortfolio from './ExchangePortfolio'
import FuturePortfolio from './FuturePortfolio'
import {
    ComponentTabWrapper,
    ComponentTabItem,
    ComponentTabUnderline
} from './styledPortfolio'
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const Portfolio = () => {
    const [type, setType] = useState(1)
    const [currency, setCurrency] = useState('USDT')

    const mainTabs = [
        {
            content: 'Futures Portfolio',
            value: 1
        },
        {
            content: 'Exchange Portfolio',
            value: 2
        },
    ]

    const renderHeader = () => {
        return (
            <div className='w-full h-fit flex justify-between mt-6 mb-8'>
                <div className='text-2xl leading-10 font-semibold'>
                    Nami Future Portfolio
                </div>
                <div className='flex h-9'>
                    <Button
                        className="px-4 py-[6px] mr-3"
                        onClick={() => setCurrency(currency === 'USDT' ? 'VNDC' : 'USDT')}
                        title='VNDC'
                        type={currency === 'VNDC' && 'primary'}
                        style={currency !== 'VNDC' && { color: '#718096' }}
                        componentType='button'
                    />
                    <Button
                        className="px-4 py-[6px]"
                        onClick={() => setCurrency(currency === 'USDT' ? 'VNDC' : 'USDT')}
                        title='USDT'
                        type={currency === 'USDT' && 'primary'}
                        style={currency !== 'USDT' && { color: '#718096' }}
                        componentType='button'
                    />
                </div>
            </div>
        )
    }

    const renderContent = () => {
        return type === 1 ? (
            <FuturePortfolio currency={currency} />
        ) : (
            // <ExchangePortfolio />
            <div>
                Coming soon...
            </div>
        )
    }

    return (
        <div className='w-full h-full px-5 py-8 text-darkBlue'>
            {renderTabs(mainTabs, type, setType)}
            {renderHeader()}
            {renderContent()}
        </div>
    )
}

export default Portfolio

export const renderTabs = (tabs, tabType, setTabType, haveUnderline = true) => {
    return (
        <ComponentTabWrapper haveUnderline={haveUnderline}>
            {tabs.map(tab =>
                <div>
                    <ComponentTabItem active={tabType === tab.value} onClick={() => setTabType(tab.value)}>
                        {tab.content}
                        {tabType === tab.value && <ComponentTabUnderline></ComponentTabUnderline>}
                    </ComponentTabItem>
                </div>
            )}
        </ComponentTabWrapper>
    )
}

export const renderApexChart = (data, { height = '100%', width = '100%' }) => <Chart options={data.options} series={data.series} type={data.type} height={height} width={width} />