/**
 * @name RegistryComponents
 * @description 按需加载，自动引入
 */

import Components from 'unplugin-vue-components/vite'

export const RegistryComponents = () => {
  return Components({
    dts: 'types/components.d.ts',
    dirs: ['src/components'],
    // resolvers: [ElementPlusResolver()]
  });
};
