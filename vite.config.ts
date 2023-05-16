import { defineConfig } from 'vite';
import { createVitePlugins } from '/@/plugins';
import { resolve } from 'path';

declare const process: NodeJS.Process;

/** 路径查找 */
const pathResolve = (dir: string): string => {
	return resolve(process.cwd(), '.', dir);
};

/** 设置别名 */
const alias: Record<string, string> = {
	'/@': pathResolve('src'),
	'/#': pathResolve('types')
};

export default defineConfig({
	// 别名配置
	resolve: {
		alias
	},
	// plugins
	plugins: createVitePlugins(),
	// server
	server: {
		host: '0.0.0.0', // 类型： string | boolean IP配置，支持从IP启动
		port: 5173, // 类型： number  | 指定服务启动端口
		https: false, // 类型： boolean | https.ServerOptions 是否开启 https
		open: false, // 类型： boolean | string 在服务启动时自动在浏览器中打开
		hmr: { overlay: false }, // 禁用或配置 HMR 连接
		proxy: {
			//  类型： Record<string, string | ProxyOptions> 服务器配置自定义代理规则
			'/api': {
				target: 'http://localhost:9888',
				changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
				rewrite: (path) => path.replace(/^\/api/, '')
			}
		},
		cors: true // 类型： boolean | 是否允许跨域
	}
});
