import React from 'react';
import { Pagination } from 'antd';

interface IExtraContent{
    pageSize?:number;
    pageSizeOptions?: string[];
    total?: number;
    current?: number;
    pageNumChange?: (page: number, pageSize?: number) => void;
    pageSizeChange?: (current: number, size: number) => void;
}

const extraContent:React.FC<IExtraContent> = ({ pageSize, pageSizeOptions, total, current,
    pageNumChange, pageSizeChange })=> <Pagination
    size="small"
    onChange={pageNumChange}
    pageSize={pageSize}
    pageSizeOptions={pageSizeOptions || ['10', '20', '30', '50', '100']}
    showSizeChanger
    onShowSizeChange={pageSizeChange}
    current={current}
    total={total}
    showTotal={(num, range) => `${range[0]}-${range[1]} 共 ${num} 行`}
/>

export default extraContent;
