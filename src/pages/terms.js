/* eslint-disable  */
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import Footer from 'components/common/Footer';

const Terms = () => {
    const router = useRouter();
    const { locale } = router;

    return (
        <LayoutWithHeader>
            <div className="nami-container my-20 terms-page">
                { locale === 'vi' ? (
                    <>
                        <div className="text-center">
                            <div className="text-4xl font-semibold mb-7 ">
                                Thỏa thuận Người dùng
                            </div>
                            <div className="text-lg text-black-600 font-medium">
                                Nami Exchange
                            </div>
                            <div className="text-lg font-semibold ">
                                Bản cập nhật: 30 tháng 4, 2021
                            </div>
                        </div>
                        <div className="card bg-white rounded-lg p-10 lg:py-15 lg:px-[6.875rem]">
                            <div className="text-black-600 font-size-h7 mb-10">
                                Chào mừng bạn đến với Nami Exchange! Đây là Thỏa thuận Người dùng giữa bạn (còn được
                                gọi là “Khách hàng” hoặc “Người dùng”) và Nami Exchange Pte. Ltd. ("Nami Exchange").
                                Thỏa thuận người dùng này (gọi tắt là "Thỏa thuận") điều chỉnh việc bạn sử dụng các dịch
                                vụ được cung cấp bởi Nami Exchange được mô tả bên dưới (gọi tắt là "Dịch vụ của Nami
                                Exchange" hoặc "Dịch vụ"). Bằng cách đăng ký sử dụng tài khoản thông qua attlas.io, API
                                hoặc ứng dụng di động Nami Exchange (gọi chung là "Trang web của Nami Exchange"),
                                bạn đồng ý rằng bạn đã đọc, hiểu và chấp nhận tất cả các điều khoản và điều kiện có
                                trong Thỏa thuận này bao gồm Chính sách Bảo mật và Chính sách Công khai Nội dung.
                                <br />
                                Tương tự như bất kỳ hình thức tài sản nào khác, giá trị của Tiền điện tử có thể tăng
                                hoặc giảm và có thể có rủi ro đáng kể khiến bạn mất tiền khi mua, bán, nắm giữ hoặc
                                đầu tư vào tiền điện tử. Bạn nên cân nhắc cẩn thận xem việc giao dịch hoặc nắm giữ
                                Tiền điện tử có phù hợp với mình hay không tùy theo điều kiện tài chính cá nhân
                            </div>
                            <div className="text-lg font-semibold mb-5">
                                Phần I: Điều khoản chung
                            </div>
                            <div className="section-1 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    1. Cài đặt tài khoản
                                </div>
                                <div className="font-semibold mb-5">
                                    1.1 Điều kiện đăng ký
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Để đủ điều kiện sử dụng Dịch vụ Nami Exchange, bạn phải từ 18 tuổi trở lên.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.2 Các điểu khoản
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Chúng tôi có thể thay đổi hoặc sửa đổi Thỏa thuận này bất kỳ lúc nào bằng cách đăng
                                    thỏa thuận đã sửa đổi trên Trang web của Nami Exchange và/hoặc cung cấp cho bạn
                                    một bản sao (“Thỏa thuận đã sửa đổi”). Thỏa thuận sửa đổi sẽ có hiệu lực ngay sau
                                    khi được đăng nhưng sẽ không có hiệu lực với thời gian trước đó. Việc bạn tiếp tục
                                    sử dụng Dịch vụ sau khi Thỏa thuận sửa đổi được đăng tải đồng nghĩa với việc bạn
                                    chấp nhận Thỏa thuận sửa đổi đó. Nếu bạn không đồng ý với những Thỏa thuận sửa đổi
                                    này, biện pháp khắc phục duy nhất của bạn là chấm dứt việc sử dụng Dịch vụ và đóng
                                    tài khoản của bạn.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.3 Đăng ký tài khoản Nami Exchange
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Bạn phải đăng ký Tài khoản Nami Exchange để sử dụng Dịch vụ Nami Exchange ("Tài
                                    khoản Nami Exchange"). Bằng cách sử dụng Tài khoản Nami Exchange, bạn đồng ý
                                    rằng bạn sẽ chỉ sử dụng Nami Exchange cho chính mình và không thay mặt cho bất kỳ
                                    bên thứ ba nào, trừ khi việc này đã được Nami Exchange cho phép trước đó. Bạn hoàn
                                    toàn chịu trách nhiệm về mọi hoạt động xảy ra trong Tài khoản Nami Exchange của
                                    mình. Chúng tôi có toàn quyền quyết định trong việc từ chối mở Tài khoản Nami
                                    Exchange hoặc giới hạn số lượng Tài khoản Nami Exchange mà bạn có thể nắm giữ hoặc
                                    tạm ngừng hoặc chấm dứt hoạt động của bất kỳ Tài khoản Nami Exchange nào, hoặc
                                    việc giao dịch một Đồng tiền điện tử cụ thể trong tài khoản của bạn.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.4 Xác minh danh tính
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Trong quá trình đăng ký Tài khoản Nami Exchange, bạn đồng ý cung cấp cho chúng tôi
                                    thông tin mà chúng tôi yêu cầu cho mục đích xác minh danh tính và rà soát các hành
                                    vi rửa tiền, tài trợ khủng bố, gian lận hoặc bất kỳ tội phạm tài chính nào khác và
                                    cho phép chúng tôi lưu trữ hồ sơ về những hành vi đó thông tin. Bạn sẽ cần phải hoàn
                                    thành các thủ tục xác minh nhất định trước khi được phép sử dụng Dịch vụ Nami
                                    Exchange. Quyền truy cập của bạn vào một hoặc nhiều Dịch vụ Nami Exchange và các
                                    giới hạn áp dụng cho việc sử dụng Dịch vụ Nami Exchange của bạn, có thể được thay
                                    đổi dựa trên các thông tin được cập nhập về bạn. Thông tin chúng tôi yêu cầu có thể
                                    bao gồm một số thông tin cá nhân nhất định, bao gồm, nhưng không giới hạn, tên, địa
                                    chỉ, số điện thoại, địa chỉ email, ngày sinh, số nhận dạng người nộp thuế, giấy tờ
                                    tùy thân của chính phủ và thông tin liên quan đến tài khoản ngân hàng của bạn (chẳng
                                    hạn như tên ngân hàng, loại tài khoản, số định tuyến và số tài khoản) và trong một
                                    số trường hợp (nếu được pháp luật cho phép), các danh mục dữ liệu cá nhân đặc biệt,
                                    chẳng hạn như thông tin sinh trắc học của bạn. Khi cung cấp cho chúng tôi thông tin
                                    này hoặc bất kỳ thông tin nào khác có thể được yêu cầu, bạn xác nhận rằng thông tin
                                    đó là chính xác và xác thực. Bạn đồng ý cập nhật cho chúng tôi bất kỳ thay đổi nào
                                    trong thông tin của bạn. Bạn cho phép chúng tôi thực hiện các yêu cầu, cho dù trực
                                    tiếp hoặc thông qua bên thứ ba, mà chúng tôi cho là cần thiết để xác minh danh tính
                                    của bạn hoặc bảo vệ bạn và/hoặc chúng tôi khỏi gian lận hoặc tội phạm tài chính
                                    khác, và đưa ra những hành động mà chúng tôi cho là cần thiết một cách hợp lý để
                                    thực hiện được điều đó. Khi chúng tôi thực hiện các yêu cầu này, bạn thừa nhận và
                                    đồng ý rằng thông tin cá nhân của bạn có thể được tiết lộ cho các cơ quan tham khảo
                                    tín dụng và phòng chống gian lận hoặc tội phạm tài chính và rằng các cơ quan này có
                                    thể trả lời đầy đủ các yêu cầu của chúng tôi. Đây chỉ là một kiểm tra danh tính và
                                    sẽ không có ảnh hưởng xấu đến xếp hạng tín dụng của bạn. Hơn nữa, bạn cho phép nhà
                                    khai thác mạng không dây của mình sử dụng số điện thoại di động, tên, địa chỉ,
                                    email, trạng thái mạng, loại khách hàng, vai trò khách hàng, loại thanh toán, số
                                    nhận dạng thiết bị di động (IMSI và IMEI) và các chi tiết trạng thái thuê bao khác,
                                    nếu có, chỉ để cho phép xác minh danh tính của bạn và so sánh thông tin bạn đã cung
                                    cấp cho Nami Exchange với thông tin hồ sơ tài khoản nhà điều hành không dây của
                                    bạn trong suốt thời gian sử dụng. Xem Chính sách quyền riêng tư của chúng tôi để
                                    biết cách chúng tôi xử lý dữ liệu của bạn.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.5 Truy cập
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Để truy cập Dịch vụ Nami Exchange, bạn phải có thiết bị cần thiết (chẳng hạn như
                                    điện thoại thông minh hoặc máy tính xách tay) và truy cập Internet. Các dịch vụ của
                                    Nami Exchange có thể được truy cập trực tiếp bằng cách sử dụng Nami Exchange
                                    Site. Quyền truy cập vào Dịch vụ Nami Exchange có thể bị giảm chất lượng hoặc
                                    không khả dụng trong thời gian khối lượng hoặc biến động đáng kể. Điều này có thể
                                    dẫn đến việc không thể mua hoặc bán trong một khoảng thời gian và cũng có thể dẫn
                                    đến độ trễ thời gian phản hồi hỗ trợ. Mặc dù chúng tôi cố gắng cung cấp cho bạn dịch
                                    vụ xuất sắc, chúng tôi không tuyên bố rằng Trang web trao đổi bản đồ hoặc các Dịch
                                    vụ trao đổi bản đồ khác sẽ khả dụng mà không bị gián đoạn và chúng tôi không đảm bảo
                                    rằng bất kỳ đơn đặt hàng nào sẽ được thực hiện, chấp nhận, ghi lại hoặc vẫn mở.
                                    Nami Exchange sẽ không chịu trách nhiệm đối với bất kỳ tổn thất nào do hoặc phát
                                    sinh từ sự chậm trễ của giao dịch.
                                </div>
                            </div>
                            <div className="section-2 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    2. Dịch vụ ví và lưu ký
                                </div>
                                <div className="font-semibold mb-5">
                                    2.1 Dịch vụ ví
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Để đủ điều kiện sử Là một phần của Tài khoản Nami Exchange của bạn, Nami
                                    Exchange sẽ cung cấp cho người dùng đủ điều kiện quyền truy cập vào (các) ví Tiền
                                    điện tử được lưu trữ để giữ Tiền điện tử (“Ví tiền điện tử”). Dịch vụ Nami
                                    Exchange, bạn phải từ 18 tuổi trở lên.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.2 Ví điện tử được lưu trữ
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Ví tiền điện tử của bạn cho phép bạn lưu trữ, theo dõi, chuyển và quản lý số dư tiền
                                    điện tử của mình. Theo khái niệm được sử dụng xuyên suốt trong thỏa thuận này, "tiền
                                    điện tử" chỉ có nghĩa là những loại tiền kỹ thuật số cụ thể được liệt kê là có sẵn
                                    để giao dịch hoặc lưu ký trong Tài khoản Nami Exchange của bạn (còn được gọi là
                                    "tiền điện tử được hỗ trợ"). Các dịch vụ và nội dung được hỗ trợ có thể khác nhau
                                    tùy theo khu vực tài phán. Chúng tôi lưu trữ an toàn các khóa riêng tư (private key)
                                    của tiền điện tử, được sử dụng để xử lý các giao dịch, kết hợp giữa lưu trữ trực
                                    tuyến và ngoại tuyến. Do các giao thức bảo mật của chúng tôi, chúng tôi có thể cần
                                    truy xuất khóa riêng tư hoặc thông tin liên quan từ bộ nhớ ngoại tuyến để tạo điều
                                    kiện thuận lợi cho việc Chuyển tiền kỹ thuật số theo hướng dẫn của bạn và bạn hiểu
                                    rằng điều này có thể trì hoãn thao tác hoặc trì hoãn việc xác nhận Giao dịch tiền
                                    điện tử đó. Các quy tắc bổ sung liên quan đến (các) sản phẩm và (các) dịch vụ đó có
                                    thể được áp dụng.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.3 Các loại tiền điện tử được hỗ trợ
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Tài khoản Nami Exchange của bạn chỉ nhằm mục đích sử dụng hợp lý các Đơn vị tiền
                                    điện tử được hỗ trợ (danh sách các đồng tiền được hỗ trợ được chỉ định trên Trang
                                    web của Nami Exchange). Trong mọi trường hợp, bạn không nên cố gắng sử dụng Ví
                                    tiền điện tử của mình để lưu trữ, gửi, yêu cầu hoặc nhận các loại tiền kỹ thuật số
                                    mà chúng tôi không hỗ trợ. Nami Exchange sẽ không chịu trách nhiệm liên quan đến
                                    bất kỳ nỗ lực nào của bạn để sử dụng Ví tiền điện tử của bạn với các loại tiền kỹ
                                    thuật số mà chúng tôi không hỗ trợ. Nếu bạn có bất kỳ câu hỏi nào về loại tiền điện
                                    tử nào mà chúng tôi hiện đang hỗ trợ, vui lòng truy cập
                                    <a href="https://nami.exchange" target="_blank" rel="noreferrer">https://nami.exchange</a>.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.4 Các giao thức bổ sung bị loại trừ
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Trừ khi được thông báo cụ thể trên Trang web của Nami Exchange hoặc qua các tuyên
                                    bố công khai chính thức khác của Nami Exchange, Đơn vị tiền điện tử được hỗ trợ
                                    loại trừ tất cả các giao thức và/hoặc chức năng khác bổ sung hoặc tương tác với Đơn
                                    vị tiền điện tử được hỗ trợ. Loại trừ này bao gồm nhưng không giới hạn đối với:
                                    metacoin, coloured coin, chuỗi bên hoặc các giao thức phái sinh, nâng cao hoặc phân
                                    nhánh khác, mã thông báo hoặc tiền xu hoặc chức năng khác, chẳng hạn như đặt cược,
                                    quản trị giao thức và/hoặc bất kỳ chức năng hợp đồng thông minh nào, có thể bổ sung
                                    hoặc tương tác với tiền điện tử mà chúng tôi hỗ trợ. Không sử dụng Tài khoản Nami
                                    Exchange của bạn trong bất kỳ nỗ lực nào để nhận, yêu cầu, gửi, lưu trữ hoặc tham
                                    gia vào bất kỳ loại giao dịch hoặc chức năng nào khác liên quan đến bất kỳ giao thức
                                    nào như vậy, vì Nami Exchange không được định cấu hình để phát hiện, bảo mật hoặc
                                    xử lý các giao dịch và chức năng này. Bất kỳ giao dịch cố gắng nào trong các mặt
                                    hàng như vậy sẽ dẫn đến việc mất mặt hàng. Bạn thừa nhận và đồng ý rằng các giao
                                    thức bổ sung được loại trừ khỏi tiền điện tử được hỗ trợ và Nami Exchange không có
                                    trách nhiệm pháp lý đối với bất kỳ tổn thất nào liên quan đến các giao thức bổ sung.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.5 Hoạt động của các giao thức tiền điện tử
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Các giao thức phần mềm cơ bản chi phối hoạt động của tiền điện tử được hỗ trợ trên
                                    nền tảng của chúng tôi không do chúng tôi sở hữu hoặc kiểm soát. Nói chung, các giao
                                    thức cơ bản là mã nguồn mở và bất kỳ ai cũng có thể sử dụng, sao chép, sửa đổi và
                                    phân phối chúng. Chúng tôi không chịu trách nhiệm về hoạt động của các giao thức cơ
                                    bản và chúng tôi không thể đảm bảo chức năng hoặc bảo mật của các giao thức diễn ra
                                    trong mạng. Cụ thể, các giao thức cơ bản có thể bị thay đổi do sự thay đổi đột ngột
                                    về các quy tắc hoạt động (bao gồm cả “fork” - các cập nhập phần mềm hoặc thao tác
                                    nâng cấp, sửa lỗi). Bất kỳ thay đổi điều hành quan trọng nào như vậy có thể ảnh
                                    hưởng nghiêm trọng đến tính khả dụng, giá trị, chức năng và/hoặc tên của Đơn vị tiền
                                    điện tử mà bạn lưu trữ trong Ví tiền điện tử của mình. Nami Exchange không kiểm
                                    soát thời gian và tính năng của những thay đổi của các quy tắc vận hành này. Bạn
                                    chịu trách nhiệm về việc tự cập nhập những thay đổi sắp tới về hệ thống. Bạn cũng
                                    phải xem xét cẩn thận thông tin có sẵn công khai cùng với thông tin có thể được cung
                                    cấp bởi Nami Exchange để xác định xem có nên tiếp tục sử dụng Tài khoản Nami
                                    Exchange cho Đồng tiền kỹ thuật số bị ảnh hưởng hay không. Trong trường hợp có bất
                                    kỳ sự thay đổi hoạt động nào như vậy, Nami Exchange có quyền thực hiện các bước có
                                    thể cần thiết để bảo vệ an ninh và an toàn của tài sản được lưu giữ trên nền tảng
                                    Nami Exchange, bao gồm tạm thời đình chỉ hoạt động đối với (các) loại tiền kỹ
                                    thuật số có liên quan, và / hoặc các bước cần thiết khác; Nami Exchange sẽ nỗ lực
                                    hết sức để cung cấp cho bạn thông báo về phản ứng của nó đối với bất kỳ thay đổi
                                    quan trọng nào về hoạt động; tuy nhiên, những thay đổi đó nằm ngoài tầm kiểm soát
                                    của Nami Exchange và có thể xảy ra mà không có sự báo trước với Nami Exchange.
                                    Nami Exchange có toàn quyền quyết định về phản hồi của mình đối với bất kỳ thay
                                    đổi quan trọng nào về hệ thống, bao gồm quyết định không hỗ trợ bất kỳ loại tiền kỹ
                                    thuật số mới nào, thao tác fork hoặc các hành động khác. Bạn thừa nhận và chấp nhận
                                    rủi ro của việc thay đổi hoạt động đối với giao thức tiền điện tử và đồng ý rằng
                                    Nami Exchange không chịu trách nhiệm về những thay đổi hoạt động đó và không chịu
                                    trách nhiệm về bất kỳ tổn thất giá trị nào mà bạn có thể gặp phải do những thay đổi
                                    trong quy tắc hoạt động đó. Bạn thừa nhận và chấp nhận rằng Nami Exchange có toàn
                                    quyền quyết định phản ứng của mình đối với bất kỳ thay đổi hoạt động nào và chúng
                                    tôi không có trách nhiệm hỗ trợ bạn với các giao thức hoặc tiền tệ không được hỗ
                                    trợ.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.6 Quyền sở hữu và lưu ký tiền điện tử
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Tất cả các loại tiền kỹ thuật số được giữ trong Ví tiền kỹ thuật số của bạn là tài
                                    sản giám sát do Nami Exchange nắm giữ vì lợi ích của bạn, như được mô tả chi tiết
                                    hơn bên dưới.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span className="text-dark font-weight-bold">2.6.1 Quyền sở hữu.</span> Bạn có toàn
                                    quyền sở hữu đối với tiền điện tử của mình và quyền này không được chuyển sang cho
                                    Nami Exchange. Là chủ sở hữu của Tiền kỹ thuật số trong Ví kỹ thuật số của bạn,
                                    bạn sẽ chịu mọi rủi ro về việc mất Tiền kỹ thuật số đó. Nami Exchange sẽ không có
                                    trách nhiệm pháp lý đối với các biến động của tiền điện tử. Không có Đơn vị tiền
                                    điện tử nào trong Ví tiền điện tử của bạn là, sẽ là hoặc có thể là, tài sản Nami
                                    Exchange mượn; Nami Exchange sẽ không coi các tài sản trong Ví tiền điện tử của
                                    Người dùng là thuộc về Nami Exchange. Nami Exchange có thể không cấp quyền lợi
                                    bảo mật cho tiền điện tử được giữ trong Ví tiền điện tử của bạn. Trừ khi nhận được
                                    yêu cầu hợp lệ của tòa, hoặc được quy định ở các mục dưới đây, Nami Exchange sẽ
                                    không bán, chuyển nhượng, cho vay, thế chấp hoặc chuyển giao tiền điện tử trong Ví
                                    tiền điện tử của bạn mà không có yêu cầu của bạn.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span className="text-dark font-weight-bold">2.6.2 Kiểm soát.</span> Bạn kiểm soát
                                    các đơn vị tiền điện tử được giữ trong Ví tiền điện tử của mình. Bất kỳ lúc nào, tùy
                                    thuộc vào sự cố ngừng hoạt động, thời gian ngừng hoạt động và các chính sách hiện
                                    hành khác, bạn có thể rút Tiền kỹ thuật số của mình bằng cách gửi nó đến một địa chỉ
                                    blockchain khác. Miễn là bạn tiếp tục lưu giữ tiền điện tử của mình với Nami
                                    Exchange, Nami Exchange sẽ giữ quyền kiểm soát đối với các khóa cá nhân điện tử
                                    được liên kết với các địa chỉ blockchain do Nami Exchange vận hành, bao gồm cả các
                                    địa chỉ blockchain lưu giữ tiền điện tử của bạn.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6 ml-1">
                                    <span className="text-dark font-weight-bold">2.6.3 Thừa nhận rủi ro.</span> Bạn thừa
                                    nhận rằng Tiền tệ kỹ thuật số có thể không phải tuân theo các biện pháp bảo vệ hoặc
                                    bảo hiểm do cơ quan quản lý tài chính và ngân hàng nhà nước của một số quốc gia nhất
                                    định cung cấp.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.7 Ví USDT & VNDC
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Bạn cũng có thể chọn mua Tether USD và VND Coin từ Nami Exchange. Bạn là chủ sở
                                    hữu số dư trên Wallet của mình. Nami Exchange không phải là nhà phát hành USDT và
                                    VNDC, không giữ Đô la Mỹ để dự trữ cho người sở hữu USDT & VNDC và không có nghĩa vụ
                                    mua lại USDT của bạn bằng USD và VNDC bằng VND. Bạn có thể đổi USDT của mình bằng
                                    Tether và Nami Exchange cũng có thể chọn mua lại USDT của bạn để đổi lấy USD và
                                    VNDC lấy VND.
                                </div>
                            </div>
                            <div className="section-3 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    3. Dịch vụ Thanh toán, Giao dịch Mua & Bán, Giao dịch Tín dụng
                                </div>
                                <div className="font-semibold mb-5">
                                    3.1. Quỹ USDT & VNDC
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Bạn có thể nạp tiền vào Ví USDT & VNDC của mình từ chuyển khoản ngân hàng khi gửi
                                    USDT & VNDC trong chuỗi. Số dư của bạn đang ở trạng thái chờ xử lý và sẽ không được
                                    ghi lại trên Ví của bạn cho đến khi chuyển khoản ngân hàng đã được tiến hành, thường
                                    là trong vòng 1 ngày làm việc. Chúng tôi có thể ghi nợ tài khoản được liên kết của
                                    bạn ngay sau khi bạn bắt đầu thanh toán. Tên trên tài khoản được liên kết và chuyển
                                    khoản ngân hàng của bạn phải khớp với tên được xác minh trên Tài khoản Nami
                                    Exchange của bạn.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.2. Giao dịch trên Trang của Nami Exchange.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange đóng vai trò là đại lý, giao dịch thay mặt bạn, để tạo điều kiện
                                    thuận lợi cho việc mua hoặc bán giữa bạn và các khách hàng khác của Nami Exchange.
                                    Khi bạn mua hoặc bán Tiền tệ kỹ thuật số trên Trang của Nami Exchange, bạn sẽ
                                    không mua Tiền tệ kỹ thuật số từ Nami Exchange hoặc bán Tiền tệ kỹ thuật số cho
                                    Nami Exchange. Giao dịch mua Tiền tệ kỹ thuật số của bạn sẽ được xử lý bằng Tiền
                                    tệ kỹ thuật số được giữ trong một số Ví tiền tệ kỹ thuật số nhất định, theo sự cho
                                    phép của Nami Exchange. Giao dịch mua của bạn phải tuân thủ các hướng dẫn có liên
                                    quan như được cung cấp trên Trang của Nami Exchange. Nami Exchange có quyền hủy
                                    bất kỳ giao dịch nào không được bạn xác nhận trong vòng năm (5) giây sau khi Nami
                                    Exchange báo giá giao dịch. Chúng tôi sẽ bắt đầu giao dịch mua Tiền tệ kỹ thuật số
                                    của bạn bằng Phương thức thanh toán hợp lệ vào ngày làm việc mà chúng tôi nhận được
                                    hướng dẫn của bạn. Ngay sau khi thanh toán, các Nami Exchange sẽ gửi đồng tiền
                                    điện tử đã mua vào Ví tiền tệ kỹ thuật số của bạn, có thể mất đến năm ngày làm việc
                                    đối với tài khoản ngân hàng hoặc thẻ tín dụng hoặc thẻ ghi nợ. Các giao dịch mua và
                                    bán bằng Tiền kỹ thuật số ở đây được gọi chung là “Giao dịch bằng tiền kỹ thuật số”.
                                    Nếu Giao dịch tiền tệ kỹ thuật số của bạn không thể hoàn thành vì bất kỳ lý do gì
                                    (chẳng hạn như biến động giá, độ trễ của thị trường, không thể tìm thấy đối tác cho
                                    giao dịch của bạn hoặc kích thước đặt hàng), Nami Exchange sẽ từ chối đơn đặt hàng
                                    và thông báo cho bạn về việc từ chối đó. Bạn sẽ không bị tính phí cho một giao dịch
                                    bị từ chối.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.3. Phí
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nói chung, doanh thu của Nami Exchange đến từ việc thu phí khi bạn mua hoặc bán
                                    tiền kỹ thuật số trên Trang web của chúng tôi. Bạn có thể tìm thấy danh sách đầy đủ
                                    các khoản phí dịch vụ của chúng tôi cho Tài khoản Nami Exchange trên Chính sách
                                    Công khai Nội dung. Bằng cách sử dụng Dịch vụ Nami Exchange, bạn đồng ý thanh toán
                                    tất cả các khoản phí hiện hành. Nami Exchange bảo lưu quyền điều chỉnh giá và phí
                                    của mình cũng như mọi sự miễn trừ áp dụng vào bất kỳ lúc nào. Chúng tôi sẽ cung cấp
                                    cho bạn chi tiết về giá cả trong mỗi biên lai, bạn sẽ luôn được thông báo về giá cả
                                    và phí áp dụng cho giao dịch của bạn khi bạn cho phép giao dịch. Chúng tôi có thể
                                    tính phí mạng (phí khai thác) để thay mặt bạn xử lý Giao dịch tiền tệ kỹ thuật số.
                                    Mặc dù chúng tôi sẽ luôn thông báo cho bạn về phí mạng vào hoặc trước thời điểm bạn
                                    cho phép Giao dịch tiền tệ kỹ thuật số, việc tính phí mạng được giữ theo quyết định
                                    của chúng tôi. Phí ngân hàng được tính cho Nami Exchange được trừ khi chuyển đến
                                    hoặc từ Nami Exchange. Bạn có trách nhiệm thanh toán bất kỳ khoản phí bổ sung nào
                                    do nhà cung cấp dịch vụ tài chính của bạn tính. Chúng tôi sẽ không xử lý chuyển
                                    khoản nếu phí ngân hàng liên quan vượt quá giá trị của chuyển khoản. Có thể có yêu
                                    cầu đặt cọc bổ sung để trang trải phí ngân hàng nếu bạn muốn hoàn tất việc chuyển
                                    tiền như vậy.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.4. Giao dịch tiền điện tử định kỳ
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nếu bạn bắt đầu Giao dịch tiền điện tử định kỳ, bạn cho phép chúng tôi thực hiện
                                    thanh toán điện tử định kỳ theo Giao dịch tiền điện tử đã chọn của bạn và bất kỳ tài
                                    khoản thanh toán tương ứng nào, cho đến khi bạn hoặc Nami Exchange hủy lệnh thanh
                                    toán định kỳ này. Ủy quyền này sẽ có hiệu lực đầy đủ cho đến khi bạn thay đổi cài
                                    đặt giao dịch định kỳ của mình hoặc cho đến khi bạn cung cấp cho chúng tôi thông báo
                                    bằng văn bản tại <a href="https://nami.exchange" target="_blank" rel="noreferrer">https://nami.exchange</a>.
                                    Trước khi thực hiện giao dịch định kỳ, bạn đồng ý thông báo bằng văn bản cho Nami
                                    Exchange về bất kỳ thay đổi nào trong thông tin tài khoản ngân hàng được liên kết.
                                    Nami Exchange có thể, chấm dứt các giao dịch định kỳ bằng cách cung cấp thông báo
                                    cho bạn bất cứ lúc nào
                                </div>
                                <div className="font-semibold mb-5">
                                    3.5. Thu hồi
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Trừ khi bạn không lên lịch cho giao dịch mua của mình, bạn không thể rút lại sự đồng
                                    thuận của mình với lệnh mua bán/giao dịch tiền điện tử. Ví dụ: bạn thiết lập giao
                                    dịch mua Định kỳ tiền điện tử ("Giao dịch trong tương lai"). Trong trường hợp là
                                    Giao dịch tương lai, bạn có thể rút lại sự chấp thuận của mình cho đến cuối ngày làm
                                    việc trước ngày mà Giao dịch đó được lên lịch thực hiện. Để rút lại sự đồng ý của
                                    bạn đối với Giao dịch được lên lịch, hãy làm theo hướng dẫn trên Nami Exchange.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.6. Giao dịch trái phép và không chính xác
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Trừ khi được thông báo trước, chúng tôi sẽ cho rằng bạn đã cho phép thực hiện giao
                                    dịch tiền điện tử bằng thông tin đăng nhập của bạn. Trong trường hợp có một giao
                                    dịch cụ thể không được ủy quyền hoặc nếu một giao dịch được thực hiện không chính
                                    xác, bạn phải liên hệ với chúng tôi sớm nhất có thể qua email hoặc qua điện thoại
                                    (thông tin liên hệ được cung cấp qua trang web chính thức của chúng tôi). Điều quan
                                    trọng là bạn phải thường xuyên kiểm tra số dư Ví tiền điện tử và lịch sử giao dịch
                                    của mình để đảm bảo bạn thông báo cho chúng tôi sớm nhất có thể về bất kỳ giao dịch
                                    trái phép hoặc không chính xác nào. Chúng tôi không chịu trách nhiệm về bất cứ khiếu
                                    nại nào đối với các giao dịch trái phép hoặc không chính xác trừ khi bạn đã thông
                                    báo cho chúng tôi theo như hướng dẫn trên đây.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.7. Thông tin tài khoản
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Sử dụng trang Nami Exchange, bạn sẽ có thể xem số dư trên Ví USD và Ví tiền điện
                                    tử của mình. Bạn cũng có thể xem lịch sử giao dịch của mình bằng Trang web của
                                    Nami Exchange, thông tin có thể kiểm tra bao gồm (i) số tiền (và đơn vị tiền tệ)
                                    của mỗi Giao dịch tiền điện tử, (ii) tham chiếu nhận dạng của người thanh toán và /
                                    hoặc người nhận thanh toán (nếu thích hợp), (iii) bất kỳ khoản phí nào được tính
                                    (không bao gồm bất kỳ chênh lệch hoặc ký quỹ, so với tỷ giá thị trường hiện hành
                                    trên nền tảng giao dịch của Nami Exchange), (iv) nếu có, tỷ giá hối đoái và số
                                    tiền (theo đơn vị tiền tệ mới) sau khi trao đổi (trong trường hợp bạn là người thanh
                                    toán) hoặc số tiền (theo đơn vị tiền tệ gốc) trước khi trao đổi (trong trường hợp
                                    bạn là người nhận thanh toán) và (v) ngày thực hiện Giao dịch tiền điện tử.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.8. Đồng ý truy cập, xử lý và lưu trữ dữ liệu cá nhân của bạn
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Bạn đồng ý cho chúng tôi truy cập, xử lý và lưu giữ bất kỳ thông tin cá nhân nào mà
                                    bạn cung cấp cho chúng tôi với mục đích hỗ trợ chúng tôi cung cấp Dịch vụ Nami
                                    Exchange cho bạn. Sự đồng ý này không liên quan và không ảnh hưởng đến bất kỳ quyền
                                    hoặc nghĩa vụ nào mà chúng tôi hoặc bạn có theo luật bảo vệ dữ liệu, luật và quy
                                    định về quyền riêng tư. Bằng cách đóng tài khoản Nami, bạn có thể rút lại sự đồng
                                    ý của mình bất kỳ lúc nào. Tuy nhiên, chúng tôi có thể giữ và tiếp tục xử lý thông
                                    tin cá nhân của bạn cho các mục đích khác. Vui lòng xem Chính sách quyền riêng tư
                                    của chúng tôi để biết thêm thông tin về cách chúng tôi xử lý dữ liệu cá nhân của bạn
                                    và các quyền của bạn đối với điều này.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.9. Đảo ngược & Hủy.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Các giao dịch được đánh dấu là đã hoàn tất hoặc đang chờ xử lý không thể bị hủy bỏ,
                                    đảo ngược hoặc thay đổi. Nếu thanh toán của bạn không thành công, nếu tài khoản của
                                    bạn không có đủ tiền hoặc nếu bạn đảo ngược một khoản thanh toán được thực hiện từ
                                    tiền trong tài khoản ngân hàng của mình, bạn cho phép Nami Exchange có toàn quyền
                                    hủy giao dịch hoặc ghi nợ khoản thanh toán khác của bạn với bất kỳ số tiền nào cần
                                    thiết để hoàn tất giao dịch. Bạn có trách nhiệm duy trì số dư phù hợp và / hoặc đủ
                                    hạn mức tín dụng để tránh thấu chi, không đủ tiền hoặc không đủ khả năng thanh toán
                                    các khoản phí tương tự cho dịch vụ từ nhà cung cấp thanh toán của bạn. Nếu chúng tôi
                                    nghi ngờ giao dịch liên quan (hoặc có nguy cơ cao liên quan đến) rửa tiền, tài trợ
                                    khủng bố, gian lận hoặc bất kỳ loại tội phạm tài chính nào khác, chúng tôi có toàn
                                    quyền từ chối xử lý hoặc hủy bỏ hoặc đảo ngược bất cứ hoạt động giao dịch hoặc
                                    chuyển bất kỳ khoản tiền điện tử nào ngay cả sau khi tiền đã được ghi nợ từ (các)
                                    tài khoản của bạn; để đáp lại trát đòi hầu tòa, lệnh của tòa án hoặc lệnh khác của
                                    chính phủ; nếu chúng tôi nghi ngờ một cách hợp lý rằng giao dịch có sai sót; hoặc
                                    nếu Nami Exchange nghi ngờ giao dịch liên quan đến việc Hoạt động Bị Cấm hoặc
                                    Doanh nghiệp Bị Cấm như được nêu dưới đây. Trong những trường hợp như vậy, Nami
                                    Exchange sẽ hoàn tác giao dịch và chúng tôi không có nghĩa vụ cho phép bạn khôi phục
                                    đơn đặt hàng mua hoặc bán với cùng mức giá hoặc theo các điều khoản giống như giao
                                    dịch đã bị hủy.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.10. Đối tác Dịch vụ Thanh toán
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange có thể sử dụng bộ xử lý thanh toán của bên thứ ba để xử lý bất kỳ
                                    khoản thanh toán nào giữa bạn và Nami Exchange, bao gồm nhưng không giới hạn ở các
                                    khoản thanh toán liên quan đến việc bạn sử dụng Giao dịch tiền điện tử hoặc Tài
                                    khoản Nami Exchange.
                                </div>
                            </div>
                            <div className="section-4 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    4. Chuyển tiền điện tử
                                </div>
                                <div className="font-semibold mb-5">
                                    4.1. Các điều khoản chung
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Sau khi bạn đã xác minh đầy đủ danh tính của mình, bạn sẽ có thể gửi tiền điện tử
                                    được hỗ trợ và yêu cầu, nhận và lưu trữ tiền điện tử được hỗ trợ từ bên thứ ba bằng
                                    cách đưa ra lệnh thông qua Trang web của Nami Exchange. Việc bạn chuyển các Đơn vị
                                    tiền điện tử được hỗ trợ giữa các ví tiền điện tử khác của bạn (bao gồm các ví ngoài
                                    Nami Exchange), hoặc chuyển tiền điện tử đến và từ các bên thứ ba là “Giao dịch
                                    Chuyển tiền điện tử”.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.2. Chuyển tiền điện tử trong nước
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Người bắt đầu giao dịch gửi hoặc nhận tiền điện tử từ bạn hoặc bên thứ ba từ ví bên
                                    ngoài không được lưu trữ trên Nami Exchange đến Ví Nami Exchange (“Chuyển khoản
                                    trong nước”), hoàn toàn chịu trách nhiệm về việc thực hiện giao dịch đúng cách, có
                                    thể bao gồm thực hiện thanh toán đủ mạng hoặc phí cho miners để giao dịch thành
                                    công. Chuyển khoản trong nước sẽ vẫn ở trạng thái chờ xử lý ngoài tầm kiểm soát của
                                    Nami Exchange do không đủ phí mạng và chúng tôi không chịu trách nhiệm về sự chậm
                                    trễ hoặc tổn thất phát sinh do lỗi trong quá trình bắt đầu giao dịch và không có
                                    nghĩa vụ hỗ trợ khắc phục các giao dịch đó. Bằng cách bắt đầu Chuyển khoản trong
                                    nước, bạn chứng thực rằng bạn đang giao dịch bằng Đơn vị tiền điện tử được hỗ trợ
                                    phù hợp với ví Nami Exchange cụ thể mà tiền được chuyển vào. Ví dụ: nếu bạn chọn
                                    một địa chỉ ví Ethereum để nhận tiền, bạn chứng thực rằng bạn chỉ đang thực hiện
                                    Chuyển khoản trong nước đối với đồng Ethereum, chứ không phải bất kỳ loại tiền tệ
                                    nào khác như Bitcoin hoặc Ethereum Classic. Nami Exchange không chịu bất kỳ nghĩa
                                    vụ nào liên quan đến tiền điện tử không được hỗ trợ được gửi đến Tài khoản Nami
                                    Exchange hoặc tiền điện tử được hỗ trợ được gửi đến ví tiền điện tử không tương
                                    thích. Các khoản tiền đã bị chuyển sai sẽ bị mất. Chúng tôi khuyên khách hàng nên
                                    gửi một lượng nhỏ tiền điện tử được hỗ trợ để kiểm tra trước khi bắt đầu gửi một
                                    lượng đáng kể tiền điện tử được hỗ trợ. Tùy từng thời điểm, Nami Exchange có thể
                                    xác định các loại tiền điện tử sẽ được hỗ trợ hoặc ngừng hỗ trợ.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.3. Chuyển tiền điện tử ra nước ngoài
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Khi bạn gửi tiền điện tử từ Tài khoản Nami Exchange của mình đến một ví bên ngoài
                                    (“Chuyển khoản đi”), việc chuyển tiền như vậy sẽ được thực hiện theo chỉ dẫn của bạn
                                    bởi Nami Exchange. Bạn nên xác minh tất cả thông tin giao dịch trước khi gửi hướng
                                    dẫn cho chúng tôi. Nami Exchange sẽ không chịu trách nhiệm pháp lý hoặc trách
                                    nhiệm trong trường hợp bạn nhập địa chỉ đích của giao dịch blockchain không chính
                                    xác. Chúng tôi không đảm bảo danh tính hoặc giá trị nhận được của người nhận Chuyển
                                    khoản. Không thể hoàn tác việc Chuyển tiền điện tử sau khi chúng đã được phát tới
                                    mạng tiền điện tử có liên quan, mặc dù chúng có thể ở trạng thái chờ xử lý và được
                                    chỉ định tương ứng, trong khi giao dịch được xử lý bởi nhà khai thác mạng. Nami
                                    Exchange không kiểm soát mạng tiền điện tử và không đảm bảo rằng Giao dịch Chuyển
                                    tiền điện tử sẽ được mạng xác nhận. Chúng tôi có thể từ chối xử lý hoặc hủy bất kỳ
                                    Giao dịch chuyển tiền điện tử ra ví bên ngoài đang chờ xử lý nào theo yêu cầu của
                                    pháp luật hoặc bất kỳ tòa án hoặc cơ quan có thẩm quyền nào của bất kỳ khu vực tài
                                    phán nào khác mà Nami Exchange là đối tượng. Ngoài ra, chúng tôi có thể yêu cầu
                                    bạn đợi một khoảng thời gian sau khi hoàn thành giao dịch trước khi cho phép bạn sử
                                    dụng thêm Dịch vụ Nami Exchange và / hoặc trước khi cho phép bạn tham gia vào các
                                    giao dịch vượt quá giới hạn nhất định.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.4. Giao dịch đang chờ xử lý.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Khi một Giao dịch Chuyển tiền điện tử được gửi đến mạng tiền điện tử, giao dịch sẽ
                                    không được xác nhận và vẫn ở trạng thái chờ xử lý trong một khoảng thời gian đủ để
                                    xác nhận giao dịch bởi mạng tiền điện tử. Chuyển tiền điện tử chưa hoàn tất khi đang
                                    ở trạng thái chờ xử lý. Các giao dịch chuyển tiền điện tử đang chờ xử lý được thực
                                    hiện từ Tài khoản Nami Exchange sẽ phản ánh trạng thái giao dịch đang chờ xử lý và
                                    bạn không thể sử dụng trên nền tảng Nami Exchange hoặc trong khi giao dịch đang
                                    chờ xử lý.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.5. Chuyển đến Địa chỉ Email Người nhận.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange cho phép bạn triển khai Chuyển tiền điện tử cho khách hàng của
                                    Nami Exchange bằng cách chỉ định địa chỉ email của khách hàng đó. Nếu bạn bắt đầu
                                    thao tác Chuyển tiền điện tử đến một địa chỉ email mà chủ sở hữu không có Tài khoản
                                    Nami Exchange hiện có, chúng tôi sẽ mời người nhận mở Tài khoản Nami Exchange.
                                    Nếu người nhận không mở Tài khoản trao đổi Nami trong vòng 30 ngày, chúng tôi sẽ
                                    trả lại Đơn vị tiền điện tử có liên quan vào Ví tiền điện tử của bạn.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.6. Các khoản nợ.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Trong trường hợp có số tiền chưa thanh toán cho chúng tôi dưới đây, bao gồm cả trong
                                    Tài khoản Nami Exchange của bạn, Nami Exchange bảo lưu quyền ghi nợ tương ứng
                                    trên Tài khoản Nami Exchange của bạn / hoặc giữ lại số tiền mà bạn có thể chuyển
                                    từ tài khoản Nami Exchange của mình
                                </div>
                                <div className="font-semibold mb-5">
                                    4.7. Người bán trung gian
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Chúng tôi không kiểm soát hoặc chịu trách nhiệm pháp lý đối với việc phân phối, chất
                                    lượng, an toàn, hợp pháp hoặc bất kỳ khía cạnh nào khác của bất kỳ hàng hóa hoặc
                                    dịch vụ nào mà bạn có thể mua từ bên thứ ba (bao gồm cả những người dùng khác của
                                    Dịch vụ tiền điện tử Nami Exchange). Chúng tôi không chịu trách nhiệm đảm bảo rằng
                                    người mua bên thứ ba hoặc người bán mà bạn giao dịch sẽ hoàn thành giao dịch hoặc
                                    được ủy quyền làm như vậy. Nếu bạn gặp sự cố với bất kỳ hàng hóa hoặc dịch vụ nào
                                    được mua hoặc bán cho bên thứ ba sử dụng tiền điện tử được chuyển bằng Dịch vụ tiền
                                    điện tử của Nami Exchange hoặc nếu bạn có tranh chấp với bên thứ ba đó, bạn nên
                                    giải quyết tranh chấp trực tiếp với bên thứ ba đó. Nếu bạn cho rằng bên thứ ba đã
                                    hành xử theo cách gian lận, gây hiểu lầm hoặc không phù hợp hoặc nếu bạn không thể
                                    giải quyết thỏa đáng tranh chấp với bên thứ ba, bạn có thể thông báo cho Bộ phận hỗ
                                    trợ của Nami Exchange tại <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a> để chúng tôi có
                                    thể xem xét hành động nào để thực hiện, nếu có.
                                </div>
                            </div>
                            <div className="section-5 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    5. Bảo vệ và bảo mật dữ liệu
                                </div>
                                <div className="font-semibold mb-5">
                                    5.1. Vi phạm an ninh
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nếu bạn nghi ngờ rằng Tài khoản Nami Exchange của mình hoặc bất kỳ chi tiết bảo
                                    mật nào của bạn đã bị xâm phạm hoặc nếu bạn biết về bất kỳ gian lận hoặc cố ý gian
                                    lận hoặc bất kỳ sự cố bảo mật nào khác (bao gồm cả một cuộc tấn công an ninh mạng)
                                    ảnh hưởng đến bạn và / hoặc Nami Exchange (cùng "Vi phạm Bảo mật"), bạn phải thông
                                    báo cho Bộ phận hỗ trợ Nami Exchange càng sớm càng tốt bằng email miễn phí tạ <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a> và tiếp tục cung cấp
                                    thông tin chính xác và cập nhật thông tin ngày trong suốt thời gian xảy ra Vi phạm
                                    Bảo mật. Bạn phải thực hiện bất kỳ bước nào mà chúng tôi yêu cầu một cách hợp lý để
                                    khắc phục, quản lý hoặc báo cáo bất kỳ Vi phạm Bảo mật nào. Việc không cung cấp
                                    thông báo nhanh chóng về bất kỳ Vi phạm Bảo mật nào có thể được tính đến khi chúng
                                    tôi quyết định giải pháp phù hợp cho vấn đề.
                                </div>
                                <div className="font-semibold mb-5">
                                    5.2. Dữ liệu cá nhân
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Bạn thừa nhận rằng chúng tôi có thể xử lý dữ liệu cá nhân liên quan đến bạn (nếu bạn
                                    là cá nhân), và dữ liệu cá nhân mà bạn đã cung cấp hoặc trong tương lai sẽ cung cấp
                                    cho chúng tôi liên quan đến nhân viên của bạn và các cá nhân được liên kết hoặc khác
                                    liên quan đến vấn đề này Thỏa thuận, hoặc Dịch vụ trao đổi bản đồ. Theo đó, bạn
                                    tuyên bố và đảm bảo rằng: (i) việc tiết lộ của bạn cho chúng tôi về bất kỳ dữ liệu
                                    cá nhân nào liên quan đến các cá nhân không phải là bạn đã hoặc sẽ được thực hiện
                                    theo tất cả các luật hiện hành về bảo vệ dữ liệu và quyền riêng tư dữ liệu, và những
                                    dữ liệu đó là chính xác, tối đa ngày tháng và có liên quan khi được tiết lộ; (ii)
                                    trước khi cung cấp bất kỳ dữ liệu cá nhân nào như vậy cho chúng tôi, bạn đã đọc và
                                    hiểu Chính sách quyền riêng tư của chúng tôi và, trong trường hợp dữ liệu cá nhân
                                    liên quan đến một cá nhân không phải là bạn, đã (hoặc sẽ tại thời điểm tiết lộ) đã
                                    cung cấp bản sao của Chính sách quyền riêng tư đó (được sửa đổi theo thời gian) cho
                                    cá nhân đó; và (iii) trong trường hợp chúng tôi cung cấp cho bạn phiên bản thay thế
                                    của Chính sách quyền riêng tư, bạn sẽ ngay lập tức đọc thông báo đó và cung cấp một
                                    bản sao cho bất kỳ cá nhân nào có các dữ liệu mà bạn đã cung cấp cho chúng tôi.
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center">
                            <div className="text-4xl font-semibold mb-7 ">
                                Legal User Agreement
                            </div>
                            <div className="text-lg text-black-600 font-medium ">
                                Nami Exchange
                            </div>
                            <div className="text-lg font-semibold ">
                                Last updated: April 30, 2021
                            </div>
                        </div>
                        <div className="card bg-white rounded-lg my-20 p-10 py-15 px-[6.875rem]">
                            <div className="text-black-600 font-size-h7 mb-10">
                                Welcome to Nami Exchange! This is an User Agreement between you (also referred to
                                herein as “Client,” “User,” or customer) and Nami Exchange Pte. Ltd. ("Nami
                                Exchange"). This User Agreement ("Agreement") governs your use of the services provided
                                by Nami Exchange described below ("Nami Exchange Services" or "Services"). By
                                signing up to use an account through attlas.io, APIs, or the Nami Exchange mobile
                                application (collectively the "Nami Exchange Site"), you agree that you have read,
                                understand, and accept all of the terms and conditions contained in this Agreement
                                including Privacy Policy and Content Disclosure Policy.
                                <br />Similar to any other form of asset, the value of Digital Currencies can go up or
                                down and there can be a substantial risk that you lose money buying, selling,
                                holding, or investing in digital currencies. You should carefully consider whether
                                trading or holding Digital Currencies is suitable for you in light of your financial
                                condition.
                            </div>
                            <div className="text-lg font-semibold mb-5">
                                Part 1: GENERAL USE
                            </div>
                            <div className="section-1 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    1. Account Setup
                                </div>
                                <div className="font-semibold mb-5">
                                    1.1 Eligibility
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    To be eligible to use the Nami Exchange Services, you must be at least 18 years
                                    old.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.2 Terms
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We may alter or modify this Agreement at any time by posting the revised agreement
                                    on the Nami Exchange Site and/or providing you with a copy (a “Revised
                                    Agreement”). The Revised Agreement shall take effect as soon as it is posted but
                                    will not apply retroactively. Your continued use of the Services after the posting
                                    of the Revised Agreement confirm your acceptance of such Revised Agreement. If you
                                    do not agree with any such modification, your sole and exclusive remedy is to
                                    terminate your use of the Services and close your account.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.3 Registration of Nami Exchange Account
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You must register for an Nami Exchange Account to use the Nami Exchange Services
                                    (an "Nami Exchange Account"). By using an Nami Exchange Account you agree that
                                    you will use Nami Exchange only for yourself, and not on behalf of any third
                                    party, unless it has been authorized by Nami Exchange. You are fully responsible
                                    for all activity that occurs under your Nami Exchange Account. We may, in our sole
                                    discretion, refuse to open a Nami Exchange Account, or limit the number of Nami
                                    Exchange Accounts that you may hold or suspend or terminate any Nami Exchange
                                    Account or the trading of a specific Digital Currency in your account.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.4 Identity Verification
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    During registration for your Nami Exchange Account, you agree to provide us with
                                    the information we request for the purposes of identity verification and the
                                    detection of money laundering, terrorist financing, fraud, or any other financial
                                    crimes and permit us to keep a record of such information. You will need to complete
                                    certain verification procedures before you are permitted to use the Nami Exchange
                                    Services. Your access to one or more Nami Exchange Services and the limits that
                                    apply to your use of the Nami Exchange Services, may be altered upon the collected
                                    information about you on an ongoing basis. The information we request may include
                                    certain personal information, including, but not limited to, your name, address,
                                    telephone number, e-mail address, date of birth, taxpayer identification number, a
                                    government identification, and information regarding your bank account (such as the
                                    name of the bank, the account type, routing number, and account number) and in some
                                    cases (where permitted by law), special categories of personal data, such as your
                                    biometric information. In providing us with this or any other information that may
                                    be required, you confirm that the information is accurate and authentic. You agree
                                    to keep us updated of any change of your information. You authorize us to make
                                    inquiries, whether directly or through third parties, which we consider necessary to
                                    verify your identity or protect you and/or us against fraud or other financial
                                    crime, and to take action we reasonably deem necessary based on the results of such
                                    inquiries. When we carry out these inquiries, you acknowledge and agree that your
                                    personal information may be disclosed to credit reference and fraud prevention or
                                    financial crime agencies and that these agencies may respond to our inquiries in
                                    full. This is an identity check only and should have no adverse effect on your
                                    credit rating. Further, you authorize your wireless operator to use your mobile
                                    number, name, address, email, network status, customer type, customer role, billing
                                    type, mobile device identifiers (IMSI and IMEI) and other subscriber status details,
                                    if available, solely to allow verification of your identity and to compare
                                    information you have provided to Nami Exchange with your wireless operator account
                                    profile information for the duration of the business relationship. See our Privacy
                                    Policy for how we treat your data.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.5 Access
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    To access the Nami Exchange Services, you must have the necessary equipment (such
                                    as a smartphone or laptop) and access to the Internet. The Nami Exchange Services
                                    can be accessed directly using the Nami Exchange Site. Access to Nami Exchange
                                    Services may become degraded or unavailable during times of significant volatility
                                    or volume. This could result in the inability to buy or sell for periods of time and
                                    may also lead to support response time delays. Although we strive to provide you
                                    with excellent service, we do not represent that the Nami Exchange Site or other
                                    Nami Exchange Services will be available without interruption and we do not
                                    guarantee that any order will be executed, accepted, recorded, or remain open.
                                    Nami Exchange shall not be liable for any losses resulting from or arising out of
                                    transaction delays.
                                </div>
                            </div>
                            <div className="section-2 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    2. Wallet and Custodial Services
                                </div>
                                <div className="font-semibold mb-5">
                                    2.1 Wallet Services
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    As part of your Nami Exchange Account, Nami Exchange will provide qualified
                                    users access to a hosted Digital Currency wallet(s) for holding Digital Currencies
                                    (“Digital Currency Wallet”).
                                </div>
                                <div className="font-semibold mb-5">
                                    2.2 Hosted Digital Currency Wallet
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Your Digital Currency Wallet allows you to store, track, transfer, and manage your
                                    balances of Digital Currency. As used throughout, "Digital Currency" means only
                                    those particular digital currencies listed as available to trade or custody in your
                                    Nami Exchange Account (also referred to as “Supported Digital Currency”). Services
                                    and supported assets may vary by jurisdiction. We securely store Digital Currency
                                    private keys, which are used to process transactions, in a combination of online and
                                    offline storage. As a result of our security protocols, it may be necessary for us
                                    to retrieve private keys or related information from offline storage to facilitate a
                                    Digital Currency Transfers in accordance with your instructions, and you acknowledge
                                    that this may delay the initiation or crediting of such Digital Currency Transfers.
                                    Additional rules associated with such product(s) and service(s) may apply.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.3 Supported Digital Currencies
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Your Nami Exchange Account is intended solely for proper use of Supported Digital
                                    Currencies as designated on the Site. Under no circumstances should you attempt to
                                    use your Digital Currency Wallet to store, send, request, or receive digital
                                    currencies we do not support. Nami Exchange shall take no responsibility in
                                    connection with any of your attempts to use your Digital Currency Wallet with
                                    digital currencies that we do not support. If you have any questions about which
                                    Digital Currencies we currently support, please visit <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a>.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.4 Supplemental Protocols Excluded
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Unless specifically announced on the Nami Exchange Site or other official public
                                    statement of Nami Exchange, Supported Digital Currencies excludes all other
                                    protocols and/or functionality which supplement or interact with the Supported
                                    Digital Currency. This exclusion includes but is not limited to: metacoins, colored
                                    coins, side chains, or other derivative, enhanced, or forked protocols, tokens, or
                                    coins or other functionality, such as staking, protocol governance, and/or any smart
                                    contract functionality, which may supplement or interact with a Digital Currency we
                                    support. Do not use your Nami Exchange Account in any attempt to receive, request,
                                    send, store, or engage in any other type of transaction or functionality involving
                                    any such protocol as Nami Exchange is not configured to detect, secure, or process
                                    these transactions and functionality. Any attempted transactions in such items will
                                    result in loss of the item. You acknowledge and agree that supplemental protocols
                                    are excluded from Supported Digital Currency and that Nami Exchange has no
                                    liability for any losses related to supplemental protocols.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.5 Operation of Digital Currency Protocols
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    The underlying software protocols which govern the operation of Digital Currency
                                    supported on our platform are not owned or controlled by us. Generally, the
                                    underlying protocols are open source, and anyone can use, copy, modify, and
                                    distribute them. We assume no responsibility for the operation of the underlying
                                    protocols and we are not able to guarantee the functionality or security of network
                                    operations. In particular, the underlying protocols may be subject to sudden changes
                                    in operating rules (including “forks”). Any such material operating changes may
                                    materially affect the availability, value, functionality, and/or the name of the
                                    Digital Currency you store in your Digital Currency Wallet. Nami Exchange does not
                                    control the timing and features of these material operating changes. You are
                                    responsible for your self-awareness of upcoming operating changes. You must also
                                    carefully consider publicly available information together with information that may
                                    be provided by Nami Exchange in determining whether to continue to use an Nami
                                    Exchange Account for the affected Digital Currency. In the event of any such
                                    operational change, Nami Exchange has the right to take steps that may be
                                    necessary to protect the security and safety of assets held on the Nami Exchange
                                    platform, including temporarily suspend the operations for the involved digital
                                    currency(ies), and/or other necessary steps; Nami Exchange will use its best
                                    efforts to provide you with notice of its response to any material operating change;
                                    however, such changes are outside of Nami Exchange’s control and may occur without
                                    notice to Nami Exchange. Nami Exchange’s response to any material operating
                                    change is subject to its sole discretion and includes deciding not to support any
                                    new digital currency, fork, or other actions. You acknowledge and accept the risks
                                    of operating changes to Digital Currency protocols and agree that Nami Exchange is
                                    not responsible for such operating changes and not liable for any loss of value you
                                    may experience as resulting from such changes in operating rules. You acknowledge
                                    and accept that Nami Exchange has sole discretion to determine its response to any
                                    operating change and that we have no responsibility to assist you with unsupported
                                    currencies or protocols.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.6 Digital Currency Custody and Title
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    All Digital Currencies held in your Digital Currency Wallet are custodial assets
                                    held by Nami Exchange for your benefit, as described in further detail below.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span className="text-dark font-weight-bold">2.6.1 Ownership.</span> You earn full
                                    ownership to your Digital Currency and shall not transfer to Nami Exchange. As the
                                    owner of Digital Currency in your Digital Wallet, you shall bear all risk of loss of
                                    such Digital Currency. Nami Exchange shall have no liability for Digital Currency
                                    fluctuations. None of the Digital Currencies in your Digital Currency Wallet are the
                                    property of, or shall or may be loaned to, Nami Exchange; Nami Exchange shall
                                    not treat assets in User’s Digital Currency Wallets as belonging to Nami Exchange.
                                    Nami Exchange may not grant a security interest in the Digital Currency held in
                                    your Digital Currency Wallet. Except as required by a facially valid court order, or
                                    except as provided herein, Nami Exchange will not sell, transfer, loan,
                                    hypothecate, or otherwise alienate Digital Currency in your Digital Currency Wallet
                                    without your request.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span className="text-dark font-weight-bold">2.6.2 Control.</span> You control the
                                    Digital Currencies held in your Digital Currency Wallet. At any time, subject to
                                    outages, downtime, and other applicable policies, you may withdraw your Digital
                                    Currency by sending it to a different blockchain address. As long as you continue to
                                    custody your Digital Currencies with Nami Exchange, Nami Exchange shall retain
                                    control over electronic private keys associated with blockchain addresses operated
                                    by Nami Exchange, including the blockchain addresses that hold your Digital
                                    Currency.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6 ml-1">
                                    <span
                                        className="text-dark font-weight-bold"
                                    >2.6.3 Acknowledgement of Risk.
                                    </span> You
                                    acknowledge that Digital Currency may not be subject to protections or insurance
                                    provided by some certain countries’ state bank and financial regulator.
                                </div>
                                <div className="font-semibold mb-5">
                                    2.7 USDT & VNDC Wallets
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You may also elect to buy USD Tether and VND Coin from Nami Exchange. You are the
                                    owner of the balance of your Wallet. Nami Exchange is not the issuer of USDT and
                                    VNDC, does not hold U.S. Dollars in reserve for USDT & VNDC holders, and has no
                                    obligation to repurchase your USDT for USD and VNDC for VND. You can redeem your
                                    USDT with Tether, and Nami Exchange may also elect to repurchase your USDT in
                                    exchange for USD and VNDC for VND.
                                </div>
                            </div>
                            <div className="section-3 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    3. Payment Services, Purchase & Sale Transactions, Credit Transactions
                                </div>
                                <div className="font-semibold mb-5">
                                    3.1. USDT & VNDC Funds
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You can load funds into your USDT & VNDC Wallet from a wire transfer of on-chain
                                    sending of your USDT & VNDC. Your balance is in a pending state and will not be
                                    credited to your Wallet until after the wire transfer has been cleared, usually
                                    within 1 business day. We may debit your linked account as soon as you initiate
                                    payment. The name on your linked account and your wire transfer must match the name
                                    verified on your Nami Exchange Account.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.2. Transactions on the Nami Exchange Site.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange acts as the agent, transacting on your behalf, to facilitate that
                                    purchase or sale between you and other Nami Exchange customers. When you purchase
                                    (buy) or sell Digital Currency on the Nami Exchange Site, you are not buying
                                    Digital Currency from Nami Exchange or selling Digital Currency to Nami
                                    Exchange. Your purchase of Digital Currency shall be processed using Digital
                                    Currency held in certain Digital Currency Wallets, as permitted by Nami Exchange.
                                    Your purchase has to comply with the relevant instructions as given on the Nami
                                    Exchange Site. Nami Exchange reserves the right to cancel any transaction not
                                    confirmed by you within five (5) seconds after Nami Exchange quotes a transaction
                                    price. We will initiate your purchase of Digital Currency using a Valid Payment
                                    Method on the business day we receive your instructions. As soon as funds have
                                    settled to Nami Exchange Purchased Digital Currency will be deposited in your
                                    Digital Currency Wallet, which may take up to five business days in the case of a
                                    bank account or credit or debit card. Digital Currency purchases and sales are
                                    collectively referred to herein as “Digital Currency Transactions”. If your Digital
                                    Currency Transaction cannot be completed for any reason (such as price movement,
                                    market latency, inability to find a counterparty for your transaction, or order
                                    size), Nami Exchange will reject the order and notify you of such rejection. You
                                    will not be charged for a rejected transaction.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.3. Fees
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    In general, Nami Exchange makes money when you purchase or sell digital currency
                                    on our Site. A full list of our service fees for your Nami Exchange Account can be
                                    found on our Pricing and Fees Disclosures. By using Nami Exchange Services you
                                    agree to pay all applicable fees. Nami Exchange reserves the right to adjust its
                                    pricing and fees and any applicable waivers at any time. You will always be notified
                                    of the pricing and fees which apply to your transaction when you authorize the
                                    transaction and in each receipt, we issue to you. We may charge network fees (miner
                                    fees) to process a Digital Currency Transaction on your behalf. Although we will
                                    always notify you of the network fee at or before the time you authorize the Digital
                                    Currency Transaction, the calculation of the network fee is kept to our discretion.
                                    Bank fees charged to Nami Exchange are netted out of transfers to or from Nami
                                    Exchange. You are responsible for paying any additional fees charged by your
                                    financial service provider. We will not process a transfer if associated bank fees
                                    exceed the value of the transfer. There might be a requirement for additional
                                    deposit to cover bank fees if you desire to complete such a transfer.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.4. Recurring Digital Currency Transactions
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If you initiate recurring Digital Currency Transactions, you authorize us to
                                    initiate recurring electronic payments in accordance with your selected Digital
                                    Currency Transaction and any corresponding payment accounts, until either you or
                                    Nami Exchange cancels the recurring order. This authorization will remain in full
                                    force and effect until you change your recurring transaction settings, or until you
                                    provide us written notification at <a href="https://nami.exchange" target="_blank" rel="noreferrer" />.
                                    Before the recurring transaction, you agree to notify Nami Exchange in writing of
                                    any changes in your linked bank account information. Nami Exchange may, at any
                                    time, terminate recurring transactions by providing notice to you.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.5. Revocation
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Unless your purchase is not scheduled to occur until a future date, When you cannot
                                    withdraw your consent to a Digital Currency purchase that you gave instructions to.
                                    e.g., you set up a recurring purchase of Digital Currency (a "Future Transaction").
                                    In the case of a Future Transaction, you may withdraw your consent up until the end
                                    of the business day before the date that the Future Transaction is scheduled to take
                                    place. To withdraw your consent to a Future Transaction, follow the instructions on
                                    the Nami Exchange Site.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.6. Unauthorized and Incorrect Transactions
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Unless having been notified, we will assume that you have authorized the Digital
                                    Currency transaction to occur using your credentials. In case of a non-authorized
                                    particular transaction or if a transaction was incorrectly carried out, you must
                                    contact us as soon as possible either by email or by phone (contact information is
                                    provided via our official site). It is important that you regularly check your
                                    Digital Currency Wallet balances and your transaction history regularly to ensure
                                    you notify us as soon as possible of any unauthorized or incorrect transactions. We
                                    are not responsible for any claim for unauthorized or incorrect transactions unless
                                    you have notified us in accordance with this section.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.7. Account Information
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Using the Nami Exchange site, you will be able to see your USD Wallet and Digital
                                    Currency Wallet balances. You can also see your transaction history using the Nami
                                    Exchange Site, including (i) the amount (and currency) of each Digital Currency
                                    Transaction, (ii) a reference to the identify of the payer and/or payee (as
                                    appropriate), (iii) any fees charged (excluding any spread, or margin, over the
                                    prevailing market rate on Nami Exchange’s trading platform), (iv) if applicable,
                                    the rate of exchange, and the amount (in the new currency) after exchange (where you
                                    are the payer) or the amount (in the original currency) before the exchange (where
                                    you are the payee), and (v) the date of each Digital Currency Transaction.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.8. Consent to access, processing and storage of your personal data
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You consent to us accessing, processing and retaining any personal information you
                                    provide for the purpose of us providing Nami Exchange Services to you. This
                                    consent is not related to, and does not affect, any rights or obligations we or you
                                    have in accordance with data protection laws, privacy laws and regulations. By
                                    closing your Nami account, you can withdraw your consent at any time. However, we
                                    may retain and continue to process your personal information for other purposes.
                                    Please see our Privacy Policy for further information about how we process your
                                    personal data, and the rights you have in respect of this.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.9. Reversals & Cancellations
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Transactions that are marked as complete or pending cannot be canceled, reversed, or
                                    changed. If your payment is not successful, if your payment method has insufficient
                                    funds, or if you reverse a payment made from funds in your bank account, you
                                    authorize Nami Exchange, in its sole discretion, either to cancel the transaction
                                    or to debit your other payment methods, in any amount necessary to complete the
                                    transaction. You are responsible for maintaining an adequate balance and/or
                                    sufficient credit limits to avoid overdraft, non-sufficient funds (NSF), or similar
                                    fees charged by your payment provider. If we suspect the transaction involves (or
                                    has a high risk of involvement in) money laundering, terrorist financing, fraud, or
                                    any other type of financial crime, we reserve the right to refuse to process, or to
                                    cancel or reverse, any Digital Currency Transaction or Transfers in our sole
                                    discretion, even after funds have been debited from your account(s); in response to
                                    a subpoena, court order, or other government order; if we reasonably suspect that
                                    the transaction is erroneous; or if Nami Exchange suspects the transaction relates
                                    to Prohibited Use or a Prohibited Business as set forth below. In such instances,
                                    Nami Exchange will reverse the transaction and we are under no obligation to allow
                                    you to reinstate a purchase or sale order at the same price or on the same terms as
                                    the cancelled transaction.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.10. Payment Services Partners
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange may use a third-party payment processor to process any payment
                                    between you and Nami Exchange, including but not limited to payments in relation
                                    to your use of the Digital Currency Transactions or Nami Exchange Account.
                                </div>
                            </div>
                            <div className="section-4 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    4. Digital Currency Transfers
                                </div>
                                <div className="font-semibold mb-5">
                                    4.1. In General
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Once you have sufficiently verified your identity, you shall be able to to send
                                    Supported Digital Currency to, and request, receive, and store Supported Digital
                                    Currency from, third parties by giving instructions through the Nami Exchange
                                    Site. Your transfer of Supported Digital Currencies between your other digital
                                    currency wallets (including wallets off the Nami Exchange Site) and to and from
                                    third parties is a “Digital Currency Transfer”.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.2. Inbound Digital Currency Transfers
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    The person initiating the transaction which includes the sending or receiving
                                    between you or a third party from an external wallet not hosted on Nami Exchange
                                    to a Nami Exchange Wallet (“Inbound Transfers”), is solely responsible for
                                    executing the transaction properly, which may include, among other things, payment
                                    of sufficient network or miner’s fees in order for the transaction to be successful.
                                    An Inbound Transfer shall remain in a pending state outside of Nami Exchange’s
                                    control due to insufficient network fees and we are not responsible for delays or
                                    loss incurred as a result of an error in the initiation of the transaction and have
                                    no obligation to assist in the remediation of such transactions. By initiating an
                                    Inbound Transfer, you attest that you are transacting in a Supported Digital
                                    Currency which conforms to the particular Nami Exchange wallet into which funds
                                    are directed. For example, if you select an Ethereum wallet address to receive
                                    funds, you attest that you are initiating an Inbound Transfer of Ethereum alone, and
                                    not any other currency such as Bitcoin or Ethereum Classic. Nami Exchange incurs
                                    no obligation whatsoever with regard to unsupported digital currency sent to a
                                    Nami Exchange Account or Supported Digital Currency sent to an incompatible
                                    Digital Currency wallet. Transmitted funds that are errored will be lost. We
                                    recommend customers send a small amount of Supported Digital Currency as a test
                                    before initiating a send of a significant amount of Supported Digital Currency.
                                    Nami Exchange may from time to time determine types of Digital Currency that will
                                    be supported or cease to be supported.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.3. Outbound Digital Currency Transfers
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    When you send Digital Currency from your Nami Exchange Account to an external
                                    wallet (“Outbound Transfers”), such transfers are executed at your instruction by
                                    Nami Exchange. You should verify all transaction information prior to submitting
                                    instructions to us. Nami Exchange shall bear no liability or responsibility in the
                                    event you enter an incorrect blockchain destination address. We do not guarantee the
                                    identity or value received by a recipient of an Outbound Transfer. Digital Currency
                                    Transfers cannot be reversed once they have been broadcast to the relevant Digital
                                    Currency network, although they may be in a pending state, and designated
                                    accordingly, while the transaction is processed by network operators. Nami
                                    Exchange does not control the Digital Currency network and makes no guarantees that
                                    a Digital Currency Transfer will be confirmed by the network. We may refuse to
                                    process or cancel any pending Outbound Digital Currency Transfers as required by law
                                    or any court or other authority to which Nami Exchange is subject in any
                                    jurisdiction. Additionally, we may require you to wait some amount of time after
                                    completion of a transaction before permitting you to use further Nami Exchange
                                    Services and/or before permitting you to engage in transactions beyond certain
                                    volume limits.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.4. Pending Transactions
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Once a Digital Currency Transfer is submitted to a Digital Currency network, the
                                    transaction will be unconfirmed and remain in a pending state for a period of time
                                    sufficient to confirmation of the transaction by the Digital Currency network. A
                                    Digital Currency Transfer is not complete while it is in a pending state. Pending
                                    Digital Currency Transfers that are initiated from an Nami Exchange Account will
                                    reflect a pending transaction status and are not available to you for use on the
                                    Nami Exchange platform or otherwise while the transaction is pending.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.5. Transfers to a Recipient Email Address
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange enables you to implement a Digital Currency Transfer to a Nami
                                    Exchange customer by designating that customer’s email address. If you initiate a
                                    Digital Currency Transfer to an email address whose owner does not have an existing
                                    Nami Exchange Account, we will invite the recipient to open an Nami Exchange
                                    Account. If the recipient does not open an Nami Exchange Account within 30 days,
                                    we will return the relevant Digital Currency to your Digital Currency Wallet.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.6. Debts
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    In the event that there are outstanding amounts owed to us hereunder, including in
                                    your Nami Exchange Account, Nami Exchange reserves the right to debit your
                                    Nami Exchange Account accordingly and/or to withhold amounts from funds you may
                                    transfer from your Nami Exchange.
                                </div>
                                <div className="font-semibold mb-5">
                                    4.7. Third Party Merchants
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We have no control over, or liability for, the delivery, quality, safety, legality
                                    or any other aspect of any goods or services that you may purchase from a third
                                    party (including other users of Nami Exchange Digital Currency Services). We are
                                    not responsible for ensuring that a third-party buyer or a seller you transact with
                                    will complete the transaction or is authorised to do so. If you experience a problem
                                    with any goods or services purchased from, or sold to, a third party using Digital
                                    Currency transferred using the Nami Exchange Digital Currency Services, or if you
                                    have a dispute with such third party, you should resolve the dispute directly with
                                    that third party. If you believe a third party has behaved in a fraudulent,
                                    misleading, or inappropriate manner, or if you cannot adequately resolve a dispute
                                    with a third party, you may notify Nami Exchange Support at <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a> so that we may
                                    consider what action to take, if any.
                                </div>
                            </div>
                            <div className="section-5 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    5. Data Protection and Security
                                </div>
                                <div className="font-semibold mb-5">
                                    5.1. Security Breach
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If you suspect that your Nami Exchange Account or any of your security details
                                    have been compromised or if you become aware of any fraud or attempted fraud or any
                                    other security incident (including a cyber-security attack) affecting you and / or
                                    Nami Exchange (together a "Security Breach"), you must notify Nami Exchange
                                    Support as soon as possible by email free of charge at <a
                                        href="https://nami.exchange"
                                    >https://nami.exchange
                                    </a> and continue to provide accurate and
                                    up to date information throughout the duration of the Security Breach. You must take
                                    any steps that we reasonably require to reduce, manage or report any Security
                                    Breach. Failure to provide prompt notification of any Security Breach may be taken
                                    into account in our determination of the appropriate resolution of the matter.
                                </div>
                                <div className="font-semibold mb-5">
                                    5.2. Personal Data
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You acknowledge that we may process personal data in relation to you (if you are an
                                    individual), and personal data that you have provided or in the future provide to us
                                    in relation to your employees and other associated or other individuals, in
                                    connection with this Agreement, or the Nami Exchange Services. Accordingly, you
                                    represent and warrant that: (i) your disclosure to us of any personal data relating
                                    to individuals other than yourself was or will be made in accordance with all
                                    applicable data protection and data privacy laws, and those data are accurate, up to
                                    date and relevant when disclosed; (ii) before providing any such personal data to
                                    us, you have read and understood our Privacy Policy, and, in the case of personal
                                    data relating to an individual other than yourself, have (or will at the time of
                                    disclosure have) provided a copy of that Privacy Policy (as amended from time to
                                    time), to that individual; and (iii) if from time to time we provide you with a
                                    replacement version of the Privacy Policy, you will promptly read that notice and
                                    provide a copy to any individual whose personal data you have provided to us.
                                </div>
                            </div>
                            <div className="section-6 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    6. General Use, Prohibited Use, Death of Account Holder and Termination
                                </div>
                                <div className="font-semibold mb-5">
                                    6.1. Website Accuracy
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Although we intend to provide accurate and timely information on the Nami Exchange
                                    Site, the Nami Exchange Site (including, without limitation, the Content) may not
                                    always be entirely accurate, completed or updated and may also include technical
                                    inaccuracies or typographical errors. Information may be changed or updated from
                                    time to time without notice, including without limitation information regarding our
                                    policies, products and services to continue providing you with as complete and
                                    accurate information as possible. All decisions based on information contained on
                                    the Nami Exchange Site are your sole responsibility and we shall have no liability
                                    for such decisions. Therefore, you should verify all information before relying on
                                    it. Information provided by third parties, including historical price and supply
                                    data for Digital Currencies, is for informational purposes only and Nami Exchange
                                    makes no representations or warranties to its accuracy. Links to third-party
                                    materials (including without limitation websites) may be provided as a convenience
                                    but are not controlled by us. You acknowledge and agree that we are not responsible
                                    for any aspect of the information, content, or services contained in any third-party
                                    materials or on any third-party sites accessible or linked to the Nami Exchange
                                    Site.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.2. Limited License
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We grant you a limited, nonexclusive, nontransferable license, subject to the terms
                                    of this Agreement, to access and use the Nami Exchange Services, Nami Exchange
                                    Site, and related content, materials, information (collectively, the "Content")
                                    solely for purposes approved by Nami Exchange from time to time. Any use of the
                                    Nami Exchange Site or Content of other purposes is expressly prohibited and all
                                    other right, title, and interest in the Nami Exchange Services, Nami Exchange
                                    Site or Content is exclusively the property of Nami Exchange and its licensors.
                                    You agree you will not copy, transmit, distribute, sell, license, reverse engineer,
                                    modify, publish, or participate in the transfer or sale of, create derivative works
                                    from, or in any other way exploit any of the Content, in whole or in part without
                                    the prior written consent of Nami Exchange. "attlas.io", "Nami Exchange", and
                                    all logos related to the Nami Exchange Services or displayed on the Nami
                                    Exchange Site are either trademarks or registered marks of Nami Exchange or its
                                    licensors. You may not copy, imitate or use them without Nami Exchange's prior
                                    written consent
                                </div>
                                <div className="font-semibold mb-5">
                                    6.3. Prohibited Use.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    In connection with your use of the Nami Exchange Services, and your interactions
                                    with other users, and third parties you agree and represent you will not engage in
                                    any Prohibited Business or Prohibited Use defined herein. We reserve the right at
                                    all times to monitor, review, retain and/or disclose any information as necessary to
                                    satisfy any applicable law, regulation, sanctions programs, legal process or
                                    governmental request. We reserve the right to cancel and/or suspend your Nami
                                    Exchange Account(s) and/or block transactions or freeze funds immediately and
                                    without notice if we determine, in our sole discretion, that your Account is
                                    associated with a Prohibited Use and/or a Prohibited Business.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.4. Transaction Limit
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    The use of all Nami Exchange Services is subject to a limit on the amount of
                                    volume, stated in U.S. Dollar terms, you may transact or transfer in a given period
                                    (e.g., daily). To view your limits, login to your Nami Exchange Account. Your
                                    transaction limits may vary depending on your payment method, verification steps you
                                    have completed, and other factors. Nami Exchange reserves the right to change
                                    applicable limits as we deem necessary in our sole discretion. If you wish to raise
                                    your limits beyond the posted amounts, you may submit a request at <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a>. We may require you
                                    to submit additional information about yourself or your business, provide records,
                                    and arrange for meetings with Nami Exchange staff (such process, "Enhanced Due
                                    Diligence"). Nami Exchange reserves the right to charge you costs and fees
                                    associated with Enhanced Due Diligence, provided that we notify you in advance of
                                    any such charges accruing. In our sole discretion, we may refuse to raise your
                                    limits, or we may lower your limits at a subsequent time even if you have completed
                                    Enhanced Due Diligence.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.5. Promotions
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    From time to time, Nami Exchange may make available special offers or conduct
                                    promotions for qualifying customers. Subject to applicable laws, Nami Exchange or
                                    the issuer of a Digital Currency subject to an offer or promotion may establish
                                    qualifying criteria to participate in any special promotion of its sole discretion.
                                    Nami Exchange may revoke any special offer at any time without notice. Once
                                    Digital Currency has been deposited in a user’s Digital Currency Wallet, that
                                    Digital Currency becomes the property of the Nami Exchange user with all
                                    applicable property rights, including those noted in Section 2.2 of this Agreement.
                                    Nami Exchange shall have no obligation to make special offers available to all
                                    customers. Nami Exchange makes no recommendation and does not provide any advice
                                    about the value or utility of any Digital Currency subject to a promotion.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.6. Third-Party Applicationsv
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If, to the extent permitted by Nami Exchange from time to time, you grant express
                                    permission to a third party to access or connect to your Nami Exchange Account(s),
                                    either through the third party's product or service or through the Nami Exchange
                                    Site, you acknowledge that granting permission to a third party to take specific
                                    actions on your behalf does not relieve you of any of your responsibilities under
                                    this Agreement. You are fully responsible for all acts or omissions of any third
                                    party with access to your Nami Exchange Account(s). Further, you acknowledge and
                                    agree that you will not hold Nami Exchange responsible for, and will indemnify
                                    Nami Exchange from, any liability arising out of or related to any act or omission
                                    of any third party with access to your Nami Exchange Account(s). You may change or
                                    remove permissions granted by you to third parties with respect to your Nami
                                    Exchange Account(s) at any time through the tabs on the Account Settings page on the
                                    Nami Exchange Site.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.7. Transaction Limits
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    The use of all Nami Exchange Services is subject to a limit on the amount of
                                    volume, stated in Digital Currency terms, you may transact or transfer in a given
                                    period (e.g., daily). Your transaction limits may vary depending on your payment
                                    method, verification steps you have completed, and other factors. Nami Exchange
                                    reserves the right to change applicable limits as we deem necessary in our sole
                                    discretion. If you wish to raise your limits beyond the posted amounts, you may
                                    submit a request at <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a>. We may require you to
                                    submit additional information about yourself or your business, provide records, and
                                    arrange for meetings with Nami Exchange staff (such process, "Enhanced Due
                                    Diligence"). Nami Exchange reserves the right to charge you costs and fees
                                    associated with Enhanced Due Diligence, provided that we notify you in advance of
                                    any such charges accruing. In our sole discretion, we may refuse to raise your
                                    limits, or we may lower your limits at a subsequent time even if you have completed
                                    Enhanced Due Diligence.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.8. Death of Account Holder
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    For security reasons, if we receive legal documentation confirming your death or
                                    other information leading us to believe you have died, we will freeze your Nami
                                    Exchange Account and during this time, no transactions may be completed until:(i)
                                    your designated fiduciary has opened a new Nami Exchange Account, as further
                                    described below, and the entirety of your Nami Exchange Account has been
                                    transferred to such new account, or (ii) we have received proof in a form
                                    satisfactory to us that you have not died. If we have reason to believe you may have
                                    died but we do not have proof of your death in a form satisfactory to us, you
                                    authorize us to make inquiries, whether directly or through third parties, that we
                                    consider necessary to ascertain whether you have died. Upon receipt by us of proof
                                    satisfactory to us that you have died, the fiduciary you have designated in a valid
                                    Will or similar testamentary document will be required to open a new Nami Exchange
                                    Account. If you have not designated a fiduciary, then we reserve the right to (i)
                                    treat as your fiduciary any person entitled to inherit your Nami Exchange Account,
                                    as determined by us upon receipt and review of the documentation we, in our sole and
                                    absolute discretion, deem necessary or appropriate, including (but not limited to) a
                                    Will, a living trust or a Small Estate Affidavit, or (ii) require an order
                                    designating a fiduciary from a court having competent jurisdiction over your estate.
                                    In the event we determine, in our sole and absolute discretion, that there is
                                    uncertainty regarding the validity of the fiduciary designation, we reserve the
                                    right to require an order resolving such issue from a court of competent
                                    jurisdiction before taking any action relating to your Nami Exchange Account.
                                    Pursuant to the above, the opening of a new Nami Exchange Account by a designated
                                    fiduciary is mandatory following the death of a Nami Exchange Account owner, and
                                    you hereby agree that your fiduciary will be required to open a new Nami Exchange
                                    Account and provide the information required under Section 2 of this Agreement in
                                    order to gain access to the contents of your Nami Exchange Account.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.9. Suspension, Termination, and Cancellation
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange may: (a) suspend, restrict, or terminate your access to any or all
                                    of the Nami Exchange Services, and/or (b) deactivate or cancel your Nami
                                    Exchange Account(s) if: (i) We are so required by a facially valid subpoena, court
                                    order, or binding order of a government authority; (ii) We reasonably suspect you of
                                    using your Nami Exchange Account(s) in connection with a Prohibited Use or
                                    Business; (iii) Use of your Nami Exchange Account(s) is subject to any pending
                                    litigation, investigation, or government proceeding and/or we perceive a heightened
                                    risk of legal or regulatory non-compliance associated with your Account activity;
                                    (iv) Our service partners are unable to support your use; (v) You take any action
                                    that Nami Exchange deems as circumventing Nami Exchange's controls, including,
                                    but not limited to, opening multiple Nami Exchange Accounts or abusing promotions
                                    which Nami Exchange may offer from time to time. <br />
                                    If Nami Exchange suspends or closes your account, or terminates your use of Nami
                                    Exchange Services for any reason, we will provide you with notice of our actions
                                    unless a court order or other legal process prohibits Nami Exchange from providing
                                    you with such notice. You acknowledge that Nami Exchange's decision to take
                                    certain actions, including limiting access to, suspending, or closing your account,
                                    may be based on confidential criteria that are essential to Nami Exchange's risk
                                    management and security protocols. You agree that Nami Exchange is under no
                                    obligation to disclose the details of its risk management and security procedures to
                                    you.<br />
                                    You will be permitted to transfer Digital Currency for ninety (90) days after
                                    Account deactivation or cancellation unless such transfer is otherwise prohibited
                                    (i) under the law, including but not limited to applicable sanctions programs, or
                                    (ii) by a facially valid subpoena or court order. You may cancel your Nami
                                    Exchange Account(s) at any time by withdrawing all balances. You will not be charged
                                    for canceling your Nami Exchange Account(s), although you will be required to pay
                                    any outstanding amounts owed to Nami Exchange. You authorize us to cancel or
                                    suspend any pending transactions at the time of cancellation.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.10. Relationship of the Parties
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange may: (a) suspend, restrict, or terminate your access to any or all
                                    of the Nami Exchange Services, and/or (b) deactivate or cancel your Nami
                                    Exchange Account(s) if: (i) We are so required by a facially valid subpoena, court
                                    order, or binding order of a government authority; (ii) We reasonably suspect you of
                                    using your Nami Exchange Account(s) in connection with a Prohibited Use or
                                    Business; (iii) Use of your Nami Exchange Account(s) is subject to any pending
                                    litigation, investigation, or government proceeding and/or we perceive a heightened
                                    risk of legal or regulatory non-compliance associated with your Account activity;
                                    (iv) Our service partners are unable to support your use; (v) You take any action
                                    that Nami Exchange deems as circumventing Nami Exchange's controls, including,
                                    but not limited to, opening multiple Nami Exchange Accounts or abusing promotions
                                    which Nami Exchange may offer from time to time. <br />
                                    If Nami Exchange suspends or closes your account, or terminates your use of Nami
                                    Exchange Services for any reason, we will provide you with notice of our actions
                                    unless a court order or other legal process prohibits Nami Exchange from providing
                                    you with such notice. You acknowledge that Nami Exchange's decision to take
                                    certain actions, including limiting access to, suspending, or closing your account,
                                    may be based on confidential criteria that are essential to Nami Exchange's risk
                                    management and security protocols. You agree that Nami Exchange is under no
                                    obligation to disclose the details of its risk management and security procedures to
                                    you.<br />
                                    You will be permitted to transfer Digital Currency for ninety (90) days after
                                    Account deactivation or cancellation unless such transfer is otherwise prohibited
                                    (i) under the law, including but not limited to applicable sanctions programs, or
                                    (ii) by a facially valid subpoena or court order. You may cancel your Nami
                                    Exchange Account(s) at any time by withdrawing all balances. You will not be charged
                                    for canceling your Nami Exchange Account(s), although you will be required to pay
                                    any outstanding amounts owed to Nami Exchange. You authorize us to cancel or
                                    suspend any pending transactions at the time of cancellation.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.11. Unclaimed Property
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If Nami Exchange is holding funds (whether fiat currency or Digital Currency) in
                                    your account, and Nami Exchange is unable to contact you and has no record of your
                                    use of the Services for several years, applicable law may require Nami Exchange to
                                    report these funds (including fiat currency and Digital Currency) as unclaimed
                                    property to the applicable jurisdiction. If this occurs, Nami Exchange will try to
                                    locate you at the address shown in our records, but if Nami Exchange is unable to
                                    locate you, it may be required to deliver any such funds to the applicable state or
                                    jurisdiction as unclaimed property.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.12. Password Security; Contact Information
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You are responsible for creating a strong password and maintaining adequate security
                                    and control of any and all IDs, passwords, hints, personal identification numbers
                                    (PINs), API keys or any other codes that you use to access the Nami Exchange
                                    Services. Any loss or compromise of the foregoing information and/or your personal
                                    information may result in unauthorized access to your Nami Exchange Account(s) by
                                    third-parties and the loss or theft of any Digital Currency and/or funds held in
                                    your Nami Exchange Account(s) and any associated accounts, including your linked
                                    bank account(s) and credit card(s). You are responsible for keeping your email
                                    address and telephone number up to date in your Account Profile in order to receive
                                    any notices or alerts that we may send you. You should never allow remote access or
                                    share your computer screen with someone else when you are logged on to your Nami
                                    Exchange Account. Nami Exchange will never under any circumstances ask you for
                                    your IDs, passwords, or 2-factor authentication codes. We assume no responsibility
                                    for any loss that you may sustain due to compromise of account login credentials due
                                    to no fault of Nami Exchange and/or failure to follow or act on any notices or
                                    alerts that we may send to you. In the event you believe your Nami Exchange
                                    Account(s) information has been compromised, contact Nami Exchange Support
                                    immediately at <a href="https://nami.exchange" target="_blank" rel="noreferrer">https://nami.exchange,</a> or
                                    report your claim by phone.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.13. Privacy of Others
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Marketing. If you receive information about another user through the Nami Exchange
                                    Services, you must keep the information confidential and only use it in connection
                                    with the Nami Exchange Services. You may not disclose or distribute a user's
                                    information to a third party or use the information except as reasonably necessary
                                    to effectuate a transaction and other functions reasonably incidental thereto such
                                    as support, reconciliation and accounting unless you receive the user's express
                                    consent to do so. You may not send unsolicited email to a user through the Nami
                                    Exchange Services.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.14. No Investment Advice or Brokerag
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    For the avoidance of doubt, Nami Exchange does not provide investment, tax, or
                                    legal advice, nor does Nami Exchange broker trades on your behalf. All Nami
                                    Exchange trades are executed automatically, based on the parameters of your order
                                    instructions and in accordance with posted Trade execution procedures, and you are
                                    solely responsible for determining whether any investment, investment strategy or
                                    related transaction is appropriate for you based on your personal investment
                                    objectives, financial circumstances and risk tolerance. You should consult your
                                    legal or tax professional regarding your specific situation. Nami Exchange may
                                    provide educational information about Supported Digital Currency, as well as Digital
                                    Currency not supported by Nami Exchange, in order to assist users in learning more
                                    about such Digital Currency. Information may include, but is not limited to, blog
                                    posts, articles, links to third-party content, news feeds, tutorials, and videos.
                                    The information provided on this website or any third-party sites does not
                                    constitute investment advice, financial advice, trading advice, or any other sort of
                                    advice, and you should not treat any of the website's content as such. Nami
                                    Exchange does not recommend that any Digital Currency should be bought, earned,
                                    sold, or held by you. Before making the decision to buy, sell or hold any Digital
                                    Currency, you should conduct your own due diligence and consult your financial
                                    advisors before making any investment decision. Nami Exchange will not be held
                                    responsible for the decisions you make to buy, sell, or hold Digital Currency based
                                    on the information provided by Nami Exchange.
                                </div>
                                <div className="font-semibold mb-5">
                                    6.15. Taxes
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    It is your sole responsibility to determine whether, and to what extent, any taxes
                                    apply to any transactions you conduct through the Nami Exchange Services, and to
                                    withhold, collect, report and remit the correct amounts of taxes to the appropriate
                                    tax authorities. Your transaction history is available through your Nami Exchange
                                    Account(s).
                                </div>
                            </div>
                            <div className="section-7 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    7. Customer Feedback, Queries, Complaints, and Dispute Resolution
                                </div>
                                <div className="font-semibold mb-5">
                                    7.1. Contact Nami Exchang
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If you have feedback, or general questions, contact us via our Customer Support
                                    webpage at https://nami.exchange. When you contact us please provide us with your name,
                                    address, and any other information we may need to identify you, your Nami Exchange
                                    Account(s), and the transaction on which you have feedback or questions.<br />If you
                                    believe your account has been compromised, you may also report your claim by calling
                                    our support hotline. Nami Exchange requires that all legal documents (including
                                    civil subpoenas, complaints, and small claims) be served on our registered agent for
                                    service of process.
                                </div>
                                <div className="font-semibold mb-5">
                                    7.2. Formal Complaint Process
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If you have a dispute with Nami Exchange (a “Complaint”), you agree to contact
                                    Nami Exchange through our support team to attempt to resolve any such dispute
                                    amicably. If we cannot resolve the dispute through the Nami Exchange support team,
                                    you and we agree to use the Formal Complaint Process set forth below. You agree to
                                    use this process before filing any arbitration claim or small claims action. If you
                                    do not follow the procedures set out in this Section before filing an arbitration
                                    claim or suit in small claims court, we shall have the right to ask the arbitrator
                                    or small claims court to dismiss your filing unless and until you complete the
                                    following steps.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span className="text-dark font-weight-bold">7.2.1. Procedural Steps.</span> In the
                                    event that your dispute with Nami Exchange is not resolved through your contact
                                    with Nami Exchange Support, you agree to use our Complaint form to describe your
                                    Complaint, how you would like us to resolve the Complaint, and any other information
                                    related to your dispute that you believe to be relevant. The Complaint form can be
                                    found on the Nami Exchange support pages, <a
                                        href="https://nami.exchange"
                                        target="_blank"
                                        rel="noreferrer"
                                    >https://nami.exchange
                                    </a> or
                                    can be requested from Nami Exchange Customer Support.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span
                                        className="text-dark font-weight-bold"
                                    >7.2.2. Nami Exchange Response.
                                    </span> We
                                    will acknowledge receipt of your Complaint form after you submit it. A Nami
                                    Exchange customer relations agent ("Agent") will review your Complaint. The Agent
                                    will evaluate your Complaint based on the information you have provided and
                                    information in the possession of Nami Exchange. Within 15 business days of our
                                    receipt of your Complaint form, the Agent will address the issues raised in your
                                    Complaint form by sending you an e-mail ("Resolution Notice") in which the Agent
                                    will: (i) offer to resolve your complaint in the way you requested; (ii) make a
                                    determination rejecting your Complaint and set out the reasons for the rejection; or
                                    (iii) offer to resolve your Complaint with an alternative solution. In exceptional
                                    circumstances, if the Agent is unable to respond to your Complaint within 15
                                    business days for reasons beyond Nami Exchange's control, the Agent will send you
                                    a communication indicating the reasons for any delay in answering your Complaint,
                                    and specifying the deadline by which the Agent will respond to your Complaint, which
                                    will be no later than 35 business days from our receipt of your Complaint form.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-4 ml-1">
                                    <span className="text-dark font-weight-bold">7.2.3. Arbitration; Waiver of Class Action.</span> If
                                    we cannot resolve the dispute through the Formal Complaint Process, you and we agree
                                    that any dispute arising out of or relating to this Agreement or the Nami Exchange
                                    Services, including, without limitation, federal and state statutory claims, common
                                    law claims, and those based in contract, tort, fraud, misrepresentation, or any
                                    other legal theory, shall be resolved through binding arbitration, on an individual
                                    basis (the “Arbitration Agreement”). Subject to applicable jurisdictional
                                    requirements, you may elect to pursue your claim in your local small claims court
                                    rather than through arbitration so long as your matter remains in small claims court
                                    and proceeds only on an individual (non-class and non-representative) basis.<br />
                                    This Arbitration Agreement includes, without limitation, disputes arising out of or
                                    related to the interpretation or application of the Arbitration Agreement, including
                                    the enforceability, revocability, scope, or validity of the Arbitration Agreement or
                                    any portion of the Arbitration Agreement. All such matters shall be decided by an
                                    arbitrator and not by a court or judge.<br />
                                    CLASS ACTION WAIVER: TO THE EXTENT PERMISSIBLE BY LAW, ALL CLAIMS MUST BE BROUGHT IN
                                    A PARTY’S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
                                    PURPORTED CLASS, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING (COLLECTIVELY
                                    “CLASS ACTION WAIVER”). THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S
                                    CLAIMS OR ENGAGE IN ANY CLASS ARBITRATION. YOU ACKNOWLEDGE THAT, BY AGREEING TO
                                    THESE TERMS, YOU AND Nami Exchange ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY
                                    AND THE RIGHT TO PARTICIPATE IN A CLASS ACTION.<br />
                                    The arbitration will be conducted by a single, neutral arbitrator and shall take
                                    place in the county or parish in which you reside, or another mutually agreeable
                                    location, in the English language. The arbitrator may award any relief that a court
                                    of competent jurisdiction could award and the arbitral decision may be enforced in
                                    any court. An arbitrator’s decision and judgment thereon will not have a
                                    precedential or collateral estoppel effect. At your request, hearings may be
                                    conducted in person or by telephone and the arbitrator may provide for submitting
                                    and determining motions on briefs, without oral hearings. To the extent permitted by
                                    law, the prevailing party in any action or proceeding to enforce this Agreement, any
                                    arbitration pursuant to this Agreement, or any small claims action shall be entitled
                                    to costs and attorneys' fees. If the arbitrator or arbitration administrator would
                                    impose filing fees or other administrative costs on you, we will reimburse you, upon
                                    request, to the extent such fees or costs would exceed those that you would
                                    otherwise have to pay if you were proceeding instead in a court. We will also pay
                                    additional fees or costs if required to do so by the arbitration administrator's
                                    rules or applicable law.
                                </div>
                            </div>
                            <div className="section-8 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    8. General Provisions
                                </div>
                                <div className="font-semibold mb-5">
                                    8.1. Computer Viruses
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We shall not bear any liability, whatsoever, for any damage or interruptions caused
                                    by any computer viruses or other malicious code that may affect your computer or
                                    other equipment, or any phishing, spoofing or other attack. We advise the regular
                                    use of a reputable and readily available virus screening and prevention software.
                                    You should also be aware that SMS and email services are vulnerable to spoofing and
                                    phishing attacks and should use care in reviewing messages purporting to originate
                                    from Nami Exchange. Always log into your Nami Exchange Account(s) through the
                                    Nami Exchange Site to review any transactions or required actions if you have any
                                    uncertainty regarding the authenticity of any communication or notice.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.2. Release of Nami Exchange; Indemnification.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If you have a dispute with one or more users of the Nami Exchange Services, you
                                    release Nami Exchange, its affiliates and service providers, and each of their
                                    respective officers, directors, agents, joint venturers, employees and
                                    representatives from any and all claims, demands and damages (actual and
                                    consequential) of every kind and nature arising out of or in any way connected with
                                    such disputes. You agree to indemnify and hold Nami Exchange, its affiliates and
                                    Service Providers, and each of its or their respective officers, directors, agents,
                                    joint venturers, employees and representatives, harmless from any claim or demand
                                    (including attorneys' fees and any fines, fees or penalties imposed by any
                                    regulatory authority) arising out of or related to your breach of this Agreement or
                                    your violation of any law, rule or regulation, or the rights of any third party.<br />Nami
                                    Exchange makes no representations about the accuracy, order, timeliness or
                                    completeness of historical Digital Currency price data available on the Nami
                                    Exchange Site. Nami Exchange will make reasonable efforts to ensure that requests
                                    for electronic debits and credits involving bank accounts, credit cards, and check
                                    issuances are processed in a timely manner but Nami Exchange makes no
                                    representations or warranties regarding the amount of time needed to complete
                                    processing which is dependent upon many factors outside of our control.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.3. Entire Agreement
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    This Agreement, the Privacy Policy, Content Disclosure Consent, and Appendices
                                    incorporated by reference herein comprise the entire understanding and agreement
                                    between you and Nami Exchange as to the subject matter hereof, and supersedes any
                                    and all prior discussions, agreements and understandings of any kind (including
                                    without limitation any prior versions of this Agreement), and every nature between
                                    and among you and Nami Exchange. Section headings in this Agreement are for
                                    convenience only and shall not govern the meaning or interpretation of any provision
                                    of this Agreement.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.4. Amendments
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We may amend or modify this Agreement by posting on the Nami Exchange Site or
                                    emailing to you the revised Agreement, and the revised Agreement shall be effective
                                    at such time. If you do not agree with any such modification, your sole and
                                    exclusive remedy is to terminate your use of the Services and close your account.
                                    You agree that we shall not be liable to you or any third party for any modification
                                    or termination of the Nami Exchange Services, or suspension or termination of your
                                    access to the Nami Exchange Services, except to the extent otherwise expressly set
                                    forth herein. If the revised Agreement includes a material change, we will endeavor
                                    to provide you advanced notice via our website and/or email before the material
                                    change becomes effective.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.5. Assignment
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Uou may not assign any rights and/or licenses granted under this Agreement. We
                                    reserve the right to assign our rights without restriction, including without
                                    limitation to any Nami Exchange affiliates or subsidiaries, or to any successor in
                                    interest of any business associated with the Nami Exchange Services. Any attempted
                                    transfer or assignment in violation hereof shall be null and void. Subject to the
                                    foregoing, this Agreement will bind and inure to the benefit of the parties, their
                                    successors and permitted assigns.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.6. Severability
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    If any provision of this Agreement shall be determined to be invalid or
                                    unenforceable under any rule, law, or regulation of any local, state, or federal
                                    government agency, such provision will be changed and interpreted to accomplish the
                                    objectives of the provision to the greatest extent possible under any applicable law
                                    and the validity or enforceability of any other provision of this Agreement shall
                                    not be affected.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.7. Change of Control
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    In the event that Nami Exchange is acquired by or merged with a third party
                                    entity, we reserve the right, in any of these circumstances, to transfer or assign
                                    the information we have collected from you as part of such merger, acquisition,
                                    sale, or other change of control.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.8. Survival
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    All provisions of this Agreement which by their nature extend beyond the expiration
                                    or termination of this Agreement, including, without limitation, sections pertaining
                                    to suspension or termination, Nami Exchange Account cancellation, debts owed to
                                    Nami Exchange, general use of the Nami Exchange Site, disputes with Nami
                                    Exchange, and general provisions, shall survive the termination or expiration of
                                    this Agreement.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.9. Suspension, Termination, and Cancellation
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange may: (a) suspend, restrict, or terminate your access to any or all
                                    of the Nami Exchange Services, and/or (b) deactivate or cancel your Nami
                                    Exchange Account(s) if: (i) We are so required by a facially valid subpoena, court
                                    order, or binding order of a government authority; (ii) We reasonably suspect you of
                                    using your Nami Exchange Account(s) in connection with a Prohibited Use or
                                    Business; (iii) Use of your Nami Exchange Account(s) is subject to any pending
                                    litigation, investigation, or government proceeding and/or we perceive a heightened
                                    risk of legal or regulatory non-compliance associated with your Account activity;
                                    (iv) Our service partners are unable to support your use; (v) You take any action
                                    that Nami Exchange deems as circumventing Nami Exchange's controls, including,
                                    but not limited to, opening multiple Nami Exchange Accounts or abusing promotions
                                    which Nami Exchange may offer from time to time. <br />
                                    If Nami Exchange suspends or closes your account, or terminates your use of Nami
                                    Exchange Services for any reason, we will provide you with notice of our actions
                                    unless a court order or other legal process prohibits Nami Exchange from providing
                                    you with such notice. You acknowledge that Nami Exchange's decision to take
                                    certain actions, including limiting access to, suspending, or closing your account,
                                    may be based on confidential criteria that are essential to Nami Exchange's risk
                                    management and security protocols. You agree that Nami Exchange is under no
                                    obligation to disclose the details of its risk management and security procedures to
                                    you.<br />
                                    You will be permitted to transfer Digital Currency for ninety (90) days after
                                    Account deactivation or cancellation unless such transfer is otherwise prohibited
                                    (i) under the law, including but not limited to applicable sanctions programs, or
                                    (ii) by a facially valid subpoena or court order. You may cancel your Nami
                                    Exchange Account(s) at any time by withdrawing all balances. You will not be charged
                                    for canceling your Nami Exchange Account(s), although you will be required to pay
                                    any outstanding amounts owed to Nami Exchange. You authorize us to cancel or
                                    suspend any pending transactions at the time of cancellation.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.10. Governing Law
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange may: (a) suspend, restrict, or terminate your access to any or all
                                    of the Nami Exchange Services, and/or (b) deactivate or cancel your Nami
                                    Exchange Account(s) if: (i) We are so required by a facially valid subpoena, court
                                    order, or binding order of a government authority; (ii) We reasonably suspect you of
                                    using your Nami Exchange Account(s) in connection with a Prohibited Use or
                                    Business; (iii) Use of your Nami Exchange Account(s) is subject to any pending
                                    litigation, investigation, or government proceeding and/or we perceive a heightened
                                    risk of legal or regulatory non-compliance associated with your Account activity;
                                    (iv) Our service partners are unable to support your use; (v) You take any action
                                    that Nami Exchange deems as circumventing Nami Exchange's controls, including,
                                    but not limited to, opening multiple Nami Exchange Accounts or abusing promotions
                                    which Nami Exchange may offer from time to time. <br />
                                    If Nami Exchange suspends or closes your account, or terminates your use of Nami
                                    Exchange Services for any reason, we will provide you with notice of our actions
                                    unless a court order or other legal process prohibits Nami Exchange from providing
                                    you with such notice. You acknowledge that Nami Exchange's decision to take
                                    certain actions, including limiting access to, suspending, or closing your account,
                                    may be based on confidential criteria that are essential to Nami Exchange's risk
                                    management and security protocols. You agree that Nami Exchange is under no
                                    obligation to disclose the details of its risk management and security procedures to
                                    you.<br />
                                    You will be permitted to transfer Digital Currency for ninety (90) days after
                                    Account deactivation or cancellation unless such transfer is otherwise prohibited
                                    (i) under the law, including but not limited to applicable sanctions programs, or
                                    (ii) by a facially valid subpoena or court order. You may cancel your Nami
                                    Exchange Account(s) at any time by withdrawing all balances. You will not be charged
                                    for canceling your Nami Exchange Account(s), although you will be required to pay
                                    any outstanding amounts owed to Nami Exchange. You authorize us to cancel or
                                    suspend any pending transactions at the time of cancellation.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.11. Unclaimed Property
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You agree that the laws of the State of California, without regard to principles of
                                    conflict of laws, will govern this Agreement and any claim or dispute that has
                                    arisen or may arise between you and Nami Exchange, except to the extent governed
                                    by federal law.
                                </div>
                                <div className="font-semibold mb-5">
                                    9.11. Force Majeure
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We shall not be liable for delays, failure in performance or interruption of service
                                    which result directly or indirectly from any cause or condition beyond our
                                    reasonable control, including but not limited to, significant market volatility, any
                                    delay or failure due to any act of God, act of civil or military authorities, act of
                                    terrorists, civil disturbance, war, strike or other labor dispute, fire,
                                    interruption in telecommunications or Internet services or network provider
                                    services, failure of equipment and/or software, other catastrophe or any other
                                    occurrence which is beyond our reasonable control and shall not affect the validity
                                    and enforceability of any remaining provisions.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.12. Non-Waiver of Rights
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    This agreement shall not be construed to waive rights that cannot be waived under
                                    applicable state money transmission laws in the state where you are located.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.13. No Investment Advice or Brokerag
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    For the avoidance of doubt, Nami Exchange does not provide investment, tax, or
                                    legal advice, nor does Nami Exchange broker trades on your behalf. All Nami
                                    Exchange trades are executed automatically, based on the parameters of your order
                                    instructions and in accordance with posted Trade execution procedures, and you are
                                    solely responsible for determining whether any investment, investment strategy or
                                    related transaction is appropriate for you based on your personal investment
                                    objectives, financial circumstances and risk tolerance. You should consult your
                                    legal or tax professional regarding your specific situation. Nami Exchange may
                                    provide educational information about Supported Digital Currency, as well as Digital
                                    Currency not supported by Nami Exchange, in order to assist users in learning more
                                    about such Digital Currency. Information may include, but is not limited to, blog
                                    posts, articles, links to third-party content, news feeds, tutorials, and videos.
                                    The information provided on this website or any third-party sites does not
                                    constitute investment advice, financial advice, trading advice, or any other sort of
                                    advice, and you should not treat any of the website's content as such. Nami
                                    Exchange does not recommend that any Digital Currency should be bought, earned,
                                    sold, or held by you. Before making the decision to buy, sell or hold any Digital
                                    Currency, you should conduct your own due diligence and consult your financial
                                    advisors before making any investment decision. Nami Exchange will not be held
                                    responsible for the decisions you make to buy, sell, or hold Digital Currency based
                                    on the information provided by Nami Exchange.
                                </div>
                                <div className="font-semibold mb-5">
                                    8.14 Taxes
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    It is your sole responsibility to determine whether, and to what extent, any taxes
                                    apply to any transactions you conduct through the Nami Exchange Services, and to
                                    withhold, collect, report and remit the correct amounts of taxes to the appropriate
                                    tax authorities. Your transaction history is available through your Nami Exchange
                                    Account(s).
                                </div>
                            </div>
                            <div className="text-lg font-semibold mb-5">
                                Part 2. Nami Exchange
                            </div>
                            <div className="section-1 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    1. Nami Exchange Accounts
                                </div>
                                <div className="font-semibold mb-5">
                                    1.1 Access to Nami Exchange
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Eligible users may establish an account at Nami Exchange (attlas.io), an order
                                    book exchange platform for Digital Currencies. Nami Exchange does not offer Nami
                                    Exchange to customers in all jurisdictions. This Part 2 of the User Agreement
                                    applies to you if you access Nami Exchange.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.2 Order Books
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange offers an order book for various Digital Currency and Fiat Currency
                                    trading pairs (each an 'Order Book'). Refer to your Nami Exchange account to
                                    determine which Order Books are available to you.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.3 Your Nami Exchange Account
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Your Nami Exchange Account consists of the following.
                                    <ul>
                                        <li>A dedicated Hosted Digital Currency Wallet for each Digital Currency offered
                                            on Nami Exchange.
                                        </li>
                                        <li>A dedicated Fiat Currency Wallet.</li>
                                        <li>Associated user tools, accessible atattlas.io and through Nami Exchange
                                            API.
                                        </li>
                                    </ul>
                                </div>
                                <div className="font-semibold mb-5">
                                    1.4 Deposits
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You may fund your Nami Exchange Account by depositing Digital Currency and/or Fiat
                                    Currency from your basic Nami Exchange Account, Bank Account or an external
                                    Digital Currency address into your Nami Exchange Account. Funds in your Nami
                                    Exchange Account can be used only to trade on Nami Exchange.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.5 Withdrawals
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    You may withdraw Digital Currency from your Nami Exchange Account by transfer to
                                    your basic Nami Exchange Account or to an external Digital Currency address. You
                                    may withdraw Fiat Currency from your Nami Exchange Account to your basic Nami
                                    Exchange Account or directly to your Bank Account.<br />ALL DEPOSITS AND WITHDRAWALS
                                    MAY BE SUBJECT TO LIMITS. ALL LIMITS WILL BE DISPLAYED IN YOUR Nami Exchange
                                    ACCOUNT.
                                </div>
                                <div className="font-semibold mb-5">
                                    1.6 Withdrawal Fees
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    Nami Exchange may also charge a fee on certain Fiat Currency deposit or withdrawal
                                    methods (e.g. bank wire). All such fees will be clearly displayed in your Nami
                                    Exchange Account.
                                </div>
                            </div>
                            <div className="section-2 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    2. Trading Rules and Trading Fees
                                </div>
                                <div className="font-semibold mb-5">
                                    2.1 Trading Rules.
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    By accessing Nami Exchange throughattlas.io or Nami Exchange API, you accept and
                                    agree to be bound by the Trading Rules
                                </div>
                                <div className="font-semibold mb-5">
                                    2.2 Trading Fees
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    By placing an order on Nami Exchange, you agree to pay all applicable fees and you
                                    authorize Nami Exchange to automatically deduct fees directly from your Nami
                                    Exchange Account. Trading Fees are set forth in the Trading Rules and
                                    <a href="https://nami.exchange/fees" target="_blank" rel="noreferrer">https://nami.exchange/fees</a>
                                </div>
                            </div>
                            <div className="section-3 pb-4">
                                <div className="text-lg font-semibold mb-5">
                                    3. General Use, Restrictions, and Cancellation
                                </div>
                                <div className="font-semibold mb-5">
                                    3.1. Trading Account Use
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    By using an Nami Exchange Account you agree and represent that you will use Nami
                                    Exchange only for yourself as Account owner, and not on behalf of any third party,
                                    unless you have obtained prior approval from Nami Exchange. You may not sell,
                                    lease, furnish or otherwise permit or provide access to your Trading Account to any
                                    other entity or to any individual that is not your employee or agent. You accept
                                    full responsibility for your employees' or agents' use of Nami Exchange, whether
                                    such use is directly through Nami Exchange website or by other means, such as
                                    those facilitated through API keys, and/or applications which you may authorize. You
                                    understand and agree that you are responsible for any and all orders, trades, and
                                    other instructions entered into Nami Exchange including identifiers, permissions,
                                    passwords, and security codes associated with your Nami Exchange Account.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.2. Suspension and Cancellation
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We may suspend your Nami Exchange Account or your access to any one for more Order
                                    Books in accordance with the User Agreement Account suspension and termination
                                    provisions. Suspension or termination of your Nami Exchange Account shall not
                                    affect the payment of fees or other amounts you owe to Nami Exchange. In the event
                                    that your Basic Nami Exchange Account is suspended or terminated, we will
                                    immediately cancel all open orders associated with your Nami Exchange Account,
                                    block all withdrawals and bar the placing of further orders until resolution or
                                    Account cancellation.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.3 No Warranty
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    We do not represent that Nami Exchange and/or its constituent Nami Exchange
                                    Accounts, APIs, and related services, will be available without interruption.
                                    Although we will strive to provide you with continuous operations, we do not
                                    guarantee continuous access or that there will be no delays, failures, errors,
                                    omissions or loss of transmitted information, nor do we guarantee that any order
                                    will be executed, accepted, recorded, or remain open. Nami Exchange reserves the
                                    right to cancel any open trades and/or suspend Nami Exchange activity in
                                    accordance with the Trading Rules.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.4 No Investment Advice or Brokerage
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    For the avoidance of doubt, Nami Exchange does not provide investment, tax, or
                                    legal advice, nor does Nami Exchange broker trades on your behalf. All Nami
                                    Exchange trades are executed automatically, based on the parameters of your order
                                    instructions and in accordance with posted Trade execution procedures, and you are
                                    solely responsible for determining whether any investment, investment strategy or
                                    related transaction is appropriate for you based on your personal investment
                                    objectives, financial circumstances and risk tolerance. You should consult your
                                    legal or tax professional regarding your specific situation.
                                </div>
                                <div className="font-semibold mb-5">
                                    3.5 Debts
                                </div>
                                <div className="text-black-600 font-size-h7 mb-6">
                                    In the event that there are outstanding amounts owed to us hereunder, including in
                                    your Nami Exchange Account, Nami Exchange reserves the right to debit your
                                    Nami Exchange Account accordingly and/or to withhold amounts from funds you may
                                    transfer from your Nami Exchange Account to your Nami Exchange Account.
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
        ...await serverSideTranslations(locale, ['footer', 'navbar']),
    },
});
export default Terms;
