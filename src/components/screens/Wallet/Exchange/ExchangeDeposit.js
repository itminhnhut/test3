import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatTime, formatWallet, getS3Url, shortHashAddress } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Check, ChevronLeft, ChevronRight, Search, Slash, X } from 'react-feather';
import { API_GET_DEPWDL_HISTORY, API_PUSH_ORDER_BINANCE, API_REVEAL_DEPOSIT_TOKEN_ADDRESS } from 'redux/actions/apis';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ApiStatus, DepWdlStatus } from 'redux/actions/const';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { find, get, isFunction, keyBy } from 'lodash';
import { useSelector } from 'react-redux';
import { PATHS } from 'constants/paths';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useOutsideClick from 'hooks/useOutsideClick';
import useWindowFocus from 'hooks/useWindowFocus';
import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import ChevronDown from 'components/svg/ChevronDown';
import AssetLogo from 'components/wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';
import QRCode, { QRCodeSVG } from 'qrcode.react';
import Empty from 'components/common/Empty';

import styled from 'styled-components';
import colors from 'styles/colors';
import Axios from 'axios';
import TableV2 from 'components/common/V2/TableV2';
import Modal from 'components/common/ReModal';
import Tooltip from 'components/common/Tooltip';
import Button from 'components/common/Button';
import classNames from 'classnames';
import NoData from 'components/common/V2/TableV2/NoData';
import format from 'date-fns/format';
import TagV2 from 'components/common/V2/TagV2';
import ModalV2 from 'components/common/V2/ModalV2';
import Copy from 'components/svg/Copy';
import ModalNeedKyc from 'components/common/ModalNeedKyc';

const INITIAL_STATE = {
    loadingConfigs: false,
    configs: null,
    selectedAsset: null,
    selectedNetwork: null,
    networkList: null,
    openList: {},
    search: '',
    address: '',
    loadingAddress: false,
    errors: {},
    isCopying: {},
    histories: null,
    loadingHistory: false,
    historyLastId: undefined,
    historyPage: 0,
    blockConfirm: {},
    openModal: {},
    pushingOrder: false,
    pushedOrder: null

    // Add new state here
};

