const TimeWhite = ({className,onClick}) => {
    return <svg className={className} onClick={onClick&&onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5L15 15" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 15L15 5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    
    
}
export default TimeWhite