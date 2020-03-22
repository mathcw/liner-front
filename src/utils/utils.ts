import { parse } from "querystring";
import pathRegexp from "path-to-regexp";
import router, { RouteData } from "umi/router";
import { message, Modal } from "antd";
import { config, IModBtn } from "@/viewconfig/ModConfig";
import { config as ActionCfg } from "@/viewconfig/ActionConfig";
import { submit } from "@/utils/req";
import { getEnum } from "./enum";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site") {
    return true;
  }
  return window.location.hostname === "preview.pro.ant.design";
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === "development") {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split("?")[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path: string }>(
  router: T[] = [],
  pathname: string
): T | undefined => {
  const authority = router.find(
    ({ path }) => path && pathRegexp(path).exec(pathname)
  );
  if (authority) return authority;
  return undefined;
};

export function getModHeaderButton(key: string) {
  const cfg = config[key];
  return { ...cfg.headerButtons } || {};
}

export function getModRowButton(key: string) {
  const cfg = config[key];
  return { ...cfg.rowButtons } || {};
}

export function getModDropDownSearch(key: string | number) {
  const cfg = config[key];
  return { ...cfg.dropDownSearch } || {};
}

export function getModTextSearch(key: string | number) {
  const cfg = config[key];
  return { ...cfg.textSearch } || {};
}

export function getModConfig(key: string | number) {
  return config[key];
}

export function getActionConfig(key: string | number) {
  return ActionCfg[key];
}

export function getActionButton(key: string) {
  if (ActionCfg[key] && ActionCfg[key].btns) {
    return { ...ActionCfg[key].btns };
  }
  return {};
}

export function getBtnClickEvent(
  key: string
): (ref?: object, rs?: (arg0: any) => void, rj?: (arg0: any) => void) => void {
  const cfg = ActionCfg[key];
  if (!cfg) {
    return () => {
      Modal.error({
        title: `${key}未配置`,
        content: `${key}未配置`
      });
    };
  }
  if (cfg.directlySubmit) {
    if (!cfg.confirm) {
      const rst = (
        ref?: object,
        rs?: (arg0: any) => void,
        rj?: (arg0: any) => void
      ) => {
        if (cfg.submit) {
          submit(cfg.submit.url, ref, cfg.submit.data).then(
            r => {
              message.success(r.message);
              if (rs) {
                rs(r);
              }
            },
            e => {
              if (rj) {
                rj(e);
              }
            }
          );
        }
      };
      return rst;
    }
    const rst = (
      ref?: object,
      rs?: (arg0: any) => void,
      rj?: (arg0: any) => void
    ) => {
      const modal = Modal.confirm({});
      const m = {
        content: cfg.confirm,
        title: cfg.title || "请确认",
        cancelText: "取消",
        okText: "确定",
        onOk: () => {
          if (cfg.submit) {
            submit(cfg.submit.url, ref, cfg.submit.data).then(
              r => {
                modal.destroy();
                message.success(r.message);
                if (rs) {
                  rs(r);
                }
              },
              e => {
                if (rj) {
                  rj(e);
                }
              }
            );
          }
        }
      };
      modal.update(m);
    };
    return rst;
  }
  if (cfg.path) {
    const rst = (ref?: object) => {
      const routerConfig: RouteData = {
        pathname: cfg.path || "",
        state: ref ? { ...ref } : {}
      };
      router.push(routerConfig);
    };
    return rst;
  }
  return () => {
    Modal.error({
      title: `${key}配置错误`,
      content: `${key}配置错误`
    });
  };
}

export function btnClickEvent(btns?: object, actionMap?: object) {
  const newBtns: IModBtn[] = [];
  if (btns) {
    Object.keys(btns).forEach(btn => {
      if (actionMap && actionMap[btn]) {
        newBtns.push({ ...btns[btn], onClick: actionMap[btn], authority: btn });
      } else {
        newBtns.push({
          ...btns[btn],
          onClick: getBtnClickEvent(btn),
          authority: btn
        });
      }
    });
  }
  return newBtns;
}

export const getRowBtnArray = function <T>(data: T, btns: IModBtn[]) {
  let rst: IModBtn[] = [];
  if (!btns) {
    return rst;
  }
  rst = [...btns];

  rst = rst
    .map(btn => {
      if (btn.show) {
        const flag = Object.keys(btn.show)
          .map(item => {
            if (btn.show && btn.show[item].indexOf(data[item]) === -1) {
              if (Number(data[item]) !== 0 && !Number(data[item]))
                return false;
              if (btn.show[item].indexOf(Number(data[item])) === -1)
                return false;
            }
            return true;
          })
          .find(item => item === false);
        if (flag === false) return null;
      }
      return btn;
    })
    .filter(isNotNull);

  return rst;
}

export function isNotNull<T>(arg: T | null): arg is T {
  return arg !== null;
}

export function isNotUndefined<T>(arg: T | undefined): arg is T {
  return arg !== undefined;
}

export function colDisplay(
  v: string | number | string[] | number[] | undefined,
  type: string,
  row: any
) {
  const rst: any[] = [];
  if (!v) return "";
  switch (type) {
    case "date":
    case "number":
    case "time":
    case "ArrayEdit":
    case "intNumber":
      return v;
    case "Specify":
      if (Array.isArray(v)) {
        v.forEach((i: string | number) => {
          rst.push(getEnum("EmpAccount")[i]);
        });
      }
      return rst.join(",");
    case "ErpSuppId":
      return v ? "ES0" + v : v;
    default:
      break;
  }

  const e = getEnum(type, row, undefined);
  if (e && (typeof v === "string" || typeof v === "number")) {
    if (e[v] || e[Number(v)]) {
      return e[v] || e[Number(v)];
    }
  }
  return "";
}


export function colorfun(item: { flow: string | number; }) {
  let flowColor = {}
  switch (item.flow) {
    case '0':
      flowColor = { color: '#333' }
      break;
    case '1':
      flowColor = { color: '#333' }
      break;
    case '2':
      flowColor = { color: '#FFCC00' }
      break;
    case '3':
      flowColor = { color: 'red' }
      break;
    case '4':
      flowColor = { color: 'green' }
      break;
    default:
      flowColor = { color: '#333' }
  }
  return flowColor;
}

export function dock_height(showSerach: boolean = true) {
  const curWidth = window.innerWidth;
  const curHight = window.innerHeight;
  let height = curHight;
  if(curWidth > 990){
    height = curHight - 154 - (showSerach?106:0);
  }else{
    height = curHight - 154 - (showSerach?146:0);
  }
  return height;
}