import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import Footer from 'components/common/Footer';

const Custom404 = () => {
    const { t } = useTranslation(['404']);
    const router = useRouter();
    const { locale } = router;
    return (
        <LayoutWithHeader>
            <div className="flex flex-1 justify-center bg-black-100">
                <div className="referral-container px-10 xl:px-0 xl:max-w-screen-xl w-full rounded-3xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="text-5xl font-semibold mb-8">{t('title')}</div>
                            <div className="text-lg text-black-600 mb-12 lg:whitespace-pre">
                                {t('subtitle')}
                            </div>
                            <Link href="/" locale={locale}>
                                <button className="btn btn-primary" type="button">{t('button')}</button>
                            </Link>
                        </div>
                        <div className="flex items-center justify-center text-center order-1 lg:order-2">
                            <img src="/images/bg/404-section1.png" alt="Gift" className="lg:max-w-[620px]" />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', '404', 'navbar', 'footer']),
    },
});
export default Custom404;
