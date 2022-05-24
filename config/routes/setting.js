export default {
  path: '/setting',
  name: 'setting',
  routes: [
    {
      name: 'account-info',
      path: '/setting/account-info',
      component: './setting/account-info',
    },
    {
      name: 'account-management',
      path: '/setting/account-management',
      component: './setting/account-management',
    },
    {
      name: 'role-management',
      path: '/setting/role-management',
      component: './setting/role-management',
    },
    {
      name: 'authority-management',
      path: '/setting/authority-management',
      component: './setting/authority-management',
    },
    {
      name: 'after-sale-address',
      path: '/setting/after-sale-address',
      component: './setting/after-sale-address',
    },
    {
      name: 'password',
      path: '/setting/password',
      component: './setting/password',
    },
    {
      name: 'trade-password',
      path: '/setting/trade-password',
      component: './setting/trade-password',
    },
    {
      name: 'reset-password',
      path: '/setting/reset-password',
      component: './setting/trade-password/reset-password',
    },
    {
      name: 'set-password',
      path: '/setting/set-password',
      component: './setting/trade-password/set-password',
    },
    // {
    //   name: 'business-information',
    //   path: '/setting/business-information',
    //   component: './setting/business-information'
    // }
  ]
}
