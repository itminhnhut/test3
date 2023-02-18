import classnames from 'classnames';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, cloneElement } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import useWindowSize from 'hooks/useWindowSize';
import { scrollHorizontal } from 'redux/actions/utils';
import { sumBy } from 'lodash';

let currentKeyTab = 0;
let isClick = true;
const Tabs = forwardRef(({ children, tab, borderWidth = 2, className = '', isScroll = false }, ref) => {
    const TabRef = useRef(null);
    const [mount, setMount] = useState(false);
    const { width } = useWindowSize();

    const mouseDown = useRef(false);
    const startX = useRef(null);
    const scrollLeft = useRef(null);
    const startY = useRef(null);
    const scrollTop = useRef(null);

    useImperativeHandle(ref, () => ({
        ref: TabRef.current
    }));

    const startDragging = (e) => {
        if (!isScroll) return;
        TabRef.current.classList.add('cursor-grabbing');
        mouseDown.current = true;
        startX.current = e.pageX - TabRef.current.offsetLeft;
        scrollLeft.current = TabRef.current.scrollLeft;

        startY.current = e.pageY - TabRef.current.offsetTop;
        scrollTop.current = TabRef.current.scrollTop;
        isClick = true;
    };

    const stopDragging = (event) => {
        TabRef.current.classList.remove('cursor-grabbing');
        mouseDown.current = false;
    };

    const onDrag = (e) => {
        e.preventDefault();
        if (!mouseDown.current) return;
        const x = e.pageX - TabRef.current.offsetLeft;
        const scroll = x - startX.current;
        TabRef.current.scrollLeft = scrollLeft.current - scroll;

        const y = e.pageY - TabRef.current.offsetTop;
        const scrollY = y - startY.current;
        TabRef.current.scrollTop = scrollTop.current - scrollY;
        if (TabRef.current.scrollWidth > TabRef.current.clientWidth) isClick = false;
    };

    useEffect(() => {
        if (TabRef.current) {
            TabRef.current.addEventListener('mousemove', onDrag);
            TabRef.current.addEventListener('mousedown', startDragging, false);
            TabRef.current.addEventListener('mouseup', stopDragging, false);
            TabRef.current.addEventListener('mouseleave', stopDragging, false);
        }
        return () => {
            if (TabRef.current) {
                TabRef.current.removeEventListener('mousemove', onDrag);
                TabRef.current.removeEventListener('mousedown', startDragging, false);
                TabRef.current.removeEventListener('mouseup', stopDragging, false);
                TabRef.current.removeEventListener('mouseleave', stopDragging, false);
            }
        };
    }, [TabRef.current]);

    useEffect(() => {
        setMount(true);
    }, []);

    useEffect(() => {
        if (TabRef.current) {
            TabRef.current.querySelectorAll('.tab-item').forEach((el) => {
                if (el) {
                    el.classList[el.getAttributeNode('value').value === tab ? 'add' : 'remove'](
                        'tab-active',
                        '!font-semibold',
                        'dark:!text-gray-6',
                        '!text-txtPrimary'
                    );
                }
            });
        }
    }, [tab, TabRef, children, mount]);

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
    className: `h-full overflow-auto w-full no-scrollbar flex items-center relative ${className}`
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
        background-color: ${() => colors.teal};
        width: ${({ offset }) => offset?.w_after};
        left: ${({ offset }) => offset?.l_after};
        transition: all 0.2s;
    }
`;

export const TabItems = styled.div.attrs(({ value, className = '', isMobile = false, V2 = false }) => ({
    className: classnames(
        'text-sm font-semibold dark:font-medium p-4 whitespace-nowrap text-center cursor-pointer w-full sm:w-max tab-item sm:px-12',
        className,
        {
            'text-gray-1': !isMobile,
            'text-darkBlue-5': isMobile,
            'dark:hover:text-txtTabHover-dark': V2
        }
    ),
    id: `tab-item-${value}`
}))``;

export const TabItem = ({ onClick, ...props }) => {
    return <TabItems onClick={() => onClick(isClick)} {...props} />;
};

export const TabContent = ({ children, lazyload = false, index }) => {
    const active = currentKeyTab === index;
    return <div className={currentKeyTab !== index ? 'hidden' : ''}>{lazyload || active ? children : null}</div>;
};

export default Tabs;
