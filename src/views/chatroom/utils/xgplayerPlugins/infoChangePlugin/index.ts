import { BasePlugin } from "xgplayer";

class InfoChangePlugin extends BasePlugin {
  overlay: HTMLDivElement | null = null;
  timer: number | null = null;

  static get pluginName() {
    return "volumeOverlay";
  }

  afterCreate() {
    this.render();
    this.player.on("volumechange", this.volumeChange.bind(this));
    this.player.on("volumechange", this.volumeChange.bind(this));
  }

  render() {
    console.log(1);
    this.overlay = document.createElement("div");
    this.overlay.className = "yo-volume-overlay";
    this.overlay.innerHTML = '<p id="volumeText"></p>';
    this.overlay.style.display = "none";
    this.player.root?.appendChild(this.overlay);
  }

  volumeChange() {
    const volumePercentage = Math.round(this.player.volume * 100);
    this.showOverlay(`音量: ${volumePercentage}%`);
  }

  debounce(fn: () => void, delay: number) {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(function () {
      fn();
    }, delay);
  }

  showOverlay(message: string) {
    if (this.overlay) {
      const volumeText = this.overlay.querySelector("#volumeText") as HTMLElement;
      volumeText.textContent = message;
      this.overlay.style.display = "flex";
      this.debounce(() => {
        this.overlay && (this.overlay.style.display = "none");
      }, 1000);
    }
  }

  destroy() {
    this.player.off("volumechange", this.volumeChange.bind(this));
    if (this.overlay) {
      this.player.root?.removeChild(this.overlay);
    }
  }
}

export default InfoChangePlugin;
