import React from 'react'
import { toast as rcToast } from "react-toastify";

const types = {
    default: null,
    success: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z" fill="#E2E8F0" />
    </svg>,
    error: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#F93636" />
    </svg>,
    warning: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.884 2.532c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21h18a.998.998 0 0 0 .883-1.468l-8.999-17zM13 18h-2v-2h2v2zm-2-4V9h2l.001 5H11z" fill="#FFC632" />
    </svg>

}

const NamiToast = ({ render, text, type }) => {
    const content = render ? render(text) : text

    return (
        <div className='flex space-x-3 whitespace-nowrap'>
            <span className='mr-3'>{types[type] ? types[type] : null}</span>
            {content}
        </div>
    )
}

const toast = ({ text = '', render = undefined, type = 'default' }) => {
    return rcToast(<NamiToast render={render} text={text} type={type} />)
}

export default toast
