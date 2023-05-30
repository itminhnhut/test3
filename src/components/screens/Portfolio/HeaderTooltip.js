import Tooltip from 'components/common/Tooltip';
import { HelpIcon } from 'components/svg/SvgIcon';
import { isArray } from 'lodash';
import React from 'react';

const HeaderTooltip = ({ className, tooltipId, title, tooltipContent, isMobile = false }) => {
    return (
        <div className={className}>
            <Tooltip id={tooltipId} place={isMobile ? 'right' : 'top'} className={`max-w-[${isMobile ? 300 : 520}px] !px-6 !py-3`}>
                {isArray(tooltipContent) && (
                    <ul className="list-disc marker:text-xs ml-1">
                        {tooltipContent.map((item) => (
                            <li id={item}>{item}</li>
                        ))}
                    </ul>
                )}
            </Tooltip>
            <div className='flex items-center cursor-pointer w-max' data-tip={isArray(tooltipContent) ? '' : tooltipContent} data-for={tooltipId}>
                <div className="text-base md:text-2xl font-semibold pr-2">{title}</div>
                <HelpIcon color="currentColor" />
            </div>
        </div>
    );
};

export default HeaderTooltip;
