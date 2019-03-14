'use strict'

class Timer {
    
    constructor(name) {
        this.name = name;
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
    }
    
    interval() {
        this.intervals[this.intervalNumbers++] = process.hrtime();
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
        this.averageIntervals = 0;
        const intervalsMeasure = [];
        for(let i = 1; i < this.intervalNumbers; i++) {
            this.intervalsMeasure[i] = this.calculate(this.intervals[i - 1], this.intervals[i]);
            this.averageIntervals += (this.toNumeric(this.intervalsMeasure[i]) - this.averageIntervals)/i;
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
        this.timers = [];
        if (options)
            this.options = options;
        else {
            this.options = {
                accuracy : 5
            }
        }
    }

    addTimer(name) {
        this.timers[name] = new Timer(name);
    }

    startTimer(name) {
        this.timers[name].start();
    }

    stopTimer(name) {
        this.timers[name].stop();
    }
    
    elapsedTimer(name) {
        return (this.timers[name].elapsed());
    }

    measureTimer(name) {
        this.timers[name].measure();
    }

    intervalTimer(name) {
        this.timers[name].interval();
    }

    measureIntervalsTimer(name) {
        return this.timers[name].measureIntervalsTimer().toPrecision(this.options.accuracy);
    }

    getTimerAverage(name) {
        return this.timers[name].getAverage().toPrecision(this.options.accuracy);
    }

    getTimerAverageIntervals(name) {
        return this.timers[name].getAverageIntervals().toPrecision(this.options.accuracy);
    }
}

module.exports = ClockWise;
