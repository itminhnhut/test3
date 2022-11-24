import React, { useMemo, useState, useEffect, useRef, Fragment } from 'react';
import CollapsibleRefCard, { FilterContainer, FilterIcon } from '../CollapsibleRefCard';
import AssetLogo from 'components/wallet/AssetLogo';
import { formatNumber, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { FilterTabs, Line, RefButton } from '..';
import PopupModal from '../PopupModal';
import DatePicker from '../../../common/DatePicker/DatePicker';
import fetchApi from 'utils/fetch-api';
import { API_GET_COMMISSON_HISTORY } from 'redux/actions/apis';
import { WalletCurrency } from '../../OnusWithdrawGate/helper';
import { IconLoading } from 'src/components/common/Icons';
import colors from 'styles/colors';
import TableNoData from 'src/components/common/table.old/TableNoData';
import RePagination from 'components/common/ReTable/RePagination';
const title = {
    vi: 'Lịch sử hoàn phí hoa hồng',
    en: 'Commission history'
};

const CommissionHistory = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const levelTabs = [
        { title: t('common:all'), value: null },
        { title: '01', value: 1 },
        { title: '02', value: 2 },
        { title: '03', value: 3 },
        { title: '04', value: 4 },
        { title: '05', value: 5 }
    ];
    const typeTabs = [
        { title: t('common:all'), value: null },
        { title: 'Spot', value: 'SPOT' },
        { title: 'Futures', value: 'FUTURES' }
    ];
    const assetTabs = [
        { title: t('common:all'), value: null },
        { title: 'VNDC', value: WalletCurrency.VNDC },
        { title: 'USDT', value: WalletCurrency.USDT },
        { title: 'NAO', value: WalletCurrency.NAO },
        { title: 'NAMI', value: WalletCurrency.NAMI },
        { title: 'ONUS', value: WalletCurrency.ONUS }
    ];

    const [dataSource, setDataSource] = useState({
        results: [],
        total: 0
    });
    const [loading, setLoading] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({
        kind: typeTabs[0].value,
        level: levelTabs[0].value,
        currency: assetTabs[0].value,
        range: {
            startDate: null,
            endDate: new Date(''),
            key: 'selection'
        }
    });

    const getCommissonHistory = async () => {
        const params = { ...filter };
        if (params.range.startDate) {
            params.from = new Date(params.range.startDate).getTime();
            params.to = new Date(params.range.endDate).getTime();
        }
        delete params.range;
        try {
            const { data } = await fetchApi({
                url: API_GET_COMMISSON_HISTORY,
                params: {
                    ...params,
                    limit: 6,
                    skip: 6 * (page - 1)
                }
            });
            if (data) {
                setDataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCommissonHistory();
    }, [filter, page]);

    return (
        <div className="px-4 w-screen"   >
            {/* {showAllData && (
                <AllDataModal
                    onClose={() => setShowAllData(false)}
                    language={language}
                    isAll
                    dataSource={dataSource}
                    typeTabs={typeTabs}
                    levelTabs={levelTabs}
                    assetTabs={assetTabs}
                    filter={filter}
                    setFilter={setFilter}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    loading={loading}
                    setShowAllData={setShowAllData}
                />
            )} */}
            <ListData
                dataSource={dataSource.results}
                total={dataSource.total}
                page={page}
                setPage={setPage}
                typeTabs={typeTabs}
                levelTabs={levelTabs}
                assetTabs={assetTabs}
                filter={filter}
                setFilter={setFilter}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                loading={loading}
            />
        </div>
    );
};

const FilterModal = ({ isVisible, onClose, onConfirm, t, filter, levelTabs, typeTabs, assetTabs }) => {
    const [state, setState] = useState(filter);
    const onChange = (key, value) => {
        setState({ ...state, [key]: value });
    };

    const _onConfirm = () => {
        onConfirm(state);
    };

    return (
        <PopupModal isVisible={isVisible} onBackdropCb={onClose} title="Lọc kết quả" useAboveAll>
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-1 font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.referral_date')}</div>
                    <DatePicker date={state.range} onChange={(e) => onChange('range', e.selection)} />
                </div>
                <div className="flex flex-col space-y-3  font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.level')}</div>
                    <div className="flex">
                        <FilterTabs className="!px-4 !py-3 !font-medium !text-sm" tabs={levelTabs} type={state.level} setType={(e) => onChange('level', e)} />
                    </div>
                </div>
                <div className="flex flex-col space-y-3  font-medium text-sm leading-6 text-gray-1">
                    <div>{t('reference:referral.commission_type')}</div>
                    <div className="flex">
                        <FilterTabs className="!px-4 !py-3 !font-medium !text-sm" tabs={typeTabs} type={state.kind} setType={(e) => onChange('kind', e)} />
                    </div>
                </div>
                <div className="flex flex-col space-y-3  font-medium text-sm leading-6 text-gray-1 mb-4">
                    <div>{t('reference:referral.asset_type')}</div>
                    <div className="flex overflow-auto no-scrollbar">
                        <FilterTabs
                            className="!px-4 !py-3 !font-medium !text-sm whitespace-nowrap"
                            tabs={assetTabs}
                            type={state.currency}
                            setType={(e) => onChange('currency', e)}
                        />
                    </div>
                </div>
                <RefButton onClick={_onConfirm} title={t('common:confirm')} />
            </div>
        </PopupModal>
    );
};

const ListData = ({ page, setPage, total, dataSource, typeTabs, levelTabs, assetTabs, filter, setFilter, showFilter, setShowFilter, loading, isAll }) => {
    const { t } = useTranslation();

    const onConfirm = (e) => {
        setFilter(e);
        setShowFilter(false);
    };



    const general = useMemo(() => {
        return {
            kind: typeTabs.find((rs) => rs.value === filter.kind)?.title,
            range: filter.range.startDate ? formatTime(filter.range.startDate, 'dd/MM/yyyy') + ' - ' + formatTime(filter.range.endDate, 'dd/MM/yyyy') : null,
            level: levelTabs.find((rs) => rs.value === filter.level)?.title,
            currency: assetTabs.find((rs) => rs.value === filter.currency)?.title
        };
    }, [filter, t]);

    const dataFilter = useMemo(() => {
        return isAll ? dataSource : dataSource.slice(0, 10);
    }, [dataSource, isAll]);

    return (
        <>
            {showFilter && (
                <FilterModal
                    isVisible={showFilter}
                    onClose={() => setShowFilter(false)}
                    onConfirm={onConfirm}
                    t={t}
                    filter={filter}
                    levelTabs={levelTabs}
                    typeTabs={typeTabs}
                    assetTabs={assetTabs}
                />
            )}
            <CollapsibleRefCard title={t('reference:referral.commission_histories')} wrapperClassName={isAll ? '!p-0' : ''} isTitle={!isAll}>
                <div className="w-auto">
                    <div className="flex flex-wrap gap-2">
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            <FilterIcon /> {t('common:filter')}
                        </FilterContainer>
                        {general.range && <FilterContainer onClick={() => setShowFilter(true)}>Thời gian: {general.range}</FilterContainer>}
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            {t('reference:referral.level')}: {general.level}
                        </FilterContainer>
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            {t('reference:referral.commission_type')}: {general.kind}
                        </FilterContainer>
                        <FilterContainer onClick={() => setShowFilter(true)}>
                            {t('reference:referral.asset_type')}: {general.currency}
                        </FilterContainer>
                    </div>
                </div>
                <div className="mt-6">
                    {dataSource.length <= 0 && !loading ? (
                        <TableNoData  className='h-[300px]' title={t('reference:referral.no_commission')}/>
                    ) : (
                        dataFilter?.map((data, index) => {
                            const asset = typeTabs.find((rs) => rs.value === data.kind)?.title;
                            return (
                                <Fragment key={index}>
                                    <div className="flex items-center space-x-2">
                                        <AssetLogo size={36} assetId={data.currency} />
                                        <div className="flex flex-col w-full">
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold text-sm leading-6 text-darkBlue">
                                                    {t('broker:your_commission')} ({t('common:level', { level: data?.level })})
                                                </div>
                                                <div className="text-teal font-semibold text-sm leading-6">+{formatNumber(data.value, 0)} USDT</div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium text-xs text-gray-1">{formatTime(data.createdAt, 'yyyy-MM-dd hh:mm:ss')}</div>
                                                <div className="font-medium text-xs text-gray-1">
                                                    {t('broker:commission_type')}: {asset}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {dataSource.length !== index + 1 && <Line className="my-4" />}
                                </Fragment>
                            );
                        })
                    )}
                </div>
                {/* {dataSource.length > 10 && !isAll && (
                    <div className="mt-6 text-center text-sm font-medium text-teal underline" onClick={() => onShowAll()}>
                        {loading ? <IconLoading color={colors.teal} /> : t('common:show_more')}
                    </div>
                )} */}
                <div className='w-full flex justify-center items-center mt-8'>
                    <RePagination
                        total={total}
                        pageSize={6}
                        current={page}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            </CollapsibleRefCard>
        </>
    );
};

const AllDataModal = ({ onClose, language, ...props }) => {
    return (
        <PopupModal isVisible={true} onBackdropCb={onClose} title={title[language]} useFullScreen>
            <ListData {...props} />
        </PopupModal>
    );
};

export default CommissionHistory;
