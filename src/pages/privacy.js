/* eslint-disable */
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

const Privacy = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'table']);

    useEffect(() => {
        // document.body.classList.add('hidden-scrollbar');
        document.body.classList.add('no-scrollbar');
        // document.body.classList.add('!bg-onus');
    }, []);

    return (
        <MaldivesLayout>
            <div className="nami-container bg-white dark:bg-dark my-20 policies-page">
                {language === 'en' && <>
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold mb-7 ">
                            Nami Exchange Privacy Policy
                        </h1>

                    </div>

                    <div className="card  bg-white dark:bg-dark rounded-lg text-tiny">
                        <p className="text-right pb-5">
                            <strong>Updated on: Aug 2023</strong>
                        </p>
                        <p>This notice was prepared in the English language and the English language version shall
                            prevail in the event of any conflict, discrepancy or ambiguity between translations.</p>
                        <ul>
                            <li>Summary of how we use your data</li>
                            <li>What does this notice cover?</li>
                            <li>What personal data do we process?</li>
                            <li>How do we use this personal data, and what is the legal basis for this use?</li>
                            <li>What rights do you have?</li>
                            <li>Fully-automated decision-making that could have significant effects on you</li>
                            <li>Relying on our legitimate interests</li>
                            <li>Withdrawing consent or otherwise objecting to direct marketing</li>
                            <li>Who will we share this data with, and where?</li>
                            <li>Cookies and related technologies</li>
                            <li>External links</li>
                            <li>Changes to this Notice</li>
                            <li>Getting in touch with us</li>
                        </ul>
                        <p className="mt-6 mb-2 text-base"><strong>Summary of how we use your data</strong></p>
                        <p>We respect your privacy and are committed to protecting it as described in this notice.</p>
                        <p>
                            Nami Exchange does not require specific personal information for KYC. We use your personal
                            data to provide, improve and administer the Nami Exchange platform, to enter into and
                            perform the terms of service with our users, and to
                            comply with regulatory requirements.
                        </p>
                        <p>Data is shared with our vendors, and when we have a good faith belief that doing so is
                            necessary to comply with regulatory enquiries or requirements.</p>
                        <p>Our privacy notice sets out more details of this processing, including details of your data
                            protection rights.</p>
                        <p className="mt-6 mb-2 text-base"><strong>What does this notice cover?</strong></p>
                        <p>
                            This notice describes how Nami Exchange and its affiliates (referred to as “Nami”, “we” or
                            “us” in this notice) will collect, make use of and share (i.e. “process”) your personal data
                            in connection with the Nami Exchange website,
                            apps and services (including API services).
                        </p>
                        <p>
                            This notice also describes data protection rights you may have (depending on applicable
                            law), such as a right to object to some of the processing which Nami Exchange carries out.
                            More information about your rights, and how to
                            exercise them, is set out in the “Your rights” section.
                        </p>
                        <p className="mt-6 mb-2 text-base"><strong>What personal data do we process?</strong></p>
                        <p>We process personal data about you when you interact with us, our websites, our apps or our
                            services (including API services). This includes:</p>
                        <ul>
                            <li>Your email address / username, password and other login/security details (e.g. app
                                passcode, two-factor authentication, token seed record, public PGP key), and login
                                records;
                            </li>
                            <li>Your payment details / bitcoin wallet address;</li>
                            <li>Your account and portfolio details, such as live and historical orders, trades and
                                positions, and balances;
                            </li>
                            <li>Your site and account preferences, including site notification, sounds and confirmation
                                dialogs and leaderboard preferences;
                            </li>
                            <li>Your self-reported location plus the geolocation of the IP address you connect from;
                            </li>
                            <li>Your marketing and other communication preferences, and a record of any consents you
                                have given us;
                            </li>
                            <li>Information related to the browser or device you use to access our website or apps, as
                                well as data that tells us which features of the website/app are popular, or suffer from
                                issues we need to fix;
                            </li>
                            <li>The content and details (e.g. date) of messages you post in chat box with support team,
                                or that you send us (e.g. customer support queries); and customer service notes and
                                other records.
                            </li>
                        </ul>
                        <p>
                            We will aim to mark data fields as optional or mandatory when collecting personal data from
                            you via forms. Note, in particular, that to create an account, engage in transactions, and
                            where necessary, prove your identity, the
                            provision of personal data is typically mandatory: if relevant data is not provided, then we
                            will not be able to do these things and provide the services you expect.
                        </p>
                        <p>We do not collect fingerprints, facial recognition data, or other biometrics. Where you
                            enable biometric security (such as fingerprint or Face ID login), your biometrics will be
                            handled by your device, not by us.</p>
                        <p className="mt-6 mb-2 text-base"><strong>How do we use this personal data, and what is the
                            legal basis for this use?</strong></p>
                        <p>We process this personal data for the following purposes:</p>
                        <p>To fulfill (or take steps linked to) a service agreement with you. This includes:</p>
                        <ul>
                            <li>creating your account;</li>
                            <li>taking deposits and fees, and paying out withdrawals;</li>
                            <li>allowing you to make trades, maintaining your account and trading history, and closing /
                                auto-deleveraging / liquidating positions in accordance with our published policies and
                                terms of service;
                            </li>
                            <li>communicating with you; and</li>
                            <li>providing customer services;</li>
                        </ul>
                        <p>
                            To monitor, improve and protect the services on our website and apps, in particular by
                            looking at how they are used, testing alternatives (e.g. by “A/B testing”, and running
                            “beta” version trials), and by learning from feedback and
                            comments you provide;
                        </p>
                        <p>To personalize our website, apps and services;</p>
                        <p>To invite individuals to take part in market research and beta tests.</p>
                        <p>Where you give us consent (so far as that consent is required):</p>
                        <p>We will send you direct marketing in relation to our relevant products and services, or other
                            products and services provided by us and carefully selected partners;</p>
                        <p>We place cookies, monitor email engagement, and use other similar technologies in accordance
                            with our Cookies Notice and the information provided to you when those technologies are
                            used;</p>
                        <p>On other occasions where we ask you for consent, we will use the data for the purpose which
                            we explain at that time.</p>
                        <p>For purposes which are required by law, in particular: in response to requests by relevant
                            courts and public authorities, such as those conducting an investigation.</p>
                        <p className="mt-6 mb-2 text-base"><strong>What rights do you have?</strong></p>
                        <p>
                            Subject to applicable law, as outlined below, you have a number of rights in relation to
                            your privacy and the protection of your personal information. You have the right to request
                            access to, correct, and delete your personal
                            information, and to ask for data portability. You may also object to our processing of your
                            personal information or ask that we restrict the processing of your personal information in
                            certain instances. In addition, when you consent
                            to our processing of your personal information for a specified purpose, you may withdraw
                            your consent at any time. If you want to exercise any of your rights please contact us at
                            support@nami.exchange. These rights may be limited in
                            some situations - for example, where we can demonstrate we have a legal requirement to
                            process your personal data.
                        </p>
                        <ul>
                            <li>Right to access: you have the right to obtain confirmation that your personal
                                information are processed and to obtain a copy of it as well as certain information
                                related to its processing;
                            </li>
                            <li>Right to rectify: you can request the rectification of your personal information which
                                is inaccurate, and also add to it. You can also change your personal information in your
                                Account at any time;
                            </li>
                            <li>Right to delete: you can, in some cases, have your personal information deleted by
                                contacting us;
                            </li>
                            <li>
                                Right to object: you can object, for reasons relating to your particular situation, to
                                the processing of your personal information. For instance, you have the right to object
                                where we rely on legitimate interest or where we
                                process your data for direct marketing purposes;
                            </li>
                            <li>
                                Right to restrict processing: You have the right, in certain cases, to temporarily
                                restrict the processing of your personal information by us, provided there are valid
                                grounds for doing so. We may continue to process your
                                personal information if it is necessary for the defense of legal claims, or for any
                                other exceptions permitted by applicable law;
                            </li>
                            <li>
                                Right to portability: in some cases, you can ask to receive your personal information
                                which you have provided to us in a structured, commonly used and machine-readable
                                format, or, when this is possible, that we communicate your
                                personal information on your behalf directly to another data controller;
                            </li>
                        </ul>
                        <p className="mt-6 mb-2 text-base"><strong>Fully-automated decision-making that could have
                            significant effects on you</strong></p>
                        <p>As the service documentation on our site and our terms of service explain, our trading
                            platform applies certain automatic processes based on your trading positions and the
                            resources on your account.</p>
                        <p>
                            For example, most Nami Exchange instruments are highly leveraged. To keep positions in these
                            instruments open, traders are required to hold a percentage of the value of the position on
                            the exchange, known as the Maintenance Margin
                            percentage. If you cannot fulfill your maintenance requirement, and liquidation is therefore
                            triggered, we will cancel open orders on the current instrument, you will be partially or
                            fully liquidated, and your maintenance margin can
                            be lost.
                        </p>
                        <p>Other significant automated decision-making that uses your personal data may also be
                            employed, to protect accounts and to uphold our terms of service.&nbsp;</p>
                        <p>
                            API usage and behavior is monitored in order to protect our systems and to uphold our terms
                            of service. Automated decision-making may be employed to manage your account’s API access or
                            rate limit permits based on your API usage and
                            trading behavior (this may include limiting or preventing access and activity on your
                            account).
                        </p>
                        <p>
                            <strong>Relying on our legitimate interests</strong>
                        </p>
                        <p>To the extent required by law, we aim to carry out balancing tests when significant data
                            processing activities are justified on the basis of our “legitimate interests”, as described
                            above.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Withdrawing consent or otherwise objecting to direct
                            marketing</strong></p>
                        <p>
                            Wherever we rely on your consent, you will always be able to withdraw that consent, although
                            we may have other legal grounds for processing your data for other purposes, such as those
                            set out above. In some cases, we are able to
                            send or display marketing without your consent. You have an absolute right to opt-out of
                            direct marketing, or profiling we carry out for direct marketing, at any time. You can do
                            this by following the instructions in the
                            communication where this is an electronic message, changing your account settings, or by
                            contacting us using the details set out below.
                        </p>
                        <p className="mt-6 mb-2 text-base"><strong>Who will we share this data with, and where?</strong>
                        </p>
                        <p>
                            Personal data may be shared with courts or public authorities if required as described
                            above, mandated by law, or required for the legal protection of our or third party
                            legitimate interests, in compliance with applicable laws and
                            authorities’ requests.
                        </p>
                        <p>In the event that the business is sold or integrated with another business, your details will
                            be disclosed to our advisers and any prospective purchaser’s advisers, and to the new owners
                            of the business.</p>
                        <p className="mt-6 mb-2 text-base"><strong>Cookies and related technologies</strong></p>
                        <p>
                            We use cookies (and local storage objects, but we refer to these collectively as “cookies”
                            below), web beacons/tags, and other related approaches to collect information about your use
                            of our website. Cookies are small pieces of
                            information sent by a web server to a web browser, to allow certain functionality or
                            analytics. In particular, we use the following:
                        </p>
                        <p><i>Strictly Necessary Cookies</i></p>
                        <p>These cookies are essential in order to enable you to move around the website and use its
                            features.</p>
                        <p>Without these cookies, things you have asked for such as remembering your login details or
                            trade orders cannot be provided.</p>
                        <p>We also use these cookies to balance traffic over multiple servers, so we can keep it
                            responsive and capable of dealing with high traffic from all users.</p>
                        <p><i>Performance Cookies</i></p>
                        <p>
                            These cookies collect information on how people use our website. For example, we use these
                            to help us understand how customers arrive at our site, browse or use our site and highlight
                            areas where we can improve areas such as
                            navigation, trading, customer support and marketing.
                        </p>
                        <p><i>Functionality Cookies</i></p>
                        <p>These cookies remember choices you make such as the country you visit from, and language and
                            search parameters. These can then be used to provide you with an experience more appropriate
                            to your selections.</p>
                        <p><i>Controlling these technologies</i></p>
                        <p>
                            If you want to delete any cookies, please check your browser or device settings (and help
                            pages) for instructions on how to delete them. Your browser or device may also offer
                            tracking controls for things other than cookies, such as
                            beacons and tags.
                        </p>
                        <p>Please note that by deleting our cookies or disabling future cookies, in particular the
                            “strictly necessary” cookies described above, you may not be able to access certain areas or
                            features of our site.</p>
                        <p className="mt-6 mb-2 text-base"><strong>External links</strong></p>
                        <p>
                            Although our website and apps only look to include quality, safe and relevant external
                            links, users should always adopt a policy of caution before clicking any links to non-Nami
                            group websites or apps. We cannot control, guarantee
                            or verify their contents. They will have their own policies and practices, for example with
                            regard to privacy and personal data, and you should acquaint yourselves with those before
                            further engaging with those third party websites
                            or apps.
                        </p>
                        <p className="mt-6 mb-2 text-base"><strong>Changes to this Notice</strong></p>
                        <p>
                            We may revise this Privacy Notice from time to time. If we make a change to this notice that
                            we consider material, we will take steps to notify users by a notice on the website and/or
                            app. Your continued use of the Nami Exchange
                            website, apps and services (including API services) will be subject to the updated Privacy
                            Notice.
                        </p>
                        <p className="mt-6 mb-2 text-base"><strong>Getting in touch with us</strong></p>
                        <p>If you have any questions or concerns about how we process your data, you can get in touch
                            with us at support@nami.exchange.</p>
                        <p>
                            <br/>
                            &nbsp;
                        </p>
                    </div>
                </>}
                {language === 'vi' && <>
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold mb-7 ">
                            Chính sách quyền riêng tư
                            Nami Exchange

                        </h1>

                    </div>

                    <div className="card  bg-white dark:bg-dark rounded-lg text-tiny">
                        <p className="text-right pb-5">
                            <strong>Cập nhật lần cuối: tháng 08 năm 2023</strong>
                        </p>
                        <p>Thông báo này được soạn bằng tiếng Anh và phiên bản tiếng Anh sẽ được ưu tiên áp dụng trong
                            trường hợp có bất kỳ xung đột, khác biệt hoặc mơ hồ nào giữa các bản dịch.</p>
                        <ul>
                            <li>Tóm tắt về cách chúng tôi sử dụng dữ liệu của bạn</li>
                            <li>Thông báo này bao gồm những gì?</li>
                            <li>Chúng tôi xử lý dữ liệu cá nhân nào?</li>
                            <li>Chúng tôi sử dụng dữ liệu cá nhân này như thế nào và cơ sở pháp lý cho việc sử dụng này
                                là gì?
                            </li>
                            <li>Bạn có quyền gì?</li>
                            <li>Ra quyết định hoàn toàn tự động có thể có tác động đáng kể đến bạn</li>
                            <li>Dựa vào lợi ích chính đáng của chúng tôi</li>
                            <li>Rút lại sự đồng ý hoặc phản đối tiếp thị trực tiếp</li>
                            <li>Chúng tôi sẽ chia sẻ dữ liệu này với ai và ở đâu?</li>
                            <li>Cookie và các công nghệ liên quan</li>
                            <li>Liên kết ngoại vi</li>
                            <li>Những thay đổi đối với Thông báo này</li>
                            <li>Liên hệ với chúng tôi</li>
                        </ul>
                        <p className="mt-6 mb-2 text-base"><strong>Tóm tắt về cách chúng tôi sử dụng dữ liệu của bạn</strong></p>
                        <p>Chúng tôi tôn trọng quyền riêng tư của bạn và cam kết bảo vệ nó như được mô tả trong thông
                            báo này.</p>
                        <p>
                            Nami Exchange yêu cầu thông tin cá nhân cụ thể cho việc xác thực tài khoản (KYC). Chúng tôi
                            sử dụng dữ liệu cá nhân của bạn để cung cấp, cải thiện và quản lý nền tảng Nami Exchange, để
                            ký kết và thực hiện các điều khoản dịch vụ với
                            người dùng của chúng tôi cũng như tuân thủ các yêu cầu quy định.
                        </p>
                        <p>Dữ liệu được chia sẻ với các nhà cung cấp của chúng tôi và khi chúng tôi tin rằng việc làm
                            như vậy là cần thiết để tuân thủ các yêu cầu hoặc yêu cầu pháp lý.</p>
                        <p>Thông báo về quyền riêng tư của chúng tôi nêu thêm chi tiết về quá trình xử lý này, bao gồm
                            chi tiết về quyền bảo vệ dữ liệu của bạn.</p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Thông báo này bao gồm những gì?</strong></p>
                        <p>
                            Thông báo này mô tả cách Nami Exchange và các chi nhánh của nó (được gọi là “Nami” hoặc
                            “chúng tôi” trong thông báo này) sẽ thu thập, sử dụng và chia sẻ (tức là “xử lý”) dữ liệu cá
                            nhân của bạn liên quan đến trang web, ứng dụng và dịch
                            vụ (bao gồm cả dịch vụ API) của Nami Exchange.
                        </p>
                        <p>
                            Thông báo này cũng mô tả các quyền bảo vệ dữ liệu mà bạn có thể có (tùy thuộc vào luật hiện
                            hành), chẳng hạn như quyền phản đối một số quy trình xử lý mà Nami Exchange thực hiện. Thông
                            tin thêm về các quyền của bạn và cách thực hiện
                            chúng được nêu trong phần “Quyền của bạn”.
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Chúng tôi xử lý dữ liệu cá nhân nào?</strong></p>
                        <p>Chúng tôi xử lý dữ liệu cá nhân về bạn khi bạn tương tác với chúng tôi, trang web, ứng dụng
                            hoặc dịch vụ của chúng tôi (bao gồm cả dịch vụ API). Điêu nay bao gồm:</p>
                        <ul>
                            <li>Địa chỉ email/tên người dùng, mật khẩu và các chi tiết đăng nhập/bảo mật khác của bạn
                                (ví dụ: mật mã ứng dụng, xác thực hai yếu tố, bản ghi hạt giống mã thông báo, khóa PGP
                                công khai) và bản ghi đăng nhập;
                            </li>
                            <li>Chi tiết thanh toán/địa chỉ ví của bạn;</li>
                            <li>Chi tiết tài khoản và danh mục đầu tư của bạn, chẳng hạn như các đơn đặt hàng hiện tại
                                và lịch sử, giao dịch và vị thế cũng như số dư;
                            </li>
                            <li>Tùy chọn trang web và tài khoản của bạn, bao gồm thông báo trang web, âm thanh và hộp
                                thoại xác nhận cũng như tùy chọn bảng xếp hạng;
                            </li>
                            <li>Vị trí tự báo cáo của bạn cộng với vị trí địa lý của địa chỉ IP mà bạn kết nối từ đó;
                            </li>
                            <li>Các ưu tiên tiếp thị và giao tiếp khác của bạn cũng như hồ sơ về mọi sự đồng ý mà bạn đã
                                đưa ra cho chúng tôi;
                            </li>
                            <li>
                                Thông tin liên quan đến trình duyệt hoặc thiết bị bạn sử dụng để truy cập trang web hoặc
                                ứng dụng của chúng tôi, cũng như dữ liệu cho chúng tôi biết tính năng nào của trang
                                web/ứng dụng này phổ biến hoặc có vấn đề mà chúng tôi cần
                                khắc phục;
                            </li>
                            <li>Nội dung và chi tiết (ví dụ: ngày) của tin nhắn bạn đăng trong hộp trò chuyện với nhóm
                                hỗ trợ hoặc tin nhắn bạn gửi cho chúng tôi (ví dụ: các truy vấn hỗ trợ khách hàng); và
                                các ghi chú dịch vụ khách hàng và các hồ sơ khác.
                            </li>
                        </ul>
                        <p>
                            Chúng tôi sẽ hướng tới việc đánh dấu các trường dữ liệu là tùy chọn hoặc bắt buộc khi thu
                            thập dữ liệu cá nhân từ bạn thông qua các biểu mẫu. Đặc biệt, xin lưu ý rằng để tạo tài
                            khoản, tham gia giao dịch và khi cần thiết, chứng minh
                            danh tính của bạn, việc cung cấp dữ liệu cá nhân thường là bắt buộc: nếu dữ liệu liên quan
                            không được cung cấp thì chúng tôi sẽ không thể thực hiện những việc này và cung cấp các dịch
                            vụ mà bạn mong đợi.
                        </p>
                        <p>
                            Chúng tôi không thu thập dấu vân tay, dữ liệu nhận dạng khuôn mặt hoặc sinh trắc học khác.
                            Khi bạn bật bảo mật sinh trắc học (chẳng hạn như đăng nhập bằng vân tay hoặc Face ID), sinh
                            trắc học của bạn sẽ được thiết bị của bạn xử lý chứ
                            không phải chúng tôi.
                        </p>
                        <p className="mt-6 mb-2 text-base"><strong>Chúng tôi sử dụng dữ liệu cá nhân này như thế nào và cơ sở pháp lý cho việc sử dụng
                            này là gì?</strong></p>
                        <p>Chúng tôi xử lý dữ liệu cá nhân này cho các mục đích sau:</p>
                        <p>Để thực hiện (hoặc thực hiện các bước liên quan đến) thỏa thuận dịch vụ với bạn. Điều này bao
                            gồm:</p>
                        <ul>
                            <li>tạo tài khoản của bạn;</li>
                            <li>nhận tài sản số được gửi và phí cũng như thanh toán tài sản số cần rút;</li>
                            <li>cho phép bạn thực hiện giao dịch, duy trì tài khoản và lịch sử giao dịch của mình cũng
                                như đóng/tự động hủy đòn bẩy/thanh lý các vị thế theo các chính sách và điều khoản dịch
                                vụ đã công bố của chúng tôi;
                            </li>
                            <li>giao tiếp với bạn; và</li>
                            <li>cung cấp dịch vụ khách hàng;</li>
                        </ul>
                        <p>
                            Để giám sát, cải thiện và bảo vệ các dịch vụ trên trang web và ứng dụng của chúng tôi, đặc
                            biệt bằng cách xem cách chúng được sử dụng, thử nghiệm các lựa chọn thay thế (ví dụ: bằng
                            “thử nghiệm A/B” và chạy thử nghiệm phiên bản “beta”)
                            và bằng cách học hỏi từ phản hồi và nhận xét bạn cung cấp;
                        </p>
                        <p>Để cá nhân hóa trang web, ứng dụng và dịch vụ của chúng tôi;</p>
                        <p>Mời các cá nhân tham gia nghiên cứu thị trường và thử nghiệm beta.</p>
                        <p>Trường hợp bạn đồng ý cho chúng tôi (trong chừng mực cần có sự đồng ý đó):</p>
                        <p>Chúng tôi sẽ gửi cho bạn thông tin tiếp thị trực tiếp liên quan đến các sản phẩm và dịch vụ
                            có liên quan của chúng tôi hoặc các sản phẩm và dịch vụ khác do chúng tôi và các đối tác
                            được lựa chọn cẩn thận cung cấp;</p>
                        <p>Chúng tôi đặt cookie, giám sát việc tương tác email và sử dụng các công nghệ tương tự khác
                            theo Thông báo về cookie của chúng tôi và thông tin được cung cấp cho bạn khi sử dụng những
                            công nghệ đó;</p>
                        <p>Trong những trường hợp khác khi chúng tôi yêu cầu bạn đồng ý, chúng tôi sẽ sử dụng dữ liệu
                            cho mục đích mà chúng tôi giải thích tại thời điểm đó.</p>
                        <p>Cho các mục đích được pháp luật yêu cầu, cụ thể là: để đáp ứng yêu cầu của tòa án và cơ quan
                            công quyền có liên quan, chẳng hạn như cơ quan tiến hành điều tra.</p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Bạn có quyền gì?</strong></p>
                        <p>
                            Theo luật hiện hành, như được nêu dưới đây, bạn có một số quyền liên quan đến quyền riêng tư
                            và bảo vệ thông tin cá nhân của bạn. Bạn có quyền yêu cầu quyền truy cập, chỉnh sửa và xóa
                            thông tin cá nhân của mình cũng như yêu cầu khả năng
                            di chuyển dữ liệu. Bạn cũng có thể phản đối việc chúng tôi xử lý thông tin cá nhân của bạn
                            hoặc yêu cầu chúng tôi hạn chế việc xử lý thông tin cá nhân của bạn trong một số trường hợp
                            nhất định. Ngoài ra, khi bạn đồng ý cho chúng tôi xử
                            lý thông tin cá nhân của bạn cho một mục đích cụ thể, bạn có thể rút lại sự đồng ý của mình
                            bất cứ lúc nào. Nếu bạn muốn thực hiện bất kỳ quyền nào của mình, vui lòng liên hệ với chúng
                            tôi theo địa chỉ support@nami.exchange. Các quyền
                            này có thể bị hạn chế trong một số trường hợp - ví dụ: khi chúng tôi có thể chứng minh rằng
                            chúng tôi có yêu cầu pháp lý để xử lý dữ liệu cá nhân của bạn.
                        </p>
                        <ul>
                            <li>Quyền truy cập: bạn có quyền nhận được xác nhận rằng thông tin cá nhân của bạn đã được
                                xử lý và có được bản sao của thông tin đó cũng như một số thông tin nhất định liên quan
                                đến việc xử lý thông tin đó;
                            </li>
                            <li>Quyền khắc phục: bạn có thể yêu cầu chỉnh sửa thông tin cá nhân không chính xác của mình
                                và cũng có thể bổ sung thêm thông tin đó. Bạn cũng có thể thay đổi thông tin cá nhân
                                trong Tài khoản của mình bất kỳ lúc nào;
                            </li>
                            <li>Quyền xóa: trong một số trường hợp, bạn có thể xóa thông tin cá nhân của mình bằng cách
                                liên hệ với chúng tôi;
                            </li>
                            <li>
                                Quyền phản đối: bạn có thể phản đối, vì những lý do liên quan đến tình huống cụ thể của
                                bạn, việc xử lý thông tin cá nhân của bạn. Ví dụ: bạn có quyền phản đối nơi chúng tôi
                                dựa vào lợi ích hợp pháp hoặc nơi chúng tôi xử lý dữ liệu
                                của bạn cho mục đích tiếp thị trực tiếp;
                            </li>
                            <li>
                                Quyền hạn chế xử lý: Trong một số trường hợp nhất định, bạn có quyền tạm thời hạn chế
                                việc chúng tôi xử lý thông tin cá nhân của bạn, miễn là có căn cứ hợp lệ để làm như vậy.
                                Chúng tôi có thể tiếp tục xử lý thông tin cá nhân của bạn
                                nếu điều đó cần thiết để bảo vệ các khiếu nại pháp lý hoặc cho bất kỳ trường hợp ngoại
                                lệ nào khác được luật hiện hành cho phép;
                            </li>
                            <li>
                                Quyền di chuyển: trong một số trường hợp, bạn có thể yêu cầu nhận thông tin cá nhân mà
                                bạn đã cung cấp cho chúng tôi ở định dạng có cấu trúc, thường được sử dụng và có thể đọc
                                được bằng máy hoặc, khi có thể, chúng tôi thay mặt bạn
                                truyền đạt thông tin cá nhân của bạn trực tiếp đến bộ điều khiển dữ liệu khác;
                            </li>
                        </ul>
                        <p className="mt-6 mb-2 text-base"><strong>Các quyết định tự động có thể có tác động đến bạn</strong></p>
                        <p>
                            Như tài liệu dịch vụ trên trang web của chúng tôi và các điều khoản dịch vụ của chúng tôi
                            giải thích, nền tảng giao dịch của chúng tôi áp dụng các quy trình tự động nhất định dựa
                            trên vị thế giao dịch và tài nguyên trên tài khoản của
                            bạn.
                        </p>
                        <p>
                            Ví dụ: hầu hết các công cụ trên Nami Exchange đều có đòn bẩy cao. Để giữ các vị thế trong
                            các công cụ này luôn mở, nhà giao dịch có thể phải nắm giữ một phần trăm giá trị của vị thế
                            trên sàn giao dịch, được gọi là phần trăm Ký quỹ duy
                            trì. Nếu bạn không thể đáp ứng yêu cầu bảo trì của mình và do đó việc thanh lý được kích
                            hoạt, chúng tôi sẽ hủy các lệnh đang mở trên công cụ hiện tại, bạn sẽ bị thanh lý một phần
                            hoặc toàn bộ và số ký quỹ duy trì của bạn có thể bị mất.
                        </p>
                        <p>Việc ra quyết định tự động quan trọng khác sử dụng dữ liệu cá nhân của bạn cũng có thể được
                            sử dụng để bảo vệ tài khoản và duy trì các điều khoản dịch vụ của chúng tôi.</p>
                        <p>
                            Việc sử dụng và hành vi API được giám sát để bảo vệ hệ thống của chúng tôi và duy trì các
                            điều khoản dịch vụ của chúng tôi. Việc ra quyết định tự động có thể được sử dụng để quản lý
                            quyền truy cập API hoặc giấy phép giới hạn tỷ lệ của
                            tài khoản của bạn dựa trên hành vi giao dịch và sử dụng API của bạn (điều này có thể bao gồm
                            việc hạn chế hoặc ngăn chặn quyền truy cập và hoạt động trên tài khoản của bạn).
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Các lợi ích chính đáng của chúng tôi</strong></p>
                        <p>Trong phạm vi pháp luật yêu cầu, chúng tôi mong muốn thực hiện các cuộc kiểm tra công bằng và
                            định kỳ khi các hoạt động xử lý dữ liệu quan trọng được chứng minh dựa trên “lợi ích hợp
                            pháp” của chúng tôi, như được mô tả ở trên.</p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Rút lại sự đồng ý hoặc phản đối tiếp thị trực tiếp</strong></p>
                        <p>
                            Bất cứ khi nào chúng tôi dựa vào sự đồng ý của bạn, bạn sẽ luôn có thể rút lại sự đồng ý đó,
                            mặc dù chúng tôi có thể có các căn cứ pháp lý khác để xử lý dữ liệu của bạn cho các mục đích
                            khác, chẳng hạn như những mục đích đã nêu ở trên.
                            Trong một số trường hợp, chúng tôi có thể gửi hoặc hiển thị nội dung tiếp thị mà không cần
                            sự đồng ý của bạn. Bạn có quyền tuyệt đối từ chối tiếp thị trực tiếp hoặc lập hồ sơ mà chúng
                            tôi thực hiện để tiếp thị trực tiếp bất cứ lúc nào.
                            Bạn có thể thực hiện việc này bằng cách làm theo hướng dẫn trong thông báo trong trường hợp
                            đây là tin nhắn điện tử, thay đổi cài đặt tài khoản của bạn hoặc bằng cách liên hệ với chúng
                            tôi bằng cách sử dụng thông tin chi tiết được nêu
                            bên dưới.
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Chúng tôi sẽ chia sẻ dữ liệu này với ai và ở đâu?</strong></p>
                        <p>
                            Dữ liệu cá nhân có thể được chia sẻ với tòa án hoặc cơ quan công quyền nếu được yêu cầu như
                            mô tả ở trên, do pháp luật quy định hoặc được yêu cầu để bảo vệ pháp lý cho lợi ích hợp pháp
                            của chúng tôi hoặc bên thứ ba, tuân thủ luật pháp
                            hiện hành và yêu cầu của cơ quan có thẩm quyền.
                        </p>
                        <p>
                            Trong trường hợp doanh nghiệp được bán hoặc sáp nhập với một doanh nghiệp khác, thông tin
                            chi tiết của bạn sẽ được tiết lộ cho cố vấn của chúng tôi và bất kỳ cố vấn nào của người mua
                            tiềm năng cũng như chủ sở hữu mới của doanh nghiệp.
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Cookie và các công nghệ liên quan</strong></p>
                        <p>
                            Chúng tôi sử dụng cookie (và các đối tượng lưu trữ cục bộ, nhưng chúng tôi gọi chung là
                            “cookie” bên dưới), đèn hiệu/thẻ web và các phương pháp liên quan khác để thu thập thông tin
                            về việc bạn sử dụng trang web của chúng tôi. Cookie là
                            những mẩu thông tin nhỏ được máy chủ web gửi tới trình duyệt web để cho phép thực hiện một
                            số chức năng hoặc phân tích nhất định. Đặc biệt, chúng tôi sử dụng như sau:
                        </p>
                        <p><i>Cookie thực sự cần thiết</i></p>
                        <p>Những cookie này rất cần thiết để cho phép bạn di chuyển khắp trang web và sử dụng các tính
                            năng của nó.</p>
                        <p>Nếu không có những cookie này, những thứ bạn yêu cầu như ghi nhớ chi tiết đăng nhập hoặc lệnh
                            giao dịch sẽ không thể được cung cấp.</p>
                        <p>Chúng tôi cũng sử dụng các cookie này để cân bằng lưu lượng truy cập trên nhiều máy chủ, nhờ
                            đó chúng tôi có thể giữ cho nó phản hồi nhanh và có khả năng xử lý lưu lượng truy cập cao từ
                            tất cả người dùng.</p>
                        <p><i>Cookie hiệu suất</i></p>
                        <p>
                            Những cookie này thu thập thông tin về cách mọi người sử dụng trang web của chúng tôi. Ví
                            dụ: chúng tôi sử dụng những thông tin này để giúp chúng tôi hiểu cách khách hàng đến trang
                            web của chúng tôi, duyệt qua hoặc sử dụng trang web của
                            chúng tôi và nêu bật các lĩnh vực mà chúng tôi có thể cải thiện như điều hướng, giao dịch,
                            hỗ trợ khách hàng và tiếp thị.
                        </p>
                        <p><i>Cookie chức năng</i></p>
                        <p>
                            Những cookie này ghi nhớ các lựa chọn bạn thực hiện, chẳng hạn như quốc gia bạn truy cập
                            cũng như các thông số ngôn ngữ và tìm kiếm. Sau đó, những điều này có thể được sử dụng để
                            cung cấp cho bạn trải nghiệm phù hợp hơn với lựa chọn của
                            bạn.
                        </p>
                        <p><i>Kiểm soát các công nghệ này</i></p>
                        <p>
                            Nếu bạn muốn xóa bất kỳ cookie nào, vui lòng kiểm tra cài đặt trình duyệt hoặc thiết bị của
                            bạn (và các trang trợ giúp) để biết hướng dẫn về cách xóa chúng. Trình duyệt hoặc thiết bị
                            của bạn cũng có thể cung cấp các biện pháp kiểm soát
                            theo dõi cho những thứ khác ngoài cookie, chẳng hạn như đèn hiệu và thẻ.
                        </p>
                        <p>
                            Xin lưu ý rằng bằng cách xóa cookie của chúng tôi hoặc vô hiệu hóa các cookie trong tương
                            lai, đặc biệt là các cookie “cực kỳ cần thiết” được mô tả ở trên, bạn có thể không truy cập
                            được một số khu vực hoặc tính năng nhất định trên
                            trang web của chúng tôi.
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Liên kết ngoại vi</strong></p>
                        <p>
                            Mặc dù trang web và ứng dụng của chúng tôi chỉ mong muốn bao gồm các liên kết bên ngoài chất
                            lượng, an toàn và có liên quan nhưng người dùng phải luôn áp dụng chính sách thận trọng
                            trước khi nhấp vào bất kỳ liên kết nào đến các trang
                            web hoặc ứng dụng không phải của Nami Exchange. Chúng tôi không thể kiểm soát, đảm bảo hoặc
                            xác minh nội dung của chúng. Họ sẽ có các chính sách và thông lệ riêng, chẳng hạn như liên
                            quan đến quyền riêng tư và dữ liệu cá nhân, và bạn
                            nên tự làm quen với những chính sách đó trước khi tiếp tục tương tác với các trang web hoặc
                            ứng dụng của bên thứ ba đó.
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Những thay đổi đối với Thông báo này</strong></p>
                        <p>
                            Đôi khi, chúng tôi có thể sửa đổi Thông báo về quyền riêng tư này. Nếu chúng tôi thực hiện
                            thay đổi đối với thông báo này mà chúng tôi coi là quan trọng, chúng tôi sẽ thực hiện các
                            bước để thông báo cho người dùng bằng thông báo trên
                            trang web và/hoặc ứng dụng. Việc bạn tiếp tục sử dụng trang web, ứng dụng và dịch vụ của
                            Nami Exchange (bao gồm cả dịch vụ API) sẽ phải tuân theo Thông báo về quyền riêng tư được
                            cập nhật.
                        </p>
                        <p>&nbsp;</p>
                        <p className="mt-6 mb-2 text-base"><strong>Liên hệ với chúng tôi</strong></p>
                        <p>Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về cách chúng tôi xử lý dữ liệu của bạn, bạn có
                            thể liên hệ với chúng tôi tại support@nami.exchange.</p>
                        <p>
                            <br/>
                            &nbsp;
                        </p>
                    </div>
                </>}

            </div>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['footer', 'navbar', 'common']),
    },
});
export default Privacy;
