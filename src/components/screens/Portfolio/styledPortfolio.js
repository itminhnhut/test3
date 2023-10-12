import styled from "styled-components";
import colors from "../../../styles/colors";

export const ComponentTabWrapper = styled.div`
    width: 100%;
    max-width: 90vw;
    border-bottom: ${({ haveUnderline }) => haveUnderline ? '1px solid #E5E5E5' : 'none'};
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    padding-bottom: 8px;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none; 
    
    &::-webkit-scrollbar { 
        display: none; 
    }
`

export const ComponentTabItem = styled.div`
    margin-right: 32px;
    text-align: center;
    width: auto;
    height: 24px;
    font-weight: ${({ active }) => active ? 600 : 500};
    position: relative;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    color: ${({ active }) => active ? '#000000' : '#A0AEC0'};
  
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items: center
`


export const ComponentTabUnderline = styled.div`
    :after {
        content: '';
        width: 50px;
        height: 2px;
        background: ${colors.mint};
        position:relative;
        bottom: -8px;
        display: block;
    }
`

export const Progressbar = styled.div.attrs(({ height = 10 }) => ({
    className: `rounded-lg transition-all`,
}))`
    background: ${({ background }) =>
        background
            ? background
            : "linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)"};
    width: ${({ percent }) => `${percent > 100 ? 100 : percent}%`};
    height: ${({ height }) => `${height || 6}px`};
`;