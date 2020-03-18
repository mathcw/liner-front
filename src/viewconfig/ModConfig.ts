import { BasicLayoutProps as ProLayoutProps } from "@ant-design/pro-layout";
import { ButtonType, ButtonSize } from "antd/es/button";
import { CompareFn } from 'antd/es/table/interface';
import OrgMod from "@/viewconfig/Mod/OrgMod";
import SaleMod from '@/viewconfig/Mod/SaleMod';
import ProductManageMod from "@/viewconfig/Mod/ProductManageMod";
import BusinessMod from "@/viewconfig/Mod/BusinessMod";
import SysMod from "@/viewconfig/Mod/SysMod";
import { IEnumCfg } from "@/utils/enum";

export interface IModBtn<T = any> {
  authority: string;
  text?: string;
  icon?: string;
  type?: ButtonType;
  size?: ButtonSize;
  show?: object;
  onClick?: (data?: T, rs?: () => void) => void;
}

export interface IModPageProps extends ProLayoutProps {
  route: ProLayoutProps["route"] & {
    authority: string;
  };
}

export interface ICol<T=any> {
  text: string;
  editable?: boolean;
  required?: boolean;
  type?: string;
  width?: number;
  render?:(record:T, value:string | number, dataIndex:string | number, type:string)=>JSX.Element;
  sorter?:CompareFn<T>
}

export interface ModConfigItem {
  [key: string]: {
    read?: {
      url: string;
      data?: string[];
    };
    title?: string;
    textSearch?: object;
    dropDownSearch?: {[key:string]:IEnumCfg};
    headerButtons?: object;
    rowButtons?: object;
    pageSizeOptions?: Array<string>;
    pageSize?: number;
    list?: { [field: string]: ICol };
  };
}

export let config: ModConfigItem = {};

export function getAllCfg(){
  return JSON.parse(JSON.stringify({...OrgMod,...SaleMod,...ProductManageMod,...BusinessMod,...SysMod}));
}

export function authMetaInit(authData: string[]) {
  // eslint-disable-next-line array-callback-return
  config = JSON.parse(JSON.stringify({...OrgMod,...SaleMod,...ProductManageMod,...BusinessMod,...SysMod}))

  Object.keys(config).map(mod => {
    if (authData.indexOf(mod) === -1) {
      delete config[mod];
      return;
    }

    if (config[mod].headerButtons) {
      const headerBtn = {};
      const btns = { ...config[mod].headerButtons };
      // eslint-disable-next-line array-callback-return
      Object.keys(btns).map(btn => {
        if (authData.indexOf(btn) === -1) {
          return;
        }
        headerBtn[btn] = btns[btn];
      });
      config[mod].headerButtons = { ...headerBtn };
    }
    if (config[mod].rowButtons) {
      const rowBtn = {};
      const btns = { ...config[mod].rowButtons };
      // eslint-disable-next-line array-callback-return
      Object.keys(btns).map(btn => {
        if (authData.indexOf(btn) === -1) {
          return;
        }
        rowBtn[btn] = btns[btn];
      });
      config[mod].rowButtons = { ...rowBtn };
    }
  });
}
