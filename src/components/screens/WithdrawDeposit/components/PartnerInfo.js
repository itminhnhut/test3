import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filterSearch, formatTimePartner } from 'redux/actions/utils';
import { setPartner } from 'redux/actions/withdrawDeposit';
import CheckCircle from 'components/svg/CheckCircle';
import { API_GET_PARTNERS } from 'redux/actions/apis';
import InfoCard from './common/InfoCard';
import DropdownCard from './DropdownCard';
import useFetchApi from 'hooks/useFetchApi';
import { OrderIcon, TimerIcon } from 'components/svg/SvgIcon';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import TabV2 from 'components/common/V2/TabV2';
import { orderBy } from 'lodash';

const FILTER_PARTNER = [
    { key: 1, localized: 'dw_partner:transaction_limit' },
    { key: 2, localized: 'dw_partner:processing_time' },
    { key: 3, localized: 'dw_partner:number_of_transactions' }
];

const MAX_PARTNER_DISPLAY = 10;

export const PartnerSubcontent = ({ partner, t, language }) => {
    const totalOrder = partner?.analyticMetadata?.count || 0;
    const countRating = partner?.analyticMetadata?.countRating || 0;
    return (
        <div className="flex items-center gap-2 text-txtSecondary dark:text-txtSecondary-dark">
            {/* {countRating > 0 && (
                <TagV2 icon={false} type={TYPES.WARNING}>
                    <div className="flex items-center text-sm gap-2 text-yellow-100">
                        <span>{partner?.analyticMetadata?.rating || 0}</span>
                        <StarPurpleIcon size={16} fill="currentColor" />
                        <span>({partner?.analyticMetadata?.countRating})</span>
                    </div>
                </TagV2>
            )} */}

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

const PartnerInfo = ({ quantity, assetId, side, language, loadingPartner, minimumAllowed, maximumAllowed, selectedPartner, t, isAutoSuggest = true }) => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [curFilter, setCurFilter] = useState(FILTER_PARTNER[0].key);

    const conditionToFetch = selectedPartner && minimumAllowed > 0 && maximumAllowed > 0 && +quantity >= minimumAllowed && +quantity <= maximumAllowed;

    const {
        data: partners,
        loading: loadingPartners,
        error
    } = useFetchApi(
        { url: API_GET_PARTNERS, params: { quantity: +quantity, assetId, side } },
        conditionToFetch,
        [conditionToFetch, quantity, assetId, side, isAutoSuggest],
        isAutoSuggest
    );

    useEffect(() => {}, [curFilter]);

    const searchPartner = partners && filterSearch(partners, ['name', 'phone'], search);

    let filteredPartner;
    if (searchPartner) {
        switch (curFilter) {
            case 1:
                filteredPartner =
                    searchPartner &&
                    orderBy(searchPartner, [`orderConfig.${side.toLowerCase()}${+assetId === 22 ? 'Usdt' : ''}.max`, 'name'], ['desc', 'asc']);
                break;
            case 2:
                filteredPartner =
                    searchPartner &&
                    orderBy(searchPartner, [(a) => (a?.analyticMetadata?.avgTime ? a.analyticMetadata.avgTime : undefined), 'name'], ['asc', 'asc']);
                break;
            case 3:
                filteredPartner = searchPartner && orderBy(searchPartner, ['analyticMetadata.count', 'name'], ['desc', 'asc']);
                break;
            default:
                break;
        }
        filteredPartner = filteredPartner.slice(0, MAX_PARTNER_DISPLAY)
    }

    return (
        <DropdownCard
            loadingList={loadingPartners}
            loading={loadingPartner}
            disabled={Boolean(!selectedPartner) || !partners || partners?.length <= 1}
            containerClassname="z-[41]"
            label={t('dw_partner:partner')}
            data={filteredPartner}
            search={search}
            setSearch={setSearch}
            showDropdownIcon={Boolean(selectedPartner) && partners && partners?.length > 1}
            onSelect={(partner) => {
                dispatch(setPartner(partner));
            }}
            selected={{
                id: selectedPartner?._id,
                content: selectedPartner && {
                    mainContent: selectedPartner?.name?.toLowerCase(),
                    subContent: <PartnerSubcontent partner={selectedPartner} language={language} t={t} />,
                    imgSrc: selectedPartner?.avatar,
                    contentClass: 'overflow-x-auto overflow-y-hidden pb-1'
                },
                emptyContent: {
                    subContent: isAutoSuggest && <span className="text-base">{t('dw_partner:auto_suggestion_des')}</span>
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
            filterChildren={
                <div className="flex items-center gap-3 mt-4 mb-2 flex-wrap">
                    <TabV2
                        variants="filter2"
                        isOverflow={true}
                        activeTabKey={curFilter}
                        // chipClassName="!bg-gray-12 dark:!bg-dark-2"
                        onChangeTab={(key) => setCurFilter(key)}
                        tabs={FILTER_PARTNER.map((item) => ({
                            key: item.key,
                            children: t(item.localized)
                        }))}
                    />
                </div>
            }
        />
    );
};

export default React.memo(PartnerInfo);
