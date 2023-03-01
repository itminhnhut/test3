import { useTranslation } from 'next-i18next';
import React, { Fragment, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'react-feather';
import DatePicker from 'components/common/DatePicker/DatePicker';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { useCallback } from 'react';
import { Popover, Transition } from '@headlessui/react';
import FriendList from 'components/screens/NewReference/desktop/sections/Tables/FriendList';
import CommissionHistory from 'components/screens/NewReference/desktop/sections/Tables/CommissionHistory';
import classNames from 'classnames';
import ArrowDown from 'components/svg/ArrowDown';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';


const Tables = ({
    language,
    t,
    commisionConfig,
    id1,
    id2
}) => {
    return (
        <div className='flex flex-col gap-8'>
            <FriendList language={language} t={t} commisionConfig={commisionConfig} id={id1} />
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
                        <DatePickerV2
                            initDate={filter[key]?.value}
                            onChange={e => onChange(e?.selection)}
                            month={2}
                            hasShadow
                            position={object?.position || 'center'}
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
                                    className='relative h-11 text-sm px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-full leading-6'>
                                    {object.values.find(e => e.value === filter[key]?.value)?.title}
                                    <span className={`transition-transform duration-50 ${open && 'rotate-180'}`}>
                                        <ArrowDropDownIcon size={16} />
                                    </span>
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
                                                    'bg-gray-13 dark:bg-dark-5': e.value === filter[key]?.value
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
                        date={filter[key]?.value}
                        onChange={e => onChange(e)}
                        month={1}
                        hasShadow
                        isCalendar
                        wrapperClassname='!w-full'
                    />
                </div>;
            case 'reset':
                return <button
                    onClick={() => setFilter(filters)}
                    className="whitespace-nowrap bg-gray-12 hover:bg-gray-6 text-gray-15 dark:bg-dark-2 dark:hover:bg-dark-5 dark:text-gray-7
                        px-4 rounded-md px-auto py-auto font-semibold h-11"
                >
                    Reset
                </button>
            default:
                return <></>;
        }
    };
    const filterArray = Object.keys(filters);
    return filterArray.map((key) => <div className='flex flex-col items-start justify-end w-auto flex-auto last:flex-none' key={key}>
        <div className='text-txtSecondary dark:text-txtSecondary-dark mb-3 text-xs'>
            {filters[key].title}
        </div>
        {renderFilter(filters[key], key)}
    </div>);
};

export default Tables;
