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
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';

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

// chờ Ekyc xác minh
const KYCTempLocking = ({ t }) => (
    <TagV2 className="ml-3" type="failed">
        {t('navbar:temp_locking')}
    </TagV2>
);

const TABS = [
    {
        key: 'identify_tab',
        localized: 'navbar:menu.user.profile',
        href: PATHS.ACCOUNT.IDENTIFICATION
    },
    {
        key: 'kyc_tab',
        localized: 'identification:kyc_title',
        href: PATHS.ACCOUNT.PROFILE
    },
    {
        key: 'payment_tab',
        localized: 'payment-method:payment_method',
        href: PATHS.ACCOUNT.PAYMENT_METHOD
    }
];

export default function AccountLayout({ children, type }) {
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
            <div className="bg-gray-13 dark:bg-dark">
                <Container className="mal-container px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between">
                        <AccountAvatar currentAvatar={auth?.user?.avatar} />
                        <div className="mt-6 md:mt-0 md:ml-4 flex-1 flex flex-col md:flex-row justify-between items-center">
                            <div className="">
                                <div className="mb-2 flex items-center">
                                    <div className="text-xl md:text-2xl !leading-7 font-semibold">
                                        {auth?.user?.name || auth?.user?.username || auth?.user?.email}
                                    </div>
                                    {{
                                        [KYC_STATUS.NO_KYC]: <KYCUnVerifiedTag t={t} />,
                                        [KYC_STATUS.REJECT]: <KYCUnVerifiedTag t={t} />,
                                        [KYC_STATUS.PENDING_APPROVAL]: <KYCPendingTag t={t} />,
                                        [KYC_STATUS.APPROVED]: <KYCVerifiedTag t={t} />,
                                        [KYC_STATUS.LOCKING]: <KYCTempLocking t={t} />
                                    }[auth?.user?.kyc_status] || null}
                                </div>
                                <TextCopyable
                                    text={auth?.user?.code}
                                    className="text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark justify-center md:justify-start"
                                />
                            </div>
                            {[KYC_STATUS.NO_KYC, KYC_STATUS.REJECT].includes(auth?.user?.kyc_status) && router.asPath === PATHS.ACCOUNT.PROFILE && (
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
                    <div className="relative flex tracking-normal mt-12">
                        <Tabs tab={type} className="gap-6 border-b border-divider dark:border-divider-dark">
                            {TABS.map((item, index) => {
                                return (
                                    <TabItem
                                        key={item?.key}
                                        className={`text-left !px-0 !text-base !w-auto first:ml-4 md:first:ml-0`}
                                        value={item?.key}
                                        onClick={() => router.push(item.href)}
                                    >
                                        {t(item.localized)}
                                    </TabItem>
                                );
                            })}
                        </Tabs>
                        <div className="absolute right-0 hidden md:block">
                            {/* <div /> */}
                            <HrefButton variants="blank" className="w-auto !text-base" href={`/${PATHS.FEE_STRUCTURES.TRADING}`}>
                                {t('fee-structure:see_fee_structures')}{' '}
                            </HrefButton>
                        </div>
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
