import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import CTooltip from 'components/common/Tooltip';
import { useMemo, useState } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

export const TextLiner = styled.div.attrs({
    className: 'text-[1.375rem] sm:text-2xl leading-8 font-semibold pb-[6px] w-max text-nao-white'
})`
    background: ${({ linder }) => linder && `linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)`};
    -webkit-background-clip: ${({ linder }) => linder && `text`};
    -webkit-text-fill-color: ${({ linder }) => linder && `transparent`};
    background-clip: ${({ linder }) => linder && `text`};
    text-fill-color: ${({ linder }) => linder && `transparent`};
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


export const Column = ({ title, minWidth = 100, sortable, align = 'left', classHeader = '' }) => {
    return (
        <div style={{ minWidth, textAlign: align }} className={classHeader}> {title}</div>
    )
}

export const Table = ({ dataSource, children }) => {
    const { width } = useWindowSize();
    const mouseDown = useRef(false);
    const startX = useRef(null)
    const scrollLeft = useRef(null)
    const startY = useRef(null)
    const scrollTop = useRef(null)
    const { t } = useTranslation();

    const onScroll = (e) => {
        const header = document.querySelector('.nao-table-header');
        header.scrollTo({
            left: e.target.scrollLeft,
        })
    }

    const startDragging = (e) => {
        const el = document.querySelector('.nao-table-content')
        el.classList.add('cursor-grabbing');
        mouseDown.current = true;
        startX.current = e.pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;

        startY.current = e.pageY - el.offsetTop;
        scrollTop.current = el.scrollTop;
    }

    const stopDragging = (event) => {
        const el = document.querySelector('.nao-table-content')
        el.classList.remove('cursor-grabbing');
        mouseDown.current = false;
    };

    const onDrag = (e) => {
        e.preventDefault();
        if (!mouseDown.current) return;
        const el = document.querySelector('.nao-table-content')
        const x = e.pageX - el.offsetLeft;
        const scroll = x - startX.current;
        el.scrollLeft = scrollLeft.current - scroll;

        const y = e.pageY - el.offsetTop;
        const scrollY = y - startY.current;
        el.scrollTop = scrollTop.current - scrollY;
    }

    useEffect(() => {
        const el = document.querySelector('.nao-table-content')
        el.addEventListener('mousemove', onDrag)
        el.addEventListener('mousedown', startDragging, false);
        el.addEventListener('mouseup', stopDragging, false);
        el.addEventListener('mouseleave', stopDragging, false);
        return () => {
            el.removeEventListener('mousemove', onDrag)
            el.removeEventListener('mousedown', startDragging, false);
            el.removeEventListener('mouseup', stopDragging, false);
            el.removeEventListener('mouseleave', stopDragging, false);
        }
    }, [])

    return (
        <CardNao noBg className="mt-5 !py-6 !px-3 max-h-[400px]">
            <div className={classNames(
                'sticky top-0 z-10 pb-3 border-b border-nao-grey/[0.2] bg-transparent overflow-hidden',
                'px-3 nao-table-header flex items-center text-nao-grey text-sm font-medium justify-between pr-7 w-full',
            )}>
                {children.map((item, indx) => (
                    <Column key={indx} {...item.props} classHeader={classNames(
                        { 'flex-1': indx !== 0 },
                        { ...item?.classHeader }
                    )} />
                ))}
            </div>
            <div onScroll={onScroll}
                className={classNames(
                    'nao-table-content mt-3 overflow-auto nao-table pr-[10px] cursor-grabbing',
                )}>
                {Array.isArray(dataSource) && dataSource?.length > 0 ?
                    dataSource.map((item, index) => {
                        return (
                            <div
                                key={`row_${index}`} className={classNames(
                                    'px-3 flex items-center flex-1 min-w-max',
                                    { 'bg-nao/[0.15] rounded-lg': index % 2 !== 0 },
                                )}>
                                {children.map((child, indx) => {
                                    const minWidth = child?.props?.minWidth;
                                    const className = child?.props?.className ?? '';
                                    const align = child?.props?.align ?? 'left';
                                    const _align = align === 'right' ? 'flex justify-end' : '';
                                    const cellRender = child?.props?.cellRender;
                                    return (
                                        <div style={{ minWidth, textAlign: align }} key={indx}
                                            className={classNames(
                                                `min-h-[48px] flex items-center text-sm ${className} ${_align}`,
                                                { 'flex-1': indx !== 0 }
                                            )}>
                                            {cellRender ? cellRender(item[child?.props.fieldName], item) : item[child?.props.fieldName]}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })
                    :
                    <div className={`flex items-center justify-center flex-col m-auto`}>
                        <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                        <div className="text-xs text-nao-grey mt-1">{t('common:no_data')}</div>
                    </div>
                }

            </div>
        </CardNao>
    )
}