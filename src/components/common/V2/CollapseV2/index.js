import React, { useEffect, useRef, useState } from 'react';

import ChevronDown from 'components/svg/ChevronDown';

import classNames from 'classnames';
import { isFunction } from 'lodash';
import styled from 'styled-components';

const index = ({
    children,
    className,
    label,
    isCustom,
    active,
    reload,
    divLabelClassname = '',
    labelClassname = '',
    chrevronStyled,
    setIsOpen,
    isDividerBottom,
    chevronDownClassName = '',
    dividerBottomClassName = ''
}) => {
    const [open, setOpen] = useState(false);
    const wrapper = useRef();
    const list = useRef();

    const [flag, setFlag] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        if (active) {
            setOpen(active);
            setFlag(active, flag);
        }
    }, []);

    useEffect(() => {
        if (isCustom) {
            clearTimeout(timer.current);
            wrapper.current.style.height = active ? list.current.clientHeight + 'px' : 0;
            timer.current = setTimeout(
                () => {
                    setFlag(active);
                },
                active ? 400 : 0
            );
        }
    }, [active, reload]);

    useEffect(() => {
        if (!wrapper.current) return;
        setTimeout(() => {
            if(active){
                const clientHeight = list?.current?.clientHeight;
                wrapper.current?.style.height = clientHeight === 0 ? 'auto':  list.current.clientHeight + 'px';
            }else{
                wrapper.current?.style.height = 0;
            }
          //  wrapper.current?.style.height = active ? list.current.clientHeight + 'px' : 0;
        }, 100);
    }, [reload]);

    const handleOpen = () => {
        if (isCustom || !wrapper.current) return;
        clearTimeout(timer.current);
        wrapper.current.style.height = !open ? list.current.clientHeight + 'px' : 0;
        timer.current = setTimeout(
            () => {
                setFlag(!open);
            },
            !open ? 400 : 0
        );
        setOpen(!open);
        if (isFunction(setIsOpen)) setIsOpen(!open);
    };

    return (
        <WrapperContainer className={classNames('', className, { 'overflow-hidden': !flag })}>
            <div
                onClick={handleOpen}
                className={classNames(
                    'flex items-center space-x-2 cursor-pointer leading-5 font-semibold',
                    {
                        'mb-4': open && !isCustom,
                        'border-b border-divider dark:border-divider-dark pb-[23px]': isDividerBottom && !open
                    },
                    divLabelClassname
                )}
            >
                <label className={`cursor-pointer select-none ${labelClassname}`}>{label}</label>
                {!isCustom && <ChevronDown size={16} {...chrevronStyled} className={`${open ? '!rotate-0' : ''} transition-all ${chevronDownClassName}`} />}
            </div>
            <Wrapper className={classNames({ 'overflow-hidden': !flag })} ref={wrapper}>
                <div ref={list}>{children}</div>
            </Wrapper>
            {isDividerBottom && open && <div className={`w-full border-b border-divider dark:border-divider-dark mt-[47px] ${dividerBottomClassName}`}></div>}
        </WrapperContainer>
    );
};

export default index;

const WrapperContainer = styled.div`
    &.divider-bottom {
        &:last-child {
            div {
                &:last-child {
                    border-bottom-width: 0px;
                }
            }
        }
    }
`;

const Wrapper = styled.div.attrs({
    className: ''
})`
    transition: height 0.2s;
    height: 0;
`;
