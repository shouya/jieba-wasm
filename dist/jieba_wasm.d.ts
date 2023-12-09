declare namespace wasm_bindgen {
	/* tslint:disable */
	/* eslint-disable */
	/**
	* @returns {JiebaInstance}
	*/
	export function new_jieba(): JiebaInstance;
	/**
	* @param {JiebaInstance} instance
	* @param {string} s
	* @param {any} mode
	* @param {boolean} hmm
	* @returns {string}
	*/
	export function cut(instance: JiebaInstance, s: string, mode: any, hmm: boolean): string;
	/**
	* @param {JiebaInstance} instance
	* @param {string} s
	* @param {boolean} hmm
	* @returns {string}
	*/
	export function tag(instance: JiebaInstance, s: string, hmm: boolean): string;
	/**
	*/
	export class JiebaInstance {
	  free(): void;
	}
	
}

declare type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

declare interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_jiebainstance_free: (a: number) => void;
  readonly new_jieba: () => number;
  readonly cut: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly tag: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
declare function wasm_bindgen (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
