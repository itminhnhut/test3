import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import Copy from 'components/svg/Copy';
import SwitchV2 from 'components/common/V2/SwitchV2';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import HelpCircle from 'components/svg/HelpCircle';
import Button from 'components/common/V2/ButtonV2/Button';
import Link from 'next/link';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { Check } from 'react-feather';
import colors from 'styles/colors';
import AccountLayout from 'components/screens/Account/AccountLayout';
import { useTranslation } from 'next-i18next';
<<<<<<< HEAD
=======
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { API_GET_VIP, API_SET_ASSET_AS_FEE, USER_DEVICES, USER_REVOKE_DEVICE } from 'redux/actions/apis';
import { BREAK_POINTS, EMPTY_VALUE, FEE_TABLE, ROOT_TOKEN, USER_DEVICE_STATUS } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChevronRight, Edit, MoreVertical, X } from 'react-feather';
import { Menu, useContextMenu } from 'react-contexify';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import { ApiStatus } from 'redux/actions/const';
import { isMobile } from 'react-device-detect';
>>>>>>> e2d04950 (Profile - Add Ref Modal)
import { PATHS } from 'constants/paths';
import { FEE_TABLE, ROOT_TOKEN } from 'constants/constants';
import axios from 'axios';
import {
    API_CHECK_REFERRAL,
    API_GET_VIP,
    API_NEW_REFERRAL_CREATE_INVITE,
    API_SET_ASSET_AS_FEE
} from 'redux/actions/apis';
import { ApiStatus, KYC_STATUS } from 'redux/actions/const';
import debounce from 'lodash/debounce';
import Axios from 'axios';
import Activity from 'components/screens/Account/Activity';
import Announcement from 'components/screens/Account/Announcement';
import Edit from 'components/svg/Edit';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import InputV2 from 'components/common/V2/InputV2';
import fetchApi from 'utils/fetch-api';
import toast from 'utils/toast';
import { useDispatch } from 'react-redux';
import { getMe } from 'redux/actions/user';
import Spinner from 'components/svg/Spinner';
import TagV2 from 'components/common/V2/TagV2';

