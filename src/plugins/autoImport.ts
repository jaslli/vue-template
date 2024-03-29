/**
 * @name RegistryAutoImport
 * @description 按需加载，自动引入
 */
import AutoImport from 'unplugin-auto-import/vite';

export const RegistryAutoImport = () => {
	return AutoImport({
		// 指定生成文件的位置，true表示使用默认的
		dts: 'types/auto-imports.d.ts',
		// 目标文件
		include: [
			/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
			/\.vue$/,
			/\.vue\?vue/, // .vue
			/\.md$/ // .md
		],
		// 全局引入插件
		imports: ['vue', 'pinia', 'vue-router', { '@vueuse/core': [] }]
		// 解析器
		// resolvers:
	});
};
