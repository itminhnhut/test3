import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import CollapsibleRefCard from '../CollapsibleRefCard'
import { formatNumber, formatTime } from 'redux/actions/utils';
import colors from 'styles/colors';
import ChartJS from '../../Portfolio/charts/ChartJS';
import { FilterTabs } from '..';
import styledComponents from 'styled-components';
import { API_NEW_REFERRAL_STATISTIC } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';

const title = {
    en: 'Chart',
    vi: 'Biểu đồ biến động'
}

const Chart = ({ id }) => {
    const { t } = useTranslation()
    const tags = [{
        value: 'partners',
        content: t('reference:referral.number_of_friends')
    }, {
        value: 'totalCommission',
        content: t('reference:referral.total_commissions')
    },]
    const timeTabs = [
        { title: '1 ' + t('futures:day'), value: '1d' },
        { title: '1 ' + t('futures:week'), value: '1w' },
        { title: '1 ' + t('futures:month'), value: '1M' },
        { title: t('reference:referral.custom'), value: 'custom' },
    ]
    const [tab, setTab] = useState(tags[0].value)
    const [timeTab, setTimeTab] = useState(timeTabs[0].value)
    const colors = ['#C0F9EE', '#b2ede3', '#7de3d2', '#5ed1be', '#47c9b4']
    const [dataSource, setDataSource] = useState()
    useEffect(() => {
        const date = new Date()
        switch (timeTab) {
            case timeTabs[0].value:
                date.setDate(date.getDate() - 1);
                break;
            case timeTabs[1].value:
                date.setDate(date.getDate() - 7);
                break;
            case timeTabs[2].value:
                date.setDate(date.getDate() - 31);
                break;
            default:
                break
        }
        date.toLocaleDateString();
        FetchApi({
            url: API_NEW_REFERRAL_STATISTIC,
            options: {
                method: 'GET',
            },
            params: {
                interval: timeTab,
                from: date.getTime(),
                to: Date.now(),
                format: 'dd/mm'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                console.log('data', data)
                setDataSource(data)
            } else {
                setDataSource(null)
            }
        });
    }, [tab, timeTab])


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
            <CollapsibleRefCard title={t('reference:referral.statistic')} >
                <div className='w-auto'>
                    <Tabs tab={tab} className='text-sm flex justify-start gap-7' >
                        {tags.map((e, index) =>
                            <div key={index}>
                                <TabItem value={e.value} onClick={() => setTab(e.value)} className='w-auto justify-start !px-0'>
                                    {e.content}
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
                        <div className='px-2 mt-4 flex flex-wrap items-center' >
                            {colors.map((color, index) => (
                                <div className='flex items-center gap-2 leading-5 text-xs font-medium text-gray-1 min-w-[100px]' key={index}>
                                    <SmallCircle color={color} />  {t('reference:referral.ranking')} {index + 1}
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