/**
 *  参照fast-vue3的设计
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { RegistryAutoImport } from './autoImport'
import { RegistryComponents } from './components'


export function createVitePlugins() {
  // 默认的plugins数组
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // vue支持
    vue()
  ];

  // 自动按需引入依赖
  vitePlugins.push(RegistryAutoImport());
  // 自动按需引入组件
  vitePlugins.push(RegistryComponents());

  return vitePlugins
}