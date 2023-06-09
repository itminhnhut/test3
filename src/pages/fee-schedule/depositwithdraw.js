import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { API_GET_WALLET_CONFIG } from 'redux/actions/apis';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { dwLinkBuilder, formatNumber, walletLinkBuilder } from 'redux/actions/utils';
import { BREAK_POINTS } from 'constants/constants';
import { ApiStatus, WalletType } from 'redux/actions/const';
import { useRouter } from 'next/router';
import { EXCHANGE_ACTION } from 'pages/wallet';

import withTabLayout, { TAB_ROUTES } from 'components/common/layouts/withTabLayout';
import useWindowSize from 'hooks/useWindowSize';
import SearchBox from 'components/common/SearchBox';
import SearchBoxV2 from 'components/common/SearchBoxV2';

import Skeletor from 'components/common/Skeletor';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import TableV2 from 'components/common/V2/TableV2';
import MCard from 'components/common/MCard';
import Empty from 'components/common/Empty';
import Axios from 'axios';
import AssetLogo from 'components/wallet/AssetLogo';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useSelector } from 'react-redux';
import WithdrawDepositList from 'components/screens/FeeSchedule/WithdrawDepositList';
import NoResult from 'components/screens/Support/NoResult';
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const INITIAL_STATE = {
    search: '',
    currentPage: 1,
    configs: null,
    loadingConfigs: false
};

