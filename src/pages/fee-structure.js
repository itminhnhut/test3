import { IconTooltipMiddle, IconSort } from 'components/common/Icons';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Info } from 'react-feather';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';

import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import TableNoData from 'src/components/common/table/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import SearchInput from 'src/components/markets/SearchInput';
import AssetLogo from 'src/components/wallet/AssetLogo';
import { tableStyle } from 'src/config/tables';
import { getDepositConfig } from 'src/redux/actions/fee';

const FeeStructure = () => {
    const { t } = useTranslation();
    const [config, setConfig] = useState([]);
    const [filteredAssetList, setFilteredAssetList] = useState([]);
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const [loading, setLoading] = useState(true);

    const customAssetsStyle = {
        padding: '8px 16px',
        backgroundColor: 'white',
        border: 'none',
    };

    const customAssetsWrapperStyle = {
        border: 'none',
        backgroundColor: 'white',
        margin: 0,
        maxWidth: 240,
    };

    useAsync(async () => {
        const data = await getDepositConfig();
        setConfig(Object.values(data) || []);
        setFilteredAssetList(Object.values(data) || []);
        if (data) {
            setLoading(false);
        }
    }, []);

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                borderBottom: 'none !important',
                '&:nth-child(odd)': {
                    background: '#F6F9FC',
                },
                minHeight: '60px',
                padding: '12px 0',
            },
        },
        cells: {
            style: {
                fontSize: '0.875rem',
                lineHeight: '1.3125rem',
                fontWeight: '500 !important',
                color: '#02083D',
            },
        },
    };

    // console.log(config);

    const asset = (input) => {
        // console.log(input);
        if (assetConfig && assetConfig.length > 0) {
            return assetConfig.filter?.(ast => ast?.id === input?.assetId)?.[0];
        } return null;
    };

    const columns = useMemo(() => [
        {
            name: t('fee-structure:coin'),
            width: '300px',
            cell: (row) => {
                return (
                    <div className="flex flex-row items-center">
                        <AssetLogo size={36} assetCode={asset(row)?.assetCode} assetId={row?.id} />
                        <div className="flex flex-col ml-2">
                            <p className="font-bold">{asset(row)?.assetCode}</p>
                            <p className="text-[12px] text-[#8B8C9B] font-normal" style={{ lineHeight: '18px' }}>{asset(row)?.assetName}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            name: t('fee-structure:network'),
            width: '200px',
            cell: (row) => {
                return (
                    <div className="flex flex-col">
                        {row?.networkList?.map?.((network, index) => (
                            <p className="font-bold text-right" key={index}>{network?.name}</p>
                        ))}
                    </div>
                );
            },
            right: true,
        },
        {
            name: t('fee-structure:minWithdraw'),
            width: '200px',
            cell: (row) => {
                return (
                    <div className="flex flex-col">
                        {row?.networkList?.map?.((network, index) => (
                            <p className="font-bold text-right" key={index}>{network?.withdrawMin}</p>
                        ))}
                    </div>
                );
            },
            right: true,
        },
        {
            name: t('fee-structure:depositFee'),
            width: '200px',
            cell: (row) => 'Free',
            right: true,
        },
        {
            name: t('fee-structure:withdrawFee'),
            width: '200px',
            cell: (row) => {
                return (
                    <div className="flex flex-col" key={row?.assetId}>
                        {row?.networkList?.map?.((network, index) => (
                            <p className="font-bold text-right" key={index}>{network?.withdrawFee}</p>
                        ))}
                    </div>
                );
            },
            right: true,
        },
    ], [filteredAssetList]);

    const handleFilterAssetsList = (value) => {
        let filtered = [];
        if (value.length === 0) {
            filtered = [...config];
        } else {
            filtered = assetConfig.filter(ast => ast.assetCode.toLowerCase().includes(value.toLowerCase())).map(ast => {
                if (config && config.length > 0) {
                    return config.filter?.(a => a?.assetId === ast?.id)?.[0];
                } return null;
            });
        }
        setFilteredAssetList(filtered);
    };

    return (
        <LayoutWithHeader>
            <div className="relative container px-5 md:px-10">
                <p className="text-4xl text-[#02083D] font-bold mt-20 mb-8">{t('fee-structure:title')}</p>
                <div className="bg-white rounded-3xl px-10 box-border pb-4 mb-20">
                    <div className="flex flex-col mb-20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
                            <div className="py-10 border-b border-[#EEF2FA]">
                                <p className="text-xl text-[#02083D] font-bold">{t('fee-structure:trading_fee')}</p>
                                <p className="text-5xl text-[#4021D0] font-bold mt-6 mb-2">0.12%</p>
                                <p className="text-[#52535C]">{t('fee-structure:trading_fee_desc')}</p>
                            </div>
                            <div className="py-10 border-b border-[#EEF2FA]">
                                <p className="text-xl text-[#02083D] font-bold">{t('fee-structure:trading_fee_membership')}</p>
                                <p className="text-5xl text-[#4021D0] font-bold mt-6 mb-2">0.06%</p>
                                <p className="text-[#52535C]">{t('fee-structure:trading_fee_membership_desc')}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-10">
                            <div className="py-10 border-b border-[#EEF2FA] text-[#52535C]">
                                <p className="text-xl text-[#02083D] font-bold">{t('fee-structure:buying_vndc')}</p>
                                <p className="text-5xl text-[#4021D0] font-bold mt-6 mb-2">{t('fee-structure:buying_vndc_detail')}</p>
                                <p>{t('fee-structure:buying_vndc_desc')}</p>
                            </div>
                            <div className="py-10 border-b border-[#EEF2FA] text-[#52535C]">
                                <div className="text-xl text-[#02083D] font-bold inline-flex items-center">
                                    <p className="mr-1">{t('fee-structure:selling_vndc')}</p>
                                    <div className="relative flex items-center w-5 h-5">
                                        <div className="absolute group ml-1 cursor-help flex flex-col items-center justify-center">
                                            <Info size={16} color="#8B8C9B" />
                                            <div className="absolute top-3 z-10 hidden group-hover:flex text-white rounded-md">
                                                <div className="w-max">
                                                    <IconTooltipMiddle isReverse color="#515963" />
                                                    <p className="w-[302px] bg-[#515963] text-white text-xs text-left rounded py-3 px-4 bottom-full font-normal">
                                                        {t('fee-structure:selling_vndc_hint')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-5xl text-[#4021D0] font-bold mt-6 mb-2">{t('fee-structure:selling_vndc_detail')}</p>
                                <p>{t('fee-structure:selling_vndc_desc')}</p>
                            </div>
                        </div>
                        <div className="py-10 border-b border-[#EEF2FA]">
                            <p className="mb-10 text-[#02083D] text-xl font-bold">{t('fee-structure:deposit_withdraw_fee')}</p>
                            <p className="mb-10 text-[#52535C]">
                                {t('fee-structure:deposit_withdraw_fee_2')}
                            </p>
                            <SearchInput
                                placeholder={t('fee-structure:search')}
                                customStyle={customAssetsStyle}
                                customWrapperStyle={customAssetsWrapperStyle}
                                handleFilterAssetsList={handleFilterAssetsList}
                            />
                            <DataTable
                                data={filteredAssetList}
                                columns={columns}
                                noHeader
                                customStyles={customStyles}
                                overflowY // prevent clipping menu
                                noDataComponent={<TableNoData />}
                                sortIcon={<div className="mx-1"><IconSort /></div>}
                                className="ats-table"
                                style={{
                                    padding: 0,
                                    margin: 0,
                                }}
                                progressPending={loading}
                                progressComponent={<div className="mt-4"><TableLoader records={10} /></div>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'fee-structure']),
        },
    };
}

export default FeeStructure;
