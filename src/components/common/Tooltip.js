import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import colors from 'styles/colors';

const Tooltip = ({ children, arrowColor, isV3 = false, className = '', ...restProps }) => {
    const [currentTheme] = useDarkMode();
    const ref = useRef();
    const isDark = currentTheme === THEME_MODE.DARK;

    const arrow = useMemo(() => {
        const color = isV3 ? (isDark ? colors.dark[1] : colors.darkBlue) : isDark ? colors.dark[2] : colors.darkBlue;
        return arrowColor ? arrowColor : color;
    }, [arrowColor, isV3, currentTheme]);

    return (
        <TooltipWrapper isDark={isDark}>
            <ReactTooltip
                ref={ref}
                className={classNames(
                    'text-sm',
                    {
                        '!px-6 !py-[11px] !bg-dark dark:!bg-dark-1 text-white dark:text-gray-4 !opacity-100 !rounded-lg': isV3,
                        'bg-gray-15 dark:bg-dark-2 text-white dark:text-gray-4 !rounded-lg !opacity-100': !isV3
                    },
                    className
                )}
                arrowColor={arrow}
                place="left"
                effect="solid"
                {...restProps}
                afterShow={() => ref?.current?.updatePosition()}
            >
                {children}
            </ReactTooltip>
        </TooltipWrapper>
    );
};

const TooltipWrapper = styled.div`
    // .place-left {
    //   ::after {
    //     border-left-color: ${({ isDark }) => (isDark ? colors.darkBlue4 : colors.gray[3])} !important;
    //     border-top-color: transparent !important;
    //   }
    // }
    //
    // .__react_component_tooltip {
    //   ::after {
    //     border-top-color: ${({ isDark }) => (isDark ? colors.darkBlue4 : colors.gray[3])} !important;
    //   }
    // }
`;

export default Tooltip;