const CryptoSelect = ({ t, selected }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const refContent = useRef();
    const [currentTheme] = useDarkMode();

    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs) || [];
    const spotWallets = useSelector((state) => state.wallet.SPOT) || {};
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];

    const mapAssetConfig = useMemo(() => keyBy(assetConfigs, 'id'), [assetConfigs]);

    const router = useRouter();

    const items = useMemo(() => {
        return paymentConfigs
            .filter((c) => c.assetCode?.includes(search.toUpperCase()))
            .map((config) => {
                const wallet = spotWallets[config.assetId] || {
                    value: 0,
                    locked_value: 0
                };

                return {
                    ...config,
                    availableValue: wallet.value - wallet.locked_value
                };
            });
    }, [paymentConfigs, spotWallets, search]);

    useOutsideClick(refContent, () => setOpen(!open));

    return (
        <div className="relative">
            <div className="bg-gray-13 dark:bg-darkBlue-3 rounded-xl px-4 pt-5 pb-6 cursor-pointer select-none" onClick={() => setOpen(true)}>
                <p className="text-txtSecondary dark:text-txtSecondary-dark mb-2 leading-6">{t('wallet:crypto_select')}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <AssetLogo assetCode={selected?.assetCode} size={24} />
                        <div className="ml-2 font-semibold text-txtPrimary dark:text-txtPrimary-dark">{selected?.assetCode || '--'}</div>
                    </div>
                    <ChevronDown className={open ? '!rotate-0' : ''} size={16} color={currentTheme === THEME_MODE.DARK ? colors.gray['4'] : colors.darkBlue} />
                </div>
            </div>
            {open && (
                <div
                    className={classNames(
                        'absolute z-10 inset-x-0 mt-2 flex flex-col bg-white py-4 space-y-6 max-h-[436px] min-h-[200px]',
                        'rounded-xl shadow-common overflow-hidden',
                        'bg-white nami-light-shadow',
                        'dark:bg-darkBlue-3 dark:shadow-none dark:border dark:border-divider-dark '
                    )}
                    ref={refContent}
                >
                    <div className="px-4">
                        <div className="bg-gray-10 dark:bg-dark-2 h-12 flex items-center px-3 rounded-md">
                            <Search color={colors.darkBlue5} size={16} className="mr-2" />
                            <input type="text" value={search} placeholder={t('common:search')} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 space-y-3">
                        {!items.length && <NoData isSearch={!!search} />}
                        {items.map((c) => {
                            return (
                                <div
                                    key={c._id}
                                    onClick={() => {
                                        router
                                            .push(depositLinkBuilder(c.assetCode), null, {
                                                scroll: false
                                            })
                                            .finally(() => {
                                                setOpen(false);
                                            });
                                    }}
                                    className={classNames(
                                        'flex items-center justify-between px-4 py-3 cursor-pointer transition hover:bg-hover dark:hover:bg-hover-dark',
                                        {
                                            'bg-hover dark:bg-hover-dark': c._id === selected?._id
                                        }
                                    )}
                                >
                                    <div className="flex">
                                        <AssetLogo assetCode={c?.assetCode} size={24} />
                                        <span className="ml-2">{c.assetCode}</span>
                                    </div>
                                    <span className="float-right text-txtSecondary">
                                        {' '}
                                        {formatWallet(c.availableValue, mapAssetConfig[c.assetId]?.assetDigit || 0)}{' '}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const NetworkSelect = ({ t, selected, onSelect, networkList = [] }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const refContent = useRef();
    const [currentTheme] = useDarkMode();

    useOutsideClick(refContent, () => setOpen(!open));

    const items = useMemo(() => {
        return networkList.filter((nw) => {
            const name = nw.name?.toLowerCase() || '';
            return name.includes(search.toLowerCase());
        });
    }, [networkList, search]);

    return (
        <div className="relative">
            <div className="bg-gray-13 dark:bg-darkBlue-3 rounded-xl px-4 pt-5 pb-6 cursor-pointer select-none" onClick={() => setOpen(true)}>
                <p className="text-txtSecondary dark:text-txtSecondary-dark mb-2 leading-6">{t('wallet:network')}</p>
                <div className="flex items-center justify-between">
                    <div
                        className={classNames('flex items-center', {
                            'opacity-40': !selected?.depositEnable
                        })}
                    >
                        <span className="font-semibold">{selected?.network || '--'}</span>
                        <span className="ml-2 text-sm text-txtSecondary dark:text-txtSecondary-dark">{selected?.name || '--'}</span>
                    </div>
                    <ChevronDown className={open ? 'rotate-0' : ''} size={16} color={currentTheme === THEME_MODE.DARK ? colors.gray['4'] : colors.darkBlue} />
                </div>
            </div>
            {open && (
                <div
                    className={classNames(
                        'absolute z-10 inset-x-0 mt-2 flex flex-col bg-white py-4 space-y-6 max-h-[436px] min-h-[200px]',
                        'rounded-xl shadow-common overflow-hidden',
                        'bg-white nami-light-shadow',
                        'dark:bg-darkBlue-3 dark:shadow-none dark:border dark:border-divider-dark'
                    )}
                    ref={refContent}
                >
                    <div className="px-4">
                        <div className="bg-gray-10 dark:bg-dark-2 h-12 flex items-center px-3 rounded-md">
                            <Search color={colors.darkBlue5} size={16} className="mr-2" />
                            <input type="text" value={search} placeholder={t('common:search')} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                    </div>
                    <div className="overflow-y-auto space-y-3">
                        {!items.length && <NoData isSearch={!!search} />}
                        {items.map((item) => {
                            return (
                                <div
                                    key={item._id}
                                    className={classNames('flex items-center px-4 py-3 cursor-pointer hover:bg-hover dark:hover:bg-hover-dark', {
                                        'bg-hover dark:bg-hover-dark': selected._id === item._id
                                    })}
                                    onClick={() => {
                                        if (setOpen) setOpen(false);
                                        if (onSelect) onSelect(item);
                                    }}
                                >
                                    <p className="mr-2 font-semibold">{item.network}</p>
                                    <span className="text-txtSecondary dark:text-txtSecondary-dark text-xs">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const ExchangeDeposit = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const [status, setStatus] = useState(null);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const [currentPage, setCurrentPage] = useState(1);
    // Rdx
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs);
    const assetConfig = useSelector((state) => state.utils.assetConfig) || [];

    // Use Hooks
    const router = useRouter();
    const focused = useWindowFocus();
    const [currentTheme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation(['modal']);
    const { width } = useWindowSize();

    const mapAssetConfig = useMemo(() => keyBy(assetConfig, 'id'), [assetConfig]);

    const qrSize = useMemo(() => {
        if (width >= 768) return 160;
        return 110;
    }, [state.address, width]);

    // Helper
    const getDepositTokenAddress = async (shouldCreate, assetId, network) => {
        if (!assetId || !network) {
            return;
        }

        setState({
            address: '',
            loadingAddress: true
        });
        try {
            const { data } = await Axios.get(API_REVEAL_DEPOSIT_TOKEN_ADDRESS, {
                params: {
                    assetId,
                    network,
                    shouldCreate
                }
            });
            if (data && data?.status === 'ok') {
                setState({ address: data.data });
            }
            if (data?.status === 'error') {
                setState({
                    errors: {
                        ...state.errors,
                        addressNotFound: true
                    }
                });
            }
        } catch (e) {
            console.log('Address not exist!');
        } finally {
            setState({ loadingAddress: false });
        }
    };

    const getDepositHistory = async (page, isReNew = false) => {
        !isReNew && setState({ loadingHistory: true });

        try {
            const { data } = await Axios.get(API_GET_DEPWDL_HISTORY, {
                params: {
                    type: 1,
                    lastId: undefined,
                    page,
                    pageSize: HISTORY_SIZE
                }
            });

            if (data?.status === ApiStatus.SUCCESS) {
                setState({ histories: data?.data });
            }
        } catch (e) {
            console.log(`Can't get deposit history `, e);
        } finally {
            setState({ loadingHistory: false });
        }
    };

    const onChangeAsset = () => {
        setState({
            search: '',
            openList: {},
            errors: {},
            address: '',
            selectedNetwork: null
        });
    };

    const onCopy = (key) => {
        setState({ isCopying: { [key]: true } });
        try {
            setTimeout(() => setState({ isCopying: { [key]: false } }), 1000);
        } catch (err) {}
    };

    const onPushOrder = async (currency) => {
        if (!currency) return;
        setState({ pushingOrder: true });

        try {
            const { data } = await Axios.post(API_PUSH_ORDER_BINANCE, {
                currency
            });
            if (data?.status === 'ok') {
                setState({
                    pushedOrder: 'ok',
                    pushingOrder: 1
                });
            } else {
                setState({
                    pushedOrder: 'failure',
                    pushingOrder: false
                });
            }
            // console.log('namidev-DEBUG: => ', data)
        } catch (e) {
            console.log(`Can't push order yet `, e);
        }
    };

    const closeModal = () => setState({ openModal: {} });

    const renderAddressInput = useCallback(() => {
        if (!state.selectedNetwork?.depositEnable) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                        {t('wallet:errors.network_not_support_dep', {
                            asset: state.selectedNetwork?.coin,
                            chain: state.selectedNetwork?.network
                        })}
                    </div>
                </div>
            );
        }

        if (!state.address) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:address_not_available')}</div>
                    <div
                        className="bg-dominant px-3 py-1.5 rounded-lg text-sm font-medium text-white mt-3 cursor-pointer
                                     hover:opacity-80"
                        onClick={() => getDepositTokenAddress(true, state.selectedAsset?.assetId, state.selectedNetwork?.network)}
                    >
                        {t('wallet:reveal_address')}
                    </div>
                </div>
            );
        }

        if (!state.address?.address && state.errors?.addressNotFound) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-red text-center">{t('wallet:errors.address_not_found')}</div>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-between hover:!border-dominant">
                <p className="pr-3 font-medium cursor-text break-all">{state.address?.address}</p>
                {state.selectedNetwork?.shouldShowPushDeposit && (
                    <span
                        className={classNames(
                            'mr-3 md:mr-5 font-medium text-xs md:text-sm',
                            state.address.address
                                ? {
                                      'text-gray-2 dark:text-darkBlue-4 select-none whitespace-nowrap cursor-not-allowed':
                                          state.pushingOrder || state.pushingOrder === 1,
                                      'text-dominant whitespace-nowrap select-none hover:opacity-80 cursor-pointer': !(
                                          state.pushingOrder || state.pushingOrder === 1
                                      )
                                  }
                                : 'text-dominant whitespace-nowrap select-none hover:opacity-80 cursor-pointer invisible'
                        )}
                        onClick={() => (!state.pushingOrder || state.pushingOrder !== 1) && onPushOrder(state.selectedAsset?.id)}
                    >
                        {t('wallet:push_order')}
                    </span>
                )}
                <CopyToClipboard text={state.address?.address} onCopy={() => !state.isCopying?.address && onCopy('address')}>
                    <span
                        className={
                            state.address.address
                                ? 'font-bold text-sm hover:opacity-80 cursor-pointer'
                                : 'font-bold text-sm hover:opacity-80 cursor-pointer invisible'
                        }
                    >
                        {state.isCopying?.address ? <Check size={24} color={colors.teal} /> : <Copy size={24} />}
                    </span>
                </CopyToClipboard>
            </div>
        );
    }, [state.address, state.selectedAsset, state.selectedNetwork, state.errors, state.isCopying?.address, state.pushingOrder]);

    const renderMemoInput = useCallback(() => {
        if (!state.selectedNetwork?.memoRegex || !state.address?.addressTag) {
            return null;
        }
        return (
            <div className={'flex items-center justify-between rounded-xl'}>
                <div className="cursor-text break-all">{state.address.addressTag}</div>
                <CopyToClipboard text={state.address.addressTag} onCopy={() => !state.isCopying?.memo && onCopy('memo')}>
                    <span
                        className={
                            state.address.addressTag
                                ? 'font-bold text-sm hover:opacity-80 cursor-pointer'
                                : 'font-bold text-sm hover:opacity-80 cursor-pointer invisible'
                        }
                    >
                        {state.isCopying?.memo ? <Check size={24} /> : <Copy size={24} />}
                    </span>
                </CopyToClipboard>
            </div>
        );
    }, [state.address, state.selectedNetwork, state.isCopying?.memo]);

    const renderQrAddress = useCallback(() => {
        if (state.loadingAddress) {
            return <Skeletor width={qrSize} height={qrSize} />;
        }

        if (!state.address?.address) {
            return (
                <div
                    className="flex items-center justify-center"
                    style={{
                        width: qrSize,
                        height: qrSize
                    }}
                >
                    <Slash size={(qrSize * 30) / 100} />
                </div>
            );
        }

        return (
            <>
                <div className="p-2 w-[200px] bg-white rounded-lg">
                    <QRCodeSVG value={state.address?.address} size="100%" bgColor={colors.white} />
                </div>
            </>
        );
    }, [state.address, state.loadingAddress, currentTheme, qrSize]);

    const renderNotes = useCallback(() => {
        const tokenName = state.selectedAsset?.assetCode;
        const networkType = state.selectedNetwork?.tokenType;
        const isPushOrder = state.selectedNetwork?.shouldShowPushDeposit;

        const noteObj = {};

        if (language === LANGUAGE_TAG.EN) {
            noteObj.common = (
                <>
                    Please carefully check the information about the token, the token network before transferring the token. Only send{' '}
                    <span className="font-medium text-dominant">{tokenName}</span> to this address, sending any other tokens may result in the loss of tokens.
                </>
            );
            noteObj.pushOrder = (
                <>
                    If your Deposit Order has not been updated on Nami, use the <span className="font-medium text-dominant">Push Order</span> button to have
                    Nami update the balance automatically.
                </>
            );
            noteObj.runItBackTitle = <>Having a mistake?</>;
            noteObj.runItBackNotes = (
                <>
                    Depending on the case, Nami Exchange can support to recover tokens when users send wrong token, wrong wallet address or wrong network, the
                    minimum fee for recovery support is 100 USDT, please{' '}
                    <span onClick={() => window?.fcWidget.open()} className="text-dominant cursor-pointer hover:!underline">
                        contact support
                    </span>{' '}
                    for specific advice.
                </>
            );
        } else {
            noteObj.common = (
                <>
                    Người dùng vui lòng kiểm tra kỹ các thông tin về token, mạng lưới token trước khi chuyển token. Chỉ gửi{' '}
                    <span className="font-medium text-dominant">{tokenName}</span> đến địa chỉ này, gửi bất cứ token nào khác có thể dẫn đến việc mất mát token.
                </>
            );
            noteObj.pushOrder = (
                <>
                    Nếu lệnh nạp của bạn chưa được cập nhật trên Nami, vui lòng click vào nút <span className="font-medium text-dominant">Đẩy lệnh</span> để
                    Nami cập nhật số dư tự động.
                </>
            );
            noteObj.runItBackTitle = <>Gặp sự cố nhầm lẫn?</>;
            noteObj.runItBackNotes = (
                <>
                    Tùy từng trường hợp, NamiExchange có thể hỗ trợ khôi phục token khi người dùng gửi nhầm token, sai địa chỉ ví hoặc nhầm mạng, phí hỗ trợ
                    khôi phục tối thiểu là 100 USDT, vui lòng liên hệ{' '}
                    <span onClick={() => window?.fcWidget.open()} className="text-dominant cursor-pointer hover:!underline">
                        {' '}
                        bộ phận hỗ trợ
                    </span>{' '}
                    để được tư vấn cụ thể.
                </>
            );
        }

        return (
            <>
                <div className="relative flex items-center justify-between mb-4">
                    <span className="font-semibold">{t('common:important_notes')}</span>
                    <div>
                        <Tooltip isV3 id="wrongthings" place="left" effect="solid">
                            <div className="w-[320px]">{noteObj.runItBackNotes}</div>
                        </Tooltip>
                        <span
                            data-tip=""
                            data-for="wrongthings"
                            className="inline-block text-sm cursor-pointer text-teal font-semibold"
                            onClick={() => window?.fcWidget?.open()}
                        >
                            {noteObj?.runItBackTitle}
                        </span>
                    </div>
                </div>
                <div className="text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="flex">
                        <div>{noteObj?.common}</div>
                    </div>
                    {isPushOrder && (
                        <div className="flex mt-1.5">
                            <div>{noteObj?.pushOrder}</div>
                        </div>
                    )}
                </div>
            </>
        );
    }, [language, state.selectedAsset, state.selectedNetwork]);

    const renderMemoNotice = useCallback(() => {
        const isMemoNotice = WITH_MEMO.includes(state.selectedNetwork?.network) && state.selectedNetwork?.depositEnable;
        if (!isMemoNotice) return null;

        let msg;
        if (language === LANGUAGE_TAG.VI) {
            msg = (
                <>
                    Cần cả 2 trường <span className="text-dominant font-medium">MEMO</span> và <span className="text-dominant font-medium">Địa chỉ</span> để nạp
                    thành công {state.selectedAsset?.assetCode}.<br /> Nami sẽ không xử lý các lệnh nạp thiếu thông tin yêu cầu.
                </>
            );
        } else {
            msg = (
                <>
                    Both a <span className="text-dominant font-medium">MEMO</span> and an <span className="text-dominant font-medium">Address</span> are
                    required to successfully deposit your {state.selectedAsset?.assetCode}.
                    <br />
                    NamiExchange will not handle any deposit which lacks information.
                </>
            );
        }

        return (
            <ModalV2 isVisible={state.openModal?.memoNotice} className="w-[320px]">
                <div className="text-center text-sm font-medium w-full">
                    <div className="my-2 text-center font-bold text-[18px]">{t('common:important_notes')}</div>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{msg}</div>
                    <div className="mt-4 w-full flex flex-row items-center justify-between">
                        <Button title={t('common:confirm')} type="primary" componentType="button" className="!py-2" onClick={closeModal} />
                    </div>
                </div>
            </ModalV2>
        );
    }, [state.selectedNetwork, state.selectedAsset?.assetCode, state.openModal?.memoNotice, language]);

    const renderDepHistory = useCallback(() => {
        const data = state.histories || [];
        const dataFilter = status ? data.filter((rs) => rs.status === status) : data;

        let tableStatus;

        const columns = [
            {
                key: 'txId',
                dataIndex: 'txId',
                title: 'TxHash',
                align: 'left',
                render: (txHash) => {
                    return txHash ? shortHashAddress(txHash, 6, 6) : '--';
                }
            },
            {
                key: 'asset',
                dataIndex: 'assetId',
                title: t('common:asset'),
                align: 'left',
                render: (assetId) => {
                    const config = mapAssetConfig[assetId] || {};
                    return (
                        <div className="flex items-center whitespace-nowrap">
                            <AssetLogo size={30} assetId={assetId} />
                            <span className="ml-2">{config.assetCode}</span>
                        </div>
                    );
                }
            },
            {
                key: 'network',
                dataIndex: 'network',
                title: t('wallet:network'),
                align: 'left'
            },
            {
                key: 'time',
                dataIndex: 'executeAt',
                title: t('common:time'),
                // width: 100,
                align: 'left',
                render: (time) => {
                    return time && format(new Date(time), 'dd/MM/yyy');
                }
            },
            {
                key: 'amount',
                dataIndex: 'amount',
                title: t('common:amount'),
                align: 'right',
                render: (amount) => formatWallet(amount)
            },
            {
                key: 'address',
                dataIndex: ['metadata', 'address'],
                title: t('common:address_wallet'),
                align: 'right',
                render: (address) => {
                    return address ? shortHashAddress(address, 6, 6) : '--';
                }
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: t('common:status'),
                // width: 160,
                align: 'right',
                render: (status) =>
                    ({
                        [DepWdlStatus.Success]: (
                            <TagV2 icon={false} className="ml-auto" type="success">
                                {t('common:success')}
                            </TagV2>
                        ),
                        [DepWdlStatus.Pending]: (
                            <TagV2 icon={false} className="ml-auto" type="warning">
                                {t('common:pending')}
                            </TagV2>
                        ),
                        [DepWdlStatus.Declined]: (
                            <TagV2 icon={false} className="ml-auto" type="failed">
                                {t('common:declined')}
                            </TagV2>
                        )
                    }[status])
            }
        ];

        if (!state.histories?.length) {
            tableStatus = <Empty />;
        }

        return (
            <TableV2
                useRowHover
                data={dataFilter}
                columns={columns}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                pagingClassName="border-none"
                limit={10}
                page={currentPage}
                onChangePage={setCurrentPage}
                tableStyle={{
                    height: '64px',
                    fontSize: '1rem'
                }}
            />
        );
    }, [state.loadingHistory, state.histories, state.blockConfirm, width, status]);

    const renderPushedOrderNotice = useCallback(() => {
        if (!state.pushedOrder) return null;
        let msg;
        if (language === LANGUAGE_TAG.VI) {
            msg = (
                <>
                    Yêu cầu đẩy lệnh đã được ghi nhận, <br /> vui lòng chờ trong giây lát.
                </>
            );
        } else {
            msg = (
                <>
                    Your push request has been record, <br /> please wait a moment.
                </>
            );
        }

        return (
            <Modal isVisible={!!state.pushedOrder} title={t('modal:notice')} onBackdropCb={() => setState({ pushedOrder: null })}>
                <div className="text-sm text-center mt-5">{msg}</div>
                <div className="mt-4 w-full flex flex-row items-center justify-between">
                    <Button
                        title={t('common:confirm')}
                        type="primary"
                        componentType="button"
                        className="!py-2"
                        onClick={() => setState({ pushedOrder: null })}
                    />
                </div>
            </Modal>
        );
    }, [state.pushedOrder, language]);

    // useEffect(() => {
    //     if (!socket?._callbacks['$deposit::update_history_row']) {
    //         socket?.on('deposit::update_history_row', (data) =>
    //             updateBlockConfirmationEvent(data, state.blockConfirm)
    //         )
    //     }
    //     return socket?.removeListener('deposit::update_history_row', (data) =>
    //         updateBlockConfirmationEvent(data, state.blockConfirm)
    //     )
    // }, [socket, state.blockConfirm])

    useEffect(() => {
        getDepositHistory(state.historyPage);
    }, [state.historyPage]);

    useEffect(() => {
        getDepositTokenAddress(false, state.selectedAsset?.assetId, state.selectedNetwork?.network);

        if (WITH_MEMO.includes(state.selectedNetwork?.network)) {
            setState({ openModal: { memoNotice: true } });
        } else {
            setState({ openModal: { memoNotice: false } });
        }
    }, [state.selectedNetwork, state.selectedAsset]);

    useEffect(() => {
        const asset = get(router?.query, 'asset', 'VNDC');

        if (paymentConfigs && asset) {
            const selectedAsset = find(paymentConfigs, (o) => o?.assetCode === asset);
            const defaultNetwork = selectedAsset?.networkList?.find((o) => o.isDefault) || selectedAsset?.networkList?.[0];
            selectedAsset && setState({ selectedAsset });
            defaultNetwork && setState({ selectedNetwork: defaultNetwork });
        }
    }, [router, paymentConfigs]);

    useEffect(() => {
        let interval;
        if (focused) {
            interval = setInterval(() => getDepositHistory(state.historyPage, true), 30000);
        }
        return () => interval && clearInterval(interval);
    }, [focused, state.historyPage]);

    // Handle check KYC:
    const auth = useSelector((state) => state.auth.user) || null;
    const isOpenModalKyc = useMemo(() => {
        return auth ? auth?.kyc_status !== 2 : false;
    }, [auth]);

    const listStatus = [
        {
            label: t('common:all'),
            value: null
        },
        {
            label: t('common:success'),
            value: DepWdlStatus.Success
        },
        {
            label: t('common:pending'),
            value: DepWdlStatus.Pending
        },
        {
            label: t('common:declined'),
            value: DepWdlStatus.Declined
        }
    ];

    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className="mal-container px-4">
                    <div className="flex items-center justify-between mb-10">
                        <span className="font-semibold text-[2rem] leading-[3rem]">{t('common:deposit')}</span>
                        <div
                            className="flex items-center font-semibold text-teal cursor-pointer"
                            onClick={() => {
                                router.push(PATHS.WALLET.EXCHANGE.WITHDRAW + '?asset=' + state.selectedAsset?.assetCode);
                            }}
                        >
                            <span className="mr-2">{t('wallet:withdraw_crypto')}</span>
                            <ChevronRight size={16} color={colors.teal} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div
                            className={classNames(
                                'rounded-3xl p-6 space-y-4 nami-light-shadow bg-white',
                                'dark:border dark:border-divider-dark dark:shadow-none dark:bg-dark-dark'
                            )}
                        >
                            <CryptoSelect t={t} selected={state?.selectedAsset} />
                            <NetworkSelect
                                t={t}
                                selected={state.selectedNetwork}
                                networkList={state.selectedAsset?.networkList}
                                onSelect={(value) => {
                                    setState({
                                        selectedNetwork: value
                                    });
                                }}
                            />

                            <div className="relative bg-gray-13 dark:bg-darkBlue-3 rounded-xl px-4 pt-5 pb-6 cursor-pointer">
                                <p className="mb-2 text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:deposit_address')}</p>
                                {renderAddressInput()}
                            </div>
                            {state.address?.addressTag && state.selectedNetwork?.memoRegex && (
                                <div className="relative bg-darkBlue-3 rounded-xl px-4 pt-5 pb-6 cursor-pointer">
                                    <p className="mb-2 dark:text-txtSecondary-dark">Memo</p>
                                    {renderMemoInput()}
                                </div>
                            )}

                            <div className="flex items-center justify-between !mt-6">
                                <span className="text-txtSecondary dark:text-txtSecondary-dark"> {t('wallet:expected_unlock')}</span>
                                <span className="font-semibold">
                                    <span className="mr-2">{Math.max(state.selectedNetwork?.minConfirm, state.selectedNetwork?.unLockConfirm)}</span>
                                    <span>{t('wallet:network_confirmation')}</span>
                                </span>
                            </div>
                        </div>
                        <div
                            className="rounded-xl flex flex-col justify-between px-8 pt-12 pb-10"
                            style={{
                                backgroundImage: `url(${getS3Url(
                                    `/images/screen/wallet/bg_mesh_gradient_${currentTheme === THEME_MODE.DARK ? 'dark' : 'light'}.png`
                                )})`,
                                backgroundSize: 'cover'
                            }}
                        >
                            <div className="flex items-start justify-center flex-1">{renderQrAddress()}</div>
                            <div className="mt-8">{renderNotes()}</div>
                        </div>
                    </div>

                    <div className="text-2xl font-semibold mt-20">{t('wallet:dep_history')}</div>
                    <div className="space-x-3 flex items-center my-6">
                        {listStatus.map((rs, i) => (
                            <div
                                key={i}
                                onClick={() => setStatus(rs.value)}
                                className={`px-5 py-3 text-txtSecondary dark:text-txtSecondary-dark ring-1 ring-divider dark:ring-divider-dark w-max rounded-full cursor-pointer ${
                                    status === rs.value ? '!text-teal font-semibold !ring-teal' : ''
                                }`}
                            >
                                {rs.label}
                            </div>
                        ))}
                    </div>
                    <div className="bg-white dark:bg-dark dark:border dark:border-divider-dark rounded-xl pt-4 mt-6 mb-32">{renderDepHistory()}</div>
                </div>
            </Background>
            {renderMemoNotice()}
            {renderPushedOrderNotice()}
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
        </MaldivesLayout>
    );
};

const Background = styled.div.attrs({ className: 'w-full h-full pt-20' })`
    background-color: ${({ isDark }) => (isDark ? colors.dark.dark : colors.gray['13'])};
`;

const IGNORE_TOKEN = [
    'XBT_PENDING',
    'TURN_CHRISTMAS_2017_FREE',
    'USDT_BINANCE_FUTURES',
    'SPIN_SPONSOR',
    'SPIN_BONUS',
    'SPIN_CONQUEST',
    'TURN_CHRISTMAS_2017',
    'SPIN_CLONE'
];

const HISTORY_SIZE = 6;

const WITH_MEMO = ['BNB', 'VITE'];

const depositLinkBuilder = (asset) => {
    return `${PATHS.WALLET.EXCHANGE.DEPOSIT}?asset=${asset}`;
};

export default ExchangeDeposit;
