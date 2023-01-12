import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { ExchangeOrderEnum } from 'src/redux/actions/const';

const ButtonClip = ({ mode, active, children, ...props }) => {
    return (
        <ClipPath mode={mode} active={active} {...props}>
            {children}
            <span className="bg-dark-3"></span>
        </ClipPath>
    );
};

export default ButtonClip;

const ClipPath = styled.div.attrs(({ mode, active }) => ({
    className: classNames(
        'h-9 text-sm flex items-center justify-center py-1 font-semibold',
        'w-full text-txtSecondary-dark bg-darkBlue-3 cursor-pointer relative',
        {
            'rounded-l-md mr-[-5px]': mode === ExchangeOrderEnum.Side.BUY,
            '!bg-teal !text-white': mode === ExchangeOrderEnum.Side.BUY && active,
            'rounded-r-md ml-[-5px]': mode === ExchangeOrderEnum.Side.SELL,
            '!bg-red !text-white': mode === ExchangeOrderEnum.Side.SELL && active
        }
    )
}))`
    clip-path: ${({ mode }) =>
        `polygon(0% 0%, calc(100% - ${
            mode === ExchangeOrderEnum.Side.BUY ? '16px' : '0px'
        }) 0%, 100% 100%, ${mode === ExchangeOrderEnum.Side.BUY ? '0' : '16px'} 100%);`};
`;
