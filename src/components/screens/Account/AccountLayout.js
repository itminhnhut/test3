import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useApp from 'hooks/useApp';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import TextCopyable from 'components/screens/Account/TextCopyable';
import Button from 'components/common/V2/ButtonV2/Button';
import TagV2 from 'components/common/V2/TagV2';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { KYC_STATUS } from 'redux/actions/const';
import Link from 'next/link';
import AccountAvatar from 'components/screens/Account/AccountAvatar';
import { PATHS } from 'constants/paths';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useEffect } from 'react';
import colors from 'styles/colors';

const KYCUnVerifiedTag = ({ t }) => (
    <TagV2 className="ml-3" type="default">
        {t('profile:kyc_unverified')}
    </TagV2>
);
const KYCPendingTag = ({ t }) => (
    <TagV2 className="ml-3" type="warning">
        {t('profile:kyc_wait')}
    </TagV2>
);
const KYCVerifiedTag = ({ t }) => (
    <TagV2 className="ml-3" type="success">
        {t('profile:kyc_verified')}
    </TagV2>
);

export default function AccountLayout({ children }) {
    const auth = useSelector((state) => state.auth);

    const router = useRouter();
    const isApp = useApp();
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();

    useEffect(() => {
        // Not logged
        if (!auth.user && !auth.loadingUser) {
            window.open(getLoginUrl('sso', 'login'), '_self');
        }
    }, [auth]);

    return (
        <MaldivesLayout
            dark={currentTheme === THEME_MODE.DARK}
            light={currentTheme === THEME_MODE.LIGHT}
            hideInApp={isApp}
            contentWrapperStyle={{ backgroundColor: currentTheme === THEME_MODE.DARK ? colors.dark.dark : colors.gray['10'] }}
        >
            <div
                className="bg-black-800 h-24 md:h-44"
                style={{
                    backgroundImage: `url(${getS3Url('/images/screen/account/banner_2.png')})`,
                    backgroundSize: 'auto 100%',
                    backgroundPosition: 'center'
                }}
            />
            <div className="bg-white dark:bg-dark">
                <Container className="mal-container px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between">
                        <AccountAvatar currentAvatar={auth?.user?.avatar} />
                        <div className="mt-6 md:mt-0 md:ml-4 flex-1 flex flex-col md:flex-row justify-between items-center">
                            <div className="flex flex-col md:flex-row items-center md:items-start">
                                <div className="mb-3 md:mb-0">
                                    <div className="text-xl md:text-2xl !leading-7 mb-2 font-semibold">
                                        {auth?.user?.name || auth?.user?.username || auth?.user?.email}
                                    </div>
                                    <TextCopyable
                                        text={auth?.user?.code}
                                        className="text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark justify-center md:justify-start"
                                    />
                                </div>

                                {{
                                    [KYC_STATUS.NO_KYC]: <KYCUnVerifiedTag t={t} />,
                                    [KYC_STATUS.PENDING_APPROVAL]: <KYCPendingTag t={t} />,
                                    [KYC_STATUS.APPROVED]: <KYCVerifiedTag t={t} />
                                }[auth?.user?.kyc_status] || null}
                            </div>
                            {auth?.user?.kyc_status === KYC_STATUS.NO_KYC && router.asPath === PATHS.ACCOUNT.PROFILE && (
                                <Button
                                    className="w-[90%] md:w-auto px-6 mt-4 md:mt-0"
                                    onClick={() => {
                                        router.push(PATHS.ACCOUNT.IDENTIFICATION, null, { scroll: false });
                                    }}
                                >
                                    {t('profile:verify_account')}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-b border-divider dark:border-divider-dark mt-12">
                        <div className="flex space-x-6">
                            {[
                                {
                                    label: t('navbar:menu.user.profile'),
                                    link: PATHS.ACCOUNT.PROFILE
                                },
                                {
                                    label: t('identification:kyc_title'),
                                    link: PATHS.ACCOUNT.IDENTIFICATION
                                },
                                {
                                    label: t('identification:payment_method'),
                                    link: PATHS.ACCOUNT.PAYMENT_METHOD
                                }
                                // {
                                //     label: t('reward-center:title'),
                                //     link: PATHS.ACCOUNT.REWARD_CENTER
                                // }
                            ].map((item, index) => {
                                const isActive = item.link === router.asPath;
                                return (
                                    <Link scroll={false} href={item.link} key={item.link}>
                                        <div
                                            className={classnames('py-4 border-b-2 mb-[-1px] cursor-pointer', {
                                                'border-transparent text-txtSecondary dark:text-txtSecondary-dark': !isActive,
                                                'border-teal text-txtPrimary font-semibold dark:text-teal': isActive
                                            })}
                                        >
                                            {item.label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <span
                            onClick={() => router.push(PATHS.FEE_STRUCTURES.TRADING)}
                            className="hidden md:inline text-teal cursor-pointer font-semibold hover:underline"
                        >
                            {t('fee-structure:see_fee_structures')}
                        </span>
                    </div>
                    <div className="pb-28">{children}</div>
                </Container>
            </div>
        </MaldivesLayout>
    );
}

const Container = styled.div`
    @media (min-width: 1024px) {
        max-width: 1000px !important;
    }

    @media (min-width: 1280px) {
        max-width: 1260px !important;
    }

    @media (min-width: 1440px) {
        max-width: 1300px !important;
    }

    @media (min-width: 1920px) {
        max-width: 1440px !important;
    }
`;
