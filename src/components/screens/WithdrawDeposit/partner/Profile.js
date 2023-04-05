import React from 'react';
import Card from '../components/common/Card';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { formatNumber, formatPhoneNumber, formatTime } from 'redux/actions/utils';
import { Calendar, Phone } from 'react-feather';

const Profile = () => {
    const { partner } = useSelector((state) => state.withdrawDeposit);
    return (
        <div>
            <div className="rounded-xl bg-white dark:bg-darkBlue-3 p-8">
                <div className="flex items-center border-b border-divider dark:border-divider-dark pb-10">
                    <img className="rounded-full object-cover" src={partner?.avatar} width={80} height={80} />
                    <div className="ml-6">
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px] mb-3">{partner?.name}</div>
                        <div className="flex items-center text-txtSecondary dark:text-txtSecondary-dark ">
                            <div className="flex items-center">
                                <Calendar color="currentColor" size={16} />
                                <div className="text-txtPrimary dark:text-txtPrimary-dark ml-2">{formatTime(partner?.startedAt, 'dd/mm/yyyy')}</div>
                            </div>
                            <div className="ml-4 flex items-center">
                                <Phone color="currentColor" size={16} />
                                <div className="text-txtPrimary dark:text-txtPrimary-dark ml-2">{formatPhoneNumber(partner?.phone)}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div className="w-1/3">
                        <div className="txtSecond-2 mb-3">Thời gian xử lý trung bình</div>
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                            ~{formatTime(partner?.analyticMetadata?.avgTime, 'm')} Phút
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="txtSecond-2 mb-3">Tổng khối lượng GD</div>
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                            {formatNumber(partner?.analyticMetadata?.totalValue)} VND
                        </div>
                    </div>
                    <div className="w-1/3">
                        <div className="txtSecond-2 mb-3">Số lệnh đã hoàn thành</div>
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-[18px]">
                            {formatNumber(partner?.analyticMetadata?.count)} Lệnh
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
