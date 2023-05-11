import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from './V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const Error404 = () => {
    const { t } = useTranslation();
    return (
        <div className="py-[7.5rem] flex flex-col justify-center items-center px-4">
            <Image width={320} height={320} src={getS3Url('/images/bg/404.png')} />
            <div className="text-2xl font-semibold mb-4">{t('404:title')}</div>
            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('404:subtitle')}</div>
            <Link href={'/'}>
                <a>
                    <Button className="mt-10 sm:w-max px-6">{t('common:back_to_home')}</Button>
                </a>
            </Link>
        </div>
    );
};

export default Error404;
