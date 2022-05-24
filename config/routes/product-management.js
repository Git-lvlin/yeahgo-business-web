export default {
  path: '/product-management',
  name: 'product-management',
  routes: [
    {
      name: 'product-list',
      path: '/product-management/product-list',
      component: './product-management/product-list',
    },
    {
      name: 'product-detail',
      path: '/product-management/product-detail/:id',
      component: './product-management/product-detail',
      hideInMenu: true,
    },
    {
      name: 'pending-product',
      path: '/product-management/pending-product',
      component: './product-management/pending-product',
    },
    {
      name: 'reject-product',
      path: '/product-management/reject-product',
      component: './product-management/reject-product',
    },
    {
      name: 'stock-warn-product',
      path: '/product-management/stock-warn-product',
      component: './product-management/stock-warn-product',
    },
    {
      name: 'freight-template',
      path: '/product-management/freight-template',
      component: './product-management/freight-template',
    },
    {
      name: 'drafts-list',
      path: '/product-management/drafts-list',
      component: './product-management/drafts-list',
    },
    // {
    //   name: 'inventory-warning-goos-list',
    //   path: '/product-management/inventory-warning-goos-list',
    //   component: './product-management/inventory-warning-goos-list'
    // }
    {
      name: 'ship-address-management',
      path: '/product-management/ship-address-management',
      component: './product-management/ship-address-management',
    },
    { name: 'evaluate-list',
      path: '/product-management/commodity-evaluate/evaluate-list',
      component: './product-management/commodity-evaluate/evaluate-list'
    },
    {
      name: 'good-reputation',
      path: '/product-management/commodity-evaluate/evaluate-list/good-reputation',
      component: './product-management/commodity-evaluate/good-reputation',
      hideInMenu: true
    }
  ]
}
