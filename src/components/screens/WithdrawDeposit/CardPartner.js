import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { API_GET_PARTNER_BANKS, API_GET_USER_BANK_ACCOUNT } from 'redux/actions/apis';
import { setAccountBank, setPartnerBank } from 'redux/actions/withdrawDeposit';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useDispatch, useSelector } from 'react-redux';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import useFetchApi from 'hooks/useFetchApi';
import axios from 'axios';
import Card from './components/common/Card';
import { useTranslation } from 'next-i18next';
import sortBy from 'lodash/sortBy';

const ModalBankDefault = dynamic(() => import('./components/ModalBankDefault'), { ssr: false });
const PartnerInfo = dynamic(() => import('./components/PartnerInfo'), { ssr: false });
const BankInfo = dynamic(() => import('./components/BankInfo'), { ssr: false });

const CardPartner = () => {
    const { t } = useTranslation();

    const { partner, partnerBank, accountBank, input, loadingPartner, minimumAllowed, maximumAllowed } = useSelector((state) => state.withdrawDeposit);
    const dispatch = useDispatch();
    const router = useRouter();
    const { side, assetId } = router.query;
    const [visibleModalBank, setVisibleModalBank] = useState(false);
    const [refetchAccBanks, setRefetchAccBanks] = useState(false);

    const {
        data: banks,
        loading: loadingBanks,
        error
    } = useFetchApi({ url: API_GET_PARTNER_BANKS, params: { partnerId: partner?.partnerId } }, partner && side === SIDE.BUY, [input, assetId, partner]);

    const { data: accountBanks, loading: loadingAccountBanks } = useFetchApi({ url: API_GET_USER_BANK_ACCOUNT }, side === SIDE.SELL, [side, refetchAccBanks]);

    useEffect(() => {
        if (accountBanks && accountBanks.length) {
            dispatch(setAccountBank(accountBanks.find((bank) => bank.isDefault)));
        }
    }, [accountBanks]);

    const toggleRefetchAccBanks = () => setRefetchAccBanks((prev) => !prev);

    const accountBankAction = useMemo(
        () => (
            <div className="mt-6 px-4 space-y-3">
                <ButtonV2 className="text-base font-semibold">{t('dw_partner:add_bank_account')}</ButtonV2>
                <ButtonV2 onClick={() => setVisibleModalBank(true)} variants="text" className="text-base font-semibold">
                    {t('dw_partner:edit_default_bank')}
                </ButtonV2>
            </div>
        ),
        []
    );

    return (
        <>
            <Card className=" ">
                <div className="txtSecond-3 mb-4">{t('dw_partner:payment_infor')}</div>
                <div className="space-y-4">
                    {side === SIDE.SELL && (
                        <BankInfo
                            additionalActions={accountBankAction}
                            showTag
                            selectedBank={accountBank}
                            onSelect={(bank) => dispatch(setAccountBank(bank))}
                            containerClassname="z-[42]"
                            banks={sortBy(accountBanks || [], [(o) => -o.isDefault])}
                            loading={loadingAccountBanks}
                            showTooltip={false}
                            t={t}
                            showDropdownIcon={true}
                        />
                    )}

                    <PartnerInfo
                        minimumAllowed={minimumAllowed}
                        maximumAllowed={maximumAllowed}
                        quantity={input}
                        assetId={assetId}
                        side={side}
                        loadingPartner={loadingPartner}
                        selectedPartner={partner}
                        t={t}
                    />
                    {side === SIDE.BUY && partner && (
                        <BankInfo
                            selectedBank={partnerBank}
                            onSelect={(bank) => dispatch(setPartnerBank(bank))}
                            banks={banks}
                            loading={loadingPartner}
                            containerClassname="z-40"
                            t={t}
                            loadingBanks={loadingBanks}
                            showDropdownIcon={!loadingBanks && banks && banks.length}
                            disabled={!banks || !banks?.length}
                        />
                    )}
                </div>
            </Card>
            <ModalBankDefault
                banks={sortBy(accountBanks || [], [(o) => -o.isDefault])}
                toggleRefetch={toggleRefetchAccBanks}
                onClose={() => setVisibleModalBank(false)}
                isVisible={visibleModalBank}
                t={t}
            />
        </>
    );
};

export default CardPartner;
