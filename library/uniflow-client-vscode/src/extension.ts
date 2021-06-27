'use strict';

import * as vscode from 'vscode';
import * as fs from "fs";
import * as path from "path";
import { WASI } from "@wasmer/wasi";

declare const WebAssembly: any;

export function activate(context: vscode.ExtensionContext) {
	const instantiate = (): Promise<any> => {
		const wasmPath = path.resolve(__dirname, "../../uniflow-wasm-reverse-word/dist/optimized.wasm");
		return new Promise((resolve, reject) => {
			fs.readFile(wasmPath, (err, data) => {
				if (err) {
					reject(err);
					return;
				}
				const buf = new Uint8Array(data);
				resolve(WebAssembly.instantiate(buf, {
					env: {
						abort: (_msg:any, _file: any, line: any, column: any) =>
						  console.error(`Error at ${line}:${column}`)
					  } 
				})
					.then((result: any) => (result.instance))
				);
			});
		});
	}

	// code from https://www.assemblyscript.org/loader.html and https://github.com/AssemblyScript/assemblyscript/blob/main/lib/loader/index.js
	// Runtime header offsets
	const ID_OFFSET = -8;
	const SIZE_OFFSET = -4;

	const STRING_ID = 1;
	
	const STRING_SMALLSIZE = 192; // break-even point in V8
	const STRING_CHUNKSIZE = 1024; // mitigate stack overflow

	const getStringImpl = (buffer: any, ptr: any) => {
		let len = new Uint32Array(buffer)[ptr + SIZE_OFFSET >>> 2] >>> 1;
		const wtf16 = new Uint16Array(buffer, ptr, len);
		if (len <= STRING_SMALLSIZE) return String.fromCharCode(...wtf16);

		let str = "", off = 0;
		while (len - off > STRING_CHUNKSIZE) {
			str += String.fromCharCode(...wtf16.subarray(off, off += STRING_CHUNKSIZE));
		}
		return str + String.fromCharCode(...wtf16.subarray(off));
	}
	
	const __newString = (str: string, instance: any) => {
		if (str == null) return 0;
		const length = str.length;
		const ptr = instance.exports.__new(length << 1, STRING_ID);
		const U16 = new Uint16Array(instance.exports.memory.buffer);
		for (var i = 0, p = ptr >>> 1; i < length; ++i) U16[p + i] = str.charCodeAt(i);
		return ptr;
	}

	const __getString = (ptr: any, instance: any) => {
		if (!ptr) return null;
		const buffer = instance.exports.memory.buffer;
		const id = new Uint32Array(buffer)[ptr + ID_OFFSET >>> 2];
		if (id !== STRING_ID) throw Error(`not a string: ${ptr}`);
		return getStringImpl(buffer, ptr);
	}

	const disposable = vscode.commands.registerCommand('extension.reverseWord', async () => {
		let wasi = new WASI({
			args: [],
			env: {},
			bindings: {
			  ...WASI.defaultBindings
			}
		});

		let instance = await instantiate()
		wasi.start(instance);

		// Get the active text editor
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const word = document.getText(selection);

			const exports = instance.exports;
			const aPtr = __newString(word, instance);
			const cPtr = exports.reverseWord(aPtr);
			const cStr = __getString(cPtr, instance);

			const reversed = new String(cStr).toString();
			editor.edit(editBuilder => {
				editBuilder.replace(selection, reversed);
			});
		}
	});

	context.subscriptions.push(disposable);
}