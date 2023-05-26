

const SvgChecked = ({ className, color = '#47CC85', size = 12 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4.50248 9.59903C4.24521 9.59903 3.99941 9.4909 3.81796 9.29689L0.275443 5.5075C-0.0960872 5.10935 -0.0912938 4.47073 0.286966 4.07864C0.665226 3.6886 1.27292 3.69263 1.64445 4.09077L4.47465 7.11822L10.3299 0.330679C10.688 -0.0826026 11.2948 -0.111904 11.6855 0.261986C12.0781 0.636894 12.1069 1.27552 11.7507 1.68982L5.21291 9.26856C5.03533 9.47469 4.78571 9.59394 4.52171 9.6C4.51498 9.59903 4.50921 9.59903 4.50248 9.59903Z"
                fill={color}
            />
        </svg>
    );
};

// SvgChecked.PropsType = {
//     className?:PropTypes.string,
// }
export default SvgChecked;
