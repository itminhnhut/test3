import colors from 'styles/colors';
import CheckCircle from 'components/svg/CheckCircle';
import WarningTriangle from 'components/svg/WarningTriangle';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { useWindowSize } from 'react-use';

const types = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning',
    FAILED: 'failed'
};

const typeStyles = {
    [types.DEFAULT]: {
        backgroundColor: 'rgba(34,41,64,0.5)',
        color: colors.teal
    },
    [types.SUCCESS]: {
        backgroundColor: 'rgba(71,204,133,0.1)',
        color: colors.teal,
        icon: CheckCircle
    },
    [types.FAILED]: {
        backgroundColor: 'rgba(249,54,54 0.1)',
        color: '#F93636'
    },
    [types.WARNING]: {
        backgroundColor: 'rgba(255,198,50,0.15)',
        color: colors.yellow['1'],
        icon: WarningTriangle
    }
};

function TagV2({
    type = types.DEFAULT,
    children,
    className = ''
}) {
    const style = typeStyles[type];

    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <span
            style={{
                backgroundColor: style.backgroundColor,
                color: style.color
            }}
            className={classnames(className, 'flex items-center leading-7 rounded-full w-fit px-3 md:px-4 py-1')}
        >
            {style.icon && React.createElement(style.icon, {
                className: 'mr-2',
                size: isMobile ? 12 : 16
            })}
            <span className='text-xs md:text-sm'>{children}</span>
        </span>
    );
}

TagV2.propTypes = {
    type: PropTypes.oneOf(Object.values(types)),
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default TagV2;
