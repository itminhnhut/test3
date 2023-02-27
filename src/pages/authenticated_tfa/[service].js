import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'react-input-range/lib/css/index.css';
import OtpModal from 'components/common/OtpModal';
import { useEffect, useMemo, useState } from 'react';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import axios from 'axios';
import { API_AUTH_USER_OTP } from 'redux/actions/apis';
import { TfaResult } from 'redux/actions/const';
import _ from 'lodash';
import { PORTAL_MODAL_ID } from 'constants/constants';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import useDarkMode from 'hooks/useDarkMode';
import toast from 'utils/toast';
import { ToastContainer } from 'react-toastify';
import useLanguage from 'hooks/useLanguage';
import Spiner from 'components/common/V2/LoaderV2/Spiner';

const INITIAL_STATE = {
    redirectTo: null,
    value: null,
    message: null
};
const ExternalWithdrawal = ({ theme, language }) => {
    const router = useRouter();
    const {
        t,
        i18n: { language: currentLanguage },
    } = useTranslation()
    const [languageInitLoading, setLanguageInitLoading] = useState(true)
    const [, onChangeLang] = useLanguage();
    const [currentTheme, , setTheme] = useDarkMode()
    const [loading, setLoading] = useState(false)
    const { width } = useWindowSize()
    const {
        service,
    } = router.query;

    useEffect(() => {
        setTheme(theme ?? 'dark')
    }, [])

    useEffect(() => {
        if (language !== currentLanguage) onChangeLang(language)
    }, [])

    useEffect(() => {
        const initLanguageTimeout = setTimeout(() => setLanguageInitLoading(false), 1500)
        return () => clearTimeout(initLanguageTimeout)
    }, [])

    const [state, set] = useState(INITIAL_STATE);
    const setState = state => set(prevState => ({ ...prevState, ...state }));
    const doLoginWithOtp = async (otp) => {
        setLoading(true)
        const SERVICE = service;
        const { data } = await axios.get(API_AUTH_USER_OTP(SERVICE) + window.location.search, {
            params: {
                otp,
                shouldRedirect: false
            }
        });
        let result = {
            verified: false,
        };
        if (data) {
            if (data.status === 'ok') {
                result = {
                    verified: true,
                    redirectTo: _.get(data, 'data.redirectTo')
                };
            } else if (data.status === TfaResult.INVALID_OTP) {
                result = {
                    verified: false,
                };
            } else {
                result = {
                    verified: false,
                    message: 'flasher.login.failed',
                    redirectTo: _.get(data, 'data.redirectTo')
                };
            }
        }
        setLoading(false)
        const {
            verified,
        } = result;
        if (verified) {
            onVerified(result);
        } else {
            onDeclined(result);
        }
    };

    const onVerified = ({ redirectTo }) => {
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            window.location.href = '/';
        }
    };

    const onDeclined = ({
        verified,
        redirectTo
    }) => {
        if (redirectTo) {
            let pathnameAndSearch;
            if (redirectTo.startsWith('http')) {
                pathnameAndSearch = new URL(redirectTo);
                pathnameAndSearch = pathnameAndSearch.pathname + pathnameAndSearch.search;
            } else {
                pathnameAndSearch = redirectTo;
            }
            window.location.href = pathnameAndSearch;
        } else {
            setState({ message: t('common:otp_verify_expired') })
            toast(
                { text: t('common:otp_verify_expired'), type: 'warning' },
            )
        }
    };

    const onChange = (value) => {
        setState({ value, message: null });
        if (value && value.length === 6) {
            doLoginWithOtp(value);
        }
    };

    if (languageInitLoading) return <div className='w-screen h-screen flex justify-center items-center'><Spiner isDark={theme === 'dark'} /></div>
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                closeButton={false}
                theme={currentTheme}
                className='nami-toast'
                preventDuplicates
            />
            <div className={`mal-layouts mal-layouts___light`}>
                <div className="flex flex-1 justify-center items-center h-full">
                    <div id={`${PORTAL_MODAL_ID}`} />
                    <OtpModal
                        label={t('common:otp_verify')}
                        isVisible
                        placeholder={'-'}
                        value={state?.value}
                        onChange={onChange}
                        renderUpper={() => <div className="font-bold text-xl sm:text-[22px] sm:leading-[30px]"> {t('common:tfa_authentication')}</div>}
                        isMobile={width < 640}
                        loading={loading}
                        isError={state?.message?.length}
                        router={router}
                        language={language}
                    />
                </div>
            </div>


        </>
    );
};

export const getServerSideProps = async ({ locale, params, query }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'modal',
            ])),
            theme: query?.theme || 'light',
            language: query?.language || 'vi',
            params: params
        },
    }
};


export default ExternalWithdrawal;
