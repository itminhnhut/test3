import React from 'react';
import { SuccessfulTransactionIcon } from '../../svg/SvgIcon';
import { PATHS } from 'constants/paths';
import { PulseLoader } from 'react-spinners';
import Link from 'next/link'
import { ChevronRight } from 'react-feather';

const UserVip = ({ loadingVipLevel, vipLevel, t }) => {
    return (
        <Link href={PATHS.FEE_STRUCTURES.TRADING}>
            <div className="flex items-center px-4 justify-between mb-6">
                <div className="flex items-center ">
                    <SuccessfulTransactionIcon size={24} />
                    <div className="text-dominant font-semibold ml-2">
                        {loadingVipLevel ? <PulseLoader size={3} color={colors.teal} /> : `VIP ${vipLevel || '0'}`}
                    </div>
                </div>
                <div className="flex items-center ">
                    <div className=" ">
                        {t('navbar:use')} <span className="text-dominant uppercase">NAMI</span> - {t('navbar:get_discount')}
                    </div>
                    <ChevronRight className="!mr-0 ml-3" size={16} />
                </div>
            </div>
        </Link>
    );
};

export default UserVip;
