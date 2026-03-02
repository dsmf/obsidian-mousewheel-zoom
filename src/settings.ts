import { App, PluginSettingTab, Setting } from "obsidian";
import type MousewheelZoomPlugin from "./main";

export type ZoomMode = "per-pane" | "everywhere";

export interface MousewheelZoomSettings {
	zoomMode: ZoomMode;
	zoomLevel: number;
}

export const DEFAULT_SETTINGS: MousewheelZoomSettings = {
	zoomMode: "per-pane",
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
			.setName("Zoom mode")
			.setDesc("Per-pane: zoom only the pane under your cursor. Everywhere: zoom all panes at once.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("per-pane", "Per-pane (cursor)")
					.addOption("everywhere", "Everywhere")
					.setValue(this.plugin.settings.zoomMode)
					.onChange(async (value: ZoomMode) => {
						this.plugin.settings.zoomMode = value;
						await this.plugin.saveSettings();
						this.plugin.applyZoomFromSettings();
						this.display();
					})
			);

		if (this.plugin.settings.zoomMode === "everywhere") {
			new Setting(containerEl)
				.setName("Zoom level")
				.setDesc("Global zoom level (0.5–2.0)")
				.addSlider((slider) =>
					slider
						.setLimits(0.5, 2.0, 0.1)
						.setValue(this.plugin.settings.zoomLevel)
						.setDynamicTooltip()
						.onChange(async (value) => {
							this.plugin.settings.zoomLevel = value;
							this.plugin.applyZoomFromSettings();
							await this.plugin.saveSettings();
						})
				);
		}

		new Setting(containerEl)
			.setName("Reset all panes")
			.setDesc("Reset zoom to 100% in all panes")
			.addButton((btn) =>
				btn.setButtonText("Reset all").onClick(() => {
					this.plugin.resetAllPanes();
					this.display();
				})
			);
	}
}
