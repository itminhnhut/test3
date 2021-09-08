/* eslint-disable */
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import Footer from 'components/common/Footer';

const Terms = () => {
    const router = useRouter();
    const { locale } = router;

    return (
        <LayoutWithHeader>
            <div className="ats-container my-20 policies-page">
                { locale === 'vi' ? (
                    <>
                        <div className="text-center">
                            <div className="text-4xl font-semibold mb-7 ">
                                Chính sách Bảo mật Toàn cầu
                            </div>
                            <div className="text-lg text-black-600">
                                Nami Exchange
                            </div>
                            <div className="text-lg font-semibold ">
                                Bản cập nhật: 07 tháng 5, 2021
                            </div>
                        </div>
                        <div className="card bg-white rounded-lg p-10 lg:py-15 lg:px-[6.875rem]">
                            <div className="text-black-600 mb-10">
                                Nami Exchange tôn trọng và bảo vệ quyền riêng tư của khách hàng cũng như người truy
                                cập vào các trang web của chúng tôi. Chính sách Bảo mật này mô tả các phương thức xử lý
                                thông tin của chúng tôi khi bạn truy cập vào các dịch vụ của chúng tôi, bao gồm:
                                <ol className="mt-3">
                                    <li>nội dung của chúng tôi trên các trang web tại <a href="https://nami.exchange" target="_blank" rel="noreferrer">https://nami.exchange</a>;
                                    </li>
                                    <li>hoặc bất cứ trang web, fanpage, tính năng hoặc nội dung nào khác mà chúng tôi sở
                                        hữu hoặc vận hành (gọi chung là các “trang”);
                                    </li>
                                    <li>hoặc khi bạn sử dụng ứng dụng di động của Nami Exchange, Ứng dụng thẻ Nami
                                        Exchange (như được định nghĩa dưới đây);
                                    </li>
                                    <li>hoặc Nami Exchange API; Nami Exchange Custody API; các ứng dụng của bên thứ
                                        ba dựa trên API đó và các dịch vụ liên quan (đề cập đến sau đây gọi chung là
                                        "Dịch vụ").
                                    </li>
                                </ol>
                            </div>
                            <div className="section-1 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    VỀ VIỆC CHẤP NHẬN CHÍNH SÁCH BẢO MẬT
                                </div>
                                <div className="text-black-600 mb-6">
                                    Việc bạn truy cập và sử dụng Dịch vụ của chúng tôi, đồng nghĩa với việc bạn chấp
                                    nhận các điều khoản của Chính sách Bảo mật này. Khi chúng tôi yêu cầu sự đồng ý để
                                    xử lý thông tin cá nhân của bạn, có nghĩa chúng tôi sẽ yêu cầu sự đồng ý của bạn đối
                                    với việc thu thập, sử dụng và tiết lộ thông tin cá nhân của bạn theo như nội dung
                                    điều khoản được mô tả phía dưới. Chúng tôi có thể cung cấp các thông tin bổ sung
                                    "đúng lúc" về các phương pháp xử lý dữ liệu của các Dịch vụ cụ thể. Những thông tin
                                    này có thể bổ sung hoặc làm rõ việc thực hiện bảo đảm quyền riêng tư khách hàng của
                                    chúng tôi hoặc có thể cung cấp cho bạn các lựa chọn bổ sung về cách chúng tôi xử lý
                                    dữ liệu của bạn.
                                    <br />
                                    Nếu bạn không đồng ý hoặc bạn không thoải mái với bất kỳ khía cạnh nào của Chính
                                    sách Bảo mật này, bạn nên ngừng truy cập hoặc sử dụng Dịch vụ của chúng tôi ngay
                                    lập tức.
                                </div>
                            </div>
                            <div className="section-2 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    VỀ CÁC THAY ĐỔI ĐỐI VỚI CHÍNH SÁCH BẢO MẬT
                                </div>
                                <div className="text-black-600 mb-6">
                                    Chúng tôi có thể sửa đổi Chính sách Bảo mật này theo thời gian, các bản cập nhập sẽ
                                    được phân biệt thông qua thông tin về ngày cập nhập ở đầu mỗi bản. Nếu chúng tôi
                                    thực hiện bất kỳ thay đổi nào về mặt nội dung, chúng tôi sẽ thông báo cho bạn qua
                                    email (theo như địa chỉ email được dùng để đăng ký tài khoản của bạn), hoặc qua các
                                    hình thức thông báo trên Dịch vụ của chúng tôi trước khi thay đổi có hiệu lực, hoặc
                                    các hình thức khác theo yêu cầu của pháp luật.
                                </div>
                            </div>
                            <div className="section-3 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CÁC DỊCH VỤ Nami Exchange CUNG CẤP
                                </div>
                                <div className="text-black-600 mb-6">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="text-nowrap">
                                                    Nơi bạn sinh sống
                                                </th>
                                                <th className="text-nowrap">
                                                    Các dịch vụ được cung cấp
                                                </th>
                                                <th className="text-nowrap">
                                                    Đơn vị vận hành
                                                </th>
                                                <th className="text-nowrap">
                                                    Địa chỉ liên hệ
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Bất cứ quốc gia và vùng lãnh thổ nào ngoài Hoa Kỳ và Singapore</td>
                                                <td>
                                                    <div>Dịch vụ tiền điện tử</div>
                                                    <div>Dịch vụ tín dụng và cho vay</div>
                                                    <div>Dịch vụ giao dịch ký quỹ</div>
                                                </td>
                                                <td>Nami Exchange Pte. Ltd.</td>
                                                <td>Số 63 Ngô Sĩ Liên, Đống Đa, Hà Nội, Việt Nam.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    Nami Exchange xác định cách thức và mục đích xử lý thông tin cá nhân của bạn dựa
                                    trên Dịch vụ được cung cấp cho bạn (thường được gọi là “bộ kiểm soát dữ liệu”).
                                    <br />
                                    Bạn có thể được yêu cầu cung cấp thông tin cá nhân bất cứ lúc nào bạn liên hệ
                                    với Nami Exchange. Họ cũng có thể kết hợp các thông tin này với các thông tin
                                    khác để cung cấp và cải thiện các sản phẩm, dịch vụ và nội dung của chúng tôi
                                    (chi tiết bổ sung bên dưới).
                                    <br />
                                    Nếu bạn có bất kỳ câu hỏi nào về Tài khoản Nami Exchange, thông tin cá
                                    nhân của bạn hoặc Chính sách quyền riêng tư này, vui lòng gửi yêu cầu của
                                    bạn qua Trung tâm hỗ trợ của chúng tôi.
                                </div>
                            </div>
                            <div className="section-4 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    THÔNG TIN CÁ NHÂN CHÚNG TÔI THU THẬP
                                </div>
                                <div className="text-black-600 mb-6">
                                    Thông tin cá nhân thường là dữ liệu xác định một cá nhân hoặc liên quan đến một cá
                                    nhân có thể nhận dạng được. Các thông tin này bao gồm thông tin bạn cung cấp cho
                                    chúng tôi, thông tin được thu thập tự động về bạn và thông tin chúng tôi có được từ
                                    các bên thứ ba. Định nghĩa về thông tin cá nhân phụ thuộc vào luật hiện hành dựa
                                    trên vị trí thực của bạn (về mặt địa lý). Chỉ định nghĩa được áp dụng cho vị trí
                                    thực được áp dụng cho bạn trong Chính sách quyền riêng tư này. (VD: Nếu bạn định cư
                                    tại Việt Nam, vậy định nghĩa “thông tin cá nhân” của pháp luật Việt Nam sẽ được áp
                                    dụng cho bạn)
                                </div>
                                <div className="font-medium mb-3">
                                    Thông tin bạn cung cấp cho chúng tôi
                                </div>
                                <div className="text-black-600 mb-6">
                                    Để thiết lập tài khoản và truy cập Dịch vụ của chúng tôi, chúng tôi sẽ yêu cầu bạn
                                    cung cấp cho chúng tôi một số thông tin quan trọng về bản thân bạn. Thông tin này
                                    được yêu cầu bởi luật pháp (ví dụ: để xác minh danh tính của bạn), cần thiết để cung
                                    cấp các dịch vụ được yêu cầu (ví dụ: bạn sẽ cần cung cấp số tài khoản ngân hàng của
                                    mình nếu bạn muốn liên kết tài khoản đó với Nami Exchange) hoặc có liên quan đến
                                    một số mục đích cụ thể, được mô tả chi tiết hơn bên dưới. Khi chúng tôi thêm các
                                    tính năng và Dịch vụ mới, bạn có thể được yêu cầu cung cấp thêm thông tin.
                                    <br />
                                    Xin lưu ý rằng chúng tôi có thể sẽ không phục vụ bạn một cách hiệu quả hoặc cung
                                    cấp cho bạn Dịch vụ của chúng tôi nếu bạn chọn không chia sẻ một số thông tin
                                    nhất định với chúng tôi. Bất kỳ thông tin nào bạn cung cấp cho chúng tôi ngoài
                                    những thông tin được yêu cầu đều là tự nguyện.
                                </div>
                                <div className="font-medium mb-3">
                                    Chúng tôi có thể thu thập các loại thông tin sau từ bạn:
                                </div>
                                <div className="text-black-600 mb-6">
                                    <ul className="mt-3">
                                        <li>
                                            Thông tin Nhận dạng Cá nhân: Họ và tên, ngày sinh, quốc tịch, giới tính, chữ
                                            ký, hóa đơn tiện ích, ảnh, số điện thoại, địa chỉ nhà và / hoặc email.
                                        </li>
                                        <li>
                                            Thông tin nhận dạng chính thức: Giấy tờ tùy thân do chính phủ cấp như Hộ
                                            chiếu, Giấy phép lái xe, Chứng minh nhân dân, Mã số thuế, số hộ chiếu, chi
                                            tiết giấy phép lái xe, chi tiết chứng minh thư quốc gia, thông tin thị thực
                                            và/hoặc bất kỳ thông tin nào khác được cho là cần thiết tuân thủ các nghĩa
                                            vụ pháp lý của chúng tôi theo luật tài chính hoặc chống rửa tiền.
                                        </li>
                                        <li>
                                            Thông tin tổ chức: Số nhận dạng nhà tuyển dụng (hoặc số có thể so sánh do
                                            chính phủ cấp), bằng chứng về sự hình thành hợp pháp (ví dụ: Điều khoản
                                            thành lập), thông tin nhận dạng cá nhân cho tất cả các chủ sở hữu có lợi.
                                        </li>
                                        <li>
                                            Thông tin tài chính: Thông tin tài khoản ngân hàng, số tài khoản chính của
                                            thẻ thanh toán (PAN), lịch sử giao dịch, dữ liệu giao dịch và/hoặc mã số
                                            thuế.
                                        </li>
                                        <li>
                                            Thông tin giao dịch: Thông tin về các giao dịch bạn thực hiện trên Dịch vụ
                                            của chúng tôi, chẳng hạn như tên của người nhận, tên của bạn, số tiền
                                            và/hoặc thời gian.
                                        </li>
                                        <li>
                                            Thông tin việc làm: Vị trí văn phòng, chức danh công việc và/hoặc mô tả chức
                                            vụ.
                                        </li>
                                        <li>
                                            Khác: Các câu trả lời khảo sát, thông tin được cung cấp cho nhóm hỗ trợ của
                                            chúng tôi hoặc nhóm nghiên cứu người dùng.
                                        </li>
                                    </ul>
                                </div>
                                <div className="font-medium mb-5">
                                    Thông tin được thu thập tự động
                                </div>
                                <div className="text-black-600 mb-6">
                                    Trong phạm vi cho phép theo luật hiện hành, chúng tôi có thể tự động thu thập một số
                                    loại thông tin nhất định, chẳng hạn thời điểm bạn tương tác với Trang web hoặc sử
                                    dụng Dịch vụ. Thông tin này giúp chúng tôi giải quyết các vấn đề hỗ trợ khách hàng,
                                    cải thiện hiệu suất của Trang web và ứng dụng của chúng tôi, cung cấp cho bạn trải
                                    nghiệm được cá nhân hóa và hợp lý hóa, đồng thời bảo vệ tài khoản của bạn khỏi gian
                                    lận bằng cách phát hiện truy cập trái phép.
                                    Thông tin được thu thập tự động bao gồm:
                                    <ul className="mt-3">
                                        <li>Nhận dạng trực tuyến: Vị trí địa lý/chi tiết theo dõi, vân tay trình duyệt,
                                            hệ điều hành, tên và phiên bản trình duyệt và/hoặc địa chỉ IP cá nhân.
                                        </li>
                                        <li>Dữ liệu sử dụng: Dữ liệu xác thực, câu hỏi bảo mật, dữ liệu luồng nhấp, các
                                            bài đăng trên mạng xã hội công khai và các dữ liệu khác được thu thập qua
                                            cookie và các công nghệ tương tự.
                                        </li>
                                    </ul>
                                    Ví dụ: chúng tôi có thể tự động nhận và ghi lại thông tin sau vào nhật ký máy chủ
                                    của chúng tôi: (1) Cách bạn truy cập và sử dụng Dịch vụ; (2)Loại thiết bị và số nhận
                                    dạng thiết bị duy nhất; (3) Thông tin sự kiện thiết bị (chẳng hạn như sự cố, hoạt
                                    động hệ thống và cài đặt phần cứng, loại trình duyệt, ngôn ngữ trình duyệt, ngày và
                                    giờ yêu cầu của bạn và URL giới thiệu); (4) Cách thiết bị của bạn tương tác với các
                                    Trang web và Dịch vụ của chúng tôi, bao gồm các trang được truy cập và các liên kết
                                    được nhấp vào; (5) Vị trí địa lý rộng (ví dụ: quốc gia hoặc vị trí cấp thành phố);
                                    và (6) Dữ liệu kỹ thuật khác được thu thập thông qua cookie, thẻ pixel và các công
                                    nghệ tương tự khác nhận dạng duy nhất trình duyệt của bạn.
                                    <br />
                                    Chúng tôi cũng có thể sử dụng một số công cụ nhận dạng để nhận ra bạn khi bạn
                                    truy cập Trang web của chúng tôi qua một liên kết bên ngoài, chẳng hạn như một
                                    liên kết xuất hiện trên trang web của bên thứ ba.
                                </div>
                            </div>
                            <div className="section-7 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    THÔNG TIN ĐƯỢC THU THẬP TỪ BÊN THỨ BA
                                </div>
                                <div className="text-black-600 mb-6">
                                    Đôi khi, chúng tôi có thể lấy thông tin về bạn từ các nguồn của bên thứ ba theo yêu
                                    cầu hoặc cho phép của luật hiện hành. Các nguồn này có thể bao gồm:
                                    <ul className="mt-3">
                                        <li>
                                            Cơ sở dữ liệu công cộng, Phòng tín dụng & Đối tác xác minh ID: Chúng tôi lấy
                                            thông tin về bạn từ cơ sở dữ liệu công khai và đối tác xác minh ID cho mục
                                            đích xác minh danh tính của bạn theo luật hiện hành. Các đối tác xác minh ID
                                            như World-Check sử dụng kết hợp hồ sơ chính phủ và thông tin công khai về
                                            bạn để xác minh danh tính của bạn. Thông tin đó có thể bao gồm tên, địa chỉ,
                                            chức vụ, hồ sơ việc làm công khai, lịch sử tín dụng, tình trạng của bạn
                                            trong bất kỳ danh sách trừng phạt nào do cơ quan công quyền duy trì và các
                                            dữ liệu có liên quan khác. Chúng tôi lấy thông tin đó để tuân thủ các nghĩa
                                            vụ pháp lý của chúng tôi, chẳng hạn như luật chống rửa tiền. Trong một số
                                            trường hợp, chúng tôi có thể xử lý dữ liệu bổ sung về bạn để đánh giá rủi ro
                                            và đảm bảo Dịch vụ của chúng tôi không bị sử dụng cho mục đích gian lận hoặc
                                            cho các hoạt động bất hợp pháp khác.
                                        </li>
                                        <li>
                                            Dữ liệu Blockchain: Chúng tôi có thể phân tích dữ liệu blockchain công khai
                                            để đảm bảo các bên sử dụng Dịch vụ của chúng tôi không tham gia vào hoạt
                                            động bất hợp pháp hoặc bị cấm theo Điều khoản của chúng tôi và để phân tích
                                            xu hướng giao dịch cho mục đích nghiên cứu và phát triển.
                                        </li>
                                        <li>
                                            Đối tác tiếp thị chung & người bán lại: Ví dụ: trừ khi bị luật hiện hành
                                            cấm, các đối tác tiếp thị chung hoặc người bán lại có thể chia sẻ thông tin
                                            về bạn với chúng tôi để chúng tôi có thể hiểu rõ hơn về nhu cầu của bạn đối
                                            với các Dịch vụ của chúng tôi.
                                        </li>
                                        <li>
                                            Mạng Quảng cáo & Nhà cung cấp Phân tích: Chúng tôi làm việc với các nhà cung
                                            cấp này để cung cấp cho chúng tôi thông tin chưa được xác định về cách bạn
                                            tìm thấy Trang web của chúng tôi và cách bạn tương tác với Trang web và Dịch
                                            vụ. Thông tin này có thể được thu thập trước khi tạo tài khoản.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="section-8 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    DỮ LIỆU ẨN DANH VÀ DỮ LIỆU TỔNG THỂ
                                </div>
                                <div className="text-black-600 mb-6">
                                    Ẩn danh là một kỹ thuật xử lý dữ liệu sửa đổi thông tin cá nhân để nó không chỉ ra
                                    liên kết với một cá nhân cụ thể. Ngoại trừ phần này, không có quy định nào khác của
                                    Chính sách bảo mật này áp dụng cho dữ liệu khách hàng ẩn danh hoặc tổng hợp (tức là
                                    thông tin về khách hàng của chúng tôi mà chúng tôi kết hợp với nhau để nó không còn
                                    nhận dạng hoặc tham chiếu đến một khách hàng cá nhân).
                                    <br />
                                    Nami Exchange có thể sử dụng dữ liệu khách hàng ẩn danh hoặc tổng thể cho bất
                                    kỳ mục đích kinh doanh nào, bao gồm để hiểu rõ hơn về nhu cầu và hành vi của
                                    khách hàng, cải thiện các sản phẩm và dịch vụ của chúng tôi, thực hiện tiếp thị
                                    và thông minh kinh doanh cũng như phát hiện các mối đe dọa bảo mật. Chúng tôi có
                                    thể thực hiện phân tích của riêng mình trên dữ liệu ẩn danh hoặc kích hoạt phân
                                    tích do bên thứ ba cung cấp.
                                    <br />
                                    Các loại dữ liệu mà chúng tôi có thể ẩn danh bao gồm, dữ liệu giao dịch, dữ
                                    liệu luồng nhấp chuột, chỉ số hiệu suất và chỉ số gian lận.
                                </div>
                            </div>
                            <div className="section-9 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CÁCH CHÚNG TÔI SỬ DỤNG THÔNG TIN CÁ NHÂN CỦA BẠN
                                </div>
                                <div className="text-black-600 mb-6">
                                    Mục đích chính của chúng tôi khi thu thập thông tin cá nhân là cung cấp cho bạn trải
                                    nghiệm an toàn, mượt mà, hiệu quả và tùy chỉnh. Chúng tôi thường sử dụng thông tin
                                    cá nhân để tạo, phát triển, vận hành, cung cấp và cải thiện Dịch vụ, nội dung và
                                    quảng cáo của chúng tôi; và cho các mục đích ngăn ngừa tổn thất và chống gian lận.
                                    <br />
                                    Chúng tôi có thể sử dụng thông tin này theo những cách sau:
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        1. Để duy trì sự tuân thủ pháp luật và quy định
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Hầu hết các Dịch vụ cốt lõi của chúng tôi đều tuân theo các điều luật và quy
                                        định mà ở đó, chúng tôi được yêu cầu phải thu thập, sử dụng và lưu trữ thông
                                        tin cá nhân của bạn theo những cách nhất định. Ví dụ: Nami Exchange phải
                                        xác định và xác minh khách hàng sử dụng Dịch vụ của chúng tôi để tuân thủ
                                        luật chống rửa tiền ở các khu vực pháp lý. Điều này bao gồm việc thu thập và
                                        lưu trữ giấy tờ tùy thân có ảnh của bạn. Ngoài ra, chúng tôi sử dụng các bên
                                        thứ ba để xác minh danh tính của bạn bằng cách so sánh thông tin cá nhân mà
                                        bạn cung cấp với cơ sở dữ liệu và hồ sơ công khai của bên thứ ba. Khi bạn
                                        tìm cách liên kết tài khoản ngân hàng với Tài khoản Nami Exchange của
                                        mình, chúng tôi có thể yêu cầu bạn cung cấp thông tin bổ sung mà chúng tôi
                                        có thể sử dụng với sự cộng tác của các nhà cung cấp dịch vụ thay mặt chúng
                                        tôi để xác minh danh tính hoặc địa chỉ của bạn và/hoặc để quản lý rủi ro
                                        theo yêu cầu theo luật hiện hành. Nếu bạn không cung cấp thông tin cá nhân
                                        theo yêu cầu của pháp luật, chúng tôi buộc phải đóng tài khoản của bạn.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        2. Để thực thi các điều khoản của chúng tôi trong thỏa thuận người dùng và
                                        các thỏa thuận khác
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Nami Exchange xử lý thông tin nhạy cảm, chẳng hạn như dữ liệu nhận dạng và
                                        tài chính của bạn, vì vậy, điều rất quan trọng đối với chúng tôi và khách
                                        hàng của chúng tôi là chúng tôi phải tích cực theo dõi, điều tra, ngăn chặn
                                        và giảm thiểu mọi hoạt động có thể bị cấm hoặc bất hợp pháp, thực thi các
                                        thỏa thuận của chúng tôi với bên thứ ba và/hoặc ngăn chặn và phát hiện các
                                        hành vi vi phạm thỏa thuận người dùng đã đăng của chúng tôi hoặc các thỏa
                                        thuận cho các Dịch vụ khác. Ngoài ra, chúng tôi có thể cần thu phí dựa trên
                                        việc bạn sử dụng Dịch vụ của chúng tôi. Chúng tôi thu thập thông tin về việc
                                        sử dụng tài khoản của bạn và giám sát chặt chẽ các tương tác của bạn với
                                        Dịch vụ của chúng tôi. Chúng tôi có thể sử dụng bất kỳ thông tin cá nhân nào
                                        được thu thập của bạn cho những mục đích này. Hậu quả của việc không xử lý
                                        thông tin cá nhân của bạn cho các mục đích đó là tài khoản của bạn bị chấm
                                        dứt.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        3. Để phát hiện và ngăn chặn gian lận và/hoặc thất thoát tiền
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để giúp phát hiện, ngăn chặn và
                                        giảm thiểu gian lận và lạm dụng các dịch vụ của chúng tôi cũng như để bảo vệ
                                        bạn khỏi bị xâm phạm tài khoản hoặc mất tiền.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        4. Cung cấp Dịch vụ của Nami Exchange
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để cung cấp Dịch vụ cho bạn. Ví
                                        dụ: khi bạn muốn lưu trữ tiền trên nền tảng của chúng tôi, chúng tôi yêu cầu
                                        một số thông tin nhất định như thông tin nhận dạng, thông tin liên hệ và
                                        thông tin thanh toán của bạn. Chúng tôi không thể cung cấp cho bạn Dịch vụ
                                        mà không có thông tin đó. Các bên thứ ba như dịch vụ xác minh danh tính cũng
                                        có thể truy cập và / hoặc thu thập thông tin cá nhân của bạn khi cung cấp
                                        dịch vụ xác minh danh tính và / hoặc phòng chống gian lận.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        5. Cung cấp thông tin liên lạc Dịch vụ
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi gửi thông tin quản trị hoặc liên quan đến tài khoản cho bạn để cập
                                        nhật cho bạn về Dịch vụ của chúng tôi, thông báo cho bạn về các vấn đề bảo
                                        mật liên quan hoặc cập nhật hoặc cung cấp thông tin liên quan đến giao dịch
                                        khác. Nếu không có những thông tin liên lạc như vậy, bạn có thể không biết
                                        về những phát triển quan trọng liên quan đến tài khoản của bạn (những phát
                                        triển có thể ảnh hưởng đến cách bạn có thể sử dụng Dịch vụ của chúng tôi).
                                        Bạn không thể từ chối việc nhận các thông tin liên lạc dịch vụ quan trọng,
                                        chẳng hạn như email hoặc thông báo di động được gửi cho các mục đích pháp lý
                                        hoặc bảo mật.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        6. Cung cấp dịch vụ khách hàng
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn khi bạn liên hệ với chúng tôi để
                                        giải quyết mọi thắc mắc, tranh chấp, thu phí hoặc để khắc phục sự cố. Nếu
                                        không xử lý thông tin cá nhân của bạn cho các mục đích như vậy, chúng tôi
                                        không thể đáp ứng yêu cầu của bạn hoặc đảm bảo việc sử dụng Dịch vụ của bạn
                                        không bị gián đoạn.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        7. Để đảm bảo kiểm soát chất lượng
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để kiểm soát chất lượng và đào tạo
                                        nhân viên để đảm bảo rằng chúng tôi tiếp tục cung cấp cho bạn thông tin
                                        chính xác. Nếu chúng tôi không xử lý thông tin cá nhân cho mục đích kiểm
                                        soát chất lượng, bạn có thể gặp các vấn đề trên Dịch vụ như hồ sơ giao dịch
                                        không chính xác hoặc các gián đoạn khác.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        8. Để đảm bảo an ninh mạng và thông tin
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để tăng cường bảo mật, giám sát và
                                        xác minh danh tính hoặc quyền truy cập dịch vụ, tránh thư rác hoặc phần mềm
                                        độc hại hoặc rủi ro bảo mật khác và tuân thủ các quy định và luật bảo mật
                                        hiện hành. Mối đe dọa trên internet không ngừng phát triển, điều này khiến
                                        điều quan trọng hơn bao giờ hết là chúng tôi có thông tin chính xác và cập
                                        nhật về việc bạn sử dụng Dịch vụ của chúng tôi. Nếu không xử lý thông tin cá
                                        nhân của bạn, chúng tôi có thể không đảm bảo được tính bảo mật của Dịch vụ
                                        của mình.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        9. Đối với mục đích nghiên cứu và phát triển
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để hiểu rõ hơn về cách bạn sử dụng
                                        và tương tác với Dịch vụ của Nami Exchange. Ngoài ra, chúng tôi sử dụng
                                        thông tin đó để tùy chỉnh, đo lường và cải thiện Dịch vụ của Nami Exchange
                                        cũng như nội dung và bố cục của trang web và ứng dụng của chúng tôi cũng như
                                        để phát triển các dịch vụ mới. Nếu không có quá trình xử lý như vậy, chúng
                                        tôi không thể đảm bảo bạn tiếp tục được hưởng Dịch vụ của chúng tôi.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        10. Để nâng cao trải nghiệm của bạn
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để cung cấp trải nghiệm được cá
                                        nhân hóa và thực hiện các tùy chọn mà bạn yêu cầu. Ví dụ: bạn có thể chọn
                                        cung cấp cho chúng tôi quyền truy cập vào một số thông tin cá nhân được lưu
                                        trữ bởi các bên thứ ba. Nếu không có quá trình xử lý này, chúng tôi có thể
                                        không đảm bảo bạn tiếp tục được hưởng một phần hoặc tất cả Dịch vụ của chúng
                                        tôi.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        11. Để tạo điều kiện thuận lợi cho việc mua lại, sáp nhập hoặc giao dịch của
                                        công ty
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Chúng tôi xử lý thông tin cá nhân của bạn để hiểu rõ hơn về cách bạn sử dụng
                                        và tương tác với Dịch vụ của Nami Exchange. Ngoài ra, chúng tôi sử dụng
                                        thông tin đó để tùy chỉnh, đo lường và cải thiện Dịch vụ của Nami Exchange
                                        cũng như nội dung và bố cục của trang web và ứng dụng của chúng tôi cũng như
                                        để phát triển các dịch vụ mới. Nếu không có quá trình xử lý như vậy, chúng
                                        tôi không thể đảm bảo bạn tiếp tục được hưởng Dịch vụ của chúng tôi.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        12. Sử dụng cho các hoạt động tiếp thị
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Dựa trên ưu tiên của bạn về hình thức liên lạc, chúng tôi có thể gửi cho bạn
                                        thông tin tiếp thị (ví dụ: email hoặc thông báo trên điện thoại di động) để
                                        thông báo cho bạn về các sự kiện của chúng tôi hoặc các sự kiện đối tác của
                                        chúng tôi; để cung cấp các thông tin tiếp thị cá nhân hóa cho bạn; và cung
                                        cấp cho bạn các khuyến mại. Hoạt động tiếp thị của chúng tôi sẽ được tiến
                                        hành theo hình thức tiếp thị quảng cáo mà bạn và theo luật hiện hành cho
                                        phép.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        13. Cho tất cả các mục đích sử dụng
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        <table className="table">
                                            <tr>
                                                <td>
                                                    Loại thông tin cá nhân (chi tiết tại mục “các thông tin cá nhân
                                                    chúng tôi thu thập)
                                                </td>
                                                <td>
                                                    Nguồn thông tin cá nhân
                                                </td>
                                                <td>
                                                    Mục đích thu thập thông tin cá nhân
                                                </td>
                                                <td>
                                                    Việc chia sẻ thông tin cá nhân (chi tiết tại mục “Tại sao chúng
                                                    tôi chia sẻ thông tin cá nhân của bạn cho một bên thứ ba)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (A) Các công cụ nhận dạng như Thông tin nhận dạng cá nhân
                                                </td>
                                                <td>
                                                    Thông tin bạn cung cấp cho chúng tôi;
                                                    Thông tin chúng tôi thu thập được từ một bên thứ ba
                                                </td>
                                                <td>
                                                    Mục 1, 2, 3, 4, 5, 6, 8, 9, 11, 12
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; cơ quan tài
                                                    chính; các nhà cung cấp dịch vụ; các chuyên gia tư vấn.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (B) Các dữ liệu khách hàng như chữ ký
                                                </td>
                                                <td>
                                                    Thông tin bạn cung cấp cho chúng tôi;
                                                    Thông tin có được từ một bên thứ ba.
                                                </td>
                                                <td>
                                                    Mục 1, 2, 5, 6, 11
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; cơ quan tài
                                                    chính; các nhà cung cấp dịch vụ
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (C) Các thông tin được bảo vệ theo pháp luật Việt Nam, bao gồm
                                                    giới tính, tuổi tác và quốc tịch
                                                </td>
                                                <td>
                                                    Thông tin bạn cung cấp cho chúng tôi;
                                                    Thông tin có được từ một bên thứ ba.
                                                </td>
                                                <td>
                                                    Mục 1
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; các chuyên gia tư
                                                    vấn.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (D) Các thông tin tài chính như hồ sơ các dịch vụ đã mua, đang
                                                    sở hữu hoặc cân nhắc sẽ mua
                                                </td>
                                                <td>
                                                    Thông tin bạn cung cấp cho chúng tôi;
                                                    Thông tin chúng tôi thu thập được từ một bên thứ ba; Thông tin
                                                    chúng tôi thu thập tự động
                                                </td>
                                                <td>
                                                    Mục 3, 4, 5, 6, 8, 9, 10, 11, 12
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; cơ quan tài
                                                    chính; các nhà cung cấp dịch vụ; các chuyên gia tư vấn.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (E) Thông tin sinh trắc học
                                                </td>
                                                <td>
                                                    Thông tin bạn cung cấp cho chúng tôi
                                                </td>
                                                <td>
                                                    Mục 1
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; cơ quan tài chính
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (F) Dữ liệu sử dụng
                                                </td>
                                                <td>
                                                    Thông tin chúng tôi thu thập tự tự động
                                                </td>
                                                <td>
                                                    Mục 2, 3, 4, 6, 7, 8, 9, 10, 12
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; các chuyên gia tư
                                                    vấn; các nhà cung cấp dịch vụ
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (G) Công cụ xác định nhận dạng trực tuyến
                                                </td>
                                                <td>
                                                    Thông tin chúng tôi thu thập tự động
                                                </td>
                                                <td>
                                                    Mục 1, 3, 9, 12
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; các nhà cung cấp
                                                    dịch vụ
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (H) Các dữ liệu cảm ứng như audio, thông tin điện tử, dữ liệu
                                                    hình ảnh
                                                </td>
                                                <td>
                                                    Không thu thập
                                                </td>
                                                <td>
                                                    Không áp dụng
                                                </td>
                                                <td>
                                                    Không áp dụng
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (I) Dữ liệu liên quan đến hồ sơ việc làm
                                                </td>
                                                <td>
                                                    Thông tin chúng tôi thu thập tự động; Thông tin chúng tôi thu
                                                    thập từ một bên thứ 3
                                                </td>
                                                <td>
                                                    Mục 1, 12
                                                </td>
                                                <td>
                                                    Dịch vụ xác định nhận dạng của một bên thứ ba; các nhà cung cấp
                                                    dịch vụ
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (J) Thông tin về sở thích, ưu tiên, đặc điểm, khuynh hướng, v.v.
                                                </td>
                                                <td>
                                                    Thông tin bạn cung cấp cho chúng tôi;
                                                    Thông tin thu thập tự động
                                                </td>
                                                <td>
                                                    Mục 9, 10, 12
                                                </td>
                                                <td>
                                                    Các nhà cung cấp dịch vụ; các chuyên gia tư vấn
                                                </td>
                                            </tr>
                                        </table>
                                        Chúng tôi sẽ không sử dụng thông tin cá nhân của bạn cho các mục đích khác
                                        ngoài những mục đích mà chúng tôi đã mô tả cho bạn mà không có sự cho phép
                                        của bạn. Đôi khi, theo yêu cầu của luật hiện hành, chúng tôi có thể yêu cầu
                                        sự cho phép của bạn để cho phép chúng tôi chia sẻ thông tin cá nhân của bạn
                                        với các bên thứ ba. Bạn có thể chọn không chia sẻ thông tin cá nhân của mình
                                        với các bên thứ ba hoặc không cho phép chúng tôi sử dụng thông tin cá nhân
                                        của bạn cho bất kỳ mục đích nào không phù hợp với mục đích mà chúng tôi đã
                                        thu thập ban đầu hoặc sau đó đã được sự cho phép của bạn. Nếu bạn chọn giới
                                        hạn việc sử dụng thông tin cá nhân của mình, một số tính năng nhất định hoặc
                                        Dịch vụ của Nami Exchange có thể không khả dụng cho bạn.
                                    </div>
                                </div>
                            </div>
                            <div className="section-10 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    TIẾP THỊ
                                </div>
                                <div className="text-black-600 mb-6">
                                    Tiếp thị Trực tiếp: Tiếp thị trực tiếp bao gồm mọi phương thức có thể liên lạc với
                                    bạn chỉ dựa trên quảng cáo hoặc quảng bá các sản phẩm và dịch vụ của chúng tôi.
                                    Chúng tôi sẽ chỉ liên hệ với bạn bằng phương tiện điện tử (email hoặc SMS) dựa trên
                                    lợi ích hợp pháp của chúng tôi, khi được luật hiện hành cho phép hoặc khi có sự đồng
                                    ý của bạn. Trong phạm vi chúng tôi có thể dựa trên lợi ích hợp pháp theo luật hiện
                                    hành, chúng tôi sẽ chỉ gửi cho bạn thông tin về Dịch vụ của chúng tôi tương tự như
                                    những thông tin là chủ đề của một cuộc mua bán trước đây hoặc các cuộc đàm phán bán
                                    hàng cho bạn. Nếu bạn là khách hàng mới, chúng tôi sẽ liên hệ với bạn bằng phương
                                    tiện điện tử chỉ cho mục đích tiếp thị nếu bạn đồng ý với phương thức liên lạc đó.
                                    Nếu bạn không muốn chúng tôi gửi cho bạn thông tin tiếp thị, vui lòng chuyển đến cài
                                    đặt tài khoản của bạn để chọn không tham gia hoặc gửi yêu cầu qua trang web của
                                    chúng tôi. Bạn có thể đưa ra ý kiến phản đối liên quan đến quá trình xử lý ban đầu
                                    hoặc tiếp theo cho mục đích tiếp thị trực tiếp, bất kỳ lúc nào và miễn phí. Tiếp thị
                                    trực tiếp bao gồm bất kỳ thông tin liên lạc nào đến bạn chỉ dựa trên quảng cáo hoặc
                                    quảng bá các sản phẩm và dịch vụ của chúng tôi.
                                    <br />
                                    Tiếp thị bên thứ ba: Chúng tôi sẽ nhận được sự đồng ý rõ ràng của bạn trước khi
                                    chúng tôi chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào cho mục
                                    đích tiếp thị.
                                </div>
                            </div>
                            <div className="section-11 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    TẠI SAO CHÚNG TÔI CHIA SẺ THÔNG TIN CÁ NHÂN CỦA BẠN VỚI CÁC BÊN KHÁC
                                </div>
                                <div className="text-black-600 mb-6">
                                    Chúng tôi đảm bảo việc cẩn thận trong tiến hành xử lý thông tin để cho phép thông
                                    tin cá nhân của bạn chỉ được truy cập bởi những người yêu cầu quyền truy cập để thực
                                    hiện nhiệm vụ và công việc của họ và chỉ chia sẻ với các bên thứ ba có mục đích hợp
                                    pháp để truy cập nó. Nami Exchange sẽ không bao giờ bán hoặc cho thuê thông tin cá
                                    nhân của bạn cho bên thứ ba mà không có sự đồng ý rõ ràng của bạn. Chúng tôi sẽ chỉ
                                    chia sẻ thông tin của bạn trong các trường hợp sau:
                                    <ul>
                                        <li>
                                            Với các dịch vụ xác minh danh tính của bên thứ ba để ngăn chặn gian lận.
                                            Điều này cho phép Nami Exchange xác nhận danh tính của bạn bằng cách so
                                            sánh thông tin bạn cung cấp cho chúng tôi với hồ sơ công khai và cơ sở dữ
                                            liệu của bên thứ ba khác. Các nhà cung cấp dịch vụ này có thể tạo dữ liệu
                                            phái sinh dựa trên thông tin cá nhân của bạn có thể được sử dụng liên quan
                                            đến việc cung cấp các dịch vụ xác minh danh tính và phòng chống gian lận.
                                            Với các tổ chức tài chính mà chúng tôi hợp tác để xử lý các khoản thanh toán
                                            mà bạn đã ủy quyền.
                                        </li>
                                        <li>
                                            Với các nhà cung cấp dịch vụ theo hợp đồng, những người trợ giúp các bộ phận
                                            trong hoạt động kinh doanh của chúng tôi. Hợp đồng của chúng tôi yêu cầu các
                                            nhà cung cấp dịch vụ này chỉ sử dụng thông tin của bạn liên quan đến các
                                            dịch vụ mà họ thực hiện cho chúng tôi và cấm họ bán thông tin của bạn cho
                                            bất kỳ ai khác. Ví dụ về các nhà cung cấp dịch vụ mà chúng tôi có thể chia
                                            sẻ thông tin cá nhân (ngoài những nhà cung cấp dịch vụ được đề cập ở trên)
                                            bao gồm:
                                        </li>
                                        <li>
                                            Với các nhà cung cấp dịch vụ theo hợp đồng, những người trợ giúp các bộ phận
                                            trong hoạt động kinh doanh của chúng tôi. Hợp đồng của chúng tôi yêu cầu các
                                            nhà cung cấp dịch vụ này chỉ sử dụng thông tin của bạn liên quan đến các
                                            dịch vụ mà họ thực hiện cho chúng tôi và cấm họ bán thông tin của bạn cho
                                            bất kỳ ai khác. Ví dụ về các nhà cung cấp dịch vụ mà chúng tôi có thể chia
                                            sẻ thông tin cá nhân (ngoài những nhà cung cấp dịch vụ được đề cập ở trên)
                                            bao gồm:
                                            <ul>
                                                <li>Cơ sở hạ tầng mạng</li>
                                                <li>Lưu trữ đám mây</li>
                                                <li>Xử lý thanh toán</li>
                                                <li>Giám sát giao dịch</li>
                                                <li>Bảo vệ</li>
                                                <li>Dịch vụ kho tài liệu</li>
                                                <li>Hỗ trợ khách hàng</li>
                                                <li>Internet (ví dụ: ISP)</li>
                                                <li>Phân tích dữ liệu</li>
                                                <li>Công nghệ thông tin</li>
                                                <li>Tiếp thị</li>
                                            </ul>
                                        </li>
                                        <li>
                                            Với các công ty hoặc tổ chức khác mà chúng tôi dự định hợp nhất hoặc được
                                            mua lại. Bạn sẽ nhận được thông báo trước về bất cứ thay đổi nào trong các
                                            chính sách hiện hành.
                                        </li>
                                        <li>
                                            Với các công ty hoặc pháp nhân khác mua tài sản Nami Exchange theo một
                                            giao dịch bán được tòa án chấp thuận hoặc nơi chúng tôi được yêu cầu chia sẻ
                                            thông tin của bạn theo luật mất khả năng thanh khoản ở bất kỳ khu vực pháp
                                            lý hiện hành nào.
                                        </li>
                                        <li>
                                            Với các cố vấn chuyên nghiệp của chúng tôi, những người cung cấp các dịch vụ
                                            ngân hàng, pháp lý, tuân thủ, bảo hiểm, kế toán hoặc các dịch vụ tư vấn khác
                                            để hoàn thành kiểm toán tài chính, kỹ thuật, tuân thủ và pháp lý của bên thứ
                                            ba đối với hoạt động của chúng tôi hoặc tuân thủ các nghĩa vụ pháp lý của
                                            chúng tôi.
                                        </li>
                                        <li>
                                            Với cơ quan thực thi pháp luật, các quan chức hoặc các bên thứ ba khác khi
                                            chúng tôi buộc phải làm như vậy theo trát đòi hầu tòa, lệnh tòa hoặc thủ tục
                                            pháp lý tương tự hoặc khi chúng tôi tin rằng việc tiết lộ thông tin cá nhân
                                            là cần thiết để ngăn ngừa tổn hại về thể chất hoặc tài mất mát, để báo cáo
                                            hoạt động bất hợp pháp bị nghi ngờ hoặc để điều tra vi phạm Thỏa thuận người
                                            dùng của chúng tôi hoặc bất kỳ chính sách hiện hành nào khác.
                                        </li>
                                    </ul>
                                    Nếu bạn thiết lập một Tài khoản Nami Exchange gián tiếp trên trang web của bên thứ
                                    ba hoặc thông qua ứng dụng của bên thứ ba, bất kỳ thông tin nào bạn nhập trên trang
                                    web hoặc ứng dụng đó (và không trực tiếp trên trang web Nami Exchange) sẽ được
                                    chia sẻ với chủ sở hữu của bên thứ ba trang web hoặc ứng dụng và thông tin của bạn
                                    sẽ tuân theo chính sách bảo mật của họ.
                                </div>
                            </div>
                            <div className="section-12 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CÁC TRANG WEB VÀ DỊCH VỤ CỦA BÊN THỨ BA
                                </div>
                                <div className="text-black-600 mb-6">
                                    Nếu bạn cho phép một hoặc nhiều ứng dụng của bên thứ ba truy cập Dịch vụ Nami
                                    Exchange của mình, thì thông tin bạn đã cung cấp cho Nami Exchange có thể được
                                    chia sẻ với các bên thứ ba đó. Kết nối mà bạn cho phép hoặc kích hoạt giữa tài khoản
                                    Nami Exchange và tài khoản, công cụ thanh toán hoặc nền tảng không phải Nami
                                    Exchange được coi là “kết nối tài khoản”. Trừ khi bạn cung cấp thêm quyền, Nami
                                    Exchange sẽ không cho phép các bên thứ ba này sử dụng thông tin này cho bất kỳ mục
                                    đích nào khác ngoài việc tạo thuận lợi cho các giao dịch của bạn bằng cách sử dụng
                                    Dịch vụ Nami Exchange. Xin lưu ý rằng các bên thứ ba mà bạn tương tác có thể có
                                    chính sách bảo mật của riêng họ và Nami Exchange không chịu trách nhiệm về hoạt
                                    động của họ hoặc việc sử dụng dữ liệu mà họ thu thập. Thông tin được thu thập bởi
                                    các bên thứ ba, có thể bao gồm những thứ như chi tiết liên hệ, thông tin tài chính
                                    hoặc dữ liệu vị trí, được điều chỉnh bởi các thực tiễn về quyền riêng tư của họ và
                                    Nami Exchange không chịu trách nhiệm về hành vi trái phép của bên thứ ba. Chúng
                                    tôi khuyến khích bạn tìm hiểu về thực tiễn bảo mật của các bên thứ ba đó.
                                    <br />
                                    Ví dụ về kết nối tài khoản bao gồm:
                                    <ul className="mt-3">
                                        <li>
                                            Người bán: Nếu bạn sử dụng tài khoản Nami Exchange để thực hiện giao
                                            dịch với người bán bên thứ ba, người bán có thể cung cấp dữ liệu về bạn
                                            và giao dịch của bạn cho chúng tôi.
                                        </li>
                                        <li>
                                            Nhà cung cấp dịch vụ tài chính của bạn: Ví dụ: nếu bạn gửi tiền cho
                                            chúng tôi từ tài khoản ngân hàng của mình, ngân hàng của bạn sẽ cung cấp
                                            cho chúng tôi thông tin nhận dạng ngoài những thông tin về tài khoản của
                                            bạn để hoàn tất giao dịch.
                                        </li>
                                    </ul>
                                    Thông tin mà chúng tôi chia sẻ với bên thứ ba dựa trên kết nối tài khoản sẽ được
                                    sử dụng và tiết lộ theo các quy định về quyền riêng tư của bên thứ ba. Vui lòng
                                    xem lại thông báo bảo mật của bất kỳ bên thứ ba nào có quyền truy cập vào thông
                                    tin cá nhân của bạn. Nami Exchange không chịu trách nhiệm về hành vi của bên
                                    thứ ba đó.
                                </div>
                            </div>
                            <div className="section-13 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CÁCH CHÚNG TÔI BẢO VỆ VÀ LƯU TRỮ THÔNG TIN CÁ NHÂN
                                </div>
                                <div className="text-black-600 mb-6">
                                    Chúng tôi hiểu quyền riêng tư của bạn quan trọng như thế nào, đó là lý do tại sao
                                    Nami Exchange duy trì (và theo đưa ra điều khoản ràng buộc, yêu cầu các bên thứ ba
                                    chia sẻ thông tin của bạn để duy trì) các biện pháp bảo vệ vật lý, kỹ thuật và hành
                                    chính thích hợp để bảo vệ tính bảo mật và bí mật của thông tin cá nhân mà bạn giao
                                    phó cho chúng tôi.
                                    <br />
                                    Chúng tôi có thể lưu trữ và xử lý tất cả hoặc một phần thông tin cá nhân và giao
                                    dịch của bạn, bao gồm một số thông tin thanh toán nhất định, chẳng hạn như tài
                                    khoản ngân hàng được mã hóa và / hoặc số định tuyến của bạn nơi đặt trụ sở của
                                    chúng tôi hoặc các nhà cung cấp dịch vụ của chúng tôi. Chúng tôi bảo vệ thông
                                    tin cá nhân của bạn bằng cách duy trì các biện pháp bảo vệ vật lý, điện tử và
                                    thủ tục tuân thủ các luật và quy định hiện hành.
                                    <br />
                                    Ví dụ: chúng tôi sử dụng các biện pháp bảo vệ máy tính như tường lửa và mã
                                    hóa dữ liệu, chúng tôi thực thi các biện pháp kiểm soát truy cập vật lý vào
                                    các tòa nhà và hồ sơ của mình, đồng thời chúng tôi chỉ cho phép truy cập
                                    thông tin cá nhân cho những nhân viên cần thông tin đó để hoàn thành trách
                                    nhiệm công việc của họ. Tuy nhiên, chúng tôi không thể đảm bảo rằng việc mất
                                    mát, sử dụng sai, thu thập trái phép hoặc thay đổi dữ liệu của bạn sẽ không
                                    xảy ra. Vui lòng nhận biết rằng bạn đóng một vai trò quan trọng trong việc
                                    bảo vệ thông tin cá nhân của chính bạn. Khi đăng ký với Dịch vụ của chúng
                                    tôi, điều quan trọng là chọn mật khẩu có đủ độ dài và độ phức tạp, để không
                                    tiết lộ mật khẩu này cho bất kỳ bên thứ ba nào và thông báo ngay cho chúng
                                    tôi nếu bạn biết về bất kỳ truy cập hoặc sử dụng trái phép nào vào tài khoản
                                    của mình.
                                    <br />
                                    Hơn nữa, chúng tôi không thể đảm bảo hoặc đảm bảo tính bảo mật hoặc bí
                                    mật của thông tin bạn truyền cho chúng tôi hoặc nhận từ chúng tôi bằng
                                    kết nối Internet hoặc không dây, bao gồm email, điện thoại hoặc SMS, vì
                                    chúng tôi không có cách nào để bảo vệ thông tin đó khi nó rời khỏi và
                                    cho đến khi nó đến với chúng tôi. Nếu bạn có lý do để tin rằng dữ liệu
                                    của bạn không còn an toàn, vui lòng liên hệ với chúng tôi bằng cách sử
                                    dụng thông tin liên hệ được cung cấp trong Chính sách bảo mật này.
                                </div>
                            </div>
                            <div className="section-14 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    VỀ VIỆC LƯU TRỮ THÔNG TIN CÁ NHÂN
                                </div>
                                <div className="text-black-600 mb-6">
                                    Chúng tôi lưu trữ thông tin cá nhân của bạn một cách an toàn trong suốt thời gian sử
                                    dụng của Tài khoản Nami Exchange của bạn. Chúng tôi sẽ chỉ lưu giữ thông tin cá
                                    nhân của bạn chừng nào thông tin đó còn cần thiết để thực hiện các mục đích mà chúng
                                    tôi đã thu thập, bao gồm cả mục đích đáp ứng mọi nghĩa vụ pháp lý, kế toán hoặc báo
                                    cáo hoặc để giải quyết tranh chấp. Mặc dù có các yêu cầu lưu giữ khác nhau tùy theo
                                    khu vực tài phán, thông tin về khoảng thời gian lưu giữ điển hình của chúng tôi đối
                                    với từng loại thông tin cá nhân khác nhau của bạn được mô tả bên dưới.
                                    <ul className="mt-3">
                                        <li>
                                            Thông tin cá nhân được thu thập để tuân thủ các nghĩa vụ pháp lý của chúng
                                            tôi theo luật tài chính hoặc chống rửa tiền có thể được lưu giữ sau khi đóng
                                            tài khoản miễn là được yêu cầu theo luật đó.
                                        </li>
                                        <li>
                                            Thông tin Liên hệ như tên, địa chỉ email và số điện thoại của bạn cho mục
                                            đích tiếp thị được lưu giữ liên tục cho đến khi bạn hủy đăng ký. Sau đó,
                                            chúng tôi sẽ thêm thông tin chi tiết của bạn vào danh sách của chúng tôi để
                                            đảm bảo chúng tôi không vô tình tiếp thị cho bạn.
                                        </li>
                                        <li>
                                            Nội dung mà bạn đăng trên trang web của chúng tôi như nhận xét của bộ phận
                                            hỗ trợ, ảnh, video, bài đăng trên blog và các nội dung khác có thể được giữ
                                            lại sau khi bạn đóng tài khoản của mình vì mục đích kiểm toán và phòng chống
                                            tội phạm (ví dụ: để ngăn chặn một kẻ gian lận đã biết mở tài khoản mới ).
                                        </li>
                                        <li>
                                            Việc ghi âm các cuộc điện thoại của chúng tôi với bạn có thể được lưu giữ
                                            trong khoảng thời gian lên đến sáu năm.
                                        </li>
                                        <li>
                                            Thông tin được thu thập thông qua các phương tiện kỹ thuật như cookie, bộ
                                            đếm trang web và các công cụ phân tích khác được lưu giữ trong khoảng thời
                                            gian lên đến một năm kể từ khi cookie hết hạn.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="section-15 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    THÔNG TIN CÁ NHÂN CỦA TRẺ EM
                                </div>
                                <div className="text-black-600 mb-6">
                                    Chúng tôi không cố ý yêu cầu thu thập thông tin cá nhân từ bất kỳ người nào dưới 18
                                    tuổi. Nếu người dùng gửi thông tin cá nhân bị nghi ngờ là dưới 18 tuổi, Nami
                                    Exchange sẽ yêu cầu người dùng đóng tài khoản của mình và sẽ không cho phép người
                                    dùng tiếp tục sử dụng Dịch vụ của chúng tôi. Chúng tôi cũng sẽ thực hiện các bước để
                                    xóa thông tin trong thời gian sớm nhất. Vui lòng thông báo cho chúng tôi nếu bạn
                                    biết về bất kỳ cá nhân nào dưới 18 tuổi sử dụng Dịch vụ của chúng tôi để chúng tôi
                                    có thể thực hiện hành động ngăn chặn quyền truy cập vào Dịch vụ của chúng tôi.
                                    <br />
                                    Nếu bạn có khiếu nại về thực tiễn bảo mật và việc chúng tôi thu thập, sử dụng
                                    hoặc tiết lộ thông tin cá nhân, vui lòng gửi yêu cầu của bạn qua trang web của
                                    chúng tôi.
                                </div>
                            </div>
                            <div className="section-16 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    QUYỀN RIÊNG TƯ CỦA BẠN
                                </div>
                                <div className="text-black-600 mb-6">
                                    Tùy thuộc vào luật hiện hành nơi bạn cư trú, bạn có thể khẳng định một số quyền liên
                                    quan đến thông tin cá nhân của bạn được xác định bên dưới. Nếu bất kỳ quyền nào được
                                    liệt kê dưới đây không được pháp luật quy định cho pháp nhân hoạt động hoặc khu vực
                                    tài phán của bạn, Nami Exchange có toàn quyền quyết định trong việc cung cấp cho
                                    bạn những quyền đó.
                                    <br />
                                    Quyền của bạn đối với thông tin cá nhân không phải là tuyệt đối. Tùy thuộc vào
                                    luật hiện hành, quyền truy cập có thể bị từ chối: (a) khi luật pháp yêu cầu hoặc
                                    cho phép từ chối quyền truy cập; (b) khi cấp quyền truy cập sẽ có tác động tiêu
                                    cực đến quyền riêng tư của người khác; (c) để bảo vệ các quyền và tài sản của
                                    chúng tôi; (d) khi yêu cầu có tính không rõ ràng, thực tế hoặc gây khó chịu,
                                    hoặc vì các lý do khác.
                                    <ul className="mt-3">
                                        <li>
                                            Khả năng truy cập và khả năng chuyển dịch dữ liệu. Bạn có thể yêu cầu
                                            chúng tôi cung cấp cho bạn bản sao những thông tin cá nhân của bạn do
                                            chúng tôi nắm giữ. Thông tin này sẽ được cung cấp trong một thời gian
                                            xác định và có thể đi kèm với một khoản phí liên quan đến việc thu thập
                                            thông tin (theo luật cho phép), trừ khi việc cung cấp đó ảnh hưởng xấu
                                            đến quyền và tự do của người khác. Trong một số trường hợp nhất định,
                                            bạn có thể yêu cầu nhận thông tin cá nhân của mình ở định dạng có cấu
                                            trúc, được sử dụng phổ biến và máy có thể đọc được, đồng thời yêu cầu
                                            chúng tôi chuyển trực tiếp thông tin cá nhân của bạn đến một người kiểm
                                            soát dữ liệu khác.
                                        </li>
                                        <li>
                                            Yêu cầu chỉnh sửa thông tin cá nhân không đầy đủ hoặc không chính xác.
                                            Bạn có thể yêu cầu chúng tôi cải chính hoặc cập nhật bất kỳ thông tin cá
                                            nhân nào của bạn do Nami Exchange nắm giữ là không chính xác. Bạn có
                                            thể thực hiện việc này bất kỳ lúc nào bằng cách đăng nhập vào tài khoản
                                            của mình và nhấp vào tab Hồ sơ hoặc Tài khoản của tôi.
                                        </li>
                                        <li>
                                            Xóa thông tin. Bạn có thể yêu cầu xóa thông tin cá nhân của mình, tùy
                                            thuộc vào luật hiện hành. Nếu bạn đóng Tài khoản Nami Exchange, chúng
                                            tôi sẽ đánh dấu tài khoản của bạn trong cơ sở dữ liệu của chúng tôi là
                                            "Đã đóng", nhưng sẽ giữ một số thông tin tài khoản nhất định, bao gồm cả
                                            yêu cầu xóa của bạn, trong cơ sở dữ liệu của chúng tôi trong một khoảng
                                            thời gian như được mô tả ở trên. Điều này là cần thiết để ngăn chặn gian
                                            lận, bằng cách đảm bảo rằng những người cố gắng thực hiện hành vi gian
                                            lận sẽ không thể tránh bị phát hiện chỉ đơn giản bằng cách đóng tài
                                            khoản của họ và mở một tài khoản mới, đồng thời tuân thủ các nghĩa vụ
                                            pháp lý của Nami Exchange. Tuy nhiên, nếu bạn đóng tài khoản của mình,
                                            thông tin cá nhân của bạn sẽ không được chúng tôi sử dụng cho bất kỳ mục
                                            đích nào khác, cũng như không được chia sẻ với bên thứ ba, trừ trường
                                            hợp cần thiết để ngăn chặn gian lận và hỗ trợ thực thi pháp luật, theo
                                            yêu cầu của pháp luật hoặc theo Quyền riêng tư này Chính sách.
                                        </li>
                                        <li>
                                            Thu hồi việc cấp quyền sử dụng thông tin cá nhân. Trong phạm vi việc xử
                                            lý thông tin cá nhân của bạn dựa trên sự đồng ý của bạn, bạn có thể rút
                                            lại sự đồng ý của mình bất kỳ lúc nào. Việc này sẽ không ảnh hưởng đến
                                            tính hợp pháp trong quá trình xử lý thông tin cá nhân trước đó của
                                            Nami Exchange dựa trên sự đồng thuận trước khi bạn thu hồi quyền sử
                                            dụng.
                                        </li>
                                        <li>
                                            Hạn chế của quá trình xử lý. Ở một số khu vực pháp lý, luật hiện hành có
                                            thể cho bạn quyền hạn chế hoặc phản đối việc chúng tôi xử lý thông tin
                                            cá nhân của bạn trong một số trường hợp nhất định. Chúng tôi có thể tiếp
                                            tục xử lý thông tin cá nhân của bạn nếu cần thiết để bảo vệ các khiếu
                                            nại pháp lý hoặc đối với bất kỳ trường hợp ngoại lệ nào khác được luật
                                            hiện hành cho phép.
                                        </li>
                                        <li>
                                            Tự động ra quyết định cá nhân, bao gồm cả việc lập hồ sơ. Nami
                                            Exchange dựa trên các công cụ tự động để giúp xác định xem một giao dịch
                                            hoặc tài khoản khách hàng có gian lận hoặc rủi ro pháp lý hay không. Ở
                                            một số khu vực pháp lý, bạn có quyền không phải chịu một quyết định chỉ
                                            dựa trên quá trình xử lý tự động thông tin cá nhân của bạn, bao gồm cả
                                            việc lập hồ sơ, điều này tạo ra các ảnh hưởng pháp lý hoặc các ảnh hưởng
                                            tương tự đối với bạn, để tránh các trường hợp ngoại lệ áp dụng theo luật
                                            bảo vệ dữ liệu có liên quan.
                                        </li>
                                    </ul>
                                </div>
                                <div className="font-medium mb-3">
                                    Cách đưa ra yêu cầu về quyền riêng tư
                                </div>
                                <div className="text-black-600 mb-6">
                                    Bạn có thể đưa ra các yêu cầu về quyền riêng tư liên quan đến thông tin cá nhân của
                                    mình bằng cách truy cập Trang về quyền riêng tư của bạn hoặc liên hệ với chúng tôi
                                    qua trang web của chúng tôi nếu bạn không thể truy cập Trang. Trang về Quyền riêng
                                    tư của chúng tôi cũng cho phép bạn thiết lập các tùy chọn giao tiếp của mình và đưa
                                    ra các yêu cầu về quyền cá nhân liên quan đến thông tin cá nhân của bạn. Chúng tôi
                                    đặc biệt khuyến khích bạn thực hiện bất kỳ yêu cầu quyền cá nhân nào thông qua Trang
                                    tổng quan về quyền riêng tư vì nó đảm bảo rằng bạn đã được xác thực (dựa trên thông
                                    tin KYC bạn đã cung cấp để mở tài khoản của mình và bằng cách cung cấp thông tin
                                    đăng nhập cần thiết và xác thực đa yếu tố để truy cập tài khoản). Nếu không, khi
                                    chúng tôi nhận được yêu cầu về quyền cá nhân thông qua các phương thức tiếp nhận
                                    khác, chúng tôi có thể thực hiện các bước để xác minh danh tính của bạn trước khi
                                    thực hiện yêu cầu để bảo vệ quyền riêng tư và bảo mật của bạn.
                                </div>
                                <div className="font-medium mb-3">
                                    Cách khiếu nại
                                </div>
                                <div className="text-black-600 mb-6">
                                    Nếu bạn tin rằng chúng tôi đã vi phạm quyền của bạn, trước tiên chúng tôi khuyến
                                    khích bạn gửi yêu cầu qua trang web của chúng tôi để chúng tôi có thể cố gắng giải
                                    quyết vấn đề hoặc tranh chấp một cách không chính thức. Nếu điều đó không giải quyết
                                    được sự cố của bạn, bạn có thể liên hệ với Nami Exchange qua số điện thoại của
                                    công ty.
                                </div>
                            </div>
                            <div className="section-17 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CÁCH THỨC LIÊN LẠC
                                </div>
                                <div className="text-black-600 mb-6">
                                    Nếu bạn có câu hỏi hoặc thắc mắc liên quan đến Chính sách Bảo mật này, hoặc nếu bạn
                                    có khiếu nại, vui lòng liên hệ với chúng tôi trên Fanpage của chúng tôi hoặc bằng
                                    cách gửi thư cho chúng tôi theo địa chỉ chính thức của công ty như đã nêu ở phía
                                    trên.
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <div className="text-4xl font-semibold mb-7 ">
                                Global Privacy Policy
                            </div>
                            <div className="text-lg text-black-600 ">
                                Nami Exchange
                            </div>
                            <div className="text-lg font-semibold ">
                                Last updated: May, 7th 2021
                            </div>
                        </div>
                        <div className="card bg-white rounded-lg my-20 p-10 py-15 px-[6.875rem]">
                            <div className="text-black-600 mb-10">
                                We at Nami Exchange (defined below) respect and protect the privacy of visitors to our
                                websites and our customers. This Privacy Policy describes our information handling
                                practices when you access our services, which include our content on the websites
                                located at attlas.io, or any other websites, pages, features, or content we own or
                                operate (collectively, the "Site(s)") or when you use the Nami Exchange mobile app,
                                the Nami Exchange Card App (as defined below), any, Nami Exchange , or Nami
                                Exchange Custody API or third party applications relying on such an API, and related
                                services (referred to collectively hereinafter as "Services").
                                <br />
                                Please take a moment to read this Privacy Policy carefully. If you have any
                                questions about this Policy, please submit your request via our Support Email.
                            </div>
                            <div className="section-1 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    ACCEPTANCE OF THIS PRIVACY POLICY
                                </div>
                                <div className="text-black-600 mb-6">
                                    By accessing and using our Services, you signify acceptance to the terms of this
                                    Privacy Policy. Where we require your consent to process your personal information,
                                    we will ask for your consent to the collection, use, and disclosure of your personal
                                    information as described further below. We may provide additional "just-in-time"
                                    disclosures or information about the data processing practices of specific Services.
                                    These notices may supplement or clarify our privacy practices or may provide you
                                    with additional choices about how we process your data.
                                    <br />
                                    If you do not agree with or you are not comfortable with any aspect of this
                                    Privacy Policy, you should immediately discontinue access or use of our
                                    Services.
                                </div>
                            </div>
                            <div className="section-2 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CHANGES TO THIS PRIVACY POLICY
                                </div>
                                <div className="text-black-600 mb-6">
                                    We may modify this Privacy Policy from time to time which will be indicated by
                                    changing the date at the top of this page. If we make any material changes, we will
                                    notify you by email (sent to the email address specified in your account), by means
                                    of a notice on our Services prior to the change becoming effective, or as otherwise
                                    required by law.
                                </div>
                            </div>
                            <div className="section-3 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    OUR SERVICE COVERAGE
                                </div>
                                <div className="text-black-600 mb-6">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="text-nowrap">
                                                    Where You Reside
                                                </th>
                                                <th className="text-nowrap">
                                                    Services Provided
                                                </th>
                                                <th className="text-nowrap">
                                                    Your Operating Entity
                                                </th>
                                                <th className="text-nowrap">
                                                    Contact Address
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Anywhere but the United States and Singapore</td>
                                                <td>
                                                    <div>Digital Currency services</div>
                                                    <div>Credit and Lending services</div>
                                                    <div>Margin Trading services</div>
                                                </td>
                                                <td>Nami Exchange Pte. Ltd.</td>
                                                <td>63 Ngo Si Lien street, Dong Da District, Hanoi, Vietnam</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    Nami Exchange determines the means and purposes of processing your personal
                                    information in relation to the Services provided to you (typically referred to as a
                                    “data controller”).
                                    <br />
                                    You may be asked to provide personal information anytime you are in contact with
                                    Nami Exchange. They may also combine it with other information to provide and
                                    improve our products, services, and content (additional details below).
                                    <br />
                                    If you have any questions about your Nami Exchange Account, your personal
                                    information, or this Privacy Policy, please submit your request via our
                                    Support Centre.
                                </div>
                            </div>
                            <div className="section-4 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    THE PERSONAL INFORMATION WE COLLECT
                                </div>
                                <div className="text-black-600 mb-6">
                                    Personal information is typically data that identifies an individual or relates to
                                    an identifiable individual. This includes information you provide to us, information
                                    which is collected about you automatically, and information we obtain from third
                                    parties. The definition of personal information depends on the applicable law based
                                    on your physical location. Only the definition that applies to your physical
                                    location will apply to you under this Privacy Policy.
                                </div>
                                <div className="font-medium mb-3">
                                    Information you provide to us
                                </div>
                                <div className="text-black-600 mb-6">
                                    To establish an account and access our Services, we'll ask you to provide us with
                                    some important information about yourself. This information is either required by
                                    law (e.g. to verify your identity), necessary to provide the requested services
                                    (e.g. you will need to provide your bank account number if you'd like to link that
                                    account to Nami Exchange), or is relevant for certain specified purposes,
                                    described in greater detail below. As we add new features and Services, you may be
                                    asked to provide additional information.
                                    <br />
                                    Please note that we may not be able to serve you as effectively or offer you our
                                    Services if you choose not to share certain information with us. Any information
                                    you provide to us that is not required is voluntary.
                                </div>
                                <div className="font-medium mb-3">
                                    We may collect the following types of information from you:
                                </div>
                                <div className="text-black-600 mb-6">
                                    <ul className="mt-3">
                                        <li>
                                            Personal Identification Information: Full name, date of birth, nationality,
                                            gender, signature, utility bills, photographs, phone number, home address,
                                            and/or email.
                                        </li>
                                        <li>
                                            Formal Identification Information: Government issued identity document such
                                            as Passport, Driver's License, National Identity Card, Tax ID number,
                                            passport number, driver's license details, national identity card details,
                                            visa information, and/or any other information deemed necessary to comply
                                            with our legal obligations under financial or anti-money laundering laws.
                                        </li>
                                        <li>
                                            Institutional Information: Employer Identification number (or comparable
                                            number issued by a government), proof of legal formation (e.g. Articles of
                                            Incorporation), personal identification information for all material
                                            beneficial owners.
                                        </li>
                                        <li>
                                            Financial Information: Bank account information, payment card primary
                                            account number (PAN), transaction history, trading data, and/or tax
                                            identification.
                                        </li>
                                        <li>
                                            Transaction Information: Information about the transactions you make on our
                                            Services, such as the name of the recipient, your name, the amount, and/or
                                            timestamp.
                                        </li>
                                        <li>
                                            Employment Information: Office location, job title, and/or description of
                                            role.
                                        </li>
                                        <li>
                                            Correspondence: Survey responses, information provided to our support team
                                            or user research team.
                                        </li>
                                    </ul>
                                </div>
                                <div className="font-medium mb-5">
                                    Information we collect from you automatically
                                </div>
                                <div className="text-black-600 mb-6">
                                    To the extent permitted under the applicable law, we may collect certain types of
                                    information automatically, such as whenever you interact with the Sites or use the
                                    Services. This information helps us address customer support issues, improve the
                                    performance of our Sites and applications, provide you with a streamlined and
                                    personalized experience, and protect your account from fraud by detecting
                                    unauthorized access. Information collected automatically includes:
                                    <ul className="mt-3">
                                        <li>
                                            Online Identifiers: Geo location/tracking details, browser fingerprint,
                                            operating system, browser name and version, and/or personal IP addresses.
                                        </li>
                                        <li>
                                            Usage Data: Authentication data, security questions, click-stream data,
                                            public social networking posts, and other data collected via cookies and
                                            similar technologies.
                                        </li>
                                    </ul>
                                    For example, we may automatically receive and record the following information on
                                    our server logs
                                    <ul className="mt-3">
                                        <li>
                                            How you came to and use the Services;
                                        </li>
                                        <li>
                                            Device type and unique device identification numbers;
                                        </li>
                                        <li>
                                            Device event information (such as crashes, system activity and hardware
                                            settings, browser type, browser language, the date and time of your request
                                            and referral URL);
                                        </li>
                                        <li>
                                            How your device interacts with our Sites and Services, including pages
                                            accessed and links clicked;
                                        </li>
                                        <li>
                                            Broad geographic location (e.g. country or city-level location); and
                                        </li>
                                        <li>
                                            Other technical data collected through cookies, pixel tags and other similar
                                            technologies that uniquely identify your browser.
                                        </li>
                                    </ul>
                                    We may also use identifiers to recognize you when you access our Sites via an
                                    external link, such as a link appearing on a third party site.
                                </div>
                            </div>
                            <div className="section-7 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    INFORMATION COLLECTED FROM THIRD PARTIES
                                </div>
                                <div className="text-black-600 mb-6">
                                    From time to time, we may obtain information about you from third party sources as
                                    required or permitted by applicable law. These sources may include
                                    <ul className="mt-3">
                                        <li>
                                            Public Databases, Credit Bureaus & ID Verification Partners: We obtain
                                            information about you from public databases and ID verification partners for
                                            purposes of verifying your identity in accordance with applicable law. ID
                                            verification partners like World-Check use a combination of government
                                            records and publicly available information about you to verify your
                                            identity. Such information may include your name, address, job role, public
                                            employment profile, credit history, status on any sanctions lists maintained
                                            by public authorities, and other relevant data. We obtain such information
                                            to comply with our legal obligations, such as anti-money laundering laws. In
                                            some cases, we may process additional data about you to assess risk and
                                            ensure our Services are not used fraudulently or for other illicit
                                            activities.
                                        </li>
                                        <li>
                                            Blockchain Data: We may analyze public blockchain data to ensure parties
                                            utilizing our Services are not engaged in illegal or prohibited activity
                                            under our Terms, and to analyze transaction trends for research and
                                            development purposes.
                                        </li>
                                        <li>
                                            Joint Marketing Partners & Resellers: For example, unless prohibited by
                                            applicable law, joint marketing partners or resellers may share information
                                            about you with us so that we can better understand which of our Services may
                                            be of interest to you.
                                        </li>
                                        <li>
                                            Advertising Networks & Analytics Providers: We work with these providers to
                                            provide us with de-identified information about how you found our Sites and
                                            how you interact with the Sites and Services. This information may be
                                            collected prior to account creation.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="section-8 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    ANONYMIZED AND AGGREGATED DATA
                                </div>
                                <div className="text-black-600 mb-6">
                                    Anonymization is a data processing technique that modifies personal information so
                                    that it cannot be associated with a specific individual. Except for this section,
                                    none of the other provisions of this Privacy Policy applies to anonymized or
                                    aggregated customer data (i.e. information about our customers that we combine
                                    together so that it no longer identifies or references an individual customer).
                                    <br />
                                    Nami Exchange may use anonymized or aggregate customer data for any business
                                    purpose, including to better understand customer needs and behaviors, improve
                                    our products and services, conduct business intelligence and marketing, and
                                    detect security threats. We may perform our own analytics on anonymized data or
                                    enable analytics provided by third parties.
                                    <br />
                                    Types of data we may anonymize include, transaction data, click-stream data,
                                    performance metrics, and fraud indicators.
                                </div>
                            </div>
                            <div className="section-9 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    HOW YOUR PERSONAL INFORMATION IS USED
                                </div>
                                <div className="text-black-600 mb-6">
                                    Our primary purpose in collecting personal information is to provide you with a
                                    secure, smooth, efficient, and customized experience. We generally use personal
                                    information to create, develop, operate, deliver, and improve our Services, content
                                    and advertising; and for loss prevention and anti-fraud purposes.
                                    <br />
                                    We may use this information in the following ways:
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        1. To maintain legal and regulatory compliance
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Most of our core Services are subject to laws and regulations requiring us
                                        to collect, use, and store your personal information in certain ways. For
                                        example, Nami Exchange must identify and verify customers using our
                                        Services in order to comply with anti-money laundering laws across
                                        jurisdictions. This includes collection and storage of your photo
                                        identification. In addition, we use third parties to verify your identity by
                                        comparing the personal information you provide against third-party databases
                                        and public records. When you seek to link a bank account to your ATTLAS
                                        EXCHANGE Account, we may require you to provide additional information which
                                        we may use in collaboration with service providers acting on our behalf to
                                        verify your identity or address, and/or to manage risk as required under
                                        applicable law. If you do not provide personal information required by law,
                                        we will have to close your account.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        2. To enforce our terms in our user agreement and other agreements
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Nami Exchange handles sensitive information, such as your identification
                                        and financial data, so it is very important for us and our customers that we
                                        actively monitor, investigate, prevent, and mitigate any potentially
                                        prohibited or illegal activities, enforce our agreements with third parties,
                                        and/or prevent and detect violations of our posted user agreement or
                                        agreements for other Services. In addition, we may need to collect fees
                                        based on your use of our Services. We collect information about your account
                                        usage and closely monitor your interactions with our Services. We may use
                                        any of your personal information collected for these purposes. The
                                        consequences of not processing your personal information for such purposes
                                        is the termination of your account.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        3. To detect and prevent fraud and/or funds loss
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information in order to help detect, prevent, and
                                        mitigate fraud and abuse of our services and to protect you against account
                                        compromise or funds loss.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        4. To provide Nami Exchange's Services
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information to provide the Services to you. For
                                        example, when you want to store funds on our platform, we require certain
                                        information such as your identification, contact information, and payment
                                        information. We cannot provide you with Services without such information.
                                        Third parties such as identity verification services may also access and/or
                                        collect your personal information when providing identity verification
                                        and/or fraud prevention services.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        5. To provide Service communications
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We send administrative or account-related information to you to keep you
                                        updated about our Services, inform you of relevant security issues or
                                        updates, or provide other transaction-related information. Without such
                                        communications, you may not be aware of important developments relating to
                                        your account that may affect how you can use our Services. You may not
                                        opt-out of receiving critical service communications, such as emails or
                                        mobile notifications sent for legal or security purposes.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        6. To provide customer service
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information when you contact us to resolve any
                                        questions, disputes, collect fees, or to troubleshoot problems. Without
                                        processing your personal information for such purposes, we cannot respond to
                                        your requests and ensure your uninterrupted use of the Services.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        7. To ensure quality control
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information for quality control and staff training
                                        to make sure we continue to provide you with accurate information. If we do
                                        not process personal information for quality control purposes, you may
                                        experience issues on the Services such as inaccurate transaction records or
                                        other interruptions.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        8. To ensure network and information security
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information in order to enhance security, monitor
                                        and verify identity or service access, combat spam or other malware or
                                        security risks and to comply with applicable security laws and regulations.
                                        The threat landscape on the internet is constantly evolving, which makes it
                                        more important than ever that we have accurate and up-to-date information
                                        about your use of our Services. Without processing your personal
                                        information, we may not be able to ensure the security of our Services.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        9. For research and development purposes
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information to better understand the way you use
                                        and interact with Nami Exchange’s Services. In addition, we use such
                                        information to customize, measure, and improve Nami Exchange’s Services
                                        and the content and layout of our website and applications, and to develop
                                        new services. Without such processing, we cannot ensure your continued
                                        enjoyment of our Services.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        10. To enhance your experience
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We process your personal information to provide a personalized experience,
                                        and implement the preferences you request. For example, you may choose to
                                        provide us with access to certain personal information stored by third
                                        parties. Without such processing, we may not be able to ensure your
                                        continued enjoyment of part or all of our Services.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        11. To facilitate corporate acquisitions, mergers, or transactions
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        We may process any information regarding your account and use of our
                                        Services as is necessary in the context of corporate acquisitions, mergers,
                                        or other corporate transactions. You have the option of closing your account
                                        if you do not wish to have your personal information processed for such
                                        purposes.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        12. To engage in marketing activities
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        Based on your communication preferences, we may send you marketing
                                        communications (e.g. emails or mobile notifications) to inform you about our
                                        events or our partner events; to deliver targeted marketing; and to provide
                                        you with promotional offers. Our marketing will be conducted in accordance
                                        with your advertising marketing preferences and as permitted by applicable
                                        law.
                                    </div>
                                    <div className="text-black-700 font-medium mb-3 mt-5">
                                        13. For any purpose
                                    </div>
                                    <div className="text-black-600 mb-6">
                                        <table className="table">
                                            <tr>
                                                <td>
                                                    Personal Information Category (see “The Personal Information We
                                                    Collect” heading above for more information)
                                                </td>
                                                <td>
                                                    Sources of Personal Information
                                                </td>
                                                <td>
                                                    Purpose of Collecting Personal Information
                                                </td>
                                                <td>
                                                    Disclosure of Personal Information (see “Why We Share Personal
                                                    Information With Other Parties” heading below for more
                                                    information)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (A) Identifiers such as Personal Identification Information
                                                </td>
                                                <td>
                                                    Information you provide us;
                                                    Information collected from third parties
                                                </td>
                                                <td>
                                                    Sections 1, 2, 3, 4, 5, 6, 8, 9, 11, 12
                                                </td>
                                                <td>
                                                    Third party identity verification services; Financial
                                                    institutions; Service providers; Professional advisors
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (B) Customer records such as signature
                                                </td>
                                                <td>
                                                    Information you provide us;
                                                    Information collected from third parties
                                                </td>
                                                <td>
                                                    Sections 1, 2, 5, 6, 11
                                                </td>
                                                <td>
                                                    Third party identity verification services; Financial
                                                    institutions; Service providers
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (C) Protected classifications under California and federal law,
                                                    including gender, age and citizenship
                                                </td>
                                                <td>
                                                    Information you provide us;
                                                    Information collected from third parties
                                                </td>
                                                <td>
                                                    Section 1
                                                </td>
                                                <td>
                                                    Third party identity verification services; Professional
                                                    advisors
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (D) Commercial information such as records of services
                                                    purchased, obtained, or considered
                                                </td>
                                                <td>
                                                    Information you provide us;
                                                    Information we collect from you automatically;
                                                    Information collected from third parties
                                                </td>
                                                <td>
                                                    Section 3, 4, 5, 6, 8, 9, 10, 11, 12
                                                </td>
                                                <td>
                                                    - Third party identity verification services; Financial
                                                    institutions; Service providers; Professional advisors
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (E) Biometric information
                                                </td>
                                                <td>
                                                    Information you provide us
                                                </td>
                                                <td>
                                                    Section 1
                                                </td>
                                                <td>
                                                    Third party identity verification services; Financial
                                                    institutions
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (F) Usage Data
                                                </td>
                                                <td>
                                                    Information we collect from you automatically
                                                </td>
                                                <td>
                                                    Sections 2, 3, 4, 6, 7, 8, 9, 10, 12
                                                </td>
                                                <td>
                                                    Third party identity verification services; Service providers;
                                                    Professional advisors
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (G) Online Identifiers
                                                </td>
                                                <td>
                                                    Information we collect from you automatically
                                                </td>
                                                <td>
                                                    Sections 1, 3, 9, 12
                                                </td>
                                                <td>
                                                    Third party identity verification services; Service Providers
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (H) Sensory data, such as audio, electronic, visual information
                                                </td>
                                                <td>
                                                    Not collected
                                                </td>
                                                <td>
                                                    Not applicable
                                                </td>
                                                <td>
                                                    Not applicable
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (I) Professional or employment-related information
                                                </td>
                                                <td>
                                                    Information you provide us; Information collected from third
                                                    parties
                                                </td>
                                                <td>
                                                    Sections 1, 12
                                                </td>
                                                <td>
                                                    Third party identity verification services; Service providers
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    (J) Inferences about preferences, characteristics,
                                                    predispositions, etc.
                                                </td>
                                                <td>
                                                    Information you provide us; Information we collect from you
                                                    automatically
                                                </td>
                                                <td>
                                                    Sections 9, 10, 12
                                                </td>
                                                <td>
                                                    Service providers; Professional advisors
                                                </td>
                                            </tr>
                                        </table>
                                        We will not use your personal information for purposes other than those
                                        purposes we have disclosed to you, without your permission. From time to
                                        time, and as required under the applicable law, we may request your
                                        permission to allow us to share your personal information with third
                                        parties. You may opt out of having your personal information shared with
                                        third parties, or allowing us to use your personal information for any
                                        purpose that is incompatible with the purposes for which we originally
                                        collected it or subsequently obtained your authorization. If you choose to
                                        so limit the use of your personal information, certain features or ATTLAS
                                        EXCHANGE’s Services may not be available to you.
                                    </div>
                                </div>
                            </div>
                            <div className="section-10 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    MARKETING
                                </div>
                                <div className="text-black-600 mb-6">
                                    Direct Marketing: Direct marketing includes any communications to you that are only
                                    based on advertising or promoting our products and services. We will only contact
                                    you by electronic means (email or SMS) based on our legitimate interests, as
                                    permitted by applicable law, or your consent. To the extent we can rely on
                                    legitimate interest under the applicable law, we will only send you information
                                    about our Services that are similar to those which were the subject of a previous
                                    sale or negotiations of a sale to you. If you are a new customer, we will contact
                                    you by electronic means for marketing purposes only if you have consented to such
                                    communication. If you do not want us to send you marketing communications, please go
                                    to your account settings to opt-out or submit a request via our website. You may
                                    raise such objection with regard to initial or further processing for purposes of
                                    direct marketing, at any time and free of charge. Direct marketing includes any
                                    communications to you that are only based on advertising or promoting our products
                                    and services.

                                    <br />
                                    Third Party Marketing: We will obtain your express consent before we share your
                                    personal information with any third parties for marketing purposes.
                                </div>
                            </div>
                            <div className="section-11 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    WHY WE SHARE PERSONAL INFORMATION WITH OTHER PARTIES
                                </div>
                                <div className="text-black-600 mb-6">
                                    We take care to allow your personal information to be accessed only by those who
                                    require access to perform their tasks and duties, and to share only with third
                                    parties who have a legitimate purpose for accessing it. Nami Exchange will never
                                    sell or rent your personal information to third parties without your explicit
                                    consent. We will only share your information in the following circumstances:
                                    <ul className="mt-3">
                                        <li>
                                            With third party identity verification services in order to prevent fraud.
                                            This allows Nami Exchange to confirm your identity by comparing the
                                            information you provide us to public records and other third party
                                            databases. These service providers may create derivative data based on your
                                            personal information that can be used in connection with the provision of
                                            identity verification and fraud prevention services. With financial
                                            institutions with which we partner to process payments you have authorized.
                                        </li>
                                        <li>
                                            With service providers under contract who help with parts of our business
                                            operations. Our contracts require these service providers to only use your
                                            information in connection with the services they perform for us, and
                                            prohibit them from selling your information to anyone else. Examples of the
                                            types of service providers we may share personal information with (other
                                            than those mentioned above) include:
                                            <ul>
                                                <li>Network infrastructure</li>
                                                <li>Cloud storage</li>
                                                <li>Payment processing</li>
                                                <li>Transaction monitoring</li>
                                                <li>Security</li>
                                                <li>Document repository services</li>
                                                <li>Customer support</li>
                                                <li>Internet (e.g. ISPs)</li>
                                                <li>Data analytics</li>
                                                <li>Information Technology</li>
                                                <li>Công nghệ thông tin</li>
                                                <li>Marketing</li>
                                            </ul>
                                        </li>
                                        <li>
                                            Với các công ty hoặc tổ chức khác mà chúng tôi dự định hợp nhất hoặc được
                                            mua lại. Bạn sẽ nhận được thông báo trước về bất cứ thay đổi nào trong các
                                            chính sách hiện hành.
                                        </li>
                                        <li>
                                            Với các công ty hoặc pháp nhân khác mua tài sản Nami Exchange theo một
                                            giao dịch bán được tòa án chấp thuận hoặc nơi chúng tôi được yêu cầu chia sẻ
                                            thông tin của bạn theo luật mất khả năng thanh khoản ở bất kỳ khu vực pháp
                                            lý hiện hành nào.
                                        </li>
                                        <li>
                                            Với các cố vấn chuyên nghiệp của chúng tôi, những người cung cấp các dịch vụ
                                            ngân hàng, pháp lý, tuân thủ, bảo hiểm, kế toán hoặc các dịch vụ tư vấn khác
                                            để hoàn thành kiểm toán tài chính, kỹ thuật, tuân thủ và pháp lý của bên thứ
                                            ba đối với hoạt động của chúng tôi hoặc tuân thủ các nghĩa vụ pháp lý của
                                            chúng tôi.
                                        </li>
                                        <li>
                                            Với cơ quan thực thi pháp luật, các quan chức hoặc các bên thứ ba khác khi
                                            chúng tôi buộc phải làm như vậy theo trát đòi hầu tòa, lệnh tòa hoặc thủ tục
                                            pháp lý tương tự hoặc khi chúng tôi tin rằng việc tiết lộ thông tin cá nhân
                                            là cần thiết để ngăn ngừa tổn hại về thể chất hoặc tài mất mát, để báo cáo
                                            hoạt động bất hợp pháp bị nghi ngờ hoặc để điều tra vi phạm Thỏa thuận người
                                            dùng của chúng tôi hoặc bất kỳ chính sách hiện hành nào khác.
                                        </li>
                                    </ul>
                                    If you establish a Nami Exchange Account indirectly on a third party website or
                                    via a third party application, any information that you enter on that website or
                                    application (and not directly on a Nami Exchange website) will be shared with the
                                    owner of the third party website or application and your information will be subject
                                    to their privacy policies.
                                </div>
                            </div>
                            <div className="section-12 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    THIRD-PARTY SITES AND SERVICES
                                </div>
                                <div className="text-black-600 mb-6">
                                    If you authorize one or more third-party applications to access your Nami Exchange
                                    Services, then information you have provided to Nami Exchange may be shared with
                                    those third parties. A connection you authorize or enable between your ATTLAS
                                    EXCHANGE account and a non-Nami Exchange account, payment instrument, or platform
                                    is considered an “account connection.” Unless you provide further permissions,
                                    Nami Exchange will not authorize these third parties to use this information for
                                    any purpose other than to facilitate your transactions using Nami Exchange
                                    Services. Please note that third parties you interact with may have their own
                                    privacy policies, and Nami Exchange is not responsible for their operations or
                                    their use of data they collect. Information collected by third parties, which may
                                    include such things as contact details, financial information, or location data, is
                                    governed by their privacy practices and Nami Exchange is not responsible for
                                    unauthorized third-party conduct. We encourage you to learn about the privacy
                                    practices of those third parties.
                                    <br />
                                    Examples of account connections include:
                                    <ul className="mt-3">
                                        <li>
                                            Merchants: If you use your Nami Exchange account to conduct a
                                            transaction with a third party merchant, the merchant may provide data
                                            about you and your transaction to us.
                                        </li>
                                        <li>
                                            Your Financial Services Providers: For example, if you send us funds
                                            from your bank account, your bank will provide us with identifying
                                            information in addition to information about your account in order to
                                            complete the transaction.
                                        </li>
                                    </ul>
                                    Information that we share with a third-party based on an account connection will
                                    be used and disclosed in accordance with the third-party's privacy practices.
                                    Please review the privacy notice of any third-party that will gain access to
                                    your personal information. Nami Exchange is not responsible for such third
                                    party conduct.
                                </div>
                            </div>
                            <div className="section-13 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    HOW WE PROTECT AND STORE PERSONAL INFORMATION
                                </div>
                                <div className="text-black-600 mb-6">
                                    We understand how important your privacy is, which is why Nami Exchange maintains
                                    (and contractually requires third parties it shares your information with to
                                    maintain) appropriate physical, technical and administrative safeguards to protect
                                    the security and confidentiality of the personal information you entrust to us.
                                    <br />
                                    We may store and process all or part of your personal and transactional
                                    information, including certain payment information, such as your encrypted bank
                                    account and/or routing numbers where our facilities or our service providers are
                                    located. We protect your personal information by maintaining physical,
                                    electronic, and procedural safeguards in compliance with the applicable laws and
                                    regulations.
                                    <br />
                                    For example, we use computer safeguards such as firewalls and data
                                    encryption, we enforce physical access controls to our buildings and files,
                                    and we authorize access to personal information only for those employees who
                                    require it to fulfill their job responsibilities. However, we cannot
                                    guarantee that loss, misuse, unauthorized acquisition, or alteration of your
                                    data will not occur. Please recognize that you play a vital role in
                                    protecting your own personal information. When registering with our
                                    Services, it is important to choose a password of sufficient length and
                                    complexity, to not reveal this password to any third-parties, and to
                                    immediately notify us if you become aware of any unauthorized access to or
                                    use of your account.
                                    <br />
                                    Furthermore, we cannot ensure or warrant the security or confidentiality
                                    of information you transmit to us or receive from us by Internet or
                                    wireless connection, including email, phone, or SMS, since we have no
                                    way of protecting that information once it leaves and until it reaches
                                    us. If you have reason to believe that your data is no longer secure,
                                    please contact us using the contact information provided in this Privacy
                                    Policy.
                                </div>
                            </div>
                            <div className="section-14 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    RETENTION OF PERSONAL INFORMATION
                                </div>
                                <div className="text-black-600 mb-6">
                                    CWe store your personal information securely throughout the life of your ATTLAS
                                    EXCHANGE Account. We will only retain your personal information for as long as
                                    necessary to fulfil the purposes for which we collected it, including for the
                                    purposes of satisfying any legal, accounting, or reporting obligations or to resolve
                                    disputes. While retention requirements vary by jurisdiction, information about our
                                    typical retention periods for different aspects of your personal information are
                                    described below.
                                    <ul className="mt-3">
                                        <li>
                                            Personal information collected to comply with our legal obligations under
                                            financial or anti-money laundering laws may be retained after account
                                            closure for as long as required under such laws.
                                        </li>
                                        <li>
                                            Contact Information such as your name, email address and telephone number
                                            for marketing purposes is retained on an ongoing basis until you
                                            unsubscribe. Thereafter we will add your details to our suppression list to
                                            ensure we do not inadvertently market to you.
                                        </li>
                                        <li>
                                            Content that you post on our website such as support desk comments,
                                            photographs, videos, blog posts, and other content may be kept after you
                                            close your account for audit and crime prevention purposes (e.g. to prevent
                                            a known fraudulent actor from opening a new account).
                                        </li>
                                        <li>
                                            Recording of our telephone calls with you may be kept for a period of up to
                                            six years.
                                        </li>
                                        <li>
                                            Information collected via technical means such as cookies, web page counters
                                            and other analytics tools is kept for a period of up to one year from expiry
                                            of the cookie.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="section-15 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    CHILDREN'S PERSONAL INFORMATION
                                </div>
                                <div className="text-black-600 mb-6">
                                    We do not knowingly request to collect personal information from any person under
                                    the age of 18. If a user submitting personal information is suspected of being
                                    younger than 18 years of age, Nami Exchange will require the user to close his or
                                    her account and will not allow the user to continue using our Services. We will also
                                    take steps to delete the information as soon as possible. Please notify us if you
                                    know of any individuals under the age of 18 using our Services so we can take action
                                    to prevent access to our Services.

                                    <br />
                                    If you have a complaint about our privacy practices and our collection, use or
                                    disclosure of personal information please submit your request via our website.
                                    <br />
                                    Nami Exchange Pte. Ltd.. is responsible for the processing of personal
                                    information it receives and subsequently transfers to a third party acting
                                    as an agent on its behalf. Before we share your information with any third
                                    party, Nami Exchange Pte. Ltd.. will enter into a written agreement that
                                    the third party provides at least the same level of protection for the
                                    personal information as required under applicable data protection laws.
                                </div>
                            </div>
                            <div className="section-16 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    YOUR PRIVACY RIGHTS
                                </div>
                                <div className="text-black-600 mb-6">
                                    TDepending on applicable law where you reside, you may be able to assert certain
                                    rights related to your personal information identified below. If any of the rights
                                    listed below are not provided under law for your operating entity or jurisdiction,
                                    Nami Exchange has absolute discretion in providing you with those rights.
                                    <br />
                                    Your rights to personal information are not absolute. Depending upon the
                                    applicable law, access may be denied: (a) when denial of access is required or
                                    authorized by law; (b) when granting access would have a negative impact on
                                    another's privacy; (c) to protect our rights and properties; (d) where the
                                    request is frivolous or vexatious, or for other reasons.
                                    <ul className="mt-3">
                                        <li>
                                            Access and portability. You may request that we provide you a copy of
                                            your personal information held by us. This information will be provided
                                            without undue delay subject to a potential fee associated with gathering
                                            the information (as permitted by law), unless such provision adversely
                                            affects the rights and freedoms of others. In certain circumstances, you
                                            may request to receive your personal information in a structured,
                                            commonly used and machine-readable format, and to have us transfer your
                                            personal information directly to another data controller.
                                        </li>
                                        <li>
                                            Rectification of incomplete or inaccurate personal information. You may
                                            request us to rectify or update any of your personal information held by
                                            Nami Exchange that is inaccurate. You may do this at any time by
                                            logging in to your account and clicking the Profile or My Account tab.
                                        </li>
                                        <li>
                                            Erasure. You may request to erase your personal information, subject to
                                            applicable law. If you close your Nami Exchange Account, we will mark
                                            your account in our database as "Closed," but will keep certain account
                                            information, including your request to erase, in our database for a
                                            period of time as described above. This is necessary to deter fraud, by
                                            ensuring that persons who try to commit fraud will not be able to avoid
                                            detection simply by closing their account and opening a new account, and
                                            to comply with Nami Exchange's legal obligations. However, if you
                                            close your account, your personal information will not be used by us for
                                            any further purposes, nor shared with third parties, except as necessary
                                            to prevent fraud and assist law enforcement, as required by law, or in
                                            accordance with this Privacy Policy.
                                        </li>
                                        <li>
                                            Withdraw consent. To the extent the processing of your personal
                                            information is based on your consent, you may withdraw your consent at
                                            any time. Your withdrawal will not affect the lawfulness of Nami
                                            Exchange's processing based on consent before your withdrawal.
                                        </li>
                                        <li>
                                            Restriction of processing. In some jurisdictions, applicable law may
                                            give you the right to restrict or object to us processing your personal
                                            information under certain circumstances. We may continue to process your
                                            personal information if it is necessary for the defense of legal claims,
                                            or for any other exceptions permitted by applicable law.
                                        </li>
                                        <li>
                                            Automated individual decision-making, including profiling. ATTLAS
                                            EXCHANGE relies on automated tools to help determine whether a
                                            transaction or a customer account presents a fraud or legal risk. In
                                            some jurisdictions, you have the right not to be subject to a decision
                                            based solely on automated processing of your personal information,
                                            including profiling, which produces legal or similarly significant
                                            effects on you, save for the exceptions applicable under relevant data
                                            protection laws.
                                        </li>
                                    </ul>
                                </div>
                                <div className="font-medium mb-3">
                                    How to make a privacy request
                                </div>
                                <div className="text-black-600 mb-6">
                                    You can make privacy rights requests relating to your personal information by going
                                    to your Privacy Rights Dashboard or, if you cannot access the Dashboard, by
                                    contacting us via our website. Our Privacy Rights Dashboard also allows you to set
                                    your communication preferences and make individual rights requests relating to your
                                    personal information. We strongly encourage you to make any individual rights
                                    requests through the Privacy Rights Dashboard because it ensures that you have been
                                    authenticated already (based on the KYC information you have provided to open your
                                    account and by providing the necessary login credentials and multi-factor
                                    authentication to access the account). Otherwise, when we receive an individual
                                    rights request via other intake methods, we may take steps to verify your identity
                                    before complying with the request to protect your privacy and security.
                                </div>
                                <div className="font-medium mb-3">
                                    How to lodge a complaint
                                </div>
                                <div className="text-black-600 mb-6">
                                    If you believe that we have infringed your rights, we encourage you to first submit
                                    a request via our website so that we can try to resolve the issue or dispute
                                    informally. If that does not resolve your issue, you may contact the ATTLAS
                                    EXCHANGED via the given phone number.
                                </div>
                            </div>
                            <div className="section-17 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    HOW TO CONTACT US
                                </div>
                                <div className="text-black-600 mb-6">
                                    If you have questions or concerns regarding this Privacy Policy, or if you have a
                                    complaint, please contact us on our Fanpage or by writing to us at the address of
                                    your head office (provided above).
                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
            <Footer />
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['footer', 'navbar', 'common']),
    },
});
export default Terms;
