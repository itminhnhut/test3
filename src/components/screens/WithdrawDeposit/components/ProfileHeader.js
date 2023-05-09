import TagV2 from 'components/common/V2/TagV2';
import CreditCard from 'components/svg/CreditCard';
import numeral from 'numeral';
import React from 'react';
import { ChevronRight } from 'react-feather';
import { formatNumber, formatPhoneNumber, formatTime, formatTimePartner } from 'redux/actions/utils';
import InfoCard from './common/InfoCard';
import Link from 'next/link';
import { PATHS } from 'constants/paths';

import { BxChevronDown, CalendarFillIcon, ContactIcon, MoneyIcon, OrderIcon, TimerIcon } from 'components/svg/SvgIcon';
import { useRouter } from 'next/router';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import Card from './common/Card';
import Skeletor from 'components/common/Skeletor';

const ProfileHeader = ({ t, partner, bankDefault, banks, language, loading }) => {
    const router = useRouter();
    return (
        <div>
            <Card className="px-8 dark:!bg-darkBlue-3 mb-6 border-0">
                <div className="flex -m-3 flex-wrap items-center justify-center md:justify-between ">
                    <div className="flex p-3 md:flex-grow items-center">
                        {!partner ? (
                            <>
                                <Skeletor circle width={80} height={80} />

                                <div className="ml-6">
                                    <Skeletor width={150} className="mb-3" />
                                    <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark ">
                                        <div>
                                            <Skeletor width={50} height={15} />
                                        </div>
                                        <div className="ml-2">
                                            <Skeletor width={80} height={15} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <img className="rounded-full object-cover w-14 h-14 md:h-20 md:w-20" src={partner?.avatar} />
                                <div className="ml-6">
                                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] truncate max-w-[260px] mb-3">
                                        {partner?.name}
                                    </div>
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
                            </>
                        )}
                    </div>
                    <div className="md:min-w-[460px] p-3">
                        <div
                            onClick={() => router.push(PATHS.ACCOUNT?.PAYMENT_METHOD || '/')}
                            className="p-4 bg-gray-12 dark:bg-dark-2 rounded-xl w-full cursor-pointer flex items-center justify-between"
                        >
                            <InfoCard
                                loading={loading}
                                imgSize={loading || bankDefault ? 40 : 24}
                                content={{
                                    mainContent: !bankDefault ? t('dw_partner:payment_method') : <div className="max-w-[300px]">{bankDefault?.bankName}</div>,
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
                                    <div className="ml-6 text-txtPrimary dark:text-txtPrimary-dark">
                                        <BxChevronDown size={24} color="currentColor" />
                                    </div>
                                }
                                endIconPosition="center"
                            />
                        </div>
                    </div>
                </div>

                {/* <hr className="my-4 border-divider dark:border-divider-dark" /> */}
            </Card>
            <div className="flex flex-wrap justify-between -m-3">
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <Card className="px-8  border-0 space-y-4 dark:!bg-darkBlue-3">
                        <div className="txtSecond-2 mb-3 justify-center sm:justify-start flex space-x-1 items-center">
                            <div className="text-teal p-1 rounded-full bg-teal/10">
                                <TimerIcon size="16" color="currentColor" />
                            </div>
                            <div>{t('dw_partner:avg_process_time')}</div>
                        </div>

                        <div className="txtPri-3">~{formatTimePartner(t, partner?.analyticMetadata?.avgTime)}</div>
                    </Card>
                </div>
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <Card className=" px-8 border-0 space-y-4 dark:!bg-darkBlue-3">
                        <div className="txtSecond-2 flex justify-center sm:justify-start items-center space-x-1">
                            <div className="text-teal p-1 rounded-full bg-teal/10">
                                <MoneyIcon size={16} />
                            </div>
                            <div>{t('dw_partner:total_volume')}</div>
                        </div>
                        <div className="txtPri-3 uppercase">
                            {numeral(partner?.analyticMetadata?.totalValue).format('0a')} VND
                        </div>
                    </Card>
                </div>
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <Card className="px-8  border-0 space-y-4 dark:!bg-darkBlue-3">
                        <div className="txtSecond-2 justify-center sm:justify-start mb-3 flex items-center space-x-1">
                            <div className="text-teal p-1 rounded-full bg-teal/10">
                                <OrderIcon color="currentColor" size={16} />
                            </div>
                            <div>{t('dw_partner:total_completed_order')}</div>
                        </div>
                        <div className="txtPri-3">
                            {formatNumber(partner?.analyticMetadata?.count || 0)}{' '}
                            {`${t('dw_partner:order')}${partner?.analyticMetadata?.count > 1 && language === LANGUAGE_TAG.EN ? 's' : ''}`}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
