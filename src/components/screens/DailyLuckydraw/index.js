import React, { useEffect, useState, useRef, useMemo, memo } from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'utils/customHooks';
import classNames from 'classnames';
import { emitWebViewEvent, getS3Url, formatCurrency, formatNumber, formatTime, getLoginUrl } from 'redux/actions/utils';
import { ActiveIconNami, InActiveIconNami, StepActive, StartIconDaily } from 'components/screens/Nao/Luckydraw/LuckyIcon';
import { useTranslation } from 'next-i18next';
import { API_GET_TICKET_DETAIL, API_CLAIM_TICKET } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import Tooltip from 'components/common/Tooltip';
import Button from 'components/common/V2/ButtonV2/Button';
import Modal from 'components/common/V2/ModalV2';
import debounce from 'lodash/debounce';
import { X } from 'react-feather';
import colors from 'styles/colors';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { useRouter } from 'next/router';
import { SaveAltIcon, MoreHorizIcon, FacebookIcon, TwitterIcon, TelegramIcon } from '../../svg/SvgIcon';
import DomToImage from 'dom-to-image';
import Image from 'next/image';

const initTickets = [
    { vol_condition: 0, value: 0, start: true },
    { vol_condition: 10000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: null, value: 1000, can_receive: false },
    { vol_condition: 20000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: 'abc123', value: 2000, can_receive: false },
    { vol_condition: 50000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: 'abc123', value: 5000, can_receive: false },
    { vol_condition: 100000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: 'abc123', value: 10000, can_receive: false },
    { vol_condition: 200000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: 'abc123', value: 20000, can_receive: false },
    { vol_condition: 500000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: 'abc123', value: 50000, can_receive: false },
    { vol_condition: 1000000000, time: '2023-04-26T14:40:00.157+00:00', ticket_code: 'abc123', value: 100000, can_receive: false }
];

