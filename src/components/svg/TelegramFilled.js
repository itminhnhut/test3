const TelegramFilled = ({
    color = '#E2E8F0',
    size = 28,
    onClick,
    className = ''
}) => {
    return (
        <svg width={size} height={size} onClick={onClick} className={className} viewBox='0 0 29 28' fill='none'
             xmlns='http://www.w3.org/2000/svg'>
            <g clipPath='url(#6k7pcoxtra)'>
                <path
                    d='M28.742 2.948a.6.6 0 0 0-.407-.444 2.1 2.1 0 0 0-1.102.078S2.699 11.4 1.298 12.377c-.301.21-.403.333-.453.476-.243.7.512 1.001.512 1.001l6.323 2.06c.107.02.217.013.321-.018 1.438-.909 14.467-9.14 15.224-9.416.117-.035.207 0 .183.087-.3 1.056-11.56 11.058-11.622 11.119a.233.233 0 0 0-.084.206l-.59 6.174s-.248 1.922 1.674 0a53.89 53.89 0 0 1 3.324-3.043c2.174 1.502 4.514 3.162 5.523 4.031a1.758 1.758 0 0 0 1.283.494 1.442 1.442 0 0 0 1.226-1.089S28.61 6.466 28.76 4.055c.015-.233.035-.387.037-.55a2.056 2.056 0 0 0-.055-.557z'
                    fill={color} />
            </g>
            <defs>
                <clipPath id='6k7pcoxtra'>
                    <path fill='#fff' transform='translate(.797)' d='M0 0h28v28H0z' />
                </clipPath>
            </defs>
        </svg>
    );
};

export default TelegramFilled;
