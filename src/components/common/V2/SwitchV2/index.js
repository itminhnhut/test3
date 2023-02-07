import React from 'react';
import { Switch } from '@headlessui/react';
import classnames from 'classnames';

const CSwitch = ({
    checked,
    disabled = false,
    onChange
}) => {
    const _onChange = (value) => {
        if (!disabled) onChange(value)
    }

    return (
        <Switch
            checked={checked}
            onChange={_onChange}
            className={classnames(
                'relative h-6 w-12 px-1 cursor-pointer rounded-full',
                'transition-colors duration-200 ease-in-out',
                {
                    'bg-teal': checked,
                    'bg-dark-2': !checked,
                    'bg-gray-1 cursor-not-allowed': disabled
                }
            )}
        >
            <span
                aria-hidden='true'
                className={classnames(
                    'pointer-events-none flex h-2 w-2 rounded-full ring-0 bg-gray-4',
                    'transform transition duration-200 ease-in-out', {
                        'translate-x-8': checked,
                        'translate-x-0': !checked
                    }
                )}
            />
        </Switch>
    );
};

export default CSwitch;
