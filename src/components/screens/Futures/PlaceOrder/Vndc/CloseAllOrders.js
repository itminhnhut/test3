import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDown, Edit } from 'react-feather';

const CloseAllOrders = () => {
    return (
        <Popover className="relative float-right">
            {({ open, close }) => (
                <>
                    <Popover.Button >
                        <div className="px-[8px] flex items-center py-[1px] mr-2 text-xs font-medium cursor-pointer hover:opacity-80 rounded-md">
                            Close All Orders
                            <ChevronDown size={16} className="ml-1" />
                        </div>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute left-0 z-50 bg-white">
                            <div className="min-w-[134px] pl-[12px] py-[8px] shadow-onlyLight font-medium text-xs flex flex-col">
                                <span className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>Close all</span>
                                <span className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>Close profit</span>
                                <span className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>Close losss</span>
                                <span className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>Close pending</span>
                                <span className={`text-darkBlue py-[1px] my-[2px] hover:text-teal cursor-pointer`}>Close active</span>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default CloseAllOrders;