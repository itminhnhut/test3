import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { DefaultAvatar } from 'src/redux/actions/const';
const InfoCard = ({ imgSize = 58, imgSrc, mainContent, subContent, endIcon, endIconPosition }) => {
    return (
        <div
            className={classNames('flex justify-between', {
                'items-center': endIconPosition === 'center',
                'items-end': endIconPosition === 'end'
            })}
        >
            <div className="flex items-center space-x-3">
                <div>
                    <Image src={imgSrc || DefaultAvatar} width={imgSize} height={imgSize} objectFit="cover" />
                </div>
                <div className="">
                    <div className="txtPri-1 mb-2">{mainContent}</div>
                    <div className="txtSecond-3">{subContent}</div>
                </div>
            </div>
            {endIcon}
        </div>
    );
};

export default InfoCard;
