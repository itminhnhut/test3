import { useState } from 'react';
import { Search } from 'react-feather';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import Chip from 'components/common/V2/Chip';
import InputV2 from 'components/common/V2/InputV2';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';

import { WrapperLevelItems } from 'components/screens/NFT/ListFilter';

import { NoResultIcon } from 'components/svg/SvgIcon';

import classNames from 'classnames';
import styled from 'styled-components';

const initState = {
    wallet: 'WNFT',
    search: ''
};

const NFTWallet = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [filter, setFilter] = useState(initState);

    const handleChangeWallet = (wallet) => {
        setFilter((prev) => ({ ...prev, wallet }));
    };

    const handleChangInput = (search) => {
        setFilter((prev) => ({ ...prev, search }));
    };

    const handleCategory = () => {
        ret;
    };

    const renderItems = () => {
        return Array(10)
            .fill(0)
            .map((i) => {
                return (
                    <article className="max-w-[394px] h-full bg-dark-13 dark:bg-dark-4 rounded-xl">
                        <section className="max-h-[394px]">
                            <Image width={394} height={394} src="/images/nft/Banner-2.png" sizes="100vw" />
                        </section>
                        <section className="h-auto mx-5 my-5">
                            <div className="flex flex-row justify-between font-semibold text-base">
                                <Link href="/nft?collection=22222">
                                    <p className="text-green-3 dark:text-green-2">Ocean Eye</p>
                                </Link>
                                <WrapperStatus status="expired" className="h-7 py-1 px-4 rounded-[80px]  text-sm">
                                    Đã kích hoạt
                                </WrapperStatus>
                            </div>
                            <p className="text-gray-15 dark:text-gray-4 font-semibold text-2xl overflow-ellipsis mt-4 overflow-hidden whitespace-nowrap">
                                Dolphin In The Ocean Of The Nami
                            </p>
                            <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                                <p>Cấp độ:</p>
                                <p className="rate">Siêu hiếm</p>
                            </WrapperLevelItems>
                        </section>
                    </article>
                );
            });
    };

    return (
        <>
            <section className="flex flex-row justify-between">
                <section className="flex flex-row gap-3  text-gray-1 dark:text-gray-7 text-sm">
                    <WrapperChip className="h-9" onClick={() => handleChangeWallet('WNFT')} active={filter.wallet === 'WNFT'}>
                        WNFT (3)
                    </WrapperChip>
                    <WrapperChip className="h-9" onClick={() => handleChangeWallet('Voucher')} active={filter.wallet === 'Voucher'}>
                        Voucher (3)
                    </WrapperChip>
                </section>
                <section>
                    <InputV2
                        allowClear
                        className="w-[368px]"
                        value={filter.search}
                        placeholder="Tìm kiếm Token"
                        onChange={(value) => handleChangInput(value)}
                        prefix={<Search strokeWidth={2} className="text-gray-1 w-4 h-4" />}
                    />
                </section>
            </section>
            <section className="mt-8 gap-4 grid grid-cols-3 cursor-pointer">{renderItems()}</section>
            {/* <div className="flex items-center justify-center flex-col m-auto pt-20">
                <div className="block dark:hidden">
                    <NoDataLightIcon />
                </div>
                <div className="hidden dark:block">
                    <NoDataDarkIcon />
                </div>
                <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">Bạn hiện không có NFT</div>
            </div>
            <div className="flex items-center justify-center flex-col m-auto pt-20">
                <NoResultIcon />
                <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">Không tìm thấy kết quả</div>
            </div> */}
        </>
    );
};

export const WrapperStatus = styled.div.attrs(({ status }) => ({
    className: `${classNames(
        { 'text-green-3 dark:text-green-2 active': status === 'active' },
        { 'text-yellow-2 active': status === 'not_active' },
        { 'text-green-1 dark:text-gray-7 bg-divider dark:bg-divider-dark': status === 'used' }
    )}`
}))`
    &.active {
        background-color: rgba(71, 204, 133, 0.1);
    }
    &.not_active {
        background-color: rgba(255, 198, 50, 0.15);
    }
`;

const WrapperChip = styled(Chip).attrs(({ active }) => ({
    className: `${classNames({ 'dark:!text-green-2 !text-green-3 font-semibold active': active })}`
}))`
    &.active {
        background-color: rgba(71, 204, 133, 0.1) !important;
    }
`;

export default NFTWallet;
