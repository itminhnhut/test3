import { useCallback, useState, useMemo, useEffect } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation, Trans } from 'next-i18next';

// * Context
import { useLoanableList, useCollateralList } from 'components/screens/Lending/Context';

// ** Redux
import { WalletType } from 'redux/actions/const';
import { useSelector, useDispatch } from 'react-redux';
import { formatNumber, setTransferModal } from 'redux/actions/utils';

//** components
import Chip from 'components/common/V2/Chip';
import Tooltip from 'components/common/Tooltip';
import CheckBox from 'components/common/CheckBox';
import ModalV2 from 'components/common/V2/ModalV2';
import InputV2 from 'components/common/V2/InputV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';

// ** Third party
import classNames from 'classnames';
import { find } from 'lodash';

// ** Dynamic
const ConfirmLoan = dynamic(() => import('./ConfirmLoan'), { ssr: false });
const AssetLendingFilter = dynamic(() => import('components/screens/Lending/components/AssetLendingFilter'), { ssr: false });

// ** CONSTANTS
import {
    LTV,
    PROFITS,
    PERCENT,
    LOANABLE,
    COLLATERAL,
    BORROWING_TERM,
    ALLOW_LTV_TOOLTIP,
    DEFAULT_LOANABLE_ASSET,
    DEFAULT_COLLATERAL_ASSET
} from 'components/screens/Lending/constants';

// loanable: { assetCode: 'VNST', assetName: 'VNST', id: 39 },
// collateral: { assetCode: 'BNB', assetName: 'BNB', id: 40 }

// ** INIT DATA
const INIT_DATA = {
    borrowing_term: 7,
    rule: false,
    isConfirm: false,
    filter: {
        loanable: {},
        collateral: {}
    },
    selectLoanAsset: { loanable: [], collateral: [] }
};

