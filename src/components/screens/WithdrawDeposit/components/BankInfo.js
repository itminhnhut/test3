import React, { useRef, useState } from 'react';
import ChevronDown from 'components/svg/ChevronDown';
import PopoverSelect from './common/PopoverSelect';
import InfoCard from './common/InfoCard';
import classNames from 'classnames';

const BankInfo = ({ selectedPartner }) => {
    const cardRef = useRef(null);
    const [isVisible, setVisible] = useState(false);
    const [search, setSearch] = useState('');

    return (
        <PopoverSelect
            ref={cardRef}
            open={isVisible}
            label={
                <div
                    onClick={() => {
                        setVisible((prev) => !prev);
                    }}
                    className={classNames('bg-gray-12 text-left dark:bg-dark-2 px-4 py-6 rounded-xl w-full', {
                        'cursor-pointer': selectedPartner
                    })}
                >
                    <div className="txtSecond-2 mb-4">Phương thức thanh toán</div>
                    <InfoCard
                        // loading={fetchingPartner}
                        content={
                            selectedPartner && {
                                mainContent: selectedPartner?.defaultBank?.bankName,
                                subContent: <span>{selectedPartner?.defaultBank?.accountNumber}</span>,
                                imgSrc: selectedPartner?.defaultBank?.bankLogo
                            }
                        }
                        imgSize={40}
                        endIcon={<ChevronDown className={classNames({ 'rotate-0': isVisible })} color="currentColor" size={24} />}
                    />
                </div>
            }
            value={search}
            onChange={(value) => setSearch(value)}
        >
            <div className="space-y-3 w-full">
                {/* {!partners.length ? (
                    <NoData />
                ) : (
                    partners.map((partner) => (
                        <div key={partner._id} className={classNames('p-3 hover:bg-hover-1 dark:hover:bg-hover-dark transition')}>
                            <InfoCard
                                content={{
                                    mainContent: partner?.name,
                                    subContent: (
                                        <div className="flex items-center space-x-3">
                                            <span>{formatPhoneNumber(partner?.phone)}</span>
                                            <div className="flex space-x-1 items-center">
                                                <Clock size={12} />
                                                <span>1 Phút</span>
                                            </div>
                                        </div>
                                    ),
                                    imgSrc: partner?.avatar
                                }}
                                endIcon={<CheckCircle size={16} color="currentColor " />}
                                endIconPosition="center"
                            />
                        </div>
                    ))
                )} */}
            </div>
        </PopoverSelect>
    );
};

export default BankInfo;
