import styled from 'styled-components';
import colors from 'styles/colors';

export const Track = styled.div`
    position: relative;
    margin-left: 4px;
    width: ${({ onusMode }) => `calc(100% - ${onusMode ? '6.5px' : '8px'})`};
    cursor: pointer;
    display: flex;
    padding-bottom: 8px;
    padding-top: 8px;
    border-radius: 2px;
    user-select: none;
    box-sizing: border-box;
    height: 4px;
`;

export const Active = styled.div`
    position: absolute;
    background: ${({ bgColorSlide }) => (bgColorSlide ? bgColorSlide : colors.teal)};
    border-radius: 4px;
    user-select: none;
    box-sizing: border-box;
    height: ${({ onusMode, height }) => (height ? `${height}px` : onusMode ? '5px' : '2.5px')};
    top: 6.5px;
    z-index: 11;
`;

export const SliderBackground = styled.div`
    position: absolute;
    background-color: ${({ isDark, BgColorLine, onusMode }) =>
        BgColorLine ? BgColorLine : onusMode ? (isDark ? colors.dark[2] : colors.gray[11]) : isDark ? colors.dark[2] : colors.gray[11]};
    border-radius: 4px;
    user-select: none;
    box-sizing: border-box;
    width: 100%;
    top: 6.5px;
    height: ${({ onusMode, height }) => (height ? `${height}px` : onusMode ? '5px' : '2.5px')};
    z-index: 10;
`;

export const DotContainer = styled.div`
    position: absolute;
    z-index: 12;
    width: 100%;
`;

export const Dot = styled.span`
    position: absolute;
    top: ${({ onusMode, active }) => (onusMode ? '-6.5px' : '-4px')};
    //top: 10px;
    left: ${({ percentage, onusMode }) => `calc(${percentage}% - ${onusMode ? '6.5px' : '4px'})`};
    /* clip-path:${({ onusMode }) => (onusMode ? 'unset' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)')}; */
    border-radius: ${({ onusMode }) => (onusMode ? '50%' : '50%')};
    width: ${({ onusMode, active }) => (onusMode ? (active ? '15px' : '9px') : '8px')};
    height: ${({ onusMode, active }) => (onusMode ? (active ? '15px' : '9px') : '8px')};
    box-sizing: content-box;
    background-color: ${({ active, bgColorActive, bgColorDot }) => (active ? (bgColorActive ? bgColorActive : colors.teal) : bgColorDot)};
    z-index: 30;
    border: ${({ onusMode, active, isDark }) => (onusMode && !active ? `3px solid ${isDark ? colors.dark[4] : colors.gray[13]}` : 'none')};
    transition: transform 0.2s; /* Animation */
    /* margin-left:${({ onusMode }) => (onusMode ? 0 : '-4px')} */

    &:hover {
        background-color: ${({ bgColorActive }) => (bgColorActive ? bgColorActive : colors.teal)};
        transform: scale(1.4);
    }
    &:after {
        content: '';
        display: ${({ onusMode }) => (onusMode ? 'none' : 'block')};
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        z-index: -1;
        background-color: ${({ active, isDark }) => (isDark ? (active ? colors.teal : colors.darkBlue3) : active ? colors.teal : colors.white)};
    }
`;

export const Thumb = styled.div`
    position: relative;
    display: block;
    content: '';
    top: ${({ onusMode }) => (onusMode ? '1px' : '0')};
    width: ${({ onusMode, naoMode }) => (naoMode ? '32px' : onusMode ? '20px' : '16px')};
    height: ${({ onusMode, naoMode }) => (naoMode ? '32px' : onusMode ? '20px' : '16px')};
    /* clip-path:${({ onusMode }) => (onusMode ? 'unset' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)')}; */
    border-radius: ${({ onusMode }) => (onusMode ? '50%' : '50%')};
    border: ${({ onusMode, naoMode }) => (onusMode && !naoMode ? '4px solid #47cc85' : 'none')};
    background: ${({ isZero, isDark, bgColorActive, naoMode }) =>
        naoMode ? 'linear-gradient(101.26deg, #00144E -5.29%, #003A33 113.82%)' : bgColorActive ? bgColorActive : colors.teal};
    user-select: none;
    cursor: pointer;
    pointer-events: none;
`;

export const ThumbLabel = styled.div`
    position: absolute;
    top: -1.25rem;
    right: -10px;
    text-align: center;
    color: ${({ bgColorActive, isDark }) => (bgColorActive ? bgColorActive : isDark ? colors.dark[2] : colors.teal)};
    font-size: 12px;
    font-style: normal;
    font-weight: ${({ onusMode }) => (onusMode ? '400' : '600')};
    margin-top: ${({ onusMode }) => (onusMode ? '-3px' : '0')};
    line-height: 18px;
    left: ${({ min, max }) => (min ? '16px' : max ? 0 : null)};
`;
