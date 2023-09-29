import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import CTooltip from 'components/common/Tooltip';
import { Children, useMemo, useState } from 'react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import _, { isFunction } from 'lodash';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import CheckCircle from 'components/svg/CheckCircle';
import CrossCircle from 'components/svg/CrossCircle';
import { WarningFilledIcon, RemoveCircleIcon } from 'components/svg/SvgIcon';
import { IconArrowOnus } from 'components/common/Icons';
import { QUOTE_ASSET } from 'constants/constants';
import { useSelector } from 'react-redux';
import AvatarFrame from 'components/common/AvatarFrame';

export const TextLiner = styled.div.attrs({
    className: 'text-xl sm:text-2xl font-semibold w-max text-txtPrimary dark:text-txtPrimary-dark'
})`
    background: ${({ liner }) => liner && colors.teal};
    -webkit-background-clip: ${({ liner }) => liner && `text`};
    -webkit-text-fill-color: ${({ liner }) => liner && `transparent`};
    background-clip: ${({ liner }) => liner && `text`};
    text-fill-color: ${({ liner }) => liner && `transparent`};
`;

export const CardNao = styled.div.attrs(({ noBg, customHeight, bgCorner, bgStake }) => ({
    className: classNames(
        `p-6 sm:px-10 sm:py-9 rounded-xl w-full min-w-full sm:min-w-[320px] ${
            customHeight ? customHeight : 'sm:min-h-[180px]'
        } flex flex-col justify-between flex-1 relative`,
        // { 'border-dashed border-[0.5px] border-[#7686B1]': noBg },
        { 'bg-white dark:bg-darkBlue-3 border border-divider dark:border-none': !noBg && !bgCorner && !bgStake },
        { 'bg-nao-corner-mb sm:bg-nao-corner dark:bg-nao-corner-mb-dark sm:dark:bg-nao-corner-dark bg-full': !noBg && bgCorner && !bgStake },
        { 'bg-nao-stake-mb sm:bg-nao-corner dark:bg-nao-corner-mb-dark sm:dark:bg-nao-corner-dark bg-full': !noBg && !bgCorner && bgStake }
    )
}))`
    background-image: ${({ noBg, stroke = 0.8, strokeColor = '%237686B1' }) =>
        noBg &&
        `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='${strokeColor}' stroke-width='${stroke}' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`};
`;

export const SectionNao = styled.div.attrs(({ noBg }) => ({
    className: classNames({ 'bg-white dark:bg-darkBlue-3': !noBg })
}))`
    background-image: ${({ noBg, stroke = 0.8 }) =>
        noBg &&
        `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%237686B1' stroke-width='${stroke}' stroke-dasharray='4 %2c 6' stroke-dashoffset='0' stroke-linecap='round'/%3e%3c/svg%3e")`};
`;

export const Divider = styled.div.attrs({
    className: 'h-[1px] opacity-[0.3] my-[10px]'
})`
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%237686B1' stroke-width='2' stroke-dasharray='3 %2c 10' stroke-dashoffset='8' stroke-linecap='square'/%3e%3c/svg%3e");
`;
export const ButtonNaoVariants = {
    PRIMARY: 'PRIMARY',
    SECONDARY: 'SECONDARY',
    DANGER: 'DANGER'
};
export const ButtonNao = styled.div.attrs(({ disabled, variant, active = true }) => ({
    className: classNames('text-center text-sm sm:text-base px-4 rounded-md font-semibold flex items-center justify-center select-none cursor-pointer py-3', {
        'bg-bgBtnPrimary text-txtBtnPrimary': active && (!variant || variant === ButtonNaoVariants.PRIMARY), // default theme is primary
        'bg-gray-12 dark:bg-dark-2 text-gray-15 dark:text-gray-7': variant === ButtonNaoVariants.SECONDARY || active === false,
        'bg-red-2 text-white': variant === ButtonNaoVariants.DANGER,
        '!bg-gray-12 dark:!bg-dark-2 text-txtDisabled dark:text-txtDisabled-dark': disabled
    })
}))``;

export const ButtonNaoV2 = styled.button.attrs(({ active, variant }) => ({
    className: classNames('px-4 py-2 text-sm rounded-md', {
        'font-semibold text-teal bg-teal/10': active,
        'bg-gray-13 dark:bg-dark-4 text-txtSecondary dark:text-txtSecondary-dark': !active,
        '!bg-teal !text-white font-semibold': variant === 'primary' && !active
    })
}))``;

export const BackgroundHeader = styled.div.attrs({
    className: 'relative z-[9]'
})`
    background: linear-gradient(101.26deg, rgba(9, 61, 209, 0.32) -5.29%, rgba(74, 232, 214, 0.32) 113.82%);
