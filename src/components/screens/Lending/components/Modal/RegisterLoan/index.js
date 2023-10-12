import { useCallback, useState, useMemo, useEffect } from 'react';

// ** Next
import dynamic from 'next/dynamic';
import { useTranslation, Trans } from 'next-i18next';
import Link from 'next/link';

// ** Redux
import { useSelector } from 'react-redux';

//** components
import Chip from 'components/common/V2/Chip';
import CheckBox from 'components/common/CheckBox';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TradingInputV2 from 'components/trade/TradingInputV2';

// ** svg
import { AddCircleColorIcon } from 'components/svg/SvgIcon';

// ** Third party
import classNames from 'classnames';

// ** Dynamic
const ModalConfirmLoan = dynamic(() => import('./ConfirmLoan'), { ssr: false });
const AssetLendingFilter = dynamic(() => import('components/screens/Lending/components/AssetLendingFilter'), { ssr: false });

// ** Custom hooks
import useRegisterLoan from 'components/screens/Lending/hooks/useRegisterLoan';
import useLoanInput from 'components/screens/Lending/hooks/useLoanInput';

// ** CONSTANTS
import {
    LTV,
    INTEREST,
    PERCENT,
    LOANABLE,
    COLLATERAL,
    BORROWING_TERM,
    DEFAULT_LOANABLE_ASSET,
    DEFAULT_COLLATERAL_ASSET,
    REGISTER_HANDLE_TYPE
} from 'components/screens/Lending/constants';
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';

// ** UTILS
import { dwLinkBuilder, formatNumber, getLoginUrl } from 'redux/actions/utils';
import { getSpotAvailable } from 'components/screens/Lending/utils/selector';
import Spinner from 'components/svg/Spinner';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { formatPercent } from 'components/screens/Lending/utils';

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

