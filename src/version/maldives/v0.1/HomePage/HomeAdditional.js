import HomeCurrentActivity from 'version/maldives/v0.1/HomePage/HomeCurrentActivity'
import Button from 'components/common/Button'
import Image from 'next/image'
import Link from 'next/link'

import { Eye, Lock, Mail } from 'react-feather'
import { useWindowSize } from 'utils/customHooks'
import { useSelector } from 'react-redux'
import { THEME_MODE } from 'hooks/useDarkMode'

const HomeAdditional = ({ parentState }) => {
    // * Use Hooks
    const { width } = useWindowSize()
    const theme = useSelector(state => state.user.theme)

    return (
        <>
            <section className="homepage-first_award">
                <div className="homepage-first_award__wrapper mal-container">
                    <div className="homepage-first_award___step">
                        <div className="homepage-first_award__title">
                            Sở hữu ngay <span>50 USDT</span> đầu tiên {width >= 1280 && <br/>}trong tài khoản
                        </div>
                        <div className="homepage-first_award__manual">
                            <div className="homepage-first_award__manual__item">
                                1. Đăng kí tài khoản
                            </div>
                            <div className="homepage-first_award__manual__item">
                                2. Tham gia Quizz & Earn tại Nami Explained
                            </div>
                            <div className="homepage-first_award__manual__item">
                                3. Nhận VNDC ngay khi hoàn thành Quizz
                            </div>
                            <div className="homepage-first_award__manual__item">
                                Theo dõi chương trình tại
                                <div className="flex flex-row items-center">
                                    <Link href="/">
                                        <a>
                                            <Image src="/images/icon/ic_facebook.png" width={width >= 768 ? '52' : '32'}
                                                   height={width >= 768 ? '52' : '32'}/>
                                        </a>
                                    </Link>
                                    <Link href="/">
                                        <a>
                                            <Image src="/images/icon/ic_twitter.png" width={width >= 768 ? '52' : '32'}
                                                   height={width >= 768 ? '52' : '32'}/>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="homepage-first_award___form">
                        <div className="homepage-first_award___form___title">
                            Tạo tài khoản bằng
                        </div>
                        <div className="homepage-first_award___form___platform">
                            <Link href="/">
                                <a>
                                    <Image src="/images/screen/homepage/Facebook.png" width="52" height="52"/>
                                </a>
                            </Link>
                            <Link href="/">
                                <a>
                                    <Image src="/images/screen/homepage/Apple.png" width="52" height="52"/>
                                </a>
                            </Link>
                            <Link href="/">
                                <a>
                                    <Image src="/images/screen/homepage/Google.png" width="52" height="52"/>
                                </a>
                            </Link>
                        </div>
                        <div className="homepage-first_award___form___or">
                            hoặc
                        </div>
                        <div className="homepage-first_award___form___input_group">
                            <div className="homepage-first_award___form___input__wrapper">
                                <Mail size={16}/>
                                <input className="homepage-first_award___form___input"
                                       placeholder="Địa chỉ email"/>
                            </div>
                            <div style={{ marginTop: 12 }} className="homepage-first_award___form___input__wrapper">
                                <Lock size={20}/>
                                <input className="homepage-first_award___form___input"
                                       placeholder="Mật khẩu"/>
                                <Eye size={16}/>
                            </div>
                            <div>
                                <Button style={{
                                    marginTop: 28,
                                    borderRadius: 12,
                                    fontSize: 14,
                                    height: 48,
                                    lineHeight: '35px'
                                }}
                                        title="Đăng kí"
                                        type="primary"/>
                            </div>
                            <div
                                className="text-sm text-center text-textSecondary dark:text-textSecondary-dark font-medium mt-3">
                                Đã có tài khoản? <Link href="/"><a className="text-dominant">Đăng nhập</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="homepage-journey">
                <div className="homepage-journey__wrapper mal-container">
                    <div className="homepage-journey__title">
                        Bắt đầu hành trình của bạn
                    </div>
                    <div className="homepage-journey__description">
                        Nami Exchange là nơi lý tưởng để bạn giao dịch cũng như thay đổi suy {width >= 992 && <br/>}nghĩ
                        của bạn về tài chính
                    </div>
                    <div className="homepage-journey__group_content">
                        <div className="homepage-journey__group_content___left">
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/maxium_performance.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        Tối đa hoá lợi nhuận
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        Giao dịch với đòn bẩy lên đến x100 tại Nami Futures
                                        (giao dịch hợp đồng tương lai).
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title="Xem thêm" type="primary"/>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/master_revenue.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        Lợi nhuận từ các master
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        Đa dạng hoá phương thức đầu tư với tính năng sao chép lệnh giao dịch cũng phần
                                        trăm lợi nhuận từ những đầu tư kinh nghiệm nhất khi tham gia Nami Futures.
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title="Xem thêm" type="primary"/>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/token_saving_cost.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        Sở hữu Token tiềm năng với giá cực thấp
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        Cung cấp các dự án uy tín ra mắt lần đầu tiên tại Nami Launchpad và những token
                                        tiềm năng với giá chào bán thấp hơn thị trường tại NextGem.
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title="Xem thêm" type="primary"/>
                                    </div>
                                </div>
                            </div>
                            <div className="homepage-journey__group_content___left__item">
                                <div className="homepage-journey__group_content___left__item___icon">
                                    <Image src="/images/screen/homepage/crypto_knowledge.png"
                                           width={width >= 1366 ? '52' : '44'} height={width >= 1366 ? '52' : '44'}/>
                                </div>
                                <div className="homepage-journey__group_content___left__item___content">
                                    <div className="homepage-journey__group_content___left__item___content__title">
                                        Nâng cao kiến thức về tiền mã hoá
                                    </div>
                                    <div
                                        className="homepage-journey__group_content___left__item___content__description">
                                        Chuẩn bị ngay những kiến thức cơ bản và cập nhật xu hướng mới nhất để sáng suốt
                                        hơn trong mọi giao dịch.
                                    </div>
                                    <div className="homepage-journey__group_content___left__item___content__viewmore">
                                        <Button title="Xem thêm" type="primary"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="homepage-journey__group_content___right">
                            <img src="/images/screen/homepage/journey_graphics.png" alt="Nami Exchange"/>
                        </div>
                    </div>
                </div>
            </section>

            <section id="nami_exchange_download_app" className="homepage-app_intro">
                <div className="homepage-app_intro___wrapper mal-container">
                    <div className="homepage-app_intro___content">
                        <div className="homepage-app_intro___content___title">Giao dịch mọi lúc<br/>
                            mọi nơi với Mobile App</div>
                        <div className="homepage-app_intro___content___description">
                            Nạp, rút và giao dịch 24/7 trên ứng dụng dành cho IOS và Android
                        </div>
                        <div className="homepage-app_intro___content___button__group">
                            <div onClick={() => window.open('https://apps.apple.com/app/id1480302334', '_blank')}>
                                <img src="/images/screen/homepage/app_store_light.png" alt="Nami Exchange"/>
                            </div>
                            <div onClick={() => window.open('https://play.google.com/store/apps/details?id=com.namicorp.exchange', '_blank')}>
                                <img src="/images/screen/homepage/play_store_light.png" alt="Nami Exchange"/>
                            </div>
                            <div onClick={() => parentState && parentState({ showQR: true })}>
                                {theme && theme !== THEME_MODE.LIGHT ?
                                 <img src="/images/icon/ic_qr.png" alt="Nami Exchange"/>
                                 : <img src="/images/screen/homepage/qr_light.png" alt="Nami Exchange"/>}
                            </div>
                        </div>
                    </div>
                    <div className="homepage-app_intro___graphics">
                        <img className="homepage-app_intro___mb_graphics" src="/images/screen/homepage/mobile_dual_ip_light.png" alt="Nami Exchange"/>
                        <img className="homepage-app_intro___desktop_graphics" src="/images/screen/homepage/dual_ip_light.png" alt="Nami Exchange"/>
                    </div>
                    {theme && theme === THEME_MODE.LIGHT &&
                    <img className="homepage-app_intro___graphics__backward"
                         src="/images/screen/homepage/corner_right.png" alt="Nami Exchange"/>}
                </div>
            </section>

            <section className="homepage-trade3step">
                <div className="homepage-trade3step___wrapper">
                    <div className="homepage-trade3step___title">
                        Giao dịch ngay chỉ với 3 bước
                    </div>

                    <div className="homepage-trade3step___step___wrapper">
                        <div className="homepage-trade3step___step___item">
                            <div className="homepage-trade3step___step___item___inner">
                                <div className="homepage-trade3step___step___item__label">01</div>
                                <div className="homepage-trade3step___step___item__sublabel">
                                    Tạo tài khoản
                                </div>
                            </div>
                            <div className="homepage-trade3step__vertial_dot_line"/>
                            <div className="homepage-trade3step__horizontal_dot_line"/>
                        </div>
                        <div className="homepage-trade3step___step___item">
                            <div className="homepage-trade3step___step___item___inner">
                                <div className="homepage-trade3step___step___item__label">02</div>
                                <div className="homepage-trade3step___step___item__sublabel">
                                    Nạp Token/Coin
                                </div>
                            </div>
                            <div className="homepage-trade3step__vertial_dot_line"/>
                            <div className="homepage-trade3step__horizontal_dot_line"/>
                        </div>
                        <div className="homepage-trade3step___step___item">
                           <div className="homepage-trade3step___step___item___inner">
                               <div className="homepage-trade3step___step___item__label">03</div>
                               <div className="homepage-trade3step___step___item__sublabel">
                                   Bắt đầu giao dịch
                               </div>
                           </div>
                        </div>
                    </div>

                    <div className="homepage-trade3step___create_account">
                        <Button title="Tạo tài khoản" type="primary"/>
                        <div className="homepage-trade3step___create_account___pr">
                            Chỉ 30 giây
                        </div>
                    </div>
                </div>
            </section>

            <section className="homepage-whynami">
                <div className="homepage-whynami___wrapper mal-container">
                    <div className="homepage-whynami___title">
                        Tại sao lại chọn
                        {width < 992 && <br/>}
                        <span className="text-dominant"> Nami Exchange ?</span>
                    </div>
                    <div className="homepage-whynami___description">
                        Nền tảng quản lý và giao dịch tiền điện tử hiệu quả nhất
                    </div>

                    <div className="homepage-whynami___reason__group">
                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/registered_people.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                500,000+ người đăng kí
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                Trung bình 30 phút có đến 9 nhà đầu tư<br/>lựa chọn Nami Exchange
                            </div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/investment_diversity.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                Đầu tư đa dạng
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                Với 366 cặp giao dịch sẽ giúp các nhà<br/>đầu tư có nhiều sự lựa chọn
                            </div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/fee_saving.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                Phí giao dịch âm
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                Một trong những sàn hiếm hoi có mức<br/>phí giao dịch âm với take fee 0,01%
                            </div>
                        </div>

                        <div className="homepage-whynami___reason__item">
                            <Image src="/images/screen/homepage/effective_support.png" width="52" height="52"/>
                            <div className="homepage-whynami___reason__item___title">
                                Hỗ trợ 24/7
                            </div>
                            <div className="homepage-whynami___reason__item___description">
                                Luôn có nhân viên hỗ trợ trực tiếp<br/>
                                đa ngôn ngữ 24/7
                            </div>
                        </div>
                    </div>

                    <div className="homepage-whynami___reason__group__btn___group">
                        <Button title="Về chúng tôi" type="primary"/>
                    </div>
                </div>
            </section>

            <HomeCurrentActivity/>

            <section className="homepage-community">
                <div className="homepage-community___wrapper mal-container">
                    <div className="homepage-community___title">
                        Cộng đồng Nami Corporation
                    </div>
                    <div className="homepage-community___description">
                        Với hơn 10 nghìn thành viên trên các cộng đồng quốc tế và Việt Nam, tham gia ngay để{width >= 992 && <br/>}trao đổi
                        và trò chuyện với các nhà đầu tư và nhận hỗ trợ 24/7 cùng chúng tôi.
                    </div>
                    <div className="homepage-community___channel__group">
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_facebook.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Facebook
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_facebook.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Facebook Group
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_telegram.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Telegram Global
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_telegram.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Telegram
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_twitter.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Twitter
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_reddit.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Reddit
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_globe.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    Blog
                                </div>
                            </a>
                        </Link>
                        <Link href="/">
                            <a className="homepage-community___channel__group___item">
                                <div className="homepage-community___channel__group___item__icon">
                                    <Image src="/images/icon/ic_cmc.png" width="44" height="44"/>
                                </div>
                                <div className="homepage-community___channel__group___item__label">
                                    CoinMarketCap
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomeAdditional
