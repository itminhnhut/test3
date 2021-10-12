import { ChevronDown, ChevronUp } from 'react-feather'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { LANGUAGE_TAG } from 'hooks/useLanguage'

const PocketFooter = ({ active, parentState }) => {
    const { t, i18n: { language } } = useTranslation(['navbar'])

    return (
        <div className="mal-footer___pocket">
            <div className="mal-footer___pocket___company">
                <div className="mal-footer___pocket__logo">
                    <img src="/images/logo/nami-logo.png" alt="Nami Exchange"/>
                </div>
                <div className="mal-footer___pocket__slogan">
                    Change mindset, make giant steps
                </div>
                <div className="mal-footer___pocket__license">
                    Copyright © 2020 Nami Corporation.<br/>
                    All rights reserved.
                </div>
            </div>

            <div className="mal-footer___pocket__links___group">
                <div className="mal-footer___pocket__links___group__item">
                    <div className="mal-footer___pocket__links___group__item__expander"
                         onClick={() => parentState({active: { about: !active.about }})}>
                        {language === LANGUAGE_TAG.VI ? 'Về Nami Corporation' : 'About Nami Corp.,'}
                        {active?.about ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['about'] ?
                                      'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                {t('navbar:menu.about')}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Whitepaper
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Nền tảng của Nami' : 'Nami Platform'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Thông báo' : 'Notice'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Đối tác kinh doanh' : 'Partners'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Điều khoản' : 'Terms of Services'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {t('navbar:menu.fee')}
                            </a>
                        </Link>
                    </div>
                </div>


                <div className="mal-footer___pocket__links___group__item">
                    <div className="mal-footer___pocket__links___group__item__expander"
                         onClick={() => parentState({active: { product: !active.product }})}>
                        {t('navbar:menu.product')}
                        {active?.product ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['product'] ?
                        'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                {t('navbar:menu.spot')}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {t('navbar:menu.futures')}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Launchpad
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Copy Trade
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Farming
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Staking
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {t('navbar:submenu.referral')}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {t('navbar:menu.swap')}
                            </a>
                        </Link>
                    </div>
                </div>


                <div className="mal-footer___pocket__links___group__item">
                    <div className="mal-footer___pocket__links___group__item__expander"
                         onClick={() => parentState({active: { community: !active.community }})}>
                        {language === LANGUAGE_TAG.VI ? 'Cộng đồng' : 'Community'}
                        {active?.community ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['community'] ?
                        'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                Facebook Fanpage
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Facebook Group
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Telegram Vietnam
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Telegram Global
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Twitter
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Reddit
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Blog
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                CoinMarketCap
                            </a>
                        </Link>
                    </div>
                </div>


                <div className="mal-footer___pocket__links___group__item">
                    <div className="mal-footer___pocket__links___group__item__expander"
                         onClick={() => parentState({active: { support: !active.support }})}>
                        {t('navbar:menu.support')}
                        {active?.support ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['support'] ?
                        'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Trung tâm hỗ trợ' : 'Support Center'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Phản hồi' : 'Feedback'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Gửi yêu cầu hỗ trợ' : 'Send Ticket'}
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                {language === LANGUAGE_TAG.VI ? 'Cẩm nang Nami' : `Nami's Handbook`}
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PocketFooter
