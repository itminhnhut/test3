import React from 'react';
import styled, { css } from 'styled-components';
import colors from 'styles/colors';

const TabV2 = ({ activeTabKey, tabs, onChangeTab, isOverflow }) => {
    return (
        <TabWrapper isOverflow={isOverflow}>
            {tabs.map((tab) => {
                const isActive = tab.key === activeTabKey;
                return (
                    <Tab
                        className={`border flex ${isActive ? 'border-teal ' : 'border-divider dark:border-divider-dark '}`}
                        onClick={() => onChangeTab(tab.key)}
                        key={tab.key}
                        active={isActive}
                        disabled={isActive}
                        id={tab.key}
                    >
                        {tab.children}
                    </Tab>
                );
            })}
        </TabWrapper>
    );
};

const TabWrapper = styled.div.attrs({ className: 'flex gap-4 items-center' })`
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
