import React, { forwardRef, useState } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import SearchBox from 'components/common/SearchBoxV2';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';
const PopoverSelect = (props, ref) => {
    return (
        <div ref={ref} className={classNames('relative', props.containerClassname)}>
            {props.label}

            <div
                className={classNames(
                    'absolute hidden left-0 w-full mt-3 bg-white dark:bg-darkBlue-3 border border-divider dark:border-divider-dark rounded-xl shadow-card_light dark:shadow-popover transition',
                    {
                        '!block': props.open
                    }
                )}
            >
                <div className="py-4">
                    {!props.hideSearch && (
                        <div className="px-4 mb-6">
                            <SearchBox
                                isValueTrim={false}
                                inputClassname="text-base"
                                width="100%"
                                onChange={props.onChange}
                                value={props.value}
                                placeholder={props.placeholder}
                            />
                        </div>
                    )}

                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default forwardRef(PopoverSelect);
