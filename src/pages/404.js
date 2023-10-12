import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import Image from 'next/image';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const Custom404 = () => {
    const { t } = useTranslation();
    return (
        <MaldivesLayout>
            <div className="py-[7.5rem] flex flex-col justify-center items-center px-4">
                <Image width={320} height={320} src={getS3Url('/images/bg/404.png')} />
                <div className="text-2xl font-semibold mb-4">{t('404:title')}</div>
                <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('404:subtitle')}</div>
                <Link href={'/'}>
                    <a>
                        <ButtonV2 className="mt-10 sm:w-max px-6">{t('common:back_to_home')}</ButtonV2>
                    </a>
                </Link>
            </div>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', '404', 'navbar', 'footer']))
    }
});
export default Custom404;
