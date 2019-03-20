'use strict'
/**
 * ClockWise Timer v1.0 By Nachlieli Shiloh Hills.
 * Zom Tishaa beav - Purim 20.3.19
 * Usage: cont timer = new ClockWise('Name');
 * This module uses two Modules Timer, and Clockwise an extension of Timer,
 * and Timers Managment. addTimer(),
 */

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
        if (this.stopTime === 0) {
            throw new Error(`Timer "${name}" still running.`);
        }
        return this.calculate(this.startTime,this.stopTime);
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
    // Add Show time in chain..
    printTimers() {
        console.log(`ClockWise Timer \'${this.name}\' Timers:`)
        if (this.stopNumber > 0)
                console.log(`\t\tStopWatch\tx${this.stopNumber}\t: ${this.pretty(this.getAverage())} sec`);
        if (this.intervalNumbers > 0) {
            console.log(`\t\tIntervals\tx${this.intervalNumbers}\t: ${this.pretty(this.getAverageIntervals())} sec`);
        }
        console.log('-Timers:');
        for (let [timerName, timer] of this.timers) {
            console.log(`[${timerName}]:`);
            if (timer.stopNumber > 0) {
                console.log(`\t\tStopWatch\tx${timer.stopNumber}\t: ${this.pretty(timer.getAverage())} sec`);
            }      
            if (timer.intervalNumbers > 0) {
                console.log(`\t\tIntervals\tx${timer.intervalNumbers}\t: ${this.pretty(timer.getAverageIntervals())} sec`);
            }
        }
        console.log('Timer Report End.');
    }

    pretty(time) {
        

        let seconds = 0;
        if (time[0] && time[1]) {
            seconds = this.toNumeric(time); 
        }
        else {
            seconds = time;
        }
        if (time < 0) {
            return (time/1000000).toPrecision(this.options.accuracy) + ' ms';
        }
        
        let minuets = math.floor(seconds/60);
        let hours = math.floor(minuets/60);
        minuets = minuets - (hours * 60);
        seconds = seconds - minuets*60 - hours*3600;
        let output = '';
        if (hours > 0)
            output += hours + ':';
        if (minuets > 0 || hours > 0)
            output += minuets + ':';  

        return output + (seconds).toPrecision(this.options.accuracy);
    }
}

module.exports = ClockWise;
