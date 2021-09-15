import styled from 'styled-components';

export const Track = styled.div`
  position: relative;
  margin-left: 4px;
  width: calc(100% - 8px);
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
  background-color: #8D9091;
  border-radius: 4px;
  user-select: none;
  box-sizing: border-box;
  height: 4px;
  top: 6px;
  z-index: 11;
`;

export const SliderBackground = styled.div`
  position: absolute;
  background-color: #CCCCCC;
  border-radius: 4px;
  user-select: none;
  box-sizing: border-box;
  width: 100%;
  top: 6px;
  height: 4px;
  z-index: 10;
`;

export const DotContainer = styled.div`
  position: absolute;
  z-index: 12;
  width: 100%;
`;

export const Dot = styled.span`
  position: absolute;
  top: -4px;
  //top: 10px;
  left: ${({ percentage }) => `calc(${percentage}% - 6px)`};
  border-radius: 50%;
  width: 8px;
  height: 8px;
  box-sizing: content-box;
   background-color:   ${({ active }) => (active ? '#8D9091' : '#CCCCCC')};;
   ${'' /* background-color:'#8D9091' */}
  z-index: 30;
  ${'' /* border: solid 2px white; */}
  transition: transform .2s; /* Animation */
  &:hover {
    background-color: #8D9091;
    transform: scale(1.4);
  }
`;

export const Thumb = styled.div`
  position: relative;
  display: block;
  content: "";
  width: 12px;
  height: 12px;
  background-color: #8D9091;
  ${'' /* border: solid 2px white; */}
  border-radius: 50%;
  ${'' /* box-shadow: 0px 4px 8px 1px rgba(2, 8, 61, 0.13); */}
  user-select: none;
  cursor: pointer;
`;

export const ThumbLabel = styled.div`
  position: absolute;
  top: -1.25rem;
  right: -10px;
  text-align: center;
  color: #8D9091;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;

`;