`;

export const Progressbar = styled.div.attrs(({ height = 6 }) => ({
    className: `rounded-lg transition-all`
}))`
    background: ${({ background }) => (background ? background : colors.teal)};
    width: ${({ percent }) => `${percent > 100 ? 100 : percent}%`};
    height: ${({ height }) => `${height || 6}px`};
`;

export const Tooltip = ({ id, arrowColor, backgroundColor, className, children, place = 'top', ...restProps }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const defaultTooltipBg = isDark ? colors.dark[1] : colors.gray[15];

    return (
        <CTooltip
            id={id}
            place={place}
            effect="solid"
            className={classNames(
                `!opacity-100 !rounded-lg max-w-[250px] sm:max-w sm:w-full !bg-gray-15 dark:!bg-dark-1 text-white dark:text-gray-4 ${className}`
            )}
            arrowColor={arrowColor ?? defaultTooltipBg}
            backgroundColor={backgroundColor ?? defaultTooltipBg}
            {...restProps}
        >
            {children}
        </CTooltip>
    );
};

export const Column = ({ title, maxWidth, minWidth, width, sortable, align = 'left', classHeader = '' }) => {
    return (
        <div style={{ minWidth, textAlign: align, maxWidth, width }} className={classHeader}>
            {title}
        </div>
    );
};

export const Table = ({ dataSource, children, classHeader = '', onRowClick, noItemsMessage, loading = false, classWrapper = '', limit = 10 }) => {
    const mouseDown = useRef(false);
    const startX = useRef(null);
    const scrollLeft = useRef(null);
    const startY = useRef(null);
    const scrollTop = useRef(null);
    const { t } = useTranslation();
    const content = useRef(null);
    const header = useRef(null);
    const timer = useRef(null);
    const handleClick = useRef(true);

    const onScroll = (e) => {
        header.current.scrollTo({
            left: e.target.scrollLeft
        });
    };

    const startDragging = (e) => {
        content.current.classList.add('cursor-grabbing');
        mouseDown.current = true;
        startX.current = e.pageX - content.current.offsetLeft;
        scrollLeft.current = content.current.scrollLeft;

        startY.current = e.pageY - content.current.offsetTop;
        scrollTop.current = content.current.scrollTop;
        handleClick.current = true;
    };

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
        handleClick.current = false;
    };

    const checkScrollBar = (element, dir) => {
        if (!element) return null;
        dir = dir === 'vertical' ? 'scrollTop' : 'scrollLeft';

        var res = !!element[dir];

        if (!res) {
            element[dir] = 1;
            res = !!element[dir];
            element[dir] = 0;
        }
        return res;
    };

    const _onRowClick = (e, index) => {
        if (onRowClick && handleClick.current) onRowClick(e);
    };

    useEffect(() => {
        if (content.current) {
            content.current.addEventListener('mousemove', onDrag);
            content.current.addEventListener('mousedown', startDragging, false);
            content.current.addEventListener('mouseup', stopDragging, false);
            content.current.addEventListener('mouseleave', stopDragging, false);
        }
        return () => {
            if (content.current) {
                content.current.removeEventListener('mousemove', onDrag);
                content.current.removeEventListener('mousedown', startDragging, false);
                content.current.removeEventListener('mouseup', stopDragging, false);
                content.current.removeEventListener('mouseleave', stopDragging, false);
            }
        };
    }, [content.current]);

    const loader = useMemo(() => {
        const arr = [];
        for (let i = 1; i <= limit; i++) {
            arr.push(i);
        }
        return arr;
    }, [limit]);

    const isScroll = checkScrollBar(content.current, 'vertical');
    const _children = Children.toArray(children.filter((child) => child.props?.visible === true || child.props?.visible === undefined));
    const _dataSource = loading ? loader : dataSource;

    return (
        <CardNao id="nao-table" className={classNames('mt-6 !p-0 !justify-start', classWrapper)}>
            <div ref={content} className={classNames('overflow-auto nao-table-content min-h-[200px]')}>
                <div
                    ref={header}
                    className={classNames(
                        'z-10 pt-10 pb-6 border-b border-divider dark:border-divider-dark bg-transparent overflow-hidden min-w-max w-full',
                        'px-6 nao-table-header flex items-center text-txtSecondary dark:text-txtSecondary-dark text-sm sm:text-base justify-between',
                        // 'pr-7'
                        classHeader
                    )}
                >
                    {_children.map((item, indx) => (
                        <Column
                            key={indx}
                            {...item.props}
                            classHeader={classNames(
                                'whitespace-nowrap mx-2 min-h-[10px] text-sm',
                                { 'flex-1': indx !== 0 },
                                { 'ml-0': indx === 0 },
                                { 'mr-0': indx === _children.length - 1 }
                            )}
                        />
                    ))}
                </div>
                <div
                    className={classNames(' my-3 overflow-none', {
                        'pr-[10px]': isScroll
                    })}
                >
                    {Array.isArray(_dataSource) && _dataSource?.length > 0 ? (
                        _dataSource.map((item, index) => {
                            return (
                                <div
                                    onClick={() => _onRowClick(item, index)}
                                    style={{ minWidth: 'fit-content' }}
                                    key={`row_${index}`}
                                    className={classNames('px-6 flex items-center flex-1 w-full hover:bg-hover dark:hover:bg-hover-dark')}
                                >
                                    {_children.map((child, indx) => {
                                        const width = child?.props?.width;
                                        const minWidth = child?.props?.minWidth;
                                        const maxWidth = child?.props?.maxWidth;
                                        const className = child?.props?.className ?? '';
                                        const align = child?.props?.align ?? 'left';
                                        const _align = align === 'right' ? 'flex justify-end' : '';
                                        const cellRender = child?.props?.cellRender;
                                        const suffix = child?.props?.suffix;
                                        const decimal = child?.props?.decimal;
                                        const fieldName = child?.props?.fieldName;
                                        const ellipsis = child?.props?.ellipsis;
                                        const onCellClick = child?.props?.onCellClick;
                                        const textItem = cellRender ? item?.[fieldName] : item?.[fieldName] ?? '-';
                                        const _capitalize = child?.props?.capitalize;
                                        return (
                                            <div
                                                title={cellRender ? null : textItem}
                                                style={{ width, maxWidth, minWidth, textAlign: align }}
                                                key={indx}
                                                className={classNames(
                                                    `min-h-[56px] flex items-center text-sm sm:text-base ${className} ${_align}`,
                                                    'break-words mx-2',
                                                    { 'flex-1': indx !== 0 },
                                                    { 'ml-0': indx === 0 },
                                                    { 'mr-0': indx == _children.length - 1 }
                                                )}
                                                onClick={() => onCellClick && onCellClick(textItem, { ...item, rowIndex: index })}
                                            >
                                                {loading ? (
                                                    <Skeletor onusMode width={minWidth ?? 50} height={20} />
                                                ) : cellRender ? (
                                                    cellRender(textItem, { ...item, rowIndex: index })
                                                ) : decimal >= 0 ? (
                                                    formatNumber(textItem, decimal, 0, true)
                                                ) : fieldName === 'index' ? (
                                                    index + 1
                                                ) : ellipsis ? (
                                                    <span className="overflow-ellipsis overflow-hidden whitespace-nowrap">{textItem}</span>
                                                ) : _capitalize ? (
                                                    capitalize(textItem)
                                                ) : (
                                                    textItem
                                                )}
                                                {!loading && suffix ? ` ${suffix}` : ''}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })
                    ) : (
                        <div className={`flex items-center justify-center flex-col m-auto pb-8`}>
                            <div className="block dark:hidden">
                                <NoDataLightIcon />
                            </div>
                            <div className="hidden dark:block">
                                <NoDataDarkIcon />
                            </div>
                            <div className="text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark mt-1">
                                {noItemsMessage ? noItemsMessage : t('common:no_data')}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CardNao>
    );
};

export const getColor = (value) => {
    return !!value ? (value > 0 ? 'text-teal' : 'text-red') : '';
};

export const renderPnl = (data, item) => {
    return (
        <div className={classNames('flex items-center', getColor(data))}>
            <IconArrowOnus className={classNames('w-[7px] mr-1.5', data > 0 ? '' : 'rotate-180')} color="currentColor" />
            {Math.abs(+data).toFixed(2)} %
        </div>
    );
};

export const useOutside = (ref, cb, container) => {
    useEffect(() => {
        const handleClickOutside = (event, cb) => {
            if (ref.current && !ref.current?.contains(event.target)) {
                cb();
            }
        };
        if (container?.current) {
            container?.current?.addEventListener('mousedown', (event) => handleClickOutside(event, cb));
        }
        return () => {
            if (container?.current) {
                container?.current?.removeEventListener('mousedown', handleClickOutside);
            }
        };
    }, [ref, cb, container]);
};

export const useOutsideAlerter = (ref, cb) => {
    useEffect(() => {
        const handleClickOutside = (event, cb) => {
            if (ref.current && !ref.current?.contains(event.target)) {
                if (cb) cb();
            }
        };
        document.addEventListener('mousedown', (event) => handleClickOutside(event, cb));
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, cb]);
};

export const TextTicket = styled.div.attrs(({ xs }) => ({
    className: classNames('absolute font-medium opacity-[0.8] w-full px-4', { 'text-[0.4375rem] ': xs }, { 'text-[0.625rem] ': !xs })
}))`
    left: 50%;
    transform: translate(-50%, 0);
