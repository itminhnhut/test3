import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import TableV2 from 'components/common/V2/TableV2';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { API_CONFIG_INSURANCE_RULE } from 'redux/actions/apis';
import colors from 'styles/colors';
import axios from 'axios';
import FetchApi from 'utils/fetch-api';
import { filterSearch, getSymbolObject } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import classNames from 'classnames';
import Tooltip from 'components/common/Tooltip';
import { useWindowSize } from 'utils/customHooks';
import { useTranslation } from 'next-i18next';

const ROWS_PER_PAGE = 10;

const MIN_MARGIN = 5;
const MIN_MAX_RATIO = {
    min: 2,
    max: 10
};

const InsuranceRules = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [currentTheme] = useDarkMode();
    const [rulesData, set] = useState({
        data: [],
        loading: true,
        maxPage: 1,
        page: 1
    });
    const [search, setSearch] = useState('');

    const setRulesData = (state) => set((prev) => ({ ...prev, ...state }));

    const { width } = useWindowSize();
    const containerRef = useRef(null);
    const [noDataContainerWidth, setNoDataContainerWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            const sourceWidth = containerRef.current.offsetWidth;
            setNoDataContainerWidth(sourceWidth);
        }
    }, [width]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        const fetchInsuranceRules = async () => {
            try {
                const data = await FetchApi({ url: API_CONFIG_INSURANCE_RULE, cancelToken: source.token });
                if (data) {
                    setRulesData({
                        data: data?.data || [],
                        loading: false,
                        maxPage: Math.ceil((data?.data?.length ?? 0) / ROWS_PER_PAGE)
                    });
                }
            } catch (error) {
                console.error('API_CONFIG_INSURANCE_RULE error:', error);
            }
        };
        fetchInsuranceRules();
        return () => source.cancel();
    }, []);

    const filterRulesData = useMemo(() => {
        const copiedData = [...rulesData.data];

        return filterSearch(copiedData, ['symbol'], search);
    }, [rulesData.data, search]);

    const columns = useMemo(
        () => [
            {
                key: 'symbol',
                dataIndex: 'symbol',
                title: t('common:asset'),
                align: 'left',
                fixed: 'left',
                width: 175,
                render: (symbol, item) => {
                    const symbolObject = getSymbolObject(symbol);
                    return (
                        <div className="flex space-x-2 items-center mb-2">
                            <AssetLogo assetCode={symbolObject?.baseAsset} size={24} useNextImg />
                            <span className="font-semibold">{symbol}</span>
                        </div>
                    );
                },
                className: 'custom-style'
            },
            {
                key: 'avg_changing',
                dataIndex: 'avg_changing',
                title: (
                    <span data-for="avg_changing_detail" data-tip="" className="inline-block nami-underline-dotted">
                        {t('futures:insurance.difference')}
                    </span>
                ),
                align: 'left',
                width: 262,
                render: (data, item) => {
                    return <div className="">{data * 100}%</div>;
                }
            },
            {
                key: 'max_leverage',
                dataIndex: 'max_leverage',
                title: <span className="inline-block ">{t('futures:insurance.max_leverage')}</span>,
                align: 'left',
                width: 262,
                render: (data, item) => {
                    return <div className="">{data}x</div>;
                }
            },
            {
                key: 'min_margin',
                dataIndex: 'min_margin',
                title: <span className="inline-block ">{t('futures:insurance.min_margin')}</span>,
                align: 'left',
                width: 262,
                render: (_) => {
                    return <div className="">{MIN_MARGIN} USDT</div>;
                }
            },
            {
                key: 'minmax_ratio',
                dataIndex: 'minmax_ratio',
                title: (
                    <span className="inline-block nami-underline-dotted" data-for="minmax_ratio" data-tip="">
                        {t('futures:insurance.min_max_margin_ratio')}
                    </span>
                ),
                align: 'left',
                width: 262,
                render: (_) => {
                    return (
                        <div className="">
                            {MIN_MAX_RATIO.min}%/{MIN_MAX_RATIO.max}%
                        </div>
                    );
                }
            }
        ],
        [t]
    );

    return (
        <div className={classNames('mt-10 sm:mt-20 mx-4 pb-[120px]')}>
            <Tooltip className="p-6 max-w-[247px] text-center" id="avg_changing_detail" place="top" effect="solid" isV3>
                {t('futures:insurance.difference_description')}
            </Tooltip>
            <Tooltip className="p-6 max-w-[247px] text-center" id="minmax_ratio" place="top" effect="solid" isV3>
                {t('futures:insurance.min_max_margin_ratio_description')}
            </Tooltip>
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="text-4xl font-semibold flex-1 ">{t('futures:insurance.insurance_rules_title')}</div>

                    <SearchBoxV2
                        wrapperClassname="max-w-[368px]"
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                    />
                </div>
                <Wrapper ref={containerRef} searchWidth={noDataContainerWidth} isDarkMode={currentTheme === THEME_MODE.DARK}>
                    <TableV2
                        useRowHover
                        data={filterRulesData}
                        columns={columns}
                        rowKey={(item) => `${item?.key}`}
                        loading={rulesData.loading}
                        limit={ROWS_PER_PAGE}
                        skip={1}
                        page={rulesData.page}
                        isSearch={search}
                        className="border border-divider dark:border-divider-dark rounded-xl pt-1"
                        unsetLeft={true}
                        shadowWithFixedCol={false}
                        rowClassName={'!h-[64px]'}
                        total={filterRulesData?.length ?? 0}
                        pagingPrevNext={{
                            page: rulesData.page,
                            hasNext: rulesData.page < rulesData.maxPage,
                            onChangeNextPrev: (e) => setRulesData({ page: rulesData.page + e }),
                            language
                        }}
                    />
                </Wrapper>
            </div>
        </div>
    );
};

export default InsuranceRules;

const Wrapper = styled.div`
    table {
        .custom-style:first-of-type {
            &::after {
                left: unset !important;
                right: 0px !important;
                visibility: visible !important;
                box-shadow: none !important;
                border-left: ${({ isDarkMode }) => ` 1px solid ${isDarkMode ? colors.divider.dark : colors.divider.DEFAULT} !important`};
            }
        }

        .rc-table-expanded-row-fixed {
            width: ${({ searchWidth }) => {
                return searchWidth;
            }}px !important;
            /* height: 506px !important; */
        }
    }
`;
