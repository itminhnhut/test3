import AccountLayout from 'components/screens/Account/AccountLayout';
import Image from 'next/image';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { KYC_STATUS } from 'redux/actions/const';

const NotKycCard = ({
    t,
    className
}) => {
    return <div className={classnames(className, 'bg-darkBlue-3 py-12 rounded-xl text-center px-10')}>
        <img width={200} height={200} src={getS3Url('/images/screen/account/kyc_require.png')}
             className='mx-auto' />
        <p className='text-teal font-medium text-xl mb-1 mt-6'>{t('identification:account.not_verified')}</p>
        <span className='text-txtSecondary'>{t('identification:account.not_verified_content')}</span>
    </div>;
};

const KYCStepCard = ({
    t,
    className
}) => {
    return <div className={classnames(className, 'flex gap-4 bg-darkBlue-3 py-14 rounded-xl px-6')}>
        <div>
            <p className='text-xl mb-6'>{t('identification:kyc_step:title')}</p>
            <span className='text-txtSecondary'>{t('identification:kyc_step:content')}</span>
            <div className='space-y-3 mt-4'>
                <div className='flex items-center'>
                    <img width={32} height={32} src={getS3Url('/images/screen/account/ic_user.png')} alt='Nami Exchange' />
                    <span className='text-txtSecondary ml-3'>{t('identification:kyc_step:step_1')}</span>
                </div>

                <div className='flex items-center'>
                    <img width={32} height={32} src={getS3Url('/images/screen/account/ic_payment_type.png')}
                         alt='Nami Exchange' />
                    <span className='text-txtSecondary ml-3'>{t('identification:kyc_step:step_2')}</span>
                </div>

                <div className='flex items-center'>
                    <img width={32} height={32} src={getS3Url('/images/screen/account/ic_identity_card.png')}
                         alt='Nami Exchange' />
                    <span className='text-txtSecondary ml-3'>{t('identification:kyc_step:step_3')}</span>
                </div>

                <div className='flex items-center'>
                    <img width={32} height={32} src={getS3Url('/images/screen/account/ic_record.png')}
                         alt='Nami Exchange' />
                    <span className='text-txtSecondary ml-3'>{t('identification:kyc_step:step_4')}</span>
                </div>
            </div>
        </div>

        <div className=''>
            <div className='p-2 bg-white rounded-lg mx-auto w-fit'>
                <QRCode value='account_verification' size={132} />
            </div>
            <div className='text-center mt-5'>
                <span className='text-txtSecondary'>{t('identification:kyc_step:scan')}</span>
                <div className='flex mt-6 justify-between max-w-[290px] m-auto gap-4'>
                    <Link href='https://apps.apple.com/app/id1480302334'>
                        <a target='_blank'>
                            <img
                                className='m-auto w-[135px] h-[40px] mr-[20px]'
                                src={getS3Url('/images/screen/homepage/app_store_light.png')}
                                alt=''
                            />
                        </a>
                    </Link>
                    <Link href='https://play.google.com/store/apps/details?id=com.namicorp.exchange'>
                        <a target='_blank'>
                            <img className='m-auto w-[135px] h-[40px]'
                                 src={getS3Url('/images/screen/homepage/play_store_light.png')}
                                 alt='' />
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
    return <div className={classnames(className, 'bg-darkBlue-3 py-12 rounded-xl text-center px-10')}>
        <img width={200} height={200} src={getS3Url('/images/screen/account/kyc_wait.png')} className='mx-auto' />
        <p className='text-teal font-medium text-xl mb-1 mt-6'>{t('identification:account.process')}</p>
        <span className='text-txtSecondary'>{t('identification:account.process_content')}</span>
    </div>;
};

const CurrentFuturesCard = ({
    t,
    className
}) => {
    return <div
        className={classnames(className, 'flex flex-col justify-center col-span-3 bg-darkBlue-3 rounded-xl px-6 py-auto')}>
        <div className='mb-8'>
            <p className='font-medium'>{t('identification:current_futures:title')}</p>
        </div>
        <div className='grid grid-cols-2 gap-y-9 gap-x-8'>
            <div className='flex items-center'>
                <img width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_1.png')} alt='Nami Exchange' />
                <div className='ml-4'>
                    <p className='font-bold'>{t('identification:current_futures:buy_sell')}</p>
                    <span
                        className='text-txtSecondary'>{t('identification:current_futures:price_daily')}</span>
                </div>
            </div>

            <div className='flex items-center'>
                <img width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_2.png')} alt='Nami Exchange' />
                <div className='ml-4'>
                    <p className='font-bold'>{t('identification:current_futures:deposit')}</p>
                    <span className='text-txtSecondary'>{t('identification:current_futures:unlimited')}</span>
                </div>
            </div>

            <div className='flex items-center'>
                <img width={48} height={48} src={getS3Url('/images/screen/account/ic_feature_3.png')} alt='Nami Exchange' />
                <div className='ml-4'>
                    <p className='font-bold'>{t('identification:current_futures:withdrawal')}</p>
                    <span className='text-txtSecondary'>{t('identification:current_futures:unlimited')}</span>
                </div>
            </div>

            <div className='flex'>
                <Image width={48} height={48} src={getS3Url('/images/screen/profile/ic_feature_4.png')} />
                <div className='ml-4'>
                    <p className='font-bold'>{t('identification:current_futures:other')}</p>
                    <span className='text-txtSecondary'>{t('identification:current_futures:reward')}</span>
                </div>
            </div>
        </div>
    </div>;
};

const VerifiedKycCard = ({
    t,
    className
}) => {
    return <div className={classnames(className, 'bg-darkBlue-3 py-12 rounded-xl text-center px-10')}>
        <img width={200} height={200} src={getS3Url('/images/screen/account/kyc_verified.png')} className='mx-auto' />
        <p className='text-teal font-medium text-xl mb-2 mt-6'>{t('identification:account.congratulations')}</p>
        <span className='text-teal font-medium text-xl '>{t('identification:account.verified')}</span>
    </div>;
};

function Identification() {
    const user = useSelector((state) => state.auth?.user);

    const { t } = useTranslation();

    return <AccountLayout>
        {
            user?.kyc_status === KYC_STATUS.NO_KYC &&
            <div className='grid grid-cols-5 gap-8 my-12'>
                <NotKycCard t={t} className='col-span-2' />
                <KYCStepCard t={t} className='col-span-3' />
            </div>
        }
        {
            user?.kyc_status === KYC_STATUS.PENDING_APPROVAL &&
            <div className='grid grid-cols-5 gap-8 my-12'>
                <ProcessKycCard t={t} className='col-span-2' />
                <CurrentFuturesCard t={t} className='col-span-3' />
            </div>
        }
        {
            user?.kyc_status === KYC_STATUS.APPROVED &&
            <div className='grid grid-cols-5 gap-8 my-12'>
                <VerifiedKycCard t={t} className='col-span-2' />
                <CurrentFuturesCard t={t} className='col-span-3' />
            </div>
        }
    </AccountLayout>;
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification']))
    }
});

export default Identification;
