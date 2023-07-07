import { NotiSettingModal } from "components/notification/NotificationList";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

const NotiSettingMobile = () => {
    const { t, i18n: { language } } = useTranslation();

    return <MaldivesLayout>
        <div className="py-10 px-4 min-h-screen">
            <NotiSettingModal language={language} isMobile t={t} />
        </div>
    </MaldivesLayout>
}


export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
        ]))
    }
});

export default NotiSettingMobile;