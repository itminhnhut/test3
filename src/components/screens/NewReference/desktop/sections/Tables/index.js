import { useTranslation } from 'next-i18next'
import React, { useMemo } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'react-feather';
import DatePicker from 'components/common/DatePicker/DatePicker';
import { useCallback } from 'react';
import { Popover, Transition } from '@headlessui/react';
import FriendList from 'components/screens/NewReference/desktop/sections/Tables/FriendList'
import CommissionHistory from 'components/screens/NewReference/desktop/sections/Tables/CommissionHistory';

const Tables = ({ t, commisionConfig, id1, id2 }) => {
    return (
        <div className='flex flex-col gap-8'>
            <FriendList t={t} commisionConfig={commisionConfig} id={id1}/>
            <CommissionHistory t={t} commisionConfig={commisionConfig} id={id2}/>
        </div>
    )
}

export const TableFilter = ({ filters, filter, setFilter }) => {
    const { i18n: { language } } = useTranslation()
    const renderFilter = (object, key) => {
        const onChange = (value) => {
            object.value = value
            setFilter({
                ...filter,
                [key]: object
            })
        }
        switch (object.type) {
            case 'daterange':
                return (
                    <div className="date-range-picker flex justify-center !bg-white w-full">
                        <DatePicker
                            date={filter[key].value}
                            onChange={e => onChange(e.selection)}
                            month={2}
                            hasShadow
                            wrapperClassname='!w-full'
                        />
                    </div>
                );
            case 'popover':
                return <Popover className="relative w-full">
                    {({ close }) => (
                        <div className='h-full w-full'>
                            <Popover.Button className='w-full'>
                                <div
                                    className="relative py-2 text-sm font-medium px-3 flex items-center justify-between bg-gray-4 rounded-[4px] border-[0.5px] border-white h-full w-full leading-6">
                                    {object.values.find(e => e.value === filter[key].value).title}
                                    <ChevronDown size={16} className="ml-1" />
                                </div>
                            </Popover.Button>
                            <Transition
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10 bg-white w-full">
                                    <div
                                        className="h-full py-1 shadow-onlyLight font-medium text-xs flex flex-col">
                                        {object.values.map((e, index) => (
                                            <div key={index} className='h-10 px-4 py-2 flex items-center hover:bg-[#00c8bc0d]'
                                                onClick={() => {
                                                    onChange(e.value)
                                                    close()
                                                }}
                                            >
                                                {e.title}
                                            </div>
                                        ))}
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </div>
                    )}
                </Popover>
            case 'date':
                return <div className="date-range-picker flex justify-center !bg-white w-full">
                    <DatePicker
                        date={filter[key].value}
                        onChange={e => onChange(e)}
                        month={1}
                        hasShadow
                        isCalendar
                        wrapperClassname='!w-full'
                    />
                </div>
            default:
                return <></>;
        }
    }
    const filterArray = Object.keys(filters)
    return filterArray.map((key) => <div className='min-w-[240px]' key={key}>
        <div className='font-medium text-sm leading-5 text-gray-1 mb-1'>
            {filters[key].title}
        </div>
        <div className='w-full'>
            {renderFilter(filters[key], key)}
        </div>
    </div>)
}

export default Tables