const TextCopyable = ({
    text = '',
    className = ''
}) => {
    const [copied, setCopied] = useState(false);
    const onCopy = () => {
        setCopied(true);
    };

    useEffect(() => {
        let timer;
        if (copied) {
            timer = setTimeout(() => setCopied(false), 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [copied]);

    return (<span className={className + ' flex items-center'}>
      <span className={'mr-1'}>{text}</span>
      <CopyToClipboard text={text} onCopy={onCopy} className='cursor-pointer inline-block'>
        {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
      </CopyToClipboard>
    </span>);
};

<<<<<<< HEAD
const SwitchUseNamiFee = ({
    t
}) => {
    const [checked, setChecked] = useState(false);

    const getAssetFee = () => {
        axios.get(API_SET_ASSET_AS_FEE)
            .then(({ data: res }) => {
                if (res.status === ApiStatus.SUCCESS && !!res.data) {
                    const check = res.data?.feeCurrency === 1;
                    if (check !== checked) setChecked(check);
                }
            })
            .catch(err => {
                console.log('[Error] Get asset as fee', err);
            });
    };
=======
import 'react-contexify/dist/ReactContexify.css';
import RefModal from 'components/screens/Account/RefModal'
>>>>>>> e2d04950 (Profile - Add Ref Modal)

    const setAssetFee = useCallback(debounce((currency) => {
        axios.post(API_SET_ASSET_AS_FEE, { currency })
            .catch(err => {
                console.log('[Error] Set asset as fee', err);
            });
    }, 300), []);

    useEffect(() => {
        getAssetFee();
    }, []);

    useEffect(() => {
        setAssetFee(checked ? 1 : 0);
    }, [checked]);

    return <div className='flex items-center'>
        <SwitchV2
            onChange={() => {
                setChecked(!checked);
            }}
            checked={checked}
        />
        <div className='text-txtSecondary ml-3'>
            <span>{t('profile:use_nami_to_reduce_fees')}</span>
            <span className='text-teal ml-1'>({t('profile:25p_discount')})</span>
        </div>
    </div>;
};

const ModalChangeReferee = ({
    t,
    open,
    onClose
}) => {
    const [refCode, setRefCode] = useState('');
    const [referrer, setReferrer] = useState(null);
    const [checking, setChecking] = useState(false);
    const dispatch = useDispatch();

    const checkRef = useCallback(debounce((code) => {
        setChecking(true);
        fetchApi({
            url: API_CHECK_REFERRAL,
            params: { code }
        })
            .then((res) => {
                setReferrer(res.data);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setChecking(false);
            });
    }, 300), []);

    const setInvite = () => {
        fetchApi({
            url: API_NEW_REFERRAL_CREATE_INVITE,
            options: {
                method: 'POST'
            },
            params: { code: refCode }
        })
            .then(async (res) => {
                if (res.status === ApiStatus.SUCCESS) {
                    await dispatch(getMe());
                    const referrer = res.data.referrer || {};
                    const referralName = referrer.name || referrer.username || referrer.code || '--';

                    toast({
                        text: t('profile:add_ref_code_success', { referralName }),
                        type: 'success'
                    });
                } else {
                    toast({
                        text: t(`profile:error:${res.status}`),
                        type: 'warning'
                    });
                }
            })
            .catch(err => {
                toast({
                    text: t('profile:error:failed'),
                    type: 'warning'
                });
            })
            .finally(() => {
                setRefCode('');
                onClose();
            });
    };

<<<<<<< HEAD
    const handleRefCodeChange = (code = '') => {
        code = code.trim().toUpperCase();
        setRefCode(code);
        if (code) checkRef(code);
    };
=======
const AccountProfile = () => {
    const [state, set] = useState(INITIAL_STATE);
    const setState = state => set(prevState => ({ ...prevState, ...state }));
    const isApp = useApp();

    const firstInputRef = useRef();

    // Rdx
    const user = useSelector(state => state.auth?.user);

    // Use Hooks
    const router = useRouter();
    const { show } = useContextMenu({ id: MENU_CONTEXT });
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [currentTheme,] = useDarkMode();
    const { width } = useWindowSize();
    const [showRefModal, setShowRefModal] = useState(false);

    const customAvatarTips = useMemo(() => {
        let text;
        if (language === LANGUAGE_TAG.VI) {
            text = <>
                Kéo thả hình ảnh vào đây hoặc <span
                className="text-dominant">{isMobile ? 'chạm' : 'click'} để duyệt</span>
            </>;
        } else {
            text = <>
                Drag your image here, or <span className="text-dominant">{isMobile ? 'touch' : 'click'} to browse</span>
            </>;
        }
>>>>>>> e2d04950 (Profile - Add Ref Modal)

    const suffixInput = useMemo(() => {
        if (checking) return <Spinner size={20}/>
        if (!referrer) return <span className='text-txtSecondary'>{referrer?.username}</span>
        return null
    }, [referrer, checking])

    return <ModalV2 isVisible={open} onBackdropCb={onClose} className='w-[30rem]'>
        <p className='text-xl font-medium py-6'>{t('profile:referrer')}</p>
        <InputV2
            value={refCode}
            onChange={handleRefCodeChange}
            label={t('profile:ref_code_optional')}
            placeholder={t('profile:enter_ref_code')}
            canPaste={!referrer && !checking}
            suffix={suffixInput}
            error={(!referrer && !!refCode) ? t('profile:error.REFERRAL_CODE_NOT_FOUND') : null}
        />
        <ButtonV2
            onClick={setInvite}
            disabled={!refCode || !referrer}
            className='mt-4'>{t('common:confirm')
        }</ButtonV2>
    </ModalV2>;
};

const Profile = () => {
    const [state, set] = useState({
        loadingLevel: false,
        showSetReferrerModal: false,
        level: 0,
        namiBalance: 0
    });

    const user = useSelector((state) => state.auth?.user);
    const { t } = useTranslation();

    const setState = obj => set(prevState => ({ ...prevState, ...obj }));

    const getLevel = async () => {
        setState({ loadingLevel: true });
        try {
            const { data } = await Axios.get(API_GET_VIP);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({
                    level: data?.data?.level,
                    namiBalance: data?.data?.metadata?.namiBalance
                });
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`);
        } finally {
            setState({ loadingLevel: false });
        }
    };

    useEffect(() => {
        getLevel();
    }, []);

    const nextLevel = FEE_TABLE.find(e => e?.level === state.level + 1);
    const currentPercent = state.namiBalance ? state.namiBalance * 100 / nextLevel?.nami_holding : '--';

    return (<AccountLayout>
        <ModalChangeReferee
            t={t}
            open={state.showSetReferrerModal}
            onClose={() => setState({ showSetReferrerModal: false })}
        />
        <div className='p-6 rounded-xl bg-darkBlue-3 mt-12'>
            <div className='flex'>
                <div className='flex-1 space-y-4'>
                    <div>
                        <span className='text-txtSecondary'>{t('profile:name')}</span>
                        <span className='font-bold text-right float-right'>{user?.name}</span>
                    </div>

                    <div>
                        <span className='text-txtSecondary'>{t('profile:username')}</span>
                        <span className='font-bold text-right float-right'>{user?.username}</span>
                    </div>

                    <div>
                        <span className='text-txtSecondary'>Nami ID</span>
                        <TextCopyable className='font-bold text-right float-right' text={user?.code} />
                    </div>

                    <div>
                        <span className='text-txtSecondary'>Email</span>
                        <span className='font-bold text-right float-right'>{user?.email}</span>
                    </div>

                    <div>
                        <span className='text-txtSecondary'>Người giới thiệu</span>
                        <div
                            className='flex items-end float-right cursor-pointer'
                            onClick={() => setState({ showSetReferrerModal: true })}
                        >
                            {
                                !user?.referal_id ?
                                    <>
                                        <div className='w-[10px] h-[1px] bg-white mr-[10px]' />
                                        <Edit className='' size={16} />
                                    </>
                                    : <span className='font-semibold'>{user?.referral_username}</span>
                            }

<<<<<<< HEAD
                        </div>
                    </div>
                </div>
                <div className='w-[1px] bg-divider-dark mx-10' />
                <div className='flex-1 flex flex-col justify-between'>
                    <div className='space-y-3'>
=======
    // const onEdit = () => {
    //     setState({ isEditable: true })
    //     firstInputRef.current?.focus()
    // }
    //
    // const onSave = (payload) => {
    //     setState({ savingInfo: true })
    //     setState({ user: { ...state.user, ...payload } })
    //     setTimeout(() => {
    //         setState({ savingInfo: false, isEditable: false })
    //     }, 1500)
    // }

    // Render Handler
    const renderUserPersona = useCallback(() => {
        if (!user) return null;

        return (
            <div className="flex flex-col items-center w-full lg:w-2/5 xl:w-[15%]">
                <div className="relative w-[132px] h-[132px] rounded-full bg-gray-4 dark:bg-darkBlue-5 cursor-pointer"
                     onClick={openAvatarModal}>
                    <img src={user?.avatar} alt="Nami.Exchange"
                         className="relative z-10 w-full h-full rounded-full"/>
                    <div className="absolute w-auto h-auto z-20 right-2 bottom-2 p-1.5 rounded-full bg-dominant">
                        <Edit className="text-white" size={12} strokeWidth={1.75}/>
                    </div>
                </div>
                <div className="mt-5 mb-2.5 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    Social Binding
                </div>
                <div className="flex items-center">
                    <div className="mr-2.5 cursor-pointer hover:opacity-90">
                        <SvgApple/>
                    </div>
                    <div className="mr-2.5 cursor-pointer hover:opacity-90">
                        <SvgGooglePlus/>
                    </div>
                    <div className="mr-2.5 cursor-pointer hover:opacity-90">
                        <SvgFacebook/>
                    </div>
                    <div className="cursor-pointer hover:opacity-90">
                        <SvgTwitter/>
                    </div>
                </div>
            </div>
        );
    }, [user]);

    const renderUserInfo = useCallback(() => {
        const inputClass = `font-medium text-txtPrimary dark:text-txtPrimary-dark 
                             text-right pr-3 rounded-md xl:ml-8
                             ${state.isEditable ? 'py-1 bg-gray-4 dark:bg-darkBlue-4' : ''} 
                             ${state.savingInfo ? 'opacity-30 pointer-event-none' : ''}`;

        const { name, username, phone } = state.user;

        return (
            <>
                {showRefModal && <RefModal onClose={() => setShowRefModal(false)} />}
                <div style={width >= BREAK_POINTS.xl ? { width: `calc(80% / 3)` } : undefined} className="w-full lg:w-3/5 mt-6 lg:mt-0 space-y-2">
                    <div className="flex items-center justify-between xl:justify-start text-sm">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">{t('profile:username')}</span>
                        <input
                            className={inputClass}
                            value={username}
                            ref={firstInputRef}
                            onChange={(e) =>
                                setState({
                                    user: {
                                        ...state.user,
                                        username: e?.target?.value
                                    }
                                })
                            }
                            readOnly={!state.isEditable}
                        />
                    </div>
                    <div className="flex items-center justify-between xl:justify-start text-sm">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">{t('profile:name')}</span>
                        <input
                            className={inputClass}
                            value={name}
                            onChange={(e) =>
                                setState({
                                    user: {
                                        ...state.user,
                                        name: e?.target?.value
                                    }
                                })
                            }
                            readOnly={!state.isEditable}
                        />
                    </div>
                    <div className="flex items-center justify-between xl:justify-start text-sm">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Nami ID</span>
                        <input className={inputClass + (state.isEditable ? 'opacity-80 cursor-not-allowed' : '')} value={state.user?.namiId} readOnly={true} />
                    </div>
                    <div className="flex items-center justify-between xl:justify-start text-sm">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">Email</span>
                        <div className="flex items-center pr-3 xl:pr-0">
                            <input
                                className={
                                    state.isEditable
                                        ? 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right py-1 pr-2 xl:text-right xl:ml-4'
                                        : 'font-medium text-txtPrimary w-auto dark:text-txtPrimary-dark text-right pr-2 xl:text-right xl:ml-4'
                                }
                                value={state.user?.email}
                                readOnly={true}
                            />
                            <SvgCheckSuccess />
                        </div>
                    </div>
                    <div className="flex items-center justify-between xl:justify-start text-sm">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">{t('profile:phone_number')}</span>
                        <input
                            className={inputClass}
                            value={phone}
                            onChange={(e) =>
                                setState({
                                    user: {
                                        ...state.user,
                                        phone: e?.target?.value
                                    }
                                })
                            }
                            readOnly={!state.isEditable}
                        />
                    </div>
                    <div className="flex items-center justify-between xl:justify-start text-sm">
                        <span className="text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[120px]">
                            {t('reference:referral:referrer')}
                        </span>
                        <div className="flex items-center pr-3 xl:pr-0">
                            <input
                                value={state.user?.referral_username}
                                readOnly={true}
                                className={`text-right ${!user?.referal_id ? 'pr-2 xl:ml-4' : 'xl:ml-9'} xl:text-right`}
                            />
                            {!user?.referal_id && <EditIcon onClick={() => setShowRefModal(true)} className="cursor-pointer" />}
                        </div>
                    </div>
                </div>
            </>
        );
    }, [state.isEditable, state.savingInfo, state.user, width, showRefModal]);

    const renderFee = useCallback(() => {
        let seeFeeStructure,
            useNamiForBonus;
        const nextAssetFee = state.assetFee?.feeCurrency === 1 ? 0 : 1;

        if (language === LANGUAGE_TAG.VI) {
            seeFeeStructure = 'Xem biểu phí';
            useNamiForBonus = <>
                Dùng NAMI để được giảm phí <span className="ml-1 text-dominant font-medium whitespace-nowrap">(chiết khấu 25%)</span>
            </>;
        } else {
            seeFeeStructure = 'See fee structures';
            useNamiForBonus = <>
                Using NAMI to pay for fees <span className="ml-1 text-dominant font-medium whitespace-nowrap">(25% discount)</span>
            </>;
        }

        return (
            <div
                style={width >= BREAK_POINTS.xl ?
                    { width: `calc(80% / 3)` } : undefined}
                className="mt-12 xl:max-w-[300px] text-sm w-full mt-10 lg:w-1/2 lg:pr-5 xl:mt-0 xl:p-0">
                <div>
                    <div className="mb-2 flex items-center font-medium text-txtPrimary dark:text-txtPrimary-dark">
                        {t('fee-structure:your_fee_level')} <span className="ml-1 text-dominant">{state.loadingLevel ?
                        <Skeletor width={45}/> : <>VIP {state.level || '0'}</>}</span>
                    </div>
                    <div className="">
                        <div className="flex items-center justify-between xl:justify-start mt-4">
                            <span
                                className="font-medium text-txtSecondary dark:text-txtSecondary-dark xl:inline-block xl:min-w-[40px]">
                                Maker
                            </span>
>>>>>>> e2d04950 (Profile - Add Ref Modal)
                            <span
                                className='text-txtSecondary'>{t('fee-structure:your_fee_level')} VIP {state.level}</span>
                        <div>
                            <span className='text-txtSecondary mr-2'>Marker</span>
                            <span className='text-xl font-semibold'>0.075%</span>
                        </div>

                        <div>
                            <span className='text-txtSecondary mr-2'>Trader</span>
                            <span className='text-xl font-semibold'>0.075%</span>
                        </div>
                    </div>
                    <SwitchUseNamiFee t={t} />
                </div>
            </div>

            <div className='mt-6'>
                <div>
                    <span
                        className='text-txtSecondary'>{t('fee-structure:current_fee_level')}: VIP {state.level}</span>
                    <span className='text-right float-right text-teal font-medium'>
                        <Link href={PATHS.EXCHANGE.SWAP.getSwapPair({
                            fromAsset: 'VNDC',
                            toAsset: ROOT_TOKEN
                        })}>
                            <a className='text-dominant hover:!underline'>{t('common:buy')} NAMI</a>
                        </Link>
                    </span>
                </div>
                <div
                    className='my-4 relative w-full h-[4px] xl:h-[4px] rounded-xl bg-dark-2 overflow-hidden'>
                    <div
                        style={{ width: `${currentPercent}%` }}
                        className='absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in'
                    />
                </div>

                <div>
                    <span
                        className='text-teal text-sm'>VIP {state.level}: {formatNumber(state.namiBalance)} {ROOT_TOKEN} / {formatNumber(currentPercent)} %</span>
                    <span
                        className='text-right float-right text-teal text-sm'>VIP {state.level}: {formatNumber(nextLevel?.nami_holding, 0)} {ROOT_TOKEN}</span>
                </div>
            </div>
        </div>

        <div
            className={classnames('border border-divider-dark rounded-xl p-6 mt-12 hidden', {
                '!block': user?.kyc_status === KYC_STATUS.APPROVED
            })}
            style={{
                backgroundImage: `url(${getS3Url('/images/screen/account/bg-banner-2.png')})`,
                backgroundSize: 'cover'
            }}
        >
            <div>
                <p className='font-medium mb-2'>{t('profile:deposit_banner:title')}</p>
                <span className='text-txtSecondary'>{t('profile:deposit_banner:description')}</span>
            </div>
            <div className='grid grid-cols-2 gap-16 mt-9'>
                <div className='flex items-center justify-between'>
                    <Image width={58} height={58} src='/images/screen/profile/ic_transfer.png' />
                    <div className='ml-4 flex-1'>
                        <div className='flex items-center mb-2'>
                            <span>{t('profile:deposit_banner:transfer')}</span>
                            <div className='flex items-center ml-2 cursor-pointer hover:underline'>
                                <HelpCircle />
                                <span className='text-teal ml-2'>{t('profile:deposit_banner:instruction')}</span>
                            </div>
                        </div>
                        <span
                            className='text-txtSecondary'>{t('profile:deposit_banner:transfer_description')}</span>
                    </div>
                    <Button className='w-auto px-6'>{t('profile:deposit_banner:deposit')}</Button>
                </div>
                <div className='flex items-center justify-between'>
                    <Image width={58} height={58} src='/images/screen/profile/ic_swap.png' />
                    <div className='ml-4 flex-1'>
                        <div className='flex items-center mb-2'>
                            <span>{t('profile:deposit_banner:swap')}</span>
                            <div className='flex items-center ml-2 cursor-pointer hover:underline'>
                                <HelpCircle />
                                <span className='text-teal ml-2'>{t('profile:deposit_banner:instruction')}</span>
                            </div>
                        </div>
                        <span className='text-txtSecondary'>{t('profile:deposit_banner:swap_description')}</span>
                    </div>
                    <Button className='w-auto px-6'>{t('profile:deposit_banner:deposit')}</Button>
                </div>
            </div>
        </div>

<<<<<<< HEAD
        <div className='grid grid-cols-2 gap-8 mt-14'>
            <Activity t={t} />
            <Announcement />
        </div>
    </AccountLayout>);
=======
    useEffect(() => {
        user &&
            setState({
                user: {
                    name: user?.name || '--',
                    username: user?.username || '--',
                    phone: user?.phone || '--',
                    email: user?.email || '--',
                    namiId: user?.code || '--',
                    referral_username: user?.referral_username ?? t('profile:ref_title')
                }
            });
    }, [user]);

    // useEffect(() => {
    //     console.log('namidev-DEBUG: State => ', state)
    // }, [state])

    return (
        <>
            {!user ? <NeedLogin addClass="h-[380px] flex justify-center items-center"/>
                : <>
                    <div className="pb-20 lg:pb-24 2xl:pb-32">
                        <div className="font-bold leading-[40px] text-[26px] mb-6">
                            {t('navbar:menu.user.profile')}
                        </div>
                        <MCard
                            addClass="lg:flex lg:flex-wrap lg:justify-between px-7 py-8 lg:p-10 xl:px-7 xl:py-8 w-full drop-shadow-onlyLight border border-transparent dark:drop-shadow-none dark:border-divider-dark">
                            {renderUserPersona()}
                            {renderUserInfo()}
                            {renderFee()}
                            {renderJourney()}
                        </MCard>

                        <div className="mt-10 flex flex-col lg:flex-row">
                            <div className="w-full lg:w-1/2 lg:pr-2.5">
                                <div className="flex justify-between items-center">
                                    <div className="t-common">{t('profile:activity')}</div>
                                    <span
                                        className="flex items-center font-medium text-red hover:!underline cursor-pointer"
                                        onClick={openRevokeModal}>
                                        {t('profile:revoke_all_devices')} <ChevronRight className="ml-2" size={20}/>
                                    </span>
                                </div>
                                <MCard
                                    style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                                    addClass="mt-5 p-4 sm:p-6 lg:p-7 min-h-[356px] dark:border dark:border-divider-dark !overflow-hidden">
                                    <div className="max-h-[300px] pr-4 overflow-y-auto">
                                        {renderActivities()}
                                    </div>
                                </MCard>
                            </div>
                            <div className="w-full mt-8 lg:mt-0 lg:w-1/2 lg:pl-2.5">
                                <div className="t-common">
                                    {t('profile:announcements')}
                                </div>
                                <MCard
                                    style={currentTheme === THEME_MODE.DARK ? undefined : { boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04)' }}
                                    addClass="max-h-[400px] min-h-[356px] overflow-y-auto mt-5 p-4 sm:p-6 lg:p-7 dark:border dark:border-divider-dark !overflow-hidden">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {renderAnnoucements()}
                                        {renderRevokeContext()}
                                    </div>
                                </MCard>
                            </div>
                        </div>
                    </div>
                    <AvatarModal isVisible={!!state.openModal?.avatar} onCloseModal={onCloseModal}/>
                    {renderRevokeAll()}
                </>
            }
        </>
    );
>>>>>>> e2d04950 (Profile - Add Ref Modal)
};
export const getStaticProps = async ({ locale }) => ({
    props: {
<<<<<<< HEAD
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification']))
    }
});

export default Profile;
=======
        ...await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification','reference'])
    }
});

export default withTabLayout(
    {
        routes: TAB_ROUTES.ACCOUNT
    }
)(AccountProfile);


const EditIcon = (props) => (
    <svg {...props} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#b6972f97ia)">
            <path
                d="M4.498 14h-2.5v-2.5l7.374-7.373 2.5 2.5L4.498 14zm6.807-11.807c.26-.26.68-.26.94 0l1.56 1.56c.26.26.26.68 0 .94l-1.22 1.22-2.5-2.5 1.22-1.22z"
                fill="#8694B3"
            />
        </g>
        <defs>
            <clipPath id="b6972f97ia">
                <path fill="#fff" transform="matrix(0 -1 -1 0 16 16)" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
);
>>>>>>> e2d04950 (Profile - Add Ref Modal)
