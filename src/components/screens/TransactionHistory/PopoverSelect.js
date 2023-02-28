import React, { forwardRef } from 'react';
import PopoverV2 from 'components/common/V2/PopoverV2';
import InputV2 from 'components/common/V2/InputV2';
import SearchBox from 'components/common/SearchBoxV2';
import { ChevronDown } from 'react-feather';
import SvgIcon from 'src/components/svg';
import colors from 'styles/colors';

const PopoverSelect = (props, ref) => {
    return (
        <PopoverV2
            containerClassName={props.containerClassName}
            className={props.className}
            ref={ref}
            label={
                <div className=" p-3 bg-gray-10 dark:bg-dark-2 rounded-md flex items-center justify-between w-full">
                    <div className="text-xs truncate flex">{props.labelValue}</div>
                    <div className="text-txtSecondary dark:text-gray-7">
                        <SvgIcon name="chevron_down" className=" " size={16} color="currentColor" />
                    </div>
                </div>
            }
        >
            <div className="py-4">
                <div className="px-4 mb-6">
                    <SearchBox width="100%" onChange={props.onChange} value={props.value} />
                </div>
                <div className="max-h-[300px] space-y-3 overflow-y-scroll">{props.children}</div>
            </div>
        </PopoverV2>
    );
};

export default forwardRef(PopoverSelect);