`;

export const TextTicketLiner = styled.div.attrs({
    className: 'w-full'
})`
    background: linear-gradient(94.68deg, #24bae2 -3.13%, #60f2d8 46.7%, #24bae2 103.69%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
`;

export const TextField = (props) => {
    const { label, prefix, readOnly, className = '', prefixClassName = '', onBlur, error, helperText, ...propsTextField } = props;
    const [focus, setFocus] = useState(false);

    const onFocus = () => {
        if (!readOnly) setFocus(true);
    };

    const _onBlur = (e) => {
        if (!readOnly) setFocus(false);
        if (onBlur) onBlur(e);
    };

    return (
        <div className="w-full space-y-[6px]">
            <div className="text-xs sm:text-sm leading-6 text-txtSecondary dark:text-txtSecondary-dark">{label}</div>
            <WrapInput error={error} focus={focus} readOnly={readOnly}>
                <input
                    className={`w-full text-sm sm:text-base ${readOnly ? 'text-txtSecondary dark:text-txtSecondary-dark' : ''} ${className}`}
                    onFocus={onFocus}
                    onBlur={_onBlur}
                    readOnly={readOnly}
                    {...propsTextField}
                />
                {prefix && (
                    <div className={`${prefixClassName} text-sm sm:text-base leading-6 text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap`}>
                        {prefix}
                    </div>
                )}
            </WrapInput>
            {error && helperText && (
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-red-2">
                    <WarningIcon />
                    <span>{helperText}</span>
                </div>
            )}
        </div>
    );
};

export const WrapInput = styled.div.attrs(({ error, readOnly }) => ({
    className: classNames(
        'w-full relative flex items-center justify-between bg-gray-12 dark:bg-dark-2 px-3 py-2 rounded-md',
        'border border-transparent hover:border-teal',
        {
            'border-red-2': error,
            'border-none': readOnly
        }
    )
}))`
    :hover {
        /* border: ${({ readOnly }) => (readOnly ? 'none' : `solid 1px ${colors.teal}`)}; */
        &::after {
            display: none;
        }
    }
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        visibility: ${({ error, focus, readOnly }) => (!readOnly && !error && focus ? `visible` : `hidden`)};
        height: calc(100% + 2px);
        bottom: -1px;
        left: 0;
        border: solid 1px ${colors.teal};
        border-radius: 0.375rem;
        transform-origin: bottom left;
        transition: all 0.3s ease-out;
    }
