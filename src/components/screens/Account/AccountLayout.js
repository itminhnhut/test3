import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useApp from 'hooks/useApp';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import WarningTriangle from 'components/svg/WarningTriangle';
import CheckCircle from 'components/svg/CheckCircle';
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
import { getS3Url } from 'redux/actions/utils';

const KYCPendingTag = ({ t }) => <TagV2 className='ml-3' type='warning'>{t('profile:kyc_wait')}</TagV2>;

const KYCVerifiedTag = ({ t }) => <TagV2 className='ml-3' type='success'>{t('profile:kyc_verified')}</TagV2>;

export default function AccountLayout({ children }) {
    const router = useRouter();
    const isApp = useApp();

    const { t } = useTranslation();

    const user = useSelector((state) => state.auth?.user);

    return <MaldivesLayout hideInApp={isApp}>
        <div
            className='bg-black-800 h-44'
            style={{
                backgroundImage: `url(${getS3Url('/images/screen/account/banner.png')})`,
                backgroundSize: 'auto 100%',
                backgroundPosition: 'center'
            }}
        />
        <Container className='mal-container px-4 h-full'>
            <div className='flex items-end justify-between'>
                <AccountAvatar currentAvatar={user?.avatar} />
                <div className='ml-4 flex-1'>
                    <div className='flex mb-3'>
                        <span className='text-xl leading-7 font-medium'>{user?.name}</span>
                        {{
                            [KYC_STATUS.PENDING_APPROVAL]: <KYCPendingTag t={t} />,
                            [KYC_STATUS.APPROVED]: <KYCVerifiedTag t={t} />
                        }[user?.kyc_status] || null}
                    </div>
                    <TextCopyable text={user?.code} className='text-gray-1' />
                </div>
                {
                    user?.kyc_status === KYC_STATUS.NO_KYC && router.asPath === PATHS.ACCOUNT.PROFILE &&
                    <Button
                        className='w-auto px-6'
                        onClick={() => {
                            router.push(PATHS.ACCOUNT.IDENTIFICATION, null, { scroll: false });
                        }}
                    >{t('profile:verify_account')}</Button>
                }
            </div>

            <div className='flex justify-between items-center border-b border-namiv2-gray-3 mt-12'>
                <div className='flex space-x-6'>
                    {[{
                        label: t('navbar:menu.user.profile'),
                        link: PATHS.ACCOUNT.PROFILE
                    }, {
                        label: t('identification:title_tab'),
                        link: PATHS.ACCOUNT.IDENTIFICATION
                    }, {
                        label: t('reward-center:title'),
                        link: PATHS.ACCOUNT.REWARD_CENTER
                    }].map((item, index) => {
                        const isActive = item.link === router.asPath;
                        return (
                            <Link scroll={false} href={item.link} key={index}>
                                <div
                                    className={classnames('py-4 text-gray-1 border-b-2 mb-[-1px] cursor-pointer', {
                                        'text-gray-4 font-bold border-teal': isActive,
                                        'border-transparent': !isActive
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
                    className='text-teal cursor-pointer font-medium hover:underline'>
                    {t('fee-structure:see_fee_structures')}
                </span>
            </div>
            <div className='pb-28'>
                {children}
            </div>
        </Container>
    </MaldivesLayout>;
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
