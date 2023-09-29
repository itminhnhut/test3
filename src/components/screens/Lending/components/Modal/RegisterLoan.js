import { useCallback, useState, useMemo, useEffect } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation, Trans } from 'next-i18next';

// * Context
import { useLoanableList, useCollateralList } from 'components/screens/Lending/Context';

// ** Redux
import { WalletType } from 'redux/actions/const';
import { useSelector, useDispatch } from 'react-redux';
import { dwLinkBuilder, formatNumber, getLoginUrl, setTransferModal } from 'redux/actions/utils';

//** components
import Chip from 'components/common/V2/Chip';
import Tooltip from 'components/common/Tooltip';
import CheckBox from 'components/common/CheckBox';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// ** svg
import { IconClose, AddCircleColorIcon } from 'components/svg/SvgIcon';

// ** Third party
import classNames from 'classnames';

// ** Dynamic
const ModalConfirmLoan = dynamic(() => import('./ConfirmLoan'), { ssr: false });
const AssetLendingFilter = dynamic(() => import('components/screens/Lending/components/AssetLendingFilter'), { ssr: false });

// ** CONSTANTS
import {
    LTV,
    INTEREST,
    PERCENT,
    LOANABLE,
    COLLATERAL,
    BORROWING_TERM,
    ALLOW_LTV_TOOLTIP,
    DEFAULT_LOANABLE_ASSET,
    DEFAULT_COLLATERAL_ASSET,
    REGISTER_HANDLE_TYPE
} from 'components/screens/Lending/constants';

import TradingInputV2 from 'components/trade/TradingInputV2';
import useRegisterLoan from '../../hooks/useRegisterLoan';
import useLoanInput from '../../hooks/useLoanInput';
import { createSelector } from 'reselect';
import AuthSelector from 'redux/selectors/authSelectors';
import Link from 'next/link';
import { PATHS } from 'constants/paths';
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';

// ** INIT DATA
const INIT_DATA = {
    loanTerm: 7,
    isAcceptRule: false,
    isConfirm: false,
    filter: {
        loanable: {},
        collateral: {}
    },
    typingField: LOANABLE,
    collateralInput: '',
    loanInput: ''
};

const getSpotAvailable = createSelector([(state) => state.wallet?.SPOT, (utils, params) => params], (wallet, params) => {
    const _avlb = wallet?.[params.assetId];
    return _avlb ? Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0) : 0;
});

