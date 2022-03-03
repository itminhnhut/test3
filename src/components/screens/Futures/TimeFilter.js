import { memo } from 'react'
import { DatePicker } from 'antd'
import { formatTime } from 'redux/actions/utils'

import classNames from 'classnames'

import 'antd/dist/antd.css'

const { RangePicker } = DatePicker

const FuturesTimeFilter = memo(({ currentTimeRange, onChange }) => {
    return (
        <div className='flex items-center font-medium text-xs text-txtSecondary dark:text-txtSecondary-dark select-none'>
            <div
                onClick={() => onChange('1_day')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '1_day',
                    }
                )}
            >
                1 Day
            </div>
            <div
                onClick={() => onChange('1_week')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '1_week',
                    }
                )}
            >
                1 Week
            </div>
            <div
                onClick={() => onChange('1_month')}
                className={classNames(
                    'px-2 h-[20px] rounded-md mr-2 cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '1_month',
                    }
                )}
            >
                1 Month
            </div>
            <div
                onClick={() => onChange('3_month')}
                className={classNames(
                    'px-2 h-[20px] rounded-md cursor-pointer',
                    {
                        'bg-gray-5 dark:bg-darkBlue-4':
                            currentTimeRange === '3_month',
                    }
                )}
            >
                3 Month
            </div>
            <div className='flex items-center ml-5 custom_ant_datepicker'>
                <span className='mr-1.5'>Time</span>
                <RangePicker
                    bordered={false}
                    superNextIcon={null}
                    separator='to'
                    placeholder={['DD-MM-YYYY', 'DD-MM-YYYY']}
                    format='DD-mm-YYYY'
                    onChange={(date) => onChange(date)}
                />
            </div>
        </div>
    )
})

export default FuturesTimeFilter
