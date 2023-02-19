import HomeIntroduce from 'src/components/screens/Home/HomeIntroduce';
import HomeMarketTrend from 'src/components/screens/Home/HomeMarketTrend';
import HomeAdditional from 'src/components/screens/Home/HomeAdditional';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import HomeNews from 'src/components/screens/Home/HomeNews';
import Modal from 'src/components/common/ReModal';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import Button from 'components/common/Button';
import { getMarketWatch } from 'redux/actions/market';
import {compact, uniqBy, find} from 'lodash';
import { useSelector } from 'react-redux';
const APP_URL = process.env.APP_URL || 'https://nami.exchange'

import { getExchange24hPercentageChange } from 'src/redux/actions/utils';
const Index = () => {
    // * Initial State
    const [state, set] = useState({
        showQR: false,
        streamLineData: null,
        trendData: null
    })
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }))
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    // * Use Hooks
    const { t } = useTranslation(['home', 'modal'])

    // * Render Handler
    const renderQrCodeModal = useCallback(() => {
        return (
            <Modal
                isVisible={state.showQR}
                title={t('modal:scan_qr_to_download')}
                onBackdropCb={() => setState({ showQR: false })}
            >
                <div className='flex items-center justify-center'>
                    <QRCode
                        value={`${APP_URL}#nami_exchange_download_app`}
                        size={128}
                    />
                </div>
                <div className='mt-4 w-full flex flex-row items-center justify-between'>
                    <Button
                        title={t('common:close')}
                        type='secondary'
                        componentType='button'
                        className='!py-2'
                        onClick={() => setState({ showQR: false })}
                    />
                </div>
            </Modal>
        )
    }, [state.showQR])

    useEffect(async () => {
        if(!(exchangeConfig && exchangeConfig.length)) return
        const originPairs = await getMarketWatch();
        let pairs = originPairs
        pairs = compact(pairs.map(p => {
            p.change_24 = getExchange24hPercentageChange(p)
            const config = find(exchangeConfig, { 'symbol': p.s });
            if(config?.tags?.length && config.tags.includes('NEW_LISTING')){
                p.is_new_listing = true
                p.listing_time = config?.createdAt ? (new Date(config?.createdAt)).getTime() : 0
            }

            if (p?.vq > 1000) return p
            return null
        }))
        pairs = uniqBy(pairs, 'b')

        const topView = _.sortBy(pairs, [function(o) {
            return -o.vc
        }])
        const topGainers = _.sortBy(pairs, [function(o) {
            return -o.change_24
        }])
        const topLosers = _.sortBy(pairs, [function(o) {
            return o.change_24
        }])
        const newListings = _.sortBy(pairs, [function(o) {
            return (o?.is_new_listing ? -1 : 1)*(o?.listing_time || 0)
        }])

        setState({
            trendData: {
                topView: topView.slice(0,5),
                topGainers: topGainers.slice(0,5),
                topLosers: topLosers.slice(0,5),
                newListings: newListings.slice(0,5),
            },
            streamLineData: {
                total: originPairs.length
            }
        })
    }, [exchangeConfig]);

    return (
        <MaldivesLayout navOverComponent navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className='homepage'>
                <HomeIntroduce parentState={setState} trendData={state.streamLineData}/>
                <HomeMarketTrend trendData={state.trendData} />
                <HomeNews />
                <HomeAdditional parentState={setState} />
                {renderQrCodeModal()}
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'home',
            'modal',
            'input',
            'table',
        ])),
    },
})

export default Index
