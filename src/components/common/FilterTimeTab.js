import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import { TIME_FILTER } from 'components/screens/WithdrawDeposit/constants';
import DatePickerV2 from './DatePicker/DatePickerV2';
import classNames from 'classnames';
import { CalendarFillIcon } from 'components/svg/SvgIcon';

const FilterTimeTab = ({ filter, setFilter, className, positionCalendar, isTabAll = false, timeFilter = TIME_FILTER, isV2 = false }) => {
    const [timeTab, setTimeTab] = useState(isTabAll ? timeFilter[0].value : timeFilter[1].value);
    const { t } = useTranslation();

    useEffect(() => {
        if (timeTab === timeFilter[0].value) {
            setFilter({
                range: {
                    startDate: null,
                    endDate: null,
                    key: 'selection'
                }
            });
        } else if (timeTab !== 'custom') {
            const date = new Date();
            let interval = null;
            switch (timeTab) {
                case timeFilter[1].value:
                    date.setDate(date.getDate() - 0);
                    break;
                case timeFilter[2].value:
                    date.setDate(date.getDate() - 6);
                    break;
                case timeFilter[3].value:
                    date.setDate(date.getDate() - 30);
                    interval = 'w';
                    break;
                default:
                    break;
            }
            date.toLocaleDateString();
            setFilter({
                range: {
                    startDate: date.getTime(),
                    endDate: new Date(),
                    key: 'selection',
                    interval
                }
            });
            return;
        }
    }, [timeTab]);

    return (
        <div className={`flex gap-3 ${className}`}>
            {timeFilter.map((item, i) => {
                if (i === 0 && !isTabAll) return null;
                return (
                    <div
                        key={item.value}
                        onClick={() => setTimeTab(item.value)}
                        className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {
                            'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== item.value,
                            'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === item.value
                        })}
                    >
                        {t(item.localized)}
                    </div>
                );
            })}
            <DatePickerV2
                initDate={filter.range}
                onChange={(e) => {
                    setFilter({
                        range: {
                            startDate: new Date(e?.selection?.startDate ?? null).getTime(),
                            endDate: new Date(e?.selection?.endDate ?? null).getTime(),
                            key: 'selection'
                        }
                    });
                }}
                month={2}
                hasShadow
                position={positionCalendar || 'right'}
                text={
                    <div
                        onClick={() => setTimeTab('custom')}
                        className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal select-none flex items-center', {
                            'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== 'custom',
                            'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === 'custom'
                        })}
                    >
                        <CalendarFillIcon className={`mr-2 ${!isV2 && 'hidden'}`} color="currentColor" size={20} />
                        {t('dw_partner:filter.custom')}
                    </div>
                }
            />
        </div>
    );
};

export default FilterTimeTab;
