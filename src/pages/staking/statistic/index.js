import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import MadivesLayout from 'components/common/layouts/MaldivesLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

const index = () => {
    return (
        <MadivesLayout>
            <main className="bg-white dark:bg-shadow">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl mt-[85px] mb-[120px] mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="text-4xl font-semibold">Thống kê lãi qua đêm</div>
                        <ButtonV2 className="w-auto" variants="text">
                            Thống kê lãi qua đêm
                        </ButtonV2>
                    </div>
                </div>
            </main>
        </MadivesLayout>
    );
};
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'staking']))
    }
});
export default index;
