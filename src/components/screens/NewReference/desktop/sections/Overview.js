import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import ReferralLevelIcon from 'components/svg/RefIcons';
import { Progressbar } from 'components/screens/NewReference/mobile/sections/Info';
import { RegisterPartnerModal } from 'components/screens/NewReference/mobile/sections/Overview';
import AddNewRef from '../../mobile/sections/Info/AddNewRef';
import EditNote from '../../mobile/sections/Info/EditNote';
import { FriendListIcon, NoteIcon } from '../../mobile/sections/Info/RefDetail';
import { CopyIcon } from '../../PopupModal';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import QRCode from 'qrcode.react';
import { NoData } from '../../mobile';
import FetchApi from 'utils/fetch-api';
import fetchAPI from 'utils/fetch-api';
import { FacebookShareButton, RedditShareButton, TelegramShareButton, TwitterShareButton } from 'next-share';
import { useTranslation } from 'next-i18next';
import { API_KYC_STATUS, API_NEW_REFERRAL, API_NEW_REFERRAL_SET_DEFAULT, API_PARTNER_REGISTER, API_POST_PARTNER } from 'redux/actions/apis';
import FriendList from '../../mobile/sections/Info/FriendList';
import colors from 'styles/colors';
import { IconLoading } from 'components/common/Icons';
import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image-more';
import { throttle } from 'lodash';
import { getS3Url, getLoginUrl } from 'redux/actions/utils';
import TagV2 from 'components/common/V2/TagV2';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useRouter } from 'next/router';
import toast from 'utils/toast';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const AlertModalV2 = dynamic(() => import('components/common/V2/ModalV2/AlertModalV2'), { ssr: false });
const QRCodeScanFilled = dynamic(() => import('components/svg/QRCodeFilled'), { ssr: false });
const FacebookFilled = dynamic(() => import('components/svg/FacebookFilled'), { ssr: false });
const TwitterFilled = dynamic(() => import('components/svg/TwitterFilled'), { ssr: false });
const TelegramFilled = dynamic(() => import('components/svg/TelegramFilled'), { ssr: false });
const RedditFilled = dynamic(() => import('components/svg/RedditFilled'), { ssr: false });
const ModalV2 = dynamic(() => import('components/common/V2/ModalV2'), { ssr: false });
const Partner = dynamic(() => import('components/svg/Partner'), { ssr: false });
// const Withdrawal = dynamic(() => import('components/svg/Withdrawal'), { ssr: false });

const Spinner = dynamic(() => import('components/svg/Spinner'), { ssr: false });
import { useDispatch } from 'react-redux';
import { getMe } from 'redux/actions/user';

const formatter = Intl.NumberFormat('en', {
    notation: 'compact'
});

const policyLinkVI = 'https://nami.exchange/vi/support/announcement/tin-tuc-ve-nami/ra-mat-co-che-gioi-thieu-moi-tren-nami-exchange';
const policyLinkEN = 'https://nami.exchange/support/announcement/nami-news/officially-apply-the-new-referral-mechanism-on-nami-exchange';
const STATUS_OK = 'ok';

