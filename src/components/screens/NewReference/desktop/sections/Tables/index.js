import { useTranslation } from 'next-i18next';
import React, { Fragment, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'react-feather';
import DatePicker from 'components/common/DatePicker/DatePicker';
import { useCallback } from 'react';
import { Popover, Transition } from '@headlessui/react';
import FriendList from 'components/screens/NewReference/desktop/sections/Tables/FriendList';
import CommissionHistory from 'components/screens/NewReference/desktop/sections/Tables/CommissionHistory';
import classNames from 'classnames';
import ArrowDown from 'components/svg/ArrowDown';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';

const Tables = ({
    t,
    commisionConfig,
    id1,
    id2
}) => {
    return (
        <div className='flex flex-col gap-8'>
            <FriendList t={t} commisionConfig={commisionConfig} id={id1} />
            <CommissionHistory t={t} commisionConfig={commisionConfig} id={id2} />
        </div>
    );
};

export const TableFilter = ({
    filters,
    filter,
    setFilter
}) => {
    const { i18n: { language } } = useTranslation();

    const [theme] = useDarkMode();

    const renderFilter = (object, key) => {
        const onChange = (value) => {
            object.value = value;
            setFilter({
                ...filter,
                [key]: object
            });
        };
        switch (object.type) {
            case 'daterange':
                return (
                    <div className='flex justify-center w-full'>
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
                return <Popover className='relative w-full'>
                    {({
                        close,
                        open
                    }) => (
                        <div className='h-full w-full'>
                            <Popover.Button className='w-full'>
                                <div
                                    className='relative py-3 text-sm leading-5 px-3 flex items-center justify-between bg-gray-10 dark:bg-dark-2 rounded-md h-full w-full leading-6'>
                                    {object.values.find(e => e.value === filter[key].value).title}
                                    <ArrowDown
                                        size={16}
                                        color={theme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']}
                                        className='ml-1'
                                    />
                                </div>
                            </Popover.Button>
                            <Transition
                                show={open}
                                as={Fragment}
                                enter='transition ease-out duration-200'
                                enterFrom='opacity-0 translate-y-1'
                                enterTo='opacity-100 translate-y-0'
                                leave='transition ease-in duration-150'
                                leaveFrom='opacity-100 translate-y-0'
                                leaveTo='opacity-0 translate-y-1'
                            >
                                <Popover.Panel
                                    className='absolute z-10 bg-white dark:bg-darkBlue-3 rounded-md border border-divider dark:border-divider-dark w-full mt-2'>
                                    <div
                                        className='h-full py-1 shadow-onlyLight text-sm flex flex-col'>
                                        {object.values.map((e, index) => (
                                            <div key={index}
                                                 className={classNames('h-10 px-4 py-2 flex items-center cursor-pointer hover:bg-gray-13 dark:hover:bg-dark-5', {
                                                     'font-semibold text-txtPrimary dark:text-txtPrimary-dark': e.value === null, // Is `All` option
                                                     'text-txtSecondary dark:text-txtSecondary-dark': e.value !== null,
                                                     'bg-gray-13 dark:bg-dark-5': e.value === filter[key].value
                                                 })}
                                                 onClick={() => {
                                                     onChange(e.value);
                                                     close();
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
                </Popover>;
            case 'date':
                return <div className='flex justify-center w-full'>
                    <DatePicker
                        date={filter[key].value}
                        onChange={e => onChange(e)}
                        month={1}
                        hasShadow
                        isCalendar
                        wrapperClassname='!w-full'
                    />
                </div>;
            default:
                return <></>;
        }
    };
    const filterArray = Object.keys(filters);
    return filterArray.map((key) => <div className='min-w-[240px]' key={key}>
        <div className='text-txtSecondary dark:text-txtSecondary-dark mb-3 text-xs'>
            {filters[key].title}
        </div>
        <div className='w-full'>
            {renderFilter(filters[key], key)}
        </div>
    </div>);
};

export default Tables;