const ModalRegisterLoan = ({ isModal, onClose, loanAsset }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useRedux
    const dispatch = useDispatch();

    const assetConfig = useSelector((state) => state.utils.assetConfig) || [];
    const isAuth = useSelector(AuthSelector.isAuthSelector);

    // ** useContext
    const { loanable: loanAssetList } = useLoanableList();
    const { collateral: collateralAssetList } = useCollateralList();

    // ** useState
    const [refetchCollateralPrice, setRefetchCollateralPrice] = useState(false);
    const [state, set] = useState(INIT_DATA);
    const { isAcceptRule, typingField, filter, isConfirm, loanTerm, collateralInput, loanInput } = state;
    const setState = (newState) => set((prevState) => ({ ...prevState, ...newState }));
    const setFilter = (newFilter) =>
        setState({
            filter: {
                ...filter,
                ...newFilter
            }
        });

    // ** collateral wallet balance
    const collateralAvailable = useSelector((state) => getSpotAvailable(state, { assetId: filter.collateral?.id }));

    // ** handle total ltv
    const totalLTV = useMemo(() => {
        const { initialLTV = 0, marginCallLTV = 0, liquidationLTV = 0 } = filter.collateral?.config || {};
        return { initialLTV, marginCallLTV, liquidationLTV };
    }, [filter.collateral?.assetCode]);

    // ** use custom Hooks
    const { loanValue, collateralValue, minCollateralAmount, validator } = useLoanInput({
        collateral: filter?.collateral,
        loanable: filter?.loanable,
        initialLTV: totalLTV.initialLTV,
        typingField,
        collateralInput,
        loanInput,
        collateralAvailable,
        refetch: refetchCollateralPrice
    });

    const { registerLoan } = useRegisterLoan({
        loanValue,
        collateralValue,
        loanCoin: filter?.loanable?.assetCode,
        collateralCoin: filter?.collateral?.assetCode,
        loanTerm,
        typingField
    });

    const handleRegisterLoan = async (type) => {
        switch (type) {
            case REGISTER_HANDLE_TYPE.FROM_CONFIRM_MODAL:
                return await registerLoan();

            case REGISTER_HANDLE_TYPE.FROM_MAIN_MODAL:
                onToggleConfirm();
                setRefetchCollateralPrice((prev) => !prev);
                return;
            default:
                break;
        }
    };

    // ** loan term interest rate per Day and per Hour
    const termDailyInterestRate = +filter.loanable?.config?.[`_${loanTerm}dDailyInterestRate`];
    const termHourlyInterestRate = +filter.loanable?.config?.[`_${loanTerm}dHourlyInterestRate`];

    // loan interest
    const loanInterest = useMemo(
        () => ({
            annualInterestPercent: termDailyInterestRate * 100 * 365,
            dailyInterestPercent: termDailyInterestRate * 100,
            hourInterestAmount: loanValue * termHourlyInterestRate,
            dayInterestAmount: loanValue * termDailyInterestRate,
            termInterestAmount: loanValue * termDailyInterestRate * loanTerm
        }),
        [termDailyInterestRate, termHourlyInterestRate, loanValue]
    );

    const assetConfigByCode = useMemo(() => {
        return assetConfig?.length && assetConfig.reduce((prevObj, asset) => ({ ...prevObj, [asset?.assetCode]: asset }), {});
    }, [assetConfig]);

    const assetList = useMemo(() => {
        const generateAssets = ({ loanConfigAssets, assetCodeKey }) => {
            const mappedAssets = loanConfigAssets.map((loanConfig) => {
                const assetCode = loanConfig?.[assetCodeKey];
                const asset = assetConfigByCode?.[assetCode];
                return {
                    ...asset,
                    config: loanConfig
                };
            });
            return mappedAssets;
        };

        const loanList = generateAssets({ loanConfigAssets: loanAssetList, assetCodeKey: 'loanCoin' });
        const collateralList = generateAssets({ loanConfigAssets: collateralAssetList, assetCodeKey: 'collateralCoin' });

        return { [LOANABLE]: loanList, [COLLATERAL]: collateralList };
    }, [assetConfigByCode, loanAssetList, collateralAssetList]);

    // ** handle
    const onToggleConfirm = () => setState({ isConfirm: !isConfirm });
    const onLoanTermClick = (value) => {
        setState({ loanTerm: value });
    };
    const onChangeRule = () => setState({ isAcceptRule: !isAcceptRule });

    const getDefaultAsset = useCallback(
        ({ assetKey }) => {
            const defaultAssetCode = assetKey === LOANABLE ? loanAsset || DEFAULT_LOANABLE_ASSET : DEFAULT_COLLATERAL_ASSET;
            const assetFound = assetList[assetKey].find((asset) => asset?.assetCode === defaultAssetCode);
            return assetFound;
        },
        [assetList, loanAsset]
    );
    useEffect(() => {
        const settingDefaultAsset = () => {
            const loanAsset = getDefaultAsset({ assetKey: LOANABLE });
            const collateralAsset = getDefaultAsset({ assetKey: COLLATERAL });
            setFilter({ [LOANABLE]: loanAsset, [COLLATERAL]: collateralAsset });
        };

        settingDefaultAsset();
    }, [getDefaultAsset, assetList]);

    const onChangeAsset = (value, key) => {
        if ([LOANABLE, COLLATERAL].includes(key)) {
            if (value) {
                setFilter({ [key]: value });
            } else {
                const defaultAsset = getDefaultAsset({ assetKey: key });
                setFilter({ [key]: defaultAsset });
            }
        }
    };

    const onChangeAssetAmount = ({ value, field }) => {
        if (field === LOANABLE) {
            setState({ loanInput: value });
        } else setState({ collateralInput: value });
    };

    const confirmLoanInfor = useMemo(() => {
        return {
            loanValue,
            collateralValue,
            loanable: filter.loanable,
            collateral: filter.collateral,
            loanTerm,
            loanInterest
        };
    }, [loanValue, collateralValue, filter.loanable, filter.collateral, loanTerm, loanInterest]);

    const isError = !isAcceptRule || validator[COLLATERAL]().isError || validator[LOANABLE]().isError;

    // ** render
    const renderInterest = () => {
        const interestRate = {
            interest_year: `${loanInterest.annualInterestPercent.toFixed(5)}%`,
            interest_daily: `${loanInterest.dailyInterestPercent.toFixed(5)}%`,
            interest_hours: `${formatNumber(loanInterest.hourInterestAmount, filter?.loanable?.assetDigit || 0)} ${filter?.loanable?.assetCode}`,
            interest_term: `${formatNumber(loanInterest.termInterestAmount, filter?.loanable?.assetDigit || 0)} ${filter?.loanable?.assetCode}`
        };
        return (
            <section className="flex flex-col gap-3 mt-8">
                {INTEREST.map((interest, key) => {
                    return (
                        <section className="flex justify-between" key={`interest_${key}_${interest.title?.[language]}`}>
                            <div className="dark:text-gray-7 text-gray-1">{interest.title?.[language]}</div>
                            <div className="dark:text-gray-4 text-gray-15 font-semibold">{interestRate[interest.key]}</div>
                        </section>
                    );
                })}
            </section>
        );
    };

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
                    active={isAcceptRule}
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
        return ALLOW_LTV_TOOLTIP.map((item, key) => {
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
        });
    };

    const renderValueToken = useCallback(
        ({ asset, onChange, assetListKey, assetCode }) => {
            return (
                <AssetLendingFilter
                    assets={assetList[assetListKey]}
                    assetListKey={assetListKey}
                    asset={asset}
                    assetCode={assetCode}
                    className="h-6"
                    wrapperLabel="h-6 !p-0 !bg-transparent"
                    onChangeAsset={(e) => onChange(e, assetListKey)}
                    labelClassName="mr-2"
                    labelAsset="Chọn tài sản ký quỹ"
                    wrapperClassName="w-max right-[-12px] !left-[auto]"
                    containerClassName={classNames({ '!z-[auto]': assetListKey === COLLATERAL })}
                    isAuth={isAuth}
                />
            );
        },
        [assetList, isAuth]
    );

    // **
    return (
        <>
            <ModalV2
                isVisible={isModal}
                className="w-[596px] overflow-auto no-scrollbar"
                onBackdropCb={() => {
                    onClose();
                    setState(INIT_DATA);
                }}
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
                        <TradingInputV2
                            clearAble
                            label="Tôi muốn vay"
                            labelClassName="font-semibold inline-block !text-base !text-txtPrimary dark:!text-txtPrimary-dark"
                            thousandSeparator={true}
                            decimalScale={filter?.loanable?.assetDigit}
                            errorTooltip={false}
                            inputClassName="!text-left !ml-0 !text-txtPrimary dark:!text-txtPrimary-dark"
                            placeholder="Nhập số lượng tài sản bạn muốn vay"
                            validator={validator[LOANABLE]()}
                            value={loanValue}
                            onValueChange={({ value }) => {
                                onChangeAssetAmount({ value, field: LOANABLE });
                            }}
                            onFocus={() => setState({ typingField: LOANABLE })}
                            renderTail={
                                <label htmlFor="search_events">
                                    {renderValueToken({
                                        asset: filter?.loanable,
                                        onChange: onChangeAsset,
                                        assetListKey: LOANABLE,
                                        assetCode: filter?.collateral?.id
                                    })}
                                </label>
                            }
                            textDescription={
                                <span>
                                    Tối thiểu: {formatNumber(filter.loanable?.config?.minLimit, filter.loanable?.assetDigit)} . Tối đa:
                                    {formatNumber(filter.loanable?.config?.maxLimit, filter.loanable?.assetDigit)}
                                </span>
                            }
                        />
                    </section>
                    <section className="mt-8">
                        <section className="flex flex-row justify-between mb-2 text-txtPrimary  dark:text-txtPrimary-dark">
                            <div className="font-semibold">Số lượng ký quỹ</div>
                            <section className="flex text-sm flex-row gap-1 items-center">
                                <div className="space-x-1">
                                    <span className="dark:text-txtSecondary-dark text-txtSecondary">Khả dụng:</span>
                                    <span className="font-semibold ">
                                        {formatNumber(collateralAvailable, filter.collateral?.assetDigit) || '-'} {filter.collateral?.assetCode}
                                    </span>
                                </div>
                                <Link href={dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, filter.collateral?.assetCode)} passHref>
                                    <a className="inline-block">
                                        <AddCircleColorIcon size={16} className="cursor-pointer" />
                                    </a>
                                </Link>
                            </section>
                        </section>
                        <TradingInputV2
                            clearAble
                            placeholder="Nhập số lượng tài sản đảm bảo"
                            thousandSeparator={true}
                            decimalScale={filter?.collateral?.assetDigit}
                            inputClassName="!text-left !ml-0 !text-txtPrimary dark:!text-txtPrimary-dark"
                            errorTooltip={false}
                            validator={validator[COLLATERAL]()}
                            value={collateralValue}
                            onValueChange={({ value }) => {
                                onChangeAssetAmount({ value, field: COLLATERAL });
                            }}
                            renderTail={
                                <label htmlFor="search_events">
                                    {renderValueToken({
                                        asset: filter?.collateral,
                                        onChange: onChangeAsset,
                                        assetListKey: COLLATERAL,
                                        assetCode: filter?.loanable?.id
                                    })}
                                </label>
                            }
                            textDescription={
                                <span>
                                    Tối thiểu: {formatNumber(minCollateralAmount, filter.collateral?.assetDigit)} . Tối đa:
                                    {formatNumber(filter.collateral?.config?.maxLimit, filter.collateral?.assetDigit)}
                                </span>
                            }
                            onFocus={() => setState({ typingField: COLLATERAL })}
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
                                const isActive = term.day === loanTerm;
                                return (
                                    <Chip onClick={() => onLoanTermClick(term.day)} selected={isActive} key={term?.[language]}>
                                        {term?.[language]}
                                    </Chip>
                                );
                            })}
                        </section>
                        {renderInterest()}
                        {renderLTV()}
                        {renderRules()}
                        {!isAuth ? (
                            <ButtonV2
                                onClick={() => {
                                    window.open(getLoginUrl('sso', 'login'), '_self');
                                }}
                                className="mt-10"
                            >
                                {t('common:sign_in')}
                            </ButtonV2>
                        ) : (
                            <ButtonV2 onClick={() => handleRegisterLoan(REGISTER_HANDLE_TYPE.FROM_MAIN_MODAL)} className="mt-10" disabled={isError}>
                                Vay ngay
                            </ButtonV2>
                        )}
                    </section>
                </section>
            </ModalV2>
            <ModalConfirmLoan
                onSuccessClose={() => {
                    onClose();
                    setState(INIT_DATA);
                }}
                registerLoan={() => handleRegisterLoan(REGISTER_HANDLE_TYPE.FROM_CONFIRM_MODAL)}
                refetchPrice={refetchCollateralPrice}
                isOpen={isConfirm}
                onClose={onToggleConfirm}
                loanInfor={confirmLoanInfor}
            />
        </>
    );
};

export default ModalRegisterLoan;
