import { ModConfigItem } from "@/viewconfig/ModConfig";

const config: ModConfigItem = {
  权限管理: {
    read: { url: "/org/Auth/read" },
    title: "权限设置",
    textSearch: {
      name: { text: "权限名称" },
    },
    dropDownSearch: {
      state: { text: "启停状态", type: "State" }
    },
    headerButtons: {
      新增权限: { text: "新增" }
    },
    rowButtons: {
      编辑权限: { text: "编辑" }
    },
    pageSizeOptions: ["10", "20", "30", "50", "100"],
    pageSize: 100
  },
  账号管理: {
    read: { url: "/org/Account/read" },
    title: "账号管理",
    textSearch: {
      name: { text: "账号名称" }
    },
    dropDownSearch: {
    },
    headerButtons: {
      新增账号: { text: "新增" }
    },
    rowButtons: {
      修改账号: { text: "修改" },
      启停账号: { text: "启停" },
      设置账号密码: { text: "密码" },
      设置账号权限: { text: "设置" },
      重置账号密码: { text: "重置" }
    },
    pageSizeOptions: ["10", "20", "30", "50", "100"],
    pageSize: 100
  },
};

export default config;
