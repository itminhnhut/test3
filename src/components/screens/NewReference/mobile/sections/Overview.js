import classNames from 'classnames';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PopupModal, { renderRefInfo } from '../../PopupModal';
import RefCard from '../../RefCard';
import InviteModal from './InviteModal';
import { API_KYC_STATUS, API_PARTNER_REGISTER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import { ErrorIcon, SuccessIcon } from './Info/AddNewRef';
import {
    FacebookShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramShareButton,
    TwitterShareButton,
} from 'next-share';
import NeedLogin from 'components/common/NeedLogin';
import Modal from 'components/common/ReModal';
import { getS3Url } from 'redux/actions/utils';
import { getMe } from 'redux/actions/user';
import { useDispatch } from 'react-redux';

const Overview = ({
    data,
    commisionConfig,
    user
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const [showInvite, setShowInvite] = useState(false);
    const [showRegisterPartner, setShowRegisterPartner] = useState(false);
    const rank = data?.rank ?? 1;
    // const commisionRate = commisionConfig[rank]?.direct.futures
    const friendsGet = data?.defaultRefCode?.remunerationRate;
    const youGet = 100 - friendsGet;
    const [kyc, setKyc] = useState(null);
    const [isPartner, setIsPartner] = useState(true);

    useEffect(() => {
        fetchAPI({
            url: API_KYC_STATUS,
            options: {
                method: 'GET',
            },
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
                method: 'GET',
            },

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

    const handleCompactLink = (address, first, last) => {
        return address ? `${address.substring(0, first)}...${address.substring(address.length - last)}` : '';
    };
    const policyLink = language === 'vi' ? 'https://nami.exchange/vi/support/announcement/thong-bao/ra-mat-chuong-trinh-doi-tac-phat-trien-cong-dong-nami' : 'https://nami.exchange/en/support/announcement/nami-news/official-launching-of-nami-community-development-partnership-program';

    return (
        <div className="px-4 py-[60px]" style={{
            backgroundImage: `url('${getS3Url('/images/reference/background_mobile.png')}')`,
            backgroundSize: 'cover'
        }}>
            {showInvite ?
                <InviteModal isShow={showInvite} onClose={() => setShowInvite(false)} code={data?.defaultRefCode?.code}
                             isMobile/> : null}
            {showRegisterPartner ? <RegisterPartnerModal setIsPartner={setIsPartner} t={t} kyc={kyc} user={user}
                                                         isShow={showRegisterPartner}
                                                         onClose={() => setShowRegisterPartner(false)}/> : null}
            <div className={classNames('font-semibold text-3xl text-gray-6', { '!text-2xl': width < 400 })}>
                {t('reference:referral.introduce1')} <br/>
                {t('reference:referral.introduce2')}
            </div>
            <div className="font-normal text-base text-gray-6 mt-6">
                {t('reference:referral.introduce3')}
            </div>
            {/* <div className='font-semibold text-sm leading-6 text-gray-6 mt-3'>
                {t('reference:referral.readmore')} <a href={policyLink} target='_blank' ><span className='text-namiapp-green-1 underline'>{t('reference:referral.referral_policy')}</span></a>
            </div> */}

            <div className="mt-[38px] flex gap-3 w-full">
                {(isPartner || !user) ? null :
                    <RefButton className="w-3/5" onClick={() => setShowRegisterPartner(true)}>
                        <div className="flex gap-2 items-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#jf4gphlj7a)">
                                    <path
                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 6.34c1.07 0 1.93.86 1.93 1.93 0 1.07-.86 1.93-1.93 1.93-1.07 0-1.93-.86-1.93-1.93-.01-1.07.86-1.93 1.93-1.93zm-6-1.58c1.3 0 2.36 1.06 2.36 2.36 0 1.3-1.06 2.36-2.36 2.36-1.3 0-2.36-1.06-2.36-2.36 0-1.31 1.05-2.36 2.36-2.36zm0 9.13v3.75c-2.4-.75-4.3-2.6-5.14-4.96 1.05-1.12 3.67-1.69 5.14-1.69.53 0 1.2.08 1.9.22-1.64.87-1.9 2.02-1.9 2.68zM12 20c-.27 0-.53-.01-.79-.04v-4.07c0-1.42 2.94-2.13 4.4-2.13 1.07 0 2.92.39 3.84 1.15C18.28 17.88 15.39 20 12 20z"
                                        fill="#47CC85"/>
                                </g>
                                <defs>
                                    <clipPath id="jf4gphlj7a">
                                        <path fill="#fff" d="M0 0h24v24H0z"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            {t('reference:referral.partner.button')}
                        </div>
                    </RefButton>}
                <RefButton className={classNames('w-2/5', { '!w-full': isPartner || !user })}>
                    <div className="flex gap-2">
                        <a href={policyLink} target="_blank"><span>{t('reference:referral.referral_policy')}</span></a>
                    </div>
                </RefButton>
            </div>
            {user ? <div className="mt-[30px]">
                <RefCard>
                    <div className="pb-2 text-namiapp-gray">
                        <div className="flex w-full justify-between text-xs font-medium">
                            <div> {t('reference:referral.referral_code')}</div>
                            <div>{t('reference:referral.rate', {
                                value1: youGet,
                                value2: friendsGet
                            })}</div>
                        </div>
                        <div className="mt-1">
                            {renderRefInfo(data?.defaultRefCode?.code, null, 16)}
                        </div>
                        <div className="flex w-full justify-between text-xs font-medium mt-4">
                            <div>{t('reference:referral.ref_link')}</div>
                            <div>{t('reference:referral.rate', {
                                value1: youGet,
                                value2: friendsGet
                            })}</div>
                        </div>
                        <div className="mt-1">
                            {renderRefInfo(data?.defaultRefCode?.code ? handleCompactLink('https://nami.exchange/referral?ref=' + data?.defaultRefCode?.code, width < 320 ? 10 : 15, 12) : '---', null, 16, 'https://nami.exchange/referral?ref=' + data?.defaultRefCode?.code)}
                        </div>
                        <div className="mt-6">
                            {renderSocials(undefined, undefined, 'https://nami.exchange/referral?ref=' + data?.defaultRefCode?.code)}
                        </div>
                    </div>
                </RefCard>
                <div
                    className="w-full mt-8 h-11 bg-namiapp-green-1 flex items-center justify-center text-sm font-medium text-white rounded-md"
                    onClick={() => setShowInvite(true)}
                >
                    {t('reference:referral.invite_friends')}
                </div>
            </div> : <NeedLogin message={t('reference:user.login_to_view')} isNamiapp addClass="mt-8"/>}
        </div>
    );
};

export default Overview;

export const renderSocials = (size = 32, className = '', url) => {
    const icons = [{

        svg:
            <FacebookShareButton
                url={url}
                hashtag={'#namiexchange #namifoundation #namipartner'}
            >
                <svg width={size} height={size} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M30.823 15.828c0 8.006-6.49 14.495-14.495 14.495-8.005 0-14.495-6.49-14.495-14.495 0-8.005 6.49-14.495 14.495-14.495 8.006 0 14.495 6.49 14.495 14.495z"
                        fill="url(#19bujivjka)"/>
                    <path
                        d="M30.823 15.828c0 8.006-6.49 14.495-14.495 14.495-8.005 0-14.495-6.49-14.495-14.495 0-8.005 6.49-14.495 14.495-14.495 8.006 0 14.495 6.49 14.495 14.495z"
                        fill="url(#zbznv6hl9b)"/>
                    <path
                        d="M14.01 20.177v9.856c0 .16.129.29.289.29h4.059c.16 0 .29-.13.29-.29v-9.856c0-.16.13-.29.29-.29h2.898c.16 0 .29-.13.29-.29v-3.479a.29.29 0 0 0-.29-.29h-2.899a.29.29 0 0 1-.29-.29V12.93c0-1.16 1.45-1.739 2.03-1.739h1.74c.16 0 .289-.13.289-.29V7.421a.29.29 0 0 0-.29-.29h-3.768c-2.784 0-4.639 2.9-4.639 4.639v3.769c0 .16-.13.29-.29.29H10.82a.29.29 0 0 0-.29.29v3.478c0 .16.13.29.29.29h2.9c.16 0 .29.13.29.29z"
                        fill="#fff"/>
                    <defs>
                        <linearGradient id="19bujivjka" x1="16.328" y1="1.333" x2="16.328" y2="30.323"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#18ACFE"/>
                            <stop offset="1" stopColor="#0165E1"/>
                        </linearGradient>
                        <linearGradient id="zbznv6hl9b" x1="16.328" y1="1.333" x2="16.328" y2="30.323"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="#18ACFE"/>
                            <stop offset="1" stopColor="#0165E1"/>
                        </linearGradient>
                    </defs>
                </svg>
            </FacebookShareButton>
        ,
        href: '',
        name: 'facebook'
    }, {
        svg: <RedditShareButton
            url={url}
        >
            <RedditIcon size={size} round/>
        </RedditShareButton>,
        href: '',
        name: 'reddit'
    }, {
        svg: <TwitterShareButton url={url}>
            <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="16" fill="#1D9BF0"/>
                <path
                    d="M13.072 24.44c7.096 0 10.976-5.88 10.976-10.976 0-.168 0-.336-.008-.496a7.903 7.903 0 0 0 1.928-2 7.83 7.83 0 0 1-2.216.608 3.855 3.855 0 0 0 1.696-2.136c-.744.44-1.568.76-2.448.936a3.839 3.839 0 0 0-2.816-1.216 3.858 3.858 0 0 0-3.856 3.856c0 .304.032.6.104.88A10.943 10.943 0 0 1 8.48 9.864a3.87 3.87 0 0 0-.52 1.936c0 1.336.68 2.52 1.72 3.208a3.79 3.79 0 0 1-1.744-.48v.048a3.862 3.862 0 0 0 3.096 3.784 3.846 3.846 0 0 1-1.744.064 3.852 3.852 0 0 0 3.6 2.68 7.754 7.754 0 0 1-5.712 1.592 10.748 10.748 0 0 0 5.896 1.744z"
                    fill="#fff"/>
            </svg>
        </TwitterShareButton>,
        href: '',
        name: 'twitter'
    }, {
        svg: <TelegramShareButton url={url}>
            <svg width={size} height={size} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#eyolc5yyoa)">
                    <path d="M16.5 32c8.837 0 16-7.163 16-16s-7.163-16-16-16S.5 7.163.5 16s7.163 16 16 16z"
                          fill="url(#h9i9wa6jeb)"/>
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M7.743 15.831c4.664-2.032 7.774-3.372 9.33-4.02 4.444-1.847 5.367-2.168 5.969-2.179.132-.002.428.03.62.186a.674.674 0 0 1 .228.433c.02.125.047.409.026.63-.24 2.53-1.282 8.67-1.812 11.503-.225 1.2-.666 1.601-1.094 1.64-.929.086-1.635-.613-2.535-1.203-1.408-.923-2.203-1.498-3.57-2.399-1.58-1.04-.556-1.613.344-2.548.236-.244 4.33-3.968 4.41-4.306.009-.042.018-.2-.075-.283-.094-.083-.232-.055-.332-.032-.14.032-2.39 1.519-6.748 4.46-.639.44-1.217.653-1.736.642-.57-.013-1.67-.323-2.487-.589-1.002-.326-1.798-.498-1.729-1.05.036-.289.433-.584 1.19-.885z"
                          fill="#fff"/>
                </g>
                <defs>
                    <linearGradient id="h9i9wa6jeb" x1="16.5" y1="0" x2="16.5" y2="31.763"
                                    gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2CA4E0"/>
                        <stop offset="1" stopColor="#0D83BF"/>
                    </linearGradient>
                    <clipPath id="eyolc5yyoa">
                        <path fill="#fff" transform="translate(.5)" d="M0 0h32v32H0z"/>
                    </clipPath>
                </defs>
            </svg>
        </TelegramShareButton>,
        href: '',
        name: 'telegram'
    },];

    return (
        <div className="w-full flex justify-between">
            {icons.map((icon, index) => {
                return (
                    <div className={classNames('h-12 w-12 p-2 rounded-md bg-[#f5f6f7] cursor-pointer', className)}
                         key={index}>
                        {icon.svg}
                    </div>
                );
            })}
        </div>
    );
};

const RefButton = ({
    children,
    onClick,
    className
}) => {
    return (
        <div
            className={classNames('border-[1px] border-namiapp-green h-11 bg-transparent text-gray-6 font-semibold text-sm flex items-center justify-center cursor-pointer rounded-md', className)}
            onClick={onClick}>
            {children}
        </div>
    );
};

const ConfirmButtom = ({
    text,
    onClick,
    isDisable = true,
    className,
    isDesktop = false
}) => {
    return (
        <div
            className={classNames('w-full h-11 rounded-md flex justify-center items-center font-semibold text-sm leading-[18px] bg-namiapp-green-1 text-white', className, {
                '!bg-namiapp-black-2 !text-namiapp-gray-1': isDisable && !isDesktop,
                '!bg-teal !text-white': isDesktop && !isDisable,
                '!bg-gray-2': isDesktop && isDisable
            })}
            onClick={!isDisable ? onClick : undefined}
        >
            {text}
        </div>
    );
};

export const RegisterPartnerModal = ({
    isShow,
    onClose,
    user,
    kyc,
    t,
    setIsPartner,
    isDesktop = false
}) => {
    const isKyc = user?.kyc_status === 2;
    const defaultData = isKyc ? {
        fullName: kyc?.kycInformationData?.metadata?.identityName,
        nationalId: kyc?.kycInformationData?.metadata?.identityNumber,
        email: user?.email,
        phoneNumber: '',
        socialMedia: '',
    } : {
        fullName: '',
        nationalId: '',
        email: '',
        phoneNumber: '',
        socialMedia: ''
    };

    const [state, set] = useState(defaultData);

    const [isError, setIsError] = useState(true);

    const [result, setResult] = useState({
        isShow: false,
        success: true,
        message: ''
    });

    const setState = (state) => set(prevState => ({ ...prevState, ...state }));

    useEffect(() => {
        setState({
            fullName: kyc?.kycInformationData?.metadata?.identityName,
            nationalId: kyc?.kycInformationData?.metadata?.identityNumber,
        });
    }, [kyc]);

    const validator = (type, text) => {
        switch (type) {
            case 'phoneNumber':
                if (text.length === 0) return t('reference:referral.partner.phone_empty');
                if (text.length < 6) return t('reference:referral.partner.phone_error');
                break;
            case 'socialMedia':
                if (text.length === 0) return t('reference:referral.partner.social_empty');
                break;
            default:
                break;
        }
        return '';
    };

    useEffect(() => {
        setIsError(Object.entries(state)
            .some((e) => {
                const check = validator(e[0], e[1]);
                return check.length > 0;
            }));
    }, [state]);
    const dispatch = useDispatch()

    const handleSubmitRegister = (state) => {
        fetchAPI({
            url: API_PARTNER_REGISTER,
            options: {
                method: 'POST',
            },
            params: {
                phone: state.phoneNumber,
                social_link: state.socialMedia,
                email: state.email,
                name: state.fullName,
                identify: state.nationalId
            }
        })
            .then(({
                status,
                data
            }) => {
                if (status === ApiStatus.SUCCESS) {
                    setResult({
                        isShow: true,
                        success: true,
                        message: t('reference:referral.partner.success')
                    });
                    setIsPartner(true);
                    dispatch(getMe())
                } else {
                    setResult({
                        isShow: true,
                        success: false,
                        message: t('reference:referral.partner.failed')
                    });
                }
            });
    };

    const ResultModal = useMemo(() => {
        const Icon = result.success ? <SuccessIcon color={isDesktop ? '#00c8bc' : undefined}/> : <ErrorIcon/>;
        const title = result.success ? t('reference:referral.success') : t('reference:referral.error');

        return isDesktop ?
            <Modal
                center
                isVisible
                containerClassName="!px-6 !py-8 top-[50%] max-w-[350px]"
            >
                <div className="w-full flex justify-center items-center flex-col text-center">
                    {Icon}
                    <div className="text-sm font-medium mt-6">
                        <div dangerouslySetInnerHTML={{ __html: result.message }}/>
                    </div>
                    <div
                        className="w-full h-11 flex justify-center items-center bg-teal text-white font-semibold text-sm rounded-md mt-6"
                        onClick={() => {
                            setResult({
                                ...result,
                                isShow: false
                            });
                            if (result.success) onClose();
                        }}
                    >
                        {t('common:confirm')}
                    </div>
                </div>
            </Modal>
            : (
                <PopupModal
                    isVisible={result.isShow}
                    onBackdropCb={() => setResult({
                        ...result,
                        isShow: false
                    })}
                    // useAboveAll
                    isMobile
                    bgClassName="!z-[400]"
                    containerClassName="!z-[401]"
                >
                    <div className="w-full flex justify-center items-center flex-col text-center px-2">
                        <div className="mt-6">{Icon}</div>
                        <div className="text-gray-6 text-[20px] leading-8 font-semibold mt-6">
                            {title}
                        </div>
                        <div className="text-sm font-medium mt-3 text-gray-7">
                            <div dangerouslySetInnerHTML={{ __html: result.message }}/>
                        </div>
                        <div
                            className="w-full h-11 flex justify-center items-center bg-namiapp-green-1 text-white font-semibold text-sm rounded-md mt-8"
                            onClick={() => {
                                setResult({
                                    ...result,
                                    isShow: false
                                });
                                if (result.success) onClose();
                            }}
                        >
                            {t('common:confirm')}
                        </div>
                    </div>
                </PopupModal>
            );
    }, [result]);

    if (isDesktop && !isKyc) {
        return (
            <Modal
                center
                isVisible
                containerClassName="!px-6 !py-8 top-[50%] max-w-[350px]"
            >
                <div className="w-full flex justify-center items-center flex-col text-center">
                    <div className="mt-6"><ErrorIcon/></div>
                    <div className="text-darkBlue text-[20px] leading-8 font-semibold mt-6">
                        {t('reference:referral.partner.no_kyc')}
                    </div>
                    <div
                        className="w-full h-11 flex justify-center items-center bg-teal text-white font-semibold text-sm rounded-md mt-8"
                        onClick={onClose}
                    >
                        {t('common:confirm')}
                    </div>
                </div>
            </Modal>
        );
    }

    return <>
        {result.isShow ? ResultModal : null}
        <PopupModal
            isVisible={isShow}
            onBackdropCb={onClose}
            useAboveAll
            isMobile={!isDesktop}
            isDesktop={isDesktop}
            useCenter={isDesktop}
            contentClassname={isDesktop ? '!rounded !w-[390px] !px-0 !py-6' : undefined}
            title={isDesktop ? t('reference:referral.partner.title') : undefined}
        >
            {isKyc ?
                <div className={classNames('font-normal text-xs leading-4 text-gray-7 flex flex-col gap-4 -mt-3', {
                    'px-3': isDesktop
                })}>
                    {isDesktop ? <div className=""></div> : <div
                        className="text-gray-6 font-semibold text-[20px] leading-8 mb-4">{t('reference:referral.partner.title')}</div>}
                    <RefInput type="fullName" text={state.fullName} setText={(text) => setState({ fullName: text })}
                              placeholder="Nhập tên đầy đủ" label={t('reference:referral.partner.fullname')}
                              validator={validator} disabled isDesktop={isDesktop}/>
                    <RefInput type="nationalId" text={state.nationalId}
                              setText={(text) => setState({ nationalId: text })}
                              placeholder="Số chứng minh thư/passport" label={t('reference:referral.partner.id')}
                              validator={validator} disabled isDesktop={isDesktop}/>
                    <RefInput type="email" text={state.email} setText={(text) => setState({ email: text })}
                              placeholder="Nhập email" label="Email" validator={validator} disabled
                              isDesktop={isDesktop}/>
                    <RefInput type="phoneNumber" text={state.phoneNumber}
                              setText={(text) => setState({ phoneNumber: text })}
                              placeholder={t('reference:referral.partner.phone_placeholder')}
                              label={t('reference:referral.partner.phone')} validator={validator} isStringNumber isFocus
                              isDesktop={isDesktop}/>
                    <div className="flex gap-3">
                        <RefInput type="socialMedia" text={state.socialMedia}
                                  setText={(text) => setState({ socialMedia: text })}
                                  placeholder={t('reference:referral.partner.social_placeholder')}
                                  label={t('reference:referral.partner.social')} validator={validator}
                                  isDesktop={isDesktop}/>
                        {isDesktop ?
                            <div
                                className={classNames('mt-6 w-auto h-11 rounded-md px-6 flex justify-between items-center text-darkBlue bg-gray-4 font-medium text-sm cursor-pointer')}
                                onClick={async () => {
                                    const text = await navigator.clipboard.readText();
                                    console.log(text);
                                    setState({ socialMedia: text });
                                }}
                            >
                                {t('reference:referral.partner.paste')}
                            </div>
                            : null}
                    </div>

                    <div className="mt-4">
                        <ConfirmButtom className={''} text={t('reference:referral.partner.register')}
                                       onClick={!isError ? () => handleSubmitRegister(state) : undefined}
                                       isDisable={isError} isDesktop={isDesktop}/>
                    </div>
                </div>
                :
                <div className="w-full flex justify-center items-center flex-col text-center px-2 -mt-3">
                    <div className="mt-6"><ErrorIcon/></div>
                    <div className="text-gray-6 text-[20px] leading-8 font-semibold mt-6">
                        {t('reference:referral.partner.no_kyc')}
                    </div>
                    <div
                        className="w-full h-11 flex justify-center items-center bg-namiapp-green-1 text-white font-semibold text-sm rounded-md mt-8"
                        onClick={onClose}
                    >
                        {t('common:confirm')}
                    </div>
                </div>
            }
        </PopupModal>
    </>;
};

const RefInput = ({
    text,
    setText,
    placeholder,
    label,
    validator,
    type,
    disabled = false,
    isStringNumber = false,
    isFocus = false,
    isDesktop = false
}) => {
    const [error, setError] = useState('');
    const ref = useRef(null);

    const handleInput = (value) => {
        if (isStringNumber && (isNaN(Number(value)) || value.length > 20)) return;
        setText(value);
        setError('');
    };

    useEffect(() => {
        isFocus && ref.current.focus();
    }, []);

    useEffect(() => {
        if (!text || !text.length) return setError('');
        if (validator) setError(validator(type, text));
    }, [text]);

    return (
        <div className="w-full">
            <div>
                {label}
            </div>
            <div
                className={classNames('mt-2 w-full h-11 rounded-md bg-namiapp-black-2 border-[#f93636] px-3 flex justify-between items-center', {
                    'border-[1px]': error.length,
                    '!text-gray-1 !bg-gray-4 !font-medium !text-sm': isDesktop
                })}>
                <input ref={ref} value={text}
                       className={classNames('text-gray-6 font-normal text-sm leading-[18px] h-full w-full', {
                           '!text-darkBlue disabled:!text-gray-1': isDesktop
                       })} placeholder={placeholder} onChange={e => handleInput(e.target.value)} disabled={disabled}
                       onBlur={validator ? () => setError(validator(type, text)) : undefined}/>
                {!disabled && text.length ?
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                         onClick={() => {
                             handleInput('');
                             ref.current.focus();
                         }}
                    >
                        <path d="m6 6 12 12M6 18 18 6" stroke="#718096" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg> : null}

            </div>
            {error.length ? <div className="flex gap-1 font-normal text-xs leading-4 mt-2 text-[#f93636]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.335 6.667h1.333V10H7.335V6.667zm-.001 4h1.333V12H7.334v-1.333z" fill="#F93636"/>
                    <path
                        d="M9.18 2.8A1.332 1.332 0 0 0 8 2.092c-.494 0-.946.271-1.178.709L1.93 12.043c-.22.417-.207.907.036 1.312.243.404.67.645 1.142.645h9.785c.472 0 .9-.241 1.143-.645s.257-.895.036-1.312L9.179 2.8zm-6.072 9.867L8 3.425l4.896 9.242h-9.79z"
                        fill="#F93636"/>
                </svg>
                <div className="">
                    {error}
                </div>
            </div> : null}
        </div>
    );
};
