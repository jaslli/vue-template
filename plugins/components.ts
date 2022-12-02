/**
 * @name RegistryComponents
 * @description 按需加载，自动引入
 */

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export const RegistryComponents = () => {
  return Components({
    resolvers: [ElementPlusResolver()]
  });
};
