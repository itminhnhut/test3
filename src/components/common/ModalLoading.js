import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import ModalV2 from 'components/common/V2/ModalV2';
import Spiner from 'components/common/V2/LoaderV2/Spiner';

const ModalLoading = ({ isVisible, onBackdropCb }) => {
    if (!isVisible) return null;
    const [currentTheme] = useDarkMode();

    return (
        <ModalV2
            isVisible={isVisible}
            onBackdropCb={onBackdropCb}
            className="!w-auto !bg-none !border-none !min-w-0"
            wrapClassName="!bg-transparent"
            closeButton={false}
        >
            <div className="min-w-0 bg-transparent"></div>
            <Spiner isDark={currentTheme === THEME_MODE.DARK} isCustom={true} />
        </ModalV2>
    );
};

export default ModalLoading;
