import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from '/@/plugins/nprogress';
import HelloWorld from '/@/components/HelloWorld.vue';

const routes = [
	{
		path: '/',
		component: HelloWorld
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

router.beforeEach(async (_to, _from, next) => {
	NProgress.start();
	next();
});

router.afterEach((_to) => {
	NProgress.done();
});

export default router;
