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

    numberOfIntervalsTimer(name) {
        return this.timers[name].getNumberofIntervals();
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

    printTimers() {
        console.log(`ClockWise Timer \'${this.name}\' Timers:`)
        if (this.timers[i].stopNumber > 0)
                console.log(`StopWatch\tx${this.stopNumber}\t: ${this.getAverage().toPrecision(this.options.accuracy)} sec`);
        if (this.timers[i].intervalNumbers > 0) {
            console.log(`Intervals\tx${this.intervalNumbers}\t: ${this.getAverageIntervals().toPrecision(this.options.accuracy)} sec`);
        }
        for (let i= 0; i< this.timers.length; i++) {
            if (this.timers[i].stopNumber > 0)
                console.log(`[${this.timers[i].name}]:\tStopWatch\tx${this.timers[i].stopNumber}\t: ${this.timers[i].getAverage().toPrecision(this.options.accuracy)} sec`);
            if (this.timers[i].intervalNumbers > 0) {
                console.log(`[${this.timers[i].name}]:\tIntervals\tx${this.timers[i].intervalNumbers}\t: ${this.timers[i].getAverageIntervals().toPrecision(this.options.accuracy)} sec`);
            }
        }
    }
}

module.exports = ClockWise;
