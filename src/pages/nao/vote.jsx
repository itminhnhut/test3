import React from "react";
import LayoutNaoToken from "components/common/layouts/LayoutNaoToken";

export default function vote() {
    return (
        <LayoutNaoToken>
            <div className="flex flex-row">
                <div className="left">
                    <h3 className="text-[2.2rem] sm:text-2xl leading-8 font-semibold pb-[6px] w-max text-nao-white">
                        Increase minimum amounts of NAO for Governance Pool
                        participance
                    </h3>
                    <h5 className="text-nao-white text-[1.5rem]">Nội dung</h5>
                    <div className="description">
                        Đề xuất tăng số lượng NAO tối thiểu tham gia Pool Quản
                        trị từ 500 NAO lên 10,000 NAO. Quy định mới áp dụng từ
                        0h thứ hai ngày 25/07/2022 Đề xuất tăng số lượng NAO tối
                        thiểu tham gia Pool Quản trị từ 500 NAO lên 10,000 NAO.
                        Quy định mới áp dụng từ 0h thứ hai ngày 25/07/2022 Đề
                        xuất tăng số lượng NAO tối thiểu tham gia Pool Quản trị
                        từ 500 NAO lên 10,000 NAO. Quy định mới áp dụng từ 0h
                        thứ hai ngày 25/07/2022 Thời hạn: 02 ngày
                    </div>
                </div>
            </div>
        </LayoutNaoToken>
    );
}
