import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useMemo, useRef } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import colors from 'styles/colors';

const Tooltip = ({ children, arrowColor, isV3 = false, ...restProps }) => {
    const [currentTheme] = useDarkMode();
    const ref = useRef();

    const arrow = useMemo(() => {
        return arrowColor ? arrowColor : currentTheme === THEME_MODE.DARK ? colors.hover.dark : colors.grey3;
    }, [arrowColor, isV3]);

    return (
        <TooltipWrapper isDark={currentTheme === THEME_MODE.DARK}>
            <ReactTooltip
                ref={ref}
                className={classNames('text-sm', {
                    '!px-6 !py-[11px] !bg-hover-dark !opacity-100 !rounded-lg': isV3,
                    '!text-txtPrimary dark:!text-txtPrimary-dark !bg-gray-3 dark:!bg-darkBlue-4 !rounded-lg !opacity-100': !isV3
                })}
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
    //     border-left-color: ${({ isDark }) => (isDark ? colors.darkBlue4 : colors.grey3)} !important;
    //     border-top-color: transparent !important;
    //   }
    // }
    //
    // .__react_component_tooltip {
    //   ::after {
    //     border-top-color: ${({ isDark }) => (isDark ? colors.darkBlue4 : colors.grey3)} !important;
    //   }
    // }
`;

export default Tooltip;
