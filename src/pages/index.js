/* eslint-disable react/jsx-closing-tag-location */
import Footer from 'components/common/Footer';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

const Index = () => {
    const { t } = useTranslation(['common', 'landing', 'home']);

    return (
        <LayoutWithHeader showBanner>
            <div className="bg-black-5 lg:pt-[4.5rem] pt-10">
                <div className="ats-container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-center lg:-mt-14 mt-10">
                        <div className="lg:order-1 order-2">
                            <div className="text-6xl font-semibold mb-6 lg:max-w-[448px] letter-spacing-02">
                                Nami <br />
                                Exchange
                            </div>
                            <div className="text-xl text-black-600 mb-10">
                                {t('landing:welcome_text_1')} <br
                                    className="xl:inline xl:visible hidden invisible"
                                />{t('landing:welcome_text_2')}
                            </div>
                        </div>
                        <div className="lg:order-2 order-1 col-span-2" />
                    </div>
                </div>
            </div>
            <Footer />

        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'footer', 'navbar', 'landing', 'home', 'promotion']),
    },
});
export default Index;
