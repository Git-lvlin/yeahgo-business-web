/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  // DefaultFooter,
  SettingDrawer
} from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link, useIntl, connect, history } from 'umi';
// import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import { setAuthority, getAuthority } from '@/utils/authority';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '@/assets/logo.png';
import { cacheUserAuths } from '@/services/common';
import './BasicLayout.less'

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/** Use Authorized check all menu item */


// const defaultFooterDom = (
//   <DefaultFooter
//     copyright={`${new Date().getFullYear()} 蚂蚁集团体验技术部出品`}
//     links={[
//       {
//         key: 'Ant Design Pro',
//         title: 'Ant Design Pro',
//         href: 'https://pro.ant.design',
//         blankTarget: true,
//       },
//       {
//         key: 'github',
//         title: <GithubOutlined />,
//         href: 'https://github.com/ant-design/ant-design-pro',
//         blankTarget: true,
//       },
//       {
//         key: 'Ant Design',
//         title: 'Ant Design',
//         href: 'https://ant.design',
//         blankTarget: true,
//       },
//     ]}
//   />
// );

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);
  const [auth, setAuth] = useState(getAuthority);


  const menuDataRender = useCallback(
    (menuList) => {
      // const auth = getAuthority();
      if (!auth) {
        return null;
      }
      return menuList.map((item) => {
        const localItem = {
          ...item,
          children: item.children ? menuDataRender(item.children) : undefined,
        };
        return auth.find(it => it.url === item.path.substring(1)) ? localItem : null;
        // return localItem;
      });
    },
    [auth],
  )

  useEffect(() => {
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //   });
    // }
    cacheUserAuths()
      .then(res => {
        if (res.code === 0) {
          setAuthority(res.data.records)
          setAuth(res.data.records);
        }
      })
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const { formatMessage } = useIntl();
  return (
    <>
      {
        auth && <ProLayout
          logo={logo}
          formatMessage={formatMessage}
          {...props}
          {...settings}
          onCollapse={handleMenuCollapse}
          onMenuHeaderClick={() => history.push('/')}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (
              menuItemProps.isUrl ||
              !menuItemProps.path ||
              location.pathname === menuItemProps.path
            ) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
              }),
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={() => {
            // if (settings.footerRender || settings.footerRender === undefined) {
            //   return defaultFooterDom;
            // }

            return null;
          }}
          menuDataRender={menuDataRender}
          rightContentRender={() => <RightContent />}
          postMenuData={(menuData) => {
            menuDataRef.current = menuData || [];
            return menuData || [];
          }}
        >
          <Authorized authority={authorized.authority} noMatch={noMatch}>
            {children}
          </Authorized>
        </ProLayout>
      }
    </>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
