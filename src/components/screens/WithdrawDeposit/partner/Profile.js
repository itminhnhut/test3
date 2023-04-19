import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';

import useFetchApi from 'hooks/useFetchApi';
import { API_DEFAULT_BANK_USER, API_GET_PARTNER_PROFILE, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';

import ProfileHeader from '../components/ProfileHeader';
import ProfileSetting from '../components/ProfileSetting';
import { useBoolean } from 'react-use';
import FetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';

const Profile = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [state, set] = useState({
        partner: null,
        banks: [],
        defaultBank: null,
        loading: false
    });

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    useEffect(() => {
        (async () => {
            let partner,
                banks = [];
            try {
                setState({ loading: true });
                const [partnerRes, banksRes] = await Promise.allSettled([
                    FetchApi({ url: API_GET_PARTNER_PROFILE }),
                    FetchApi({ url: API_GET_USER_BANK_ACCOUNT })
                ]);

                if (partnerRes.status === 'fulfilled' && partnerRes.value?.status === ApiStatus.SUCCESS) {
                    partner = partnerRes.value?.data;
                }
                if (banksRes.status === 'fulfilled' && banksRes.value?.status === ApiStatus.SUCCESS) {
                    banks = banksRes.value?.data;
                }

                setState({
                    partner,
                    banks,
                    defaultBank: banks && banks?.length && banks.find((bank) => bank.isDefault),
                    loading: false
                });

                return;
            } catch (error) {
                console.log('error: API_GET_PARTNER_PROFILE', error);
                setState({
                    loading: false
                });
            }
        })();
    }, []);

    return (
        <div>
            <ProfileHeader t={t} partner={state.partner} language={language} loading={state.loading} banks={state.banks} bankDefault={state.defaultBank} />
            <ProfileSetting t={t} partner={state.partner} loading={state.loading} setPartner={(partner) => setState({ partner })} />
        </div>
    );
};

export default Profile;
