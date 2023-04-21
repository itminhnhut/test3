import React, { memo, useEffect, useState } from 'react';
import { CheckedIcon } from 'components/svg/SvgIcon';
import { Copy } from 'react-feather';
import { copy } from 'redux/actions/utils';
import PropTypes from 'prop-types';
import colors from 'styles/colors';

const CopyComponent = memo(({ text = '', setText, value, className = '', size = 16, label, textClass, copyClass, checkedClass, color = 'currentColor' }) => {
    const [copied, setCopied] = useState(false);
    const title = label ?? text;
    useEffect(() => {
        if (value) setCopied(value === text);
    }, [value]);

    useEffect(() => {
        if (copied)
            setTimeout(() => {
                setCopied(false);
            }, 3000);
    }, [copied]);

    return (
        <div
            className={`flex items-center space-x-2 cursor-pointer ${className}`}
            onClick={() =>
                copy(text, () => {
                    setCopied(true);
                    if (setText) setText(text);
                })
            }
        >
            <span className={textClass}>{title}</span>
            {!copied ? <Copy size={size} className={copyClass} color={color} /> : <CheckedIcon size={size} color={colors.teal} className={checkedClass} />}
        </div>
    );
});

CopyComponent.propTypes = {
    text: PropTypes.string,
    setText: PropTypes.func,
    value: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    copyClass: PropTypes.string,
    checkedClass: PropTypes.string,
    textClass: PropTypes.string,
    color: PropTypes.string
};

export default CopyComponent;
