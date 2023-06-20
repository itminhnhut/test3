import styled from 'styled-components';
import colors from 'styles/colors';

const Spiner = ({ isDark, isCustom, colorCustom }) => {
    return (
        <Loader isDark={isDark} isCustom={isCustom} colorCustom={colorCustom}>
            <div className="spinner"></div>
        </Loader>
    );
};
export default Spiner;
const Loader = styled.div`
    .spinner {
        position: relative;
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }

    .spinner::before,
    .spinner::after {
        content: '';
        position: absolute;
        border-radius: inherit;
    }

    .spinner::before {
        width: 100%;
        height: 100%;
        background-image: ${({ isDark }) => `linear-gradient(0deg, ${colors.teal} 0%, ${isDark ? '#212121' : colors.gray[4]} 50%)`};
        animation: spin 0.5s infinite linear;
    }

    .spinner::after {
        width: 85%;
        height: 85%;
        background-color: ${({ colorCustom, isDark, isCustom }) => (colorCustom ? colorCustom : isDark ? colors.dark.dark : isCustom ? '#6D6E72' : '#fff')};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
