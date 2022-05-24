export default {
  path: '/order-management',
  name: 'order-management',
  routes: [
    {
      name: 'normal-order',
      path: '/order-management/normal-order',
      component: './order-management/normal-order',
    },
    {
      name: 'order-detail',
      path: '/order-management/order-detail/:id',
      component: './order-management/order-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-order-detail',
      path: '/order-management/intensive-order-detail/:id',
      component: './order-management/intensive-order-detail',
      hideInMenu: true,
    },
    {
      name: 'normal-order-detail',
      path: '/order-management/normal-order-detail/:id',
      component: './order-management/normal-order-detail',
      hideInMenu: true,
    },
    {
      name: 'intensive-order',
      path: '/order-management/intensive-order',
      component: './order-management/intensive-order'
    },
    {
      name: 'sample-order',
      path: '/order-management/sample-order',
      component: './order-management/sample-order',
    },
    {
      name: 'sample-order-detail',
      path: '/order-management/sample-order-detail/:id',
      component: './order-management/sample-order-detail',
      hideInMenu: true,
    },
    {
      name: 'after-sales-order',
      path: '/order-management/after-sales-order',
      component: './order-management/after-sales-order',
    },
    {
      name: 'detail',
      path: '/order-management/after-sales-order/detail/:id',
      component: './order-management/after-sales-order/detail',
      hideInMenu: true
    },
    {
      name: 'intensive-after-sales',
      path: '/order-management/intensive-after-sales',
      component: './order-management/intensive-after-sales',
    },
    {
      name: 'intensive-after-sales-detail',
      path: '/order-management/intensive-after-sales/detail/:id',
      component: './order-management/intensive-after-sales/detail',
      hideInMenu: true
    },
    {
      name: 'intensive-purchase-order',
      path: '/order-management/intensive-purchase-order',
      component: './order-management/intensive-purchase-order',
    },
    {
      name: 'stockout-apply',
      path: '/order-management/stockout-apply',
      component: './order-management/stockout-apply',
    },
    {
      name: 'purchase-statistics',
      path: '/order-management/purchase-statistics',
      component: './order-management/purchase-statistics',
    }
  ]
}
