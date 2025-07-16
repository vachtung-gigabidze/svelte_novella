export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.CO2x_siZ.js",app:"_app/immutable/entry/app.ysFtFMG0.js",imports:["_app/immutable/entry/start.CO2x_siZ.js","_app/immutable/chunks/DHlxbbUY.js","_app/immutable/chunks/kH2h1Uu3.js","_app/immutable/chunks/C9XM0pXT.js","_app/immutable/entry/app.ysFtFMG0.js","_app/immutable/chunks/_szbnJkv.js","_app/immutable/chunks/C9XM0pXT.js","_app/immutable/chunks/kH2h1Uu3.js","_app/immutable/chunks/NZTpNUN0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
