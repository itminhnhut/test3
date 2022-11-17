import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import CollapsibleRefCard from '../CollapsibleRefCard'
import { formatNumber, formatTime } from 'redux/actions/utils';
import colors from 'styles/colors';
import ChartJS from '../../Portfolio/charts/ChartJS';
import { FilterTabs } from '..';
import styledComponents from 'styled-components';

const tags = [{
    value: 'partners',
    vi: 'Số lượng đối tác',
    en: 'Partners'
}, {
    value: 'totalCommission',
    vi: 'Tổng hoa hồng',
    en: 'Total Commission'
},]
const timeTabs = [
    { title: '1 Ngày', value: 1 },
    { title: '1 Tuần', value: 2 },
    { title: '1 Tháng', value: 3 },
    { title: 'Tuỳ Chỉnh', value: 4 },
]
const title = {
    en: 'Chart',
    vi: 'Biểu đồ biến động'
}

const Chart = ({ id }) => {
    const { t, i18n: { language } } = useTranslation()
    const [tab, setTab] = useState(tags[0].value)
    const [timeTab, setTimeTab] = useState(timeTabs[0].value)
    const colors = ['#C0F9EE', '#b2ede3']

    const renderChart = () => {
        const labels = ['08/12', '09/12', '10/12', '12/12',]
        const data = {
            labels,
            datasets: [{
                type: 'bar',
                label: 'level1',
                data: [5, 6, 12, 5],
                backgroundColor: colors[0],
                borderColor: colors[0],
                maxBarThickness: 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 1
            }, {
                type: 'bar',
                label: 'level2',
                data: [6, 7, 10, 3],
                backgroundColor: colors[1],
                borderColor: colors[1],
                maxBarThickness: 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 2
            },]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ['hello']
                        },
                        labelTextColor: function (context) {
                            return colors.darkBlue
                        }
                    },
                    backgroundColor: colors.white,
                    titleColor: colors.grey2,
                    displayColors: false,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    // combined: true,
                },
            },
        }

        return (
            <>
                <ChartJS type='bar' data={data} options={options} height='400px' />
            </>
        )
    }

    return (
        <div className='px-4' id={id} >
            <CollapsibleRefCard title={title[language]} >
                <div className='w-auto'>
                    <Tabs tab={tab} className='text-sm flex justify-start gap-7' >
                        {tags.map((e, index) =>
                            <div key={index}>
                                <TabItem value={e.value} onClick={() => setTab(e.value)} className='w-auto justify-start !px-0'>
                                    {e[language]}
                                </TabItem>
                            </div>
                        )}
                    </Tabs>
                    <div className='mt-6'>
                        <div className='flex justify-start gap-1'>
                            <FilterTabs tabs={timeTabs} type={timeTab} setType={setTimeTab} />
                        </div>
                        <div className='h-100 mt-4'>
                            {renderChart()}
                        </div>
                        <div className='px-2 mt-4' style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 200px)'
                        }}>
                            {colors.map((color, index) => (
                                <div className='flex items-center gap-2 leading-5 text-xs font-medium text-gray-1' key={index}>
                                    <SmallCircle color={color} /> Cấp {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CollapsibleRefCard>
        </div>
    )
}

export const SmallCircle = styledComponents.div.attrs(({ color }) => ({}))`
    width: 8px;
    height: 8px;
    flex-grow: 0;
    background-color: ${({ color }) => color};
    border-radius: 100%;
`

export default Chart