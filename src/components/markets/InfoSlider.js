import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import classNames from 'classnames';
import useWindowSize from 'hooks/useWindowSize';

const InfoSlider = ({ forceUpdateState, children, gutter = 12, className, containerClassName }) => {
    const [rightControllable, setRightControllable] = useState(false);
    const [leftControllable, setLeftControllable] = useState(false);
    const { width } = useWindowSize();

    let scrollStepSize = 80;
    const containerRef = useRef();
    const ref = useRef();

    // Action
    const onScroll = (scrollStep) =>
        ref?.current?.scrollTo({
            left: ref.current?.scrollLeft + scrollStep,
            behavior: 'smooth'
        });

    // Helper
    const watchingScrollPosition = () => {
        const position = ref.current?.scrollLeft || 0;
        position <= 0 ? setLeftControllable(false) : setLeftControllable(true);

        const isMaxScroll = ref?.current?.offsetWidth + position >= ref.current?.scrollWidth - 1;
        if (isMaxScroll) {
            position >= gutter ? setRightControllable(false) : setRightControllable(true);
        } else {
            setRightControllable(true);
        }
    };

    const recheckSize = () => {
        const scaleButOverflow = ref.current.scrollWidth + 18 * 2 > containerRef?.current?.clientWidth - 8;
        setRightControllable(scaleButOverflow);
    };

    useEffect(() => {
        recheckSize();
    }, [width, children]);

    useEffect(() => {
        // recheckSize();
        const childNodes = ref.current?.childNodes;

        if (childNodes?.length && ref.current?.scrollWidth !== undefined) {
            // Create scroll step size
            scrollStepSize = ref.current?.scrollWidth / childNodes.length;
        }

        // On scroll handling
        ref?.current?.addEventListener('scroll', watchingScrollPosition);

        return () => ref?.current?.removeEventListener('scroll', watchingScrollPosition);
    }, []);

    // useEffect(() => {
    //     if (ref?.current?.scrollWidth) {
    //         console.log('ref.current.scrollWidth: ', ref.current.scrollWidth);
    //         console.log('containerRef?.current?.clientWidth: ', containerRef?.current?.clientWidth, containerRef?.current?.clientWidth - gutter);

    //         const position = ref.current?.scrollLeft || 0;
    //         position <= 0 ? setLeftControllable(false) : setLeftControllable(true);

    //         const isMaxScroll = ref?.current?.offsetWidth + position >= ref.current?.scrollWidth - 1;

    //         console.log('isMaxScroll: ', isMaxScroll);
    //         if (ref.current.scrollWidth <= containerRef?.current?.clientWidth - gutter || isMaxScroll) {
    //             setRightControllable(false);
    //         } else {
    //             setRightControllable(true);
    //         }
    //     }
    // }, [forceUpdateState, gutter]);

    return (
        <div ref={containerRef} className={classNames('flex items-center overflow-hidden h-full px-2 w-full', className)}>
            <div
                onClick={() => onScroll(-scrollStepSize)}
                className={classNames(`pr-[2px] h-full items-center justify-center flex pointer-events-auto cursor-pointer hover:text-dominant`, {
                    'invisible pointer-events-none': !leftControllable
                })}
            >
                <ChevronLeft color="#8694B3" size={16} />
            </div>
            <div ref={ref} className={classNames('flex items-center overflow-x-auto no-scrollbar', containerClassName)}>
                {children}
            </div>
            <div
                onClick={() => onScroll(scrollStepSize)}
                className={classNames('pl-[2px] h-full items-center justify-end flex pointer-events-auto cursor-pointer hover:text-dominant ', {
                    'invisible pointer-events-none': !rightControllable
                })}
            >
                <ChevronRight color="#8694B3" size={16} />
            </div>
        </div>
    );
};

export default InfoSlider;