const DepositWithdrawFee = () => {
    // Init state
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Rdx
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs);

    // Use hooks
    const router = useRouter();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();

    // Helper
    const getConfig = async () => {
        setState({ loadingConfigs: true });

        try {
            const { data } = await Axios.get(API_GET_WALLET_CONFIG);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                const configs = Object.values(data.data);
                // .filter(e => e.allowWithdraw.includes(true))
                setState({ configs });
            }
        } catch (e) {
            console.log(`Can't get withdraw config `, e);
        } finally {
            setState({ loadingConfigs: false });
        }
    };

    // Render Handler
    const renderTable = useCallback(() => {
        let data;
        let tableStatus;

        const rawData = paymentConfigs?.filter((e) => e.assetCode?.toLowerCase().includes(state.search?.toLowerCase()));

        const columns = [
            {
                key: 'assetCode',
                dataIndex: 'assetCode',
                title: t('fee-structure:asset'),
                width: '20%',
                // fixed: 'left',
                align: 'left',
                // preventSort: true
                render: (row, item) => (
                    <div className="flex items-center ml-3">
                        <AssetLogo assetCode={item?.assetCode} size={width >= BREAK_POINTS['2xl'] ? 32 : 24} />
                        <span className="ml-2.5 text-base font-semibold">{item?.assetCode}</span>
                    </div>
                )
            },
            {
                key: 'network',
                dataIndex: 'network',
                title: t('wallet:network'),
                width: '20%',
                align: 'left',
                preventSort: true,
                render: (row, item) => (
                    <div>
                        {item?.networkList?.map((network, index) => (
                            <div key={`network__${index}`} className="mb-1 text-base last:mb-0">
                                {network?.name}
                            </div>
                        ))}
                    </div>
                )
            },
            // {
            //     key: 'deposit_fee',
            //     dataIndex: 'deposit_fee',
            //     title: t('wallet:deposit_fee'),
            //     width: '20%',
            //     align: 'left',
            //     preventSort: true,
            //     render: () => <span className="text-base text-dominant">{t('common:free')}</span>
            // },

            // {
            //     key: 'min_withdraw',
            //     dataIndex: 'min_withdraw',
            //     title: t('wallet:min_withdraw'),
            //     width: '20%',
            //     align: 'right',
            //     preventSort: true,
            //     render: (row, item) => {
            //         const assetDigit = state.configs?.find((o) => o.assetCode === item?.assetCode)?.assetDigit;
            //         return (
            //             <div>
            //                 {item?.networkList?.map((network, index) => (
            //                     <div key={`minWithdraw__${index}`} className="mb-1 text-base last:mb-0">
            //                         {formatNumber(network?.withdrawMin, assetDigit, network?.withdrawMin === 0 ? 6 : 0)}
            //                     </div>
            //                 ))}
            //             </div>
            //         );
            //     }
            // },
            {
                key: 'withdraw_fee',
                dataIndex: 'withdraw_fee',
                title: t('common:fee'),

                width: '20%',
                align: 'right',
                preventSort: true,
                render: (row, item) => {
                    const assetDigit = state.configs?.find((o) => o.assetCode === item?.assetCode)?.assetDigit;
                    const sortedNetworkList = item?.networkList.sort((a, b) => parseFloat(a.withdrawFee) - parseFloat(b.withdrawFee));
                    return (
                        <div className="mr-3">
                            {sortedNetworkList.map((network, index) => (
                                <div key={`withdrawFee__${index}`} className={index === item?.withdrawFee?.length - 1 ? ' text-base' : 'mb-1 text-base'}>
                                    {formatNumber(network?.withdrawFee, assetDigit, network?.withdrawFee === 0 ? 6 : 0)}
                                </div>
                            ))}
                        </div>
                    );
                }
            }
        ];

        if (state.loadingConfigs) {
            const skeleton = [];
            for (let i = 0; i < ROW_LIMIT; ++i) {
                skeleton.push({ ...ROW_SKELETON, key: `asset__skeleton__${i}` });
            }
            data = skeleton;
        } else {
            // const _data = [];
            // rawData?.forEach((raw) => {
            //     const assetDigit = state.configs?.find((o) => o.assetCode === raw?.assetCode)?.assetDigit;
            //     _data.push({
            //         raw,
            //         key: `asset_depwdl__item__${raw?.assetCode}`,
            //         asset: (
            //             <div className="flex items-center">
            //                 <AssetLogo assetCode={raw?.assetCode} size={width >= BREAK_POINTS['2xl'] ? 32 : 24} />
            //                 <span className="ml-2.5 text-base font-semibold">{raw?.assetCode}</span>
            //             </div>
            //         ),
            //         // fullName: <span className="text-base">{raw?.assetFullName || raw?.assetCode}</span>,
            //         network: (
            //             <div>
            //                 {raw?.networkList?.map((network, index) => (
            //                     <div key={`network__${index}`} className="mb-1 text-base last:mb-0">
            //                         {network?.name}
            //                     </div>
            //                 ))}
            //             </div>
            //         ),
            //         min_withdraw: (
            //             <div>
            //                 {raw?.networkList?.map((network, index) => (
            //                     <div key={`minWithdraw__${index}`} className="mb-1 text-base last:mb-0">
            //                         {formatNumber(network?.withdrawMin, assetDigit, network?.withdrawMin === 0 ? 6 : 0)}
            //                     </div>
            //                 ))}
            //             </div>
            //         ),
            //         deposit_fee: <span className="text-base text-dominant">{t('common:free')}</span>,
            //         withdraw_fee: (
            //             <div>
            //                 {raw?.networkList?.map((network, index) => (
            //                     <div key={`withdrawFee__${index}`} className={index === raw?.withdrawFee?.length - 1 ? ' text-base' : 'mb-1 text-base'}>
            //                         {formatNumber(network?.withdrawFee, assetDigit, network?.withdrawFee === 0 ? 6 : 0)}
            //                     </div>
            //                 ))}
            //             </div>
            //         ),
            //         [RETABLE_SORTBY]: {
            //             asset: raw?.assetCode,
            //             fullName: raw?.assetFullName || raw?.assetCode
            //         }
            //     });
            // });
            // data = _data;
        }

        if (!data?.length) {
            tableStatus = <NoResult text={t('common:no_results_found')} />; //<Empty />;
        }

        return (
            <>
                <ReTable
                    sort
                    useRowHover
                    data={rawData}
                    emptyText={tableStatus}
                    columns={columns}
                    rowKey={(item) => item?.key}
                    scroll={{ x: true }}
                    onRow={(record, index) => {
                        return {
                            onClick: () =>
                                router.push(
                                    // walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, {
                                    //     type: 'crypto',
                                    //     asset: record?.raw?.assetCode || record?.assetCode
                                    // })
                                    dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, record?.raw?.assetCode || record?.assetCode)
                                )
                        };
                    }}
                    tableStyle={{
                        paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                        tableStyle: { minWidth: '992px !important' },
                        headerStyle: {},
                        rowStyle: { padding: '16px !important' },
                        shadowWithFixedCol: width <= BREAK_POINTS.lg,
                        noDataStyle: {
                            minHeight: '280px'
                        }
                    }}
                    paginationProps={{
                        current: state.currentPage,
                        pageSize: ROW_LIMIT,
                        onChange: (currentPage) => {
                            window.document.getElementById('deposit_withdraw_table').scrollIntoView({
                                behavior: 'smooth'
                            });

                            setState({ currentPage });
                        }
                    }}
                />
            </>
        );
    }, [paymentConfigs, state.search, state.configs, state.currentPage, state.loadingConfigs, width, router]);

    const renderSearchBox = useCallback(() => {
        return (
            <SearchBoxV2
                value={state.search}
                placeholder={`${t('common:search')}...`}
                onChange={(value) => {
                    setState({ search: value });
                }}
                // width
            />
        );
    }, [state.search]);

    const renderNotes = useCallback(() => {
        if (language === LANGUAGE_TAG.VI) {
            return (
                <>
                    - Với mỗi lần rút tài sản số, người dùng sẽ cần trả một khoản phí giao dịch để xử lý lệnh theo tỷ lệ được quyết định bởi blockchain
                    {width >= BREAK_POINTS.sm && <br />}- Tỷ lệ phí rút có thể thay đổi liên tục do đặc thù của mỗi blockchain
                    {width >= BREAK_POINTS.sm && <br />}- Vui lòng kiểm tra kỹ thông tin về phí giao dịch khi thực hiện lệnh rút mỗi loại tài sản số
                </>
            );
        } else {
            return (
                <>
                    - With each withdrawal of tokens, users will need to pay a transaction fee to process the order according to the rate decided by the
                    blockchain
                    {width >= BREAK_POINTS.sm && <br />}- The rate of withdrawal fees is subject to change continuously due to the peculiarities of each
                    blockchain
                    {width >= BREAK_POINTS.sm && <br />}- Please check carefully the transaction fee information when making a withdrawal order for each token
                </>
            );
        }
    }, [width, language]);

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <div className="mt-10 md:mt-20">
            <div className="text-[20px] md:text-[2rem] leading-8 font-semibold">{t('fee-structure:depwdl_fee')}</div>
            <div className="md:mt-3 mt-4  text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark">{renderNotes()}</div>

            <div className="w-full md:max-w-[23rem] mt-7 lg:mt-20">{renderSearchBox()}</div>
            {width > BREAK_POINTS.md ? (
                <div id="deposit_withdraw_table" className="mt-8 overflow-hidden border border-divider dark:border-divider-dark rounded-xl ">
                    {renderTable()}
                </div>
            ) : (
                <WithdrawDepositList t={t} paymentConfigs={paymentConfigs} search={state.search} configs={state.configs} />
            )}
        </div>
    );
};

const ROW_LIMIT = 10;

const ROW_SKELETON = {
    asset: <Skeletor width={65} />,
    fullName: <Skeletor width={65} />,
    network: <Skeletor width={65} />,
    min_withdraw: <Skeletor width={65} />,
    deposit_fee: <Skeletor width={65} />,
    withdraw_fee: <Skeletor width={65} />
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'fee-structure', 'wallet', 'dw_partner']))
    }
});

export default withTabLayout({ routes: TAB_ROUTES.FEE_STRUCTURE, containerClassname: 'px-4 md:pt-20 fee-schedule !-mb-4' })(DepositWithdrawFee);
