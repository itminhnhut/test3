import TagV2 from 'components/common/V2/TagV2';
import CreditCard from 'components/svg/CreditCard';
import numeral from 'numeral';
import React from 'react';
import { ChevronRight } from 'react-feather';
import { formatNumber, formatPhoneNumber, formatTime } from 'redux/actions/utils';
import InfoCard from './common/InfoCard';
import Link from 'next/link';
import { PATHS } from 'constants/paths';

import { CalendarFillIcon, ContactIcon } from 'components/svg/SvgIcon';
import { useRouter } from 'next/router';

const ProfileHeader = ({ t, partner, partnerBankDefault, loadingBankDefault }) => {
    const router = useRouter();
    return (
        <div className="rounded-xl bg-white dark:bg-darkBlue-3 p-8">
            <div className="py-6 flex -m-3 flex-wrap items-center justify-between">
                <div className="flex p-3 md:flex-grow items-center">
                    <img className="rounded-full object-cover" src={partner?.avatar} width={80} height={80} />
                    <div className="ml-6">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] mb-3">{partner?.name}</div>
                        <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark ">
                            <div className="flex items-center">
                                <CalendarFillIcon color="currentColor" size={16} />
                                <div className="text-txtPrimary dark:text-txtPrimary-dark ml-2">{formatTime(partner?.startedAt, 'dd/mm/yyyy')}</div>
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
                            loading={loadingBankDefault}
                            imgSize={loadingBankDefault || partnerBankDefault ? 40 : 24}
                            content={{
                                mainContent: !partnerBankDefault ? (
                                    t('dw_partner:payment_method')
                                ) : (
                                    <div className="max-w-[280px]">{partnerBankDefault?.bankName}</div>
                                ),
                                subContent: partnerBankDefault && (
                                    <div className="flex space-x-2 items-center ">
                                        <span>{partnerBankDefault?.accountNumber}</span>

                                        <TagV2 icon={false} type="success">
                                            {t('dw_partner:default')}
                                        </TagV2>
                                    </div>
                                ),
                                icon: !partnerBankDefault ? (
                                    <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark">
                                        <CreditCard size={24} color="currentColor" />
                                    </div>
                                ) : undefined,
                                imgSrc: partnerBankDefault && partnerBankDefault?.bankLogo
                            }}
                            endIcon={
                                <div className="ml-6 text-txtPrimary dark:text-txtPrimary-dark">
                                    <ChevronRight color="currentColor" size={24} />
                                </div>
                            }
                            endIconPosition="center"
                        />
                    </div>
                </div>
            </div>

            <hr className="my-4 border-divider dark:border-divider-dark" />
            <div className="flex flex-wrap justify-between -m-3 items-center">
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <div className="txtSecond-2 mb-3">Thời gian xử lý trung bình</div>
                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                        ~
                        {partner?.analyticMetadata?.avgTime < 60
                            ? `${partner?.analyticMetadata?.avgTime} ${t('common:second')}`
                            : `${formatTime(partner?.analyticMetadata?.avgTime, 'm')} ${t('common:minute')}`}
                    </div>
                </div>
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <div className="txtSecond-2 mb-3">Tổng khối lượng GD</div>
                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] uppercase">
                        {numeral(partner?.analyticMetadata?.totalValue).format('0.000a')} VND
                    </div>
                </div>
                <div className="w-full p-3 text-center sm:text-left sm:w-1/3">
                    <div className="txtSecond-2 mb-3">Số lệnh đã hoàn thành</div>
                    <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                        {formatNumber(partner?.analyticMetadata?.count)} lệnh
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