`;

const WarningIcon = () => {
    return (
        <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.8103 0C9.7077 0 10.511 0.465413 10.9561 1.24491L17.2784 12.2987C17.7209 13.072 17.7183 13.9949 17.2704 14.7665C16.8226 15.539 16.0229 16 15.1316 16H2.47752C1.58541 16 0.785671 15.539 0.337854 14.7665C-0.109963 13.9949 -0.112602 13.072 0.329936 12.2987L6.66448 1.24315C7.10966 0.464533 7.91115 0 8.80943 0H8.8103ZM8.80943 1.3197C8.39064 1.3197 8.01761 1.53613 7.80822 1.89948L1.47543 12.9541C1.26956 13.3149 1.27132 13.7451 1.47983 14.1049C1.68834 14.4648 2.06138 14.6803 2.47752 14.6803H15.1316C15.5469 14.6803 15.9199 14.4648 16.1285 14.1049C16.3379 13.7451 16.3396 13.3149 16.132 12.9541L9.81063 1.89948C9.60212 1.53613 9.22909 1.3197 8.80943 1.3197ZM8.80344 10.9966C9.28997 10.9966 9.68324 11.3899 9.68324 11.8764C9.68324 12.3629 9.28997 12.7562 8.80344 12.7562C8.31692 12.7562 7.91925 12.3629 7.91925 11.8764C7.91925 11.3899 8.309 10.9966 8.79464 10.9966H8.80344ZM8.80168 5.77499C9.16592 5.77499 9.46153 6.0706 9.46153 6.43484V9.16221C9.46153 9.52645 9.16592 9.82206 8.80168 9.82206C8.43745 9.82206 8.14183 9.52645 8.14183 9.16221V6.43484C8.14183 6.0706 8.43745 5.77499 8.80168 5.77499Z"
                fill="#DC1F4E"
            />
        </svg>
    );
};

export const capitalize = (text) => {
    return text
        ? String(text)
              .toLowerCase()
              .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
        : null;
};

export const ImageNao = ({ src, fallBack, ...props }) => {
    const fallBackSrc = fallBack ?? getS3Url('/images/nao/ic_nao_large.png');
    const [image, setImage] = useState(src ?? fallBackSrc);

    useEffect(() => {
        if (src !== image) setImage(src ?? fallBackSrc);
    }, [src]);

    return (
        <AvatarFrame {...props}>
            <img
                src={image}
                {...props}
                onError={(e) => {
                    if (e.type === 'error') setImage(fallBackSrc);
                }}
            />
        </AvatarFrame>
    );
};

export const TabsNao = styled.div.attrs({
    className: 'flex items-center space-x-4 relative mt-6 sm:mt-8'
})`
    /* &::after {
        content: '';
        position: absolute;
        bottom: 0;
        height: 2px;
        width: 100%;
        background: ${colors.teal};
    } */
