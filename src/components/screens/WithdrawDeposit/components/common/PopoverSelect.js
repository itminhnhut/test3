import React, { forwardRef, useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import SearchBox from 'components/common/SearchBoxV2';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
const PopoverSelect = (props, ref) => {
    return (
        <div ref={ref} className={classNames('relative', props.containerClassname)}>
            {props.label}
            <Transition
                show={props.open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
            >
                <div className="absolute shadow-sm left-0 w-full mt-3 bg-white dark:bg-darkBlue-3 border border-divider dark:border-divider-dark rounded-xl">
                    <div className="py-4">
                        <div className="px-4 mb-6">
                            <SearchBox isValueTrim={false} inputClassname="text-base" width="100%" onChange={props.onChange} value={props.value} />
                        </div>
                        {props.children}
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default forwardRef(PopoverSelect);
