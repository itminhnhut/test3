import React from 'react';
import DatePicker from 'components/common/DatePicker/DatePicker';
import classNames from 'classnames';
import { FilterWrapper } from '.';
import Calendar from 'components/svg/CalendarIcon';

const DateFilter = ({ filter, setFilter }) => {
    return (
        <FilterWrapper label="Thời gian" className="!max-w-[300px]">
            <DatePicker
                date={filter.range}
                onChange={(e) =>
                    setFilter({
                        range: {
                            startDate: new Date(e?.selection?.startDate ?? null).getTime(),
                            endDate: new Date(e?.selection?.endDate ?? null).getTime(),
                            key: 'selection'
                        }
                    })
                }
                wrapperClassname=""
                className="!right-unset !w-[max-content] !left-0 "
                dateRangeClassName="!text-base"
                month={2}
                hasShadow
                showConfirmButton
                text={
                    filter.range.startDate && filter.range.endDate ? null : (
                        <div
                            className={classNames(
                                'relative py-3 px-3 leading-5 flex items-center justify-between bg-gray-10 dark:bg-dark-2 rounded-md w-auto cursor-pointer'
                            )}
                        >
                            Chọn thời gian
                            <Calendar size={16} />
                        </div>
                    )
                }
            />
        </FilterWrapper>
    );
};

export default DateFilter;
