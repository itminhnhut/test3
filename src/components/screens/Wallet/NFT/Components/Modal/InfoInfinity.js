import { X } from 'react-feather';

import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';

const POST_INFINITY_EN = 'https://nami.exchange/support/announcement/nami-news/officially-launching-nami-infinity-digital-asset-collection-site';
const POST_INFINITY_VI =
    'https://nami.exchange/vi/support/announcement/tin-tuc-ve-nami/chinh-thuc-ra-mat-nami-infinity-trang-tong-hop-cac-bo-suu-tap-tai-san-so';

const CONTENT_INFO_INFINITY = [
    {
        title: { vi: 'Skynamia Badges là gì?', en: 'What is Skynamia Badges?' },
        des: {
            vi: 'Skynamia Badge (SB) là các thẻ quyền lợi nhỏ, có thể sử dụng nhiều lần, được tạo ra nhằm mang lại lợi ích cho người dùng trong quá trình trải nghiệm các tính năng trên Nami Exchange. Các SB không thể chuyển nhượng cho những tài khoản khác.',
            en: 'Skynamia Badge (SB) are lesser, reusable benefits cards created to benefit users while experiencing many features on Nami Exchange. SBs are not transferable to other accounts.'
        }
    },
    {
        title: { vi: 'WNFT là gì?', en: 'What is WNFT?' },
        des: {
            vi: 'Wrapped NFT (WNFT) là một loại tài sản số nhằm hỗ trợ và mang lại nhiều quyền lợi đặc biệt cho người dùng trong quá trình trải nghiệm sản phẩm của Nami Exchange. Tùy thuộc tính được quy định mà các WNFT có thể được dùng để chuyển nhượng cho những tài khoản khác trên sàn Nami Exchange.',
            en: "Nami's Wrapped NFT (WNFT) is a type of digital asset to support and bring many special packages of benefits to users when using products and services of Nami Exchange. Depending on the specified properties, WNFTs can be transferred to other users of Nami Exchange."
        }
    }
];

const ModalInfoInfinity = ({ open, onClose }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    return (
        <ModalV2
            isVisible={open}
            onBackdropCb={onClose}
            className="!max-w-[488px] bg-[#ffffff] dark:bg-dark-dark border-divider dark:border-divider-dark"
            wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </div>
                </div>
            )}
        >
            <div className="text-2xl dark:text-gray-4 text-gray-15 font-semibold">Nami Infinity</div>
            {CONTENT_INFO_INFINITY?.map((value) => {
                return (
                    <section className="mt-6">
                        <div className=" dark:text-gray-4 text-gray-15 font-semibold">{value.title?.[language]}</div>
                        <div className="dark:text-gray-7 text-gray-1 mt-2">{value.des?.[language]}</div>
                    </section>
                );
            })}

            <Link href={language === 'vi' ? POST_INFINITY_VI : POST_INFINITY_EN} passHref>
                <a target="_blank" rel="noopener noreferrer">
                    <ButtonV2 className="mt-10" variants="text">
                        {t('nft:read_more')}
                    </ButtonV2>
                </a>
            </Link>
        </ModalV2>
    );
};
export default ModalInfoInfinity;
