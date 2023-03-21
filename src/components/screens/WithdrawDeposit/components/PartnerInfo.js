import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatPhoneNumber, filterSearch } from 'redux/actions/utils';
import { setPartner } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { API_GET_PARTNERS } from 'redux/actions/apis';
import InfoCard from './common/InfoCard';
import { Clock } from 'react-feather';
import DropdownCard from './DropdownCard';
import useFetchApi from 'hooks/useFetchApi';

const PartnerInfo = ({ debounceQuantity, assetId, side, loadingPartner, selectedPartner }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [isVisible, setVisible] = useState(false);
    const [refetch, setRefetch] = useState(false);

    useEffect(() => {
        setRefetch(true);
    }, [debounceQuantity]);

    const {
        data: partners,
        loading: loadingPartners,
        error
    } = useFetchApi(
        { url: API_GET_PARTNERS, params: { quantity: !debounceQuantity ? 0 : debounceQuantity, assetId, side }, successCallBack: () => setRefetch(false) },
        isVisible && refetch,
        [debounceQuantity, assetId, side, isVisible, refetch]
    );

    return (
        <DropdownCard
            show={isVisible}
            setShow={setVisible}
            loadingList={loadingPartners}
            loading={loadingPartner}
            disabled={Boolean(!selectedPartner)}
            containerClassname="z-[41]"
            label="Đối tác kinh doanh"
            data={partners && filterSearch(partners, ['name'], search)}
            search={search}
            setSearch={setSearch}
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
                                <span>1 Phút</span>
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
                                            <span>1 Phút</span>
                                        </div>
                                    </div>
                                ),
                                imgSrc: partner?.avatar
                            }}
                            endIcon={selectedPartner?.partnerId === partner.partnerId && <CheckCircle size={16} color="currentColor " />}
                            endIconPosition="center"
                        />
                    )
            }}
        />
    );
};

export default React.memo(PartnerInfo);
