import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { filterSearch, formatTimePartner } from 'redux/actions/utils';
import { setPartner } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { API_GET_PARTNERS } from 'redux/actions/apis';
import InfoCard from './common/InfoCard';
import DropdownCard from './DropdownCard';
import useFetchApi from 'hooks/useFetchApi';
import { OrderIcon, StarPurpleIcon, TimerIcon } from 'components/svg/SvgIcon';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import TagV2, { TYPES } from 'components/common/V2/TagV2';

export const PartnerSubcontent = ({ partner, t, language }) => {
    const totalOrder = partner?.analyticMetadata?.count || 0;
    const countRating = partner?.analyticMetadata?.countRating || 0;
    return (
        <div className="flex items-center gap-2 text-txtSecondary dark:text-txtSecondary-dark">
            {countRating > 0 && (
                <TagV2 icon={false} type={TYPES.WARNING}>
                    <div className="flex items-center text-sm gap-2 text-yellow-100">
                        <span>{partner?.analyticMetadata?.rating || 0}</span>
                        <StarPurpleIcon size={16} fill="currentColor" />
                        <span>({partner?.analyticMetadata?.countRating})</span>
                    </div>
                </TagV2>
            )}

            <TagV2 icon={false} type={TYPES.DEFAULT} className="dark:!bg-divider-dark">
                <div className="flex gap-2 items-center">
                    <div className="w-4 h-4">
                        <OrderIcon size={16} />
                    </div>
                    <span>
                        {totalOrder} {`${t('dw_partner:order')}${language === LANGUAGE_TAG.EN && totalOrder > 1 ? 's' : ''}`}
                    </span>
                </div>
            </TagV2>

            {totalOrder > 0 ? (
                <TagV2 icon={false} type={TYPES.DEFAULT} className="dark:!bg-divider-dark">
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4">
                            <TimerIcon size={16} />
                        </div>
                        <span>{formatTimePartner(t, partner?.analyticMetadata?.avgTime)}</span>
                    </div>
                </TagV2>
            ) : (
                <></>
            )}
        </div>
    );
};

const PartnerInfo = ({ quantity, assetId, side, language, loadingPartner, minimumAllowed, maximumAllowed, selectedPartner, t }) => {
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
            disabled={Boolean(!selectedPartner) || !partners || partners?.length <= 1}
            containerClassname="z-[41]"
            label={t('dw_partner:partner')}
            data={partners && filterSearch(partners, ['name', 'phone'], search)}
            search={search}
            setSearch={setSearch}
            showDropdownIcon={partners && partners?.length > 1}
            onSelect={(partner) => {
                dispatch(setPartner(partner));
            }}
            selected={{
                id: selectedPartner?._id,
                content: selectedPartner && {
                    mainContent: selectedPartner?.name?.toLowerCase(),
                    subContent: <PartnerSubcontent partner={selectedPartner} language={language} t={t} />,
                    imgSrc: selectedPartner?.avatar
                },
                item: (partner) =>
                    selectedPartner && (
                        <InfoCard
                            content={{
                                mainContent: partner && partner?.name?.toLowerCase(),
                                subContent: <PartnerSubcontent language={language} partner={partner} t={t} />,
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
