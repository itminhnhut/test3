import { ChevronDown, ChevronUp } from 'react-feather'
import Link from 'next/link'

const PocketFooter = ({ active, parentState }) => {
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
                        Về Nami Corporation
                        {active?.about ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['about'] ?
                                      'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                Về chúng tôi
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Whitepaper
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Nền tảng của Nami
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Thông báo
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Đối tác kinh doanh
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Điều khoản
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Biểu phí
                            </a>
                        </Link>
                    </div>
                </div>


                <div className="mal-footer___pocket__links___group__item">
                    <div className="mal-footer___pocket__links___group__item__expander"
                         onClick={() => parentState({active: { product: !active.product }})}>
                        Sản phẩm
                        {active?.product ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['product'] ?
                        'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                Giao dịch Spot
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Giao dịch Futures
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
                                Referral
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Swap
                            </a>
                        </Link>
                    </div>
                </div>


                <div className="mal-footer___pocket__links___group__item">
                    <div className="mal-footer___pocket__links___group__item__expander"
                         onClick={() => parentState({active: { community: !active.community }})}>
                        Cộng đồng
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
                        Hỗ trợ
                        {active?.support ? <ChevronUp size={16}/> : <ChevronDown size={16}/> }
                    </div>
                    <div className={`mal-footer___pocket__links___group__item__links
                                     ${active['support'] ?
                        'mal-footer___pocket__links___group__item__links__active' : ''}`}>
                        <Link href="/">
                            <a>
                                Trung tâm hỗ trợ
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Phản hồi
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Gửi yêu cầu hỗ trợ
                            </a>
                        </Link>
                        <Link href="/">
                            <a>
                                Cẩm nang Nami
                            </a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PocketFooter
