import { useTranslation } from 'next-i18next'
import Portal from 'components/hoc/Portal'
import classNames from 'classnames'
import Market from 'components/screens/Mobile/Market/Market'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
function useOutsideAlerter(ref, cb) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event, cb) {
            if (ref.current && !ref.current.contains(event.target)) {
                cb()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", (event)=> handleClickOutside(event, cb));
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, cb]);
}


const ModelMarketMobile = ({ visible, onClose }) => {
    const router = useRouter()
    const { t } = useTranslation(['common'])
    const wrapperRef = useRef(null);

    const handleOutside = ()=>{
        
        if(visible && onClose){
            console.log('__ check click outside');
            onClose()
        }
    }
    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    useEffect(() => {
        onClose()
    }, [router])

  

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex flex-col absolute top-0 left-0 h-full w-full z-[20] bg-onus/80',
                    { visible, invisible: !visible }
                )}
            >
                <div ref={wrapperRef} className='flex-1 w-10/12 min-h-0 '>
                    <Market isRealtime={true} />
                </div>
            </div>
        </Portal>
    )
}

export default ModelMarketMobile
