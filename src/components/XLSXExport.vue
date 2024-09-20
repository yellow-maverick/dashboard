<script>
import XLSX from 'xlsx-js-style';
import ExportUtils from "@/js/xlsx";

export default {
  data() {
    return {
      borders: ['Left', 'Right', 'Top', 'Bottom'],
      canvas: null
    }
  },

  props: ['title', 'titleClass', 'tooltip', 'btnClass', 'btnText', 'target', 'fileName', 'hasData'],
  methods: {
    ...ExportUtils,
    async saveContent() {
      this.$emit("exportXLSX", "init")
      await this.$nextTick()

      const wb = this.buildWorkbook()
      XLSX.writeFile(wb, `${this.fileName || this.title}.xlsx`, { type: 'xlsx', bookSST: true, bookType: 'xlsx', compression: true, cellStyles: true })

      await this.$nextTick()
      this.$emit("exportXLSX", "end")
    },
    elemStyle(c) {
      let css   = getComputedStyle(c)
      let style = {}

      style.font = {
        bold: parseInt(css.fontWeight) > 400,
        sz:   parseInt(css.fontSize)
      }

      if (c.children.length == 1 && !/TH/.test(c.tagName)) {
        let childStyle   = getComputedStyle(c.children[0])
        style.font.color = { rgb: this.rgb2hex(childStyle.color, false) }
        style.fill       = { fgColor: { rgb: this.rgb2hex(childStyle.backgroundColor, false) || 'FFFFFF' } }
      } else {
        style.font.color = { rgb: this.rgb2hex(css.color, false) }
        style.fill       = { fgColor: { rgb: this.rgb2hex(css.backgroundColor, false) || 'FFFFFF' } }
      }

      style.alignment = {
        horizontal: c.className.split(" ").filter(c => /^center$|^left$|^right$/.test(c))[0] ?? css.textAlign,
        vertical:   css.verticalAlign == 'middle' ? 'center' : css.verticalAlign
      }

      style.border = {}
      for (let b of this.borders) {
        let weight = parseFloat(css[`border${b}Width`])
        if (!weight) continue
        style.border[b.toLowerCase()] = { style: "thin", color: { rgb: this.rgb2hex(css[`border${b}Color`], false) } }
      }

      style.width = this.textWidth(css.font, c.innerText) + 30

      return style
    },

    buildWorkbook() {
      this.createCanvas();
      let wb = XLSX.utils.book_new(); // workbook
      let table = [];
      let colsWidth = [];
      let rowsHeight = [];
      let merges = [];
      let cellMatrix = [];

      let currentRowIndex = 0;
      for (let r of this.table.rows) {
        let currentColIndex = 0;
        // Ensure the row exists in the table
        if (!table[currentRowIndex]) table[currentRowIndex] = [];

        // Skip occupied cells
        while (cellMatrix[currentRowIndex] && cellMatrix[currentRowIndex][currentColIndex]) {
          currentColIndex++;
        }

        for (let c of r.cells) {
          let styles = this.elemStyle(c);
          let colspan = parseInt(c.getAttribute('colspan')) || 1;
          let rowspan = parseInt(c.getAttribute('rowspan')) || 1;

          // Add the cell to the table
          table[currentRowIndex][currentColIndex] = { v: c.innerText, t: "s", s: styles };

          // Mark occupied cells
          for (let rSpan = 0; rSpan < rowspan; rSpan++) {
            for (let cSpan = 0; cSpan < colspan; cSpan++) {
              let rowIdx = currentRowIndex + rSpan;
              let colIdx = currentColIndex + cSpan;
              if (!cellMatrix[rowIdx]) cellMatrix[rowIdx] = [];
              cellMatrix[rowIdx][colIdx] = true;
            }
          }

          // Add merge range if necessary
          if (colspan > 1 || rowspan > 1) {
            merges.push({
              s: { r: currentRowIndex, c: currentColIndex },
              e: { r: currentRowIndex + rowspan - 1, c: currentColIndex + colspan - 1 }
            });
          }

          // Update row heights
          if (!rowsHeight[currentRowIndex]) rowsHeight[currentRowIndex] = { hpx: styles.font.sz + 8 };
          else if (styles.font.sz + 8 > rowsHeight[currentRowIndex].hpx) rowsHeight[currentRowIndex].hpx = styles.font.sz + 8;

          // Update column widths
          for (let cSpan = 0; cSpan < colspan; cSpan++) {
            let colIdx = currentColIndex + cSpan;
            if (!colsWidth[colIdx]) colsWidth[colIdx] = { wpx: styles.width };
            else if (styles.width > colsWidth[colIdx].wpx) colsWidth[colIdx].wpx = styles.width;
          }

          // Advance column index
          currentColIndex += colspan;

          // Skip occupied cells
          while (cellMatrix[currentRowIndex] && cellMatrix[currentRowIndex][currentColIndex]) {
            currentColIndex++;
          }
        }
        currentRowIndex++;
      }

      let ws = XLSX.utils.aoa_to_sheet(table); // worksheet with table
      ws['!cols'] = colsWidth;
      ws['!rows'] = rowsHeight;
      ws['!merges'] = merges; // Add merge ranges
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        (this.fileName || this.title).slice(0, 31).replace(/\?/g, " ")
      ); // add worksheet to workbook
      return wb;
    }

  },
  computed: {
    computedTitleClass() {
      if (!this.titleClass) return "mt-3"
      return this.titleClass
    },
    table() {
      if (this.target) return document.querySelector(`#${this.target} table`)
      return this.$refs[this.title || this.fileName]?.firstElementChild
    }
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center" v-if="hasData">
        <slot name="header"></slot>
        <a @click=saveContent() class="btn hide-print mb-0" :class="btnClass" :title='$t("general.export_excel")'>
          <small><font-awesome-icon icon='fa-solid fa-download' /></small>
        </a>
      </div>
    </div>
    <div :ref="title || fileName"><slot></slot></div>
  </div>
</template>
