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
import showNotification from 'utils/notificationService';
import QRCodeScanFilled from 'components/svg/QRCodeFilled';
import FacebookFilled from 'components/svg/FacebookFilled';
import TwitterFilled from 'components/svg/TwitterFilled';
import TelegramFilled from 'components/svg/TelegramFilled';
import RedditFilled from 'components/svg/RedditFilled';
import ModalV2 from 'components/common/V2/ModalV2';
import Partner from 'components/svg/Partner';
import { NoData } from '../../mobile';
import FetchApi from 'utils/fetch-api';
import fetchAPI from 'utils/fetch-api';
import {
    FacebookShareButton,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton
} from 'next-share';
import { useTranslation } from 'next-i18next';
import {
    API_KYC_STATUS,
    API_NEW_REFERRAL,
    API_NEW_REFERRAL_SET_DEFAULT,
    API_PARTNER_REGISTER
} from 'redux/actions/apis';
import FriendList from '../../mobile/sections/Info/FriendList';
import colors from 'styles/colors';
import { IconLoading } from 'components/common/Icons';
import { ApiStatus } from 'redux/actions/const';
import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image-more';
import { throttle } from 'lodash';
import { getS3Url } from 'redux/actions/utils';
import TagV2 from 'components/common/V2/TagV2';

const formatter = Intl.NumberFormat('en', {
    notation: 'compact'
});

const policyLinkVI = 'https://nami.exchange/vi/support/announcement/tin-tuc-ve-nami/ra-mat-co-che-gioi-thieu-moi-tren-nami-exchange';
const policyLinkEN = 'https://nami.exchange/support/announcement/nami-news/officially-apply-the-new-referral-mechanism-on-nami-exchange';

