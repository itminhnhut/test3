import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { DefaultAvatar } from 'src/redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { BxsUserIcon } from 'components/svg/SvgIcon';

const CardContent = ({ image, mainContent, subContent }) => {
    return (
        <div className="flex items-center space-x-3 ">
            {image}
            <div className="">
                <div className="txtPri-1 mb-2 line-clamp-2">{mainContent}</div>
                <div className="txtSecond-3">{subContent}</div>
            </div>
        </div>
    );
};

const InfoCard = ({ imgSize = 58, content, endIcon, endIconPosition, loading }) => {
    return (
        <div
            className={classNames('flex justify-between w-full', {
                'items-center': endIconPosition === 'center',
                'items-end': endIconPosition === 'end'
            })}
          
        >
            {loading ? (
                <CardContent
                    image={<Skeletor width={imgSize} height={imgSize} circle />}
                    mainContent={<Skeletor width="200px" height="20" />}
                    subContent={<Skeletor width="150px" height="10px" />}
                />
            ) : !content ? (
                <CardContent
                    image={
                        <div className="w-14 h-14 text-txtSecondary dark:text-txtSecondary-dark dark:bg-bgBtnV2-dark_disabled bg-gray-11 rounded-full flex items-center justify-center">
                            <BxsUserIcon size={24} color="currentColor" />
                        </div>
                    }
                    mainContent={'Đối tác'}
                    subContent={'Không có đối tác khả dụng'}
                />
            ) : (
                <>
                    <CardContent
                        image={<Image src={DefaultAvatar} width={imgSize} height={imgSize} objectFit="cover" />}
                        mainContent={content.mainContent}
                        subContent={content.subContent}
                    />
                    {endIcon}
                </>
            )}
        </div>
    );
};

export default InfoCard;
