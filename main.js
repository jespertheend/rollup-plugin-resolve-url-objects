import MagicString from "magic-string";

/** @type {import("rollup").PluginImpl} */
export default function resolveUrlObjects() {
	return {
		name: "resolve-url-objects",
		async transform(code, id) {
			if (!code.includes("@rollup-plugin-resolve-url-objects")) return null;

			const magicString = new MagicString(code);
			const re = /@rollup-plugin-resolve-url-objects(?<options>.*)[\s\S]+?new\s+URL\s*\((?<originalUrl>'.*'|".*")/gid;
			for (const match of code.matchAll(re)) {
				const startUrlIndex = match.indices.groups.originalUrl[0];
				const endUrlIndex = match.indices.groups.originalUrl[1];
				const originalUrl = match.groups.originalUrl.slice(1, -1);

				const workerResolveResult = await this.resolve(originalUrl, id);
				const chunkRefId = this.emitFile({
					type: "chunk",
					id: workerResolveResult.id,
				});
				const newUrl = `import.meta.ROLLUP_FILE_URL_${chunkRefId}`;
				magicString.overwrite(startUrlIndex, endUrlIndex, newUrl);
			}

			return {
				code: magicString.toString(),
				map: magicString.generateMap({hires: true}),
			};
		},
	};
}
