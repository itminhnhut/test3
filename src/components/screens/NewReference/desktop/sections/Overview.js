import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { renderRefInfo } from 'components/screens/NewReference/PopupModal';
import ReferralLevelIcon from 'components/svg/RefIcons';
import { Line } from 'components/screens/NewReference/mobile';
import { Progressbar } from 'components/screens/NewReference/mobile/sections/Info';
import { RegisterPartnerModal, renderSocials } from 'components/screens/NewReference/mobile/sections/Overview';
import InviteModal from 'components/screens/NewReference/mobile/sections/InviteModal';
import AddNewRef from '../../mobile/sections/Info/AddNewRef';
import EditNote from '../../mobile/sections/Info/EditNote';
import { FriendListIcon, NoteIcon } from '../../mobile/sections/Info/RefDetail';
import PopupModal, { CopyIcon } from '../../PopupModal';
import showNotification from 'utils/notificationService';
import _ from 'lodash';
import { NoData } from '../../mobile';
import FetchApi from 'utils/fetch-api';
import fetchAPI from 'utils/fetch-api';

import { useTranslation } from 'next-i18next';
import { API_KYC_STATUS, API_NEW_REFERRAL, API_NEW_REFERRAL_SET_DEFAULT, API_PARTNER_REGISTER } from 'redux/actions/apis';
import FriendList from '../../mobile/sections/Info/FriendList';
import colors from 'styles/colors';
import { IconLoading } from 'components/common/Icons';
import { ApiStatus } from 'redux/actions/const';
import { getS3Url } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

const formatter = Intl.NumberFormat('en', {
    notation: 'compact'
});