const ModalRegisterLoan = ({ isOpen, onClose, loanAsset, loanAssetList, collateralAssetList }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();

    const assetConfig = useSelector((state) => state.utils.assetConfig) || [];
    const user = useSelector((state) => state?.auth?.user);
    const isAuth = Boolean(user);
    const isUserEKyc = user?.kyc_status === 2;

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
    const { loanValue, collateralValue, minCollateralAmount, maxCollateralAmount, validator, loadingPrice } = useLoanInput({
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
        if (!isUserEKyc) return router.push(PATHS.ACCOUNT.IDENTIFICATION);
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
        ({ assetKey, filterAssetCode }) => {
            const defaultAssetCode = assetKey === LOANABLE ? loanAsset || DEFAULT_LOANABLE_ASSET : DEFAULT_COLLATERAL_ASSET;
            const filterAssetList = assetList[assetKey].filter((asset) => asset?.assetCode !== filterAssetCode);

            // neu tim khong thay defaultAssetCode, su dung index 0 cua filterAssetList
            return filterAssetList.find((asset) => asset?.assetCode === defaultAssetCode) || filterAssetList[0];
        },
        [assetList, loanAsset]
    );
    useEffect(() => {
        const settingDefaultAsset = () => {
            const loanAsset = getDefaultAsset({ assetKey: LOANABLE });
            const collateralAsset = getDefaultAsset({ assetKey: COLLATERAL, filterAssetCode: loanAsset?.assetCode || '' });
            setFilter({ [LOANABLE]: loanAsset, [COLLATERAL]: collateralAsset });
        };

        settingDefaultAsset();
    }, [getDefaultAsset]);

    const onChangeAsset = (value, key) => {
        if ([LOANABLE, COLLATERAL].includes(key)) {
            if (value) {
                set((prev) => ({
                    ...prev,
                    filter: {
                        ...prev.filter,
                        [key]: value
                    }
                }));
            } else {
                const defaultAsset = getDefaultAsset({ assetKey: key });
                set((prev) => ({
                    ...prev,
                    filter: {
                        ...prev.filter,
                        [key]: defaultAsset
                    }
                }));
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
            interest_year: `${formatPercent(loanInterest.annualInterestPercent)}%`,
            interest_daily: `${formatPercent(loanInterest.dailyInterestPercent)}%`,
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
            initial_ltv: totalLTV.initialLTV * PERCENT,
            margin_ltv: totalLTV.marginCallLTV * PERCENT,
            liquidate_ltv: totalLTV.liquidationLTV * PERCENT
        };

        return (
            <section id="ltv_wrapper" className="relative flex flex-row mt-4">
                {LTV.map((item, index) => {
                    return (
                        <section className="group h-6 flex flex-row" key={`ltv_${index}_${item.title?.[language]}`}>
                            <section className="border-b border-darkBlue-5 border-dashed cursor-pointer flex flex-row">
                                <section className="dark:text-gray-7 text-gray-1">{item.title?.[language]}:</section>
                                <section className="dark:text-gray-4 text-gray-15 ml-1">{data?.[item.key] || '-'}%</section>
                            </section>
                            {index !== 2 ? <div className="mx-2 dark:text-gray-7 text-gray-1">/</div> : null}
                            <StyledToolTip
                                // arrow position
                                className={classNames({
                                    'after:!left-[6%]': index === 0,
                                    'after:!left-[45%]': index === 1,
                                    'after:!left-[80%]': index === 2
                                })}
                            >
                                <Trans
                                    i18nKey={`lending:lending:ltv:${item.key}`}
                                    components={{
                                        primary: <div className="flex" />,
                                        secondary: <p className="text-green-3 hover:text-green-4 ml-1" />
                                    }}
                                />
                            </StyledToolTip>
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
                    className="h-full !w-auto"
                    labelClassName="!text-base"
                    boxContainerClassName="w-6 h-6"
                    label={
                        <Trans i18nKey="lending:lending:rule">
                            <span />

                            <a
                                className="text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer font-semibold"
                                target="_blank"
                                href="/terms-of-service"
                            />
                        </Trans>
                    }
                />
            </section>
        );
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
                    containerClassName={classNames('!z-[auto]')}
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
                isVisible={isOpen}
                className="w-[596px] overflow-auto no-scrollbar"
                onBackdropCb={() => {
                    onClose();
                    setState(INIT_DATA);
                }}
                wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                btnCloseclassName="text-txtPrimary dark:text-txtPrimary-dark mb-6 !py-0"
            >
                <section>
                    <p className="dark:text-gray-4 text-gray-15 text-2xl font-semibold">{t('lending:lending.modal.title')} </p>
                    <section className="mt-6">
                        <TradingInputV2
                            clearAble
                            label={t('lending:lending.modal.loan_input.label')}
                            labelClassName="font-semibold inline-block !text-base !text-txtPrimary dark:!text-txtPrimary-dark"
                            thousandSeparator={true}
                            decimalScale={filter?.loanable?.assetDigit}
                            errorTooltip={false}
                            inputClassName="!text-left !ml-0 !text-txtPrimary dark:!text-txtPrimary-dark"
                            placeholder={t('lending:lending.modal.loan_input.placeholder')}
                            validator={isAuth && validator[LOANABLE]()} // validate if only authenticated
                            containerClassName="!bg-gray-12 dark:!bg-dark-2"
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
                                        assetCode: filter?.collateral?.assetCode
                                    })}
                                </label>
                            }
                            textDescription={
                                <span>
                                    {t('lending:lending.modal.input_description.min_max', {
                                        min: formatNumber(filter.loanable?.config?.minLimit, filter.loanable?.assetDigit),
                                        max: formatNumber(filter.loanable?.config?.maxLimit, filter.loanable?.assetDigit)
                                    })}
                                </span>
                            }
                        />
                    </section>
                    <section className="mt-8">
                        <section className="flex flex-row justify-between mb-2 text-txtPrimary  dark:text-txtPrimary-dark">
                            <div className="font-semibold">{t('lending:lending.modal.collateral_input.label')}</div>

                            {/* hien thi balance chi khi auth */}
                            {isAuth && (
                                <section className="flex text-sm flex-row gap-1 items-center">
                                    <div className="space-x-1">
                                        <span className="dark:text-txtSecondary-dark text-txtSecondary">{t('common:available_balance')}</span>
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
                            )}
                        </section>
                        <TradingInputV2
                            clearAble
                            placeholder={t('lending:lending.modal.collateral_input.placeholder')}
                            thousandSeparator={true}
                            decimalScale={filter?.collateral?.assetDigit}
                            inputClassName="!text-left !ml-0 !text-txtPrimary dark:!text-txtPrimary-dark"
                            containerClassName="!bg-gray-12 dark:!bg-dark-2"
                            errorTooltip={false}
                            validator={isAuth && validator[COLLATERAL]()} // validate if only authenticated
                            value={collateralValue}
                            onValueChange={({ value }) => {
                                onChangeAssetAmount({ value, field: COLLATERAL });
                            }}
                            renderTail={
                                <div className="">
                                    {renderValueToken({
                                        asset: filter?.collateral,
                                        onChange: onChangeAsset,
                                        assetListKey: COLLATERAL,
                                        assetCode: filter?.loanable?.assetCode
                                    })}
                                </div>
                            }
                            textDescription={
                                <span>
                                    {loadingPrice ? (
                                        <Spinner size={16} color="currentColor" />
                                    ) : (
                                        t('lending:lending.modal.input_description.min_max', {
                                            min: formatNumber(minCollateralAmount, filter.collateral?.assetDigit),
                                            max: formatNumber(maxCollateralAmount, filter.collateral?.assetDigit)
                                        })
                                    )}
                                </span>
                            }
                            onFocus={() => setState({ typingField: COLLATERAL })}
                        />
                    </section>
                    <section>
                        <div className="relative">
                            <div className="dark:text-gray-4 group  text-gray-15 border-b border-darkBlue-5 border-dashed cursor-pointer w-max mt-8">
                                <span className="font-semibold">{t('lending:lending.modal.loan_term')}</span>
                                <StyledToolTip className="after:!left-[8%]">
                                    <div dangerouslySetInnerHTML={{ __html: t('lending:lending.modal.loan_term_description') }} />
                                </StyledToolTip>
                            </div>
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
                        {isAuth && isUserEKyc && renderRules()}
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
                            <ButtonV2
                                onClick={() => handleRegisterLoan(REGISTER_HANDLE_TYPE.FROM_MAIN_MODAL)}
                                className="mt-10"
                                disabled={isUserEKyc ? isError : false}
                            >
                                {isUserEKyc ? 'Vay ngay' : 'eKyc Ngay'}
                            </ButtonV2>
                        )}
                    </section>
                </section>
            </ModalV2>
            <ModalConfirmLoan
                onSuccessClose={() => {
                    setState(INIT_DATA);
                    return onClose();
                }}
                registerLoan={() => handleRegisterLoan(REGISTER_HANDLE_TYPE.FROM_CONFIRM_MODAL)}
                handleRefetchPrice={() => setRefetchCollateralPrice((prev) => !prev)}
                isOpen={isConfirm}
                onClose={onToggleConfirm}
                loanInfor={confirmLoanInfor}
                loadingCollateralPrice={loadingPrice}
            />
        </>
    );
};

const StyledToolTip = styled.div.attrs({
    className:
        'z-10 absolute left-0 bottom-full dark:after:border-t-dark-1 after:border-t-darkBlue text-sm text-white dark:text-txtPrimary-dark mb-4 w-full transition opacity-0 group-hover:opacity-100 group-hover:visible invisible  px-6 py-[11px] bg-darkBlue dark:bg-dark-1 rounded-lg'
})`
    &:after {
        --size: 12px;
        content: '';
        position: absolute;
        left: ${({ offsetLeft }) => (offsetLeft ? `${offsetLeft}px` : '50%')};
        bottom: calc(var(--size) * -1);
        border-width: calc(var(--size) / 2);
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        border-left-color: transparent !important;
    }
`;

export default ModalRegisterLoan;
