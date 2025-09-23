"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("sj-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("sj-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("sj-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("sj-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("sj-error-code");

const { ScramjetController } = $scramjetLoadController();

let wispUrl =
	(location.protocol === "https:" ? "wss" : "ws") +
	"://" +
	location.host +
	"/wisp/";

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
	wisp: wispUrl,
});

scramjet.init();
// const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

if (form != undefined) {
	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		try {
			if (!(await registerSW())) {
				setTimeout(() => window.location.reload(), 1000);
			}
		} catch (err) {
			error.textContent = "Failed to register service worker.";
			errorCode.textContent = err.toString();
			throw err;
		}

		const url = search(address.value, searchEngine.value);

		let frame = document.getElementById("sj-frame");
		frame.style.display = "block";
		// if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
		//   await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
		// }
		const sjEncode = scramjet.encodeUrl.bind(scramjet);
		frame.addEventListener("load", (event) => {
			window.history.pushState(
				{},
				"Scramjet",
				"/share" +
					event.target.contentWindow.location.href.split(
						event.target.contentWindow.location.host
					)[1]
			);
		});
		frame.src = sjEncode(url);
		window.history.pushState({}, "Scramjet", "/share" + sjEncode(url));
	});
}