const Overview = ({ data, commisionConfig, t, width, user }) => {
    const {
        i18n: { language }
    } = useTranslation();
    const [showInvite, setShowInvite] = useState(false);
    const [showRef, setShowRef] = useState(false);
    const friendsGet = data?.defaultRefCode?.remunerationRate;
    const youGet = 100 - friendsGet;
    const handleCompactLink = (address, first, last) => {
        return address ? `${address.substring(0, first)}...${address.substring(address.length - last)}` : '';
    };
    const [showRegisterPartner, setShowRegisterPartner] = useState(false);
    const [kyc, setKyc] = useState(null);
    const [isPartner, setIsPartner] = useState(true);

    useEffect(() => {
        fetchAPI({
            url: API_KYC_STATUS,
            options: {
                method: 'GET'
            }
        }).then(({ status, data }) => {
            if (status === ApiStatus.SUCCESS) {
                setKyc(data);
            }
        });

        fetchAPI({
            url: API_PARTNER_REGISTER,
            options: {
                method: 'GET'
            }
        }).then(({ status, data }) => {
            if (status === ApiStatus.SUCCESS) {
                if (data?.phone?.length && data?.social_link?.length) {
                    setIsPartner(true);
                } else {
                    setIsPartner(false);
                }
            } else {
            }
        });
    }, [user]);

    const rank = {
        1: t('reference:referral.normal'),
        2: t('reference:referral.official'),
        3: t('reference:referral.gold'),
        4: t('reference:referral.platinum'),
        5: t('reference:referral.diamond')
    };
    return (
        <div
            className="p-20 w-full h-auto"
            style={{
                backgroundImage: `url('${getS3Url('/images/reference/background_desktop.png')}')`,
                backgroundSize: 'cover'
            }}
        >
            {showInvite && <InviteModal isShow={showInvite} onClose={() => setShowInvite(false)} code={data?.defaultRefCode?.code} />}
            {showRef && <RefDetail t={t} isShow={showRef} onClose={() => setShowRef(false)} rank={data?.rank ?? 1} defaultRef={data?.defaultRefCode?.code} />}
            {showRegisterPartner ? (
                <RegisterPartnerModal
                    isDesktop
                    setIsPartner={setIsPartner}
                    t={t}
                    kyc={kyc}
                    user={user}
                    isShow={showRegisterPartner}
                    onClose={() => setShowRegisterPartner(false)}
                />
            ) : null}
            <div className={classNames('font-semibold leading-[80px] text-[60px] text-gray-4')}>
                {t('reference:referral.introduce1')} <br />
                {t('reference:referral.introduce2')}
            </div>
            <div className="font-normal text-[20px] leading-[30px] text-gray-6 mt-6 tracking-wide max-w-[800px] mr-[300px]">
                {t('reference:referral.introduce3')}
            </div>
            <div className="font-normal text-[20px] leading-[30px] text-gray-6 mt-6 tracking-wide">
                {t('reference:referral.readmore')}{' '}
                <a
                    href={
                        language === LANGUAGE_TAG.VI
                            ? 'https://nami.exchange/vi/support/announcement/thong-bao/ra-mat-chuong-trinh-doi-tac-phat-trien-cong-dong-nami'
                            : 'https://nami.exchange/en/support/announcement/nami-news/official-launching-of-nami-community-development-partnership-program'
                    }
                    target={'_blank'}
                >
                    <span className="text-teal underline">{t('reference:referral.referral_policy')}</span>
                </a>
            </div>
            <div className="mt-8 flex gap-3">
                <div
                    className="rounded-md bg-teal text-gray-4 flex items-center justify-center px-11 py-2 w-fit cursor-pointer"
                    onClick={() => setShowInvite(true)}
                >
                    {t('reference:referral.invite_friends')}
                </div>
                {isPartner || !user ? null : (
                    <div
                        className="rounded-md bg-gray-4 text-teal flex items-center justify-center p-3 w-fit cursor-pointer"
                        onClick={() => setShowRegisterPartner(true)}
                    >
                        {t('reference:referral.partner.button')}
                    </div>
                )}
            </div>

            <div className="relative h-[150px]">
                <div className="w-full absolute bottom-[-220px] flex justify-between bg-white rounded-2xl gap-12 p-8">
                    <div className="w-full">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex gap-4 items-center">
                                <div className="flex relative items-center">
                                    <img src={user?.avatar || '/images/default_avatar.png'} className="h-full w-20 rounded-full" />
                                    <div className="absolute bottom-[-3px] right-[-8px]">{ReferralLevelIcon(data?.rank ?? 1, 22)}</div>
                                </div>
                                <div className="h-full flex flex-col">
                                    <div className="font-semibold text-[26px] leading-[31px] text-darkBlue">{data?.name ?? t('common:unknown')}</div>
                                    <div className="font-medium text-base leading-6 text-gray-1 uppercase">
                                        {t('reference:referral.ranking')}:{' '}
                                        <span className="text-teal font-semibold">{rank[data?.rank?.toString() ?? '0']}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-center leading-6 font-medium text-sm text-teal underline cursor-pointer" onClick={() => setShowRef(true)}>
                                    {t('reference:referral.referral_code_management')}
                                </div>
                            </div>
                        </div>
                        <Line className="mt-4 mb-[18px]" />
                        <div className="flex flex-col gap-2  font-medium text-sm">
                            <div className="w-full flex h-6 items-center justify-between text-gray-1 leading-6">
                                <div>{t('reference:referral.current_volume')}</div>
                                <div>{data?.rank !== 5 ? t('reference:referral.next_level') : null}</div>
                            </div>
                            <div className="w-full bg-[#f2f4f7] flex">
                                <Progressbar
                                    background="#17e5d4"
                                    percent={(data?.volume?.current?.spot / data?.volume?.target?.spot ?? 1) * 100}
                                    height={4}
                                    className={data?.volume?.current?.futures ? '!rounded-l-lg' : '!rounded-lg'}
                                />
                                <Progressbar
                                    background="#00C8BC"
                                    percent={(data?.volume?.current?.futures / data?.volume?.target?.futures ?? 1) * 100}
                                    height={4}
                                    className="!rounded-r-lg"
                                />
                            </div>
                            <div className="w-full flex flex-col leading-5">
                                <div className="w-full flex justify-between text-[#17e5d4]">
                                    <div>Spot: {isNaN(data?.volume?.current?.spot) ? '--' : formatter.format(data?.volume?.current?.spot)} USDT</div>
                                    {data?.rank !== 5 ? (
                                        <div>Spot: {isNaN(data?.volume?.target?.spot) ? '--' : formatter.format(data?.volume?.target?.spot)} USDT</div>
                                    ) : null}
                                </div>
                                <div className="w-full flex justify-between text-[#00c8bc]">
                                    <div>Futures: {isNaN(data?.volume?.current?.futures) ? '--' : formatter.format(data?.volume?.current?.futures)} USDT</div>
                                    {data?.rank !== 5 ? (
                                        <div>Futures: {isNaN(data?.volume?.target?.futures) ? '--' : formatter.format(data?.volume?.target?.futures)} USDT</div>
                                    ) : null}
                                </div>
                            </div>
                            {/* <div className='mt-6 text-center leading-6 font-medium text-sm text-teal underline cursor-pointer'
                            onClick={() => setShowRef(true)}
                        >
                            {t('reference:referral.referral_code_management')}
                        </div> */}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="pb-2 w-full text-sm font-medium leading-6">
                            <div className="flex w-full justify-between text-darkBlue">
                                <div> {t('reference:referral.referral_code')}</div>
                                <div>
                                    {t('reference:referral.rate', {
                                        value1: isNaN(youGet) ? '--' : youGet,
                                        value2: isNaN(friendsGet) ? '--' : friendsGet
                                    })}
                                </div>
                            </div>
                            <div className="mt-1">
                                {renderRefInfo(data?.defaultRefCode?.code ? data?.defaultRefCode?.code : '---', 'font-semibold text-lg leading-8', 16)}
                            </div>
                            <div className="flex w-full justify-between text-xs font-medium text-darkBlue mt-4">
                                <div>{t('reference:referral.ref_link')}</div>
                                <div>
                                    {t('reference:referral.rate', {
                                        value1: isNaN(youGet) ? '--' : youGet,
                                        value2: isNaN(friendsGet) ? '--' : friendsGet
                                    })}
                                </div>
                            </div>
                            <div className="mt-1">
                                {renderRefInfo(
                                    data?.defaultRefCode?.code
                                        ? handleCompactLink('https://nami.exchange/referral?ref=' + data?.defaultRefCode?.code, width < 320 ? 10 : 15, 12)
                                        : '---',
                                    'font-semibold text-lg leading-8',
                                    16,
                                    'https://nami.exchange/referral?ref=' + data?.defaultRefCode?.code
                                )}
                            </div>
                            <div className="mt-6">
                                {renderSocials(44, 'px-6 py-2 !h-auto !w-auto', 'https://nami.exchange/referral?ref=' + data?.defaultRefCode?.code)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;

const RefDetail = ({ t, isShow = false, onClose, rank, defaultRef }) => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const [refs, setRefs] = useState([]);
    const [showAddRef, setShowAddRef] = useState(false);
    const [showFriendList, setShowFriendList] = useState(false);
    const [showEditNote, setShowEditNote] = useState(false);
    const [doRefresh, setDoRefresh] = useState(false);
    const [code, setCode] = useState('');
    const [currentNote, setCurrentNote] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!isShow) return;
        setLoading(true);
        FetchApi({
            url: API_NEW_REFERRAL,
            options: {
                method: 'GET'
            }
        }).then(({ data, status }) => {
            if (status === 'ok') {
                data.sort((e) => e.status);
                setRefs(data);
            } else {
                setRefs([]);
            }
            setLoading(false);
        });
    }, [isShow, doRefresh]);

    const handleSetDefault = _.throttle(async (code) => {
        const { status } = await FetchApi({
            url: API_NEW_REFERRAL_SET_DEFAULT.replace(':code', code),
            options: {
                method: 'PATCH'
            }
        });
        if (status === 'ok') {
            showNotification(
                {
                    title: t('reference:referral.update_success'),
                    // title: t('common:success'),
                    type: 'success',
                    position: 'top',
                    container: 'top-left'
                },
                1800
            );
            // setDoRefresh(!doRefresh)
            setRefs(
                refs.map((e) => {
                    if (e.code === code) {
                        e.status = 1;
                    } else {
                        e.status = 0;
                    }
                    return e;
                })
            );
        } else {
        }
    }, 1000);

    return (
        <PopupModal
            contentClassname="!rounded !w-auto !pb-0 !px-0"
            isVisible={isShow}
            onBackdropCb={onClose}
            title={t('reference:referral.referral_code_management')}
            useCenter
            isDesktop
        >
            <div className="h-[calc(100%-61px)] px-[10px] pb-6">
                {showAddRef && (
                    <AddNewRef
                        // totalRate={commisionConfig?.[rank].direct.futures ?? 20}
                        isShow={showAddRef}
                        onClose={() => setShowAddRef(false)}
                        doRefresh={() => setDoRefresh(!doRefresh)}
                        defaultRef={defaultRef}
                        isDesktop
                    />
                )}
                {showFriendList && <FriendList isDesktop isShow={showFriendList} onClose={() => setShowFriendList(false)} code={code} />}
                {showEditNote && (
                    <EditNote
                        isShow={showEditNote}
                        currentNote={currentNote}
                        onClose={() => setShowEditNote(false)}
                        code={code}
                        doRefresh={() => setDoRefresh(!doRefresh)}
                        isDesktop
                    />
                )}
                <div className="px-[10px] overflow-y-auto max-h-[calc(100%-72px)]">
                    {loading ? (
                        <IconLoading color={colors.teal} />
                    ) : !refs.length ? (
                        <NoData text="No data" className="mt-4" />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {refs.map((data, index) => (
                                <div
                                    key={data.code}
                                    className="min-w-[400px] p-4 border-[1px] border-[#a0aec0
                                ] border-opacity-[15] rounded-md"
                                >
                                    <div className="flex w-full justify-between font-semibold text-sm leading-6 items-center">
                                        <div className="flex gap-2 items-center text-darkBlue">
                                            {data.code}
                                            <CopyIcon data={data.code} size={16} className="cursor-pointer" />
                                        </div>
                                        <div onClick={data.status ? null : () => handleSetDefault(data.code)}>
                                            <div
                                                className={classNames(
                                                    'px-2 py-1 rounded-md font-semibold text-sm leading-6 cursor-pointer',
                                                    data.status ? 'text-teal bg-teal/[.05]' : 'text-gray-1 bg-gray-1/[.05]'
                                                )}
                                            >
                                                {data.status ? t('reference:referral.default') : t('reference:referral.set_default')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 font-medium leading-5 flex flex-col gap-2">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-xs ">{t('reference:referral.you_friends_get')}</div>
                                            <div className="text-teal text-sm">
                                                {100 - data.remunerationRate}% / {data.remunerationRate}%
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-xs">{t('reference:referral.link')}</div>
                                            <div className="text-darkBlue text-sm flex gap-2 justify-end items-center w-fit">
                                                <div className="max-w-[140px] truncate">https://nami.exchange/ref/{data.code}</div>
                                                <CopyIcon data={`https://nami.exchange/ref/${data.code}`} size={13.5} className="cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-xs ">{t('reference:referral.friends')}</div>
                                            <div
                                                className="text-darkBlue text-sm flex items-center gap-1"
                                                onClick={() => {
                                                    setCode(data.code);
                                                    setShowFriendList(true);
                                                }}
                                            >
                                                {data.invitedCount ?? 0}
                                                <div className="cursor-pointer">
                                                    <FriendListIcon />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-xs ">{t('reference:referral.note')}</div>
                                            <div
                                                className="text-darkBlue text-sm flex items-center gap-1"
                                                onClick={() => {
                                                    setCode(data.code);
                                                    setCurrentNote(data.note ?? '');
                                                    setShowEditNote(true);
                                                }}
                                            >
                                                {data.note}
                                                <div className="cursor-pointer">
                                                    <NoteIcon />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="z-20 bg-white w-full flex justify-center mt-6 pb-7 px-4">
                    <div
                        className={classNames(
                            'h-11 bg-teal rounded-md w-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer',
                            {
                                '!bg-gray-3': refs.length >= 20
                            }
                        )}
                        onClick={refs.length >= 20 ? null : () => setShowAddRef(true)}
                    >
                        {t('reference:referral.add_ref_code')}
                    </div>
                </div>
            </div>
        </PopupModal>
    );
};
