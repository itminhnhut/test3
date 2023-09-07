import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import TableV2 from 'components/common/V2/TableV2';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { API_CONFIG_INSURANCE_RULE } from 'redux/actions/apis';
import colors from 'styles/colors';
import axios from 'axios';
import FetchApi from 'utils/fetch-api';
import { filterSearch, formatNumber, getSymbolObject } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import classNames from 'classnames';
import Tooltip from 'components/common/Tooltip';
import { useWindowSize } from 'utils/customHooks';
import { useTranslation } from 'next-i18next';
import Button from 'components/common/V2/ButtonV2/Button';
import Skeletor from 'components/common/Skeletor';
import TableMobileView from './TableMobileView';

const ROWS_PER_PAGE = 10;
export const MOBILE_ROWS_PER_PAGE = 5;

export const MIN_MAX_MARGIN = {
    min: 5,
    max: 10e3
};

export const MIN_MAX_RATIO = {
    min: 2,
    max: 10
};
const getColumns = (t) => [
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
            return <div className="">{formatNumber(data * 100, 2)}%</div>;
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
            return (
                <div className="">
                    {MIN_MAX_MARGIN.min}/{formatNumber(MIN_MAX_MARGIN.max)} USDT
                </div>
            );
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
];

const InsuranceRules = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [currentTheme] = useDarkMode();
    const [rulesData, set] = useState({
        data: [],
        loading: true,
        page: 1,
        mobileViewPage: 1
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
                        loading: false
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
        setRulesData({ page: 1, mobileViewPage: 1 });
        return filterSearch(copiedData, ['symbol'], search);
    }, [rulesData.data, search]);

    const maxPage = useMemo(() => {
        const isMobile = width <= 820;

        return Math.ceil((filterRulesData?.length ?? 0) / (isMobile ? MOBILE_ROWS_PER_PAGE : ROWS_PER_PAGE));
    }, [filterRulesData?.length, width]);

    return (
        <div className={classNames('mt-10 mb-20 px-4 mb:mb-[120px] mb:mt-20 ')}>
            {!rulesData.loading && (
                <>
                    <Tooltip className="p-6 max-w-[247px] text-center" id="avg_changing_detail" place="top" effect="solid" isV3>
                        {t('futures:insurance.difference_description')}
                    </Tooltip>
                    <Tooltip className="p-6 max-w-[247px] text-center" id="minmax_ratio" place="top" effect="solid" isV3>
                        {t('futures:insurance.min_max_margin_ratio_description')}
                    </Tooltip>
                </>
            )}
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                <div className="flex items-center justify-between gap-6 flex-wrap mb-10 mb:mb-8">
                    <div className="text-xl mb:text-4xl font-semibold ">{t('futures:insurance.insurance_rules_title')}</div>

                    <SearchBoxV2
                        wrapperClassname="w-full h-11 mb:h-[50px] mb:max-w-[368px]"
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                    />
                </div>
                <div className="mb:hidden">
                    <div className="space-y-8 mb-6">
                        <TableMobileView
                            filterRulesData={filterRulesData}
                            page={rulesData.mobileViewPage}
                            loading={rulesData.loading}
                            isSearch={Boolean(search)}
                        />
                    </div>
                    {rulesData.mobileViewPage < maxPage && (
                        <Button variants="text" className="!h-9" onClick={() => setRulesData({ mobileViewPage: rulesData.mobileViewPage + 1 })}>
                            {t('common:ext_gate.see_more')}
                        </Button>
                    )}
                </div>
                <Wrapper className="hidden mb:block" ref={containerRef} searchWidth={noDataContainerWidth} isDarkMode={currentTheme === THEME_MODE.DARK}>
                    <TableV2
                        useRowHover
                        data={filterRulesData}
                        columns={getColumns(t)}
                        rowKey={(item) => `${item?.key}`}
                        loading={rulesData.loading}
                        sort={['symbol', 'avg_changing', 'max_leverage']}
                        limit={ROWS_PER_PAGE}
                        page={rulesData.page}
                        isSearch={search}
                        className="border border-divider dark:border-divider-dark rounded-xl pt-1"
                        unsetLeft={true}
                        shadowWithFixedCol={false}
                        rowClassName={'!h-[64px]'}
                        total={filterRulesData?.length ?? 0}
                        pagingPrevNext={{
                            page: rulesData.page,
                            hasNext: rulesData.page < maxPage,
                            onChangeNextPrev: (e) => {
                                setRulesData({ page: rulesData.page + e });
                            },
                            language
                        }}
                        initPage={1}
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
