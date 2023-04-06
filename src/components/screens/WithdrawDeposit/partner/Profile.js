import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

import useFetchApi from 'hooks/useFetchApi';
import { API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';

import ProfileHeader from '../components/ProfileHeader';
import ProfileSetting from '../components/ProfileSetting';

const Profile = () => {
    const { partner } = useSelector((state) => state.withdrawDeposit);
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [bankDefault, setBankDefault] = useState(null);

    const { data: partnerBanks, loading, error } = useFetchApi({ url: API_GET_USER_BANK_ACCOUNT });
    useEffect(() => {
        if (partnerBanks && partnerBanks.length) {
            setBankDefault(partnerBanks.find((bank) => bank.isDefault));
        }
    }, [partnerBanks]);

    return (
        <div>
            <ProfileHeader t={t} partner={partner} partnerBankDefault={bankDefault} loadingBankDefault={loading} />
            <ProfileSetting t={t} partner={partner} />
        </div>
    );
};

export default Profile;
