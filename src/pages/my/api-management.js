import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import MyPage from '../my';

const APIManagement = () => {
    return (
        <MyPage>
            <div className="mb-10">
                <div className="w-full px-10 lg:px-20 xl:px-[180px] py-20 rounded-lg bg-white text-black-700 ">
                    <div className="flex flex-col items-center justify-center h-full">
                        <Image src="/images/brokers/broker.png" width={260} height={260} />
                        <p className="text-violet-700 text-2xl mt-10 font-bold">Comming soon</p>
                    </div>
                </div>
            </div>
        </MyPage>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my', 'account', 'error', 'profile']),
        },
    };
}

export default APIManagement;
