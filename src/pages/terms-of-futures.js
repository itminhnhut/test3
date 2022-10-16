/* eslint-disable */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { useWindowSize } from 'utils/customHooks';
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const Terms = () => {
    const { width } = useWindowSize()
    const dispath = useDispatch();
    const { t, i18n: { language } } = useTranslation(['common', 'table'])

    useEffect(() => {
        // document.body.classList.add('hidden-scrollbar');
        document.body.classList.add('no-scrollbar');
        // document.body.classList.add('!bg-onus');

        const intervalReloadData = setInterval(() => {
            dispath(reloadData());
        }, 5 * 60 * 1000);

        return () => {
            document.body.classList.remove('hidden-scrollbar');
            // document.body.classList.remove('bg-onus');
            clearInterval(intervalReloadData);
        };
    }, []);

    return (
        <MaldivesLayout hideNavBar={width <= 640 ? true : false} dark={true}>
            {language === 'en' && <div className="nami-container my-20 policies-page">
                <>
                    <div className="text-center">
                        <h1 className="text-4xl font-semibold mb-7">
                            Nami Futures Service Agreement
                        </h1>
                    </div>
                    <div className={`bg-Container dark:bg-Container-dark text-sm text-justify ${width <= 640 && 'term-mobile-view' }`}>
                        <p dir="ltr">You should always carefully consider whether Nami Futures is consistent with your risk tolerance, investment objectives, investment experience or sophistication, financial condition, financial needs, and personal circumstances, and other considerations that may be relevant to you.
                        </p>
                        <ol>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Futures trading is highly risky. As a futures trader, you acknowledge and agree that you shall access and use the futures trading service at your own risks;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">You should fully understand the risks associated with futures trading and solely responsible and liable for any and all trading and non-trading activity on your Nami account. Do not enter into a transaction or invest in funds that are above your financial abilities;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">You are solely responsible and liable for knowing the true status of any position, even if presented incorrectly by Nami at any time;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">You agree to maintain in your Nami futures account a sufficient amount of blockchain assets required by Nami for users to engage in futures trading. Failure to maintain a sufficient amount of assets can result in the forced-liquidation of assets in your futures account;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">In the event that any mitigation options have been taken resulting in liquidation of your position, you are required to follow Nami&#39;s policy to liquidate your position including liquidation price, premium as well as the closure of other positions to handle the loss of the position. After implementing the above policies, the end result of Nami contract services is different from customer&#39;s expectation, Nami does not bear any responsibility.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">You agree to trade in good faith. No person shall trade with intent to disrupt, or with reckless disregard for the adverse impact on, the orderly conduct of trading or the fair execution of transactions. Nami reserves the right to prohibit and prosecute any disruptive and manipulative trading practices that Nami finds to be abusive to the orderly conduct of trading or the fair execution of transactions. If Nami suspects any such accounts to be in violation of this term, Nami shall have the right to immediately suspend your Nami Account (and any accounts beneficially owned by related entities or affiliates), freeze or lock the Digital Assets or funds in all such accounts, and suspend your access to Nami. Nami may, in its sole discretion, perform measures to mitigate potential losses to you on your behalf, including, but not limited to, suspending you from trading, transferring balances from your futures to your exchange account and/or from your exchange to your futures account without any prior notification.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">During Nami system maintenance, you agree that you are solely responsible and liable for managing your futures account under risk, including but not limited to, keeping or closing your position.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">You agree that you conduct all futures trading on your own account and claim full responsibility for your activities. Nami does not take any responsibility for any loss or damage incurred as a result of your use of any services or your failure to understand the risks involved associated with assets generally or your use of our services.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">You agree that all investment operations conducted on Nami.Exchange represent your true investment intentions and that unconditionally accept the potential risks and benefits of your investment decisions.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Nami.exchange reserves the right to suspend or terminate Nami Futures service. If necessary, Nami.Exchange can suspend and terminate Nami Futures service at any time.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Due to network delay, computer system failures and other force majeure, which may lead to delay, suspension or deviation of Nami Futures service execution, Nami.Exchange will use commercially reasonable effort to ensure but not promise that Nami Futures service execution system runs stably and effectively. Nami.Exchange does not take any responsibility if the final execution doesn’t match your expectations due to the above factors.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Nami.exchange reserves the right to delist, i.e. removal of a listed asset from exchange or change the trading rules for any pairs, included but not limited to maximum leverage, tick size, maximum order volume… at any time based on the status of the market without prior notice.
                                </p>
                            </li>
                        </ol>
                        <p dir="ltr">I have read and agreed to the Nami Futures Service Agreement and have agreed to use Nami Futures service. I am aware of these risks and confirm to use this service.
                        </p>
                    </div>
                </>
            </div>}
            {language === 'vi' && <div className="nami-container my-20 policies-page">
                <>
                    <div className="text-center">
                        <h1 className="text-4xl font-semibold mb-7">
                            Thoả thuận sử dụng dịch vụ Nami Futures
                        </h1>
                    </div>
                    <div className={`bg-Container dark:bg-Container-dark text-sm text-justify ${width <= 640 && 'term-mobile-view' }`}>
                        <p dir="ltr">Trước khi sử dụng sản phẩm giao dịch Hợp đồng tương lai Nami Futures, bạn nên cân nhắc thật cẩn thận xem Nami Futures (giao dịch hợp đồng tương lai) có phù hợp với khả năng chấp nhận rủi ro, mục tiêu đầu tư, kinh nghiệm đầu tư, tình hình tài chính, nhu cầu tài chính, hoàn cảnh cá nhân và những yếu tố khác hay không. Sau đây là các thỏa thuận khi sử dụng sản phẩm này:
                        </p>
                        <ol>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Giao dịch hợp đồng tương lai (giao dịch Futures) có rủi ro rất cao. Là một nhà giao dịch Futures, bạn thừa nhận và đồng ý rằng bạn phải tự chịu rủi ro khi truy cập và sử dụng các dịch vụ trong giao dịch Futures;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Bạn đã hiểu đầy đủ về các rủi ro liên quan đến giao dịch hợp đồng tương lai và hoàn toàn chịu trách nhiệm về bất kỳ hoạt động giao dịch và phí giao dịch nào trên tài khoản Nami của mình. Không tham gia giao dịch hoặc đầu tư vượt quá khả năng tài chính của bạn;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Bạn đồng ý giữ đủ số lượng tài sản tiền mã hóa theo yêu cầu của Nami trong tài khoản để tham gia vào các giao dịch hợp đồng và hoàn trả khoản vay của bạn đầy đủ và đúng hạn. Việc không duy trì đủ tài sản hoặc không trả khoản nợ chưa thanh toán đúng hạn có thể dẫn đến việc bắt buộc phải thanh lý tài sản với tài sản ký quỹ của bạn;

                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Trong trường hợp mọi phương án giảm thiểu rủi ro đều đã thực hiện dẫn đến vị thế của bạn bị thanh lý, bạn buộc phải tuân theo chính sách của Nami để thanh lý vị thế của bạn bao gồm giá thanh lý, phí bảo hiểm cũng như việc đóng các vị thế khác để xử lý phần thua lỗ của vị thế nếu có. Sau khi thực hiện các chính sách trên, kết quả cuối cùng của các dịch vụ hợp đồng tương lai Nami Futures khác với mong đợi của khách hàng thì Nami không chịu bất kỳ trách nhiệm nào.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Nami có thể, theo quyết định riêng của mình, thay mặt bạn thực hiện các biện pháp để giảm thiểu tổn thất tiềm ẩn của bạn, bao gồm nhưng không giới hạn ở việc chuyển tài sản ký quỹ của bạn sang tài khoản giao dịch và / hoặc từ tài khoản giao dịch sang tài sản ký quỹ của bạn nếu cần thiết;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Trong thời gian bảo trì hệ thống Nami, bạn đồng ý chịu hoàn toàn trách nhiệm trong việc quản lý rủi ro tài sản ký quỹ của mình, bao gồm nhưng không giới hạn việc đóng các vị thế và hoàn trả khoản vay của bạn;
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Bạn đồng ý rằng bạn sẽ tự mình thực hiện mọi giao dịch, giao dịch hợp đồng và / hoặc vay nợ và hoàn toàn chịu trách nhiệm về toàn bộ các hoạt động của mình. Nami sẽ không chịu trách nhiệm đối với bất kỳ tổn thất hoặc thiệt hại nào do bạn sử dụng bất kỳ dịch vụ nào hoặc do bạn không hiểu các rủi ro liên quan đến việc sử dụng tài sản hoặc dịch vụ của chúng tôi gây ra.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Bạn đồng ý rằng tất cả các hoạt động đầu tư được thực hiện trên Nami đều là tự nguyện và chấp nhận vô điều kiện những rủi ro và lợi ích tiềm ẩn do các quyết định đầu tư mang lại.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Nami có quyền tạm dừng, chấm dứt các dịch vụ hợp đồng tương lai Nami Futures. Khi cần thiết, nền tảng Nami có thể tạm dừng, chấm dứt các dịch vụ hợp đồng tương lai Nami Futures bất kỳ lúc nào.
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Do sự chậm trễ của mạng, lỗi hệ thống máy tính và các yếu tố không thể cưỡng lại khác, có khả năng việc thực hiện các dịch vụ hợp đồng tương lai Nami Futures có thể bị trì hoãn, tạm ngừng, bị đình chỉ hoặc đi chệch hướng. Nami sẽ cố gắng hết sức để đảm bảo nhưng không hứa hẹn về sự ổn định và hiệu quả của hệ thống vận hành hợp đồng tương lai Nami Futures. Nhưng nếu do các yếu tố trên, kết quả cuối cùng của các hợp đồng tương lai Nami Futures khác với mong đợi của khách hàng thì Nami không chịu bất kỳ trách nhiệm nào
                                </p>
                            </li>
                            <li aria-level="1" dir="ltr">
                                <p dir="ltr" role="presentation">Nami.exchange có quyền thay đổi thông tin giao dịch, bao gồm nhưng không giới hạn ở đòn bẩy tối đa, khối lượng giao dịch tối đa trên mỗi lệnh, bước giá… hoặc hủy niêm yết bất kỳ cặp giao dịch hợp đồng tương lai nào vào bất kỳ lúc nào dựa trên diễn biến thực tế của thị trường mà không cần thông báo trước.
                                </p>
                            </li>
                        </ol>
                        <p dir="ltr">T&ocirc;i đ&atilde; đọc v&agrave; đồng &yacute; với thỏa thuận dịch vụ Nami Futures v&agrave; đồng &yacute; sử dụng nghiệp vụ Nami Futures. T&ocirc;i nhận thức được rủi ro n&agrave;y v&agrave; x&aacute;c nhận việc mua h&agrave;ng.
                        </p>
                        <p>&nbsp;
                        </p>
                    </div>
                </>
            </div>}
            {/* <Footer/> */}
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'footer',
            'navbar',
            'common'
        ]))
    }
})
export default Terms
