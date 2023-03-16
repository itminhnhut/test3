import React from 'react';
import Skeletor from '../../common/Skeletor';
import { TransactionTabs } from './constant';
import { useTranslation } from 'next-i18next';

const Skeleton = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-[500px] max-w-screen-v3 mx-auto px-4 md:px-0 2xl:max-w-screen-xxl">
            <div className="mt-20 mb-[120px]">
                <div className=" mb-12">
                    <div className="text-[32px] lead-[1.19] font-semibold">{t('transaction-history:title')}</div>
                </div>

                <div className="mb-8 flex space-x-6">
                    <div>
                        <Skeletor width="50px" height="15px" />
                        <Skeletor width="260px" height="30px" />
                    </div>
                    <div>
                        <Skeletor width="50px" height="15px" />
                        <Skeletor width="260px" height="30px" />
                    </div>
                    <div>
                        <Skeletor width="50px" height="15px" />
                        <Skeletor width="260px" height="30px" />
                    </div>
                </div>
                <div className="flex space-x-6 mb-12 ">
                    {[...Array(TransactionTabs.length).keys()].map((e) => (
                        <div key={e}>
                            <Skeletor width="80px" height="40px" />
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <Skeletor width="300px" height="100px" />
                </div>

                <div>
                    <Skeletor width="100%" height="400px" />
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
