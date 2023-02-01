import React from 'react';
import { Switch } from '@headlessui/react';

const CSwitch = ({ checked, onChange }) => {
    return (
        <Switch
            checked={checked}
            onChange={onChange}
            className={`${checked ? 'bg-teal' : 'bg-dark-2'}
           relative h-6 w-12 cursor-pointer rounded-full transition-colors duration-200 ease-in-out px-1`}
        >
            <span
                aria-hidden="true"
                className={`${checked ? 'translate-x-8' : 'translate-x-0'}
             pointer-events-none flex h-2 w-2 transform rounded-full ring-0 transition duration-200 ease-in-out bg-gray-4`}
            />
        </Switch>
    );
};

export default CSwitch;
