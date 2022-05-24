export default {
  path: '/financial-management',
  name: 'financial-management',
  routes: [
    {
      name: 'account-management',
      path: '/financial-management/account-management',
      component: './financial-management/account-management'
    },
    {
      name: 'transaction-details',
      path: '/financial-management/transaction-details',
      hideInMenu: true,
      component: './financial-management/transaction-details'
    },
    {
      name: 'account-settings',
      path: '/financial-management/account-settings',
      component: './financial-management/account-settings'
    },
    {
      name: 'withdrawal-record',
      path: '/financial-management/withdrawal-record',
      component: './financial-management/withdrawal-record'
    }
  ]
}
