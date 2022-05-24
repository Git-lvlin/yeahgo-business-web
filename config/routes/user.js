export default {
  path: '/user',
  component: '../layouts/UserLayout',
  name: 'user',
  routes: [
    {
      path: '/user',
      redirect: '/user/login',
    },
    {
      path: '/user/login',
      name: '登录',
      component: './user/login',
    },
    {
      name: 'register-result',
      icon: 'smile',
      path: '/user/register-result',
      component: './user/register-result',
    },
    {
      name: 'register',
      icon: 'smile',
      path: '/user/register',
      component: './user/register',
    },
    {
      component: '404',
    },
  ],
}