const DailyLuckydraw = memo(({ visible, onClose }) => {
    const router = useRouter();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const isAuth = useSelector((state) => state.auth.user) || null;
    const xs = width <= 360;
    const isDesktop = width >= 820;
    const maxWidth = isDesktop ? 600 : 480;
    const [showClaim, setShowClaim] = useState(false);
    const metadata = useRef(0);
    const [dataSource, setDataSource] = useState(initTickets);
    const can_receive = useRef(false);
    const total_reward = useRef(0);
    const last_updated_at = useRef(null);
    const [loading, setLoading] = useState(false);

    const getIcon = (act) => {
        const size = isDesktop ? 36 : xs ? 14 : 20;
        if (act) {
            return <ActiveIconNami size={size} />;
        } else {
            return <InActiveIconNami size={size} />;
        }
    };

    useEffect(() => {
        if (isAuth) getTickets();
    }, [isAuth]);

    useUpdateEffect(() => {
        if (visible) getTickets();
    }, [visible]);

    const getTickets = async () => {
        try {
            const { data } = await fetchApi({
                url: API_GET_TICKET_DETAIL
            });
            if (data) {
                const _data = [{ vol_condition: 0, value: 0, start: true }].concat(data?.reward);
                metadata.current = data?.metadata;
                can_receive.current = data?.reward.find((rs) => rs.can_receive);
                last_updated_at.current = data?.last_updated_at;
                setDataSource(_data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const claim = debounce(async () => {
        if (!can_receive.current || !isAuth) {
            if (router.query?.web || isDesktop) {
                isAuth ? router.push('/') : window.open(getLoginUrl('sso'), '_self');
                return;
            }
            emitWebViewEvent(isAuth ? 'back' : 'login');
            return;
        }
        try {
            setLoading(true);
            const { data } = await fetchApi({
                url: API_CLAIM_TICKET,
                options: { method: 'POST' }
            });
            if (data) {
                total_reward.current = data?.total_reward;
                can_receive.current = false;
                if (!router.query.web && !isDesktop) {
                    emitWebViewEvent(
                        JSON.stringify({
                            type: 'lucky_daily',
                            ticket: { ...dataSource?.[active], total_reward: data?.total_reward, unit: 'VNDC' },
                            bg: getS3Url(`/images/screen/futures/luckdraw/bg_claimed_mb.png`)
                        })
                    );
                } else {
                    setShowClaim(true);
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, 200);

    const active = useMemo(() => {
        if (!isAuth) return 0;
        const index = dataSource.findIndex((rs) => rs.vol_condition > metadata.current);
        return index !== -1 ? index - 1 : dataSource.length - 1;
    }, [dataSource, isAuth]);

    const percent = useMemo(() => {
        if (!isAuth) return 0;
        const current = metadata.current - dataSource?.[active]?.vol_condition;
        const next = dataSource?.[active + 1]?.vol_condition - dataSource?.[active]?.vol_condition;
        return dataSource?.[active + 1]?.vol_condition ? 1 - Math.abs(current - next) / next : isDesktop ? 0 : 100;
    }, [dataSource, active, isAuth, isDesktop]);

    const offset = useMemo(() => {
        if (typeof window === 'undefined') return 0;
        const width = document.body.clientWidth >= maxWidth ? maxWidth : document.body.clientWidth;
        return width / 4 - (isDesktop ? 40 : 16);
    }, [dataSource, isDesktop]);

    const renderItem = (rs, idx, count, reverse, length) => {
        return (
            <div key={idx} className={`pt-1 relative ticket_${idx}${reverse ? '_reverse' : ''}`}>
                <div className="relative -bottom-2">
                    <div
                        className={classNames(`h-[3px] flex items-center bg-dark-2 relative ticket_line`, {
                            'rounded-l-xl': idx === 0,
                            'rounded-r-xl': idx === length - 1,
                            '-ml-4 w-[calc(100%+16px)]': idx === 0 && reverse && !isDesktop,
                            '-mr-4 w-[calc(100%+16px)]': idx === length - 1 && !isDesktop,
                            'ml-4': idx === 0 && isDesktop
                        })}
                    >
                        {active >= count ? (
                            <>
                                <div
                                    style={{
                                        width:
                                            active === count
                                                ? offset - (idx === 0 && !reverse ? 20 : 40) + percent * offset
                                                : `calc(100% + ${isDesktop ? '0px' : '16px'})`
                                    }}
                                    className={classNames(`h-[3px] transition absolute z-[1] bg-teal ticket_line_act`, {
                                        'rounded-l-xl': idx === 0 && !reverse,
                                        'rounded-r-xl': (active === count || idx === length - 1) && !reverse,
                                        'right-0 rounded-l-xl': active === count && reverse,
                                        '-ml-4 w-[calc(100%+16px)]': idx === 0 && !reverse && !isDesktop,
                                        '-mr-4 w-[calc(100%+16px)]': idx === length - 1 && !isDesktop
                                    })}
                                />
                                {!isDesktop && (
                                    <div
                                        className={classNames('w-5 h-5 rounded-full absolute left-1/2 -translate-x-1/2 z-[2]', {
                                            '-ml-2': idx === length - 1 && !isDesktop,
                                            'ml-2': idx === 0 && reverse && !isDesktop
                                        })}
                                    >
                                        {idx === 0 && !reverse ? <StartIconDaily /> : <StepActive />}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div
                                className={classNames(
                                    'w-5 h-5 rounded-full absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold flex items-center justify-center z-[1]',
                                    {
                                        'border border-dark-2 text-dark-2 bg-[#000200]': active < count,
                                        '-ml-2': idx === length - 1 && !isDesktop,
                                        'ml-2': idx === 0 && !isDesktop
                                    }
                                )}
                            >
                                {count}
                            </div>
                        )}
                    </div>
                </div>
                <Ticket
                    style={{ width: offset }}
                    active={rs.start || active >= count}
                    className={classNames('relative m-auto py-4', { '!py-2': xs, '!mt-7': !isDesktop, '-top-1/2 translate-y-2 z-[2] !py-6': isDesktop })}
                >
                    <div className={isDesktop ? 'absolute top-[-18px]' : ''}>{getIcon(active >= count || rs.start)}</div>
                    <span
                        className={classNames(`text-sm sm:text-lg font-semibold mt-2 sm:mt-0 mb-1 text-gray-4`, {
                            '!text-txtDisabled-dark': active < count,
                            '!text-xs': xs
                        })}
                    >
                        {rs.start ? t('common:luckydraw:start') : `+${formatNumber(rs.value)}`}
                    </span>
                    <span className={classNames('text-xs sm:text-sm text-txtSecondary', { '!text-txtDisabled-dark': active < count, '!text-[10x]': xs })}>
                        {formatCurrency(rs.vol_condition, 0, language === 'vi')}
                    </span>
                </Ticket>
            </div>
        );
    };

    const renderReward = () => {
        const size = 4;
        const page = Array.isArray(dataSource) && Math.ceil(dataSource.length / size);
        const result = [];
        let count = -1;
        for (let i = 0; i < page; i++) {
            const dataFilter = dataSource.slice(i * size, (i + 1) * size);
            const reverse = i % 2 !== 0;
            result.push(
                <div key={i} className={`grid grid-cols-4 relative`}>
                    {!reverse && isDesktop && (
                        <svg
                            className="reward_line z-10"
                            width={isDesktop ? 26.5 : 24}
                            height={isDesktop ? 160 : 142}
                            viewBox="0 0 24 142"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M2 2H10C16.6274 2 22 7.37258 22 14V128C22 134.627 16.6274 140 10 140H2"
                                stroke={active >= size ? colors.teal : colors.dark[2]}
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                    {(reverse ? dataFilter.reverse() : dataFilter).map((rs, idx) => {
                        count = count + 1;
                        const _count = !reverse ? count : Math.abs(idx - dataFilter.length) + dataFilter.length - 1;
                        return renderItem(rs, idx, _count, reverse, dataFilter.length);
                    })}
                </div>
            );
        }
        return result;
    };

    const renderTextReward = () => {
        return (
            <>
                <span className="text-xl md:text-4xl text-teal font-semibold md:text-white">{t('common:luckydraw:take_reward')}</span>
                <span className="text-txtSecondary-dark text-sm sm:text-base">
                    {!isAuth
                        ? t('common:luckydraw:login_trade')
                        : t(`common:luckydraw:${claimedAll ? 'reward_desc_trading_over' : can_receive.current ? 'reward_desc' : 'reward_desc_trading'}`, {
                              vol: formatNumber(dataSource?.[active + 1]?.vol_condition - metadata.current) + ' VNDC',
                              value: formatNumber(dataSource?.[active + 1]?.value || 0) + ' VNDC'
                          })}
                </span>
            </>
        );
    };

    const renderTextVol = () => {
        return (
            <>
                <Tooltip
                    id={'volume_tooltip'}
                    place="top"
                    effect="solid"
                    isV3
                    className="max-w-[300px] !bg-dark-1"
                    arrowColor="transparent"
                    overridePosition={(e) => ({
                        left: isDesktop ? e.left : 32,
                        top: e.top - (isDesktop ? 12 : 12)
                    })}
                />
                <div
                    className={classNames('px-6 md:px-3 py-[10px] text-sm sm:text-base bg-teal/10 w-max rounded-full space-x-3 m-auto sm:mb-12', {
                        'mb-10': !router.query?.web
                    })}
                >
                    <span
                        data-for="volume_tooltip"
                        data-tip={t('common:luckydraw:volume_tooltip')}
                        className="text-white border-dashed border-b border-divider cursor-pointer"
                    >
                        {t('common:luckydraw:vol_trade')}
                    </span>
                    <span className="text-teal font-semibold">{formatNumber(metadata.current)} VNDC</span>
                </div>
            </>
        );
    };

    const renderButton = () => {
        return (
            <div
                className={classNames('space-y-4', {
                    '!space-y-3 pb-12 px-4 w-full z-[1] bg-dark bottom-0 fixed': !isDesktop && !router.query?.web,
                    'px-4': router.query?.web
                })}
            >
                <div>
                    {last_updated_at.current && (
                        <div className={classNames('text-center text-xs mt-3 text-txtSecondary-dark flex flex-col')}>
                            <span>{t('common:luckydraw:updated_vol')}</span>
                            <span>
                                {t('common:luckydraw:last_updated_time')}:&nbsp;&nbsp;
                                {last_updated_at.current ? formatTime(last_updated_at.current, 'yyyy-MM-dd HH:mm:ss') : '-'}
                            </span>
                        </div>
                    )}
                </div>
                <Button onClick={claim} loading={loading}>
                    {isAuth ? t(`common:luckydraw:${can_receive.current ? 'claim_now' : 'back_to_trading'}`) : t('common:global_btn:login')}
                </Button>
            </div>
        );
    };

    const claimedAll = useMemo(() => {
        return dataSource.length > 0 ? metadata.current > dataSource?.[dataSource.length - 1]?.vol_condition && !can_receive.current : false;
    }, [dataSource, showClaim]);

    return (
        <>
            <ModalClaim
                visible={showClaim}
                isMobile={!isDesktop}
                onClose={() => setShowClaim(false)}
                ticket={dataSource?.[active]}
                total_reward={total_reward.current}
            />
            {isDesktop ? (
                <BackgroundImage isDesktop={isDesktop} className="">
                    <div className="max-w-screen-v3 mx-auto 2xl:max-w-screen-xxl sm:min-h-[calc(100vh-80px)] relative ">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 max-w-[600px] px-8 text-center">
                            <div className="flex flex-col space-y-3 mb-8">{renderTextReward()}</div>
                            {renderTextVol()}
                            <div className="space-y-[43px] relative top-8 mb-9">{renderReward()}</div>
                            {renderButton()}
                        </div>
                    </div>
                </BackgroundImage>
            ) : (
                <div className="min-w-full no-scrollbar bg-dark pb-8">
                    <BackgroundImage className="pt-11 px-4">
                        <img className="h-6 mt-6" src={getS3Url('/images/screen/futures/luckdraw/ic_logo_nami.png')} />
                        <div className="mt-10 space-y-3 flex flex-col max-w-[230px] sm:max-w-[500px]">{renderTextReward()}</div>
                    </BackgroundImage>
                    <div className="py-8">{renderTextVol()}</div>
                    <div
                        style={{ maxWidth }}
                        className={classNames(`px-4 space-y-6 top-[375px] w-full bg-dark`, {
                            'absolute pb-[10rem] left-1/2 -translate-x-1/2 ': !router.query?.web,
                            'mb-8': router.query?.web
                        })}
                    >
                        {renderReward()}
                    </div>
                    {renderButton()}
                </div>
            )}
        </>
    );
});

const ModalClaim = ({ onClose, visible, ticket, total_reward, isMobile }) => {
    const { t } = useTranslation();
    const contentRef = useRef();
    const [loading, setLoading] = useState(false);

    const list = [
        { name: t('common:save'), icon: <SaveAltIcon />, event: 'save' },
        { name: 'Facebook', icon: <FacebookIcon size={24} />, event: 'facebook' },
        { name: 'Twitter', icon: <TwitterIcon size={24} />, event: 'twitter' },
        { name: 'Telegram', icon: <TelegramIcon size={24} />, event: 'telegram' },
        { name: t('common:luckydraw:more'), icon: <MoreHorizIcon color={'currentColor'} />, event: 'more' }
    ];

    const formatFile = async (el) => {
        if (el) {
            const scale = 2;
            const option = {
                height: el.offsetHeight * scale,
                width: el.offsetWidth * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left',
                    width: el.offsetWidth + 'px',
                    height: el.offsetHeight + 'px'
                }
            };
            try {
                const blob = await DomToImage.toBlob(el, option);
                return new File([blob], `${ticket?.ticket_code}.png`, { type: 'image/png' });
            } catch (error) {
                console.log('error', error);
            } finally {
            }
        }
    };

    const saveFile = (file, name) => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const onShare = async (item) => {
        try {
            const file = await formatFile(contentRef.current);
            if (!isMobile) {
                setLoading(true);
                saveFile(file, `${item?.ticket_code}.png`);
                return;
            }
        } catch (error) {
            console.log('error', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            className={classNames('sm:!max-w-[588px]', { '!bg-transparent': isMobile })}
            wrapClassName={isMobile ? '!p-0 !bg-transparent' : ''}
            isMobile={isMobile}
            isVisible={visible}
            onBackdropCb={onClose}
            containerClassName={isMobile ? '!bg-black-800/[0.8]' : ''}
            btnCloseclassName="bg-transparent"
            closeButton={!isMobile}
        >
            {!isMobile && <div className="text-2xl font-semibold mb-6">{t('common:luckydraw:reward_received')}</div>}
            <div ref={contentRef} className={classNames('relative overflow-hidden', { 'mx-6 min-h-[490px]': isMobile, 'h-[380px]': !isMobile })}>
                <img
                    className="absolute z-[1] overflow-hidden w-full h-full object-cover"
                    src={isMobile ? getS3Url(`/images/screen/futures/luckdraw/bg_claimed_mb.png`) : 'https://nami.exchange/bg_claimed.png'}
                />
                <div className={classNames('space-y-8 flex flex-col items-center relative z-10 h-full', { 'pt-[5.875rem]': isMobile })}>
                    <div className="flex flex-col items-center">
                        <div
                            className={classNames('flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark', {
                                'absolute bottom-6 left-6 !text-white': !isMobile
                            })}
                        >
                            <span>ID: #{ticket?.ticket_code}</span>
                            <span className="w-0.5 h-0.5 rounded-full bg-darkBlue-5 sm:bg-white mx-1.5" />
                            <span>{formatTime(ticket?.time, 'HH:mm:ss dd/MM/yyyy')}</span>
                        </div>
                        <div
                            className={classNames('font-semibold space-y-2 mt-4 flex flex-col text-center', {
                                'absolute left-6 top-1/2 -translate-y-1/2 !text-left !-mt-6': !isMobile
                            })}
                        >
                            <span className="text-white">{t('common:luckydraw:claim_success')}</span>
                            <span className="text-3xl sm:text-5xl text-teal">{formatNumber(total_reward)} VNDC</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={classNames('relative z-10', { 'mt-8 py-8 space-y-6 bg-white dark:bg-dark px-6': isMobile })}>
                {isMobile ? (
                    <>
                        <div className="flex justify-end mb-6">
                            <X size={24} onClick={onClose} className="cursor-pointer" />
                        </div>
                        <div className="text-xl sm:text-2xl font-semibold">{t('common:luckydraw:share')}</div>
                        <div className="pt-6 pb-4 flex items-center justify-around space-x-2">
                            {list.map((item, key) => (
                                <div onClick={() => onShare(item)} key={key} className="flex flex-col items-center space-y-2">
                                    <div className="p-2 bg-[#F2F2F5] dark:bg-dark-4 rounded-md max-w-[40px]">
                                        <div className="w-6 h-6 rounded-full overflow-hidden">{item.icon}</div>
                                    </div>
                                    <span className="text-xs text-txtSecondary dark:text-txtSecondary-dark">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <Button onClick={() => onShare(ticket)} loading={loading} className="mt-10">
                        {t('common:luckydraw:download')}
                    </Button>
                )}
            </div>
        </Modal>
    );
};

const BackgroundImage = styled.div.attrs(({ isDesktop }) => ({
    className: classNames('bg-dark', { 'relative h-[272px]': !isDesktop })
}))`
    background-image: ${({ isDesktop }) => `url(${getS3Url(`/images/screen/futures/luckdraw/bg_lucky${isDesktop ? '_desktop' : '_mb'}.png`)})`};
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;

    .reward_line {
        position: absolute;
        right: ${({ isDesktop }) => (isDesktop ? '-18px' : '-12px')};
        top: ${({ isDesktop }) => (isDesktop ? '9.4px' : '11.5px')};
    }
`;

const Ticket = styled.div.attrs({
    className: 'px-2 flex flex-col items-center justify-center'
})`
    background: ${({ active }) => (active ? 'linear-gradient(180deg, #46c984 0%, rgba(20, 25, 33, 0) 100%)' : 'rgba(12, 14, 20, 0.2)')};
    border: ${({ active }) => (active ? '1px solid #47cc85' : '1px dashed #1C232E')};
    backdrop-filter: blur(10px);
    border-radius: 6px;
    order: 1;
    flex-grow: 1;
`;

export default DailyLuckydraw;
