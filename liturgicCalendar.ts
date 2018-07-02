class LiturgicDay {
    readonly easterDayOfYear: number;
    readonly adventDayOfYear: number;
    readonly calcineDayOfYear: number;

    readonly currentDayOfMonth: number;
    readonly currentMonth: number;
    readonly currentYear: number;
    readonly currentDayOfWeek: number;
    readonly currentDayOfYear: number;

    readonly weekNames: string[] = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
    readonly monthNames: string[] = [, "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
        "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
    ofLiturgicName: string;

    constructor(y?: number, m?: number, d?: number) {
        let date: Date;
        if (y && m && d) {
            date = new Date(y, m - 1, d);
        }
        else {
            date = new Date();
        }
        this.currentDayOfMonth = date.getDate();
        this.currentMonth = date.getMonth() + 1;
        this.currentYear = date.getFullYear();
        this.currentDayOfWeek = date.getDay();
        this.currentDayOfYear = this.getDayOfYear();

        //Święta Ruchome
        this.easterDayOfYear = this.getEasterDayOfYear();//Wielkanoc
        this.adventDayOfYear = this.getAdventDayOfYear();//I niedziela Adwentu
        this.calcineDayOfYear = this.easterDayOfYear - 46;//Popielec

        //I niedziela zwykla

        this.checkPeriod();
    }

    checkPeriod():void {
      let liturgicWeekNo: number|string;
      interface LiturgicNames {
        [index: string]: string;
      }
      let liturgicNames = {} as LiturgicNames;
      liturgicNames["lent"] = "tygodnia Wielkiego Postu";
      liturgicNames["before_lent"] = "po Popielcu";
      liturgicNames["calcine"] = "Popielcowa";

      interface LiturgicDays {
        [index: number]: string;
      }
      let liturgicDays = {} as LiturgicDays;
      liturgicDays[this.calcineDayOfYear] = "Popielec";
      liturgicDays[this.easterDayOfYear] = "Wielkanoc";
      liturgicDays[this.easterDayOfYear-3] = "Triduum Paschalne. Wielki Czwartek";
      liturgicDays[this.easterDayOfYear-2] = "Triduum Paschalne. Wielki Piątek";
      liturgicDays[this.easterDayOfYear-1] = "Triduum Paschalne. Wielka Sobota";

      if(this.currentDayOfYear in liturgicDays) {
        this.ofLiturgicName = liturgicDays[this.currentDayOfYear];
      }
      else if(this.calcineDayOfYear<=this.currentDayOfYear && this.currentDayOfYear<this.easterDayOfYear) {
        //Wielki Post
        if(this.calcineDayOfYear<this.currentDayOfYear && this.currentDayOfYear<=this.calcineDayOfYear+3) {
          this.ofLiturgicName = liturgicNames["before_lent"];
        }
        else {
          liturgicWeekNo = Math.ceil((this.currentDayOfYear - this.calcineDayOfYear - 3)/7);
          this.ofLiturgicName = `${liturgicWeekNo} ${liturgicNames["lent"]}`;

        }
      }

      //okres wielkanocny
      //okres zwykly czesc I
      //okres zwykly częś II
      //Adwent
      //Okres Bożego Narodzenia

    }

    private getEasterDayOfYear(): number {
        let Y: number = this.currentYear;
        let C: number = Math.floor(Y / 100);
        let N: number = Y - 19 * Math.floor(Y / 19);
        let K: number = Math.floor((C - 17) / 25);
        let I: number = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
        I = I - 30 * Math.floor((I / 30));
        I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
        let J: number = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
        J = J - 7 * Math.floor(J / 7);
        let L: number = I - J;
        let M: number = 3 + Math.floor((L + 40) / 44);
        let D: number = L + 28 - 31 * Math.floor(M / 4);
        return this.getDayOfYear(Y, M, D);
    }

    private getAdventDayOfYear(): number {
        let christmasEveDayOfWeek: number = new Date(this.currentYear, 11, 24).getDay();
        return this.getDayOfYear(this.currentYear, 12, 24) - (21 + christmasEveDayOfWeek);
    }

    private getLiturgicYear(): string {
        if (this.currentDayOfWeek != 0) {
            return ((this.currentYear % 2) == 1 ? "I" : "II");
        }
        let sundayLiturgicYear: string[] = ["C", "A", "B", "C"];
        let fromAdventMover = 0;
        if (this.getDayOfYear() >= this.adventDayOfYear) {
            fromAdventMover = 1;
        }
        return sundayLiturgicYear[(this.currentYear % 3) + fromAdventMover];
    }

    private getDayOfYear(year: number = this.currentYear, month: number = this.currentMonth, day: number = this.currentDayOfMonth): number {
        let timestmpFirstDay: number = new Date().setFullYear(year, 0, 1);
        let yearFirstDay: number = Math.floor(timestmpFirstDay / 86400000);
        let today: number = Math.ceil((new Date(year, month - 1, day).getTime()) / 86400000);
        return today - yearFirstDay + 1;
    }

    echoValues(): void {
      console.log(`Dziś jest ${this.currentDayOfMonth} ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
      console.log(`${this.currentDayOfYear} dzień roku`);
      console.log(`Dziś jest ${this.weekNames[this.currentDayOfWeek]} ${this.ofLiturgicName}`);
      console.log(`Rok liturgiczny ${this.getLiturgicYear()}`);
    }
}

let liturgicDay = new LiturgicDay(2018, 4, 1);
liturgicDay.echoValues();
