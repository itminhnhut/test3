import React from 'react';
import Card from './Card';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import { Trans, useTranslation } from 'next-i18next';

const NotAuth = () => {
    const { t } = useTranslation();
    return (
        <Card className="flex items-center justify-center !py-[50px]">
            <div>
                <div className="flex justify-center mb-3">
                    <img className="max-h-[124px]" src={getS3Url('/images/icon/ic_login.png')} />
                </div>
                <div className=" text-txtSecondary dark:text-txtSecondary-dark text-center">
                    <Trans i18nKey="staking:statics.not_auth">
                        <a className="text-green-3 dark:text-green-2 hover:underline cursor-pointer font-semibold" href={getLoginUrl('sso', 'register')} />
                        <a className="text-green-3 dark:text-green-2 hover:underline cursor-pointer font-semibold" href={getLoginUrl('sso')} />
                    </Trans>
                </div>
            </div>
        </Card>
    );
};

export default NotAuth;
