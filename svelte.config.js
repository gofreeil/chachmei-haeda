import adapterVercel from '@sveltejs/adapter-vercel';
import adapterNode from '@sveltejs/adapter-node';

const useNode = process.env.DEPLOY_TARGET === 'node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: useNode ? adapterNode() : adapterVercel(),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		}
	}
};

export default config;
