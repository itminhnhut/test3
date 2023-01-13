import React, { useEffect, useState, useRef, useMemo } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import styled from 'styled-components';
import { useWindowSize } from 'utils/customHooks';
import classnames from 'classnames';
import { emitWebViewEvent, getS3Url, formatCurrency, formatNumber, formatTime } from 'redux/actions/utils';
import classNames from 'classnames';
import {
    IconRewardFrame,
    ActiveIconFrame,
    ActiveIconNami,
    IconRewardNami,
    GiftIconFrame,
    GiftIconNami,
    TooltipNami
} from 'components/screens/Nao/Luckydraw/LuckyIcon';
import { useTranslation } from 'next-i18next';
import { useOutsideAlerter } from 'components/screens/Nao/NaoStyle';
import Portal from 'components/hoc/Portal';
import { API_GET_TICKET_DETAIL, API_CLAIM_TICKET } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import Tooltip from 'components/common/Tooltip';

const Luckydraw = ({ platform }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const xs = width <= 360;
    const [showClaim, setShowClaim] = useState(false);
    const metadata = useRef(0);
    const [dataSource, setDataSource] = useState([]);
    const can_receive = useRef(false);
    const total_reward = useRef(0);
    const last_updated_at = useRef(null);

    const getIcon = (act) => {
        if (act) {
            switch (platform) {
                case 'nami':
                    return <ActiveIconNami size={xs ? 22 : 24} />;
                default:
                    return <ActiveIconFrame size={xs ? 22 : 24} />;
            }
        } else {
            switch (platform) {
                case 'nami':
                    return <IconRewardNami size={xs ? 24 : 28} />;
                default:
                    return <IconRewardFrame size={xs ? 24 : 28} />;
            }
        }
    };

    const getImage = (isModal) => {
        if (!isModal) {
            return `/images/screen/futures/luckdraw/bg_lucky_${platform}${xs ? '_xs' : ''}.png`;
        } else {
            return `/images/screen/futures/luckdraw/bg_claim_${platform}${xs ? '_xs' : ''}.png`;
        }
    };

    useEffect(() => {
        getTickets();
    }, []);

    const getTickets = async () => {
        try {
            const { data } = await fetchApi({
                url: API_GET_TICKET_DETAIL
            });
            if (data) {
                const _data = [{ vol_condition: 0, value: 0 }].concat(data?.reward);
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

    const claim = async () => {
        if (!can_receive.current) {
            emitWebViewEvent('back');
            return;
        }
        try {
            const { data } = await fetchApi({
                url: API_CLAIM_TICKET,
                options: { method: 'POST' }
            });
            if (data) {
                total_reward.current = data?.total_reward;
                can_receive.current = false;
                setShowClaim(true);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const active = useMemo(() => {
        const index = dataSource.findIndex((rs) => rs.vol_condition > metadata.current);
        return index !== -1 ? index - 1 : dataSource.length - 1;
    }, [dataSource]);

    const percent = useMemo(() => {
        const current = metadata.current - dataSource?.[active]?.vol_condition;
        const next = dataSource?.[active + 1]?.vol_condition - dataSource?.[active]?.vol_condition;
        return dataSource?.[active + 1]?.vol_condition ? 1 - Math.abs(current - next) / next : 0;
    }, [dataSource, active]);

    const renderItem = (rs, idx, count, reverse, length) => {
        return (
            <div key={idx} className="py-6">
                <div className="relative -bottom-2">
                    <div
                        className={classNames('text-xs mb-1 h-6 rounded-full absolute -top-7 left-1/2 -translate-x-1/2 w-full', {
                            'text-[#3255A7]': active < count && platform === 'frame',
                            'text-darkBlue-5': active < count && platform === 'nami'
                        })}
                    >
                        {formatCurrency(rs.vol_condition, 0, language === 'vi')}
                    </div>
                    <div
                        className={classNames('h-[10px] flex items-center', {
                            'rounded-l-xl': idx === 0,
                            'rounded-r-xl': idx === length - 1,
                            'bg-[#3255A7]': platform === 'frame',
                            'bg-[#0B454B]': platform === 'nami'
                        })}
                    >
                        {active >= count ? (
                            <>
                                <div
                                    style={{
                                        width: active === count ? (idx === length - 1 ? 48 : 50) + percent * (idx === length - 1 ? 44 : 80) : '101%'
                                    }}
                                    className={classNames('h-[6px] transition absolute z-10', {
                                        'rounded-l-xl !ml-0.5': idx === 0 && !reverse,
                                        'rounded-r-xl -ml-1': (active === count || idx === length - 1) && !reverse,
                                        'bg-[#02FFFE]': platform === 'frame',
                                        'bg-teal': platform === 'nami',
                                        'right-0 rounded-l-xl -ml-1': active === count && reverse,
                                        'ml-0.5': !reverse,
                                        'right-1': reverse && idx === length - 1
                                    })}
                                />
                                <div className={classNames('w-6 h-6 rounded-full absolute left-1/2 -translate-x-1/2 z-50', {})}>{getIcon(true)}</div>
                            </>
                        ) : (
                            <div
                                className={classNames(
                                    'w-6 h-6 rounded-full absolute left-1/2 -translate-x-1/2 text-xs font-semibold flex items-center justify-center z-10',
                                    {
                                        'bg-[#3255A7] text-[#00288C]': active < count && platform === 'frame',
                                        'bg-[#0B454B] text-teal/[0.3]': active < count && platform === 'nami'
                                    }
                                )}
                            >
                                {count}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={classNames('flex flex-col items-center justify-center py-4', 'bg-[#278cd333] border-r', {
                        'rounded-bl-xl': idx === 0,
                        'border-none rounded-br-xl': idx === length - 1,
                        'border-r-[#3255A7]': platform === 'frame',
                        'border-r-[#0E1113]': platform === 'nami',
                        '!pb-4 !pt-6': xs
                    })}
                >
                    <div className={classNames('mt-1 h-8 w-8 flex items-center justify-center', { 'opacity-50': active < count })}>
                        {!rs.value ? platform === 'frame' ? <GiftIconFrame size={xs ? 22 : 24} /> : <GiftIconNami size={xs ? 22 : 24} /> : getIcon()}
                    </div>
                    <div
                        className={classNames(`text-sm font-medium mt-2 `, {
                            'opacity-20': active < count && platform === 'frame',
                            'text-darkBlue-5': active < count && platform === 'nami'
                        })}
                    >
                        {!rs.value ? t('nao:luckydraw:start') : `+${formatNumber(rs.value)}`}
                    </div>
                </div>
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
                <div className={`grid grid-cols-4 relative`}>
                    {!reverse && (
                        <div
                            className={classNames('flex items-center justify-center absolute right-0 -bottom-10 w-[10px] h-[calc(100%+5px)] rounded-xl ', {
                                'bg-[#3255A7]': platform === 'frame',
                                'bg-[#0B454B]': platform === 'nami'
                            })}
                        >
                            {active >= size && (
                                <div
                                    className={classNames('h-full w-[6px] rounded-xl transition absolute z-10', {
                                        'bg-[#02FFFE]': platform === 'frame',
                                        'bg-teal': platform === 'nami'
                                    })}
                                />
                            )}
                        </div>
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

    useEffect(() => {
        document.body.style.background = platform === 'frame' ? `#00288c` : '#0E1113';
        document.body.classList.add('no-scrollbar');
        return () => {
            document.body.style.background = 'white';
            document.body.classList.remove('no-scrollbar');
        };
    }, [platform]);

    const claimedAll = useMemo(() => {
        return dataSource.length > 0 ? metadata.current > dataSource?.[dataSource.length - 1]?.vol_condition && !can_receive.current : false;
    }, [dataSource, showClaim]);

    return (
        <LayoutNaoToken isHeader={false}>
            <ModalClaim
                visible={showClaim}
                onClose={() => setShowClaim(false)}
                platform={platform}
                getImage={getImage}
                ticket={dataSource?.[active]}
                total_reward={total_reward.current}
            />
            <Tooltip
                id={'volume_tooltip'}
                place="top"
                effect="solid"
                arrowColor="transparent"
                backgroundColor="bg-darkBlue-4"
                className={`!mx-7 !px-3 !py-5 !opacity-100 !rounded-lg ${platform === 'frame' ? '!bg-[#0d3495]' : '!bg-[#1f2529]'}`}
                overridePosition={(e) => ({
                    left: 0,
                    top: e.top
                })}
            ></Tooltip>
            <Background platform={platform}>
                <BackgroundImage url={getImage(false)} width={width} className="text-center !pt-[4.5rem]">
                    <div className={`${xs ? 'mt-2' : 'mt-10'}`}>
                        <div
                            className={`font-semibold ${
                                xs
                                    ? language === 'en'
                                        ? 'text-3xl leading-8'
                                        : 'text-xl'
                                    : language === 'en'
                                    ? 'text-[2rem] leading-10'
                                    : 'text-2xl leading-8'
                            } ${platform === 'nami' ? 'italic' : ''}`}
                        >
                            {t('nao:luckydraw:reward_title')}
                        </div>
                        <div className={classNames('text-sm leading-5 font-medium mt-2', { '!text-xs': xs })}>
                            {t(`nao:luckydraw:${claimedAll ? 'reward_desc_trading_over' : can_receive.current ? 'reward_desc' : 'reward_desc_trading'}`, {
                                vol: formatNumber(dataSource?.[active + 1]?.vol_condition - metadata.current) + ' VNDC',
                                value: formatNumber(dataSource?.[active + 1]?.value || 0) + ' VNDC'
                            })}
                        </div>
                    </div>
                    <div
                        style={{ backgroundColor: platform === 'frame' ? `#00288c` : '#0E1113' }}
                        className={`${xs ? 'top-[230px]' : 'top-[350px]'} absolute left-0  w-full pb-[6.5rem]`}
                    >
                        <div
                            className={classNames('text-sm flex items-center justify-center space-x-2', {
                                'text-darkBlue-5': platform === 'nami',
                                'text-nao-text2': platform === 'frame',
                                '!text-xs': xs
                            })}
                        >
                            <span>{t('nao:luckydraw:today_trading')}</span>
                            <div data-for="volume_tooltip" data-tip={t('nao:luckydraw:volume_tooltip')}>
                                <TooltipNami />
                            </div>
                        </div>
                        <div
                            className={classNames('text-lg leading-8 font-semibold', {
                                'text-teal': platform === 'nami',
                                'text-[#02FFFE]': platform === 'frame'
                            })}
                        >
                            {formatNumber(metadata.current)} VNDC
                        </div>
                        <div className={xs ? 'mt-4' : 'mt-8'}>
                            <div className="px-4 overflow-auto no-scrollbar w-full ">{renderReward()}</div>
                        </div>
                        {last_updated_at.current && (
                            <div
                                className={classNames('text-center text-xs mt-3', {
                                    'text-darkBlue-5': platform === 'nami',
                                    'text-nao-text2': platform === 'frame'
                                })}
                            >
                                <div>{t('nao:luckydraw:updated_vol')}</div>
                                <div>
                                    {t('nao:luckydraw:last_updated_time')}:{' '}
                                    {last_updated_at.current ? formatTime(last_updated_at.current, 'yyyy-MM-dd HH:mm:ss') : '-'}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={classNames(`fixed left-0 bottom-0 w-full ${platform === 'frame' ? 'bg-[#00288c]' : 'bg-[#0E1113]'}`)}>
                        <div
                            className={classNames('font-semibold leading-6 py-2.5 cursor-pointer relative mx-4 mb-8 mt-6', {
                                'bg-teal rounded-md': platform === 'nami',
                                'bg-nao-blue2 rounded-xl': platform === 'frame'
                            })}
                            onClick={() => claim()}
                        >
                            {t(`nao:luckydraw:${can_receive.current ? 'claim_now' : 'back_to_trading'}`)}
                        </div>
                    </div>
                </BackgroundImage>
            </Background>
        </LayoutNaoToken>
    );
};

const ModalClaim = ({ onClose, visible, platform, getImage, ticket, total_reward }) => {
    const { t } = useTranslation();
    const wrapperRef = useRef(null);

    useOutsideAlerter(wrapperRef, onClose);

    useEffect(() => {
        document.body.classList[visible ? 'add' : 'remove']('overflow-hidden');
        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [visible]);

    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    'flex flex-col items-center justify-center fixed top-0 right-0 h-full w-full z-[99]  overflow-hidden',
                    { invisible: !visible },
                    { visible: visible, 'bg-nao-bgShadow/[0.9]': platform === 'frame', 'bg-nao-nami/[0.95]': platform === 'nami' }
                )}
            >
                <BgModalClaim ref={wrapperRef} platform={platform} url={getImage(true)}>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center text-xs font-medium opacity-[0.65]">
                            <span>ID: #{ticket?.ticket_code}</span>&nbsp;
                            <span className="w-0.5 h-0.5 rounded-full bg-white/[0.65]" />
                            &nbsp;
                            <span>{formatTime(ticket?.time, 'yyyy-MM-dd HH:mm')}</span>
                        </div>
                        <div className="text-lg leading-6 mt-3">{t('nao:luckydraw:claim_success')}</div>
                        <div className="text-[2rem] leading-10 mt-2 font-semibold">{formatNumber(total_reward)} VNDC</div>
                    </div>
                    <div
                        className={classNames('font-semibold leading-6 py-2.5 cursor-pointer relative w-full', {
                            'bg-teal rounded-md': platform === 'nami',
                            'bg-nao-blue2 rounded-xl': platform === 'frame'
                        })}
                        onClick={onClose}
                    >
                        {t('common:close')}
                    </div>
                </BgModalClaim>
            </div>
        </Portal>
    );
};

const Background = styled.div.attrs({
    className: 'min-w-full no-scrollbar'
})`
    background: ${({ platform }) => (platform === 'frame' ? `#00288c` : '#0E1113')};
    /* height: calc(var(--vh, 1vh) * 100); */
    height: 100vh;
`;

const BackgroundImage = styled.div.attrs(({ width }) => ({
    className: classnames('min-w-full h-full flex flex-col justify-between relative', { 'px-4 pt-8 pb-6': width > 360 }, { 'p-4': width <= 360 })
}))`
    background-image: ${({ url }) => `url(${getS3Url(url)})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center top;
`;

const BgModalClaim = styled.div.attrs(({ width }) => ({
    className: classnames(
        'max-w-[330px] max-h-[560px] h-full w-full rounded-t-3xl px-4 pb-8 pt-[5rem] relative mx-[1.875rem] text-center flex flex-col items-center justify-between'
    )
}))`
    background-image: ${({ url }) => `url(${getS3Url(url)})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center top;
`;

export default Luckydraw;
