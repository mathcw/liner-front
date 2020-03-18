import { ActionConfigItem } from "@/viewconfig/ActionConfig";

const config: ActionConfigItem = {
  新增权限: {
    title: "新增权限",
    path: "/org/auth/add",
    read: { url: "/org/Auth/read_new" },
    submit: { url: "/org/Auth/submit", data: "auth" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },
  编辑权限: {
    title: "编辑权限",
    path: "/org/auth/edit",
    read: { url: "/org/Auth/read_modify", data: { id: "id" } },
    submit: { url: "/org/Auth/submit", data: "auth" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },
  // 员工
  重置账号密码:{
    directlySubmit: true,
    confirm:'确认重置账号密码吗?',
    submit: {
      url: "/org/Account/reset_password",
    }
  },
  启停账号: {
    directlySubmit: true,
    submit: {
      url: "/org/Account/toggle/state",
      data: { id: "id", state:"state"}
    }
  },

};

export default config;
