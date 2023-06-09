import Tooltip from 'components/common/Tooltip';
import { HelpIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { isArray } from 'lodash';
import React from 'react';
import colors from 'styles/colors';

const HeaderTooltip = ({ className, tooltipId, title, tooltipContent, isMobile = false }) => {
    // Setup theme
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    return (
        <div className={className}>
            <Tooltip
                overridePosition={(e) => {
                    if(e?.left < 0) return {
                        left: e.left < 16 ? 16 : e.left,
                        top: e.top
                    }
                    return e
                }}
                id={tooltipId}
                place={'top'}
                arrowColor={isDark ? colors.dark['1'] : colors.gray['11']}
                className={`max-w-[${isMobile ? 300 : 520}px] !px-6 !py-3 mr-4 !bg-gray-11 dark:!bg-dark-1 !text-gray-15 dark:!text-gray-4`}
            >
                {isArray(tooltipContent) && (
                    <ul className="list-disc marker:text-xs ml-1">
                        {tooltipContent.map((item) => (
                            <li id={item}>{item}</li>
                        ))}
                    </ul>
                )}
            </Tooltip>
            <div onClick={(e) => e.stopPropagation()} className="flex items-center cursor-pointer w-max" data-tip={isArray(tooltipContent) ? '' : tooltipContent} data-for={tooltipId}>
                <div className="text-base md:text-2xl font-semibold pr-2">{title}</div>
                <HelpIcon color="currentColor" />
            </div>
        </div>
    );
};

export default HeaderTooltip;
