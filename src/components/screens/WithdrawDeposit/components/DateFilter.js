import classNames from 'classnames';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import { FilterWrapper } from 'components/screens/TransactionHistory/TransactionFilter';
import CalendarIcon from 'components/svg/CalendarIcon';
import React from 'react';
import { X } from 'react-feather';
import { formatTime } from 'redux/actions/utils';
import { useWindowSize } from 'utils/customHooks';
import { getWidthByBreakpoint } from 'utils/helpers';

const DateFilter = ({ filter, setFilter, t }) => {
    const { width } = useWindowSize();

    return (
        <FilterWrapper label={t('common:time')}>
            <DatePickerV2
                initDate={filter}
                onChange={(e) => {
                    setFilter({
                        startDate: new Date(e?.selection?.startDate || null).getTime(),
                        endDate: new Date(e?.selection?.endDate || null).getTime()
                    });
                }}
                month={width > getWidthByBreakpoint('md') ? 2 : 1}
                hasShadow
                position="left"
                wrapperClassname="z-40"
                text={
                    <div
                        className={classNames(
                            'relative py-3 px-3 leading-5 flex items-center justify-between bg-gray-10 dark:bg-dark-2 rounded-md w-auto cursor-pointer',
                            { 'text-txtPrimary dark:text-txtPrimary-dark': filter.startDate && filter.endDate }
                        )}
                    >
                        <span>
                            {filter.startDate && filter.endDate
                                ? `${formatTime(filter.startDate, 'dd/MM/yyyy')} - ${formatTime(filter.endDate, 'dd/MM/yyyy')}`
                                : 'Chọn thời gian'}
                        </span>
                        {filter.startDate && filter.endDate ? (
                            <X
                                size={16}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFilter({
                                        startDate: null,
                                        endDate: null
                                    });
                                }}
                            />
                        ) : (
                            <CalendarIcon size={16} />
                        )}
                    </div>
                }
            />
        </FilterWrapper>
    );
};

export default DateFilter;
