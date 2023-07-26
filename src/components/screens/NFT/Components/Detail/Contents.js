import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import { formatTime } from 'redux/actions/utils';

import { LIST_TIER, TABS } from 'components/screens/NFT/Filter';
import { WrapperLevelItems } from 'components/screens/NFT/ListFilter';
import { WrapperStatus } from 'components/screens/Wallet/NFT/index';

import classNames from 'classnames';
import styled from 'styled-components';

const STATUS = {
    0: { key: 'not_active', vi: 'Chưa kích hoạt', en: 'Not activated' },
    1: { key: 'active', vi: 'Đã kích hoạt', en: 'activated' },
    2: { key: 'used', vi: 'Đã sử dụng', en: 'used' }
};
const Contents = ({ detail, wallet }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderContent = () => {
        if (!detail?._id) return;

        const tier = LIST_TIER.find((item) => item.active === detail?.tier);
        const category = TABS.find((item) => item.value === detail?.category);
        const expired_time = detail?.expired_time ? formatTime(new Date(detail?.expired_time), 'HH:mm:ss dd/MM/yyyy') : '-';

        return (
            <WrapperContent>
                <section className="flex flex-row justify-between">
                    <h2 className="text-green-3 dark:text-green-2 font-semibold">
                        <Link
                            href={{
                                pathname: '/nft',
                                query: { collection: detail?.nft_collection, category: 'me' }
                            }}
                        >
                            {detail?.nft_collection_name}
                        </Link>
                    </h2>
                    <WrapperStatus status={STATUS?.[detail.status]?.key} className={classNames('h-7 py-1 px-4 rounded-[80px] text-sm', { hidden: !wallet })}>
                        {STATUS?.[detail.status]?.[language]}
                    </WrapperStatus>
                </section>
                <h3 className="font-semibold text-4xl text-gray-15 dark:text-gray-4 mt-[18px]">{detail?.name}</h3>
                <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                    <p>Cấp độ:</p>
                    <p className="rate">{tier?.name?.[language]}</p>
                </WrapperLevelItems>
                <div className="h-[1px] bg-divider dark:bg-divider-dark my-4" />
                <div className="flex flex-row">
                    <ul className="flex flex-row">
                        <li className="text-gray-1 dark:text-gray-7 mr-1">Loại:</li>
                        <li className="font-semibold text-gray-15 dark:text-gray-4">{category?.label}</li>
                    </ul>
                    <div className="flex mx-3 my-3 items-center w-1 h-1 rounded-full bg-gray-1 dark:bg-gray-7"></div>
                    <ul className="flex flex-row">
                        <li className="text-gray-1 dark:text-gray-7 mr-1">Thời hạn sử dụng:</li>
                        <li className="font-semibold text-gray-15 dark:text-gray-4">{expired_time}</li>
                    </ul>
                </div>
            </WrapperContent>
        );
    };

    return <>{renderContent()}</>;
};

const WrapperContent = styled.section.attrs(() => ({
    className: 'bg-divider dark:bg-dark-4 px-4 py-4 rounded-xl'
}))``;

Contents.defaultProps = {
    detail: {},
    wallet: false
};
export default Contents;
