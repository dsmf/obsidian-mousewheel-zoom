import { App, PluginSettingTab, Setting } from "obsidian";
import type MousewheelZoomPlugin from "./main";

export interface MousewheelZoomSettings {
	zoomLevel: number;
}

export const DEFAULT_SETTINGS: MousewheelZoomSettings = {
	zoomLevel: 1,
};

export class MousewheelZoomSettingTab extends PluginSettingTab {
	plugin: MousewheelZoomPlugin;

	constructor(app: App, plugin: MousewheelZoomPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Zoom level")
			.setDesc("Current text zoom level (0.5–2.0). Use Ctrl+scroll to change.")
			.addSlider((slider) =>
				slider
					.setLimits(0.5, 2.0, 0.1)
					.setValue(this.plugin.settings.zoomLevel)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.zoomLevel = value;
						this.plugin.setZoom(value);
					})
			);

		new Setting(containerEl)
			.setName("Reset zoom")
			.setDesc("Reset zoom to 100%")
			.addButton((btn) =>
				btn.setButtonText("Reset").onClick(() => {
					this.plugin.setZoom(1);
					this.display();
				})
			);
	}
}
