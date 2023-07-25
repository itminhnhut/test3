import { useState } from 'react';

import Image from 'next/image';

import classNames from 'classnames';
import styled from 'styled-components';

const ListFilter = ({ isOpen, grid }) => {
    const [isModal, setIsModal] = useState(false);

    const handleModal = () => setIsModal((prev) => !prev);

    const renderItems = () => {
        return Array(10)
            .fill(0)
            .map((i) => {
                return (
                    <Items
                        className={classNames('max-w-[394px] h-full bg-dark-13 dark:bg-dark-4 rounded-xl', {
                            'max-w-[189px]': grid === 6
                        })}
                        onClick={handleModal}
                    >
                        <section className={classNames('max-h-[394px]', { 'max-h-[189px]': grid === 6 })}>
                            <Image width={394} height={394} src="/images/nft/Banner-2.png" sizes="100vw" />
                        </section>
                        <section className="h-auto mx-4 my-4">
                            <p className="text-gray-15 dark:text-gray-4 font-semibold text-2xl">Whale</p>
                            <WrapperLevelItems className="dark:text-gray-7 text-gray-1 flex flex-row gap-2  mt-1 text-base">
                                <p>Cấp độ:</p>
                                <p className="rate">Siêu hiếm</p>
                            </WrapperLevelItems>
                        </section>
                    </Items>
                );
            });
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
    .extremely: {
        color: rgb (64, 152, 255);
    }
    .supreme: {
        color: rgb (144, 125, 255);
    }
`;

const Items = styled.section`
    // width: calc(50% - 8px);
`;

export default ListFilter;
