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

const Title1 = styled.div.attrs({
    className: 'text-sm sm:text-[22px] sm:leading-[30px] font-semibold mt-12 mb-6 underline'
})``;

const Title2 = styled.div.attrs({
    className: 'text-sm sm:text-[22px] sm:leading-[30px] font-semibold mt-12 mb-6 sm:ml-4 md:ml-8 lg:ml-10'
})``;

const Title3 = styled.div.attrs({
    className: 'text-lg font-semibold my-6 sm:my-8 sm:ml-8 md:ml-16 lg:ml-20'
})``;

const Paragraph = styled.div.attrs({
    className: 'mt-4 sm:mt-6 text-justify'
})``;

const Strong = styled.span.attrs({
    className: 'font-semibold'
})``;

const Licences = () => {
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
            <MaldivesLayout>
                <div className={`nami-container bg-white dark:bg-dark my-20 policies-page max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-txtPrimary dark:text-txtPrimary-dark font-SF-Pro txtPri-2 text-left ${
                    width < WIDTH_MD ? 'pb-20' : 'pb-[120px]'
                }`}>
                    {language === 'en' && (
                        <div className="text-left">
                            <div
                                className={`w-full txtPri-4 pb-8 sm:pb-12 bg-white dark:bg-dark ${width < WIDTH_MD ? 'sticky top-0 pt-6' : 'pt-20'}`}>
                                Licenses and Other legal matters
                            </div>
                            <Title1>LICENSES</Title1>
                            <Paragraph>Nami Exchange strives to meet high legal standards globally, below is a list of our operating licenses, which will be continuously updated from time to time.</Paragraph>
                            <Title1>Europe</Title1>
                            <Title2> - Lithuania</Title2>
                            <Paragraph>
                                Nami Exchange UAB has been granted a <a className="text-teal underline" href="https://www.registrucentras.lt/jar/sarasai/vvko.php"> Virtual Asset Service Provider (VASP)</a> registration by the Registry of Legal Entities of the Republic of Lithuania and local Financial Intelligence Unit (FIU) (registration number 306215297). The registration enables Nami Exchange UAB to provide crypto asset exchange and custody services.
                            </Paragraph>
                            <Title1>OTHER LEGAL MATTERS</Title1>
                            <Title1>Restricted Jurisdictions</Title1>
                            <Paragraph>
                                Nami Exchange does not onboard or provide services to residents of Restricted Jurisdictions or corporate accounts of entities incorporated or doing business in Restricted Jurisdictions.
                                “Restricted Jurisdictions” include, but are not limited to the United States of America, Malaysia, Mainland China, Iran, North Korea, Cuba, Canada, Netherlands... Comprehensive rules related to restricted jurisdictions are available in the Nami Exchange <a className="text-teal underline" href="https://nami.exchange/terms-of-service">Terms of Service</a>
                                </Paragraph>
                            <Title1>KYC</Title1>
                            <Paragraph>
                                Nami Exchange requires mandatory KYC to be undertaken to onboard any users in order to comply with legal and regulatory obligations including, but not limited to, rules governing anti-money laundering, counter-terrorism financing and sanctions; Nami Exchange has been created and will continiously produce a number of educational resources to help users understand the KYC process, why it’s important and why we do it. These resources can be accessed <a className="text-teal underline" href="https://nami.exchange/support/faq/tutorials/how-to-complete-ekyc-on-nami-exchange">here</a>.
                            </Paragraph>
                            <Title1>Community Support</Title1>
                            <Paragraph>If you have any questions or complaints about Nami Exchange's products or services, please contact our community support team who will be able to assist you. They are staffed 24 hours a day, 7 days a week and strive to address your concerns as quickly as possible. Follow this <a className="text-teal underline" href="https://nami.exchange/support/faq/tutorials/contact-the-community-support">link</a> to learn how to contact them.</Paragraph>
                        </div>
                    )}
                    {language === 'vi' && (
                        <div className="text-left">
                            <div
                                className={`w-full txtPri-4 pb-8 sm:pb-12 bg-white dark:bg-dark ${width < WIDTH_MD ? 'sticky top-0 pt-6' : 'pt-20'}`}>
                                Giấy phép và Các vấn đề pháp lý khác
                            </div>
                            <Title1>GIẤY PHÉP</Title1>
                            <Paragraph>Nami Exchange luôn nỗ lực đáp ứng các tiêu chuẩn cao về pháp lý trên phạm vi toàn cầu,
                                dưới đây là danh sách các giấy phép hoạt động của chúng tôi, danh sách này sẽ được cập
                                nhật liên tục theo thời gian.</Paragraph>
                            <Title1>Châu Âu</Title1>
                            <Title2> - Lithuania</Title2>
                            <Paragraph>
                                Nami Exchange UAB đã được cấp phép là <a className="text-teal underline" href="https://www.registrucentras.lt/jar/sarasai/vvko.php">Nhà cung cấp dịch vụ tài sản ảo (VASP)</a> bởi Cơ
                                quan đăng ký pháp nhân của Cộng hòa Litva và Đơn vị tình báo tài chính (FIU) (số
                                đăng ký 306215297). Việc đăng ký cho phép Nami Exchange UAB cung cấp dịch vụ lưu ký
                                và trao đổi tài sản tiền điện tử.
                            </Paragraph>
                            <Title1>CÁC VẤN ĐỀ PHÁP LÝ KHÁC</Title1>
                            <Title1>Khu vực hạn chế</Title1>
                            <Paragraph>Nami Exchange không tham gia hoặc cung cấp dịch vụ cho cư dân của các Khu vực hạn chế hoặc tài khoản công ty của các thực thể được thành lập hoặc kinh doanh tại các Khu vực hạn chế.
                                “Khu vực hạn chế” bao gồm, nhưng không giới hạn ở Hoa Kỳ, Malaysia, Trung Quốc Đại lục, Iran, Bắc Triều Tiên, Cuba, Canada, Hà Lan... Vui lòng đọc thêm các quy tắc toàn diện liên quan đến các khu vực pháp lý bị hạn chế trong <a className="text-teal underline"
                                                                                                                                                                                                                                                                    href="https://nami.exchange/vi/terms-of-service">Thỏa thuận sử dụng dịch vụ</a> của Nami Exchange.</Paragraph>
                            <Title1>KYC</Title1>
                            <Paragraph>Nami Exchange yêu cầu KYC bắt buộc phải được thực hiện đối với bất kỳ người dùng nào để tuân thủ các nghĩa vụ pháp lý và quy định, bao gồm nhưng không giới hạn ở các quy tắc quản lý chống rửa tiền, chống tài trợ khủng bố và cấm vận. Nami Exchange đã và sẽ liên tục sản xuất các hướng dẫn, thông báo để giúp người dùng hiểu quy trình KYC, tại sao nó lại quan trọng và tại sao chúng tôi làm điều đó. Những tài liệu này có thể được truy cập ở <a className="text-teal underline" href="https://nami.exchange/vi/support/faq/chuc-nang-tai-khoan?group=xac-minh-danh-tinh-kyc">đây</a>.</Paragraph>
                            <Title1>Chăm sóc cộng đồng</Title1>
                            <Paragraph>Nếu bạn có bất kỳ câu hỏi hoặc khiếu nại nào về các sản phẩm hoặc dịch vụ của Nami Exchange, vui lòng liên hệ với nhóm chuyên viên chăm sóc cộng đồng của chúng tôi. Nhóm chăm sóc cộng đồng trực 24 giờ một ngày, 7 ngày một tuần và luôn cố gắng giải quyết các mối lo ngại của bạn nhanh nhất có thể. Truy cập đường dẫn <a className="text-teal underline" href="https://nami.exchange/vi/support/faq/huong-dan-chung/huong-dan-lien-he-ho-tro-vien">này</a> để tìm hiểu cách liên hệ nhóm Chăm sóc cộng đồng của Nami.</Paragraph>

                        </div>
                    )}

                </div>
            </MaldivesLayout>
        );
    };
    return <Content/>;
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['footer', 'navbar', 'common']))
    }
});
export default Licences;