const Overview = ({
    data,
    commisionConfig,
    t,
    width,
    user
}) => {
    const {
        i18n: { language }
    } = useTranslation();
    const [showRef, setShowRef] = useState(false);
    const friendsGet = data?.defaultRefCode?.remunerationRate;
    const youGet = 100 - friendsGet;
    const handleCompactLink = (address, first, last) => {
        return address ? `${address.substring(0, first)}...${address.substring(address.length - last)}` : '';
    };
    const [showRegisterPartner, setShowRegisterPartner] = useState(false);
    const [kyc, setKyc] = useState(null);
    const [isPartner, setIsPartner] = useState(true);
    const [openShareModal, setOpenShareModal] = useState(false);

    useEffect(() => {
        fetchAPI({
            url: API_KYC_STATUS,
            options: {
                method: 'GET'
            }
        })
            .then(({
                status,
                data
            }) => {
                if (status === ApiStatus.SUCCESS) {
                    setKyc(data);
                }
            });

        fetchAPI({
            url: API_PARTNER_REGISTER,
            options: {
                method: 'GET'
            }
        })
            .then(({
                status,
                data
            }) => {
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

    const refLink = data?.defaultRefCode?.code ? 'https://nami.exchange/ref/' + data?.defaultRefCode?.code : '---';
    const policyLink = language === 'vi' ? policyLinkVI : policyLinkEN;

    return (
        <>
            <div
                className='w-full h-[27.5rem] bg-[#0C0C0C]'
                style={{
                    backgroundImage: `url('${getS3Url('/images/reference/background_desktop_2.png')}')`,
                    backgroundSize: 'cover'
                }}
            >
                <div className='py-20 container h-full'
                >
                    <ModalShareRefCode t={t} code={data?.defaultRefCode?.code} open={openShareModal}
                                       onClose={() => setOpenShareModal(false)} />
                    {showRef &&
                        <RefDetail t={t} isShow={showRef} onClose={() => setShowRef(false)} rank={data?.rank ?? 1}
                                   defaultRef={data?.defaultRefCode?.code} />}
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
                    <div
                        className='font-normal text-gray-6 mt-6 tracking-wide max-w-[800px] mr-[300px]'>
                        <p>{t('reference:referral.introduce3')}</p>
                        <p className='mt-1'>{t('reference:referral.readmore')}:</p>
                    </div>

                    <div className='flex gap-6 mt-7 select-none'>
                        {
                            (isPartner || !user) &&
                            <div
                                className='px-4 py-3 border border-teal bg-teal/[.1] rounded-md cursor-pointer font-bold'>
                                <span>{t('reference:referral.referral_policy')}</span>
                            </div>
                        }
                        {
                            !isPartner &&
                            <div
                                onClick={() => setShowRegisterPartner(true)}
                                className='flex px-4 py-3 border border-teal bg-teal/[.1] rounded-md cursor-pointer font-bold'>
                                <Partner /><span className='ml-2'>{t('reference:referral.partner.button')}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className='container bg-darkBlue-3 grid grid-cols-2 rounded-2xl p-8'>
                <div className='border-r border-divider-dark pr-8'>
                    <div className='w-full flex justify-between items-center'>
                        <div className='flex gap-4 items-center mb-10'>
                            <div className='flex relative items-center'>
                                <img src={user?.avatar || '/images/default_avatar.png'}
                                     className='h-full w-20 rounded-full' />
                                <div
                                    className='absolute bottom-[-1px] right-[-1px]'>{ReferralLevelIcon(data?.rank ?? 1, 32)}</div>
                            </div>
                            <div className='h-full flex flex-col'>
                                <p className='font-bold text-[22px] leading-[30px] mb-2'>{data?.name ?? t('common:unknown')}</p>
                                <span className='text-txtSecondary leading-6'>
                                    {t('reference:referral.ranking')}:{' '}
                                    <span
                                        className='text-teal font-bold'>{rank[data?.rank?.toString() ?? '0']}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='text-sm space-y-3'>
                        <div className='w-full flex items-center justify-between text-gray-1'>
                            <div>{t('reference:referral.current_volume')}</div>
                            <div>{data?.rank !== 5 ? t('reference:referral.next_level') : null}</div>
                        </div>
                        <div className='w-full bg-white rounded-full flex'>
                            <Progressbar
                                background={colors.teal}
                                percent={(data?.volume?.current?.spot / data?.volume?.target?.spot ?? 1) * 100}
                                height={8}
                                className={data?.volume?.current?.futures ? '!rounded-l-lg' : '!rounded-lg'}
                            />
                            <Progressbar
                                background={colors.blue1}
                                percent={(data?.volume?.current?.futures / data?.volume?.target?.futures ?? 1) * 100}
                                height={8}
                                className='!rounded-r-lg'
                            />
                        </div>
                        <div className='w-full flex flex-col leading-5'>
                            <div className='w-full flex justify-between text-teal'>
                                <div>Spot: {isNaN(data?.volume?.current?.spot) ? '--' : formatter.format(data?.volume?.current?.spot)} USDT</div>
                                {data?.rank !== 5 ? (
                                    <div>Spot: {isNaN(data?.volume?.target?.spot) ? '--' : formatter.format(data?.volume?.target?.spot)} USDT</div>
                                ) : null}
                            </div>
                            <div className='w-full flex justify-between text-blue-crayola'>
                                <div>Futures: {isNaN(data?.volume?.current?.futures) ? '--' : formatter.format(data?.volume?.current?.futures)} USDT</div>
                                {data?.rank !== 5 ? (
                                    <div>Futures: {isNaN(data?.volume?.target?.futures) ? '--' : formatter.format(data?.volume?.target?.futures)} USDT</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='pl-8 space-y-5'>
                    <div className='flex items-center justify-between py-3'>
                        <p className='text-sm font-bold'>
                            {t('reference:referral.rate', {
                                value1: isNaN(youGet) ? '--' : youGet,
                                value2: isNaN(friendsGet) ? '--' : friendsGet
                            })}
                        </p>
                        <ButtonV2
                            className='!w-auto px-6'
                            onClick={() => setShowRef(true)}
                        >
                            {t('reference:referral.referral_code_management')}
                        </ButtonV2>
                    </div>
                    <div className='flex'>
                        <div className='mr-6'>
                            <p className='mb-2 text-sm text-txtSecondary'>{t('reference:referral.referral_code')}</p>
                            <div className='flex items-center p-3 rounded-md bg-dark-2'>
                                <span className='pr-4 font-bold leading-6'>{data?.defaultRefCode?.code ?? '---'}</span>
                                <CopyIcon data={data?.defaultRefCode?.code} size={14} className='cursor-pointer' />
                            </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                            <p className='mb-2 text-sm text-txtSecondary'>{t('reference:referral.referral_code')}</p>
                            <div className='relative flex justify-between items-center p-3 rounded-md bg-dark-2'>
                                <div className='w-full relative flex flex-1 min-w-0 pr-2 leading-6 font-bold'>
                                    {refLink}
                                </div>
                                <CopyIcon data={refLink} size={14} className='cursor-pointer' />
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-5 gap-6'>
                        <div className='flex justify-center bg-dark-2 rounded-md py-[10px] cursor-pointer'
                             onClick={() => setOpenShareModal(true)}>
                            <QRCodeScanFilled />
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
                        ].map(e => {
                            return <div
                                key={e.name}
                                className='flex justify-center bg-dark-2 rounded-md py-[10px] cursor-pointer'
                            >
                                {React.createElement(e.btn, {
                                    children: React.createElement(e.icon),
                                    url: refLink
                                })}
                            </div>;
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Overview;

const RefDetail = ({
    t,
    isShow = false,
    onClose,
    rank,
    defaultRef
}) => {
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
        })
            .then(({
                data,
                status
            }) => {
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
        <ModalV2
            isVisible={isShow}
            onBackdropCb={onClose}
            className='max-w-[884px] h-[90%]'
            wrapClassName='px-6 flex flex-col'
        >
            <div className='text-center border-b border-divider-dark -mx-6 pb-5 pt-6 text-[22px] font-semibold'>
                {t('reference:referral.referral_code_management')}
            </div>
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
            {showFriendList &&
                <FriendList isDesktop isShow={showFriendList} onClose={() => setShowFriendList(false)}
                            code={code} />}
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
            <div className='overflow-y-auto min-h-min my-8 -mr-4 pr-4'>
                {loading ? (
                    <IconLoading color={colors.teal} />
                ) : !refs.length ? (
                    <NoData text='No data' className='my-auto' />
                ) : (
                    <div className='grid grid-cols-2 gap-4'>
                        {refs.map((data, index) => (
                            <div
                                key={data.code}
                                className='p-4 bg-darkBlue-3 rounded-xl'
                            >
                                <div
                                    className='flex w-full justify-between font-semibold text-sm leading-6 items-center'>
                                    <div className='flex gap-2 items-center font-semibold'>
                                        {data.code}
                                        <CopyIcon data={data.code} size={24} className='cursor-pointer' />
                                    </div>
                                    <div onClick={data.status ? null : () => handleSetDefault(data.code)}>
                                        {
                                            data.status ?
                                                <TagV2 type='success'>{t('reference:referral.default')}</TagV2>
                                                : <div className='bg-dark-2 rounded-lg px-4 py-2 text-txtSecondary'>
                                                    {t('reference:referral.set_default')}
                                                </div>
                                        }
                                    </div>
                                </div>
                                <div className='mt-6 leading-6 space-y-3'>
                                    <div className='w-full flex justify-between items-center'>
                                        <div
                                            className='text-gray-1 text-sm'>{t('reference:referral.you_friends_get')}</div>
                                        <div className='text-teal text-sm font-semibold'>
                                            {100 - data.remunerationRate}%/{data.remunerationRate}%
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-gray-1 text-sm'>{t('reference:referral.link')}</div>
                                        <div
                                            className='text-sm flex gap-2 justify-end items-center w-fit'>
                                            <div
                                                className='max-w-[140px] truncate'>https://nami.exchange/ref/{data.code}</div>
                                            <CopyIcon color={colors.darkBlue5}
                                                      data={`https://nami.exchange/ref/${data.code}`} size={16}
                                                      className='cursor-pointer' />
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-between items-center'>
                                        <div
                                            className='text-gray-1 text-sm'>{t('reference:referral.friends')}</div>
                                        <div
                                            className='text-sm flex items-center gap-2'
                                            onClick={() => {
                                                setCode(data.code);
                                                setShowFriendList(true);
                                            }}
                                        >
                                            {data.invitedCount ?? 0}
                                            <div className='cursor-pointer'>
                                                <FriendListIcon size={16} color={colors.darkBlue5} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full flex justify-between items-center'>
                                        <div className='text-gray-1 text-sm'>{t('reference:referral.note')}</div>
                                        <div
                                            className='text-sm flex items-center gap-2'
                                            onClick={() => {
                                                setCode(data.code);
                                                setCurrentNote(data.note ?? '');
                                                setShowEditNote(true);
                                            }}
                                        >
                                            {data.note}
                                            <div className='cursor-pointer'>
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
            <div className='z-20 w-full flex justify-center'>
                <div
                    className={classNames(
                        'bg-teal rounded-md w-full py-3 text-center text-white font-semibold cursor-pointer select-none',
                        {
                            '!bg-gray-3': refs.length >= 20
                        }
                    )}
                    onClick={refs.length >= 20 ? null : () => setShowAddRef(true)}
                >
                    {t('reference:referral.add_ref_code')}
                </div>
            </div>
        </ModalV2>
    );
};

const ModalShareRefCode = ({
    code,
    open,
    onClose,
    t
}) => {
    const [downloading, setDownloading] = useState(false);
    const ref = useRef(null);

    const downloadImage = (name) => {
        const node = ref.current;
        if (downloading || !node) return;
        setDownloading(true);
        const element = ReactDOM.findDOMNode(node);

        domtoimage.toPng(element)
            .then(function (uri) {
                const link = document.createElement('a');

                link.href = uri;
                link.download = name + '.png';

                // 2: Mount and trigger click link
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(e => console.error(e))
            .finally(() => setDownloading(false));
    };

    return <ModalV2 isVisible={open} onBackdropCb={onClose} className='w-[36.75rem]'>
        <p className='text-[22px] leading-6 font-semibold mb-6'>{t('reference:referral.share.title')}</p>
        <div
            ref={ref}
            className='h-[380px] w-[524px] rounded-xl p-6 py-4 relative overflow-hidden'
        >
            <img className='absolute inset-0' src={getS3Url('/images/reference/bg_share_ref_code.png')} alt='' />
            <div className='absolute inset-x-4'>
                <img width={99} src={getS3Url('/images/logo/nami-logo-v2.png')} alt='Nami exchange' />
                <div className='mt-12'>
                    <p className='text-2xl text-teal font-bold mb-4'>{t('reference:referral.share.title_2')}</p>
                    <p className='leading-4'>
                        <span className='font-semibold' dangerouslySetInnerHTML={{
                            __html: t('reference:referral.share.content')
                        }} />
                        <span className='font-bold text-3xl text-teal'> 40%</span>
                    </p>
                </div>
            </div>
            <div
                className='absolute bottom-0 inset-x-0 h-[6.25rem] rounded-b-xl flex items-center justify-between px-6 py-4'
                style={{
                    backgroundImage: `url(${getS3Url('/images/reference/bg_share_ref_code_2.png')})`,
                    backgroundSize: 'cover'
                }}
            >
                <div className='flex-1'>
                    <div
                        className='text-txtSecondary whitespace-nowrap'>{t('reference:referral.share.scan_and_join')}</div>
                    <p className='text-lg font-semibold'>{t('reference:referral.share.id_referral')}: {code}</p>
                </div>
                <div className='p-[.375rem] bg-white rounded'>
                    <QRCode
                        value={code}
                        size={68}
                    />
                </div>
            </div>
        </div>
        <ButtonV2 className='mt-6' loading={downloading} onClick={() => downloadImage(code)}>
            {t('reference:referral.share.download')}
        </ButtonV2>
    </ModalV2>;
};
