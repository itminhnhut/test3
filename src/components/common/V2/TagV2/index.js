import colors from 'styles/colors';
import CheckCircle from 'components/svg/CheckCircle';
import WarningTriangle from 'components/svg/WarningTriangle';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { useWindowSize } from 'react-use';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

export const TYPES = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    FAILED: 'failed'
};

const typeStyles = {
    [TYPES.DEFAULT]: {},
    [TYPES.SUCCESS]: {
        backgroundColor: 'bg-teal/[0.1]',
        colorContent: 'text-green-3 dark:text-teal',
        icon: CheckCircle
    },
    [TYPES.FAILED]: {
        backgroundColor: 'bg-red/[0.1]',
        colorContent: 'text-red'
    },
    [TYPES.WARNING]: {
        backgroundColor: 'bg-yellow-2/[0.1]',
        icon: WarningTriangle,
        colorContent: 'text-yellow-2'
    }
};

function TagV2({ type = TYPES.DEFAULT, children, className = '', icon = true, labelClassname = '' }) {
    const style = typeStyles[type];

    const [theme] = useDarkMode();
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <span
            className={classnames(
                className,
                `flex items-center leading-7 rounded-full min-w-[fit-content] w-fit px-3 md:px-4 py-1 select-none ${
                    style && style?.backgroundColor ? style.backgroundColor : 'bg-gray-11 dark:bg-divider-dark/[0.5]'
                }`
            )}
        >
            {icon &&
                style?.icon &&
                React.createElement(style.icon, {
                    className: 'mr-2',
                    size: isMobile ? 12 : 16
                })}
            <span
                // style={{ color: style.color || defaultColor }}
                className={`text-xs md:text-sm ${style?.colorContent ? style.colorContent : 'text-gray-1 dark:text-gray-7'} ${labelClassname}`}
            >
                {children}
            </span>
        </span>
    );
}

TagV2.propTypes = {
    type: PropTypes.oneOf(Object.values(TYPES)),
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default TagV2;
