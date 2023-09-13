import React, { forwardRef } from 'react';

// ** components
import PopoverV2 from 'components/common/V2/PopoverV2';
import SearchBox from 'components/common/SearchBoxV2';

// ** svg
import SvgIcon from 'src/components/svg';

// ** redux
import { isFunction } from 'redux/actions/utils';
import classNames from 'classnames';

const PopoverSelect = (props, ref) => {
    return (
        <PopoverV2
            containerClassName={`${props.containerClassName} z-20 `}
            className={props.className}
            ref={ref}
            label={(open) => (
                <div className={classNames('z-0 p-3 bg-gray-10 dark:bg-dark-2 rounded-md h-11 flex items-center justify-between w-full', props.wrapperLabel)}>
                    <div className="leading-5 truncate flex w-full">
                        {props.labelValue && isFunction(props.labelValue) ? props.labelValue() : props.labelValue}
                    </div>
                    {!props.hideChevron && (
                        <div className="text-txtSecondary dark:text-gray-7">
                            <SvgIcon
                                size={16}
                                name="chevron_down"
                                color="currentColor"
                                className={`${open ? '!rotate-0 ' : ' '} transition-transform duration-150`}
                            />
                        </div>
                    )}
                </div>
            )}
        >
            <div className="py-4 z-50">
                <div className="dark:!text-gray-4 !text-gray-15 !text-base font-semibold px-4 mb-4">{props.labelAsset}</div>
                <div className="px-4 mb-6">
                    <SearchBox isValueTrim={false} inputClassname="text-base" width="100%" onChange={props.onChange} value={props.value} />
                </div>
                {props.children}
            </div>
        </PopoverV2>
    );
};

export default forwardRef(PopoverSelect);
