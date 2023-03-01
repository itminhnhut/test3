import colors from 'styles/colors';
import CheckCircle from 'components/svg/CheckCircle';
import WarningTriangle from 'components/svg/WarningTriangle';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { useWindowSize } from 'react-use';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const types = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    FAILED: 'failed'
};

const typeStyles = {
    [types.DEFAULT]: {},
    [types.SUCCESS]: {
        backgroundColor: 'rgba(71,204,133,0.1)',
        color: colors.teal,
        colorContent: 'text-green-3 dark:text-teal',
        icon: CheckCircle
    },
    [types.FAILED]: {
        backgroundColor: 'rgba(249,54,54 0.1)',
        color: '#F93636',
        colorContent: 'text-[#8694b2]',
    },
    [types.WARNING]: {
        backgroundColor: 'rgba(255,198,50,0.15)',
        color: colors.yellow['1'],
        icon: WarningTriangle,
        colorContent: 'text-yellow-1',
    }
};

function TagV2({
    type = types.DEFAULT,
    children,
    className = ''
}) {
    const style = typeStyles[type];

    const [theme] = useDarkMode();
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const defaultBgColor = theme === THEME_MODE.DARK ? 'rgba(34, 41, 64, 0.5)' : 'rgba(242, 244, 245, 0.7)';
    const defaultColor = theme === THEME_MODE.DARK ? colors.gray['7'] : colors.gray['1'];

    return (
        <span
            style={{
                backgroundColor: style.backgroundColor || defaultBgColor
            }}
            className={classnames(className, 'flex items-center leading-7 rounded-full w-fit px-3 md:px-4 py-1')}
        >
            {style.icon && React.createElement(style.icon, {
                className: 'mr-2',
                size: isMobile ? 12 : 16
            })}
            <span
                // style={{ color: style.color || defaultColor }}
                className={`text-xs md:text-sm ${style?.colorContent ? style.colorContent : 'text-gray-1 dark:text-gray-7'}`}
            >{children}</span>
        </span>
    );
}

TagV2.propTypes = {
    type: PropTypes.oneOf(Object.values(types)),
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default TagV2;
