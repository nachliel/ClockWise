'use strict'

class Timer {
    
    constructor(name) {
        this.name = name || `default`;
        this.createTime = process.hrtime();
        this.intervalNumbers = 0;
        this.stopNumber = 0;
        this.intervals = [];
        this.average = 0;
        this.averageIntervals = 0;
    }

    getName() {
        return this.name;
    }
    
    start() {
        this.startTime = process.hrtime();
    }

    stop() {
        this.stopTime = process.hrtime();
        this.stopNumber ++;
        this.average += (this.numericCalc(this.startTime,this.stopTime) - this.average)/this.stopNumber
    }

    reset() {
        this.average = 0;
        this.stopNumber = 0;
        this.createTime = process.hrtime();
        this.intervalNumbers = 0;
        this.stopNumber = 0;
        this.intervals = [];
        this.averageIntervals = 0;
        this.intervalsMeasure = [];
    }
    
    interval() {
        this.intervals[this.intervalNumbers++] = process.hrtime();
    }

    getNumberofIntervals() {
        return this.intervalNumbers;
    }

    measure() {
        return this.calculate(this.startTime,this.stopTime);
    }
    measureNumeric() {
        return this.numericCalc(this.startTime,this.stopTime);
    }

    getAverage() {
        return this.average;
    }
    getAverageIntervals() {
        this.calculateIntervals();
        return this.averageIntervals;
    }

    calculateIntervals() {
        if (this.intervalNumbers === 0)
            return;
        let intervalsMeasure = [];
        this.averageIntervals = 0;
        for(let i = 0; i < this.intervalNumbers - 1; i++) {
            intervalsMeasure[i] = this.calculate(this.intervals[i],this.intervals[i + 1]);
            this.averageIntervals += (this.toNumeric(intervalsMeasure[i]) - this.averageIntervals)/(i+1);
        }
        return intervalsMeasure;
    }

    elapsed() {
        const now = process.hrtime();
        return this.calculate(this.startTime, now);
    }

    toNumeric(time) {
        return Number((time[0] + time[1]*0.000000001));
    }

    calculate(begin, end) {
        
        if (end[1] < begin[1]) {
            end[0] --;
            begin[1] + 1000000000;
        }
        return [end[0] - begin[0], end[1] - begin[1]];
    }

    numericCalc(begin,end) {
        return this.toNumeric(end) - this.toNumeric(begin);
    }
};

class ClockWise extends Timer {
    constructor(name,options) {
        super(name);
        //this.timers = [];
        this.timers = new Map();
        if (options)
            this.options = options;
        else {
            this.options = {
                accuracy : 5
            }
        }
    }

    addTimer(name) {
        //this.timers[name] = new Timer(name);
        this.timers.set(name, new Timer(name));
    }

    startTimer(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        timer.start();
      }

    stopTimer(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        timer.stop();
    }
    
    elapsedTimer(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        return timer.elapsed();
    }

    numberOfIntervalsTimer(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        return timer.getNumberofIntervals();
    }

    measureTimer(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        return timer.measure();
    }

    intervalTimer(name) {
        this.timers.get(name).interval();
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        timer.interval();
    }

    measureIntervalsTimer(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        return timer.measureIntervalsTimer().toPrecision(this.options.accuracy);
    }

    getTimerAverage(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        return timer.getAverage().toPrecision(this.options.accuracy);
    }

    getTimerAverageIntervals(name) {
        const timer = this.timers.get(name);
        if (!timer) {
          throw new Error(`No timer with the name "${name}" exists.`);
        }
        return timer.getAverageIntervals().toPrecision(this.options.accuracy);
    }

    printTimers() {
        console.log(`ClockWise Timer \'${this.name}\' Timers:`)
        if (this.stopNumber > 0)
                console.log(`StopWatch\tx${this.stopNumber}\t: ${this.getAverage().toPrecision(this.options.accuracy)} sec`);
        if (this.intervalNumbers > 0) {
            console.log(`Intervals\tx${this.intervalNumbers}\t: ${this.getAverageIntervals().toPrecision(this.options.accuracy)} sec`);
        }
        for (let [timerName, timer] of this.timers) {
            console.log(key + ' = ' + value);
            if (timer.stopNumber > 0)
                console.log(`[${timerName}]:\tStopWatch\tx${timer.stopNumber}\t: ${timer.getAverage().toPrecision(this.options.accuracy)} sec`);
            if (timer.intervalNumbers > 0) {
                console.log(`[${timerName}]:\tIntervals\tx${timer.intervalNumbers}\t: ${timer.getAverageIntervals().toPrecision(this.options.accuracy)} sec`);
            }
        }
        console.log('Timer Report End.');
    }
}

module.exports = ClockWise;
