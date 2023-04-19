import TagV2 from 'components/common/V2/TagV2';
import CreditCard from 'components/svg/CreditCard';
import numeral from 'numeral';
import React from 'react';
import { ChevronRight } from 'react-feather';
import { formatNumber, formatPhoneNumber, formatTime, formatTimePartner } from 'redux/actions/utils';
import InfoCard from './common/InfoCard';
import Link from 'next/link';
import { PATHS } from 'constants/paths';

import { CalendarFillIcon, ContactIcon } from 'components/svg/SvgIcon';
import { useRouter } from 'next/router';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

const ProfileHeader = ({ t, partner, bankDefault, banks, language, loading }) => {
    const router = useRouter();
    return (
        <div className="rounded-xl bg-white dark:bg-darkBlue-3 p-8">
            <div className="py-6 flex -m-3 flex-wrap items-center justify-center md:justify-between ">
                <div className="flex p-3 md:flex-grow items-center">
                    <img className="rounded-full object-cover" src={partner?.avatar} width={80} height={80} />
                    <div className="ml-6">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] mb-3">{partner?.name}</div>
                        <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark ">
                            <div className="flex items-center">
                                <CalendarFillIcon color="currentColor" size={16} />
                                <div className="text-txtPrimary dark:text-txtPrimary-dark ml-2">{formatTime(partner?.startedAt, 'dd/MM/yyyy')}</div>
                            </div>
                            <div className="ml-4 flex items-center">
                                <ContactIcon color="currentColor" size={16} />
                                <div className="text-txtPrimary dark:text-txtPrimary-dark ml-2">{formatPhoneNumber(partner?.phone)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:min-w-[358px] p-3">
                    <div
                        onClick={() => router.push(PATHS.ACCOUNT?.PAYMENT_METHOD || '/')}
                        className="p-4 bg-gray-12 dark:bg-dark-2 rounded-md w-full cursor-pointer flex items-center justify-between"
                    >
                        <InfoCard
                            loading={loading}
                            imgSize={loading || bankDefault ? 52 : 24}
                            content={{
                                mainContent: !bankDefault ? t('dw_partner:payment_method') : <div className="max-w-[280px]">{bankDefault?.bankName}</div>,
                                subContent: bankDefault && (
                                    <div className="flex space-x-2 items-center ">
                                        <span>{bankDefault?.accountNumber}</span>

                                        <TagV2 icon={false} type="success">
                                            {t('dw_partner:default')}
                                        </TagV2>
                                    </div>
                                ),
                                icon: !bankDefault ? (
                                    <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark">
                                        <CreditCard size={24} color="currentColor" />
                                    </div>
                                ) : undefined,
                                imgSrc: bankDefault && bankDefault?.bankLogo
                            }}
                            endIcon={
                                banks &&
                                banks?.length > 1 && (
                                    <div className="ml-6 text-txtPrimary dark:text-txtPrimary-dark">
                                        <ChevronRight color="currentColor" size={24} />
                                    </div>
                                )
                            }
                            endIconPosition="center"
                        />
                    </div>
                </div>
            </div>

            <hr className="my-4 border-divider dark:border-divider-dark" />
            <div className="flex flex-wrap justify-between -m-3 items-center">
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <div className="txtSecond-2 mb-3">{t('dw_partner:avg_process_time')}</div>
                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                        ~{formatTimePartner(t, partner?.analyticMetadata?.avgTime)}
                    </div>
                </div>
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <div className="txtSecond-2 mb-3">{t('dw_partner:total_volume')}</div>
                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] uppercase">
                        {numeral(partner?.analyticMetadata?.totalValue).format('0a')} VND
                    </div>
                </div>
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <div className="txtSecond-2 mb-3">{t('dw_partner:total_completed_order')}</div>
                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                        {formatNumber(partner?.analyticMetadata?.count || 0)}{' '}
                        {`${t('dw_partner:order')}${partner?.analyticMetadata?.count > 1 && language === LANGUAGE_TAG.EN ? 's' : ''}`}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
