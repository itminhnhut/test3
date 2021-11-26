import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildDepositExplorerUrl, buildExplorerUrl, formatTime, formatWallet, shortHashAddress, updateOrInsertDepositHistory } from 'redux/actions/utils'
import { Trans, useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { Check, ChevronLeft, ChevronRight, Copy, Search, Slash, X } from 'react-feather'
import { API_GET_DEPOSIT_HISTORY, API_GET_WALLET_CONFIG, API_REVEAL_DEPOSIT_TOKEN_ADDRESS } from 'redux/actions/apis'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DepositStatus } from 'redux/actions/const'
import { LANGUAGE_TAG } from 'hooks/useLanguage'
import { ApiStatus } from 'redux/actions/const'
import { find, get, pick } from 'lodash'
import { useSelector } from 'react-redux'
import { log } from 'utils'

import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useOutsideClick from 'hooks/useOutsideClick'
import useWindowFocus from 'hooks/useWindowFocus'
import useWindowSize from 'hooks/useWindowSize'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import ChevronDown from 'components/svg/ChevronDown'
import AssetLogo from 'components/wallet/AssetLogo'
import Skeletor from 'components/common/Skeletor'
import QRCode from 'qrcode.react'
import MCard from 'components/common/MCard'
import Empty from 'components/common/Empty'
import Link from 'next/link'

import styled from 'styled-components'
import colors from 'styles/colors'
import Axios from 'axios'
import ReTable from 'components/common/ReTable'


const INITIAL_STATE = {
    type: 1, // 0. fiat, 1. crypto
    loadingConfigs: false,
    configs: null,
    selectedAsset: null,
    selectedNetwork: null,
    networkList: null,
    openList: {},
    search: '',
    address: '',
    loadingAddress: false,
    memo: '',
    errors: {},
    isCopying: {},
    histories: null,
    loadingHistory: false,
    historyPage: 0,
    blockConfirm: {},

    // Add new state here
}

const TYPE = {
    fiat: 0,
    crypto: 1
}

