import { useCallback, useEffect, useState } from 'react';
import { formatStringNumber, formatNumber as formatWallet, setTransferModal } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { EarningIcon, PartnersIcon, PortfolioIcon } from 'components/svg/SvgIcon';

import { SECRET_STRING } from 'utils';

import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import AssetLogo from 'components/wallet/AssetLogo';
import { orderBy } from 'lodash';
import Skeletor from 'components/common/Skeletor';
import { WalletType } from 'redux/actions/const';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';
import HideSmallBalance from 'components/common/HideSmallBalance';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import EstBalance from 'components/common/EstBalance';
import NoData from 'components/common/V2/TableV2/NoData';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import Link from 'next/link';
import classNames from 'classnames';
import ExpandableTable from 'components/common/V2/TableV2/ExpandableTable';
import DefaultMobileView from 'components/common/DefaultMobileView';
import SvgChevronDown from 'components/svg/ChevronDown';
import { WalletCurrency } from 'utils/reference-utils';
import EarnPositionDetail from './OrderDetail';
import { getUserEarnBalance } from 'redux/actions/user';
import styled from 'styled-components';
import Button from 'components/common/V2/ButtonV2/Button';

const INITIAL_STATE = {
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null
};
const cacheInfo = {};

const Token = ({ symbol, subText }) => {
    const isGroup = typeof subText !== 'undefined' && subText !== null;

    return (
        <div className="flex space-x-2 items-center">
            <AssetLogo assetId={WalletCurrency[symbol]} size={32} />
            <div className="">
                <div className={classNames(isGroup ?'font-semibold' : '!font-normal')}>{symbol}</div>
                {subText && <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs">{subText}</div>}
            </div>
        </div>
    );
};

const EarnWallet = ({ allAssetValue, estBtc, estUsd, usdRate, isSmallScreen, isHideAsset, setIsHideAsset }) => {
    // Init State
    const [expandedRows, setExpandedRows] = useState({});
    const [position, setPosition] = useState();

    // Use Hooks
    const [currentTheme] = useDarkMode();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // table
    const columns = [
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('wallet:earn_wallet:table:coin')}</div>,
            dataIndex: 'coin',
            key: 'coin',
            width: 'auto',
            align: 'left',
            className: 'font-semibold md min-w-[280px]',
            render: (_, record) => {
                if (record.positions) {
                    const txCount = record.positions?.length || 0;
                    const subText = `${txCount} ${txCount > 1 ? t('wallet:earn_wallet:table:transactions') : t('wallet:earn_wallet:table:transaction')}`;
                    return <Token symbol={record.asset} subText={subText} />;
                } else if (record.rewardAsset) {
                    return (
                        <div className="ml-10 flex space-x-4 items-center">
                            <span className="text-base font-semibold">{t('wallet:earn_wallet:table:receive')}</span>
                            <Token symbol={record.rewardAsset} />
                        </div>
                    );
                }
                return '--';
            }
        },
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('wallet:earn_wallet:table:apr')}</div>,
            dataIndex: 'apr',
            key: 'apr',
            width: 'auto',
            className: 'min-w-[200px]',
            align: 'left',
            render: (val) => {
                let render = '--';
                switch (typeof val) {
                    case 'string': {
                        render = val;
                        break;
                    }
                    case 'number': {
                        render = `${+(val * 100).toFixed(2)}%`;
                        break;
                    }
                }
                return <div className="text-green-3 dark:text-green-2 font-semibold">{render}</div>;
            }
        },
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('wallet:earn_wallet:table:period')}</div>,
            dataIndex: 'duration',
            key: 'duration',
            width: 'auto',
            className: 'min-w-[200px]',
            align: 'left',
            render: (val) => {
                let render = '--';
                switch (typeof val) {
                    case 'string': {
                        render = val;
                        break;
                    }
                    case 'number': {
                        render = `${val} ${val > 1 ? t('common:days') : t('common:day')}`;
                        break;
                    }
                }
                return <div className="font-semibold">{render}</div>;
            }
        },
        {
            title: (
                <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base whitespace-nowrap">
                    {t('wallet:earn_wallet:table:amount')}
                </div>
            ),
            dataIndex: 'amount',
            key: 'amount',
            width: 'auto',
            className: '!whitespace-nowrap',
            align: 'left',
            sorter: (a, b) => {
                const aUsdVal = a.amount * (usdRate?.[WalletCurrency[a.asset]] || 1);
                const bUsdVal = b.amount * (usdRate?.[WalletCurrency[b.asset]] || 1);
                return bUsdVal - aUsdVal;
            },
            render: (val, record) => {
                const assetId = WalletCurrency[record.asset] || '';
                let assetInfo = cacheInfo[assetId];
                if (!assetInfo) {
                    assetInfo = assetConfig.find(({ id }) => id === assetId);
                    cacheInfo[assetId] = assetInfo;
                }

                return (
                    <div className="">
                        <div className="font-semibold">{`${isHideAsset ? SECRET_STRING : formatWallet(val, assetInfo?.assetDigit ?? 0)} ${record.asset}`}</div>
                        {record.positions && (
                            <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark">
                                ${isHideAsset ? SECRET_STRING : formatWallet(val * (usdRate?.[assetId] || 1), 2)}
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            title: (
                <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base whitespace-nowrap">
                    {t('wallet:earn_wallet:table:action')}
                </div>
            ),
            dataIndex: 'action',
            key: 'action',
            width: 174,
            className: 'min-w-[174px]',
            align: 'center'
        }
    ];

    const renderEstWallet = useCallback(() => {
        return (
            <div className="mt-[24px] md:mt-12 flex items-center justify-between">
                <div className="hidden md:flex rounded-full bg-gray-13 dark:bg-dark-2 w-[64px] h-[64px] items-center justify-center mr-6">
                    <EarningIcon size={32} />
                </div>
                <div>
                    <div className="t-common-v2">{isHideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)} BTC</div>
                    <div className="font-normal text-sm md:text-base mt-1">
                        {isHideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div>
            </div>
        );
    }, [isHideAsset, currentTheme, estUsd, estBtc]);

    const closePositionModal = () => {
        dispatch(getUserEarnBalance());
        setPosition(undefined);
    };

    return (
        <div>
            <div className="hidden md:block">
                <MCard addClass="mt-5 !p-8 rounded-xl bg-white shadow-card_light dark:bg-bgTabInactive-dark dark:border dark:border-divider-dark">
                    <div className="text-base flex justify-between items-end">
                        <div>
                            <EstBalance onClick={() => setIsHideAsset(!isHideAsset)} isHide={isHideAsset} isSmallScreen={isSmallScreen} />
                            {renderEstWallet()}
                        </div>

                        <div className="hidden md:block">
                            <div className="flex space-x-3 items-end justify-end h-full w-full ">
                                <Link href={'/earn'} passHref>
                                    <a className="block">
                                        <ButtonV2 className="px-6 py-3 !space-x-2 !font-semibold !text-base !w-auto">
                                            {t('wallet:earn_wallet:pool_list')}
                                        </ButtonV2>
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </MCard>

                <h3 className="mt-20 font-semibold text-2xl">{t('wallet:my_assets')}</h3>
                <TableWrapper>
                    <ExpandableTable
                        className="bg-bgContainer dark:bg-bgContainer-dark border dark:border-none border-divider rounded-xl mt-8 expandable-table shadow-card_light"
                        columns={columns}
                        data={allAssetValue}
                        expandable={{
                            childrenColumnName: 'positions',
                            expandIconColumnIndex: 4,
                            expandIcon: ({ record, expanded, onExpand }) =>
                                record.positions ? (
                                    <div
                                        className="w-full"
                                        onClick={(e) => {
                                            if (!expanded) {
                                                onExpand?.(record, e);
                                            }
                                        }}
                                    >
                                        <SvgChevronDown size={24} color="currentColor" className={classNames('m-auto', expanded && '!rotate-0')} />
                                    </div>
                                ) : (
                                    <Button variants="text" className="sm:!text-sm !p-0" onClick={() => setPosition(record)}>
                                        {t('wallet:earn_wallet:table:order_detail')}
                                    </Button>
                                ),
                            expandRowByClick: true,
                            onExpand: (expanded, record) => {
                                setExpandedRows((old) => ({ ...old, [record.key]: expanded }));
                            }
                        }}
                        emptyText={<NoData text={t('wallet:earn_wallet:table:no_data')} />}
                        rowClassName={(record) => classNames('border-bottom', expandedRows[record.key] && 'expanded')}
                        tableStyle={{
                            rowHeight: '72px',
                            fontSize: '1rem'
                        }}
                        sort={['amount']}
                    />
                </TableWrapper>
            </div>
            <div className="md:hidden">
                <DefaultMobileView className="!px-0" />
            </div>

            {position && <EarnPositionDetail onClose={closePositionModal} position={position} usdRate={usdRate} />}
        </div>
    );
};

const TableWrapper = styled('div')`
    .rc-table {
        .rc-table-expanded-row-fixed {
            min-height: 268px;
        }
        .rc-table-row-level-1 {
            td {
                height: 64px;
            }
        }
    }
`;

const ROW_LOADING_SKELETON = {
    asset: <Skeletor width={65} />,
    total: <Skeletor width={65} />,
    available: <Skeletor width={65} />,
    in_order: <Skeletor width={65} />,
    operation: <Skeletor width={125} />
};

export default EarnWallet;
