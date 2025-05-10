export class DateOnly {
  private readonly date: Date;

  constructor(year: number, month: number, day: number) {
    this.date = new Date(year, month, day);
  }

  static fromDate(date: Date): DateOnly {
    return new DateOnly(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static fromISOString(isoString: string): DateOnly {
    const date = new Date(isoString);
    return DateOnly.fromDate(date);
  }

  toISOString(): string {
    const year = this.date.getFullYear();
    const month = String(this.date.getMonth() + 1).padStart(2, '0');
    const day = String(this.date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  equals(other: DateOnly): boolean {
    return this.toISOString() === other.toISOString();
  }

  isBefore(other: DateOnly): boolean {
    return this.date < other.date;
  }

  isAfter(other: DateOnly): boolean {
    return this.date > other.date;
  }

  addDays(days: number): DateOnly {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + days);
    return DateOnly.fromDate(newDate);
  }

  getYear(): number {
    return this.date.getFullYear();
  }

  getMonth(): number {
    return this.date.getMonth();
  }

  getDate(): number {
    return this.date.getDate();
  }

  toDate(): Date {
    return new Date(this.date);
  }
} 