# ClockWise
A simple timer for testing purposes.

## Introduction
This clock is built with two Classes.
### Timer Class
A Timer, has the following features:
* name - Timer name set on construction- important! but not nessesry if you use one timer. getName() will return the name you set.
* start() - A method to start time measures.
* stop() - stops the clock, you can start the clock, and measure avrages.
* reset() - reset all the settings besides the names.
* interval() - run this on loops to get results, getNumberofIntervals() and getAverageIntervals() to get avrage.
* measure() - calculate simply the elapsed time from start() to stop(), returns hrtime units **[secods, nanosecods]**
* elapsed() - calculate the elapsed time from start() to now. returns hrtime units **[secods, nanosecods]**
* toNumeric() - converts hrtime to seconds. returns seconds.

### ClockWise class
An extension of Timer class, but enable you to handle multiple timers.
it features:
* addTimer(name) - add Timer.
* startTimer(name) - start Timer.
* stopTimer(name) - Stop The timer.
* elapsedTimer(name) - returns elapsed time since start of timer.
* measureTimer(name) - returns measured time in hrtimes from startTimer(name) to stopTimer(name).
* getTimerAverage(name) - returns average of start and stops timer.
* getTimerAverageIntervals(name) - returns average of timer Intervals.
* printTimers() - Prints all the results of all timers.

## Getting Started
```javascript
const Timer = require('../lib/Timer');
const timer = new Timer('runner');
timer.addTimer('name');
timer.startTimer('name');
// do something...
timer.stopTimer('name');
timer.printTimers();
```
