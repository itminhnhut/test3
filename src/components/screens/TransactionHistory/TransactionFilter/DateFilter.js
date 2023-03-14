import React from 'react';
import DatePicker from 'components/common/DatePicker/DatePicker';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { formatTime } from 'redux/actions/utils';

import classNames from 'classnames';
import { FilterWrapper } from '.';
import Calendar from 'components/svg/CalendarIcon';
import { X } from 'react-feather';

const DateFilter = ({ filter, setFilter }) => {
    return (
        <FilterWrapper label="Thời gian" className="!max-w-[300px]">
            <DatePickerV2
                initDate={filter.range}
                onChange={(e) =>
                    setFilter({
                        range: {
                            startDate: new Date(e?.selection?.startDate || null).getTime(),
                            endDate: new Date(e?.selection?.endDate || null).getTime(),
                            key: 'selection'
                        }
                    })
                }
                month={2}
                hasShadow
                position="left"
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
                                : 'Chọn thời gian'}
                        </span>
                        {filter.range.startDate && filter.range.endDate ? (
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
