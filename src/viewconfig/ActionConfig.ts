import OrgAction from "@/viewconfig/Action/OrgAction";
import SysAction from "@/viewconfig/Action/SysAction";
import BusinessAction from "@/viewconfig/Action/BusinessAction";
import { BasicLayoutProps as ProLayoutProps } from "@ant-design/pro-layout";

export interface IActionPageProps extends ProLayoutProps {
  route: ProLayoutProps["route"] & {
    authority: string;
  };
  location: ProLayoutProps["location"] & {
    state: object;
  };
}

export interface ActionConfigItem {
  [key: string]: {
    directlySubmit?: boolean;
    title?: string;
    confirm?: string;
    path?: string;
    read?: {
      url: string;
      data?: string | object;
    };
    submit?: {
      url: string;
      data?: string | object;
    };
    btns?: {
      [key: string]: {
        text?: string;
      };
    };
  };
}

export const config: ActionConfigItem = JSON.parse(JSON.stringify({ ...OrgAction,...SysAction,...BusinessAction}));