`;

export const TabItemNao = styled.div.attrs(({ active }) => ({
    className: classNames('py-2 px-5 cursor-pointer relative rounded-3xl border', {
        '!border-teal text-teal font-semibold': active,
        ' border-divider dark:border-divider-dark text-txtSecondary dark:text-txtSecondary-dark': !active
    })
}))`
    /* &::after {
        display: ${({ active }) => (active ? 'block' : 'none')};
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px 12px 0px 0px;
        padding: 2px;
        background: ${colors.teal};
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
    }
    &:first-child::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 3;
        border-bottom: ${({ active }) => `${active ? 2 : 0}px solid #000921`};
        height: ${({ active }) => (active ? 0 : '2px')};
        width: ${({ active }) => `calc(100% + ${active ? '-2px' : '18px'})`};
        background: ${colors.teal};
    }
    &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 2;
        border-bottom: ${({ active }) => `${active ? 2 : 0}px solid #000921`};
        height: ${({ active }) => (active ? '0' : '2px')};
        width: ${({ active }) => `calc(100% + ${active ? '-2px' : '18px'})`};
    } */
`;

export const VoteStatus = ({ iconClassName = '', className = '', status, statusText = '', textClassName = '' }) => {
    const renderStatus = () => {
        switch (status) {
            case 'Processing':
                return (
                    <>
                        <WarningFilledIcon className={iconClassName} />
                        <span className={`font-semibold ${textClassName}`}>{statusText}</span>
                    </>
                );
            case 'Executed':
                return (
                    <>
                        <CheckCircle className={iconClassName} />
                        <span className={`font-semibold ${textClassName}`}>{statusText}</span>
                    </>
                );
            case 'Failed':
                return (
                    <>
                        <CrossCircle className={iconClassName} />
                        <span className={`font-semibold ${textClassName}`}>{statusText}</span>
                    </>
                );
            case 'Canceled':
                return (
                    <>
                        <RemoveCircleIcon className={iconClassName} />
                        <span className={`font-semibold ${textClassName}`}>{statusText}</span>
                    </>
                );
            default:
                return null;
        }
    };
    return <div className={`flex space-x-1 sm:space-x-2 items-center ${className}`}>{renderStatus()}</div>;
};

export const VolumeTooltip = ({ item, tooltip, className, suffix }) => {
    const { t } = useTranslation();
    const currency = Object.entries(QUOTE_ASSET).map(([key, value]) => ({ key, value }));
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const detail = item?.detail_volume ?? {};
    const idTooltip = `${item?.code}_${item?.user_id}`;

    return (
        <>
            {tooltip && (
                <Tooltip id={idTooltip} className={'!max-w-max'}>
                    <div>
                        <div className="text-txtSecondary dark:text-txtSecondary-dark mb-3">{t('nao:contest:converted_volume')}</div>
                        {Object.keys(detail).map((key) => {
                            const quoteAsset = currency.find((c) => String(c.value) === String(key));
                            const decimal = assetConfig.find((rs) => String(rs.id) === String(key))?.assetDigit ?? 0;
                            return (
                                <div key={key} className="flex items-center space-x-2">
                                    <span className="font-semibold">{formatNumber(detail[key], decimal)}</span>
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{quoteAsset.key}</span>
                                </div>
                            );
                        })}
                    </div>
                </Tooltip>
            )}
            <span
                data-tip=""
                data-for={idTooltip}
                onClick={(e) => e.stopPropagation()}
                className={classNames(
                    'font-semibold flex items-center space-x-1',
                    {
                        'border-dashed border-b dark:border-gray-7 border-gray-1': tooltip
                    },
                    className
                )}
            >
                <span>{formatNumber(item?.total_volume, 0)}</span>
                {suffix && <div>{isFunction(suffix) ? suffix() : suffix}</div>}
            </span>
        </>
    );
};

export const CPnl = ({ item, isTotal, className }) => {
    const value = isTotal ? item?.total_pnl : item?.pnl;
    const prefix = value !== 0 && value > 0 ? '+' : '';
    const suffix = isTotal ? '' : '%';
    const decimal = isTotal ? 0 : 2;
    return (
        <span className={`font-semibold ${getColor(value)} ${className}`}>
            {prefix}
            {formatNumber(value, decimal, 0, true)}
            {suffix}
        </span>
    );
};
