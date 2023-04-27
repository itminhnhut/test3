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
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import debounce from 'lodash/debounce';
import { X } from 'react-feather';
import colors from 'styles/colors';
import { useSelector } from 'react-redux';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { useRouter } from 'next/router';
const maxWidth = 480;

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
    const isModal = width >= 820;
    const [showClaim, setShowClaim] = useState(false);
    const metadata = useRef(0);
    const [dataSource, setDataSource] = useState(initTickets);
    const can_receive = useRef(false);
    const total_reward = useRef(0);
    const last_updated_at = useRef(null);
    const [loading, setLoading] = useState(false);

    const getIcon = (act) => {
        const size = isModal ? 36 : xs ? 14 : 20;
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
            if (router.query?.web) {
                isAuth ? router.push('/') : window.open(getLoginUrl('sso'), '_self');
                return;
            }
            if (isModal) {
                isAuth ? onClose && onClose() : window.open(getLoginUrl('sso'), '_self');
                return;
            }
            emitWebViewEvent(isAuth ? 'back' : 'login');
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
    }, 200);

    const active = useMemo(() => {
        if (!isAuth || loading) return 0;
        const index = dataSource.findIndex((rs) => rs.vol_condition > metadata.current);
        return index !== -1 ? index - 1 : dataSource.length - 1;
    }, [dataSource, isAuth, loading]);

    const percent = useMemo(() => {
        if (!isAuth || loading) return 0;
        const current = metadata.current - dataSource?.[active]?.vol_condition;
        const next = dataSource?.[active + 1]?.vol_condition - dataSource?.[active]?.vol_condition;
        return dataSource?.[active + 1]?.vol_condition ? 1 - Math.abs(current - next) / next : isModal ? 0 : 100;
    }, [dataSource, active, isAuth, isModal, loading]);

    const offset = useMemo(() => {
        if (typeof window === 'undefined') return 0;
        const width = document.body.clientWidth >= maxWidth ? maxWidth : document.body.clientWidth;
        return width / 4 - (isModal ? 32 : 16);
    }, [dataSource, isModal]);

    const renderItem = (rs, idx, count, reverse, length) => {
        return (
            <div key={idx} className={`pt-1 relative ticket_${idx}${reverse ? '_reverse' : ''}`}>
                <div className="relative -bottom-2">
                    <div
                        className={classNames(`h-[3px] flex items-center bg-dark-2 relative ticket_line`, {
                            'rounded-l-xl': idx === 0,
                            'rounded-r-xl': idx === length - 1,
                            '-ml-4 w-[calc(100%+16px)]': idx === 0 && reverse && !isModal,
                            '-mr-4 w-[calc(100%+16px)]': idx === length - 1 && !isModal,
                            'ml-4': idx === 0 && isModal
                        })}
                    >
                        {active >= count ? (
                            <>
                                <div
                                    style={{
                                        width:
                                            active === count
                                                ? offset - (idx === 0 && !reverse ? 20 : 40) + percent * offset
                                                : `calc(100% + ${isModal ? '0px' : '16px'})`
                                    }}
                                    className={classNames(`h-[3px] transition absolute z-[1] bg-teal ticket_line_act`, {
                                        'rounded-l-xl': idx === 0 && !reverse,
                                        'rounded-r-xl': (active === count || idx === length - 1) && !reverse,
                                        'right-0 rounded-l-xl': active === count && reverse,
                                        '-ml-4 w-[calc(100%+16px)]': idx === 0 && !reverse && !isModal,
                                        '-mr-4 w-[calc(100%+16px)]': idx === length - 1 && !isModal
                                    })}
                                />
                                {!isModal && (
                                    <div
                                        className={classNames('w-5 h-5 rounded-full absolute left-1/2 -translate-x-1/2 z-[2]', {
                                            '-ml-2': idx === length - 1 && !isModal,
                                            'ml-2': idx === 0 && reverse && !isModal
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
                                        '-ml-2': idx === length - 1 && !isModal,
                                        'ml-2': idx === 0 && !isModal
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
                    className={classNames('relative m-auto py-4', { '!py-2': xs, '!mt-7 ': !isModal, '-top-1/2 translate-y-2 z-[2]': isModal })}
                >
                    <div className={isModal ? 'absolute top-[-18px]' : ''}>{getIcon(active >= count || rs.start)}</div>
                    <span
                        className={classNames(`text-sm sm:text-base font-semibold mt-2 mb-1 text-gray-4`, {
                            '!text-txtDisabled-dark': active < count,
                            '!text-xs': xs
                        })}
                    >
                        {rs.start ? t('common:luckydraw:start') : !loading ? `+${formatNumber(rs.value)}` : '-'}
                    </span>
                    <span className={classNames('text-xs text-txtSecondary', { '!text-txtDisabled-dark': active < count, '!text-[10x]': xs })}>
                        {!loading ? formatCurrency(rs.vol_condition, 0, language === 'vi') : '-'}
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
                    {!reverse && isModal && (
                        <svg className="reward_line z-10" width="24" height="142" viewBox="0 0 24 142" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                <span className="text-xl md:text-2xl text-teal font-semibold md:text-white">{t('common:luckydraw:take_reward')}</span>
                {!loading && (
                    <span className="text-txtSecondary-dark text-sm sm:text-base">
                        {!isAuth
                            ? t('common:luckydraw:login_trade')
                            : t(`common:luckydraw:${claimedAll ? 'reward_desc_trading_over' : can_receive.current ? 'reward_desc' : 'reward_desc_trading'}`, {
                                  vol: formatNumber(dataSource?.[active + 1]?.vol_condition - metadata.current) + ' VNDC',
                                  value: formatNumber(dataSource?.[active + 1]?.value || 0) + ' VNDC'
                              })}
                    </span>
                )}
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
                        left: isModal ? e.left : 32,
                        top: e.top - (isModal ? 12 : 12)
                    })}
                />
                <div
                    className={classNames('px-6 md:px-3 py-[10px] text-sm bg-teal/10 w-max rounded-full space-x-3 m-auto sm:mb-12', {
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
                    '!space-y-3 pb-12 px-4 w-full z-[1] bg-dark bottom-0 fixed': !isModal && !router.query?.web,
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
                <Button onClick={() => !loading && claim()}>
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
            <ModalClaim visible={showClaim} onClose={() => setShowClaim(false)} ticket={dataSource?.[active]} total_reward={total_reward.current} />
            {isModal ? (
                <Modal wrapClassName="!p-0" className="!max-w-[884px]" isVisible={visible} onBackdropCb={onClose} customHeader={() => {}}>
                    <BackgroundImage isModal={isModal} className="p-8">
                        <div className="flex justify-end">
                            <X color="#fff" onClick={onClose} size={24} className="cursor-pointer" />
                        </div>
                        <div className="mt-6 max-w-[444px] text-center">
                            <div className="flex flex-col space-y-3 mb-8">{renderTextReward()}</div>
                            {renderTextVol()}
                            <div className="space-y-[43px] relative top-8 mb-9">{renderReward()}</div>
                            {renderButton()}
                        </div>
                    </BackgroundImage>
                </Modal>
            ) : (
                <MaldivesLayout hideInApp={!router.query?.web}>
                    <Background>
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
                    </Background>
                </MaldivesLayout>
            )}
        </>
    );
});

const ModalClaim = ({ onClose, visible, ticket, total_reward }) => {
    const { t } = useTranslation();

    return (
        <Modal className="!max-w-[448px]" isMobile isVisible={visible} onBackdropCb={onClose}>
            <div className="flex flex-col items-center pb-6 sm:pb-0">
                <img className="w-[124px] h-[124px]" src={getS3Url('/images/screen/futures/luckdraw/bg_gift_claimed.png')} />
                <div className="flex items-center text-sm text-txtSecondary dark:text-txtSecondary-dark mt-6">
                    <span>ID: #{ticket?.ticket_code}</span>&nbsp;
                    <span className="w-0.5 h-0.5 rounded-full bg-darkBlue-5" />
                    &nbsp;
                    <span>{formatTime(ticket?.time, 'HH:mm:ss dd/MM/yyyy')}</span>
                </div>
                <div className="font-semibold text-xl space-y-3 mt-4 flex flex-col text-center">
                    <span className="">{t('common:luckydraw:claim_success')}</span>
                    <span className="text-teal">{formatNumber(total_reward)} VNDC</span>
                </div>
            </div>
        </Modal>
    );
};

const Background = styled.div.attrs({
    className: 'min-w-full no-scrollbar bg-dark'
})`
    height: 100vh;
`;

const BackgroundImage = styled.div.attrs(({ isModal }) => ({
    className: classNames('', { 'relative h-[272px]': !isModal })
}))`
    background-image: ${({ isModal }) => `url(${getS3Url(`/images/screen/futures/luckdraw/bg_lucky${isModal ? '' : '_mb'}.png`)})`};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    .reward_line {
        position: absolute;
        right: -12px;
        top: 11.5px;
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
