import classNames from 'classnames';
import React from 'react';
import styled, { css } from 'styled-components';
import colors from 'styles/colors';
import Chip from '../Chip';

const TabV2 = ({ wrapperClassName, activeTabKey, tabs, onChangeTab, isOverflow, chipClassName, isDeepBackground, ...props }) => {
    return (
        <TabWrapper className={classNames('flex gap-4 items-center', wrapperClassName)} isOverflow={isOverflow}>
            {tabs.map((tab) => {
                const isActive = tab.key === activeTabKey;
                return (
                    <Chip {...props} selected={isActive} key={tab.key} onClick={() => onChangeTab(tab.key)} className={`min-w-max ${chipClassName}`} isDeepBackground={isDeepBackground}>
                        {tab.children}
                    </Chip>
                );
            })}
        </TabWrapper>
    );
};

const TabWrapper = styled.div`
    ${({ isOverflow }) =>
        !isOverflow
            ? css`
                  flex-wrap: wrap;
              `
            : 'overflow-x: auto;padding-bottom:16px;'};
`;

const Tab = styled.button`
    color: ${({ active }) => (active ? colors.teal : colors.darkBlue5)};
    padding: 8px 16px;
    border-radius: 10000px;
    background: ${({ active }) => (active ? `${colors.teal}10` : 'transparent')};
    cursor: ${({ active }) => (active ? 'default' : 'pointer')};
    font-weight: ${({ active }) => (active ? 600 : 400)};
    min-width: fit-content;
`;

export default TabV2;
