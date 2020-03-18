import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from '/Users/wangcheng/www/liner-front/src/pages/.umi/LocaleWrapper.jsx';
import _dvaDynamic from 'dva/dynamic';

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    path: '/user',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BlankLayout" */ '../../layouts/BlankLayout'),
        })
      : require('../../layouts/BlankLayout').default,
    routes: [
      {
        path: '/user',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__UserLayout" */ '../../layouts/UserLayout'),
            })
          : require('../../layouts/UserLayout').default,
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__user__login" */ '../user/login'),
                })
              : require('../user/login').default,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__BlankLayout" */ '../../layouts/BlankLayout'),
        })
      : require('../../layouts/BlankLayout').default,
    routes: [
      {
        path: '/',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "layouts__SecurityLayout" */ '../../layouts/SecurityLayout'),
            })
          : require('../../layouts/SecurityLayout').default,
        routes: [
          {
            path: '/',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__BasicLayout" */ '../../layouts/BasicLayout'),
                })
              : require('../../layouts/BasicLayout').default,
            routes: [
              {
                path: '/',
                redirect: '/home',
                exact: true,
              },
              {
                name: '行政管理',
                path: '/org',
                routes: [
                  {
                    path: '/org/account/list',
                    name: '账号管理',
                    authority: '账号管理',
                    viewConfig: '账号管理',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../org/account/list'),
                        })
                      : require('../org/account/list').default,
                    exact: true,
                  },
                  {
                    path: '/org/auth/list',
                    name: '权限设置',
                    authority: '权限管理',
                    viewConfig: '权限管理',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../org/auth/list'),
                        })
                      : require('../org/auth/list').default,
                    exact: true,
                  },
                  {
                    path: '/org/auth/add',
                    name: '新增权限',
                    authority: '新增权限',
                    viewConfig: '新增权限',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../org/auth/edit'),
                        })
                      : require('../org/auth/edit').default,
                    exact: true,
                  },
                  {
                    path: '/org/auth/edit',
                    name: '编辑权限',
                    authority: '编辑权限',
                    viewConfig: '编辑权限',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../org/auth/edit'),
                        })
                      : require('../org/auth/edit').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                name: '业务配置',
                path: '/business',
                routes: [
                  {
                    path: '/business/commDct/list',
                    name: '数据字典',
                    authority: '数据字典',
                    viewConfig: '数据字典',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/commDct/list'),
                        })
                      : require('../business/commDct/list').default,
                    exact: true,
                  },
                  {
                    path: '/business/city/list',
                    name: '城市设置',
                    authority: '城市设置',
                    viewConfig: '城市设置',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/city/list'),
                        })
                      : require('../business/city/list').default,
                    exact: true,
                  },
                  {
                    path: '/business/cruiseCompany/list',
                    name: '邮轮公司',
                    authority: '邮轮公司',
                    viewConfig: '邮轮公司',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/cruiseCompany/list'),
                        })
                      : require('../business/cruiseCompany/list').default,
                    exact: true,
                  },
                  {
                    path: '/business/cruiseCompany/add',
                    name: '新增邮轮公司',
                    authority: '新增邮轮公司',
                    viewConfig: '新增邮轮公司',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/cruiseCompany/edit'),
                        })
                      : require('../business/cruiseCompany/edit').default,
                    exact: true,
                  },
                  {
                    path: '/business/cruiseCompany/edit',
                    name: '修改邮轮公司',
                    authority: '修改邮轮公司',
                    viewConfig: '修改邮轮公司',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/cruiseCompany/edit'),
                        })
                      : require('../business/cruiseCompany/edit').default,
                    exact: true,
                  },
                  {
                    path: '/business/cruise/list',
                    name: '邮轮设置',
                    authority: '邮轮设置',
                    viewConfig: '邮轮设置',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/cruise/list'),
                        })
                      : require('../business/cruise/list').default,
                    exact: true,
                  },
                  {
                    path: '/business/cruise/add',
                    name: '新增邮轮',
                    authority: '新增邮轮',
                    viewConfig: '新增邮轮',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/cruise/edit'),
                        })
                      : require('../business/cruise/edit').default,
                    exact: true,
                  },
                  {
                    path: '/business/cruise/edit',
                    name: '修改邮轮',
                    authority: '修改邮轮',
                    viewConfig: '修改邮轮',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../business/cruise/edit'),
                        })
                      : require('../business/cruise/edit').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                name: '系统设置',
                path: '/sys',
                routes: [
                  {
                    path: '/sys/flow/list',
                    name: '业务流程',
                    authority: '业务流程',
                    viewConfig: '业务流程',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../sys/flow/list'),
                        })
                      : require('../sys/flow/list').default,
                    exact: true,
                  },
                  {
                    path: '/sys/flow/edit',
                    name: '修改流程',
                    viewConfig: '修改流程',
                    hideInMenu: true,
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../sys/flow/edit'),
                        })
                      : require('../sys/flow/edit').default,
                    exact: true,
                  },
                  {
                    path: '/sys/api/list',
                    name: 'api管理',
                    authority: 'api管理',
                    viewConfig: 'api管理',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../sys/api/list'),
                        })
                      : require('../sys/api/list').default,
                    exact: true,
                  },
                  {
                    path: '/sys/config/setting',
                    name: '参数设置',
                    authority: '系统参数设置',
                    viewConfig: '系统参数设置',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../sys/config/setting'),
                        })
                      : require('../sys/config/setting').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                parent: '/',
                routes: [
                  {
                    path: '/home',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          app: require('@tmp/dva').getApp(),
                          models: () => [
                            import(/* webpackChunkName: 'p__DashboardAnalysis__model.tsx' */ '/Users/wangcheng/www/liner-front/src/pages/DashboardAnalysis/model.tsx').then(
                              m => {
                                return { namespace: 'model', ...m.default };
                              },
                            ),
                          ],
                          component: () =>
                            import(/* webpackChunkName: "layouts__BasicLayout" */ '../DashboardAnalysis'),
                        })
                      : require('../DashboardAnalysis').default,
                    exact: true,
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                  },
                ],
              },
              {
                path: '/exception/403',
                name: 'not-permission',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../exception/403'),
                    })
                  : require('../exception/403').default,
                hideInMenu: true,
                exact: true,
              },
              {
                path: '/exception/404',
                name: 'not-find',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__BasicLayout" */ '../404'),
                    })
                  : require('../404').default,
                hideInMenu: true,
                exact: true,
              },
              {
                component: () =>
                  React.createElement(
                    require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
              },
            ],
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "p__404" */ '../404'),
                })
              : require('../404').default,
            hideInMenu: true,
            exact: true,
          },
          {
            component: () =>
              React.createElement(
                require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
          },
        ],
      },
      {
        component: () =>
          React.createElement(
            require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
      },
    ],
  },
  {
    path: '/exception/404',
    name: 'not-find',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () => import(/* webpackChunkName: "p__404" */ '../404'),
        })
      : require('../404').default,
    hideInMenu: true,
    exact: true,
  },
  {
    component: () =>
      React.createElement(
        require('/Users/wangcheng/www/liner-front/node_modules/_umi-build-dev@1.18.0@umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
