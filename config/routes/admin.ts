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
