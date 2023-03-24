import React from 'react';
import { toast as rcToast } from 'react-toastify';
import useDarkMode from 'hooks/useDarkMode';

const types = {
    default: null,
    success: {
        light: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"
                    fill="#1E1E1E"
                />
            </svg>
        ),
        dark: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"
                    fill="#E2E8F0"
                />
            </svg>
        )
    },
    error: {
        light: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M16.707 2.293A.996.996 0 0 0 16 2H8a.996.996 0 0 0-.707.293l-5 5A.996.996 0 0 0 2 8v8c0 .266.105.52.293.707l5 5A.996.996 0 0 0 8 22h8c.266 0 .52-.105.707-.293l5-5A.996.996 0 0 0 22 16V8a.996.996 0 0 0-.293-.707l-5-5zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="#F93636"
                />
            </svg>
        ),
        dark: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M16.707 2.293A.996.996 0 0 0 16 2H8a.996.996 0 0 0-.707.293l-5 5A.996.996 0 0 0 2 8v8c0 .266.105.52.293.707l5 5A.996.996 0 0 0 8 22h8c.266 0 .52-.105.707-.293l5-5A.996.996 0 0 0 22 16V8a.996.996 0 0 0-.293-.707l-5-5zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="#F93636"
                />
            </svg>
        )
    },
    warning: {
        light: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.884 2.533c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21.002h18a.998.998 0 0 0 .883-1.466L12.884 2.533zM13 18.002h-2v-2h2v2zm-2-4v-5h2l.001 5H11z"
                    fill="#FFC632"
                />
            </svg>
        ),
        dark: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.884 2.533c-.346-.654-1.422-.654-1.768 0l-9 17A.999.999 0 0 0 3 21.002h18a.998.998 0 0 0 .883-1.466L12.884 2.533zM13 18.002h-2v-2h2v2zm-2-4v-5h2l.001 5H11z"
                    fill="#FFC632"
                />
            </svg>
        )
    }
};

const NamiToast = ({ render, text, type }) => {
    const [themeMode] = useDarkMode();
    const content = render ? render(text) : text;
    return (
        <div className="flex space-x-3 whitespace-nowrap">
            <span className="mr-3">{types?.[type]?.[themeMode] ? types?.[type]?.[themeMode] : null}</span>
            {content}
        </div>
    );
};

const toast = ({ text = '', render = undefined, type = 'default', duration = 1000 }) => {
    return rcToast(<NamiToast render={render} text={text} type={type} />, { autoClose: duration });
};

export default toast;
