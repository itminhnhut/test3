import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { ExchangeOrderEnum } from 'src/redux/actions/const';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const ButtonClip = ({ mode, active, children, isFuture = false, ...props }) => {
    const buy = isFuture ? VndcFutureOrderType.Side.BUY : ExchangeOrderEnum.Side.BUY;
    const sell = isFuture ? VndcFutureOrderType.Side.SELL : ExchangeOrderEnum.Side.SELL;

    return (
        <ClipPath buy={buy} sell={sell} mode={mode} active={active} {...props}>
            {children}
            <span className="bg-dark-3"></span>
        </ClipPath>
    );
};

export default ButtonClip;

const ClipPath = styled.div.attrs(({ mode, active, buy, sell }) => ({
    className: classNames(
        'h-9 text-sm flex items-center justify-center py-1 font-semibold',
        'w-full text-txtPrimary dark:text-txtSecondary-dark bg-gray-13 dark:bg-darkBlue-3 cursor-pointer relative',
        {
            'rounded-l-md mr-[-5px]': mode === buy,
            '!bg-teal !text-white': mode === buy && active,
            'rounded-r-md ml-[-5px]': mode === sell,
            '!bg-red !text-white': mode === sell && active
        }
    )
}))`
    clip-path: ${({ mode, buy }) => `polygon(0% 0%, calc(100% - ${mode === buy ? '16px' : '0px'}) 0%, 100% 100%, ${mode === buy ? '0' : '16px'} 100%);`}
`;
