import { Dialog, Transition } from '@headlessui/react';
import { format, parseISO } from 'date-fns';
import find from 'lodash/find';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { Info } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { KYC_STATUS } from 'redux/actions/const';
import { getUserReferral, setUserReferral } from 'redux/actions/user';
import ReferralSelector from 'redux/selectors/referralSelectors';
import { IconClose, IconLoading, IconSuccess, IconTooltip } from 'src/components/common/Icons';
import SelectFormik from 'src/components/common/input/SelectFormik';
import GoogleAuthModal from 'src/components/security/GoogleAuthModal';
import * as Error from 'src/redux/actions/apiError';
import { SECURITY_VERIFICATION } from 'src/redux/actions/const';
import {
    getAvatarList,
    getEmailCheckPassId,
    getKycCountry,
    getMe,
    getPhoneCheckPassId,
    setProfileAvatar,
    updateEmail,
    updateName,
    updatePhoneNumber,
    updateUsername,
} from 'src/redux/actions/user';
import { getS3Url } from 'src/redux/actions/utils';
import AuthSelector from 'src/redux/selectors/authSelectors';
import VerificationSelector from 'src/redux/selectors/verificationSelectors';
import showNotification from 'src/utils/notificationService';
import MyPage from '../../my';

const Account = () => {
    const { t } = useTranslation();

    const user = useSelector(AuthSelector.userSelector);

    const countries = useSelector(VerificationSelector.countrySelector);
    const isLoadingCountries = useSelector(VerificationSelector.countryLoadingSelector);
    const refOfName = useSelector(ReferralSelector.refOfName);
    const refOfId = useSelector(ReferralSelector.refOfId);
    const isEditable = useSelector(ReferralSelector.isEditable);
    const router = useRouter();

    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [toggleInput, setToggleInput] = useState({
        name: false,
        phoneNumber: false,
        email: false,
        username: false,
    });
    const [country, setCountry] = useState({});
    const [countryList, setCountryList] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [checkPassId, setCheckPassId] = useState('');
    const [securityMethods, setSecurityMethods] = useState([]);
    const [isKyc, setIsKyc] = useState(true);
    const [avatars, setAvatars] = useState([]);
    const [errorAvatar, setErrorAvatar] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const [activeAvatarModal, setActiveAvatarModal] = useState(false);
    const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
    const [isLoadingName, setIsLoadingName] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);
    const [isLoadingPhone, setIsLoadingPhone] = useState(false);
    const [authType, setAuthType] = useState(null);
    const [username, setUsername] = useState('');
    const [isLoadingUsername, setIsLoadingUsername] = useState(false);
    const [error, setError] = useState({
        name: {
            isError: false,
            message: '',
        },
        phoneNumber: {
            isError: false,
            message: '',
        },
        email: {
            isError: false,
            message: '',
        },
        username: {
            isError: false,
            message: '',
        },
    });
    const [refId, setRefId] = useState('');
    const [toggleChangeRef, setToggleChangeRef] = useState(true);

    const fieldList = {
        NAME: 0,
        PHONE_NUMBER: 1,
        EMAIL: 2,
        USERNAME: 3,
    };

    useAsync(async () => {
        const avatarList = await dispatch(getAvatarList());
        setAvatars(avatarList);
    }, []);

    useEffect(() => {
        if (user) {
            setName(user?.name);
            setPhoneNumber(user?.phone);
            setIsKyc(user?.kycStatus === KYC_STATUS.APPROVED || user?.kycStatus === KYC_STATUS.ADVANCE_KYC);
            dispatch(getKycCountry());
            dispatch(getUserReferral());
        }
    }, [user]);

    useEffect(() => {
        if (refOfId) {
            setToggleChangeRef(false);
        }
    }, [refOfId]);

    useEffect(() => {
        // Fetch profile on route change
        dispatch(getMe());
    }, [router.pathname]);

    useEffect(() => {
        if (error?.phoneNumber?.isError) {
            setError({
                ...error,
                phoneNumber: {
                    isError: false,
                    message: '',
                },
            });
        }
        if (error?.email?.isError) {
            setError({
                ...error,
                email: {
                    isError: false,
                    message: '',
                },
            });
        }
        if (error?.username?.isError) {
            setError({
                ...error,
                username: {
                    isError: false,
                    message: '',
                },
            });
        }
        if (error?.name?.isError) {
            setError({
                ...error,
                name: {
                    isError: false,
                    message: '',
                },
            });
        }
    }, [phoneNumber, email, username, name, error]);

    useEffect(() => {
        if (countries && countries.length > 0) {
            setCountryList(countries);
            setCountry(countries.filter(option => option?.code === 'vn')?.[0] || countries?.[0]);
        }
    }, [countries]);

    const renderSuccessNotification = (type) => {
        if (type === SECURITY_VERIFICATION.CHANGE_PHONE) {
            return showNotification({ message: `${t('profile:change_phone_success')}`, title: t('common:success'), type: 'success' });
        }
        if (type === SECURITY_VERIFICATION.CHANGE_EMAIL) {
            return showNotification({ message: `${t('profile:change_email_success')}`, title: t('common:success'), type: 'success' });
        }
        if (type === SECURITY_VERIFICATION.CHANGE_NAME) {
            return showNotification({ message: `${t('profile:change_name_success')}`, title: t('common:success'), type: 'success' });
        }
        if (type === 'change_ref') {
            return showNotification({ message: `${t('profile:change_ref_success')}`, title: t('common:success'), type: 'success' });
        }
    };

    const renderErrorNotification = (errorCode) => {
        const errorApis = find(Error, { code: errorCode });
        const description = errorApis
            ? t(`error:${errorApis.message}`)
            : t('error:COMMON_ERROR');
        return showNotification({ message: `(${errorCode}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const handleActiveModal = async (type) => {
        if (type) await setAuthType(type);
        setActiveModal(!activeModal);
    };

    const handleToggleInput = (type, open) => async () => {
        switch (type) {
            case fieldList.NAME: {
                await setIsLoadingName(true);
                if (!open) {
                    if (name.length === 0) {
                        setIsLoadingName(false);
                        return setError({ ...error, name: { isError: true, message: t('profile:error_name_blank') } });
                    }
                    const result = await dispatch(await updateName({ name }));
                    if (result?.name) {
                        renderSuccessNotification(SECURITY_VERIFICATION.CHANGE_NAME);
                        setIsLoadingName(false);
                        return setToggleInput({
                            ...toggleInput,
                            name: open,
                        });
                    }
                    renderErrorNotification(result);
                    return setIsLoadingName(false);
                }
                setIsLoadingName(false);
                return setToggleInput({
                    ...toggleInput,
                    name: open,
                });
            }
            case fieldList.PHONE_NUMBER: {
                await setIsLoadingPhone(true);
                if (toggleInput.phoneNumber) {
                    if (phoneNumber.length === 0) {
                        setIsLoadingPhone(false);
                        return setError({ ...error, phoneNumber: { isError: true, message: t('profile:error_phone_blank') } });
                    }
                    const result = await dispatch(await getPhoneCheckPassId({ phone: phoneNumber, countryCode: country.code }));
                    if (result?._id) {
                        await setCheckPassId(result?._id);
                        await setSecurityMethods(result?.securityMethods);
                        return handleActiveModal(SECURITY_VERIFICATION.CHANGE_PHONE);
                    }
                    setActiveModal(false);
                    renderErrorNotification(result);
                    return setIsLoadingPhone(false);
                }
                setIsLoadingPhone(false);
                return setToggleInput({
                    ...toggleInput,
                    phoneNumber: open,
                });
            }
            case fieldList.EMAIL: {
                await setIsLoadingEmail(true);
                if (toggleInput.email) {
                    if (email.length === 0) {
                        setIsLoadingEmail(false);
                        return setError({ ...error, email: { isError: true, message: t('profile:error_email_blank') } });
                    }
                    const result = await dispatch(await getEmailCheckPassId({ email }));
                    if (result?._id) {
                        await setCheckPassId(result?._id);
                        await setSecurityMethods(result?.securityMethods);
                        return handleActiveModal(SECURITY_VERIFICATION.CHANGE_EMAIL);
                    }
                    setActiveModal(false);
                    renderErrorNotification(result);
                    return setIsLoadingEmail(false);
                }
                setIsLoadingEmail(false);
                return setToggleInput({
                    ...toggleInput,
                    email: open,
                });
            }
            case fieldList.USERNAME: {
                await setIsLoadingUsername(true);
                if (!open) {
                    const usernameRegex = new RegExp('^[a-zA-Z][a-zA-Z0-9]{5,14}$');
                    if (username.length === 0) {
                        setIsLoadingUsername(false);
                        return setError({ ...error, username: { isError: true, message: t('profile:error_username_blank') } });
                    }
                    if (!usernameRegex.test(username)) {
                        setIsLoadingUsername(false);
                        return setError({ ...error, username: { isError: true, message: t('profile:error_username_invalid') } });
                    }
                    const result = await dispatch(await updateUsername({ username }));
                    if (result?.username) {
                        renderSuccessNotification(SECURITY_VERIFICATION.CHANGE_USERNAME);
                        setIsLoadingUsername(false);
                        return setToggleInput({
                            ...toggleInput,
                            username: open,
                        });
                    }
                    renderErrorNotification(result);
                    return setIsLoadingUsername(false);
                }
                setIsLoadingUsername(false);
                return setToggleInput({
                    ...toggleInput,
                    username: open,
                });
            }
            default: {
                return null;
            }
        }
    };

    const handleChangeSelect = ({ value }) => {
        setCountry(value);
    };

    const handleOnClose = () => {
        setActiveModal(false);
    };

    const handleConfirmSecure = async (type) => {
        if (type === SECURITY_VERIFICATION.CHANGE_EMAIL) {
            const result = await dispatch(await updateEmail({ email, checkpassId: checkPassId }));
            if (result) {
                setActiveModal(false);
                return renderErrorNotification(result);
            }
            setToggleInput({
                ...toggleInput,
                email: false,
            });
            showNotification({ message: `${t('profile:change_email_success')}`, title: t('common:success'), type: 'success' });
        }
        if (type === SECURITY_VERIFICATION.CHANGE_PHONE) {
            const result = await dispatch(await updatePhoneNumber({ phone: phoneNumber, countryCode: country.code, checkpassId: checkPassId }));
            if (result) {
                setActiveModal(false);
                return renderErrorNotification(result);
            }
            setToggleInput({
                ...toggleInput,
                phoneNumber: false,
            });
            showNotification({ message: `${t('profile:change_phone_success')}`, title: t('common:success'), type: 'success' });
        }
        return setActiveModal(false);
    };

    const renderPhoneNumber = () => {
        if (user?.phone) {
            return (
                <>
                    <p className="text-sm text-[#02083D] col-span-2 self-center">{user?.phone || '-'}</p>
                    <p className="flex flex-row items-center justify-end"><IconSuccess /></p>
                </>
            );
        }
        if (toggleInput.phoneNumber) {
            return (
                <>
                    <div className="border border-[#E1E2ED] rounded-md w-full col-span-2">
                        <div className="flex flex-row items-center w-full">
                            <SelectFormik
                                options={countryList.map(e => ({ ...e, label: e.name }))}
                                onChange={(value) => handleChangeSelect({ value, type: 'countryCode' })}
                                loading={isLoadingCountries}
                                initValue={countryList?.[0]}
                                type="phone_country"
                            />
                            <div className="relative">
                                <input
                                    className="w-full border-0 rounded-md focus:outline-none py-[10px] px-4 text-sm text-[#02083D] flex-1"
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    value={phoneNumber}
                                />
                                <p className="absolute text-xxs text-red mt-1">{error?.phoneNumber?.isError && error?.phoneNumber?.message}</p>
                            </div>

                        </div>
                    </div>
                    <div className="flex items-center justify-self-end">
                        { isLoadingPhone && <IconLoading color="#4021D0" />}
                        <button
                            type="button"
                            onClick={handleToggleInput(fieldList.PHONE_NUMBER, false)}
                            disabled={isLoadingPhone}
                            className={`text-sm text-[#4021D0] font-bold w-max ml-2 ${isLoadingPhone ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >{t('common:save')}
                        </button>
                    </div>
                </>
            );
        }
        return (
            <>
                <p className="text-sm text-[#02083D] col-span-2 self-center">{user?.phone || '-'}</p>
                <button
                    type="button"
                    onClick={handleToggleInput(fieldList.PHONE_NUMBER, true)}
                    className="justify-self-end text-sm text-[#4021D0] font-bold w-max"
                >{user?.phone ? t('common:edit') : t('profile:add_phone') }
                </button>
            </>
        );
    };

    const renderUsername = () => {
        if (user?.username) {
            return (
                <>
                    <p className="text-sm text-[#02083D] col-span-2">{user?.username || '-'}</p>
                    <p className="flex flex-row items-center justify-end"><IconSuccess /></p>
                </>
            );
        }
        if (toggleInput.username) {
            return (
                <>
                    <div className="relative rounded-md w-full col-span-2">
                        <input
                            className="border border-[#E1E2ED] rounded-md focus:outline-none py-[10px] px-4 text-sm text-[#02083D] col-span-2"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <p className="absolute text-xxs text-red mt-1">{error?.username?.isError && error?.username?.message}</p>
                    </div>
                    <div className="flex items-center justify-self-end">
                        { isLoadingUsername && <IconLoading color="#4021D0" />}
                        <button
                            type="button"
                            onClick={handleToggleInput(fieldList.USERNAME, false)}
                            disabled={isLoadingUsername}
                            className={`text-sm text-[#4021D0] font-bold w-max ml-2 ${isLoadingUsername ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >{t('common:save')}
                        </button>
                    </div>
                </>
            );
        }
        return (
            <>
                <p className="text-sm text-[#02083D] col-span-2">{user?.username || '-'}</p>
                <button
                    type="button"
                    onClick={handleToggleInput(fieldList.USERNAME, true)}
                    className="justify-self-end text-sm text-[#4021D0] font-bold w-max"
                >{t('common:edit')}
                </button>
            </>
        );
    };

    const renderName = () => {
        if (isKyc) {
            return (
                <>
                    <p className="text-sm text-[#02083D] col-span-2">{user?.name || '-'}</p>
                    <p className="flex flex-row items-center justify-end"><IconSuccess /></p>
                </>
            );
        }
        if (toggleInput.name) {
            return (
                <>
                    <div className="relative col-span-2">
                        <input
                            className="border border-[#E1E2ED] rounded-md focus:outline-none py-[10px] px-4 text-sm text-[#02083D] col-span-2"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <p className="absolute text-xxs text-red mt-1">{error?.name?.isError && error?.name?.message}</p>
                    </div>
                    <div className="flex items-center justify-self-end">
                        { isLoadingName && <IconLoading color="#4021D0" />}
                        <button
                            type="button"
                            onClick={handleToggleInput(fieldList.NAME, false)}
                            disabled={isLoadingName}
                            className={`text-sm text-[#4021D0] font-bold w-max ml-2 ${isLoadingName ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >{t('common:save')}
                        </button>
                    </div>
                </>
            );
        }
        return (
            <>
                <p className="text-sm text-[#02083D] col-span-2">{user?.name || '-'}</p>
                <button
                    type="button"
                    onClick={handleToggleInput(fieldList.NAME, true)}
                    className="justify-self-end text-sm text-[#4021D0] font-bold w-max"
                >{t('common:edit')}
                </button>
            </>
        );
    };

    const renderKyc = () => {
        if (isKyc) {
            return (
                <>
                    <p className="text-sm text-[#02083D] col-span-2 self-center">{t('profile:verified')}</p>
                    <p className="flex flex-row items-center justify-end"><IconSuccess /></p>
                </>
            );
        }
        return (
            <>
                <p className="text-sm text-[#02083D] col-span-2 self-center">{t('profile:unverified')}</p>
                <Link href="/my/verification">
                    <span className="justify-self-end text-sm text-[#4021D0] font-bold w-max cursor-pointer">{t('profile:verify_account')}</span>
                </Link>
            </>
        );
    };

    const renderEmail = () => {
        if (user?.email) {
            return (
                <>
                    <p className="text-sm text-[#02083D] col-span-2 self-center">{user?.email}</p>
                    <p className="flex flex-row items-center justify-end"><IconSuccess /></p>
                </>
            );
        }
        if (toggleInput.email) {
            return (
                <>
                    <div className="relative rounded-md w-full col-span-2">
                        <input
                            className="w-full border border-[#E1E2ED] rounded-md focus:outline-none py-[10px] px-4 text-sm text-[#02083D] flex-1"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <p className="absolute text-xxs text-red mt-1">{error?.email?.isError && error?.email?.message}</p>
                    </div>
                    <div className="flex items-center justify-self-end">
                        { isLoadingEmail && <IconLoading color="#4021D0" />}
                        <button
                            type="button"
                            onClick={handleToggleInput(fieldList.EMAIL, false)}
                            disabled={isLoadingEmail}
                            className={`text-sm text-[#4021D0] font-bold w-max ml-2 ${isLoadingEmail ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >{t('common:save')}
                        </button>
                    </div>
                </>
            );
        }
        return (
            <>
                <p className="text-sm text-[#02083D] col-span-2">{user?.email || '-'}</p>
                <button
                    type="button"
                    onClick={handleToggleInput(fieldList.EMAIL, true)}
                    className="justify-self-end text-sm text-[#4021D0] font-bold w-max"
                >{t('common:edit')}
                </button>
            </>
        );
    };

    const handleSelectAvatar = (avatar) => () => {
        if (errorAvatar) {
            setErrorAvatar(false);
        }
        setSelectedAvatar(avatar);
    };

    const handleSetAvatar = async () => {
        await setIsLoadingAvatar(true);
        const result = await dispatch(setProfileAvatar({ avatarUrl: selectedAvatar }));
        setIsLoadingAvatar(false);
        if (result) {
            setActiveAvatarModal(false);
            return showNotification({ message: t('profile:change_avatar_success'), title: t('common:success'), type: 'success' });
        }
        return showNotification({ message: t('profile:change_avatar_failure'), title: t('common:failure'), type: 'failure' });
    };

    const renderAvatarList = () => {
        if (avatars && avatars.length > 0) {
            return avatars.map((avatar) => {
                return (
                    <div
                        key={avatar}
                        className={`mr-3 py-0 my-0 box-border rounded-lg cursor-pointer ${selectedAvatar === avatar && 'ring-1 ring-[#4021D0]'}`}
                        onClick={handleSelectAvatar(avatar)}
                    >
                        <img
                            src={getS3Url(avatar)}
                            alt="avatar"
                            width={52}
                            height={52}
                            className="rounded-lg"
                        />
                    </div>
                );
            },
            );
        }
        return null;
    };

    const renderModalSelectAvatar = () => {
        return (
            <Transition
                appear
                show={activeAvatarModal}
                as={Fragment}
                enter="transition-opacity duration-250"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    open={activeAvatarModal}
                    onClose={() => setActiveAvatarModal(false)}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-250"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black-800 opacity-60" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-250"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className="inline-block w-full max-w-md max-h-[680px] p-6 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                            >
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-semibold leading-6 flex flex-row items-center justify-between"
                                >
                                    <p>{t('profile:select_avatar')}</p>
                                    <div onClick={() => setActiveAvatarModal(false)} className="cursor-pointer">
                                        <IconClose />
                                    </div>
                                </Dialog.Title>
                                <div className="mt-6 w-full">
                                    <div className="flex flex-row items-center flex-wrap gap-y-3">
                                        {renderAvatarList()}
                                    </div>
                                    {errorAvatar &&
                                        <p className="text-xxs text-red mt-1">Bạn cần chọn ảnh cho danh mục</p>}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSetAvatar}
                                    disabled={isLoadingAvatar}
                                    className={`${isLoadingAvatar ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[rgba(64,33,208,1)] mt-[38px] w-full px-[36px] py-[11px] rounded-md text-white font-bold text-sm flex flex-row items-center justify-center`}
                                >
                                    { isLoadingAvatar && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('common:save')}</span>
                                </button>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        );
    };

    const handleUpdateRef = async () => {
        // if (isRefEditable) {
        //     return console.log(refOfId);
        // }
        const result = await dispatch(setUserReferral({ refTerm: refId }));
        if (result) {
            return renderErrorNotification(result);
        }
        renderSuccessNotification('change_ref');
        return setToggleChangeRef(false);
    };

    const renderRef = () => {
        if (toggleChangeRef) {
            return (
                <>
                    <p className="text-base text-[#02083D] mb-5" style={{ fontWeight: 500 }}>{t('profile:ref_id')}</p>
                    <div className="relative">
                        <input type="text" onChange={e => setRefId(e.target.value)} placeholder={t('profile:change_ref_placeholder')} className="rounded bg-[#F6F9FC] w-full py-2 pl-3 pr-10 text-sm focus:outline-none" />
                        <div className="absolute top-0 right-0 w-[36px] h-[36px]">
                            <button
                                type="button"
                                className="rounded bg-[#4021D0] w-full h-full flex items-center justify-center text-white text-3xl pb-[5px]"
                                onClick={handleUpdateRef}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center">
                <p className="text-xs mb-1"><span className="text-[#8B8C9B]">{t('profile:ref_id')}:</span> <span style={{ fontWeight: 500 }}>{refOfId}</span></p>
                <p className="truncate w-full text-center" style={{ fontWeight: 500 }}>{refOfName}</p>
                {/* {
                    isEditable && (
                        <button
                            type="button"
                            className="rounded bg-[#4021D0] w-full h-full flex items-center justify-center text-white mt-4 px-10 py-2 text-sm"
                            onClick={() => setToggleChangeRef(!toggleChangeRef)}
                            style={{ fontWeight: 500 }}
                        >
                            {t('profile:change')}
                        </button>
                    )
                } */}
            </div>
        );
    };

    const urlAvatar = () => {
        if (user?.avatar) {
            if (user?.avatar?.includes?.('https://') || user?.avatar?.includes?.('http://')) return user?.avatar;
            return getS3Url(user?.avatar);
        }
        return '/images/avatar.png';
    };

    return (
        <MyPage>
            <div className="mb-10">
                <div className="w-full px-10 lg:px-20 xl:px-[180px] py-10 rounded-lg bg-white text-black-700 ">
                    <div className="my-0 mx-auto h-full">
                        <div className="flex flex-col justify-center items-center md:flex-row md:items-center md:justify-between mb-6">
                            <div className="flex flex-row items-center">
                                <img src={urlAvatar()} width={80} height={80} className="rounded-full" />
                                <div className="ml-4">
                                    <p className="text-[#02083D] text-[21px] font-bold" style={{ lineHeight: '32px' }}>{user?.name || '-'}</p>
                                    <button type="button" onClick={() => setActiveAvatarModal(true)} className="text-[#4021D0] text-sm font-bold" style={{ lineHeight: '21px' }}>{t('profile:avatar_change_btn')}</button>
                                </div>
                            </div>
                            <div className="px-6 py-[27px] w-[220px] mt-2 md:ml-2 md:mt-0" style={{ boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)' }}>
                                {renderRef()}
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-4 pt-7 pb-[26px] border-b border-b-[#EEF2FA]">
                                <p className="text-[12px] text-[#8B8C9B] self-center">{t('profile:name')}</p>
                                {renderName()}
                            </div>
                            <div className="grid grid-cols-4 pt-7 pb-[26px] border-b border-b-[#EEF2FA]">
                                <p className="text-[12px] text-[#8B8C9B] self-center flex items-center">{t('profile:username')}
                                    <span className="group ml-1 relative cursor-help">
                                        <Info size={12} />
                                        <div
                                            className="absolute z-10 -top-9 left-[-22px] hidden group-hover:flex text-white px-3 py-1 rounded-md"
                                        >
                                            <div className="relative w-full">
                                                <div className="bg-violet-100 text-white text-xs rounded py-1 px-4 right-0 bottom-full">
                                                    <p className="w-max">{t('profile:change_username_hint')}</p>
                                                    <IconTooltip />
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                </p>
                                {renderUsername()}
                            </div>
                            <div className="grid grid-cols-4 pt-7 pb-[26px] border-b border-b-[#EEF2FA]">
                                <p className="text-[12px] text-[#8B8C9B] self-center">{t('profile:password')}</p>
                                <p className="text-sm text-[#02083D] col-span-2 self-center">{user?.passwordSet ? '******' : '-'}</p>
                                <Link href="/my/account/change-password">
                                    <p className="justify-self-end text-sm text-[#4021D0] font-bold w-max cursor-pointer">{user?.passwordSet ? t('profile:change_password_btn') : t('profile:set_password_btn')}</p>
                                </Link>
                            </div>
                            <div className="grid grid-cols-4 pt-7 pb-[26px] border-b border-b-[#EEF2FA]">
                                <p className="text-[12px] text-[#8B8C9B] self-center">{t('profile:account_kyc')}</p>
                                {renderKyc()}
                            </div>
                            <div className="grid grid-cols-4 pt-7 pb-[26px] border-b border-b-[#EEF2FA]">
                                <p className="text-[12px] text-[#8B8C9B] self-center">{t('profile:email')}</p>
                                {renderEmail()}
                            </div>
                            <div className={`grid grid-cols-4 ${toggleInput.phoneNumber ? 'pt-[18px] pb-[17px]' : 'pt-7 pb-[26px]'} border-b border-b-[#EEF2FA]`}>
                                <p className="text-[12px] text-[#8B8C9B] self-center">{t('profile:phone_number')}</p>
                                {renderPhoneNumber()}
                            </div>
                            <div className="grid grid-cols-4 pt-7 pb-[26px]">
                                <p className="text-[12px] text-[#8B8C9B] self-center">{t('profile:join_date')}</p>
                                <p className="text-sm text-[#02083D] col-span-2 self-center">{user?.createdAt ? format(parseISO(user?.createdAt), 'dd/MM/yyyy') : '-'}</p>
                                <p className="flex flex-row items-center justify-end"><IconSuccess /></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {activeModal && <GoogleAuthModal
                user={user}
                closeModal={handleOnClose}
                authType={authType}
                securityMethods={securityMethods}
                email={user?.email ? user?.email : email}
                phone={user?.phoneNumber ? user?.phoneNumber : phoneNumber}
                checkPassId={checkPassId}
                confirmSecure={handleConfirmSecure}
            />}
            {renderModalSelectAvatar()}
        </MyPage>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my', 'account', 'error', 'profile']),
        },
    };
}

export default Account;
