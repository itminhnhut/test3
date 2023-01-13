import Tabs, { TabItem } from 'src/components/common/Tabs/Tabs'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import CollapsibleRefCard from 'src/components/screens/NewReference/CollapsibleRefCard'
import { formatNumber } from 'redux/actions/utils';
import baseColors from 'styles/colors';
import ChartJS from 'src/components/screens/Portfolio/charts/ChartJS';
import { FilterTabs } from '..';
import { API_NEW_REFERRAL_STATISTIC } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import PopupModal from 'src/components/screens/NewReference/PopupModal';
import DatePicker from 'src/components/common/DatePicker/DatePicker';
import styledComponents from 'styled-components'
import NeedLogin from 'components/common/NeedLogin';

const Chart = ({ user }) => {
    const { t } = useTranslation()
    const tags = [{
        value: 'partners',
        content: t('reference:referral.number_of_friends')
    }, {
        value: 'totalCommission',
        content: t('reference:referral.total_commissions')
    },]
    const timeTabs = [
        { title: '1 ' + t('futures:day'), value: 'd', format: 'hh:mm', interval: '1h' },
        { title: '1 ' + t('futures:week'), value: 'w', format: 'dd/MM', interval: '1d' },
        { title: '1 ' + t('futures:month'), value: 'm', format: 'dd/MM', interval: '1d' },
        // { title: t('reference:referral.custom'), value: 'custom' },
    ]
    const [tab, setTab] = useState(tags[0].value)
    const [timeTab, setTimeTab] = useState(timeTabs[0].value)
    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });
    const [showCustom, setShowCustom] = useState(false)
    const colors = ['#47cc85', '#4272ee', '#42cfee', '#2937e0']
    const [dataSource, setDataSource] = useState({
        data: [],
        labels: []
    })

    useEffect(() => {
        if (timeTab !== timeTabs[3]?.value) {
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
            setFilter({
                range: {
                    startDate: date.getTime(),
                    endDate: Date.now(),
                    key: 'selection'
                }
            })
            return
        } else setShowCustom(true)
    }, [timeTab])

    useEffect(() => {
        if (!filter.range.startDate) return
        FetchApi({
            url: API_NEW_REFERRAL_STATISTIC + (tab === tags[0].value ? '-friend' : ''),
            options: {
                method: 'GET',
            },
            params: {
                interval: timeTabs.find(e => e.value === timeTab)?.interval ?? '1d',
                from: filter?.range?.startDate,
                // from: 0,
                to: filter?.range?.endDate,
                format: timeTabs.find(e => e.value === timeTab)?.format ?? 'dd/MM'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                setDataSource(data)
            } else {
                setDataSource({
                    data: [],
                    labels: []
                })
            }
        });
    }, [tab, filter])

    const renderChart = () => {
        const getData = (level) => dataSource.data.map(e => e[level - 1]?.[tab === tags[0].value ? 'count' : 'volume'] ?? [])
        const data = {
            labels: dataSource?.labels || [],
            datasets: [{
                type: 'bar',
                label: 'level1',
                data: getData(1),
                backgroundColor: colors[0],
                borderColor: colors[0],
                maxBarThickness: 8,
                borderRadius: 2,
                order: 1
            }, {
                type: 'bar',
                label: 'level2',
                data: getData(2),
                backgroundColor: colors[1],
                borderColor: colors[1],
                maxBarThickness: 8,
                borderRadius: 2,
                order: 2
            }, {
                type: 'bar',
                label: 'level3',
                data: getData(3),
                backgroundColor: colors[2],
                borderColor: colors[2],
                maxBarThickness: 8,
                borderRadius: 2,
                order: 3
            }, {
                type: 'bar',
                label: 'level4',
                data: getData(4),
                backgroundColor: colors[3],
                borderColor: colors[3],
                maxBarThickness: 8,
                borderRadius: 2,
                order: 4
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex
                            const datasetIndex = context.datasetIndex
                            const data = dataSource.data[index][datasetIndex]
                            const level = t('reference:referral.level') + ': ' + data.level
                            const friends = t('reference:referral.number_of_friends') + ': ' + data.count
                            const commission = t('reference:referral.total_commissions') + ': ' + formatNumber(data.volume, 0) + ' VNDC'
                            if (!data.volume) return [level, friends]
                            return [level, friends, commission]
                        },
                        labelTextColor: function (context) {
                            return baseColors.namiapp.gray[1]
                        }
                    },
                    backgroundColor: baseColors.namiapp.black[2],
                    titleColor: baseColors.namiapp.gray.DEFAULT,
                    displayColors: false,
                },
            },
            scales: {
                x: {
                    stacked: true,
                    // combined: true,
                    ticks: {
                        color: baseColors.namiapp.gray.DEFAULT,  // not 'fontColor:' anymore
                        //fontSize: 14,
                        font: {
                            size: 9 // 'size' now within object 'font {}'
                        },

                    }
                },
                y: {
                    // combined: true,
                    ticks: {
                        color: baseColors.namiapp.gray.DEFAULT,  // not 'fontColor:' anymore
                        //fontSize: 14,
                        font: {
                            size: 9 // 'size' now within object 'font {}'
                        },

                    }
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
        <div className='px-4'  >
            {showCustom && <CustomFilter isShow={showCustom} onClose={() => setShowCustom(false)} t={t} filter={filter} onConfirm={setFilter} />}
            <CollapsibleRefCard title={t('reference:referral.statistic')} isBlack>
                {user ? <div className='w-auto'>
                    <Tabs tab={tab} className='text-sm flex justify-start gap-7 text-gray-1' isMobile >
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
                            <FilterTabs tabs={timeTabs} type={timeTab} setType={setTimeTab} isMobile />
                        </div>
                        <div className='h-100 mt-4'>
                            {renderChart()}
                        </div>
                        <div className='px-2 mt-4 flex flex-wrap items-center gap-4'>
                            {colors.map((color, index) => (
                                <div className='flex items-center gap-2 leading-5 text-xs font-medium text-gray-1 min-w-[70px]' key={index}>
                                    <SmallCircle color={color} />  {t('reference:referral.level')} {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div> : <NeedLogin message={t('reference:user.login_to_view')} isNamiapp addClass='mt-8' />}
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

const CustomFilter = ({ isShow, onClose, t, filter, onConfirm }) => {
    const [state, setState] = useState(filter);

    const onChange = (key, value) => {
        setState({ ...state, [key]: value });
    };

    const _onConfirm = () => {
        onConfirm({
            range: {
                startDate: state.range.startDate.getTime(),
                endDate: state.range.endDate.getTime(),
                key: 'selection'
            }
        })
    }

    return (
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            title={t('reference:referral.custom')}
        >
            <div className='font-medium text-sm text-gray-1 leading-6 flex flex-col gap-4'>
                <DatePicker date={state.range} onChange={(e) => onChange('range', e.selection)} allwaysOpen={true} />
            </div>
            <div className='w-full flex bg-teal mt-8 rounded-md h-11 justify-center items-center text-sm font-bold leading-6 text-white'
                onClick={() => _onConfirm()}
            >
                {t('common:confirm')}
            </div>
        </PopupModal>
    )
}