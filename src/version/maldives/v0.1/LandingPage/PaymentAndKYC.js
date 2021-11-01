import { useWindowSize } from 'utils/customHooks'

const PaymentAndKYC = () => {
    const { width } = useWindowSize()

    return (
        <div className="landing_page___payment_kyc">
            <div className="landing_page___section_title mal-container">
                Phương thức thanh toán & KYC
            </div>
            <div className="landing_page___payment_kyc___wrapper mal-container">
                <div className="landing_page___payment_kyc___item landing_page___card">
                    <div className="mal-title__gradient">
                        Thanh toán
                    </div>
                    <div className="landing_page___payment_kyc___item__description">
                        Với Maldives, người dùng có thể sử dụng thẻ ngân hàng của mình như một phương thức thanh toán
                        trực tiếp.
                    </div>
                    <div className="landing_page___payment_kyc___item__img">
                        <img src="images/screen/landing-page/ip_kyc_1.png" alt="Nami Maldives"/>
                    </div>
                </div>
                <div style={width < 768 ? {marginTop: 20} : {}} className="landing_page___payment_kyc___item landing_page___card">
                    <div className="mal-title__gradient">
                        KYC
                    </div>
                    <div className="landing_page___payment_kyc___item__description">
                        Với Maldives, người dùng có thể sử dụng thẻ ngân hàng của mình như một phương thức thanh toán
                        trực tiếp.
                    </div>
                    <div className="landing_page___payment_kyc___item__img">
                        <img src="images/screen/landing-page/ip_kyc_1.png" alt="Nami Maldives"/>
                    </div>
                </div>
                <div style={width < 768 ? {marginTop: 20} : {}} className="landing_page___payment_kyc___item landing_page___card">
                    <div className="mal-title__gradient">
                        Nạp/Rút
                    </div>
                    <div className="landing_page___payment_kyc___item__description">
                        Nạp/Rút trực tiếp,  nhanh chóng, thuận tiện chỉ bằng một bước chạm.
                    </div>
                    <div className="landing_page___payment_kyc___item__img">
                        <img src="images/screen/landing-page/ip_kyc_2.png" alt="Nami Maldives"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentAndKYC
