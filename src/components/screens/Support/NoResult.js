import React from 'react'

const NoResult = ({ size = "124", text = '' }) => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M53.633 60.49c0 8.973-5.271 16.71-12.87 20.265-7.652-2.78-13.13-10.135-13.13-18.752 0-9.903 7.246-18.144 16.703-19.682a22.348 22.348 0 0 1 9.297 18.17z" fill="url(#znqa0gqk6a)" />
                <path d="M33.943 82.694a20.88 20.88 0 0 1-2.639.162c-12.328 0-22.322-10.013-22.322-22.365 0-12.353 9.994-22.372 22.329-22.372 2.322 0 4.56.356 6.67 1.015-8.916 3.762-15.186 12.592-15.186 22.863 0 8.642 4.432 16.256 11.148 20.697z" fill="url(#rax2tboycb)" />
                <path d="M40.762 80.749a21.483 21.483 0 0 1-6.82 1.945c-6.715-4.44-11.147-12.055-11.147-20.697 0-10.271 6.27-19.107 15.186-22.863a22.171 22.171 0 0 1 6.349 3.18c-9.452 1.532-16.703 9.78-16.703 19.683.006 8.616 5.484 15.979 13.135 18.752z" fill="#C2C7CF" />
                <path d="m65.748 70.064 4.6 1.577c-3.762 8.888-12.568 15.151-22.8 15.151-5.032 0-9.703-1.5-13.606-4.091a21.483 21.483 0 0 0 6.82-1.946 19.723 19.723 0 0 0 6.786 1.196c8.11-.007 15.103-4.893 18.2-11.887zM72.29 61.997c0 1.713-.181 3.393-.51 5.01l-4.626-1.578c.193-1.112.297-2.262.297-3.432.006-10.995-8.923-19.941-19.903-19.941-1.096 0-2.167.09-3.213.265a22.005 22.005 0 0 0-6.348-3.18 24.384 24.384 0 0 1 9.561-1.933c13.645 0 24.741 11.118 24.741 24.789z" fill="#C2C7CF" />
                <path d="M71.786 67.006a24.909 24.909 0 0 1-1.432 4.635l-4.6-1.577a19.692 19.692 0 0 0 1.413-4.635l4.619 1.577z" fill="#C2C7CF" />
                <path d="m115.017 81.744-1.555 4.59L70.348 71.64a24.924 24.924 0 0 0 1.432-4.635l43.237 14.738z" fill="#C2C7CF" />
                <defs>
                    <linearGradient id="znqa0gqk6a" x1="7.346" y1="61.535" x2="57.323" y2="61.535" gradientUnits="userSpaceOnUse">
                        <stop offset=".056" stop-color="#E2E8F0" />
                        <stop offset=".135" stop-color="#D8DEE5" stop-opacity=".91" />
                        <stop offset=".272" stop-color="#BDC2C9" stop-opacity=".753" />
                        <stop offset=".451" stop-color="#91959A" stop-opacity=".548" />
                        <stop offset=".666" stop-color="#545659" stop-opacity=".303" />
                        <stop offset=".908" stop-color="#080808" stop-opacity=".026" />
                        <stop offset=".931" stop-opacity="0" />
                    </linearGradient>
                    <linearGradient id="rax2tboycb" x1=".989" y1="60.489" x2="47.931" y2="60.489" gradientUnits="userSpaceOnUse">
                        <stop offset=".056" stop-color="#E2E8F0" />
                        <stop offset=".138" stop-color="#D9DFE7" stop-opacity=".911" />
                        <stop offset=".273" stop-color="#C1C6CD" stop-opacity=".764" />
                        <stop offset=".447" stop-color="#9A9EA4" stop-opacity=".576" />
                        <stop offset=".65" stop-color="#64676A" stop-opacity=".354" />
                        <stop offset=".877" stop-color="#202122" stop-opacity=".108" />
                        <stop offset=".977" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className='mt-3 font-normal text-darkBlue-5 text-base'>
                {text}
            </div>
        </div>
    )
}

export default NoResult