import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MousewheelZoomSettings, MousewheelZoomSettingTab } from "./settings";

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;

export default class MousewheelZoomPlugin extends Plugin {
	settings: MousewheelZoomSettings;
	private styleEl: HTMLStyleElement | null = null;

	async onload() {
		await this.loadSettings();

		this.registerDomEvent(document, "wheel", (evt: WheelEvent) => {
			if (!evt.ctrlKey && !evt.metaKey) return;
			evt.preventDefault();
			evt.stopPropagation();

			const delta = evt.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
			this.setZoom(Math.round((this.settings.zoomLevel + delta) * 10) / 10);
		}, { passive: false });

		this.addCommand({
			id: "zoom-in",
			name: "Zoom in",
			callback: () => this.setZoom(this.settings.zoomLevel + ZOOM_STEP),
		});

		this.addCommand({
			id: "zoom-out",
			name: "Zoom out",
			callback: () => this.setZoom(this.settings.zoomLevel - ZOOM_STEP),
		});

		this.addCommand({
			id: "zoom-reset",
			name: "Reset zoom",
			callback: () => this.setZoom(1),
		});

		this.addSettingTab(new MousewheelZoomSettingTab(this.app, this));

		this.applyZoom();
	}

	onunload() {
		this.removeStyle();
		document.body.removeClass("obsidian-mousewheel-zoom");
	}

	setZoom(level: number) {
		this.settings.zoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, level));
		void this.saveSettings();
		this.applyZoom();
	}

	private applyZoom() {
		document.body.addClass("obsidian-mousewheel-zoom");
		document.body.setCssProps({ "--obsidian-mousewheel-zoom": String(this.settings.zoomLevel) });
	}

	private removeStyle() {
		if (this.styleEl?.parentNode) {
			this.styleEl.remove();
		}
		this.styleEl = null;
	}

	async loadSettings() {
		const data = (await this.loadData()) as Partial<MousewheelZoomSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
