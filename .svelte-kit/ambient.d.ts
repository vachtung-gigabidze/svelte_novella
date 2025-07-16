
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const VITE_SUPABASE_URL: string;
	export const VITE_SUPABASE_ANON_KEY: string;
	export const NODE_ENV: string;
	export const PSExecutionPolicyPreference: string;
	export const TERM_SESSION_ID: string;
	export const CommonProgramW6432: string;
	export const ProgramW6432: string;
	export const USERNAME: string;
	export const ALLUSERSPROFILE: string;
	export const USERPROFILE: string;
	export const PROCESSOR_REVISION: string;
	export const POWERSHELL_DISTRIBUTION_CHANNEL: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const PUBLIC: string;
	export const Path: string;
	export const DriverData: string;
	export const HOMEDRIVE: string;
	export const SESSIONNAME: string;
	export const LOGONSERVER: string;
	export const TERMINAL_EMULATOR: string;
	export const HOMEPATH: string;
	export const SystemRoot: string;
	export const WebStorm: string;
	export const ChocolateyInstall: string;
	export const VS140COMNTOOLS: string;
	export const LOCALAPPDATA: string;
	export const APPDATA: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PATHEXT: string;
	export const PSModulePath: string;
	export const GHCUP_INSTALL_BASE_PREFIX: string;
	export const CABAL_DIR: string;
	export const JETBRAINS_INTELLIJ_COMMAND_END_MARKER: string;
	export const OS: string;
	export const USERDNSDOMAIN: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const INTELLIJ_TERMINAL_COMMAND_BLOCKS_REWORKED: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const ComSpec: string;
	export const PROCESSOR_LEVEL: string;
	export const windir: string;
	export const PROCESS_LAUNCHED_BY_CW: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const ProgramFiles: string;
	export const GHCUP_MSYS2_ENV: string;
	export const TEMP: string;
	export const TMP: string;
	export const PROCESS_LAUNCHED_BY_Q: string;
	export const OneDrive: string;
	export const USERDOMAIN: string;
	export const SystemDrive: string;
	export const FIG_TERM: string;
	export const ProgramData: string;
	export const COMPUTERNAME: string;
	export const VS90COMNTOOLS: string;
	export const ChocolateyLastPathUpdate: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const CommonProgramFiles: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_SUPABASE_URL: string;
		VITE_SUPABASE_ANON_KEY: string;
		NODE_ENV: string;
		PSExecutionPolicyPreference: string;
		TERM_SESSION_ID: string;
		CommonProgramW6432: string;
		ProgramW6432: string;
		USERNAME: string;
		ALLUSERSPROFILE: string;
		USERPROFILE: string;
		PROCESSOR_REVISION: string;
		POWERSHELL_DISTRIBUTION_CHANNEL: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		PUBLIC: string;
		Path: string;
		DriverData: string;
		HOMEDRIVE: string;
		SESSIONNAME: string;
		LOGONSERVER: string;
		TERMINAL_EMULATOR: string;
		HOMEPATH: string;
		SystemRoot: string;
		WebStorm: string;
		ChocolateyInstall: string;
		VS140COMNTOOLS: string;
		LOCALAPPDATA: string;
		APPDATA: string;
		PROCESSOR_IDENTIFIER: string;
		PATHEXT: string;
		PSModulePath: string;
		GHCUP_INSTALL_BASE_PREFIX: string;
		CABAL_DIR: string;
		JETBRAINS_INTELLIJ_COMMAND_END_MARKER: string;
		OS: string;
		USERDNSDOMAIN: string;
		PROCESSOR_ARCHITECTURE: string;
		INTELLIJ_TERMINAL_COMMAND_BLOCKS_REWORKED: string;
		NUMBER_OF_PROCESSORS: string;
		ComSpec: string;
		PROCESSOR_LEVEL: string;
		windir: string;
		PROCESS_LAUNCHED_BY_CW: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		ProgramFiles: string;
		GHCUP_MSYS2_ENV: string;
		TEMP: string;
		TMP: string;
		PROCESS_LAUNCHED_BY_Q: string;
		OneDrive: string;
		USERDOMAIN: string;
		SystemDrive: string;
		FIG_TERM: string;
		ProgramData: string;
		COMPUTERNAME: string;
		VS90COMNTOOLS: string;
		ChocolateyLastPathUpdate: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		CommonProgramFiles: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
