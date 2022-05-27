import { init } from '../serverless.js';

export const handler = init({
	appDir: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		entry: {"file":"start-fcb96bda.js","js":["start-fcb96bda.js","chunks/index-a3903d73.js"],"css":[]},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js')
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
