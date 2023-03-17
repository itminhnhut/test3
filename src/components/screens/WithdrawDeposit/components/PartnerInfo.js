import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useClickAway } from 'react-use';
import { useDispatch } from 'react-redux';
import { getPartners } from 'redux/actions/withdrawDeposit';
import { formatPhoneNumber } from 'redux/actions/utils';
import NoData from 'components/common/V2/TableV2/NoData';
import ChevronDown from 'components/svg/ChevronDown';
import CheckCircle from 'components/svg/CheckCircle';
import PopoverSelect from './common/PopoverSelect';
import InfoCard from './common/InfoCard';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import classNames from 'classnames';
import { Clock } from 'react-feather';

const PartnerInfo = ({ debounceQuantity, assetId, selectedPartner, partners }) => {
    const cardRef = useRef(null);
    const [isVisible, setVisible] = useState(false);
    const [fetchingPartner, setFetchingPartner] = useState(false);
    const [fetchingListPartners, setFetchingListPartners] = useState(false);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');

    useClickAway(cardRef, () => {
        if (isVisible) {
            setVisible(false);
        }
    });

    useEffect(() => {
        const source = axios.CancelToken.source();
        setFetchingPartner(true);
        dispatch(
            getPartners({
                params: { quantity: !debounceQuantity ? 0 : debounceQuantity, assetId, side: SIDE.SELL },
                cancelToken: source.token,
                getAll: false,
                callbackFn: () => setFetchingPartner(false)
            })
        );

        return () => source.cancel();
    }, [debounceQuantity, assetId]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        if (isVisible) {
            setFetchingListPartners(true);
            dispatch(
                getPartners({
                    params: { quantity: !debounceQuantity ? 0 : debounceQuantity, assetId, side: SIDE.SELL },
                    cancelToken: source.token,
                    callbackFn: () => setFetchingListPartners(false)
                }),
                source.token
            );
        }

        return () => source.cancel();
    }, [isVisible, assetId, debounceQuantity]);

    return (
        <PopoverSelect
            ref={cardRef}
            open={isVisible}
            containerClassname="z-[41]"
            label={
                <div
                    onClick={() => {
                        selectedPartner && setVisible((prev) => !prev);
                    }}
                    className={classNames('bg-gray-12 text-left dark:bg-dark-2 px-4 py-6 rounded-xl w-full', {
                        'cursor-pointer': selectedPartner
                    })}
                >
                    <div className="txtSecond-2 mb-4">Đối tác kinh doanh</div>
                    <InfoCard
                        loading={fetchingPartner}
                        content={
                            selectedPartner && {
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
                            }
                        }
                        endIcon={<ChevronDown className={classNames({ 'rotate-0': isVisible })} color="currentColor" size={24} />}
                    />
                </div>
            }
            value={search}
            onChange={(value) => setSearch(value)}
        >
            <div className="space-y-3 w-full">
                {fetchingListPartners ? (
                    <InfoCard loading={fetchingListPartners} />
                ) : !partners.length ? (
                    <NoData />
                ) : (
                    partners.map((partner) => (
                        <div key={partner._id} className={classNames('p-3 hover:bg-hover-1 dark:hover:bg-hover-dark transition')}>
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
                                endIcon={selectedPartner.partnerId === partner.partnerId && <CheckCircle size={16} color="currentColor " />}
                                endIconPosition="center"
                            />
                        </div>
                    ))
                )}
            </div>
        </PopoverSelect>
    );
};

export default PartnerInfo;
