import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const progress = (item) => {
    const now = new Date().getTime();
    const start = new Date(item?.start).getTime();
    const end = new Date(item?.end).getTime();
    if (now < start && now < end) {
        return <div className="text-yellow-2 bg-yellow-2/[0.1] px-2 py-1 !pl-3 sm:!pl-2 rounded-lg">{t('nao:coming_soon_2')}</div>;
    } else if (now > start && now < end) {
        return (
            <div className="flex items-center space-x-1 bg-teal/[0.1] px-2 py-1 !pl-3 sm:!pl-2 rounded-lg w-max">
                <img src={getS3Url('/images/nao/ic_nao_large.png')} width={16} height={16} />
                <div className="text-teal">{t('nao:going_on')}</div>
            </div>
        );
    } else {
        return <div className="text-gray-7 bg-gray-7/[0.1] px-2 py-1 !pl-3 sm:!pl-2 rounded-lg">{t('nao:ended')}</div>;
    }
};

const ContestDetail = ({ visible = true, onClose, seasons }) => {
    return (
        <Modal
            onusMode={true}
            center={!isMobile}
            isVisible={visible}
            onBackdropCb={onClose}
            modalClassName="z-[99999]"
            onusClassName={`${isMobile ? '!px-2 pb-[3.75rem]' : '!px-8 !py-10 max-w-[979px]'} min-h-[304px] rounded-t-[16px] !overflow-hidden `}
            containerClassName="!bg-black-800/[0.6] dark:!bg-black-800/[0.8]"
        >
            <div className="py-1 shadow-onlyLight font-medium text-sm flex flex-col rounded-xl overflow-hidden text-left">
                {seasonsFilter.map((item, index) => (
                    <div
                        onClick={() => {
                            router.push(`/contest/${item.season}`);
                            close();
                        }}
                        key={index}
                        className="px-3 sm:px-4 sm:space-x-2 py-2 hover:bg-gray-11 dark:hover:bg-dark-12 cursor-pointer flex sm:items-center flex-col space-y-2 sm:space-y-0 sm:flex-row"
                    >
                        <div className="-ml-4 sm:ml-0 text-[10px] leading-[12px] whitespace-nowrap w-max">{progress(item)}</div>
                        <span className="leading-6">{item?.title_detail?.[language]} </span>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

ContestDetail.propTypes = {
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    seasons: PropTypes.arrayOf(
        PropTypes.shape({
            season: PropTypes.number.isRequired,
            start: PropTypes.string.isRequired,
            end: PropTypes.string.isRequired,
            contest_id: PropTypes.number.isRequired,
            button: PropTypes.string,
            title_detail: { vi: PropTypes.string, en: PropTypes.string },
            title: { vi: PropTypes.string, en: PropTypes.string },
            minVolumeInd: { vi: PropTypes.string, en: PropTypes.string, isHtml: PropTypes.bool },
            minVolumeTeam: { vi: PropTypes.string, en: PropTypes.string, isHtml: PropTypes.bool },
            rules: PropTypes.string,
            total_rewards: PropTypes.string,
            quoteAsset: PropTypes.string,
            active: PropTypes.bool,
            top_ranks_per: PropTypes.bool,
            top_ranks_team: PropTypes.bool
        })
    ).isRequired
};

export default ContestDetail;
