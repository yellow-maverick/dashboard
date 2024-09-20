let xlsx = {
  base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)))
  },
  rgb2hex(rgba, withHash = true) {
    if (rgba == 'rgba(0, 0, 0, 0)') return
    let hex = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/)
    hex = hex.slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')
    return withHash ? `#${hex.slice(0,6)}` : `${hex.slice(0,6)}`
  },
  createCanvas() {
    if (this.canvas) return;
    else this.canvas = document.createElement("canvas");
  },
  textWidth(font, text) {
    const ctx = this.canvas.getContext("2d");
    ctx.font = font;
    const textWidth = ctx.measureText(text).width;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return textWidth;
  }
}
export default xlsx;
