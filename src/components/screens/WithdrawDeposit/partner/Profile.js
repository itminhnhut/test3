import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { API_GET_PARTNER_PROFILE, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';

import ProfileHeader from '../components/ProfileHeader';
import ProfileSetting from '../components/ProfileSetting';
import FetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import Card from '../components/common/Card';
import DarkNote from 'components/common/DarkNote';
import Link from 'next/link';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { BxsInfoCircle } from 'components/svg/SvgIcon';

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
            {!state.partner?.status ? (
                <Card className="mt-6 dark:!bg-darkBlue-3 border-0 ">
                    <div className="flex items-center mb-2">
                        <BxsInfoCircle size={16} fill={'currentColor'} fillInside={'currentColor'} />
                        <div className="font-semibold ml-2">{language === LANGUAGE_TAG.EN ? 'Note' : 'Lưu ý'}</div>
                    </div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">
                        <Trans i18nKey="dw_partner:partner_inactive">
                            <a
                                href={
                                    language === LANGUAGE_TAG.VI
                                        ? 'https://nami.exchange/vi/support/announcement/thong-bao/nami-exchange-ra-mat-chuong-trinh-doi-tac-nap-rut'
                                        : 'https://nami.exchange/support/announcement/crypto-deposit-withdrawal/officially-launch-nami-deposits-withdrawals-partnership-program'
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal font-semibold cursor-pointer hover:opacity-70 transition-opacity"
                            />
                        </Trans>
                    </div>
                </Card>
            ) : (
                <ProfileSetting t={t} partner={state.partner} loading={state.loading} setPartner={(partner) => setState({ partner })} />
            )}
        </div>
    );
};

export default Profile;
