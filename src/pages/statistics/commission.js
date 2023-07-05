import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Spinner from 'components/svg/Spinner';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dist/shared/lib/dynamic';

const Component = dynamic(() => import('components/screens/Wallet/Commission/statistics'))

const CommissionStatistics = () => {
    const { user, loadingUser } = useSelector((state) => state.auth);
    const [currentTheme] = useDarkMode();
    const { t } = useTranslation();

    return (
        <MaldivesLayout>
            <div className="bg-gray-13 dark:bg-dark pt-6 md:pt-20 pb-20 md:pb-[7.5rem]">
                {loadingUser ? (
                    <div className="min-h-[50vh] flex w-full justify-center items-center">
                        <Spinner size={50} color={currentTheme === THEME_MODE.DARK ? colors.darkBlue5 : colors.gray['1']} />
                    </div>
                ) : user ? (
                    <Component />
                ) : (
                    <div className="h-[480px] flex items-center justify-center">
                        {/* <NeedLoginV2 addClass="flex items-center justify-center" /> */}
                        <div className="flex flex-col justify-center items-center mt-[60px]">
                            <img src={getS3Url('/images/screen/swap/login-success.png')} alt="" className="mx-auto h-[124px] w-[124px]" />
                            <p className="!text-base text-txtSecondary dark:text-txtSecondary-dark mt-3">
                                <a
                                    href={getLoginUrl('sso')}
                                    className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4"
                                >
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
                    </div>
                )}
            </div>
        </MaldivesLayout>
    );
};

export default CommissionStatistics;


export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'portfolio',
            'navbar',
            'home',
            'modal',
            'input',
            'table',
            'futures',
            'dw_partner',
            // 'signals',
            // 'transaction-history',
            'commission'
        ]))
    }
});