const Overview = ({ data, refreshData, commisionConfig, t, width, user, loading }) => {
    const [showRef, setShowRef] = useState(false);
    const friendsGet = data?.defaultRefCode?.remunerationRate;
    const youGet = 100 - friendsGet;
    const [showRegisterPartner, setShowRegisterPartner] = useState(false);
    const [kyc, setKyc] = useState(null);
    const [partner, setPartner] = useState(null);

    const [isPartner, setIsPartner] = useState(true);
    const [isWithdrawal, setIsWithdrawal] = useState(true);
    const [openShareModal, setOpenShareModal] = useState(false);

    const [isModalWithDrawal, setIsModalWithDrawal] = useState(false);

    const toggleWithdrawal = () => setIsModalWithDrawal((prev) => !prev);

    const {
        i18n: { language }
    } = useTranslation();
    const [currentTheme] = useDarkMode();
    const router = useRouter();

    // handle check KYC
    const auth = useSelector((state) => state.auth?.user);

    const [isOpenModalKyc, setIsOpenModalKyc] = useState(false);

    const handleBtnRegisterPartner = () => {
        if (auth?.kyc_status !== 2) {
            return setIsOpenModalKyc(true);
        } else {
            setShowRegisterPartner(true);
        }
    };

    useEffect(() => {
        const apiKYC = fetchAPI({
            url: API_KYC_STATUS,
            options: {
                method: 'GET'
            }
        });
        const apiPartner = fetchAPI({
            url: API_PARTNER_REGISTER,
            options: {
                method: 'GET'
            }
        });
        Promise.all([apiKYC, apiPartner])
            .then((value) => {
                const [dataKYC = {}, dataPartner = {}] = value || [];
                if (dataKYC?.status === STATUS_OK) setKyc(dataKYC?.data || {});
                if (dataPartner?.status === STATUS_OK) {
                    const { phone, social_link, status } = dataPartner?.data || {};
                    if (phone && social_link) {
                        status >= 1 ? setIsWithdrawal(true) : setIsWithdrawal(false);
                    } else {
                        setIsPartner(false);
                    }
                    setPartner(dataPartner?.data);
                }
            })
            .catch((err) => console.error(err));
    }, [user?.code]);

    const handleRegisterWithdrawal = async () => {
        try {
            const { data, message } = await FetchApi({
                url: API_POST_PARTNER,
                options: {
                    method: 'POST'
                },
                params: {
                    ...partner,
                    is_partner_trading: true
                }
            });
            if (data) {
                setIsModalWithDrawal(true);
                setIsWithdrawal(true);
            } else {
                console.error('data', message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const rank = {
        1: t('reference:referral.normal'),
        2: t('reference:referral.official'),
        3: t('reference:referral.gold'),
        4: t('reference:referral.platinum'),
        5: t('reference:referral.diamond')
    };

    const refLink = data?.defaultRefCode?.code ? 'https://nami.exchange/ref/' + data?.defaultRefCode?.code : '---';
    const policyLink = language === 'vi' ? policyLinkVI : policyLinkEN;

    return (
        <>
            {/* Card banner slogan */}
            <div className="w-full bg-[#0C0C0C] ">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
                    <div className="bg-cover bg-center w-[1484px] h-[430px]">
                        <div className="absolute -z-10">
                            <Image src={getS3Url(`/images/reference/background_desktop_2.png`)} width="1184" height="430" objectFit="cover" />
                        </div>
                        <div className="py-20 container absolute">
                            <ModalShareRefCode t={t} code={data?.defaultRefCode?.code} open={openShareModal} onClose={() => setOpenShareModal(false)} />
                            {showRef && (
                                <RefDetail
                                    t={t}
                                    refreshData={refreshData}
                                    isShow={showRef}
                                    onClose={() => setShowRef(false)}
                                    rank={data?.rank ?? 1}
                                    defaultRef={data?.defaultRefCode?.code}
                                />
                            )}
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
                            <div className={classNames('font-semibold leading-[3.625rem] text-[2.75rem] text-gray-4')}>
                                {t('reference:referral.introduce1')} <br />
                                {t('reference:referral.introduce2')}
                            </div>
                            <div className="font-normal text-gray-6 mt-6 tracking-wide max-w-[800px] mr-[300px]">
                                <p>{t('reference:referral.introduce3')}</p>
                                <p className="mt-1">{t('reference:referral.readmore')}:</p>
                            </div>

                            <div className="flex gap-6 mt-7 select-none">
                                {!isPartner && (
                                    <button
                                        onClick={() => handleBtnRegisterPartner()}
                                        className="flex px-4 py-3 border border-teal bg-teal/[.1] text-white rounded-md font-semibold"
                                    >
                                        <Partner />
                                        <span className="ml-2">{t('reference:referral.partner.button')}</span>
                                    </button>
                                )}
                                {!isWithdrawal && (
                                    <button
                                        onClick={() => handleRegisterWithdrawal()}
                                        className="flex px-4 py-3 border border-teal bg-teal/[.1] text-white rounded-md font-semibold"
                                    >
                                        <Image src="/images/reference/register_withdrawal.png" width="24" height="24" />
                                        <span className="ml-2">{t('reference:withdrawal.title')}</span>
                                    </button>
                                )}
                                <div
                                    className="px-4 py-3 border border-teal bg-teal/[.1] text-white rounded-md cursor-pointer font-semibold"
                                    onClick={() => router.push(policyLink)}
                                >
                                    <span>{t('reference:referral.referral_policy')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card infor general */}

            <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
                {auth ? (
                    <div className="container  bg-white dark:bg-darkBlue-3 grid grid-cols-2 rounded-2xl p-6">
                        <div className="border-r dark:border-divider-dark pr-8">
                            <div className="w-full flex justify-between items-center">
                                <div className="flex gap-4 items-center mb-10">
                                    <div className="flex relative items-center">
                                        <Image
                                            width="80"
                                            height="80"
                                            objectFit="fill"
                                            className="rounded-full"
                                            src={user?.avatar || '/images/default_avatar.png'}
                                        />
                                        {/* <img src={user?.avatar || '/images/default_avatar.png'} className="h-full w-20 h-20 rounded-full object-fit" /> */}
                                        <div className="absolute bottom-[-1px] right-[-1px]">{ReferralLevelIcon(data?.rank ?? 1, 32)}</div>
                                    </div>
                                    <div className="h-full flex flex-col">
                                        <p className="font-semibold text-2xl leading-[30px] mb-2">
                                            {auth?.name ?? auth?.username ?? auth?.email ?? auth?.namiID ?? t('common:unknown')}
                                        </p>
                                        <span className="text-txtSecondary dark:text-txtSecondary-dark leading-6">
                                            <span>{t('reference:referral.ranking')}: </span>
                                            <span className="text-teal font-semibold">{rank[data?.rank?.toString() ?? user?.rank_id?.toString() ?? '1']}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm space-y-3">
                                <div className="w-full flex items-center justify-between text-gray-1">
                                    <div>{t('reference:referral.current_volume')}</div>
                                    <div>{data?.rank !== 5 ? t('reference:referral.next_level') : null}</div>
                                </div>
                                <div className="w-full bg-gray-12 rounded-full overflow-hidden flex">
                                    <Progressbar
                                        background={colors.green[3]}
                                        percent={(data?.volume?.current?.spot / data?.volume?.target?.spot ?? 1) * 100}
                                        height={8}
                                        className={data?.volume?.current?.futures ? '!rounded-l-lg' : '!rounded-lg'}
                                    />
                                    <Progressbar
                                        background={colors.blue[5]}
                                        percent={(data?.volume?.current?.futures / data?.volume?.target?.futures ?? 1) * 100}
                                        height={8}
                                        className="!rounded-r-lg"
                                    />
                                </div>
                                <div className="w-full flex flex-col leading-5">
                                    <div className="w-full flex justify-between text-teal">
                                        <div>Exchange: {isNaN(data?.volume?.current?.spot) ? '--' : formatter.format(data?.volume?.current?.spot)} USDT</div>
                                        <div>Exchange: {isNaN(data?.volume?.target?.spot) ? '--' : formatter.format(data?.volume?.target?.spot)} USDT</div>
                                        {/* {data?.rank !== 5 ? (
                                            <div>Spot: {isNaN(data?.volume?.target?.spot) ? '--' : formatter.format(data?.volume?.target?.spot)} USDT</div>
                                        ) : null} */}
                                    </div>
                                    <div className="w-full flex justify-between text-blue-crayola">
                                        <div>
                                            Futures: {isNaN(data?.volume?.current?.futures) ? '--' : formatter.format(data?.volume?.current?.futures)} USDT
                                        </div>
                                        <div>Futures: {isNaN(data?.volume?.target?.futures) ? '--' : formatter.format(data?.volume?.target?.futures)} USDT</div>
                                        {/* {data?.rank !== 5 ? (
                                            <div>
                                                Futures: {isNaN(data?.volume?.target?.futures) ? '--' : formatter.format(data?.volume?.target?.futures)} USDT
                                            </div>
                                        ) : null} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pl-8 space-y-5">
                            <div className="flex items-center justify-between py-3">
                                <p className="text-sm font-semibold">
                                    {t('reference:referral.rate', {
                                        value1: isNaN(youGet) ? '--' : youGet,
                                        value2: isNaN(friendsGet) ? '--' : friendsGet
                                    })}
                                </p>
                                <ButtonV2 className="!w-auto px-6" onClick={() => setShowRef(true)}>
                                    {t('reference:referral.referral_code_management')}
                                </ButtonV2>
                            </div>
                            <div className="flex">
                                <div className="mr-6">
                                    <p className="mb-2 text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('reference:referral.referral_code')}</p>
                                    <div className="flex items-center p-3 rounded-md bg-gray-10 dark:bg-dark-2">
                                        <span className="pr-4 font-semibold leading-6">{data?.defaultRefCode?.code ?? '---'}</span>
                                        {loading ? (
                                            <Spinner size={16} color={currentTheme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} />
                                        ) : (
                                            <CopyIcon data={data?.defaultRefCode?.code} size={16} className="cursor-pointer" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="mb-2 text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('reference:referral.link')}</p>
                                    <div className="relative flex justify-between items-center p-3 rounded-md bg-gray-10 dark:bg-dark-2">
                                        <div className="w-full relative flex flex-1 min-w-0 pr-2 leading-6 font-semibold">{refLink}</div>
                                        {loading ? (
                                            <Spinner size={16} color={currentTheme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} />
                                        ) : (
                                            <CopyIcon data={refLink} size={16} className="cursor-pointer" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-6">
                                <div
                                    className="flex justify-center bg-gray-10 dark:bg-dark-2 rounded-md py-[10px] cursor-pointer"
                                    onClick={() => setOpenShareModal(true)}
                                >
                                    <QRCodeScanFilled color={currentTheme === THEME_MODE.DARK ? colors.gray['10'] : colors.darkBlue} />
                                </div>
                                {[
                                    {
                                        btn: FacebookShareButton,
                                        icon: FacebookFilled,
                                        link: '',
                                        name: 'facebook'
                                    },
                                    {
                                        btn: TwitterShareButton,
                                        icon: TwitterFilled,
                                        link: '',
                                        name: 'twitter'
                                    },
                                    {
                                        btn: TelegramShareButton,
                                        icon: TelegramFilled,
                                        link: '',
                                        name: 'telegram'
                                    },
                                    {
                                        btn: RedditShareButton,
                                        icon: RedditFilled,
                                        link: '',
                                        name: 'reddit'
                                    }
                                ].map((e) => {
                                    return (
                                        <div key={e.name} className="flex justify-center bg-gray-10 dark:bg-dark-2 rounded-md py-[10px] cursor-pointer">
                                            {React.createElement(e.btn, {
                                                children: React.createElement(e.icon, {
                                                    color: currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.gray['10'],
                                                    color2: currentTheme === THEME_MODE.LIGHT ? colors.gray['10'] : colors.dark['2']
                                                }),
                                                url: refLink
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="container text-center bg-white dark:bg-darkBlue-3 rounded-xl py-[50px] ">
                        <img src={getS3Url('/images/screen/swap/login-success.png')} alt="" className="mx-auto h-[124px] w-[124px]" />
                        <p className="!text-base text-txtSecondary dark:text-txtSecondary-dark mt-3">
                            <a href={getLoginUrl('sso')} className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4">
                                {t('common:sign_in')}{' '}
                            </a>
                            {t('common:or')}{' '}
                            <a
                                href={getLoginUrl('sso', 'register')}
                                className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4"
                            >
                                {t('common:sign_up')}{' '}
                            </a>
                            {t('common:swap_history')}
                        </p>
                    </div>
                )}
            </div>
            <ModalV2 isVisible={isModalWithDrawal} className="w-[30.5rem]" onBackdropCb={toggleWithdrawal}>
                <div className="flex justify-center">
                    <Image src="/images/reference/withdrawal.png" width="124" height="124" />
                </div>
                <div className="text-txtPrimary dark:text-gray-4 text-2xl mt-6 mb-4 text-center">{t('reference:withdrawal.content')}</div>
                <div className="text-gray-9 dark:text-gray-7 text-center">{t('reference:withdrawal.success')}</div>
            </ModalV2>
            <AlertModalV2
                type="error"
                isVisible={isOpenModalKyc}
                onClose={() => setIsOpenModalKyc(false)}
                message={t('reference:referral.partner.no_kyc')}
                buttonClassName="dark:text-green-2 text-green-3"
                title={t('reference:referral.partner.no_kyc_title')}
            />
        </>
    );
};

export default Overview;

const MAX_LIST = 20;
const RefDetail = ({ t, isShow = false, refreshData, onClose, rank, defaultRef }) => {
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
    const dispatch = useDispatch();

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

    const handleSetDefault = throttle(async (code) => {
        const { status } = await FetchApi({
            url: API_NEW_REFERRAL_SET_DEFAULT.replace(':code', code),
            options: {
                method: 'PATCH'
            }
        });
        if (status === 'ok') {
            toast({
                text: t('reference:referral.update_success'),
                type: 'success'
            });
            // setDoRefresh(!doRefresh)
            dispatch(getMe(true));
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
            // if (refreshData) refreshData();
        } else {
        }
    }, 1000);

    return (
        <>
            <ModalV2 isVisible={isShow} onBackdropCb={onClose} className="max-w-[884px] h-[90%]" wrapClassName="!px-6 flex flex-col">
                <AddNewRef
                    // totalRate={commisionConfig?.[rank].direct.futures ?? 20}
                    isShow={showAddRef}
                    onClose={() => setShowAddRef(false)}
                    doRefresh={() => setDoRefresh(!doRefresh)}
                    refreshData={refreshData}
                    defaultRef={defaultRef}
                    isDesktop
                />

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
                <div className="-mx-6 px-6 pb-3 text-2xl font-semibold">{t('reference:referral.referral_code_management')}</div>
                <div className="overflow-y-auto flex-1 min-h-0 mb-8 py-6 px-6 -mx-6 bg-gray-10 dark:bg-transparent">
                    {loading ? (
                        <IconLoading color={colors.teal} />
                    ) : !refs.length ? (
                        <NoData text="No data" className="my-auto" />
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {refs.map((data, index) => (
                                <div key={data.code} className="p-4 bg-white dark:bg-darkBlue-3 rounded-xl">
                                    <div className="flex w-full justify-between leading-6 items-center">
                                        <div className="flex gap-2 items-center font-semibold">
                                            {data.code}
                                            <CopyIcon data={data.code} size={24} className="cursor-pointer" />
                                        </div>
                                        <div onClick={data.status ? null : () => handleSetDefault(data.code)} className="text-sm cursor-pointer select-none">
                                            {data.status ? (
                                                <TagV2 type="success">{t('reference:referral.default')}</TagV2>
                                            ) : (
                                                <div className="bg-gray-10 dark:bg-dark-2 font-semibold rounded-lg px-4 py-2 text-darkBlue dark:text-txtSecondary-dark">
                                                    {t('reference:referral.set_default')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-6 leading-6 space-y-3">
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-sm">{t('reference:referral.you_friends_get')}</div>
                                            <div className="text-teal text-sm font-semibold">
                                                {100 - data.remunerationRate}%/{data.remunerationRate}%
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-sm">{t('reference:referral.link')}</div>
                                            <div className="text-sm flex gap-2 justify-end items-center w-fit">
                                                <div className="max-w-[140px] truncate">https://nami.exchange/ref/{data.code}</div>
                                                <CopyIcon
                                                    color={colors.darkBlue5}
                                                    data={`https://nami.exchange/ref/${data.code}`}
                                                    size={16}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-sm">{t('reference:referral.friends')}</div>
                                            <div
                                                className="text-sm flex items-center gap-2"
                                                onClick={() => {
                                                    setCode(data.code);
                                                    setShowFriendList(true);
                                                }}
                                            >
                                                {data.invitedCount ?? 0}
                                                <div className="cursor-pointer">
                                                    <FriendListIcon size={16} color={colors.darkBlue5} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full flex justify-between items-center">
                                            <div className="text-gray-1 text-sm">{t('reference:referral.note')}</div>
                                            <div
                                                className="text-sm flex items-center gap-2"
                                                onClick={() => {
                                                    setCode(data.code);
                                                    setCurrentNote(data.note ?? '');
                                                    setShowEditNote(true);
                                                }}
                                            >
                                                {data.note}
                                                <div className="cursor-pointer">
                                                    <NoteIcon size={16} color={colors.darkBlue5} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="z-20 w-full flex justify-center">
                    <ButtonV2 disabled={refs.length >= MAX_LIST} onClick={refs.length >= MAX_LIST ? null : () => setShowAddRef(true)}>
                        {t('reference:referral.add_ref_code')}
                    </ButtonV2>
                </div>
            </ModalV2>
        </>
    );
};

const ModalShareRefCode = ({ code, open, onClose, t }) => {
    const [downloading, setDownloading] = useState(false);
    const ref = useRef(null);

    const downloadImage = (name) => {
        const node = ref.current;
        if (downloading || !node) return;
        setDownloading(true);
        const element = ReactDOM.findDOMNode(node);

        domtoimage
            .toPng(element)
            .then(function (uri) {
                const link = document.createElement('a');

                link.href = uri;
                link.download = name + '.png';

                // 2: Mount and trigger click link
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((e) => console.error(e, 'CHECK'))
            .finally(() => setDownloading(false));
    };

    return (
        <ModalV2 isVisible={open} onBackdropCb={onClose} className="w-[36.75rem]">
            <p className="text-2xl font-semibold mb-6">{t('reference:referral.share.title')}</p>
            <div ref={ref} className="h-[380px] w-[524px] rounded-xl p-6 py-4 relative overflow-hidden">
                <img className="absolute inset-0" src="https://nami.exchange/bg_share_ref_code.png" alt="" />
                <div className="absolute inset-x-4">
                    <img width={99} src="https://nami.exchange/nami-logo-v2.png" alt="Nami exchange" />
                    <div className="mt-12">
                        <p className="text-2xl text-teal font-semibold mb-4">{t('reference:referral.share.title_2')}</p>
                        <p className="mr-48">
                            <span
                                className="font-semibold text-white"
                                dangerouslySetInnerHTML={{
                                    __html: t('reference:referral.share.content', {
                                        percent: `<span class='font-semibold text-3xl text-teal'>20%</span>`
                                    })
                                }}
                            />
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-[6.25rem] rounded-b-xl flex items-center justify-between px-6 py-4">
                    <img className="absolute inset-x-0" src="https://nami.exchange/bg_share_ref_code_2.png" alt="" />
                    <div className="flex-1 z-10">
                        <div className="text-txtSecondary-dark whitespace-nowrap">{t('reference:referral.share.scan_and_join')}</div>
                        <div className="text-lg text-white font-semibold">
                            <span className="mr-3">{t('reference:referral.share.id_referral')}</span>
                            <span>{code}</span>
                        </div>
                    </div>
                    <div className="p-[.375rem] bg-white rounded z-10">
                        <QRCode value={'https://nami.exchange/ref/' + code} size={68} />
                    </div>
                </div>
            </div>
            <ButtonV2 className="mt-6" loading={downloading} onClick={() => downloadImage(code)}>
                {t('reference:referral.share.btn')}
            </ButtonV2>
        </ModalV2>
    );
};
