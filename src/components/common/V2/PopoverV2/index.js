import React, { Fragment, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Popover, Transition } from '@headlessui/react';

const index = forwardRef(({ containerClassName = '', label, className = '', visible = true, children, isHover = false }, ref) => {
    const refPopover = useRef(null);
    const timeoutDuration = 0;
    const timer = useRef();
    const [openState, setOpenState] = useState(false);

    useImperativeHandle(ref, () => ({
        close: onClose
    }));

    const onClose = () => {
        refPopover.current?.click();
    };

    const toggleMenu = (open) => {
        setOpenState((openState) => !openState);
        refPopover.current?.click();
    };

    const onHover = (open, action) => {
        if ((!open && !openState && action === 'onMouseEnter') || (open && openState && action === 'onMouseLeave')) {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => toggleMenu(open), timeoutDuration);
        }
    };

    return (
        <Popover key={'popover_v2'} className={`relative ${containerClassName}`}>
            {({ open, close }) => {
                return (
                    <>
                        <Popover.Button
                            onMouseEnter={() => isHover && onHover(open, 'onMouseEnter')}
                            onMouseLeave={() => isHover && onHover(open, 'onMouseLeave')}
                            ref={refPopover}
                            type="button"
                            className="inline-flex items-center focus:outline-none w-full"
                            aria-expanded="false"
                        >
                            {label}
                        </Popover.Button>
                        {/* <Popover.Overlay className="fixed inset-0 bg-red opacity-30" /> */}
                        <Transition
                            show={open && visible}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className={`${className} absolute left-1/2 -translate-x-1/2 w-full z-10 mt-3 bg-white dark:bg-darkBlue-3 border border-divider-dark rounded-md`}
                            >
                                {children}
                            </Popover.Panel>
                        </Transition>
                    </>
                );
            }}
        </Popover>
    );
});

export default index;
