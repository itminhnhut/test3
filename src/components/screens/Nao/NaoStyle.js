import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';

export const TextLiner = styled.div.attrs({
    className: 'text-2xl font-semibold pb-[6px]'
})`
    background:linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
`

export const CardNao = styled.div.attrs(({ noBg }) => ({
    className: classNames(
        `px-10 py-9 rounded-xl min-w-[372px] min-h-[180px] flex flex-col justify-between flex-1`,
        // { 'border-dashed border-[0.5px] border-[#7686B1]': noBg },
        { 'bg-nao-bg/[0.15] border-[2px] border-nao-border/[0.15] ': !noBg }
    )
}))`
    background-image:${({ noBg }) => noBg && `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%237686B1' stroke-width='0.8' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`} 
`