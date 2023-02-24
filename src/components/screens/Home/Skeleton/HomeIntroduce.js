import React from 'react';
import Skeletor from 'components/common/Skeletor';
const HomeIntroduce = () => {
    return (
        <div className="bg-[#000] min-h-[50vh] flex justify-center items-center">
            <div className=" max-w-screen-v3 2xl:max-w-screen-xxl mx-auto  ">
                <div className="w-1/2">
                    <Skeletor baseColor="#000" width="100%" height="300px" />
                </div>

                <div className="w-1/2">
                    <Skeletor baseColor="#000" width="100%" height="300px" />
                </div>
            </div>
        </div>
    );
};

export default HomeIntroduce;
