if (!window.ym) window.ym = {};

import dayjs from 'dayjs';

window.ym.lib = {

  globalScale:  5,
  globalDigits: 1,

  scale(v, scale) {
    return this.round(parseFloat(v) * (this.globalScale / scale))
  },

  sourceImage(slug) {
    return new URL(`../assets/img/sources/${slug}.png`, import.meta.url).href
  },

  round(v, digits=this.globalDigits) {
    if (v == this.globalScale || v == 0) return String(v);
    if (!v && v != 0) return '-';
    return parseFloat(v).toFixed(digits)
  },

  change(current, previous) {
    if (!current || !previous) return;
    return this.round((current / previous - 1) * 100);
  },

  defaultDateRange (months) {
    if (!months) months = 6
    var d = new Date();
    d.setMonth(d.getMonth() - months);
    return [d, new Date()]
  },

  dateShortcuts() {
    const today = new Date();
    return [
      {
        text: this.$t("filter.date_ranges.today"),
        onClick() { return [today, today] }
      },
      {
        text: this.$t("filter.date_ranges.yesterday"),
        onClick() {
          let yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          return [yesterday, yesterday];
        }
      },
      {
        text: this.$t("filter.date_ranges.last_7_days"),
        onClick() {
          let lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 6);
          return [lastWeek, today];
        }
      },
      {
        text: this.$t("filter.date_ranges.this_month"),
        onClick() {
          let thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return [thisMonth, today];
        }
      },
      {
        text: this.$t("filter.date_ranges.last_month"),
        onClick() {
          let lastMonthFirstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          let lastMonthLastDay  = new Date(today.getFullYear(), today.getMonth(), 0);
          return [lastMonthFirstDay, lastMonthLastDay];
        }
      },
      {
        text: this.$t("filter.date_ranges.last_6_months"),
        onClick() {
          let last6Months = new Date();
          last6Months.setMonth(today.getMonth() - 6);
          return [last6Months, today];
        }
      },
      {
        text: this.$t("filter.date_ranges.ytd"),
        onClick() {
          let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
          return [firstDayOfYear, today];
        }
      },
      {
        text: this.$t("filter.date_ranges.last_year"),
        onClick() {
          const lastYear         = dayjs().subtract(1, "year");
          const lastYearFirstDay = lastYear.startOf("year").toDate()
          const lastYearLastDay  = lastYear.endOf("year").toDate()
          return [lastYearFirstDay, lastYearLastDay];
        }
      },
    ]
  },

  ratingColor (value, scale=this.globalScale) {
    value = scale ? value * (100 / scale) : value
    if (!value && value != '0') return 'rating-unknown'

    value = parseFloat(value)
    if (value <= 4)  return 'rating0-4'
    if (value >= 97) return 'rating97-100'

    let n = Math.floor((value - 1) / 4) * 4
    return `rating${n + 1}-${n + 4}`
  }
}

export default window.ym.lib;
