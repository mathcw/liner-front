/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings
} from "@ant-design/pro-layout";
import React from "react";
import Link from "umi/link";
import { Dispatch } from "redux";
import { connect } from "dva";
import { Result, Button } from "antd";
import { formatMessage } from "umi-plugin-react/locale";

import Authorized from "@/utils/Authorized";
import Footer from "@/components/Footer";
import RightContent from "@/components/GlobalHeader/RightContent";
import { ConnectState } from "@/models/connect";
import { getAuthorityFromRouter, isNotNull } from "@/utils/utils";
import logo from "@/assets/logo.png";

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps["route"] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in "location"]: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  const list: MenuDataItem[] = menuList.filter(
    item => item && !item.hideInMenu
  );
  return list.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : []
    };
    // 有子路由 但权限过滤后没有 则整个父 无权限
    if (item.children && item.children.length > 0 && (!localItem.children || localItem.children.length === 0)) {
      return null;
    }
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  }).filter(isNotNull);
};

const footerRender: BasicLayoutProps["footerRender"] = () => {
  return <Footer />;
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings, location = { pathname: "/" } } = props;
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: "global/changeLayoutCollapsed",
        payload
      });
    }
  };
  // get children authority
  const authorized = getAuthorityFromRouter(
    props.route.routes,
    location.pathname || "/"
  ) || {
    authority: undefined
  };

  return (
    <ProLayout
      logo={logo}
      title="Liner"
      menuHeaderRender={(logoDom, titleDom) => <Link to="/">{logoDom}</Link>}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }
        if(menuItemProps.path)
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        return null
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: "/",
          breadcrumbName: formatMessage({
            id: "menu.home",
            defaultMessage: "Home"
          })
        },
        ...routers
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join("/")}>{route.breadcrumbName}</Link>
        ) : (
            <span>{route.breadcrumbName}</span>
          );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings
}))(BasicLayout);
