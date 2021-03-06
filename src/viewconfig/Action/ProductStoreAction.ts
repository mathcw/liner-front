import { ActionConfigItem } from "@/viewconfig/ActionConfig";

const config: ActionConfigItem = {
  新增单船票: {
    title: "新增单船票",
    path: "/productStore/ticket/add",
    submit: { url: "/productStore/Ticket/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  修改单船票: {
    title: "修改单船票",
    path: "/productStore/ticket/edit",
    read: { url: "/productStore/Ticket/read_modify", data: { id: "id" } },
    submit: { url: "/productStore/Ticket/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  复制单船票: {
    title: "复制单船票",
    path: "/productStore/ticket/copy",
    read: { url: "/productStore/Ticket/read_copy", data: { id: "id" } },
    submit: { url: "/productStore/Ticket/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  新增邮轮套餐: {
    title: "新增邮轮套餐",
    path: "/productStore/youlun/add",
    submit: { url: "/productStore/Youlun/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  修改邮轮套餐: {
    title: "修改邮轮套餐",
    path: "/productStore/youlun/edit",
    read: { url: "/productStore/Youlun/read_modify", data: { id: "id" } },
    submit: { url: "/productStore/Youlun/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  复制邮轮套餐: {
    title: "复制邮轮套餐",
    path: "/productStore/youlun/copy",
    read: { url: "/productStore/Youlun/read_copy", data: { id: "id" } },
    submit: { url: "/productStore/Youlun/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  新增河轮套餐: {
    title: "新增河轮套餐",
    path: "/productStore/helun/add",
    submit: { url: "/productStore/Helun/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  修改河轮套餐: {
    title: "修改河轮套餐",
    path: "/productStore/helun/edit",
    read: { url: "/productStore/Helun/read_modify", data: { id: "id" } },
    submit: { url: "/productStore/Helun/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  复制河轮套餐: {
    title: "复制河轮套餐",
    path: "/productStore/helun/copy",
    read: { url: "/productStore/Helun/read_copy", data: { id: "id" } },
    submit: { url: "/productStore/Helun/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  新增跟团游: {
    title: "新增跟团游",
    path: "/productStore/tour/add",
    submit: { url: "/productStore/Tour/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  修改跟团游: {
    title: "修改跟团游",
    path: "/productStore/tour/edit",
    read: { url: "/productStore/Tour/read_modify", data: { id: "id" } },
    submit: { url: "/productStore/Tour/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

  复制跟团游: {
    title: "复制跟团游",
    path: "/productStore/tour/copy",
    read: { url: "/productStore/Tour/read_copy", data: { id: "id" } },
    submit: { url: "/productStore/Tour/submit" },
    btns: {
      关闭: { text: "关闭" },
      提交: { text: "提交" }
    }
  },

};

export default config;
