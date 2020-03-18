import { ActionConfigItem } from "@/viewconfig/ActionConfig";

const config: ActionConfigItem = {
    新增邮轮公司: {
        title: "新增邮轮公司",
        path: "/business/cruiseCompany/add",
        submit: { url: "/business/CruiseCompany/submit" },
        btns: {
            关闭: { text: "关闭" },
            提交: { text: "提交" }
        }
    },
    修改邮轮公司: {
        title: "修改邮轮公司",
        path: "/business/cruiseCompany/edit",
        read: { url: "/business/CruiseCompany/read_modify", data: { id: "id" } },
        submit: { url: "/business/CruiseCompany/submit" },
        btns: {
            关闭: { text: "关闭" },
            提交: { text: "提交" }
        }
    },

    新增邮轮: {
        title: "新增邮轮",
        path: "/business/cruise/add",
        submit: { url: "/business/CruiseShip/submit" },
        btns: {
            关闭: { text: "关闭" },
            提交: { text: "提交" }
        }
    },
    修改邮轮: {
        title: "修改邮轮",
        path: "/business/cruise/edit",
        read: { url: "/business/CruiseShip/read_modify", data: { id: "id" } },
        submit: { url: "/business/CruiseShip/submit" },
        btns: {
            关闭: { text: "关闭" },
            提交: { text: "提交" }
        }
    },
};

export default config;
