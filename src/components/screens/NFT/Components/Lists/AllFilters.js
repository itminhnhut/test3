import classNames from 'classnames';
import InputV2 from 'components/common/V2/InputV2';
import { GridAltIcon, GridIcon, FilterSharpIcon, CloseIcon } from 'components/svg/SvgIcon';
import { useMemo } from 'react';
import { Search } from 'react-feather';
import styled from 'styled-components';

const AllFilters = ({ filter, onChangeToggle, onChangeGird, onChangeSearch }) => {
    const renderFilter = useMemo(() => {
        return filter.isOpen ? (
            <WrapperBtnFilter>
                <CloseIcon size={16} />
                <span className="font-semibold text-gray-15 dark:text-gray-7">Đóng</span>
            </WrapperBtnFilter>
        ) : (
            <WrapperBtnFilter>
                <FilterSharpIcon />
                <span className="font-semibold text-gray-15 dark:text-gray-7">Lọc</span>
            </WrapperBtnFilter>
        );
    }, [filter.isOpen]);
    return (
        <>
            <section className="flex flex-row h-12 dark:bg-dark-2 bg-dark-12 rounded-md" onClick={onChangeToggle}>
                {renderFilter}
            </section>
            <section className="w-full">
                <InputV2
                    className="pb-0"
                    allowClear
                    value={filter.search}
                    placeholder="Tìm kiếm Token"
                    onChange={(value) => onChangeSearch(value)}
                    prefix={<Search strokeWidth={2} className="text-gray-1 w-4 h-4" />}
                />
            </section>
            <section className="flex flex-row  border-[2px] w-full border-divider dark:border-divider-dark rounded-md border-solid cursor-pointer h-12  max-w-[96px]">
                <WrapperGird
                    active={filter.grid === 4}
                    className={classNames(
                        'w-full flex justify-center items-center border-r-2 border-r-divider dark:border-r-divider-dark rounded-tl-[4px] rounded-bl-[4px]'
                    )}
                    onClick={() => onChangeGird(4)}
                >
                    <GridAltIcon isActive={filter.grid === 4} />
                </WrapperGird>
                <WrapperGird
                    active={filter.grid === 6}
                    className={classNames('w-full flex justify-center items-center rounded-tr-[4px] rounded-br-[4px]')}
                    onClick={() => onChangeGird(6)}
                >
                    <GridIcon isActive={filter.grid === 6} />
                </WrapperGird>
            </section>
        </>
    );
};

const WrapperGird = styled.div.attrs(({ active }) => ({
    className: `${classNames({ 'bg-gray-12 dark:bg-dark-2': active })}`
}))``;

const WrapperBtnFilter = styled.button.attrs({
    className: 'flex flex-row items-center gap-2 mx-4'
})``;

export default AllFilters;
