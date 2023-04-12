import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { DOWNLOAD_APP_LINK } from 'src/redux/actions/const';
import useWindowSize from 'hooks/useWindowSize';

const DefaultMobileView = (props, ref) => {
    const { t } = useTranslation();
    const { width } = useWindowSize();

    const renderText = () => (
        <div className={classNames('space-y-3 flex flex-col items-center mb-6 sm:mb-10')}>
            <span className="text-3xl sm:text-4xl font-semibold text-center">{t('common:download_view:title')}</span>
            <span className="text-sm sm:text-base">{t('common:download_view:desc')}</span>
        </div>
    );

    return (
        <div
            className={classNames('mt-4 md:mt-10 px-4 sm:px-0 max-w-[456px] m-auto flex flex-col ', {
                'absolute top-1/2 -translate-y-1/2 lg:flex-row lg:items-center lg:space-x-[76px] lg:px-10 lg:max-w-full': width >= 1024
            })}
        >
            {width < 1024 && renderText()}
            <div className="flex flex-col lg:flex-col-reverse ">
                <img className="lg:mt-4" src={getS3Url('/images/screen/download/bg_banner.png')} />
                <img className="px-12 mt-4 lg:mt-0" src={getS3Url('/images/screen/download/bg_chart.png')} />
            </div>
            <div className="w-full">
                {width >= 1024 && renderText()}
                <div className="flex items-center justify-center space-x-3 mt-6 sm:mt-12 lg:mt-10">
                    <div className="w-full max-w-[200px] h-12">
                        <a href={DOWNLOAD_APP_LINK.IOS} target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-contain" src={getS3Url('/images/screen/download/download_app_store.png')} />
                        </a>
                    </div>
                    <div className="w-full max-w-[200px] h-12">
                        <a href={DOWNLOAD_APP_LINK.ANDROID} target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-contain" src={getS3Url('/images/screen/download/download_play_store.png')} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultMobileView;
