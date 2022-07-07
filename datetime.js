/*
 * STRONGLY RECOMMEND use the native JavaScript Date object instead of the following helper class.
 * Because Y2K or similar issues, which could spend much more time to fix them.
 */
export class HDate {
  static month_names = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  constructor(date_str = "") {
    const date_pattern = /^\d{4}-\d{2}-\d{2}$/;
    const matched_date = date_str.match(date_pattern);

    this.date_obj = matched_date ? new Date(date_str) : new Date();
  }

  static fromDate(date_obj) {
    const new_hdate = new HDate();
    new_hdate.date_obj = date_obj;
  }

  get year_str() {
    return String(this.year).padStart(4, "0");
  }

  get year() {
    return this.date_obj.getFullYear();
  }

  set year(value) {
    if (Number(value) >= 0) this.date_obj.setFullYear(Number(value));
  }

  get month_str() {
    return String(this.month).padStart(2, "0");
  }

  get month_name() {
    return HDate.month_names[this.month - 1];
  }

  get month() {
    return this.date_obj.getMonth() + 1;
    //Shift the month from native to 1..12
  }

  set month(value) {
    if (Number(value) >= 0) this.date_obj.setMonth(Number(value) - 1);
    //Shift back to native, 0..11
  }

  get day_str() {
    return String(this.day).padStart(2, "0");
  }

  get day() {
    return this.date_obj.getDate();
  }

  set day(value) {
    if (Number(value) >= 0) this.date_obj.setDate(Number(value));
  }

  weekday() {
    //Sunday is 0
    return this.date_obj.getDay();
  }

  lastday() {
    return new Date(this.year, this.month, 0).getDate();
    //Here month is the native month plus one, i.e. the next month
  }

  toString() {
    //In ISO format
    return [this.year_str, this.month_str, this.day_str].join("-");
  }

  valueOf() {
    return this.date_obj.getTime() / (1000 * 3600 * 24); //In days
  }
}
