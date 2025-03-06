# **Ripestat Chrome Extension**

A Chrome extension that **highlights IP addresses** (IPv4/IPv6, including optional CIDR notation) on any webpage, shows a small `(i)` icon, and displays **WHOIS** data retrieved from the [RIPEstat API](https://stat.ripe.net/docs/02.data-api/) when hovered.

---

## **Features**

- **IPv4 & IPv6 Detection**<br>
  Identifies both standard and CIDR-formatted IP addresses.
- **WHOIS Tooltip**<br>
  Hovering over a highlighted IP (or the `(i)` icon) displays WHOIS information.
- **Lightweight**<br>
  Minimal and easy to install or remove.
- **Configurable Injection**<br>
  Choose between automatic injection with `content_scripts` or on-demand injection via `background.js`.

---

## **Installation (Local Testing)**

1. **Clone** this repository or [download the ZIP](https://github.com/YOUR_USERNAME/ripestat-chrome-extension/archive/refs/heads/main.zip) and unzip:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ripestat-chrome-extension.git
   ```
2. **Open** Google Chrome and go to:
   ```
   chrome://extensions/
   ```
3. **Enable Developer Mode** (toggle in the top-right corner).
4. **Load Unpacked**:
   - Click **Load unpacked**.
   - Select the `ripestat-chrome-extension` folder (the one containing `manifest.json`).
5. The extension will appear in your extension list, ready to use.

---

## **Usage**

1. **Navigate** to any webpage containing IP addresses.
2. If using **automatic injection** in `manifest.json`:
   - IP addresses will highlight immediately.
3. If using **on-demand injection** with `background.js`:
   - **Click** the extension icon in the toolbar to inject the script.
4. **Hover** over any highlighted IP or `(i)` icon to see WHOIS data in a tooltip.

---

## **Contributing**

1. **Fork** the repository and create a new branch for your feature or fix.
2. **Commit** and **push** your changes.
3. **Open a Pull Request**, describing the changes in detail.

---

## **License**

Distributed under the [MIT License](LICENSE). Feel free to open issues or pull requests for suggestions or bug reports.


