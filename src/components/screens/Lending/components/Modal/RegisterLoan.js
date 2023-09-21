import { useCallback, useState, useMemo } from 'react';

// ** next
import dynamic from 'next/dynamic';
import { useTranslation, Trans } from 'next-i18next';

// ** Redux
import { WalletType } from 'redux/actions/const';
import { setTransferModal } from 'redux/actions/utils';
import { useSelector, useDispatch } from 'react-redux';
import { formatNumber } from 'redux/actions/utils';

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
import { BORROWING_TERM, PROFITS, LTV } from 'components/screens/Lending/constants';

// ** INIT DATA
const INIT_DATA = {
    borrowing_term: 7,
    rule: false,
    isConfirm: false,
    filter: {
        lendingAsset: { assetCode: 'VNST', assetName: 'VNST', id: 39 },
        lendingMargin: { assetCode: 'BNB', assetName: 'BNB', id: 40 }
    }
};

const ALLOW_LTV_TOOLTIP = ['ltv_initial', 'ltv_margin', 'ltv_liquidate'];

const ModalRegisterLoan = ({ isModal, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const dispatch = useDispatch();

    // ** useState
    const [borrowingTerm, setBorrowingTerm] = useState(INIT_DATA.borrowing_term);
    const [rule, setRule] = useState(INIT_DATA.rule);
    const [isConfirm, setIsConfirm] = useState(INIT_DATA.false);
    const [filter, setFilter] = useState(INIT_DATA.filter);

    // ** handle
    const handleToggleConfirm = () => setIsConfirm((prev) => !prev);
    const handleBorrowingTermClick = useCallback(
        (value) => {
            setBorrowingTerm(value);
        },
        [borrowingTerm]
    );
    const onChangeRule = () => setRule((prev) => !prev);
    const onChangeAsset = (value, key) => setFilter((prev) => ({ ...prev, [key]: value }));

    // ** get data
    const wallets = useSelector((state) => state.wallet.SPOT);
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const getAsset = (assetId) => {
        return assetConfigs.find((asset) => asset.id === assetId);
    };

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
    }, []);

    const totalSPOT = useMemo(() => {
        return tempFromAssetList?.find((asset) => asset.assetCode === filter.lendingMargin?.assetCode);
    }, [filter.lendingMargin?.id]);

    console.log('totalSPOT', totalSPOT);

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

    const renderLTV = () => {
        const data = {
            ltv_initial: 75,
            ltv_margin: 85,
            ltv_liquidate: 95
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
        return (
            <AssetLendingFilter
                asset={asset}
                assetCode={assetCode}
                className="h-6"
                wrapperLabel="h-6"
                onChangeAsset={(e) => onchange(e, key)}
                labelClassName="mr-2"
                labelAsset="Chọn tài sản ký quỹ"
                wrapperClassName="w-max right-[-12px] !left-[auto]"
                containerClassName={classNames({ '!z-[auto]': key === 'lendingMargin' })}
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
                                        asset: filter?.lendingAsset,
                                        onchange: onChangeAsset,
                                        key: 'lendingAsset',
                                        assetCode: filter?.lendingMargin?.id
                                    })}
                                </label>
                            }
                            prefix={<span className="mt-1 text-xs font-normal absolute bottom-0 left-0">Tối thiểu: 10,000. Tối đa: 10,000,000,000</span>}
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
                                        asset: filter?.lendingMargin,
                                        onchange: onChangeAsset,
                                        key: 'lendingMargin',
                                        assetCode: filter?.lendingAsset?.id
                                    })}
                                </label>
                            }
                        />
                    </section>
                    <section>
                        <div
                            data-tip=""
                            data-for="loan_term"
                            className="dark:text-gray-4 text-gray-15 border-b border-darkBlue-5 border-dashed cursor-pointer w-max"
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
