import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { isFunction } from 'redux/actions/utils';
import { X } from 'react-feather';
const ModalHistory = ({ onClose, isVisible, className, data, title }) => {
    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName="!p-8"
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] select-none ${className}`}
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:opacity-50 transition-opacity cursor-pointer"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </div>
                </div>
            )}
        >
            {title &&
                (isFunction(title) ? (
                    React.isValidElement(title) ? (
                        title()
                    ) : null
                ) : (
                    <div className="text-2xl font-semibold text-txtPrimary dark:text-txtPrimary-dark">{title}</div>
                ))}
            <div className="h-6 w-full" />
            <div>
                {data && data?.length &&
                    data?.map((transaction) => (
                        <div key={transaction.key} className="py-3  text-txtPrimary dark:text-txtPrimary-dark flex justify-between">
                            <div className="">{transaction.key}</div>
                            <div className='font-semibold'>{transaction.value}</div>
                        </div>
                    ))}
            </div>
        </ModalV2>
    );
};

export default ModalHistory;
