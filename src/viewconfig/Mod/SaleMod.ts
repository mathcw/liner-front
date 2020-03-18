import { ModConfigItem } from '@/viewconfig/ModConfig';

const config: ModConfigItem = {
    '占位管理': {
        read: { url: "/Sale/Order/read" },
        title: "占位确认",
        textSearch: {
            retailer_order_id: { text: '订单号' },
            pd_name: { text: '产品名称' }
        },
        dropDownSearch: {
            sup_id: { text: '确认公司', type: 'Supplier' },
            supplier_department_id: { text: '确认部门', type: 'SupplierDepartment', cascade: 'sup_id' },
            saler_id: { text: '确认人', type: 'SupplierSales', cascade: 'supplier_department_id' },
            dep_date_from: { text: '出团日起', type: 'date' },
            dep_date_to: { text: '出团日止', type: 'date' },
        },
        headerButtons: {
        },
        rowButtons: {
            占位时限: { text: '时限', show: { state: [4], shelf_state: [1] } },
            占位驳回: { text: '驳回', show: { state: [2], shelf_state: [1] } },
            清位: { text: '清位', show: { state: [4], shelf_state: [1] } },
            留位: { text: '留位', show: { state: [2], shelf_state: [1] } }
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '实报管理':{
        read: { url: "/Sale/Order/read" },
        title: "实报管理",
        textSearch: {
            retailer_order_id: { text: '订单号' },
            pd_name: { text: '产品名称' }
        },
        dropDownSearch: {
            sup_id: { text: '确认公司', type: 'Supplier' },
            supplier_department_id: { text: '确认部门', type: 'SupplierDepartment', cascade: 'sup_id' },
            saler_id: { text: '确认人', type: 'SupplierSales', cascade: 'supplier_department_id' },
            dep_date_from: { text: '出团日起', type: 'date' },
            dep_date_to: { text: '出团日止', type: 'date' },
        },
        headerButtons: {
        },
        rowButtons: {
            审批订单: {text:'确认',show:{confirm_flow: [2]}}
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    },
    '订单变更':{
        read: { url: "/Sale/Order/read" },
        title: "变更管理",
        textSearch: {
            retailer_order_id: { text: '订单号' },
            pd_name: { text: '产品名称' }
        },
        dropDownSearch: {
            sup_id: { text: '确认公司', type: 'Supplier' },
            supplier_department_id: { text: '确认部门', type: 'SupplierDepartment', cascade: 'sup_id' },
            saler_id: { text: '确认人', type: 'SupplierSales', cascade: 'supplier_department_id' },
            dep_date_from: { text: '出团日起', type: 'date' },
            dep_date_to: { text: '出团日止', type: 'date' },
        },
        headerButtons: {
        },
        rowButtons: {
            确认变更: {text:'确认',show:{order_change_flow: [2]}}
        },
        pageSizeOptions: ["10", "20", "30", "50", "100"],
        pageSize: 100
    }
}

export default config;