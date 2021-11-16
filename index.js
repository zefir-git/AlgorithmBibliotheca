
class AlgorithmBibliotheca {s
    /**
     * Perform asynchronous task n times (awaits execution before continuing iteration)
     * @param  {Number} n Number of iterations to perform
     * @param  {Function} fn Task to run each iteration; supplied argument is k of current iteration (countdown)
     * @param  {Collection} collector Collection preset
     * @return {Promise} Resolves into {Collection} containing return values from the tasks in their corresponding order
     */
    static async asyncTimes (n = 0, fn = new Function, collector = new AlgorithmBibliotheca.Collection) {
        if (n <= 0) return collector;
        return new Promise((resolve, reject) => {
            async function loop () {
                collector.push(await fn(n--));
                if (n > 0) loop();
                else resolve(collector);
            }
            loop();
        })
    }

    /**
     * Perform synchronous task n times
     * @param  {Number} n Number of iterations to perform
     * @param  {Function} fn Task to run each iteration; supplied argument is k of current iteration (countdown)
     * @param  {Collection} collector Collection preset
     * @return {Collection} Contains return values from the tasks in their corresponding order
     */
    static syncTimes (n = 0, fn = new Function, collector = new AlgorithmBibliotheca.Collection) {
        if (n <= 0) return collector;
        while(n > 0) collector.push(fn(n--));
        return collector;
    }

    /**
     * Determine type of iteration to perform based on the result from the first task.
     * If the result is {Promise}, `.asyncTimes()` is performed. Otherwise, `.syncTimes()` is performed.
     * @param  {Number} n Number of iterations to perform
     * @param  {Function} fn Task to run each iteration; supplied argument is n of current iteration (countdown)
     * @param  {Collection} collector Collection preset
     * @return {Promise|Collection} Resolves into or returns {Collection} containing return values from the tasks in their corresponding order
     */
    static times (n = 0, fn = new Function, collector = new AlgorithmBibliotheca.Collection) {
        if (n <= 0) return collector;
        if (typeof fn !== "function") {
            const staticResult = fn;
            fn = () => staticResult;
        }
        const result = fn(n--);
        if (result instanceof Promise) {
            return new Promise((resolve, reject) => {
                async function awaitPromise() {
                    collector.push(await result);
                    return AlgorithmBibliotheca.asyncTimes(n, fn, collector)
                }
                awaitPromise().then(resolve);
            })
        }
        else {
            collector.push(result);
            return AlgorithmBibliotheca.syncTimes(n, fn, collector)
        }
    }
}

class Collection extends Array {
    nth(n) {
        return this[--n]
    }
    first() {
        return this.nth(1);
    }
    second() {
        return this.nth(2);
    }
    third() {
        return this.nth(3);
    }
    fourth() {
        return this.nth(4);
    }
    fifth() {
        return this.nth(5);
    }
    penultimate() {
        return this.nth(this.length - 1);
    }
    last() {
        return this.nth(this.length);
    }
}

// define alias
const AB = AlgorithmBibliotheca;

// aliases for .times()
function once () {
    return AlgorithmBibliotheca.times(1, ...arguments);
};
function twice () {
    return AlgorithmBibliotheca.times(2, ...arguments);
};
function thrice () {
    return AlgorithmBibliotheca.times(3, ...arguments);
};


// prototypes
Number.prototype.asyncTimes = function () {
    return AlgorithmBibliotheca.asyncTimes(this, ...arguments);
}
Number.prototype.syncTimes = function () {
    return AlgorithmBibliotheca.syncTimes(this, ...arguments);
}
Number.prototype.times = function () {
    return AlgorithmBibliotheca.times(this, ...arguments);
}