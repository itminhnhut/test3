import { PORTAL_MODAL_ID } from '../../../constants/constants';
import { X } from 'react-feather';

import classNames from 'classnames';
import Portal from 'components/hoc/Portal';
import hexRgb from 'utils/hexRgb';
import colors from '../../../styles/colors';

const Modal = ({
    isVisible,
    title,
    children = null,
    containerClassName = '',
    useCross = false,
    onBackdropCb,
    onClose,
    onusMode = false,
    containerStyle
}) => {
    return (
        <Portal portalId={PORTAL_MODAL_ID}>
            <div
                className={classNames(
                    'absolute top-0 left-0 w-full h-full overflow-hidden',
                    { invisible: !isVisible },
                    { visible: isVisible }
                )}
            >
                <div
                    onClick={() => onBackdropCb && onBackdropCb()}
                    style={{
                        backgroundColor: hexRgb(colors.darkBlue2, {
                            alpha: 0.7,
                            format: 'rgba',
                        }),
                    }}
                    className={classNames(
                        'absolute z-[9999999] top-0 left-0 w-full h-full transition-opacity duration-200',
                        { 'visible opacity-100': isVisible },
                        { 'invisible opacity-0': !isVisible }
                    )}
                />
                <div style={containerStyle}
                    className={classNames(
                        'fixed top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[280px] min-h-[100px] p-4 z-[99999999] rounded-lg dark:drop-shadow-dark',
                        {'bg-bgPrimary dark:bg-darkBlue-2 dark:border dark:border-teal-opacity': !onusMode},
                        {'bg-onus-bgModal': onusMode},
                        containerClassName
                    )}
                >
                    <div className='relative'>
                        {useCross && (
                            <div className='absolute top-0 right-0'>
                                <div
                                    className='w-24 h-24 flex-center hover:bg-gray-3 dark:hover:bg-darkBlue-4 rounded-md cursor-pointer'
                                    onClick={() => onClose && onClose()}
                                >
                                    <X />
                                </div>
                            </div>
                        )}
                    </div>
                    {title && (
                        <div className='my-2 text-center font-bold text-[18px]'>
                            {title}
                        </div>
                    )}
                    {children}
                </div>
            </div>
        </Portal>
    )
}

export default Modal
