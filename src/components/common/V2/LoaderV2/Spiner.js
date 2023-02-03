import styled from 'styled-components';
import colors from 'styles/colors';

const Spiner = ({ isDark }) => {
    return (
        <Loader isDark={isDark}>
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
        background-image: ${() => `linear-gradient(0deg, ${colors.teal} 0%, #212121 50%)`};
        animation: spin 0.5s infinite linear;
    }

    .spinner::after {
        width: 85%;
        height: 85%;
        background-color: ${({ isDark }) => (isDark ? colors.dark.dark : '#fff')};
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
