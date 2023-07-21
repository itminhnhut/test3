import React from 'react';
import { Switch } from '@headlessui/react';
import classnames from 'classnames';

const CSwitch = ({ checked, disabled = false, onChange, processing = false}) => {
    const _onChange = (value) => {
        if (!disabled) onChange(value);
    };

    return (
        <Switch
            checked={checked}
            onChange={_onChange}
            className={classnames('relative h-6 min-w-[48px] px-2 cursor-pointer rounded-full', 'transition-colors duration-200 ease-in-out', {
                'dark:bg-teal bg-bgBtnV2': checked,
                'bg-gray-11 dark:bg-dark-2': !checked,
                'dark:!bg-gray-1 !bg-gray-13 cursor-not-allowed': !checked && disabled,
                'dark:!bg-[#436654] !bg-green-5 cursor-not-allowed': checked && disabled,
                '!cursor-wait': processing
            })}
        >
            <span
                aria-hidden="true"
                className={classnames(
                    'pointer-events-none flex h-2 w-2 rounded-full ring-0 bg-white dark:bg-gray-4',
                    'transform transition duration-200 ease-in-out',
                    {
                        'translate-x-6': checked,
                        'translate-x-0': !checked,
                        'dark:!bg-dark-6 !bg-gray-16': disabled
                    }
                )}
            />
        </Switch>
    );
};

export default CSwitch;
