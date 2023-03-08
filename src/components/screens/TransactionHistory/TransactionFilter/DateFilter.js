import React from 'react';
import DatePicker from 'components/common/DatePicker/DatePicker';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';

import classNames from 'classnames';
import { FilterWrapper } from '.';
import Calendar from 'components/svg/CalendarIcon';
import { isDate } from 'lodash';

const DateFilter = ({ filter, setFilter }) => {
    return (
        <FilterWrapper label="Thời gian" className="!max-w-[300px]">
            <DatePickerV2
                initDate={filter.range}
                onChange={(e) =>
                    setFilter({
                        range: {
                            startDate: e?.selection?.startDate ? new Date(e?.selection?.startDate).getTime() : null,
                            endDate: e?.selection?.endDate ?  new Date(e?.selection?.endDate).getTime() : null,
                            key: 'selection'
                        }
                    })
                }
                month={2}
                hasShadow
                position="left"
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

            {/* <DatePicker
                date={filter.range}
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
            /> */}
        </FilterWrapper>
    );
};

export default DateFilter;
