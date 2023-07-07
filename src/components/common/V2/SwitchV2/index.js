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
                'bg-teal': checked,
                'bg-gray-11 dark:bg-dark-2': !checked,
                'bg-gray-1 cursor-not-allowed opacity-70': !checked && disabled,
                'bg-[#436654] cursor-not-allowed opacity-70': checked && disabled,
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
                        '!bg-dark-6': disabled
                    }
                )}
            />
        </Switch>
    );
};

export default CSwitch;
