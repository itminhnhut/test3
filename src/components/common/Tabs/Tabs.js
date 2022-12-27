import classnames from 'classnames';
import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import useWindowSize from 'hooks/useWindowSize';
import { scrollHorizontal } from 'redux/actions/utils';
import reduce from 'lodash/reduce';
import { sumBy } from 'lodash';

let currentKeyTab = 0;
const Tabs = forwardRef(({ children, tab, borderWidth = 2, className = '' }, ref) => {
    const TabRef = useRef(null);
    const [mount, setMount] = useState(false);
    const { width } = useWindowSize();

    useImperativeHandle(ref, () => ({
        ref: TabRef.current
    }));

    useEffect(() => {
        setMount(true);
    }, []);

    useEffect(() => {
        if (TabRef.current) {
            TabRef.current.querySelectorAll('.tab-item').forEach((el) => {
                if (el) {
                    el.classList[el.getAttributeNode('value').value === tab ? 'add' : 'remove']('tab-active', '!font-semibold', '!text-gray-6');
                }
            });
        }
    }, [tab, TabRef]);

    const active = useMemo(() => {
        const _currentTab = Array.isArray(children) ? children.findIndex((rs) => rs?.props?.value === tab) : 0;
        currentKeyTab = tab;
        return _currentTab;
    }, [tab, children]);

    const offset = useMemo(() => {
        if (!mount) return null;
        const el = document.querySelector('#tab-item-' + tab);
        scrollHorizontal(el, TabRef.current);
        const width = sumBy(TabRef.current.querySelectorAll('.tab-item'), 'clientWidth');
        return {
            l_after: `${el?.offsetLeft}px`,
            w_after: `${el?.offsetWidth}px` ?? '100%',
            w_before: TabRef.current.offsetWidth > width ? '100%' : `${width}px`
        };
    }, [tab, mount, width]);

    return (
        <Tab borderWidth={borderWidth} offset={offset} ref={TabRef} active={active} className={className}>
            {children}
        </Tab>
    );
});

const Tab = styled.div.attrs(({ className }) => ({
    className: `h-full overflow-auto w-screen no-scrollbar flex items-center relative ${className}`
}))`
    &:before {
        content: '';
        position: absolute;
        bottom: 0;
        height: ${({ borderWidth }) => `${borderWidth}px`};
        width: ${({ offset }) => `${offset?.w_before}`};
    }
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        height: ${({ borderWidth }) => `${borderWidth}px`};
        background-color: ${() => colors.namiapp.green[1]};
        width: ${({ offset }) => offset?.w_after};
        left: ${({ offset }) => offset?.l_after};
        transition: all 0.2s;
    }
`;

export const TabItem = styled.div.attrs(({ value, className = '' }) => ({
    className: classnames(
        'text-sm font-medium px-4 py-3 whitespace-nowrap text-center cursor-pointer w-full sm:w-max text-gray-7 tab-item sm:px-12',
        className
    ),
    id: `tab-item-${value}`
}))``;

export const TabContent = ({ children, lazyload = false, index }) => {
    const active = currentKeyTab === index;
    return <div className={currentKeyTab !== index ? 'hidden' : ''}>{lazyload || active ? children : null}</div>;
};

export default Tabs;
