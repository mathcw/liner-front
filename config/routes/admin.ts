import { IRouteValue } from "../routeConfig";
const routes: Array<IRouteValue> = [
  {
    parent: "/",
    routes: [
      {
        name: "行政管理",
        path: "/org",
        routes: [
          {
            path: "/org/account/list",
            name: "账号管理",
            authority: "账号管理",
            viewConfig: "账号管理",
            component: "./org/account/list"
          },
          {
            path: "/org/auth/list",
            name: "权限设置",
            authority: "权限管理",
            viewConfig: "权限管理",
            component: "./org/auth/list"
          },
          {
            path: "/org/auth/add",
            name: "新增权限",
            authority: "新增权限",
            viewConfig:"新增权限",
            hideInMenu: true,
            component: "./org/auth/edit"
          },
          {
            path: "/org/auth/edit",
            name: "编辑权限",
            authority: "编辑权限",
            viewConfig:"编辑权限",
            hideInMenu: true,
            component: "./org/auth/edit"
          }
        ]
      },
      {
        name: "业务配置",
        path: "/business",
        routes: [
          {
            path: "/business/commDct/list",
            name: "数据字典",
            authority: "数据字典",
            viewConfig:"数据字典",
            component: "./business/commDct/list"
          },
          {
            path: "/business/city/list",
            name: "城市设置",
            authority: "城市设置",
            viewConfig:"城市设置",
            component: "./business/city/list"
          },
          {
            path: "/business/cruiseCompany/list",
            name: "邮轮公司",
            authority: "邮轮公司",
            viewConfig:"邮轮公司",
            component: "./business/cruiseCompany/list"
          },
          {
            path: "/business/cruiseCompany/add",
            name: "新增邮轮公司",
            authority: "新增邮轮公司",
            viewConfig:"新增邮轮公司",
            hideInMenu: true,
            component: "./business/cruiseCompany/edit"
          },
          {
            path: "/business/cruiseCompany/edit",
            name: "修改邮轮公司",
            authority: "修改邮轮公司",
            viewConfig:"修改邮轮公司",
            hideInMenu: true,
            component: "./business/cruiseCompany/edit"
          },
          {
            path: "/business/cruise/list",
            name: "邮轮设置",
            authority: "邮轮设置",
            viewConfig:"邮轮设置",
            component: "./business/cruise/list"
          },
          {
            path: "/business/cruise/add",
            name: "新增邮轮",
            authority: "新增邮轮",
            viewConfig:"新增邮轮",
            hideInMenu: true,
            component: "./business/cruise/edit"
          },
          {
            path: "/business/cruise/edit",
            name: "修改邮轮",
            authority: "修改邮轮",
            viewConfig:"修改邮轮",
            hideInMenu: true,
            component: "./business/cruise/edit"
          },
        ]
      },
      {
        name: "产品班期",
        path: "/productStore",
        routes: [
          {
            path: "/productStore/list",
            name: "产品管理",
            authority: "产品管理",
            viewConfig: "产品管理",
            component: "./productStore/list"
          },
          {
            path: "/productStore/group/list",
            name: "班期管理",
            authority: "班期管理",
            viewConfig: "班期管理",
            component: "./group/list"
          },
          {
            path: "/productStore/ticket/add",
            name: "新增单船票",
            authority: "新增产品",
            viewConfig: "新增单船票",
            hideInMenu: true,
            component: "./productStore/ticket/edit"
          },
          {
            path: "/productStore/ticket/edit",
            name: "修改单船票",
            authority: "修改产品",
            viewConfig: "修改单船票",
            hideInMenu: true,
            component: "./productStore/ticket/edit"
          },

          {
            path: "/productStore/youlun/add",
            name: "新增邮轮套餐",
            authority: "新增产品",
            viewConfig: "新增邮轮套餐",
            hideInMenu: true,
            component: "./productStore/youlun/edit"
          },
          {
            path: "/productStore/youlun/edit",
            name: "修改邮轮套餐",
            authority: "修改产品",
            viewConfig: "修改邮轮套餐",
            hideInMenu: true,
            component: "./productStore/youlun/edit"
          },
          {
            path: "/productStore/helun/add",
            name: "新增河轮套餐",
            authority: "新增产品",
            viewConfig: "新增河轮套餐",
            hideInMenu: true,
            component: "./productStore/helun/edit"
          },
          {
            path: "/productStore/helun/edit",
            name: "修改河轮套餐",
            authority: "修改产品",
            viewConfig: "修改河轮套餐",
            hideInMenu: true,
            component: "./productStore/helun/edit"
          },
        ]
      },
      {
        name: "订单管理",
        path: "/order",
        routes: [
          {
            path: "/order/Zixun",
            name: "客户咨询",
            authority: "客户咨询",
            viewConfig: "客户咨询",
            component: "./order/Zixun"
          },
          {
            path: "/order/OrderList",
            name: "客户订单",
            authority: "客户订单",
            viewConfig: "客户订单",
            component: "./order/OrderList"
          },
        ]
      },
      {
        name: "系统设置",
        path: "/sys",
        routes: [
          {
            path: "/sys/flow/list",
            name: "业务流程",
            authority: "业务流程",
            viewConfig: "业务流程",
            component: "./sys/flow/list"
          },
          {
            path:"/sys/flow/edit",
            name:"修改流程",
            viewConfig:"修改流程",
            hideInMenu:true,
            component:"./sys/flow/edit",
          },
          {
            path: "/sys/api/list",
            name: "api管理",
            authority: "api管理",
            viewConfig: "api管理",
            component: "./sys/api/list"
          },
          {
            path: "/sys/config/setting",
            name: "参数设置",
            authority: "系统参数设置",
            viewConfig: "系统参数设置",
            component: "./sys/config/setting"
          },
        ]
      },
    ]
  }
];

export default routes;
