import colors from 'styles/colors';
import CheckCircle from 'components/svg/CheckCircle';
import WarningTriangle from 'components/svg/WarningTriangle';
import classnames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

const types = {
    DEFAULT: 'default',
    SUCCESS: 'success',
    WARNING: 'warning'
};

const typeStyles = {
    [types.DEFAULT]: {
        backgroundColor: 'rgba(34,41,64,0.5)',
        color: colors.grey4
    },
    [types.SUCCESS]: {
        backgroundColor: 'rgba(71,204,133,0.1)',
        color: colors.teal,
        icon: CheckCircle
    },
    [types.WARNING]: {
        backgroundColor: 'rgba(255,198,50,0.15)',
        color: colors.yellow1,
        icon: WarningTriangle
    }
};

function TagV2({
    type = types.DEFAULT,
    children,
    className = ''
}) {
    const style = typeStyles[type];

    return <span
        style={{
            backgroundColor: style.backgroundColor,
            color: style.color
        }}
        className={classnames(className, 'flex items-center leading-7 rounded-full w-fit px-4')}
    >
        {/* {style.icon && React.createElement(style.icon, {className: 'mr-2'})} */}
        <span>{children}</span>
    </span>;
}

TagV2.propTypes = {
    type: PropTypes.oneOf(Object.values(types)),
    children: PropTypes.node.isRequired,
    className: PropTypes.string
}

export default TagV2;