const ExchangeDeposit = () => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    const cryptoListRef = useRef()
    const cryptoListSearchRef = useRef()
    const networkListRef = useRef()

    // Rdx
    const socket = useSelector(state => state.socket.userSocket)

    // Use Hooks
    const router = useRouter()
    const focused = useWindowFocus()
    const [currentTheme, ] = useDarkMode()
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()

    useOutsideClick(cryptoListRef, () => state.openList?.cryptoList && setState({ openList: {} }))
    useOutsideClick(networkListRef, () => state.openList?.networkList && setState({ openList: {} }))

    const qrSize = useMemo(() => {
        let _ = 110

        if (state.address?.memo) {
            if (width >= 768) _ = 120
            if (width >= 1280) _ = 140
        } else {
            if (width >= 768) _ = 160
        }


        return _
    }, [state.address?.memo, width])

    // Helper
    const getDepositConfig = async () => {
        setState({ loadingConfigs: true })

        try {
            const { data } = await Axios.get(API_GET_WALLET_CONFIG)
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                const configs = Object.values(data.data)
                setState({ configs })
            }
        } catch (e) {
            console.log(`Can't get deposit config `, e)
        } finally {
            setState({ loadingConfigs: false })
        }
    }

    const getDepositTokenAddress = async (createIfNotExist, currency, tokenTypeIndex) => {
        if (!currency || typeof tokenTypeIndex !== 'number') {
            return
        }

        setState({ address: '', loadingAddress: true })
        try {
            const { data } = await Axios.post(API_REVEAL_DEPOSIT_TOKEN_ADDRESS,
                {currency, tokenTypeIndex, createIfNotExist})
            if (data && data?.status === 'ok') {
                // setState({ address: {...data.data, memo: 'abcxyszmemo34723'} })
                setState({ address: data.data })
            }
            if (data?.status === 'error') {
                setState({ errors: { ...state.errors, addressNotFound: true } })
            }
        } catch (e) {
            console.log('Address not exist!')
        } finally {
            setState({ loadingAddress: false })
        }
    }

    const getDepositHistory = async (pageIndex, isReNew = false) => {
        !isReNew && setState({ loadingHistory: true })

        try {
            const { data } = await Axios.get(API_GET_DEPOSIT_HISTORY, { params: { pageIndex, pageSize: HISTORY_SIZE } })

            if (data?.status === ApiStatus.SUCCESS) {
                setState({ histories: data?.data })
            }
        } catch (e) {
            console.log(`Can't get deposit history `, e)
        } finally {
            setState({ loadingHistory: false })
        }
    }

    const updateBlockConfirmationEvent = (data, blockConfirmOrigin) => {
        log.i('Deposit socket => ', data)
        const { command, ...rest } = data
        switch (command) {
            case 'update':
                updateOrInsertDepositHistory(pick(rest.data, ['_history_type', 'id']), rest.data)
                break
            case 'update_block_confirmation':
                const { _history_type, _history_id, blockConfirmations } = rest.data
                setState({ blockConfirm: {...blockConfirmOrigin, [`history:${_history_type}:${_history_id}`]: blockConfirmations } })
                break
        }
    }

    const onChangeAsset = () => {
        setState({
            search: '',
            openList: {},
            errors: {},
            address: '',
            selectedNetwork: null,
        })
    }

    const onSearchClear = () => {
        setState({ search: '' })
        cryptoListSearchRef?.current?.focus()
    }

    const onCopy = (key) => {
        setState({ isCopying : { [key]: true }})
        try {
            setTimeout(() =>  setState({ isCopying : { [key]: false }}), 1000)
        } catch (err) {
        }
    }

    // Render Handler
    const renderTab = useCallback(() => {
        return (
            <div className="mt-5 flex items-end">
                {/*<Link href={{*/}
                {/*    pathname: '/wallet/exchange/deposit',*/}
                {/*    query: { type: 'fiat' }*/}
                {/*}}>*/}
                <a className={state.type === TYPE.fiat ?
                    'mr-6 flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark cursor-not-allowed'
                    : 'mr-6 flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark cursor-not-allowed'}
                   title={'Coming soon'}
                >
                    <div className="pb-2.5">{t('common:buy')} VNDC</div>
                    <div className={state.type === TYPE.fiat ? 'w-[50px] h-[3px] md:h-[2px] bg-dominant' : 'w-[50px] h-[3px] md:h-[2px] bg-dominant invisible'}/>
                </a>
                {/*</Link>*/}
                <Link href={{
                    pathname: '/wallet/exchange/deposit',
                    query: { type: 'crypto' }
                }} prefetch={false}>
                    <a className={state.type === TYPE.crypto ?
                        'flex flex-col items-center font-bold text-sm lg:text-[16px] text-Primary dark:text-Primary-dark'
                        : 'flex flex-col items-center font-medium text-sm lg:text-[16px] text-txtSecondary dark:text-txtSecondary-dark'}>
                        <div className="pb-2.5">{t('common:crypto')}</div>
                        <div className={state.type === TYPE.crypto ? 'w-[50px] h-[3px] md:h-[2px] bg-dominant' : 'w-[50px] h-[3px] md:h-[2px] bg-dominant invisible'}/>
                    </a>
                </Link>
            </div>
        )
    }, [router, state.type])

    const renderDepositFiat = useCallback(() => {
        if (state.type !== TYPE.fiat) return null

        return (
            <div>Fiat Section</div>
        )
    }, [state.type])

    const renderDepositInput = useCallback(() => {
        return (
            <>
                <div className="flex items-center">
                    <AssetLogo assetCode={state.selectedAsset?.assetCode}/>
                    <span className="ml-2 font-bold text-sm text-txtPrimary dark:text-txtPrimary-dark">
                        {state.selectedAsset?.assetCode || '--'}
                    </span>
                    <span className="ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {state.selectedAsset?.fullName || '--'}
                    </span>
                </div>
                <div className={state.openList?.cryptoList ? 'rotate-180' : ''}>
                    <ChevronDown size={16} color={currentTheme === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue}/>
                </div>
            </>
        )
    }, [state.type, state.selectedAsset, state.openList, currentTheme ])

    const renderCryptoList = useCallback(() => {
        if (!state.configs) return null
        let origin = state.configs || []
        let items = []

        if (state.search) {
            origin = state.configs && [...state.configs].filter(e => e?.assetCode?.includes(state.search.toUpperCase()))
        }

        origin.forEach(cfg => {
            if (!IGNORE_TOKEN.includes(cfg?.assetCode)) {
                items.push(
                    <Link key={`wdl_cryptoList__${cfg?.assetCode}`}
                          href={depositLinkBuilder(state.type, cfg?.assetCode)}
                          prefetch={false}>
                        <a className={state.selectedAsset?.assetCode === cfg?.assetCode ?
                            'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 bg-teal-opacity cursor-pointer'
                            : 'flex items-center justfify-between w-full px-3.5 py-2.5 md:px-5 hover:bg-teal-opacity cursor-pointer'}
                           onClick={onChangeAsset}>
                            <div className="flex items-center w-full">
                                <AssetLogo assetCode={cfg?.assetCode} size={24}/>
                                <span className="font-bold text-sm ml-2">{cfg?.assetCode}</span>
                                <span className="font-medium text-sm ml-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    {cfg?.fullName || cfg?.assetCode}
                                </span>
                            </div>
                            <div>
                                {state.selectedAsset?.assetCode === cfg?.assetCode && <Check size={16}/>}
                            </div>
                        </a>
                    </Link>
                )
            }
        })

        return (
            <div className="pt-3.5 md:pt-4 absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden"
                 ref={cryptoListRef}>
                <div className="px-3.5 md:px-5">
                    <div className="flex items-center bg-gray-4 dark:bg-darkBlue-3 px-2.5 py-1.5 mb-3.5 rounded-lg">
                        <Search size={16}/>
                        <input className="w-full px-2.5 text-sm font-medium"
                               value={state.search}
                               ref={cryptoListSearchRef}
                               onChange={e => setState({ search: e.target?.value })}
                               placeholder={t('wallet:search_asset')}/>
                        <X size={16} onClick={onSearchClear} className="cursor-pointer"/>
                    </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                    {!items.length ? <div className="py-6"><Empty grpSize={68} message={t('common:not_found')} messageStyle="text-sm"/></div> : items}
                </div>
            </div>
        )
    }, [state.configs, state.type, state.search, state.selectedAsset])

    const renderNetworkInput = useCallback(() => {
        return (
            <>
                <div className={state.selectedNetwork?.allowDeposit ? 'flex items-center' : 'flex items-center opacity-40'}>
                    <span className="font-bold text-sm text-dominant">
                        {getTokenType(state.selectedNetwork?.tokenType) || '--'}
                    </span>
                    <span className="ml-2 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        {state.selectedNetwork && (state.selectedNetwork?.displayNetwork || '--')}
                    </span>
                </div>
                <div className={state.openList?.networkList ? 'rotate-180' : ''}>
                    <ChevronDown size={16} color={currentTheme === THEME_MODE.DARK ? colors.grey4 : colors.darkBlue}/>
                </div>
            </>
        )
    }, [state.selectedNetwork, state.openList])

    const renderNetworkList = useCallback(() => {
        if (!state.networkList) return null

        const items = []

        state.networkList.forEach(nw => {
            items.push(
                <div key={`wdl_networkList___${nw?.tokenType}`}
                     className={nw?.allowDeposit ?
                         'flex items-center justify-between px-3.5 py-3 md:px-5 hover:bg-teal-opacity cursor-pointer'
                         : 'flex items-center justify-between px-3.5 py-3 md:px-5 cursor-not-allowed opacity-40'}
                     onClick={() => setState({ selectedNetwork: nw, openList: {} })}>
                    <div>
                        <span className="text-sm font-medium">{getTokenType(nw?.tokenType)}</span>
                        <span className="ml-2 text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">{nw?.displayNetwork}</span>
                    </div>
                    {state.selectedNetwork?.tokenType === nw?.tokenType && <Check size={16}/>}
                </div>
            )
        })

        return (
            <div className="absolute z-10 top-full mt-1.5 left-0 md:left-[16px] w-full bg-bgContainer
                            dark:bg-bgContainer-dark border border-divider dark:border-divider-dark rounded-xl
                            shadow-common dark:shadow-none overflow-hidden"
                 ref={networkListRef}>
                <div className="max-h-[200px] overflow-y-auto">
                    {!items.length ?
                        <div className="py-6 h-full w-full items-center justify-center">
                            Chưa hỗ trợ rút đối với token {state.selectedAsset?.assetCode}
                        </div>
                        : items}
                </div>
            </div>
        )
    }, [state.networkList, state.selectedNetwork])

    const renderAddressInput = useCallback(() => {
        if (state.address === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark">
                        {t('wallet:address_not_available')}
                    </div>
                    <div className="bg-dominant px-3 py-1.5 rounded-lg text-sm font-medium text-white mt-3 cursor-pointer
                                     hover:opacity-80"
                         onClick={() => getDepositTokenAddress(true, state.selectedNetwork?.assetCode, state.selectedNetwork?.tokenTypeIndex)}>
                        {t('wallet:reveal_address')}
                    </div>
                </div>
            )
        }

        if (!state.address?.address && state.errors?.addressNotFound) {
            return (
                <div className="flex flex-col items-center justify-center py-3">
                    <div className="text-sm font-medium text-red text-center">
                        {t('wallet:errors.address_not_found')}
                    </div>
                </div>
            )
        }

        return (
            <div className="min-h-[55px] max-h-[55px] lg:min-h-[62px] lg:max-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center
                            justify-between rounded-xl border border-divider dark:border-divider-dark
                            hover:!border-dominant">
                <div className="w-full font-medium text-xs sm:text-sm pr-3 cursor-text break-all">
                    {state.address?.address}
                </div>
                {state.selectedNetwork?.shouldShowPushDeposit && <span
                    className={state.address.address ? 'mr-3 md:mr-5 font-medium text-xs md:text-sm text-dominant whitespace-nowrap select-none hover:opacity-80 cursor-pointer'
                        : 'mr-3 md:mr-5 font-medium text-xs md:text-sm text-dominant whitespace-nowrap select-none hover:opacity-80 cursor-pointer invisible'}
                    // onClick={() => null}
                >
                     Push order
                </span>}
                <CopyToClipboard text={state.address?.address} onCopy={() => !state.isCopying?.address && onCopy('address')}>
                    <span className={state.address.address ? 'font-bold text-sm hover:opacity-80 cursor-pointer'
                        : 'font-bold text-sm hover:opacity-80 cursor-pointer invisible'}
                    >
                     {state.isCopying?.address ? <Check size={16}/> : <Copy size={16}/>}
                </span>
                </CopyToClipboard>
            </div>
        )
    }, [state.address, state.selectedNetwork, state.errors, state.isCopying?.address])

    const renderMemoInput = useCallback(() => {
        if (state.address?.memo) {
            return (
                <div className="min-h-[55px] max-h-[55px] lg:min-h-[62px] lg:max-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center
                            justify-between rounded-xl border border-divider dark:border-divider-dark
                            hover:!border-dominant">
                    <div className="w-full font-medium text-xs sm:text-sm pr-3 cursor-text break-all">
                        {state.address?.memo}
                    </div>
                    <CopyToClipboard text={state.address?.memo} onCopy={() => !state.isCopying?.memo && onCopy('memo')}>
                    <span className={state.address.memo ? 'font-bold text-sm hover:opacity-80 cursor-pointer'
                        : 'font-bold text-sm hover:opacity-80 cursor-pointer invisible'}
                    >
                     {state.isCopying?.memo ? <Check size={16}/> : <Copy size={16}/>}
                </span>
                    </CopyToClipboard>
                </div>
            )
        }

        return null
    }, [state.address, state.isCopying?.memo])

    const renderDepositConfirmBlocks = useCallback(() => {
        let inner

        if (language === LANGUAGE_TAG.EN) {
            inner =  <>After having <span className="text-dominant font-bold">
                            {state.selectedNetwork?.depositConfirmationBlocks}</span> confirmation block</>
        } else {
            inner = <>Sau khi có <span className="text-dominant font-bold">
                            {state.selectedNetwork?.depositConfirmationBlocks}</span> xác nhận</>
        }

        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:expected_unlock')}
                </span>
                <span className="font-medium ml-2">
                    {state.selectedNetwork?.depositConfirmationBlocks ? inner : '--'}
                </span>
            </div>
        )
    }, [state.selectedNetwork, language])

    const renderQrAddress = useCallback(() => {

        if (state.loadingAddress) {
            return <Skeletor width={qrSize}
                             height={qrSize}/>
        }

        if (!state.address?.address) {
            return (
                <div className="ml-3.5 md:ml-6 flex items-center justify-center" style={{ width: qrSize, height: qrSize}}>
                    <Slash size={qrSize * 30 / 100}/>
                </div>
            )
        }

        return (
            <div className="ml-3.5 md:ml-6">
                {state.address?.memo && <div className="text-center text-sm font-bold mb-3.5">
                    {t('wallet:scan_address_qr')}
                </div>}
                <div style={currentTheme === THEME_MODE.LIGHT ?
                    { boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03)' }
                    : undefined} className="p-2 bg-white">
                    <QRCode value={state.address?.address}
                            size={qrSize}
                            bgColor={colors.white}/>
                </div>
            </div>
        )
    }, [state.address, state.loadingAddress, currentTheme, qrSize])

    const renderQrMemo = useCallback(() => {
        if (!state.address?.memo) return null

        if (state.loadingAddress) {
            return <Skeletor width={qrSize}
                             height={qrSize}/>
        }

        return (
            <div className="ml-3.5 md:ml-6">
                <div className="text-center text-sm font-bold mb-3.5">
                    {t('common:scan')} Memo
                </div>
                <div style={currentTheme === THEME_MODE.LIGHT ?
                    { boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.05), 0px 25px 35px rgba(0, 0, 0, 0.03)' }
                    : undefined} className="p-2 bg-white">
                    <QRCode value={state.address?.memo}
                            size={qrSize}
                            bgColor={colors.white}/>
                </div>
            </div>
        )
    }, [state.address, state.loadingAddress, currentTheme, qrSize])

    const renderMinDep = () => {
        return (
            <div className="flex items-center text-sm mt-2.5">
                <span className="text-txtSecondary dark:text-txtSecondary-dark">
                    {t('wallet:minimum_deposit')}
                </span>
                <span className="font-bold ml-2">
                    --
                </span>
            </div>
        )
    }

    const renderNotes = useCallback(() => {
        let note_1

        if (language === LANGUAGE_TAG.EN) {
            note_1 = <>
                Depending on the case, Nami Exchange can support to recover tokens when users
                send wrong token, wrong wallet address or wrong network, the minimum fee for
                recovery support is 100 USDT, please <Link href="/"><a className="text-dominant hover:!underline">contact support</a></Link> for specific advice.
            </>
        } else {
            note_1 = <>
                Depending on the case, Nami Exchange can support to recover tokens when users
                send wrong token, wrong wallet address or wrong network, the minimum fee for
                recovery support is 100 USDT, please <Link href="/"><a className="text-dominant hover:!underline">contact support</a></Link> for specific advice.
            </>
        }

        return (
            <>
                <div className="font-medium text-sm">{t('common:important_notes')}:</div>
                <div className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark mt-2.5 pr-3 xl:pr-10">
                   <div className="flex">
                       <span className="mx-2 xl:mx-3.5">&bull;</span>
                       <div>
                           {note_1}
                       </div>
                   </div>
                </div>
            </>
        )
    }, [language])

    const renderDepHistory = useCallback(() => {
        const data = dataHandler(
            state.histories,
            state.loadingHistory,
            state.configs,
            { getAssetName, t, blockConfirm: state.blockConfirm }
        )
        let tableStatus

        const columns = [
            { key: 'id', dataIndex: 'id', title: 'Order#ID', width: 100, fixed: 'left', align: 'left' },
            { key: 'asset', dataIndex: 'asset', title: 'Asset', width: 100, align: 'left' },
            { key: 'amount', dataIndex: 'amount', title: 'Amount', width: 100, align: 'right' },
            { key: 'address', dataIndex: 'address', title: 'Address', width: 100, align: 'right' },
            { key: 'network', dataIndex: 'network', title: 'Network', width: 100, align: 'right' },
            { key: 'txhash', dataIndex: 'txhash', title: 'TxHash', width: 100, align: 'right' },
            { key: 'time', dataIndex: 'time', title: 'Time', width: 100, align: 'right' },
            { key: 'status', dataIndex: 'status', title: 'Status', width: 100, align: 'right' },
        ]

        if (!state.histories?.length) {
            tableStatus = <Empty/>
        }

        return (
            <ReTable
                useRowHover
                data={data}
                columns={columns}
                rowKey={item => item?.key}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                tableStyle={{
                    paddingHorizontal: width >= 768 ? '1.75rem' : '0.75rem',
                    tableStyle: { minWidth: '888px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < 1366,
                    noDataStyle: {
                        minHeight: '280px'
                    }
                }}
            />
        )
    }, [state.configs, state.loadingHistory, state.histories, state.blockConfirm, width])

    const renderPagination = useCallback(() => {
        return (
            <div className="w-full mt-6 mb-10 flex items-center justify-center select-none">
                <div className={state.historyPage !== 0 ? 'flex items-center text-md font-medium cursor-pointer hover:!text-dominant'
                    : 'flex items-center text-md font-medium cursor-not-allowed text-txtSecondary dark:text-txtSecondary-dark'}
                     onClick={() => state.historyPage !== 0 && setState({ historyPage: state.historyPage - 1 })}>
                    <ChevronLeft size={18} className="mr-2"/> {language === LANGUAGE_TAG.VI ? 'Trước' : 'Previous'}
                </div>
                <div className={state.histories?.length ? 'ml-10 flex items-center text-md font-medium cursor-pointer hover:!text-dominant'
                    : 'ml-10 flex items-center text-md font-medium cursor-not-allowed text-txtSecondary dark:text-txtSecondary-dark'}
                     onClick={() => state.histories?.length && setState({ historyPage: state.historyPage + 1 })}>
                    {language === LANGUAGE_TAG.VI ? 'Kế tiếp' : 'Next'} <ChevronRight size={18} className="ml-2"/>
                </div>
            </div>
        )
    }, [state.historyPage, state.histories, language])

    useEffect(() => {
        getDepositConfig()
        if (!socket?._callbacks['$deposit::update_history_row']) {
            socket?.on('deposit::update_history_row', (data) => updateBlockConfirmationEvent(data, state.blockConfirm))
        }
    }, [])

    useEffect(() => {
        if (!socket?._callbacks['$deposit::update_history_row']) {
            socket?.on('deposit::update_history_row', (data) => updateBlockConfirmationEvent(data, state.blockConfirm))
        }
        return socket?.removeListener('deposit::update_history_row', data => updateBlockConfirmationEvent(data, state.blockConfirm))
    }, [socket, state.blockConfirm])

    useEffect(() => {
        getDepositHistory(state.historyPage)
    }, [state.historyPage])

    useEffect(() => {
        getDepositTokenAddress(false, state.selectedNetwork?.assetCode, state.selectedNetwork?.tokenTypeIndex)
    }, [state.selectedNetwork])

    useEffect(() => {
        const type = get(router?.query, 'type', 'crypto')
        const asset = get(router?.query, 'asset', 'VNDC')

        if (type && type === 'crypto') {
            setState({ type: TYPE.crypto })
        }
        // else {
        //     setState({ type: TYPE.fiat })
        // }

        if (state.configs && asset) {
            const selectedAsset = find(state.configs, o => o?.assetCode === asset)
            selectedAsset && setState({ selectedAsset })
        }
    }, [state.configs, router])

    useEffect(() => {
        if (state.selectedAsset) {
            const networkList = []

            const { tokenType,
                allowDeposit,
                network,
                displayNetwork,
                assetDigit,
                depositConfirmationBlocks,
                currency,
                shouldShowPushDeposit
            } = state.selectedAsset

            if (allowDeposit && allowDeposit.length) {
                allowDeposit.forEach((isAllow, index) =>
                    // isAllow
                    // &&
                    networkList.push({
                        allowDeposit: isAllow,
                        assetDigit,
                        assetCode: currency,
                        tokenType: tokenType[index],
                        tokenTypeIndex: index,
                        network: network[index],
                        displayNetwork: displayNetwork[index],
                        depositConfirmationBlocks: depositConfirmationBlocks[index],
                        shouldShowPushDeposit: shouldShowPushDeposit[index],

                    }))
            }
            setState({ networkList })
            if (networkList.length) {
                const index = networkList.findIndex(item => item?.allowDeposit)
                index !== -1 && index !== undefined && setState({ selectedNetwork: networkList?.[index] })
            }
        }
    }, [state.selectedAsset])

    useEffect(() => {
        let interval
        if (focused) {
            interval = setInterval(() => getDepositHistory(state.historyPage, true), 2800)
        }
        return () => interval && clearInterval(interval)
    }, [focused, state.historyPage])

    // useEffect(() => {
    //     console.log('namidev-DEBUG: state => ', state)
    // }, [state])

    return (
        <MaldivesLayout>
            <Background isDark={currentTheme === THEME_MODE.DARK}>
                <div className="mal-container px-4">
                    <div className="t-common mb-4">
                       <span className="max-w-[150px] flex items-center cursor-pointer rounded-lg hover:text-dominant"
                             onClick={() => router?.back()}>
                           <span className="inline-flex items-center justify-center h-full mr-3 mt-0.5"><ChevronLeft size={24}/></span>
                           {t('common:deposit')}
                       </span>
                    </div>
                    {renderTab()}
                    <MCard addClass="pt-12 pb-10 px-6 lg:px-16 xl:px-8">
                        <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center">
                            <div className="w-full xl:w-1/2 max-w-[453px] xl:ml-16 xl:mr-16 xl:mr-32">
                                {renderDepositFiat()}
                                {state.type === TYPE.crypto &&
                                <>
                                    <div className="relative">
                                        <div className="mb-1.5 text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:crypto_select')}
                                        </div>
                                        <div className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
                                             onClick={() => state.configs && setState({ openList: { cryptoList: !state.openList?.cryptoList } })}>
                                            {renderDepositInput()}
                                        </div>
                                        {state.openList?.cryptoList && renderCryptoList()}
                                    </div>
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:network')}
                                            {/*<span>{state.validator?.allowDeposit && <Check size={16} className="text-dominant"/>}</span>*/}
                                        </div>
                                        <div className="min-h-[55px] lg:min-h-[62px] px-3.5 py-2.5 md:px-5 md:py-4 flex items-center justify-between
                                                    rounded-xl border border-divider dark:border-divider-dark cursor-pointer select-none hover:!border-dominant"
                                             onClick={() => state.configs && setState({ openList: { networkList: !state.openList?.networkList } })}>
                                            {renderNetworkInput()}
                                        </div>
                                        {state.openList?.networkList && renderNetworkList()}
                                    </div>
                                    {state.address?.memo && <div className="relative mt-5">
                                        <div
                                            className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            Memo
                                        </div>
                                        {renderMemoInput()}
                                    </div>}
                                    <div className="relative mt-5">
                                        <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-txtPrimary dark:text-txtPrimary-dark">
                                            {t('wallet:deposit_address')}
                                        </div>
                                        {renderAddressInput()}
                                    </div>
                                    <div className="mt-4">
                                        {renderDepositConfirmBlocks()}
                                        {renderMinDep()}
                                    </div>
                                </>}
                            </div>
                            <div className="mt-8 xl:mt-0 w-full xl:w-1/2 max-w-[453px]">
                                <div className="flex justify-center">
                                    {renderQrAddress()}
                                    {renderQrMemo()}
                                </div>
                                <div className="mt-8">
                                    {renderNotes()}
                                </div>
                            </div>
                        </div>
                    </MCard>
                    <div className="t-common mt-11">
                        {t('wallet:dep_history')}
                    </div>
                    <MCard addClass="mt-8 py-0 px-0 overflow-hidden">
                        {renderDepHistory()}
                    </MCard>
                    {renderPagination()}
                </div>
            </Background>
        </MaldivesLayout>
    )
}

