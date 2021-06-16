import { defineConfig } from 'umi';

export default defineConfig({
  title: 'CronWeb',
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [{ path: '/', component: 'index' }],
    },
  ],
  fastRefresh: {},
  antd: false,
});
