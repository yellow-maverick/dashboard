if (!window.ym) window.ym = {};

import dayjs from "dayjs";

window.ym.lib = {
  round (v, f) {
    if (v == 10 || v == 0) return String(v);
    if (!v && v != 0) return '-';
    f = f == undefined ? 1 : f
    return parseFloat(v).toFixed(f)
  },
  change(current, previous) {
    if (!current || !previous) return;
    return ym.lib.round((current / previous - 1) * 100);
  },
  defaultDateRange () {
    var d = new Date();
    d.setMonth(d.getMonth() - 6);
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
  }
}

export default window.ym.lib;
