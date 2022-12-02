# 配置

## tsconfig.json

编译器的设置，主要是设置需要扫描的`.ts`文件，即设置`include`和`exclude`的选项，避免出现ts无法被编译的情况。还有一个比较重要的设置就是`compilerOptions.path`，设置别名，在`vite.config.ts`中设置了别名之后，最好再来这里设置一下。

```json
{
  // compilerOptions  ts编译器的设置选项
  "compilerOptions": {
    // target ts编译后的版本
    "target": "ESNext",
    // module 指定使用的模块规范
    "module": "ESNext",
    // lib  指定编译中的库
    "lib": ["ESNext", "DOM"],
    // strict  是否启动所有类型检查
    "strict": true,
    // allowJs  是否编译JS，默认为false
    "allowJs": true,
    // sourceMap  编译是否生成.map文件
    "sourceMap": true,
    // baseUrl  指定解析非相对模块名称的基本目录
    "baseUrl": ".",
    // 通过导入内容创建命名空间，实现CommonJS和ES模块之间的互操作性
    "esModuleInterop": true,
    // useDefineForClassFields  将 class 声明中的字段语义从 [[Set]] 变更到 [[Define]]
    "useDefineForClassFields": true,
    // noUnusedLocals  检查是否有定义了但是没有使用变量
    "noUnusedLocals": true,
    // noUnusedParameters  检查是否在函数中没有使用的参数
    "noUnusedParameters": true,
    // noImplicitAny  默认将没有明确类型的值指定为any类型
    "noImplicitAny": false,
    // skipLibCheck  跳过类型不一致检查
    "skipLibCheck": true,
    // moduleResolution  选择模块解析策略，有"node"和"classic"两种类型
    "moduleResolution": "Node",
    "jsx": "preserve",
    // resolveJsonModule  可以在ts中引入json模块
    "resolveJsonModule": true,
    // isolatedModules  将每个文件作为单独的模块
    "isolatedModules": true,
    // noEmit  不生成编译文件
    "noEmit": true,
    // paths  设置模块名到基于baseUrl的路径映射
    "paths": {
      "/@/*": ["src/*"]
    }
  },
  // include  指定需要编译的ts文件
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "plugins/*.ts",
    "vite.config.ts",
    "./auto-imports.d.ts",
    "./components.d.ts"
  ],
  // exclude  指定不需要被编译的ts目录文件
  "exclude": ["node_modules", "dist", "**/*.js"]
}

```



## vite.config.ts

参照`fast-vue3`的设计

### 别名设置

```ts
import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
  // 别名配置
  resolve: {
    alias: [
      // /@/xxxx => src/xxxx 
      {
        find: /\/@\//,
        replacement: pathResolve('src') + '/',
      },
    ]
  },
})

// process需要依赖@types/node
// 请先yarn add @types/node
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
```

别忘了再去`tsconfig.json`中设置。

### 插件设置

```ts
import { defineConfig } from 'vite'
import { createVitePlugins } from './plugins';

export default defineConfig({
  // plugins
  plugins: createVitePlugins(),
})

```

```ts
/**
 * 之后的插件设置进行分开设置然后加入到plugins数组
 * 具体配置请参考./plugins文件夹
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';


export function createVitePlugins() {
  // 默认的plugins数组
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // vue支持
    vue()
  ];

  return vitePlugins
}
```





# 安装依赖

## 自动导入

安装自动导入依赖

```bash
# 自动导入
yarn add -D unplugin-vue-components unplugin-auto-import
```

自动导入配置参考里的`autoImport.ts`和`components.ts`

### 插件配置(autoImport.ts)

```ts
/**
 * @name RegistryAutoImport
 * @description 按需加载，自动引入
 */
import AutoImport from 'unplugin-auto-import/vite';

export const RegistryAutoImport = () => {
  return AutoImport({
    // 指定生成文件的位置，true表示使用默认的
    dts: true,
    // 目标文件
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/, /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    // 全局引入插件
    imports: [
      'vue',
      'pinia',
      'vue-router',
      {
        '@vueuse/core': [],
      },
    ],
    // 解析器
    resolvers:
  });
};

```

### 插件配置(components.ts)

```ts
/**
 * @name RegistryComponents
 * @description 按需加载，自动引入
 */

import Components from 'unplugin-vue-components/vite'

export const RegistryComponents = () => {
  return Components({
    resolvers:
  });
};

```



## vue-router4

安装依赖

```bash
yarn add vue-router@4
```

配置文件

```ts
import { createRouter,createWebHashHistory } from 'vue-router'

import HelloWorld from '/@/components/HelloWorld.vue'

const routes = [
  {
    path: '/',
    component: HelloWorld
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

在`main.ts`中去使用该路由

```ts
import { createApp } from 'vue'
import router from './router';
import App from './App.vue'

const app = createApp(App);
app.use(router);
app.mount('#app')
```

## pinia

安装`pinia`依赖

```bash
yarn add pinia
```

按模块进行管理配置

```ts
import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';

const pinia = createPinia();

// 暴露模块中的store
export { useUserStore };

export default pinia;
```

```ts
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({}),
    getters: {},
    actions: {},
},);
```

绑定给vue应用

```ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import piniaStore from './store';

const app = createApp(App);

app.use(router);
app.use(piniaStore);
app.mount('#app');
```

为了防止刷新等原因导致的pinia丢失数据，需要使用持久化插件帮我们存储

```bash
yarn add pinia-plugin-persistedstate
```

```ts
import { createPinia } from 'pinia';
import { useUserStore } from './modules/user';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 暴露模块中的store
export { useUserStore };

export default pinia;
```

