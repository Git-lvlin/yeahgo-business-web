export default {
  path: '/mail',
  name: 'mail',
  routes: [
    {
      name: 'mail-list',
      path: '/mail/mail-list',
      component: './mail/mail-list',
    },
    {
      name: 'customer-service',
      path: '/mail/customer-service',
      component: './mail/customer-service',
    }
  ]
}
