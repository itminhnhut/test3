import classNames from 'classnames';
import { StarPurpleIcon } from 'components/svg/SvgIcon';
import React, { useState } from 'react';
import { isFunction } from 'redux/actions/utils';

const index = ({ wrapClassname, starLength = 5, defaultStar = 0, children }) => {
    const [state, set] = useState({
        hoverStars: defaultStar,
        isRated: false
    });

    const setRatingState = (_state) => set((prev) => ({ ...prev, ..._state }));

    return (
        <>
            <div
                // onMouseLeave={() => {
                //     if (state.isRated) return;
                //     setRatingState({ hoverStars: 0 });
                // }}
                className={classNames('flex gap-4', wrapClassname)}
            >
                {[...Array(starLength).keys()].map((star) => (
                    <div
                        onMouseOver={() => {
                            setRatingState({ hoverStars: star + 1 });
                        }}
                        key={star}
                        className={classNames('cursor-pointer text-txtSecondary dark:text-txtSecondary-dark ', {
                            '!text-yellow-100': state.hoverStars >= star + 1
                        })}
                        onClick={() => setRatingState({ hoverStars: star + 1, isRated: true })}
                    >
                        <StarPurpleIcon size={32} color="currentColor" />
                    </div>
                ))}
            </div>
            {isFunction(children) ? children(state.hoverStars) : children}
        </>
    );
};

export default index;
