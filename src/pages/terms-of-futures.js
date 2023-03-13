/* eslint-disable */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { useWindowSize } from 'utils/customHooks';
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { WIDTH_MD } from 'components/screens/Wallet';

const Paragraph = styled.div.attrs({
    className: 'mt-6 sm:mt-8'
})``;

const Terms = () => {
    const { width } = useWindowSize();
    const dispath = useDispatch();
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'table']);

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

    const Content = () => {
        return (
            <div className="px-4 bg-white dark:bg-dark">
                <div
                    className={`static max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-txtPrimary dark:text-txtPrimary-dark font-SF-Pro txtPri-2 text-left ${
                        width < WIDTH_MD ? 'pb-20' : 'pb-[120px]'
                    }`}
                >
                    <div className={`w-full txtPri-4 pb-8 sm:pb-12 bg-white dark:bg-dark ${width < WIDTH_MD ? 'sticky top-0 pt-6' : 'pt-20'}`}>
                        {t('common:terms_of_futures')}
                    </div>
                    {language === 'en' && (
                        <div className="text-left">
                            <p>
                                You should always carefully consider whether Nami Futures is consistent with your risk tolerance, investment objectives,
                                investment experience or sophistication, financial condition, financial needs, and personal circumstances, and other
                                considerations that may be relevant to you.
                            </p>
                            <ol className="list-decimal ml-6 space-y-4">
                                <li>
                                    <Paragraph>
                                        Futures trading is highly risky. As a futures trader, you acknowledge and agree that you shall access and use the
                                        futures trading service at your own risks;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        You should fully understand the risks associated with futures trading and be solely responsible and liable for any and
                                        all trading and non-trading activity on your Nami account. Do not enter into a transaction or invest in funds that are
                                        above your financial abilities;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        You are solely responsible and liable for knowing the true status of any position, even if presented incorrectly by Nami
                                        at any time;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        You agree to maintain in your Nami futures account a sufficient amount of blockchain assets required by Nami for users
                                        to engage in futures trading. Failure to maintain a sufficient amount of assets can result in the forced-liquidation of
                                        assets in your futures account;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        In the event that any mitigation options have been taken resulting in liquidation of your position, you are required to
                                        follow Nami&apos;s policy to liquidate your position including liquidation price, premium as well as the closure of
                                        other positions to handle the loss of the position. After implementing the above policies, the end result of Nami
                                        contract services is different from customer&apos;s expectation, Nami does not bear any responsibility.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        You agree to trade in good faith. No person shall trade with intent to disrupt, or with reckless disregard for the
                                        adverse impact on, the orderly conduct of trading or the fair execution of transactions. Nami reserves the right to
                                        prohibit and prosecute any disruptive and manipulative trading practices that Nami finds to be abusive to the orderly
                                        conduct of trading or the fair execution of transactions. If Nami suspects any such accounts to be in violation of this
                                        term, Nami shall have the right to immediately suspend your Nami Account (and any accounts beneficially owned by related
                                        entities or affiliates), freeze or lock the Digital Assets or funds in all such accounts, and suspend your access to
                                        Nami. Nami may, in its sole discretion, perform measures to mitigate potential losses to you on your behalf, including,
                                        but not limited to, suspending you from trading, transferring balances from your futures to your exchange account and/or
                                        from your exchange to your futures account without any prior notification.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        During Nami system maintenance, you agree that you are solely responsible and liable for managing your futures account
                                        under risk, including but not limited to, keeping or closing your position.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        You agree that you conduct all futures trading on your own account and claim full responsibility for your activities.
                                        Nami does not take any responsibility for any loss or damage incurred as a result of your use of any services or your
                                        failure to understand the risks involved associated with assets generally or your use of our services.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        You agree that all investment operations conducted on Nami.Exchange represent your true investment intentions and that
                                        unconditionally accept the potential risks and benefits of your investment decisions.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Nami.exchange reserves the right to suspend or terminate Nami Futures service. If necessary, Nami.Exchange can suspend
                                        and terminate Nami Futures service at any time.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Due to network delay, computer system failures and other force majeure, which may lead to delay, suspension or deviation
                                        of Nami Futures service execution, Nami.Exchange will use commercially reasonable effort to ensure but not promise that
                                        Nami Futures service execution system runs stably and effectively. Nami.Exchange does not take any responsibility if the
                                        final execution doesn&rsquo;t match your expectations due to the above factors.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Nami.exchange reserves the right to delist, i.e. removal of a listed asset from exchange or change the trading rules for
                                        any pairs, included but not limited to maximum leverage, tick size, maximum order volume&hellip; at any time based on
                                        the status of the market without prior notice.
                                    </Paragraph>
                                </li>
                            </ol>
                            <Paragraph>
                                I have read and agreed to the Nami Futures Service Agreement and have agreed to use Nami Futures service. I am aware of these
                                risks and confirm to use this service.
                            </Paragraph>
                        </div>
                    )}
                    {language === 'vi' && (
                        <div className="text-left">
                            <p>
                                Trước khi sử dụng sản phẩm giao dịch Hợp đồng tương lai Nami Futures, bạn n&ecirc;n c&acirc;n nhắc thật cẩn thận xem Nami
                                Futures (giao dịch hợp đồng tương lai) c&oacute; ph&ugrave; hợp với khả năng chấp nhận rủi ro, mục ti&ecirc;u đầu tư, kinh
                                nghiệm đầu tư, t&igrave;nh h&igrave;nh t&agrave;i ch&iacute;nh, nhu cầu t&agrave;i ch&iacute;nh, ho&agrave;n cảnh c&aacute;
                                nh&acirc;n v&agrave; những yếu tố kh&aacute;c hay kh&ocirc;ng. Sau đ&acirc;y l&agrave; c&aacute;c thỏa thuận khi sử dụng sản
                                phẩm n&agrave;y:
                            </p>
                            <ol className="list-decimal ml-3 space-y-4">
                                <li>
                                    <Paragraph>
                                        Giao dịch hợp đồng tương lai (giao dịch Futures) c&oacute; rủi ro rất cao. L&agrave; một nh&agrave; giao dịch Futures,
                                        bạn thừa nhận v&agrave; đồng &yacute; rằng bạn phải tự chịu rủi ro khi truy cập v&agrave; sử dụng c&aacute;c dịch vụ
                                        trong giao dịch Futures;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Bạn đ&atilde; hiểu đầy đủ về c&aacute;c rủi ro li&ecirc;n quan đến giao dịch hợp đồng tương lai v&agrave; ho&agrave;n
                                        to&agrave;n chịu tr&aacute;ch nhiệm về bất kỳ hoạt động giao dịch v&agrave; ph&iacute; giao dịch n&agrave;o tr&ecirc;n
                                        t&agrave;i khoản Nami của m&igrave;nh. Kh&ocirc;ng tham gia giao dịch hoặc đầu tư vượt qu&aacute; khả năng t&agrave;i
                                        ch&iacute;nh của bạn;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Bạn đồng &yacute; giữ đủ số lượng t&agrave;i sản tiền m&atilde; h&oacute;a theo y&ecirc;u cầu của Nami trong t&agrave;i
                                        khoản để tham gia v&agrave;o c&aacute;c giao dịch hợp đồng v&agrave; ho&agrave;n trả khoản vay của bạn đầy đủ v&agrave;
                                        đ&uacute;ng hạn. Việc kh&ocirc;ng duy tr&igrave; đủ t&agrave;i sản hoặc kh&ocirc;ng trả khoản nợ chưa thanh to&aacute;n
                                        đ&uacute;ng hạn c&oacute; thể dẫn đến việc bắt buộc phải thanh l&yacute; t&agrave;i sản với t&agrave;i sản k&yacute; quỹ
                                        của bạn;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Trong trường hợp mọi phương &aacute;n giảm thiểu rủi ro đều đ&atilde; thực hiện dẫn đến vị thế của bạn bị thanh
                                        l&yacute;, bạn buộc phải tu&acirc;n theo ch&iacute;nh s&aacute;ch của Nami để thanh l&yacute; vị thế của bạn bao gồm
                                        gi&aacute; thanh l&yacute;, ph&iacute; bảo hiểm cũng như việc đ&oacute;ng c&aacute;c vị thế kh&aacute;c để xử l&yacute;
                                        phần thua lỗ của vị thế nếu c&oacute;. Sau khi thực hiện c&aacute;c ch&iacute;nh s&aacute;ch tr&ecirc;n, kết quả cuối
                                        c&ugrave;ng của c&aacute;c dịch vụ hợp đồng tương lai Nami Futures kh&aacute;c với mong đợi của kh&aacute;ch h&agrave;ng
                                        th&igrave; Nami kh&ocirc;ng chịu bất kỳ tr&aacute;ch nhiệm n&agrave;o.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Nami c&oacute; thể, theo quyết định ri&ecirc;ng của m&igrave;nh, thay mặt bạn thực hiện c&aacute;c biện ph&aacute;p để
                                        giảm thiểu tổn thất tiềm ẩn của bạn, bao gồm nhưng kh&ocirc;ng giới hạn ở việc chuyển t&agrave;i sản k&yacute; quỹ của
                                        bạn sang t&agrave;i khoản giao dịch v&agrave; / hoặc từ t&agrave;i khoản giao dịch sang t&agrave;i sản k&yacute; quỹ của
                                        bạn nếu cần thiết;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Trong thời gian bảo tr&igrave; hệ thống Nami, bạn đồng &yacute; chịu ho&agrave;n to&agrave;n tr&aacute;ch nhiệm trong
                                        việc quản l&yacute; rủi ro t&agrave;i sản k&yacute; quỹ của m&igrave;nh, bao gồm nhưng kh&ocirc;ng giới hạn việc
                                        đ&oacute;ng c&aacute;c vị thế v&agrave; ho&agrave;n trả khoản vay của bạn;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Bạn đồng &yacute; rằng bạn sẽ tự m&igrave;nh thực hiện mọi giao dịch, giao dịch hợp đồng v&agrave; / hoặc vay nợ
                                        v&agrave; ho&agrave;n to&agrave;n chịu tr&aacute;ch nhiệm về to&agrave;n bộ c&aacute;c hoạt động của m&igrave;nh. Nami
                                        sẽ kh&ocirc;ng chịu tr&aacute;ch nhiệm đối với bất kỳ tổn thất hoặc thiệt hại n&agrave;o do bạn sử dụng bất kỳ dịch vụ
                                        n&agrave;o hoặc do bạn kh&ocirc;ng hiểu c&aacute;c rủi ro li&ecirc;n quan đến việc sử dụng t&agrave;i sản hoặc dịch vụ
                                        của ch&uacute;ng t&ocirc;i g&acirc;y ra.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Bạn đồng &yacute; rằng tất cả c&aacute;c hoạt động đầu tư được thực hiện tr&ecirc;n Nami đều l&agrave; tự nguyện
                                        v&agrave; chấp nhận v&ocirc; điều kiện những rủi ro v&agrave; lợi &iacute;ch tiềm ẩn do c&aacute;c quyết định đầu tư
                                        mang lại.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Nami c&oacute; quyền tạm dừng, chấm dứt c&aacute;c dịch vụ hợp đồng tương lai Nami Futures. Khi cần thiết, nền tảng Nami
                                        c&oacute; thể tạm dừng, chấm dứt c&aacute;c dịch vụ hợp đồng tương lai Nami Futures bất kỳ l&uacute;c n&agrave;o.
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Do sự chậm trễ của mạng, lỗi hệ thống m&aacute;y t&iacute;nh v&agrave; c&aacute;c yếu tố kh&ocirc;ng thể cưỡng lại
                                        kh&aacute;c, c&oacute; khả năng việc thực hiện c&aacute;c dịch vụ hợp đồng tương lai Nami Futures c&oacute; thể bị
                                        tr&igrave; ho&atilde;n, tạm ngừng, bị đ&igrave;nh chỉ hoặc đi chệch hướng. Nami sẽ cố gắng hết sức để đảm bảo nhưng
                                        kh&ocirc;ng hứa hẹn về sự ổn định v&agrave; hiệu quả của hệ thống vận h&agrave;nh hợp đồng tương lai Nami Futures. Nhưng
                                        nếu do c&aacute;c yếu tố tr&ecirc;n, kết quả cuối c&ugrave;ng của c&aacute;c hợp đồng tương lai Nami Futures kh&aacute;c
                                        với mong đợi của kh&aacute;ch h&agrave;ng th&igrave; Nami kh&ocirc;ng chịu bất kỳ tr&aacute;ch nhiệm n&agrave;o..&nbsp;
                                    </Paragraph>
                                </li>
                                <li>
                                    <Paragraph>
                                        Nami.exchange c&oacute; quyền thay đổi th&ocirc;ng tin giao dịch, bao gồm nhưng kh&ocirc;ng giới hạn ở đ&ograve;n bẩy
                                        tối đa, khối lượng giao dịch tối đa tr&ecirc;n mỗi lệnh, bước gi&aacute;&hellip; hoặc hủy ni&ecirc;m yết bất kỳ cặp giao
                                        dịch hợp đồng tương lai n&agrave;o v&agrave;o bất kỳ l&uacute;c n&agrave;o dựa tr&ecirc;n diễn biến thực tế của thị
                                        trường m&agrave; kh&ocirc;ng cần th&ocirc;ng b&aacute;o trước.
                                    </Paragraph>
                                </li>
                            </ol>
                            <Paragraph>
                                T&ocirc;i đ&atilde; đọc v&agrave; đồng &yacute; với thỏa thuận dịch vụ Nami Futures v&agrave; đồng &yacute; sử dụng sản phẩm
                                Nami Futures. T&ocirc;i nhận thức được rủi ro n&agrave;y v&agrave; x&aacute;c nhận việc tham gia sử dụng sản phẩm.
                            </Paragraph>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (width < WIDTH_MD) return <Content />;
    else
        return (
            <MaldivesLayout hideFooter={width < WIDTH_MD ? true : false} hideNavBar={width < WIDTH_MD ? true : false} dark={true}>
                <Content />
            </MaldivesLayout>
        );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['footer', 'navbar', 'common']))
    }
});

export default Terms;
