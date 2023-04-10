import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

import useFetchApi from 'hooks/useFetchApi';
import { API_DEFAULT_BANK_USER, API_GET_PARTNER_PROFILE, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';

import ProfileHeader from '../components/ProfileHeader';
import ProfileSetting from '../components/ProfileSetting';
import { useBoolean } from 'react-use';

const Profile = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [refetch, toggleRefetch] = useBoolean(false);
    const [bankDefault, setBankDefault] = useState(null);

    const { data: partner, loading: loadingPartner } = useFetchApi({ url: API_GET_PARTNER_PROFILE }, true, [refetch]);

    const { data: banks, loading: loadingBanks } = useFetchApi({ url: API_GET_USER_BANK_ACCOUNT });

    useEffect(() => {
        if (!loadingBanks && banks && banks.length) {
            setBankDefault(banks.find((bank) => bank.isDefault));
        }
    }, [banks, loadingBanks]);

    return (
        <div>
            <ProfileHeader t={t} partner={partner} loadingPartner={loadingPartner} bankDefault={bankDefault} loadingBankDefault={loadingBanks} />
            <ProfileSetting t={t} partner={partner} loadingPartner={loadingPartner} refetchPartner={toggleRefetch} />
        </div>
    );
};

export default Profile;
