//** Components
import ModalV2 from 'components/common/V2/ModalV2';

// ** SvgIcon
import { IconClose } from 'components/svg/SvgIcon';

// ** Third party
import styled from 'styled-components';

const ModalImage = ({ onClose, isModal, image, name }) => {
    return (
        <ModalV2
            isVisible={isModal}
            className="w-screen h-screen max-w-full max-h-full rounded-none border-none bg-[rgba(0,0,0,.75)] opacity-70"
            wrapClassName=""
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer mt-6"
                        onClick={onClose}
                    >
                        <IconClose />
                    </div>
                </div>
            )}
        >
            <WrapperImg>
                <img alt={name} src={image} />
            </WrapperImg>
        </ModalV2>
    );
};

const WrapperImg = styled.section`
    align-items: center;
    display: flex;
    height: min(100vw - 50px, 100vh - 50px);
    justify-content: center;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
`;

export default ModalImage;
