import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import CTooltip from 'components/common/Tooltip';
import { useMemo, useState } from 'react';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { getS3Url, formatNumber } from 'redux/actions/utils';

export const TextLiner = styled.div.attrs({
    className: 'text-[1.375rem] sm:text-2xl leading-8 font-semibold pb-[6px] w-max text-nao-white'
})`
    background: ${({ liner }) => liner && `linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)`};
    -webkit-background-clip: ${({ liner }) => liner && `text`};
    -webkit-text-fill-color: ${({ liner }) => liner && `transparent`};
    background-clip: ${({ liner }) => liner && `text`};
    text-fill-color: ${({ liner }) => liner && `transparent`};
`

export const CardNao = styled.div.attrs(({ noBg, customHeight }) => ({
    className: classNames(
        `p-6 sm:px-10 sm:py-9 rounded-xl min-w-full sm:min-w-[372px] ${customHeight ? customHeight : 'sm:min-h-[180px]'} flex flex-col justify-between flex-1 relative`,
        // { 'border-dashed border-[0.5px] border-[#7686B1]': noBg },
        { 'bg-nao-bg/[0.15]': !noBg }
    )
}))`
    background-image:${({ noBg, stroke = 0.8 }) => noBg && `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%237686B1' stroke-width='${stroke}' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`}
`

export const SectionNao = styled.div.attrs(({ noBg }) => ({
    className: classNames(
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

export const Table = ({ dataSource, children, classHeader = '', onRowClick }) => {
    const mouseDown = useRef(false);
    const startX = useRef(null)
    const scrollLeft = useRef(null)
    const startY = useRef(null)
    const scrollTop = useRef(null)
    const { t } = useTranslation();
    const content = useRef(null);
    const header = useRef(null);
    const timer = useRef(null);

    const onScroll = (e) => {
        header.current.scrollTo({
            left: e.target.scrollLeft,
        })
    }

    const startDragging = (e) => {
        content.current.classList.add('cursor-grabbing');
        mouseDown.current = true;
        startX.current = e.pageX - content.current.offsetLeft;
        scrollLeft.current = content.current.scrollLeft;

        startY.current = e.pageY - content.current.offsetTop;
        scrollTop.current = content.current.scrollTop;
    }

    const stopDragging = (event) => {
        content.current.classList.remove('cursor-grabbing');
        mouseDown.current = false;
    };

    const onDrag = (e) => {
        e.preventDefault();
        if (!mouseDown.current) return;
        const x = e.pageX - content.current.offsetLeft;
        const scroll = x - startX.current;
        content.current.scrollLeft = scrollLeft.current - scroll;

        const y = e.pageY - content.current.offsetTop;
        const scrollY = y - startY.current;
        content.current.scrollTop = scrollTop.current - scrollY;
    }

    const checkScrollBar = (element, dir) => {
        if (!element) return null;
        dir = (dir === 'vertical') ?
            'scrollTop' : 'scrollLeft';

        var res = !!element[dir];

        if (!res) {
            element[dir] = 1;
            res = !!element[dir];
            element[dir] = 0;
        }
        return res;
    }


    useEffect(() => {
        if (content.current) {
            content.current.addEventListener('mousemove', onDrag)
            content.current.addEventListener('mousedown', startDragging, false);
            content.current.addEventListener('mouseup', stopDragging, false);
            content.current.addEventListener('mouseleave', stopDragging, false);
        }
        return () => {
            if (content.current) {
                content.current.removeEventListener('mousemove', onDrag)
                content.current.removeEventListener('mousedown', startDragging, false);
                content.current.removeEventListener('mouseup', stopDragging, false);
                content.current.removeEventListener('mouseleave', stopDragging, false);
            }
        }
    }, [content.current])
    const isScroll = checkScrollBar(content.current, 'vertical');

    return (
        <CardNao noBg className="mt-5 !py-6 !px-3 max-h-[400px] !justify-start">
            <div ref={header} className={classNames(
                'z-10 pb-3 border-b border-nao-grey/[0.2] bg-transparent overflow-hidden',
                'px-3 nao-table-header flex items-center text-nao-grey text-sm font-medium justify-between pr-7 w-full',
                classHeader
            )}>
                {children.map((item, indx) => (
                    <Column key={indx} {...item.props} classHeader={classNames(
                        { 'flex-1': indx !== 0 },
                    )} />
                ))}
            </div>
            <div onScroll={onScroll} ref={content}
                className={classNames(
                    'nao-table-content mt-3 overflow-auto nao-table  ',
                    { 'pr-[10px]': isScroll }
                )}>
                {Array.isArray(dataSource) && dataSource?.length > 0 ?
                    dataSource.map((item, index) => {
                        return (
                            <div
                                onDoubleClick={() => onRowClick && onRowClick(item)}
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
                                    const suffix = child?.props?.suffix;
                                    const decimal = child?.props?.decimal;
                                    const fieldName = child?.props?.fieldName;
                                    return (
                                        <div style={{ minWidth, textAlign: align }} key={indx}
                                            className={classNames(
                                                `min-h-[48px] flex items-center text-sm ${className} ${_align}`,
                                                'break-all',
                                                { 'flex-1': indx !== 0 }
                                            )}>
                                            {cellRender ? cellRender(item[fieldName], item) :
                                                decimal >= 0 ? formatNumber(item[fieldName], decimal, 0, true) :
                                                    fieldName === 'index' ? index + 1 : item[fieldName]
                                            }
                                            {suffix ? ` ${suffix}` : ''}
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

export const getColor = (value) => {
    return !!value ? value > 0 ? 'text-nao-green2' : 'text-nao-red' : '';
}

export const renderPnl = (data, item) => {
    const prefix = !!data && data > 0 ? '+' : ''
    return <div className={`${getColor(data)}`}>{prefix + formatNumber(data, 2, 0, true)}%</div>
}