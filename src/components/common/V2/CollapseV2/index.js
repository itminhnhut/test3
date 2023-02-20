import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import ChevronDown from 'components/svg/ChevronDown';

const index = ({ children, className, label, isCustom, active }) => {
    const [open, setOpen] = useState(false);
    const wraper = useRef();
    const list = useRef();

    const [flag, setFlag] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        if (isCustom) {
            clearTimeout(timer.current);
            wraper.current.style.height = active ? list.current.clientHeight + 'px' : 0;
            timer.current = setTimeout(
                () => {
                    setFlag(active);
                },
                active ? 400 : 0
            );
        }
    }, [active]);

    const handleOpen = () => {
        if (isCustom) return;
        clearTimeout(timer.current);
        wraper.current.style.height = !open ? list.current.clientHeight + 'px' : 0;
        timer.current = setTimeout(
            () => {
                setFlag(!open);
            },
            !open ? 400 : 0
        );
        setOpen(!open);
    };

    return (
        <div className={classNames('', className, { 'overflow-hidden': !flag })}>
            <div
                onClick={handleOpen}
                className={classNames('flex items-center space-x-2 cursor-pointer leading-5 font-semibold', { 'mb-4': open && !isCustom })}
            >
                <label className="cursor-pointer select-none">{label}</label>
                {!isCustom && <ChevronDown size={16} className={`${open ? 'rotate-0' : ''} transition-all`} />}
            </div>
            <Wraper className={classNames({ 'overflow-hidden': !flag })} ref={wraper}>
                <div ref={list}>{children}</div>
            </Wraper>
        </div>
    );
};

export default index;

const Wraper = styled.div.attrs({
    className: ''
})`
    transition: height 0.2s;
    height: 0;
`;
