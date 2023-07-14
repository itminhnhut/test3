import classNames from 'classnames';
import React from 'react';

const DragHandleArea = ({ height, dragHandleClassName = 'dragHandleArea' }) => (
    <div style={{ height }} className={classNames('z-[1] h-4 absolute w-full space-y-1 top-0 right-0', dragHandleClassName)} />
);

export default DragHandleArea;
