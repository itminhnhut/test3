import React, { useEffect, useMemo, useState } from 'react';
import SwitchV2 from 'components/common/V2/SwitchV2';
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
import { PATHS } from 'constants/paths';
import Switcher from 'components/common/Switcher';
import MCard from 'components/common/MCard';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
import ButtonBuySell from './ButtonBuySell';
import { SET_AUTO_SUGGEST } from 'redux/actions/types';
const ModalBankDefault = dynamic(() => import('./components/ModalBankDefault'), { ssr: false });
const PartnerInfo = dynamic(() => import('./components/PartnerInfo'), { ssr: false });
const BankInfo = dynamic(() => import('./components/BankInfo'), { ssr: false });

const CardPartner = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { partner, partnerBank, accountBank, input, loadingPartner, minimumAllowed, maximumAllowed, isAutoSuggest } = useSelector(
        (state) => state.withdrawDeposit
    );

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
        // default accountBank apply when accountBank = null
        if (accountBanks && accountBanks.length && !accountBank) {
            dispatch(setAccountBank(accountBanks.find((bank) => bank.isDefault)));
        }
    }, [accountBanks, accountBank]);

    const toggleRefetchAccBanks = () => setRefetchAccBanks((prev) => !prev);

    const accountBankAction = useMemo(
        () => (
            <div className="mt-6 px-4 space-y-3">
                <ButtonV2 onClick={() => router.push(`${PATHS?.ACCOUNT?.PAYMENT_METHOD}?isAdd=true`)} className="text-base font-semibold">
                    {t('dw_partner:add_bank_account')}
                </ButtonV2>
                <ButtonV2 onClick={() => setVisibleModalBank(true)} variants="text" className="text-base font-semibold">
                    {t('dw_partner:edit_default_bank')}
                </ButtonV2>
            </div>
        ),
        []
    );

    let canSubmit = true;
    if (!isAutoSuggest) {
        canSubmit === !partner || loadingPartner || (!partnerBank && side === SIDE.BUY);
    }

    return (
        <>
            <Card className="flex flex-col">
                <div className="txtSecond-3 mb-4">{t('dw_partner:payment_infor')}</div>
                {side === SIDE.SELL && (
                    <div className="relative mb-8">
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
                            // dropdown must be show when modalbank is visible
                            mustBeShow={visibleModalBank}
                        />
                    </div>
                )}
                <div className={`grid grid-cols-2 mb-6 w-full`}>
                    <button
                        onClick={() => dispatch({ type: SET_AUTO_SUGGEST })}
                        className={`border border-divider dark:border-divider-dark rounded-l-md px-4 md:px-9 py-2 md:py-3 ${
                            isAutoSuggest ? 'font-semibold bg-gray-12 dark:bg-dark-2 ' : 'text-gray-7 border-r-none'
                        }`}
                    >
                        {t('dw_partner:auto_suggestion')}
                    </button>
                    <button
                        onClick={() => dispatch({ type: SET_AUTO_SUGGEST })}
                        className={`border border-divider dark:border-divider-dark rounded-r-md px-4 md:px-9 py-2 md:py-3 ${
                            !isAutoSuggest ? 'font-semibold bg-gray-12 dark:bg-dark-2 ' : 'text-gray-7 border-l-none'
                        }`}
                    >
                        {t('common:custom_2')}
                    </button>
                </div>
                <div className="flex-1">
                    <div className="space-y-4">
                        <PartnerInfo
                            minimumAllowed={minimumAllowed}
                            maximumAllowed={maximumAllowed}
                            quantity={input}
                            assetId={assetId}
                            side={side}
                            loadingPartner={loadingPartner}
                            selectedPartner={partner}
                            t={t}
                            language={language}
                            isAutoSuggest={isAutoSuggest}
                        />
                        {side === SIDE.BUY && partner && !isAutoSuggest && (
                            <BankInfo
                                selectedBank={partnerBank}
                                onSelect={(bank) => dispatch(setPartnerBank(bank))}
                                banks={banks}
                                loading={loadingPartner}
                                containerClassname="z-40"
                                t={t}
                                loadingBanks={loadingBanks}
                                showDropdownIcon={!loadingBanks && banks && banks.length > 1}
                                disabled={!banks || banks?.length < 2}
                            />
                        )}
                    </div>
                </div>

                <ButtonBuySell canSubmit={canSubmit} />
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
