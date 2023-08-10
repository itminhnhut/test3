import Spinner from 'components/svg/Spinner';

import classNames from 'classnames';
import styled from 'styled-components';

const SkeletonCard = ({ grid, isOpen, isDark }) => {
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
                    className={classNames('max-w-[394px] h-full bg-gray-13 dark:bg-dark-4 rounded-xl max-h-fit', {
                        'max-w-[189px]': grid === 6
                    })}
                    key={`skeleton-${grid}-card-${i}`}
                >
                    <div
                        className={classNames(
                            'flex items-center justify-center text-txtPrimary dark:text-txtPrimary-dark h-[394px] bg-dark-12 rounded dark:bg-dark-2',
                            {
                                'h-[189px]': grid === 6
                            }
                        )}
                    >
                        <Spinner color="currentColor" />
                    </div>
                    <section className={classNames('h-auto mx-5 my-5', { '!mx-4 !my-4': grid === 6 })}>
                        <WrapperRectangle className={classNames('line1', { isDark: isDark })} />
                        <WrapperRectangle className={classNames('line2 mt-5', { isDark: isDark })} />
                        <div className="flex flex-row !mt-[14px]">
                            <WrapperRectangle className={classNames('line3', { isDark: isDark })} />
                            <WrapperRectangle className={classNames('line4', { isDark: isDark })} />
                        </div>
                        <WrapperRectangle className={classNames('line5 mt-6 ml-3', { isDark: isDark })} />
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

const WrapperRectangle = styled.section`
    &.line1 {
        width: 60px;
        height: 12.3px;
        border-radius: 17.5px;
        background-image: linear-gradient(to right, #dfdfdf 3%, rgba(255, 255, 255, 0) 100%);
        &.isDark {
            background-image: linear-gradient(to right, #1c232e 7%, rgba(28, 35, 46, 0) 107%);
        }
    }
    &.line2 {
        width: 148px;
        height: 14px;
        border-radius: 20px;
        background-image: linear-gradient(to right, #dfdfdf 0%, rgba(255, 255, 255, 0) 100%);
        &.isDark {
            background-image: linear-gradient(to right, #1c232e 0%, rgba(28, 35, 46, 0) 100%);
        }
    }
    &.line3 {
        width: 39px;
        height: 12.3px;
        border-radius: 17.5px;
        background-image: linear-gradient(to right, #dfdfdf 3%, rgba(255, 255, 255, 0) 100%);
        &.isDark {
            background-image: linear-gradient(to right, #1c232e 3%, rgba(28, 35, 46, 0) 100%);
        }
    }
    &.line4 {
        width: 59px;
        height: 12.3px;
        margin: 0 0 0 17px;
        border-radius: 17.5px;
        background-image: linear-gradient(to right, #dfdfdf 0%, rgba(255, 255, 255, 0) 96%);
        &.isDark {
            background-image: linear-gradient(to right, #1c232e 0%, rgba(28, 35, 46, 0) 96%);
        }
    }
    &.line5 {
        width: 59px;
        height: 10.5px;
        border-radius: 15px;
        background-image: linear-gradient(to right, #dfdfdf 3%, rgba(255, 255, 255, 0) 97%);
        &.isDark {
            background-image: linear-gradient(to right, #1c232e 3%, rgba(28, 35, 46, 0) 97%);
        }
    }
`;

export default SkeletonCard;
