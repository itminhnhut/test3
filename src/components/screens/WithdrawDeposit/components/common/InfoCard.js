import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import { DefaultAvatar } from 'src/redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { BxsUserIcon } from 'components/svg/SvgIcon';
import { useTranslation } from 'next-i18next';

const CardContent = ({ image, imageSrc, imgSize, mainContent, subContent }) => {
    return (
        <div className="flex items-center space-x-3 ">
            <div style={{ minWidth: imgSize, minHeight: imgSize }}>
                {image ?? <Image src={imageSrc || DefaultAvatar} width={imgSize} height={imgSize} objectFit="cover" />}
            </div>

            <div className="">
                <div className="txtPri-1 mb-2 text-left line-clamp-2">{mainContent}</div>
                <div className="txtSecond-3">{subContent}</div>
            </div>
        </div>
    );
};

const InfoCard = ({ imgSize = 58, content, endIcon, endIconPosition, loading }) => {
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
                    mainContent={t('dw_partner:partner')}
                    subContent={t('dw_partner:no_partner')}
                />
            ) : (
                <>
                    <CardContent imgSize={imgSize} mainContent={content.mainContent} subContent={content.subContent} />
                    {endIcon}
                </>
            )}
        </div>
    );
};

export default InfoCard;
