import { useUserStore } from './modules/user';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

// 暴露模块中的store
export { useUserStore };

export default pinia;
