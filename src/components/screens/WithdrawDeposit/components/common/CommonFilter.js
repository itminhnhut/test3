import { FilterWrapper } from 'components/screens/TransactionHistory/TransactionFilter';
import React, { forwardRef, useRef, useState } from 'react';
import PopoverSelect from './PopoverSelect';
import { useClickAway } from 'react-use';
import SvgIcon from 'components/svg';
import classNames from 'classnames';
import CheckCircle from 'components/svg/CheckCircle';

const CommonFilter = ({ subLabel, boxLabel, onSelect, data, active, t }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useClickAway(ref, () => {
        if (visible) {
            setVisible(false);
        }
    });
    return (
        <FilterWrapper label={subLabel}>
            <PopoverSelect
                ref={ref}
                open={visible}
                label={
                    <div
                        onClick={() => setVisible((prev) => !prev)}
                        className="cursor-pointer p-3 bg-gray-10 dark:bg-dark-2 rounded-md h-11 flex items-center justify-between w-full"
                    >
                        <div
                            className={classNames({
                                'text-txtPrimary dark:text-txtPrimary-dark': boxLabel
                            })}
                        >
                            {boxLabel || t('common:global_label:all')}
                        </div>
                        <div className="text-txtSecondary dark:text-gray-7">
                            <SvgIcon
                                name="chevron_down"
                                className={`${visible ? '!rotate-0 ' : ' '} transition-transform duration-150`}
                                size={16}
                                color="currentColor"
                            />
                        </div>
                    </div>
                }
            >
                <div>
                    {data &&
                        data.length &&
                        data.map((item) => (
                            <div
                                key={item.key}
                                onClick={() => {
                                    if(active === item.key) return;
                                    onSelect(item);
                                    setVisible(false);
                                }}
                                className={classNames(
                                    'p-3 w-full text-txtPrimary dark:text-txtPrimary-dark flex items-center justify-between text-left disabled:cursor-default  transition cursor-pointer hover:bg-hover-1 dark:hover:bg-hover-dark'
                                )}
                            >
                                <span>{t(item.localized) || t('common:global_label:all')}</span>
                                {active === item.key && (
                                    <div className="">
                                        <CheckCircle size={16} color="currentColor" />
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </PopoverSelect>
        </FilterWrapper>
    );
};

export default forwardRef(CommonFilter);
