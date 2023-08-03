import classNames from 'classnames';
import styled from 'styled-components';

const SkeletonCard = ({ grid, isOpen }) => {
    let total;
    if (isOpen) {
        total = grid === 6 ? 8 : 4;
    } else {
        total = grid === 6 ? 12 : 6;
    }
    const renderItems = () => {
        return [...Array(total).keys()].map((i) => {
            return (
                <WrapperSkeletonCard
                    role="status"
                    className={classNames('max-w-[394px] h-full shadow-card_light dark:shadow-popover bg-white dark:bg-dark-4 rounded-xl max-h-fit', {
                        'max-w-[189px]': grid === 6
                    })}
                    key={`skeleton-${grid}-card-${i}`}
                >
                    <div
                        className={classNames('flex items-center justify-center h-[394px] mb-4 bg-gray-3 rounded dark:bg-gray-7', {
                            'h-[189px]': grid === 6
                        })}
                    >
                        <svg
                            className="w-20 h-20 text-gray-2 dark:text-gray-6"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 20"
                        >
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        </svg>
                    </div>
                    <section className={classNames('h-auto mx-5 my-5', { '!mx-4 !my-4': grid === 6 })}>
                        <div className="h-2.5 bg-gray-2 rounded-full dark:bg-gray-7 w-full mb-4"></div>
                        <div className="h-2.5 bg-gray-2 rounded-full dark:bg-gray-7 w-3/12 mb-4 "></div>
                        <div className="h-2 bg-gray-2 rounded-full dark:bg-gray-7 w-5/12 mb-2.5"></div>
                        <div className="h-2 bg-gray-2 rounded-full dark:bg-gray-7 w-full mb-2.5"></div>
                    </section>
                </WrapperSkeletonCard>
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
                id="listNFT"
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

const WrapperSkeletonCard = styled.div`
    height: fit-content;
`;

export default SkeletonCard;
