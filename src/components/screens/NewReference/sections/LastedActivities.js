import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import CollapsibleRefCard from '../CollapsibleRefCard'
import { formatNumber, formatTime } from 'redux/actions/utils';
import { Line } from '..';

const tags = [{
    value: 'receivedCommision',
    vi: 'Nhan hoa hong',
    en: 'Received Commision'
}, {
    value: 'lastedUser',
    vi: 'Nguoi dung moi nhat',
    en: 'Lasted user'
},]

const LastedActivities = () => {
    const { t, i18n: { language } } = useTranslation()
    const [tab, setTab] = useState(tags[0].value)

    const fakeData = [{
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    }, {
        userId: 'Nami112SHT1118',
        level: 1,
        date: Date.now(),
        type: 'Spot',
        profit: 84115,
        symbol: 'VNDC'
    },]

    const renderData = () => {
        return fakeData.map((data, index) =>
            <>
                <div className='flex flex-col gap-1'>
                    <div className='flex w-full justify-between items-center font-semibold text-sm leading-6'>
                        <div>
                            {data.userId} (cấp {data.level < 10 ? 0 : null}{data.level})
                        </div>
                        <div className='text-teal'>
                            +{formatNumber(data.profit, data.symbol.includes('VNDC') ? 2 : 4)} {data.symbol}
                        </div>
                    </div>
                    <div className='flex w-full justify-between items-center text-gray-1 font-medium text-xs leading-[14px]'>
                        <div>
                            {formatTime(data.date, 'yyyy-MM-dd hh:mm:ss')}
                        </div>
                        <div>
                            Loại hoa hồng: {data.type}
                        </div>
                    </div>
                </div>
                {fakeData.length === index + 1 ? null : <Line className='my-4' />}
            </>
        )
    }

    return (
        <div className='px-4'>
            <CollapsibleRefCard title='Hoạt động mới nhất' >
                <div className='w-auto'>
                    <Tabs tab={tab} className='text-sm flex justify-start gap-7' >
                        {tags.map(e =>
                            <TabItem value={e.value} onClick={() => setTab(e.value)} className='w-auto justify-start !px-0'>
                                {e[language]}
                            </TabItem>
                        )}
                    </Tabs>
                    <div className='mt-6'>
                        {renderData()}
                    </div>
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

export default LastedActivities