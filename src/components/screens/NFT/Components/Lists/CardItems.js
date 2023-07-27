import { useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import useIsOverflow from 'hooks/useIsOverflow';

import Tooltip from 'components/common/Tooltip';

import { LIST_TIER, STATUS } from 'components/screens/NFT/Constants';

import classNames from 'classnames';
import styled from 'styled-components';

const CardItems = ({ listNFT, isOpen, grid, showCollection, wallet = false, isDark }) => {
    const {
        i18n: { language }
    } = useTranslation();

    const refText = useRef({});

    const renderTitle = (item) => {
        if (wallet) {
            return (
                <div className="flex flex-row justify-between font-semibold text-base flex-wrap">
                    <Link
                        href={{
                            pathname: '/nft',
                            query: { collection: item?.nft_collection, category: 'me' }
                        }}
                    >
                        <p className="text-green-3 dark:text-green-2"> {item.nft_collection_name}</p>
                    </Link>
                    <WrapperStatus status={STATUS?.[item.status]?.key} className="h-7 py-1 px-4 rounded-[80px] text-sm">
                        {STATUS?.[item.status]?.[language]}
                    </WrapperStatus>
                </div>
            );
        }
        return (
            <p className={classNames('text-green-3 dark:text-green-2 font-semibold', { '!text-sm': grid === 6, hidden: !showCollection })}>
                <Link
                    href={{
                        pathname: '/nft',
                        query: { collection: item?.nft_collection, category: 'all' }
                    }}
                >
                    {item.nft_collection_name}
                </Link>
            </p>
        );
    };

    const renderItems = () => {
        return (
            listNFT?.length > 0 &&
            listNFT?.map((item, key) => {
                const getTier = LIST_TIER.find((f) => f.active === item.tier);
                return (
                    <Link href={wallet ? `NFT/${item._id}` : `nft/${item._id}`} key={`card_item_${item._id}_${item.name}`}>
                        <section
                            className={classNames('max-w-[394px] h-full bg-dark-13 dark:bg-dark-4 rounded-xl max-h-fit', {
                                'max-w-[189px]': grid === 6
                            })}
                        >
                            <section className={classNames('max-h-[394px]', { 'max-h-[189px]': grid === 6 })}>
                                <Image width={394} height={394} src={item.image} sizes="100vw" />
                            </section>
                            <section className={classNames('h-auto mx-5 my-5', { '!mx-4 !my-4': grid === 6 })}>
                                {renderTitle(item)}
                                <Tooltip
                                    id={item?.name}
                                    place="top"
                                    effect="solid"
                                    isV3
                                    className={classNames('max-w-[394px]', { 'max-w-[189px]': grid === 6 })}
                                />
                                <p
                                    ref={(element) => (refText.current[key] = element)}
                                    // data-tip={useIsOverflow(refText, key) ? item?.name : item?.name}
                                    data-for={item.name}
                                    className={classNames(
                                        'text-gray-15 overflow-hidden whitespace-nowrap overflow-ellipsis dark:text-gray-4 font-semibold text-2xl mt-4',
                                        {
                                            '!text-base !mt-3': grid === 6
                                        }
                                    )}
                                >
                                    {item.name}
                                </p>
                                <WrapperLevelItems
                                    className={classNames('dark:text-gray-7 text-gray-1 flex flex-row gap-2 mt-1 text-base', {
                                        '!text-sm': grid === 6
                                    })}
                                >
                                    <p>Cấp độ:</p>
                                    <p className={getTier.key}>{getTier?.name?.[language]}</p>
                                </WrapperLevelItems>
                            </section>
                        </section>
                    </Link>
                );
            })
        );
    };

    return (
        <>
            <WrapperItems
                className={classNames('flex-row flex-wrap gap-4 grid grid-cols-2 cursor-pointer', {
                    'grid-cols-4': grid === 6,
                    'grid-cols-6': grid === 6 && !isOpen,
                    'grid-cols-3': grid === 4 && !isOpen
                })}
                isOpen={isOpen}
            >
                {renderItems()}
            </WrapperItems>
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

const WrapperItems = styled.section`
    width: calc(100% - ${(props) => (props.isOpen ? '388px' : '0px')});
    height: fit-content;
`;

export const WrapperLevelItems = styled.div`
    .normal {
        color: rgb(226, 232, 240);
    }
    .rate {
        color: rgb(71, 204, 133);
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
