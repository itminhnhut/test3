import React from 'react';
import styled from "styled-components";
import { VndcFutureOrderType } from './VndcFutureOrderType';
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next'

const TabOrderVndc = ({ side, setSide }) => {
    const { t } = useTranslation()
    return (
        <div className="flex items-center h-[32px] mt-[20px]">
            <TabItem
                className='rounded-l-[6px]'
                allowArrow
                onClick={() => setSide(VndcFutureOrderType.Side.BUY)}
                active={side === VndcFutureOrderType.Side.BUY}>{t('common:buy')}</TabItem>
            <TabItem
                className='rounded-r-[6px]'
                onClick={() => setSide(VndcFutureOrderType.Side.SELL)}
                active={side === VndcFutureOrderType.Side.SELL}>{t('common:sell')}</TabItem>
        </div>
    );
};

const TabItem = styled.div`
    display:flex;
    align-items: center;
    justify-content: center;
    width: ${({ allowArrow }) => allowArrow ? 'calc(50% - 10px)' : 'calc(50% + 10px)'};;
    height:100%;
    cursor:pointer;
    color: ${({ active }) => active ? colors.white : colors.grey1};
    background-color:  ${({ active, allowArrow }) => active ? (allowArrow ? colors.teal : colors.red) : colors.grey5};
    font-weight: 500;
    position:relative;
    &::after {
        display:  ${({ allowArrow }) => allowArrow ? 'block' : 'none'};
        content: '';
        position: absolute;
        right: -20px;
        border-left: ${({ active, allowArrow }) => `20px solid ${active && allowArrow ? colors.teal : colors.grey5}`};
        border-top: 16px solid transparent;
        border-bottom: 16px solid transparent;
        z-index:2
    }
`

export default TabOrderVndc;