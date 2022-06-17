import { useEffect } from 'react';

const useOutsideClick = (ref, callback) => {
    const handleClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            console.log(ref.current, e.target, '00000000');
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};

export default useOutsideClick;
