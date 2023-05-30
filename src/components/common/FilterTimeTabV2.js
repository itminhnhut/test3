import { useTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';
import { TIME_FILTER } from 'components/screens/WithdrawDeposit/constants';
import DatePickerV2 from './DatePicker/DatePickerV2';
import classNames from 'classnames';
import { CalendarFillIcon, FilterIcon } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { formatTime } from 'redux/actions/utils';
import InputV2 from './V2/InputV2';

const FilterTimeTabV2 = ({ filter, setFilter, className, positionCalendar, isTabAll = false, timeFilter = TIME_FILTER, isMobile = false }) => {
    const { t } = useTranslation();
    const [isShowModalFilter, setIsShowModalFilter] = useState(false);
    const [timeTab, setTimeTab] = useState(isTabAll ? timeFilter[0].value : timeFilter[1].value);
    useEffect(() => {
        if (timeTab === 'all') {
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
                case 'd':
                    date.setDate(date.getDate() - 0);
                    break;
                case 'w':
                    date.setDate(date.getDate() - 6);
                    break;
                case 'm':
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
                    endDate: Date.now(),
                    key: 'selection',
                    interval
                }
            });
            return;
        }
    }, [timeTab]);

    if (isMobile) {
        return (
            <div>
                <button onClick={() => setIsShowModalFilter(true)}>
                    <FilterIcon />
                </button>
                <ModalV2 isVisible={isShowModalFilter} onBackdropCb={() => setIsShowModalFilter(false)} wrapClassName="px-6" isMobile={true}>
                    <div className="mt-6 text-left">
                        <h1 className="text-xl font-semibold text-gray-15 dark:text-gray-4">Lọc kết quả</h1>
                        <div className="flex flex-col items-start justify-between gap-2 mt-8">
                            <span className="text-xs leading-5  text-txtSecondary dark:text-txtSecondary-dark">Tuỳ chỉnh:</span>
                            <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-[10px] flex justify-between text-base items-center leading-6">
                                <div>
                                    {filter.range?.startDate ? (
                                        <span className="py-1 text-sm leading-[18px] text-txtPrimary dark:text-txtPrimary-dark">
                                            {formatTime(filter.range?.startDate, 'dd/MM/yyyy')}
                                        </span>
                                    ) : (
                                        <span className="text-sm leading-[18px] text-txtSecondary dark:text-txtSecondary-dark">dd/MM/yyyy</span>
                                    )}
                                    {' - '}
                                    {filter.range?.endDate ? (
                                        <span className="py-1 text-sm leading-[18px] text-txtPrimary dark:text-txtPrimary-dark">
                                            {formatTime(filter.range?.endDate, 'dd/MM/yyyy')}
                                        </span>
                                    ) : (
                                        <span className="text-sm leading-[18px] text-txtSecondary dark:text-txtSecondary-dark">dd/MM/yyyy</span>
                                    )}
                                </div>
                                <CalendarFillIcon className="mr-2" color="#8694b2" size={20} />
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            {timeFilter.map((item, i) => {
                                if (i === 0 && !isTabAll) return null;
                                return (
                                    <div
                                        key={item.value}
                                        onClick={() => setTimeTab(item.value)}
                                        className={classNames('px-5 py-2.5 border rounded-full cursor-pointer font-normal', {
                                            'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== item.value,
                                            'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === item.value
                                        })}
                                    >
                                        {t(item.localized)}
                                    </div>
                                );
                            })}
                        </div>
                        <ButtonV2 className="mt-8">Áp dụng</ButtonV2>
                    </div>
                </ModalV2>
            </div>
        );
    }

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
                        <CalendarFillIcon className="mr-2" color="#8694b2" size={20} />
                        {t('dw_partner:filter.custom')}
                    </div>
                }
            />
        </div>
    );
};

export default FilterTimeTabV2;
