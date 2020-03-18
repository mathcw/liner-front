import { ActionConfigItem } from "@/viewconfig/ActionConfig";

const config: ActionConfigItem = {
    修改流程: {
        title: "修改流程",
        path:"/sys/flow/edit",
        read: { url: "/comm/FlowList/read_step", data: { schema_name: 'schema_name' } },
        submit: { url: "/comm/Flow/submit",data:{"流程编辑":"流程编辑","流程":"流程"} },
        btns: {
          关闭: { text: "关闭" },
          提交: { text: "提交" }
        }
    },
    启停流程: {
        directlySubmit: true,
        submit: {
          url: "/comm/FlowList/toggle/state",
          data: { schema_name: "schema_name", state:"state" }
        }
    },


};

export default config;