const Background = styled.div.attrs({ className: 'w-full h-full pt-10' })`
  background-color: ${({ isDark }) => isDark ? colors.darkBlue1 : '#F8F9FA'};
`

const IGNORE_TOKEN = ['XBT_PENDING', 'TURN_CHRISTMAS_2017_FREE', 'USDT_BINANCE_FUTURES', 'SPIN_SPONSOR', 'SPIN_BONUS',
    'SPIN_CONQUEST', 'TURN_CHRISTMAS_2017', 'SPIN_CLONE']

const HISTORY_SIZE = 6

function dataHandler(data, loading, configList, utils) {
    if (loading) {
        const skeleton = []
        for (let i = 0; i < HISTORY_SIZE; ++i) {
            skeleton.push({...ROW_LOADING_SKELETON, key: `wdl__skeletor___${i}`})
        }
        return skeleton
    }

    if (!Array.isArray(data) || !data || !data.length) return []

    const result = []

    data.forEach(h => {
        const { id, currency, amount, network, address, hash, time, status, _history_type } = h
        const assetName = utils?.getAssetName(configList, currency)

        let statusInner
        switch (status) {
            case DepositStatus.COMPLETED:
                if (!hash) {
                    statusInner = <span className='text-green'>Complete</span>
                } else {
                    statusInner = (
                        <Link href={buildExplorerUrl(hash, network)}
                              prefetch={false}>
                            <a className="text-green" target='_blank'>
                                Completed
                            </a>
                        </Link>
                    )
                }
                break
            case DepositStatus.PENDING:
                statusInner = <span className='text-yellow'>Pending</span>
                break
            case DepositStatus.WAITING_FOR_BLOCK_CONFIRMATION:
                const confirmedNumber = get(utils?.blockConfirm, `history:${_history_type}:${id}`,
                                                    h?.blockConfirmations?.confirmed || 0)
                return <a
                    href={buildExplorerUrl(hash, network)}
                    className="text_yellow" target="_blank">
                    {confirmedNumber}/{h?.blockConfirmations?.minimum}
                </a>

            case DepositStatus.CONFIRMED_WAIT_TO_DEPOSIT: {
                statusInner = (
                    <Link href={buildExplorerUrl(hash, network)}>
                        <a className='text-yellow' target='_blank'>
                            Đang xác thực
                        </a>
                    </Link>
                )
                break
            }
            case DepositStatus.BLOCK_DENIED: {
                statusInner = <span className='text-red'>Rejected</span>
                break
            }
            default:
                statusInner = '--'
        }

        result.push({
            key: `dep_${id}_${hash}`,
            id: <span className="!text-sm whitespace-nowrap">{id}</span>,
            asset: <div className="flex items-center">
                <AssetLogo assetCode={assetName} size={24}/>
                <span className="!text-sm whitespace-nowrap ml-2.5">{assetName}</span>
            </div>,
            amount: <span className="!text-sm whitespace-nowrap">{formatWallet(amount)}</span>,
            address: <span className="!text-sm whitespace-nowrap">{shortHashAddress(address, 5, 5)}</span>,
            network: <span className="!text-sm whitespace-nowrap">{network}</span>,
            txhash: <span className="!text-sm whitespace-nowrap">{shortHashAddress(hash, 5, 5)}</span>,
            time: <span className="!text-sm whitespace-nowrap">{formatTime(time, 'HH:mm dd-MM-yyyy')}</span>,
            status: <span className="!text-sm whitespace-nowrap">{statusInner}</span>,
        })
    })

    return result
}

const getAssetName = (assetList, assetId) => {
    if (!Array.isArray(assetList) || !assetId) return
    const _ = assetList.filter(e => e.id === assetId)?.[0]
    return _?.assetCode
}

const ROW_LOADING_SKELETON = {
    id: <Skeletor width={65} />,
    asset: <Skeletor width={65} />,
    amount: <Skeletor width={65} />,
    network: <Skeletor width={65} />,
    withdraw_to: <Skeletor width={65} />,
    txhash: <Skeletor width={65} />,
    time: <Skeletor width={65} />,
    status: <Skeletor width={65} />,
}

const depositLinkBuilder = (type, asset) => {
    switch (type) {
        case TYPE.crypto:
            return `/wallet/exchange/deposit?type=crypto&asset=${asset}`
        case TYPE.fiat:
            return `/wallet/exchange/deposit?type=fiat&asset=${asset}`
        default:
            return `/wallet/exchange/deposit?type=crypto`
    }
}

const getTokenType = (tokenType) => {
    switch (tokenType) {
        case 'KARDIA_CHAIN_NATIVE':
            return 'KRC20'
        default:
            return tokenType
    }
}

export default ExchangeDeposit
