// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent;
	export default component;
}
