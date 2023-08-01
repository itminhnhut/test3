import { useCallback, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import Tooltip from 'components/common/Tooltip';

import { LIST_TIER, STATUS } from 'components/screens/NFT/Constants';

import classNames from 'classnames';
import styled from 'styled-components';

const NoData = dynamic(() => import('components/screens/NFT/Components/Page/NoData'), { ssr: false });
const NoResult = dynamic(() => import('components/screens/NFT/Components/Page/NoResult'), { ssr: false });

const CardItems = ({ listNFT, isOpen, grid, showCollection, wallet = false, isDark, noResult }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [listTooltip, setListTooltip] = useState([]);

    useEffect(() => {
        const arr = [];
        [...document.querySelectorAll('#listNFT p')].map((element, key) => {
            if (element?.clientWidth < element?.scrollWidth) {
                arr.push(key);
            }
        });
        setListTooltip(arr);
    }, [listNFT, grid]);

    const renderTitle = (item) => {
        if (wallet) {
            return (
                <div className="flex flex-row justify-between font-semibold text-base flex-wrap items-center">
                    <Link
                        href={{
                            pathname: '/nft',
                            query: { collection: item?.nft_collection }
                        }}
                    >
                        <div className="text-green-3 dark:text-green-2"> {item.nft_collection_name}</div>
                    </Link>
                    {grid === 4 && (
                        <WrapperStatus status={STATUS?.[item.status]?.key} className="h-7 py-1 px-4 rounded-[80px] text-sm">
                            {STATUS?.[item.status]?.[language]}
                        </WrapperStatus>
                    )}
                </div>
            );
        }
        return (
            <div className={classNames('text-green-3 dark:text-green-2 font-semibold', { '!text-sm': grid === 6, hidden: !showCollection })}>
                <Link
                    href={{
                        pathname: '/nft',
                        query: { collection: item?.nft_collection }
                    }}
                >
                    {item.nft_collection_name}
                </Link>
            </div>
        );
    };

    const renderItems = useCallback(() => {
        return listNFT?.map((item, key) => {
            const getTier = LIST_TIER.find((f) => f.active === item.tier);
            return (
                <Link href={wallet ? `NFT/${item._id}` : `nft/${item._id}`} key={`card_item_${item._id}_${item.name}`}>
                    <section
                        className={classNames('max-w-[394px] h-full shadow-card_light dark:shadow-popover bg-white dark:bg-dark-4 rounded-xl max-h-fit', {
                            'max-w-[189px]': grid === 6
                        })}
                        id={item._id}
                    >
                        <section className={classNames('max-h-[394px]', { 'max-h-[189px]': grid === 6 })}>
                            <img width={394} height={394} src={item.image} className="rounded-t-xl" />
                        </section>
                        <section className={classNames('h-auto mx-5 my-5', { '!mx-4 !my-4': grid === 6 })}>
                            {renderTitle(item)}
                            <Tooltip isV3 place="top" effect="solid" id={item?.name} className={classNames('max-w-[394px]', { 'max-w-[189px]': grid === 6 })} />
                            <p
                                data-tip={listTooltip?.includes(key) ? item?.name : ''}
                                data-for={item?.name}
                                className={classNames(
                                    ' text-gray-15 overflow-hidden whitespace-nowrap overflow-ellipsis dark:text-gray-4 font-semibold text-2xl mt-4',
                                    {
                                        '!text-base !mt-3': grid === 6
                                    }
                                )}
                            >
                                {item?.name}
                            </p>

                            <WrapperLevelItems
                                className={classNames('dark:text-gray-7 text-gray-1 flex flex-row gap-1 mt-1 text-base', {
                                    '!text-sm': grid === 6
                                })}
                                isDark={isDark}
                            >
                                <div>{t('nft:tier')}:</div>
                                <div className={getTier?.key}>{getTier?.name?.[language]}</div>
                            </WrapperLevelItems>
                            {grid === 6 && wallet && (
                                <WrapperStatus status={STATUS?.[item.status]?.key} className="h-7 w-max px-3 py-1 mt-3 rounded-[80px] text-sm">
                                    {STATUS?.[item.status]?.[language]}
                                </WrapperStatus>
                            )}
                        </section>
                    </section>
                </Link>
            );
        });
    }, [grid, listTooltip, listNFT, isDark]);

    const renderCard = () => {
        if (listNFT?.length > 0) {
            return (
                <WrapperItems
                    className={classNames('flex-row flex-wrap gap-4 grid grid-cols-2 cursor-pointer', {
                        'grid-cols-4': grid === 6,
                        'grid-cols-6': grid === 6 && !isOpen,
                        'grid-cols-3': grid === 4 && !isOpen
                    })}
                    isOpen={isOpen}
                    id="listNFT"
                >
                    {renderItems()}
                </WrapperItems>
            );
        }
        return noResult ? <NoResult /> : <NoData />;
    };
    return <>{renderCard()}</>;
};

export const WrapperStatus = styled.div.attrs(({ status }) => ({
    className: `${classNames(
        { 'text-green-3 dark:text-green-2 active': status === 'active' },
        { 'text-yellow-2 not_active': status === 'not_active' },
        { 'text-gray-1 dark:text-gray-7 bg-divider dark:bg-divider-dark': status === 'used' }
    )}`
}))`
    &.active {
        background-color: rgba(71, 204, 133, 0.1);
    }
    &.not_active {
        background-color: rgba(255, 198, 50, 0.15);
    }
`;

const WrapperItems = styled.section`
    // width: calc(100% - ${(props) => (props.isOpen ? '388px' : '0px')});
    height: fit-content;
`;

export const WrapperLevelItems = styled.div`
    .normal {
        color: ${(props) => (props.isDark ? 'rgb(226, 232, 240)' : 'rgb(30, 30, 30)')};
    }
    .rate {
        color: ${(props) => (props.isDark ? 'rgb(71, 204, 133)' : 'rgb(48, 191, 115)')};
    }
    .super {
        color: rgb(226, 167, 51);
    }
    .extremely {
        color: rgb(64, 152, 255);
    }
    .supreme {
        color: rgb(144, 125, 255);
    }
`;

export default CardItems;
