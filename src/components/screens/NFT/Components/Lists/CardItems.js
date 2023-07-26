import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';

import { LIST_TIER } from 'components/screens/NFT/Constants';

import classNames from 'classnames';
import styled from 'styled-components';

const ListFilter = ({ listNFT, isOpen, grid, showCollection }) => {
    const {
        i18n: { language }
    } = useTranslation();
    const renderItems = () => {
        return (
            listNFT?.length > 0 &&
            listNFT?.map((item) => {
                const getTier = LIST_TIER.find((f) => f.active === item.tier);
                return (
                    <Link href={`nft/${item._id}`}>
                        <section
                            className={classNames('max-w-[394px] h-full bg-dark-13 dark:bg-dark-4 rounded-xl max-h-fit', {
                                'max-w-[189px]': grid === 6
                            })}
                        >
                            <section className={classNames('max-h-[394px]', { 'max-h-[189px]': grid === 6 })}>
                                <Image width={394} height={394} src={item.image} sizes="100vw" />
                            </section>
                            <section className={classNames('h-auto mx-5 my-5', { '!mx-4 !my-4': grid === 6 })}>
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

                                <p className={classNames('text-gray-15 dark:text-gray-4 font-semibold text-2xl mt-4', { '!text-base !mt-3': grid === 6 })}>
                                    {item.name}
                                </p>
                                <WrapperLevelItems
                                    className={classNames('dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base', { '!text-sm': grid === 6 })}
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

export default ListFilter;
