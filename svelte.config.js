import adapterAuto from '@sveltejs/adapter-auto';
import adapterNode from '@sveltejs/adapter-node';

// Vercel → adapter-auto (ברירת מחדל)
// Arxentra / Node.js → DEPLOY_TARGET=node → adapter-node (מייצר build/index.js)
const useNode = process.env.DEPLOY_TARGET === 'node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: useNode ? adapterNode() : adapterAuto(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// ignore broken links to non-existent stubs (e.g. /login, /profile from Header)
				if (path && (path.startsWith('/login') || path.startsWith('/profile') || path.startsWith('/about') || path.startsWith('/search') || path.startsWith('/api'))) {
					return;
				}
				throw new Error(`${message} (linked from ${referrer})`);
			}
		}
	}
};

export default config;
