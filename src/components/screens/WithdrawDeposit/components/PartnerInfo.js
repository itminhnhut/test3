import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { formatPhoneNumber, filterSearch } from 'redux/actions/utils';
import { setPartner } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import InfoCard from './common/InfoCard';
import { Clock } from 'react-feather';
import DropdownCard from './DropdownCard';

const PartnerInfo = ({ loadingPartners, selectedPartner, partners }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');

    return (
        <DropdownCard
            loading={loadingPartners}
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
