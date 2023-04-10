import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatPhoneNumber, filterSearch, formatTime, formatTimePartner } from 'redux/actions/utils';
import { setPartner } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { API_GET_PARTNERS } from 'redux/actions/apis';
import InfoCard from './common/InfoCard';
import { Clock } from 'react-feather';
import DropdownCard from './DropdownCard';
import useFetchApi from 'hooks/useFetchApi';
import OrderBook from 'components/trade/OrderBook';
import { BxsTimeIcon, OrderIcon, TimeLapseIcon } from 'components/svg/SvgIcon';
import TimeCircle from 'components/svg/TimeCircle';

const PartnerInfo = ({ quantity, assetId, side, loadingPartner, minimumAllowed, maximumAllowed, selectedPartner, t }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');

    const conditionToFetch = minimumAllowed > 0 && maximumAllowed > 0 && +quantity >= minimumAllowed && +quantity <= maximumAllowed;

    const {
        data: partners,
        loading: loadingPartners,
        error
    } = useFetchApi({ url: API_GET_PARTNERS, params: { quantity: +quantity, assetId, side } }, conditionToFetch, [conditionToFetch, quantity, assetId, side]);

    return (
        <DropdownCard
            loadingList={loadingPartners}
            loading={loadingPartner}
            disabled={Boolean(!selectedPartner) || !partners || !partners?.length}
            containerClassname="z-[41]"
            label={t('dw_partner:partner')}
            data={partners && filterSearch(partners, ['name', 'phone'], search)}
            search={search}
            setSearch={setSearch}
            showDropdownIcon={partners && partners?.length}
            onSelect={(partner) => {
                dispatch(setPartner(partner));
            }}
            selected={{
                id: selectedPartner?._id,
                content: selectedPartner && {
                    mainContent: selectedPartner?.name?.toLowerCase(),
                    subContent: (
                        <div className="flex items-center space-x-4 text-txtSecondary dark:text-txtSecondary-dark">
                            <span>{formatPhoneNumber(selectedPartner?.phone || '1234')}</span>
                            <div className="flex space-x-1 items-center">
                                <OrderIcon size={16} />
                                <span>
                                    {selectedPartner?.analyticMetadata?.count || 0} {t('dw_partner:order')}
                                </span>
                            </div>
                            <div className="flex space-x-1 items-center">
                                <Clock size={12} />
                                <span>{formatTimePartner(t, selectedPartner?.analyticMetadata?.avgTime)}</span>
                            </div>
                        </div>
                    ),

                    imgSrc: selectedPartner?.avatar
                },
                item: (partner) =>
                    selectedPartner && (
                        <InfoCard
                            content={{
                                mainContent: partner && partner?.name?.toLowerCase(),
                                subContent: (
                                    <div className="flex items-center space-x-4 text-txtSecondary dark:text-txtSecondary-dark">
                                        <span>{formatPhoneNumber(partner?.phone)}</span>
                                        <div className="flex space-x-1 items-center">
                                            <OrderIcon size={16} />
                                            <span>
                                                {partner?.analyticMetadata?.count || 0} {t('dw_partner:order')}
                                            </span>
                                        </div>
                                        <div className="flex space-x-1 items-center">
                                            <BxsTimeIcon size={16} />
                                            <span>{formatTimePartner(t, partner?.analyticMetadata?.avgTime)}</span>
                                        </div>
                                    </div>
                                ),

                                imgSrc: partner?.avatar
                            }}
                            endIcon={selectedPartner?.partnerId === partner.partnerId && <CheckCircle size={16} color="currentColor" />}
                            endIconPosition="center"
                        />
                    )
            }}
        />
    );
};

export default React.memo(PartnerInfo);
