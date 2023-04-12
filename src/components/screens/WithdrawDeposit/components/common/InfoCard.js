import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { DefaultAvatar } from 'src/redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { BxsUserIcon } from 'components/svg/SvgIcon';
import { useTranslation } from 'next-i18next';

const CardContent = ({ image, imageSrc, imgSize, mainContent, subContent }) => {
    return (
        <div className="flex items-center space-x-3">
            <div style={{ minWidth: imgSize, maxWidth: imgSize, minHeight: imgSize, maxHeight: imgSize, width: '100%', height: '100%' }}>
                {image ?? <Image className="rounded-full" src={imageSrc || DefaultAvatar} width={imgSize} height={imgSize} objectFit="cover" />}
            </div>

            <div>
                {mainContent && <div className="txtPri-1 mb-2 text-left capitalize line-clamp-2">{mainContent}</div>}
                {subContent && <div className="txtSecond-3">{subContent}</div>}
            </div>
        </div>
    );
};

const InfoCard = ({ imgSize = 58, content, endIcon, endIconPosition, loading, emptyContent }) => {
    const { t } = useTranslation();

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
                    imgSize={imgSize}
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
                    imgSize={56}
                    mainContent={emptyContent?.mainContent}
                    subContent={emptyContent?.subContent || t('dw_partner:no_partner')}
                />
            ) : (
                <>
                    <CardContent
                        imgSize={imgSize}
                        image={content?.icon}
                        imageSrc={content?.imgSrc}
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
