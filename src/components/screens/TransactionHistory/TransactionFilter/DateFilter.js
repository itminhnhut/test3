import React from 'react';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { formatTime } from 'redux/actions/utils';
import classNames from 'classnames';
import { FilterWrapper } from '.';
import Calendar from 'components/svg/CalendarIcon';
import { X } from 'react-feather';
import { useWindowSize } from 'react-use';
import { getWidthByBreakpoint } from 'src/utils/helpers';

const DateFilter = ({ filter, setFilter, t }) => {
    const { width } = useWindowSize();

    return (
        <FilterWrapper label={t('transaction-history:filter.time')} className="!max-w-[300px]">
            <DatePickerV2
                initDate={filter.range}
                onChange={(e) => {
                    setFilter({
                        range: {
                            startDate: new Date(e?.selection?.startDate || null),
                            endDate: new Date(e?.selection?.endDate || null),
                            key: 'selection'
                        }
                    });
                }}
                month={width > getWidthByBreakpoint('md') ? 2 : 1}
                hasShadow
                position={width > getWidthByBreakpoint('lg') ? 'left' : 'right'}
                wrapperClassname="z-40"
                text={
                    <div
                        className={classNames(
                            'relative py-3 px-3 leading-5 flex items-center justify-between bg-gray-10 dark:bg-dark-2 rounded-md w-auto cursor-pointer',
                            { 'text-txtPrimary dark:text-txtPrimary-dark': filter.range.startDate && filter.range.endDate }
                        )}
                    >
                        <span>
                            {filter.range.startDate && filter.range.endDate
                                ? `${formatTime(filter.range.startDate, 'dd/MM/yyyy')} - ${formatTime(filter.range.endDate, 'dd/MM/yyyy')}`
                                : t('transaction-history:filter.select_time')}
                        </span>
                        {filter.range.startDate && filter.range.endDate ? (
                            <div className="text-gray-7">
                                <X
                                    size={16}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFilter({
                                            range: {
                                                startDate: null,
                                                endDate: null,
                                                key: 'selection'
                                            }
                                        });
                                    }}
                                />
                            </div>
                        ) : (
                            <Calendar size={16} />
                        )}
                    </div>
                }
            />
        </FilterWrapper>
    );
};

export default DateFilter;
