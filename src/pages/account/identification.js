import AccountLayout from 'components/screens/Account/AccountLayout';
import Image from 'next/image';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import useDarkMode from 'hooks/useDarkMode';
import User from 'components/svg/User';
import CreditCard from 'components/svg/CreditCard';
import IDCard from 'components/svg/IDCard';
import PlayFilled from 'components/svg/PlayFilled';
import { createElement } from 'react';
import colors from 'styles/colors';
import { KYC_STATUS } from 'redux/actions/const';

const NotKycCard = ({
    t,
    className
}) => {
    return <div className={classnames(className, 'bg-white dark:bg-darkBlue-3 py-12 rounded-xl text-center px-10')}>
        <img className='mx-auto w-[7.5rem] w-[7.5rem] md:w-[12.5rem] md:h-[12.5rem]'
             src={getS3Url('/images/screen/account/kyc_require.png')} />
        <p className='text-teal font-semibold text-xl md:text-2xl mb-1 mt-6'>{t('identification:account.not_verified')}</p>
        <span
            className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:account.not_verified_content')}</span>
    </div>;
};

const KYCStepCard = ({
    t,
    className
}) => {
    const [currentTheme] = useDarkMode();

    return <div className={classnames(className,
        'flex flex-col-reverse md:flex-row md:gap-4',
        'bg-white dark:bg-darkBlue-3 py-14 rounded-xl px-6'
    )}>
        <div className='border-t md:border-none border-divider dark:border-divider-dark pt-6 md:pt-0'>
            <p className='text-xl md:text-2xl font-semibold mb-6'>{t('identification:kyc_step:title')}</p>
            <span
                className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:kyc_step:content')}</span>
            <div className='space-y-3 mt-4'>
                {
                    [
                        {
                            icon: User,
                            label: t('identification:kyc_step:step_1')
                        },
                        {
                            icon: CreditCard,
                            label: t('identification:kyc_step:step_2')
                        },
                        {
                            icon: IDCard,
                            label: t('identification:kyc_step:step_3')
                        },
                        {
                            icon: PlayFilled,
                            label: t('identification:kyc_step:step_4')
                        }
                    ].map((item, index) => {
                        return <div key={index} className='flex items-center'>
                            <div
                                className='flex items-center justify-center w-8 h-8 bg-gray-10 dark:bg-dark-2 rounded-full'>
                                {createElement(item.icon, {
                                    size: 16,
                                    color: colors.gray['1']
                                })}
                            </div>
                            <span
                                className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark ml-3'>{item.label}</span>
                        </div>;
                    })
                }
            </div>
        </div>

        <div className='pb-6 md:pb-0'>
            <div
                className='p-[.625rem] md:p-3 w-[7.75rem] h-[7.75rem] md:w-40 md:h-40 border border-teal bg-white rounded-lg mx-auto'>
                <QRCode value='account_verification' className='!w-full !h-full' />
            </div>
            <div className='text-center mt-5'>
                <span
                    className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:kyc_step:scan')}</span>
                <div className='flex mt-6 justify-between gap-4 max-w-[290px] m-auto gap-4'>
                    <Link href='https://apps.apple.com/app/id1480302334'>
                        <a target='_blank' className='bg-gray-10 dark:bg-dark-2 rounded-md px-3 py-2'>
                            <img
                                className='m-auto'
                                src={getS3Url(`/images/download_applestore_${currentTheme}.png`)}
                                alt=''
                            />
                        </a>
                    </Link>
                    <Link href='https://play.google.com/store/apps/details?id=com.namicorp.exchange'>
                        <a target='_blank' className='bg-gray-10 dark:bg-dark-2 rounded-md px-3 py-2'>
                            <img
                                className='m-auto'
                                src={getS3Url(`/images/download_google_${currentTheme}.png`)}
                                alt=''
                            />
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    </div>;
};

const ProcessKycCard = ({
    t,
    className
}) => {
    return <div className={classnames(className, 'bg-white dark:bg-darkBlue-3 py-12 rounded-xl text-center px-10')}>
        <img className='mx-auto w-[7.5rem] w-[7.5rem] md:w-[12.5rem] md:h-[12.5rem]'
             src={getS3Url('/images/screen/account/kyc_wait.png')} />
        <p className='text-teal font-semibold tetx-xl md:text-2xl mb-1 mt-6'>{t('identification:account.process')}</p>
        <span
            className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:account.process_content')}</span>
    </div>;
};

const CurrentFuturesCard = ({
    t,
    className
}) => {
    return <div
        className={classnames(className, 'flex flex-col justify-center p-6 bg-white dark:bg-darkBlue-3 rounded-xl px-6 py-auto')}>
        <div className='mb-8'>
            <p className='font-semibold text-xl md:text-2xl'>{t('identification:current_futures:title')}</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-9 gap-x-8'>
            <div className='flex items-center'>
                <img width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_1_v2.png')}
                     alt='Nami Exchange' />
                <div className='ml-4'>
                    <p className='text-sm md:text-base font-semibold'>{t('identification:current_futures:buy_sell')}</p>
                    <span
                        className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:current_futures:price_daily')}</span>
                </div>
            </div>

            <div className='flex items-center'>
                <img width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_2_v2.png')}
                     alt='Nami Exchange' />
                <div className='ml-4'>
                    <p className='text-sm md:text-base font-semibold'>{t('identification:current_futures:deposit')}</p>
                    <span
                        className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:current_futures:unlimited')}</span>
                </div>
            </div>

            <div className='flex items-center'>
                <img width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_3_v2.png')}
                     alt='Nami Exchange' />
                <div className='ml-4'>
                    <p className='text-sm md:text-base font-semibold'>{t('identification:current_futures:withdrawal')}</p>
                    <span
                        className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:current_futures:unlimited')}</span>
                </div>
            </div>

            <div className='flex items-center'>
                <Image width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_4_v2.png')} />
                <div className='ml-4'>
                    <p className='text-sm md:text-base font-semibold'>{t('identification:current_futures:other')}</p>
                    <span
                        className='text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark'>{t('identification:current_futures:reward')}</span>
                </div>
            </div>
        </div>
    </div>;
};

const VerifiedKycCard = ({
    t,
    className
}) => {
    return <div className={classnames(className, 'bg-white dark:bg-darkBlue-3 rounded-xl text-center px-10 py-12')}>
        <img className='mx-auto w-[7.5rem] w-[7.5rem] md:w-[12.5rem] md:h-[12.5rem]'
             src={getS3Url('/images/screen/account/kyc_verified.png')} />
        <span className='text-teal font-semibold md:leading-8 text-xl md:text-2xl mb-2 mt-6'>
            {t('identification:account.congratulations')}<br />
            {t('identification:account.verified')}
        </span>
    </div>;
};

function Identification() {
    const user = useSelector((state) => state.auth?.user);

    const { t } = useTranslation();

    return <AccountLayout>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8 my-12'>
            <NotKycCard t={t} className='md:col-span-2' />
            <KYCStepCard t={t} className='md:col-span-3' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8 my-12'>
            <ProcessKycCard t={t} className='md:col-span-2' />
            <KYCStepCard t={t} className='md:col-span-3' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8 my-12'>
            <VerifiedKycCard t={t} className='md:col-span-2' />
            <CurrentFuturesCard t={t} className='md:col-span-3' />
        </div>
    </AccountLayout>;
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification']))
    }
});

export default Identification;
