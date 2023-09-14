import React from 'react';

// ** next
import { Trans, useTranslation } from 'next-i18next';

// ** redux
import { getLoginUrl, getS3Url } from 'redux/actions/utils';

const NotAuth = () => {
    const { t } = useTranslation();
    return (
        <section className="rounded-xl p-6 md:p-8 bg-white dark:bg-bgContainer-dark flex items-center justify-center !py-[50px]">
            <div>
                <div className="flex justify-center mb-3">
                    <img className="max-h-[124px]" src={getS3Url('/images/icon/ic_login.png')} />
                </div>
                <div className=" text-txtSecondary dark:text-txtSecondary-dark text-center">
                    <Trans i18nKey="lending:not_auth">
                        <a
                            className="text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer font-semibold"
                            href={getLoginUrl('sso', 'register')}
                        />
                        <a
                            className="text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer font-semibold"
                            href={getLoginUrl('sso')}
                        />
                    </Trans>
                </div>
            </div>
        </section>
    );
};

export default NotAuth;
