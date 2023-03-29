import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatPhoneNumber, filterSearch } from 'redux/actions/utils';
import { formatTime } from 'utils/reference-utils';
import { setPartner } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { API_GET_PARTNERS } from 'redux/actions/apis';
import InfoCard from './common/InfoCard';
import { Clock } from 'react-feather';
import DropdownCard from './DropdownCard';
import useFetchApi from 'hooks/useFetchApi';

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
            data={partners && filterSearch(partners, ['name'], search)}
            search={search}
            setSearch={setSearch}
            showDropdownIcon={partners && partners?.length}
            onSelect={(partner) => {
                dispatch(setPartner(partner));
            }}
            selected={{
                id: selectedPartner?._id,
                content: selectedPartner && {
                    mainContent: selectedPartner?.name,
                    subContent: (
                        <div className="flex items-center space-x-3">
                            <span>{formatPhoneNumber(selectedPartner?.phone || '1234')}</span>
                            <div className="flex space-x-1 items-center">
                                <Clock size={12} />
                                <span>{formatTime(Math.abs(selectedPartner?.analyticMetadata?.avgTime), `mm:ss [${t('common:seconds')}]`)}</span>
                            </div>
                        </div>
                    )
                },
                item: (partner) =>
                    selectedPartner && (
                        <InfoCard
                            content={{
                                mainContent: partner?.name,
                                subContent: (
                                    <div className="flex items-center space-x-3">
                                        <span>{formatPhoneNumber(partner?.phone)}</span>
                                        <div className="flex space-x-1 items-center">
                                            <Clock size={12} />
                                            <span>{formatTime(Math.abs(partner?.analyticMetadata?.avgTime), `mm:ss [${t('common:seconds')}]`)}</span>
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
