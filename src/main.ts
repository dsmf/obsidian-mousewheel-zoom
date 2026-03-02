import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MousewheelZoomSettings, MousewheelZoomSettingTab } from "./settings";

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;

const ZOOMABLE_SELECTORS = [
	".cm-editor .cm-scroller",
	".markdown-preview-view .markdown-preview-sizer",
	".nav-files-container",
	".search-result-container",
	".backlink-pane",
	".outline",
	".tag-pane-tags",
];

export default class MousewheelZoomPlugin extends Plugin {
	settings: MousewheelZoomSettings;
	private paneZoomLevels = new WeakMap<HTMLElement, number>();

	async onload() {
		await this.loadSettings();

		this.registerDomEvent(document, "wheel", (evt: WheelEvent) => {
			if (!evt.ctrlKey && !evt.metaKey) return;

			if (this.settings.zoomMode === "everywhere") {
				evt.preventDefault();
				evt.stopPropagation();
				const delta = evt.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
				this.setGlobalZoom(this.settings.zoomLevel + delta);
				return;
			}

			const zoomable = this.getZoomableUnderCursor(evt.clientX, evt.clientY);
			if (!zoomable) return;
			evt.preventDefault();
			evt.stopPropagation();

			const delta = evt.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
			this.setPaneZoom(zoomable, delta);
		}, { passive: false });

		this.addCommand({
			id: "zoom-in",
			name: "Zoom in",
			callback: () => this.zoomActivePane(ZOOM_STEP),
		});

		this.addCommand({
			id: "zoom-out",
			name: "Zoom out",
			callback: () => this.zoomActivePane(-ZOOM_STEP),
		});

		this.addCommand({
			id: "zoom-reset",
			name: "Reset zoom",
			callback: () => this.resetActivePane(),
		});

		this.addCommand({
			id: "zoom-reset-all",
			name: "Reset zoom (all panes)",
			callback: () => this.resetAllPanes(),
		});

		this.addSettingTab(new MousewheelZoomSettingTab(this.app, this));

		this.applyZoomFromSettings();
	}

	onunload() {
		this.resetAllPanes();
	}

	private getZoomableUnderCursor(x: number, y: number): HTMLElement | null {
		const el = document.elementFromPoint(x, y);
		const leaf = el?.closest(".workspace-leaf");
		if (!leaf) return null;

		for (const selector of ZOOMABLE_SELECTORS) {
			const zoomable = leaf.querySelector(selector);
			if (zoomable instanceof HTMLElement) return zoomable;
		}
		return null;
	}

	private setPaneZoom(zoomable: HTMLElement, delta: number) {
		const current = this.paneZoomLevels.get(zoomable) ?? 1;
		const next = Math.round((current + delta) * 10) / 10;
		const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
		this.paneZoomLevels.set(zoomable, clamped);
		zoomable.setCssProps({ zoom: String(clamped) });
	}

	private setGlobalZoom(level: number) {
		const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(level * 10) / 10));
		this.settings.zoomLevel = clamped;
		void this.saveSettings();
		this.applyZoomFromSettings();
	}

	applyZoomFromSettings() {
		if (this.settings.zoomMode === "everywhere") {
			for (const selector of ZOOMABLE_SELECTORS) {
				document.querySelectorAll(selector).forEach((el) => {
					if (el instanceof HTMLElement) {
						el.setCssProps({ zoom: String(this.settings.zoomLevel) });
					}
				});
			}
		} else {
			this.resetAllPanes();
		}
	}

	private getActiveZoomable(): HTMLElement | null {
		const leaf = this.app.workspace.getLeaf(false);
		if (!leaf?.view?.containerEl) return null;

		const leafEl = leaf.view.containerEl.closest(".workspace-leaf");
		if (!leafEl) return null;

		for (const selector of ZOOMABLE_SELECTORS) {
			const zoomable = leafEl.querySelector(selector);
			if (zoomable instanceof HTMLElement) return zoomable;
		}
		return null;
	}

	private zoomActivePane(delta: number) {
		if (this.settings.zoomMode === "everywhere") {
			this.setGlobalZoom(this.settings.zoomLevel + delta);
			return;
		}
		const zoomable = this.getActiveZoomable();
		if (zoomable) this.setPaneZoom(zoomable, delta);
	}

	private resetActivePane() {
		if (this.settings.zoomMode === "everywhere") {
			this.setGlobalZoom(1);
			return;
		}
		const zoomable = this.getActiveZoomable();
		if (zoomable) {
			this.paneZoomLevels.set(zoomable, 1);
			zoomable.setCssProps({ zoom: "1" });
		}
	}

	resetAllPanes() {
		this.settings.zoomLevel = 1;
		for (const selector of ZOOMABLE_SELECTORS) {
			document.querySelectorAll(selector).forEach((el) => {
				if (el instanceof HTMLElement) {
					this.paneZoomLevels.delete(el);
					el.setCssProps({ zoom: "1" });
				}
			});
		}
	}

	async loadSettings() {
		const data = (await this.loadData()) as Partial<MousewheelZoomSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, data ?? {});
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
