import { useFormik } from 'formik';
import find from 'lodash/find';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconLoading, IconPaginationPrev } from 'src/components/common/Icons';
import InputPassword from 'src/components/common/input/InputPassword';
import GoogleAuthModal from 'src/components/security/GoogleAuthModal';
import * as Error from 'src/redux/actions/apiError';
import { SECURITY_VERIFICATION } from 'src/redux/actions/const';
import { getPasswordCheckPassId, updatePassword } from 'src/redux/actions/user';
import AuthSelector from 'src/redux/selectors/authSelectors';
import showNotification from 'src/utils/notificationService';
import MyPage from '../../my';

const ChangePassword = () => {
    const { t } = useTranslation();
    const user = useSelector(AuthSelector.userSelector);
    const dispatch = useDispatch();

    const [submitData, setSubmitData] = useState({});
    const [activeModal, setActiveModal] = useState(false);
    const [checkPassId, setCheckPassId] = useState('');
    const [securityMethods, setSecurityMethods] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const validate = values => {
        const errors = {};
        if (user?.passwordSet && !values.oldPassword) {
            errors.oldPassword = t('profile:blank_current_password_warning');
        }

        if (!values.newPassword) {
            errors.newPassword = t('profile:blank_new_password_warning');
        }

        if (!values.rePassword) {
            errors.rePassword = t('profile:blank_confirm_password_warning');
        }

        if (user?.passwordSet && values.oldPassword.length > 0 && values.newPassword.length > 0 && values.oldPassword === values.newPassword) {
            errors.newPassword = t('profile:similar_current_new_password_warning');
        }

        if (values.newPassword.length <= 6) {
            errors.newPassword = t('profile:short_password_warning');
        }

        if (values.rePassword.length > 0 && values.newPassword.length > 0 && values.newPassword !== values.rePassword) {
            errors.rePassword = t('profile:different_new_confirm_password_warning');
        }

        return errors;
    };

    const renderErrorNotification = (errorCode) => {
        const error = find(Error, { code: errorCode });
        const description = error
            ? t(`error:${error.message}`)
            : t('error:COMMON_ERROR');
        return showNotification({ message: `(${errorCode}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const handleSubmitData = async (data) => {
        await setIsLoading(true);
        setSubmitData(data);
        const result = await dispatch(await getPasswordCheckPassId({ currentPassword: data.oldPassword, newPassword: data.newPassword }));
        await setIsLoading(false);
        if (result?._id) {
            await setCheckPassId(result?._id);
            await setSecurityMethods(result?.securityMethods);
            return setActiveModal(true);
        }
        return renderErrorNotification(result);
    };

    const handleOnClose = () => {
        setActiveModal(false);
        setIsLoading(false);
    };

    const renderPopupSuccess = () => {
        showNotification({ message: t('profile:change_password_success'), title: t('common:success'), type: 'success' });
        handleOnClose();
    };

    const handleConfirmSecure = async () => {
        const result = await dispatch(await updatePassword({ currentPassword: submitData?.oldPassword, newPassword: submitData?.newPassword, checkpassId: checkPassId }));
        if (result) {
            await setIsLoading(false);
            return renderErrorNotification(result);
        }
        await renderPopupSuccess();
        return setTimeout(setIsLoading(false), 1000);
    };

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            rePassword: '',
        },
        validate,
        onSubmit: async (values) => {
            handleSubmitData(values);
        },
        validateOnChange: false,
    });

    useEffect(() => {
        formik.setValues({
            oldPassword: '',
            newPassword: '',
            rePassword: '',
        });
    }, [user]);

    return (
        <MyPage>
            <div className="mb-10">
                <div className="w-full px-10 md:px-36 lg:px-40 xl:px-[275px] pt-10 pb-[70px] bg-verification-right text-black-700 ">
                    <div className="my-0 mx-auto h-full">
                        {/* <p className="text-[#4021D0] text-sm mb-1">{t('profile:change_password_withdraw_warning')}</p> */}
                        <div>
                            <Link href="/my/account/profile">
                                <button
                                    type="button"
                                    className="inline-flex items-center text-sm text-[#02083D] mb-9"
                                    style={{ fontWeight: 500 }}
                                ><span className="mr-3 text-[#8B8C9B]"><IconPaginationPrev /></span>{user?.passwordSet ? t('profile:change_password_btn') : t('profile:setup_new_password')}
                                </button>
                            </Link>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="flex flex-col">
                                    {user?.passwordSet && (
                                        <div className="flex flex-col">
                                            <label htmlFor="oldPassword" className="text-[#02083D] mb-2 text-[12px] my-auto" style={{ lineHeight: '18px' }}>{t('profile:current_password')}</label>
                                            <InputPassword
                                                id="oldPassword"
                                                name="oldPassword"
                                                onChange={formik.handleChange}
                                                value={formik.values.oldPassword}
                                            />
                                            {
                                                formik.errors.oldPassword &&
                                                <p className="text-xs text-red mt-1">{formik.errors.oldPassword}</p>
                                            }
                                        </div>
                                    )}

                                    <div className={user?.passwordSet ? 'flex flex-col mt-5' : 'flex flex-col'}>
                                        <label htmlFor="newPassword" className="text-[#02083D] mb-2 text-[12px] my-auto" style={{ lineHeight: '18px' }}>{t('profile:new_password')}</label>
                                        <InputPassword
                                            id="newPassword"
                                            name="newPassword"
                                            onChange={formik.handleChange}
                                            value={formik.values.newPassword}
                                        />
                                        {
                                            formik.errors.newPassword &&
                                            <p className="text-xs text-red mt-1">{formik.errors.newPassword}</p>
                                        }
                                    </div>

                                    <div className="flex flex-col mt-5">
                                        <label htmlFor="rePassword" className="text-[#02083D] mb-2 text-[12px] my-auto" style={{ lineHeight: '18px' }}>{t('profile:confirm_password')}</label>
                                        <InputPassword
                                            id="rePassword"
                                            name="rePassword"
                                            onChange={formik.handleChange}
                                            value={formik.values.rePassword}
                                        />
                                        {
                                            formik.errors.rePassword &&
                                            <p className="text-xs text-red mt-1">{formik.errors.rePassword}</p>
                                        }
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading} className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} bg-[rgba(64,33,208,1)] mt-[38px] w-full px-[36px] py-[11px] rounded-md text-white font-bold text-sm flex flex-row items-center justify-center`}>
                                    { isLoading && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('profile:change_password_btn')}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {activeModal && <GoogleAuthModal
                user={user}
                closeModal={handleOnClose}
                authType={SECURITY_VERIFICATION.CHANGE_PASSWORD}
                securityMethods={securityMethods}
                currentPassword={submitData?.oldPassword || ''}
                newPassword={submitData?.newPassword || ''}
                checkPassId={checkPassId}
                confirmSecure={handleConfirmSecure}
            />}
        </MyPage>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my', 'profile', 'error']),
        },
    };
}

export default ChangePassword;