const ModalRegisterLoan = ({ isModal, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useRedux
    const dispatch = useDispatch();

    const wallets = useSelector((state) => state.wallet.SPOT);
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // ** useContext
    const { loanCoin, loanable } = useLoanableList();
    const { collateralCoin, collateral } = useCollateralList();

    // ** useState
    const [rule, setRule] = useState(INIT_DATA.rule);
    const [filter, setFilter] = useState(INIT_DATA.filter);
    const [isConfirm, setIsConfirm] = useState(INIT_DATA.false);
    const [borrowingTerm, setBorrowingTerm] = useState(INIT_DATA.borrowing_term);
    const [selectLoanAsset, setSelectLoanAsset] = useState(INIT_DATA.selectLoanAsset);

    useEffect(() => {
        handleSelectLoanAsset(loanCoin, LOANABLE, loanable); // ** get data select loanable
        handleSelectLoanAsset(collateralCoin, COLLATERAL, collateral); // ** get data select collateral
    }, []);

    // ** handle
    const handleToggleConfirm = () => setIsConfirm((prev) => !prev);
    const handleBorrowingTermClick = useCallback(
        (value) => {
            setBorrowingTerm(value);
        },
        [borrowingTerm]
    );
    const onChangeRule = () => setRule((prev) => !prev);

    const onChangeAsset = (value, key) => {
        if (value) {
            setFilter((prev) => ({ ...prev, [key]: value }));
        } else {
            getDefaultSelect({ data: selectLoanAsset?.[key], key, keyDefault: key === LOANABLE ? DEFAULT_LOANABLE_ASSET : DEFAULT_COLLATERAL_ASSET });
        }
    };

    // ** handle data select loan asset
    const handleSelectLoanAsset = (data, key, dataLoanAsset) => {
        const keyFind = key === LOANABLE ? 'loanCoin' : 'collateralCoin';
        const rs = tempFromAssetList.reduce((prev, cur) => {
            if (data.includes(cur.assetCode)) {
                const rsByKey = dataLoanAsset?.find((f) => f?.[keyFind] === cur.assetCode);
                prev = [...prev, { config: rsByKey, ...cur }];
            }
            return prev;
        }, []);

        // ** set data select
        setSelectLoanAsset((prev) => ({ ...prev, [key]: rs }));
        getDefaultSelect({ data: rs, key, keyDefault: key === LOANABLE ? DEFAULT_LOANABLE_ASSET : DEFAULT_COLLATERAL_ASSET });
    };

    // ** get data default select
    const getDefaultSelect = ({ data, key, keyDefault }) => {
        const rsByAssetCode = data?.find((f) => f?.assetCode === keyDefault);
        setFilter((prev) => ({ ...prev, [key]: rsByAssetCode }));
    };

    // ** get data
    const tempFromAssetList = useMemo(() => {
        return Object.keys(wallets)?.map((key) => {
            const curAssetWalletData = wallets[key];
            return {
                // assetId: key,
                ...find(assetConfig, { id: +key }),
                available: curAssetWalletData.value - curAssetWalletData.locked_value,
                ...curAssetWalletData
            };
        });
    }, [wallets]);

    const totalSPOT = useMemo(() => {
        return tempFromAssetList?.find((asset) => asset.assetCode === filter.collateral?.assetCode);
    }, [filter.collateral?.id, tempFromAssetList]);

    console.log(useSelector((state) => console.log(state)));
    // ** render
    const renderProfit = () => {
        return (
            <section className="flex flex-col gap-3 mt-8">
                {PROFITS.map((profit, key) => {
                    return (
                        <section className="flex justify-between" key={`profit_${key}_${profit.title?.[language]}`}>
                            <div className="dark:text-gray-7 text-gray-1">{profit.title?.[language]}</div>
                            <div className="dark:text-gray-4 text-gray-15 font-semibold">- {profit.asset}</div>
                        </section>
                    );
                })}
            </section>
        );
    };

    // ** handle total ltv
    const totalLTV = useMemo(() => {
        const { initialLTV = 0, marginCallLTV = 0, liquidationLTV = 0 } = filter.collateral?.config || {};
        return { initialLTV, marginCallLTV, liquidationLTV };
    }, [filter.collateral?.assetCode]);

    const renderLTV = () => {
        const data = {
            ltv_initial: totalLTV.initialLTV * PERCENT,
            ltv_margin: totalLTV.marginCallLTV * PERCENT,
            ltv_liquidate: totalLTV.liquidationLTV * PERCENT
        };
        return (
            <section className="flex flex-row mt-4">
                {LTV.map((item, key) => {
                    return (
                        <section className="h-6 flex flex-row" key={`ltv_${key}_${item.title?.[language]}`}>
                            <section className="border-b border-darkBlue-5 border-dashed cursor-pointer flex flex-row" data-tip="" data-for={item.key}>
                                <section className="dark:text-gray-7 text-gray-1">{item.title?.[language]}:</section>
                                <section className="dark:text-gray-4 text-gray-15 ml-1">{data?.[item.key] || '-'}%</section>
                            </section>
                            {key !== 2 ? <div className="mx-2 dark:text-gray-7 text-gray-1">/</div> : null}
                        </section>
                    );
                })}
            </section>
        );
    };

    const renderRules = () => {
        return (
            <section className="mt-8">
                <CheckBox
                    isV3
                    onChange={onChangeRule}
                    active={rule}
                    className="h-full"
                    labelClassName="!text-base"
                    boxContainerClassName="w-6 h-6"
                    label={
                        <Trans i18nKey="lending:lending:rule">
                            <a className="text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer font-semibold" href="#" />
                        </Trans>
                    }
                />
            </section>
        );
    };

    const renderTooltip = () => {
        return (
            <Tooltip
                isV3
                place="top"
                id="loan_term"
                effect="solid"
                className="max-w-[527px] dark:after:!border-t-[#2e333d] after:!border-t-[#e1e2e3] after:!left-[auto] !px-6 !py-3 !bg-gray-11 dark:!bg-dark-1  dark:!text-gray-7 !text-gray-1 !text-sm"
                overridePosition={({ top }) => {
                    return { left: 32, top };
                }}
            >
                <>
                    <div>
                        Mỗi thời hạn vay có thời gian trả chậm cho phép, phí trả chậm trong trường hợp này bằng 3 lần lãi vay. Thời gian trả chậm cho phép:
                    </div>
                    <ul className="list-disc px-4">
                        <li>Kỳ hạn 7 ngày: Trả chậm tối đa 72h</li>
                        <li>Kỳ hạn 30 ngày: Trả chậm tối đa 168h</li>
                    </ul>
                    <div>Nếu vượt quá thời gian trả chậm cho phép, sàn sẽ thanh lý tài sản ký quỹ của user với phí thanh lý là 2% của tổng dư nợ.</div>
                </>
            </Tooltip>
        );
    };

    const renderTooltipLTV = () => {
        return (
            <>
                {ALLOW_LTV_TOOLTIP.map((item, key) => {
                    return (
                        <Tooltip
                            isV3
                            place="top"
                            id={item}
                            effect="solid"
                            className={classNames(
                                'max-w-[511px] dark:after:!border-t-[#2e333d] after:!border-t-[#e1e2e3]  !px-6 !py-3 !bg-gray-11 dark:!bg-dark-1  dark:!text-gray-7 !text-gray-1 !text-sm',
                                {
                                    'after:!left-[8%]': key === 0,
                                    'after:!left-[84%]': key === 2
                                }
                            )}
                            overridePosition={({ top }) => {
                                return { left: 32, top };
                            }}
                        >
                            <Trans
                                i18nKey={`lending:lending:ltv:${item}`}
                                components={{
                                    primary: <div className="flex" />,
                                    secondary: <p className="text-green-3 hover:text-green-4 ml-1" />
                                }}
                            />
                        </Tooltip>
                    );
                })}
            </>
        );
    };

    const renderValueToken = ({ asset, onchange, key, assetCode }) => {
        const data = key === LOANABLE ? selectLoanAsset.loanable : selectLoanAsset.collateral;
        return (
            <AssetLendingFilter
                data={data}
                asset={asset}
                assetCode={assetCode}
                className="h-6"
                wrapperLabel="h-6"
                onChangeAsset={(e) => onchange(e, key)}
                labelClassName="mr-2"
                labelAsset="Chọn tài sản ký quỹ"
                wrapperClassName="w-max right-[-12px] !left-[auto]"
                containerClassName={classNames({ '!z-[auto]': key === COLLATERAL })}
            />
        );
    };

    // **
    return (
        <>
            <ModalV2
                isVisible={isModal}
                className="w-[596px] overflow-auto no-scrollbar"
                onBackdropCb={onClose}
                wrapClassName="p-6 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={onClose}
                        >
                            <IconClose />
                        </div>
                    </div>
                )}
            >
                <section>
                    {renderTooltip()}
                    {renderTooltipLTV()}
                    <p className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">Tạo lệnh vay</p>
                    <section className="mt-6">
                        <InputV2
                            allowClear
                            label="Tôi muốn vay"
                            showDividerSuffix={false}
                            placeholder="Nhập số lượng tài sản bạn muốn vay"
                            suffix={
                                <label htmlFor="search_events">
                                    {renderValueToken({
                                        asset: filter?.loanable,
                                        onchange: onChangeAsset,
                                        key: LOANABLE,
                                        assetCode: filter?.collateral?.id
                                    })}
                                </label>
                            }
                            prefix={
                                <span className="mt-1 text-xs font-normal absolute bottom-0 left-0">
                                    Tối thiểu: {formatNumber(filter.loanable?.config?.minLimit, filter.loanable?.config?.assetDigit)} . Tối đa:
                                    {formatNumber(filter.loanable?.config?.maxLimit, filter.loanable?.config?.assetDigit)}
                                </span>
                            }
                        />
                    </section>
                    <section className="mt-8">
                        <section className="flex flex-row justify-between mb-[14px]">
                            <div className="dark:text-gray-4 text-gray-15">Số lượng ký quỹ</div>
                            <section className="flex flex-row gap-1 items-center">
                                <div>
                                    Khả dụng: {formatNumber(totalSPOT?.available, totalSPOT?.assetDigit) || '-'} {totalSPOT?.assetCode}
                                </div>
                                <AddCircleColorIcon
                                    size={16}
                                    onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.SPOT, toWallet: WalletType.FUTURES }))}
                                    className="cursor-pointer"
                                />
                            </section>
                        </section>
                        <InputV2
                            allowClear
                            showDividerSuffix={false}
                            placeholder="Nhập số lượng tài sản đảm bảo"
                            suffix={
                                <label htmlFor="search_events">
                                    {renderValueToken({
                                        asset: filter?.collateral,
                                        onchange: onChangeAsset,
                                        key: COLLATERAL,
                                        assetCode: filter?.loanable?.id
                                    })}
                                </label>
                            }
                            prefix={
                                <span className="mt-1 text-xs font-normal absolute bottom-0 left-0">
                                    Tối thiểu: {formatNumber(filter.collateral?.config?.minLimit || 0, filter.collateral.config?.assetDigit)} . Tối đa:
                                    {formatNumber(filter.collateral?.config?.maxLimit, filter.collateral.config?.assetDigit)}
                                </span>
                            }
                        />
                    </section>
                    <section>
                        <div
                            data-tip=""
                            data-for="loan_term"
                            className="dark:text-gray-4 text-gray-15 border-b border-darkBlue-5 border-dashed cursor-pointer w-max mt-8"
                        >
                            Thời hạn vay
                        </div>
                        <section className="flex flex-row gap-4 w-max mt-4">
                            {BORROWING_TERM.map((term) => {
                                const isActive = term.key === borrowingTerm;
                                return (
                                    <Chip onClick={() => handleBorrowingTermClick(term.key)} selected={isActive} key={term?.[language]}>
                                        {term?.[language]}
                                    </Chip>
                                );
                            })}
                        </section>
                        {renderProfit()}
                        {renderLTV()}
                        {renderRules()}
                        <ButtonV2 className="mt-10" disabled={!true}>
                            Vay ngay
                        </ButtonV2>
                    </section>
                </section>
            </ModalV2>
            <ConfirmLoan isModal={isConfirm} onClose={handleToggleConfirm} />
        </>
    );
};

export default ModalRegisterLoan;
