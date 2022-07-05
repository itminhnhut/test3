import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import CTooltip from 'components/common/Tooltip';

export const TextLiner = styled.div.attrs({
    className: 'text-[1.375rem] sm:text-2xl leading-8 font-semibold pb-[6px] w-max text-nao-white'
})`
    ${'' /* background:linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent; */}
`

export const CardNao = styled.div.attrs(({ noBg }) => ({
    className: classNames(
        `p-6 sm:px-10 sm:py-9 rounded-xl min-w-full sm:min-w-[372px] sm:min-h-[180px] flex flex-col justify-between flex-1 relative`,
        // { 'border-dashed border-[0.5px] border-[#7686B1]': noBg },
        { 'bg-nao-bg/[0.15]': !noBg }
    )
}))`
    background-image:${({ noBg, stroke = 0.8 }) => noBg && `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%237686B1' stroke-width='${stroke}' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`}
`
export const Divider = styled.div.attrs({
    className: 'h-[1px] opacity-[0.3] my-[10px]'
})`
 background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%237686B1' stroke-width='2' stroke-dasharray='3 %2c 10' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");
`

export const ButtonNao = styled.div.attrs({
    className: 'text-center flex items-center justify-center bg-nao-bg4 select-none cursor-pointer'
})`
   background:${({ active, isActive }) => isActive ? (active ? colors.nao.blue2 : '') : colors.nao.blue2};
   border-radius: 12px;

`

export const BackgroundHeader = styled.div.attrs({
    className: 'relative z-[9]'
})`
    background: linear-gradient(101.26deg, rgba(9, 61, 209,0.32) -5.29%, rgba(74, 232, 214,0.32) 113.82%);
`

export const Progressbar = styled.div.attrs({
    className: 'h-[6px] rounded-lg transition-all'
})`
    background: linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%);
    width:${({ percent }) => `${percent > 100 ? 100 : percent}%`};
`

export const Tooltip = ({ id }) => {
    return (
        <CTooltip id={id} place="top" effect="solid"
            className="!opacity-100 !rounded-lg !-mt-5 max-w-[250px] sm:max-w sm:w-full"
            arrowColor={colors.onus.bg2}
            backgroundColor={colors.onus.bg2}
        />
    )
}