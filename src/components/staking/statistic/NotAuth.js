import React from 'react';
import Card from './Card';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const NotAuth = () => {
    const { t } = useTranslation();
    return (
        <Card className="flex items-center justify-center !py-[50px]">
            <div>
                <div className="flex justify-center mb-3">
                    <img className="max-h-[124px]" src={getS3Url('/images/icon/ic_login.png')} />
                </div>
                <div className="flex space-x-1 text-txtSecondary dark:text-darkBlue-5 truncate overflow-x-auto">
                    <a href={getLoginUrl('sso')}>
                        <span
                            className="text-green-3 dark:text-green-2 hover:underline cursor-pointer font-semibold"
                            dangerouslySetInnerHTML={{ __html: t('common:sign_in') }}
                        />
                    </a>
                    <div>{t('common:or')}</div>
                    <a href={getLoginUrl('sso', 'register')}>
                        <span
                            className="text-green-3 dark:text-green-2 hover:underline cursor-pointer font-semibold"
                            dangerouslySetInnerHTML={{ __html: t('common:sign_up') }}
                        />
                    </a>
                    <div>{t('common:to_experience')}</div>
                </div>
            </div>
        </Card>
    );
};

export default NotAuth;
