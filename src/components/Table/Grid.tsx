import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import { ColumnType, TableProps } from 'antd/es/table';
import { Resizable,ResizeCallbackData } from 'react-resizable';

import { colDisplay, getRowBtnArray } from "@/utils/utils";
import { ICol, IModBtn } from "@/viewconfig/ModConfig";
import Cell from "./Cell";

//cell
const display = function <T>(
    record: T,
    dataIndex: string | number,
    type: string,
    value?: string | number,
) {
    if (
        typeof value === undefined ||
        typeof value === null ||
        (typeof value === "string" && value.length === 0)
    ) {
        return <span style={{ minHeight: "30px" }} />;
    }
    if (type) {
        return (
            <span style={{ minHeight: "30px" }}>
                {colDisplay(value, type, record)}
            </span>
        );
    }
    return <span style={{ minHeight: "30px" }}>{value}</span>;
};

//row
const defaultRow = ({ ...props }) => <tr {...props} />;

//sorter
const sorter = function <T>(a: T, b: T, field: string) {
    return (a[field] > b[field] ? 1 : -1)
}

//header 
const ResizeableTitle = (props: any) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

interface IDataType{
    uuid?:string,
    [key:string]:any
}

//column
export const getCols = function <T extends IDataType>(
    list: { [field: string]: ICol<T> },
    update?: (
        row: string,
        dataIndex: string | number,
        value?: string | number
    ) => void
) {
    const rst: ColumnType<T>[] = [];
    let colWidth: number = 0;

    const windowWidth = window.innerWidth;
    if (Object.keys(list).length > 4) {
        colWidth = (windowWidth - 80) / 4;
    } else {
        colWidth = (windowWidth - 80) / Object.keys(list).length;
    }
    Object.keys(list).forEach(v => {
        const colCfg = list[v];
        // 设置column基础属性
        const col: ColumnType<T> = {
            title: colCfg.text,
            dataIndex: v,
            key: v,
            width: colCfg.width ? colCfg.width : colWidth,
            onCell: (record: T) => ({
                record,
                initValue: record[v],
                editable: colCfg.editable,
                dataIndex: v,
                rowIndex:record.uuid,
                required: colCfg.required,
                title: colCfg.text,
                type: colCfg.type,
                render: colCfg.render || display,
                update:update
            }),
            sorter: (a: T, b: T) => {
                if (colCfg.sorter) {
                    return colCfg.sorter(a, b);
                }
                return sorter(a, b, v);
            }
        };
        rst.push(col);
    });
    return rst;
};

//操作列相关
const btnShowFilter = function <T>(btns: IModBtn[], data: T[]) {
    if (!Array.isArray(data) || !data[0]) {
        return [];
    }
    const rst = [];
    rst.push(data[0]);
    if (!btns) {
        return [];
    }
    const show = new Set<string>();
    btns.forEach(btn => {
        if (btn.show) {
            Object.keys(btn.show).forEach(v => {
                show.add(v);
            });
        }
    });
    const filter = {};
    show.forEach(k => {
        filter[k] = [];
    });
    let flag = false;
    data.forEach(item => {
        flag = false;
        show.forEach(k => {
            if (!filter[k].includes(item[k])) {
                filter[k].push(data[k]);
                flag = true;
            }
        });
        if (flag) {
            rst.push(data);
            flag = false;
        }
    });
    return rst;
};

export const actionColWidth = function <T>(btns: IModBtn[], dataSource: T[]) {
    let width = 0;
    const needToCalc = btnShowFilter(btns, dataSource);
    needToCalc.forEach(data => {
        const rst = getRowBtnArray(data, btns);

        if (rst.length) {
            const rWidth = rst
                .map((action, i) => {
                    if (action.text) {
                        return action.text.length * 16 + 2 + 30 + (i === 0 ? 0 : 8);
                    }
                    return 0;
                })
                .reduce((total, cur) => total + cur);
            if (rWidth > width) {
                width = rWidth;
            }
        }
    });
    return width + 16 + 2;
}

export const renderRowBtns = function <T>(btns: IModBtn[], data: T, rs?: () => void) {
    const rst = getRowBtnArray(data, btns);
    return rst.map((item, index) => (
        <div key={item.authority} className="dib">
            <Button
                onClick={() => {
                    if (!item.onClick) {
                        Modal.error({
                            title: `${item.text}未配置`,
                            content: `${item.text}未配置`
                        });
                        return;
                    }
                    item.onClick(data, rs);
                }}
            >
                {item.text || ""}
            </Button>
            {index !== rst.length - 1 && (
                <span style={{ width: "8px", display: "inline-block" }} />
            )}
        </div>
    ));
};

interface IGridProp<T> {
    resizeable?: boolean,
    specCol?: ColumnType<T>[],
    dnd?: boolean
}

interface IGird {
    <T extends IDataType>(p: IGridProp<T> & TableProps<T>): JSX.Element;
}

const Grid: IGird = function <T extends IDataType>(p: IGridProp<T> & TableProps<T>): JSX.Element {
    const { resizeable, dnd, columns, specCol, ...rst } = p;

    const [SColumns, setColumns] = useState([...(columns || [])]);

    useEffect(()=>{
        let initCols:ColumnType<T>[] = [];
        if(columns){
            initCols = [...columns];
        }
        if(specCol){
            initCols = [...initCols, ...specCol];
        }

        if(resizeable){// 
            let comp = [...initCols];
            initCols = comp.map((col)=>{
                if(col.key){
                    SColumns.forEach((sCol)=>{
                        if(sCol.key && sCol.key === col.key){
                            col.width = sCol.width;
                        }
                    })
                }
                return col;
            })
        }

        setColumns(initCols);
    },[specCol,columns])
    
    const config: TableProps<T> = {
        //@ts-ignore
        components: {
            body: {
                row: defaultRow,
                cell: Cell
            }
        },
        columns: SColumns,
        ...rst
    };

    const rowKey = (record: T, index?: number) => {
        return  record.uuid?record.uuid:record.id;
    }

    config['rowKey'] = rowKey;

    const handleResize = (index: number) => (e: any, cbData:ResizeCallbackData) => {
        if (SColumns) {
            const nextColumns = [...SColumns];
            nextColumns[index] = {
                ...SColumns[index],
                width: cbData.size.width
            }
            setColumns(nextColumns);
        }
    };

    if (resizeable) {
        const ResizeableCols = SColumns?.map((col, index) => {
            return {
                ...col,
                onHeaderCell: (column: any) => {
                    return {
                        width: column.width,
                        onResize: handleResize(index),
                    };
                },
            }
        })
        config['components'] = {
            ...config['components'],
            header: {
                cell: ResizeableTitle,
            },
        }
        //@ts-ignore
        config['columns'] = ResizeableCols;
    }

    if (!config['scroll']) {
        config['scroll'] = { x: "max-content" }
    }

    if (dnd) {

    }

    return <Table<T> {...config} />
}


export default Grid;