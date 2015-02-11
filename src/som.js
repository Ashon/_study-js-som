
(function(window){

    'use strict'

    // som namespace
    window.som = function som(unitSize, weightLength) {
        this.units = [];
        this.trainSet = [];
        this.threshold = 0.05;
        this.learningRate = 0.3;
        this.range = 30;
        this.iteration = 300;
        this.weightLength = weightLength;

        // train timer clock
        this.trainInterval = 10;

        this.initialize = function(unitSize, weightLength) {
            for(var i = 0; i < unitSize; i++)
                this.units.push(new som.unit(weightLength));
        }

        // get best matching unit
        this.getBMU = function(target) {
            if(this.units.length > 0) {
                var units = this.units;
                var bmu = units[0];
                units.forEach(function(unit) {
                    if(target.getSquaredError(unit) < target.getSquaredError(bmu)) {
                        bmu = unit;
                    }
                });
                // console.log(bmu);
                // this.units.forEach(function(unit) {
                //     console.log(unit.weight[0]);
                // });
                return bmu;

            } else
                return undefined;
        }

        this.train = function() {
            // console.log('train iteration start');
            var som = this;
            var units = som.units;

            var counter = som.iteration;
            var range = som.range * (counter / som.iteration);
            var trainSample = function(sample) {
                var bmu = som.getBMU(sample);
                // console.log({'bmu' : bmu});
                units.forEach(function(unit) {
                    // console.log(unit);
                    if(bmu != unit) {
                        var squaredError = unit.getSquaredError(bmu)
                        var activate = som.learningRate * Math.exp(-squaredError / (range * range));
                        // console.debug({
                        //     'unit-weight' : unit.weight,
                        //     'bmu-weight' : bmu.weight,
                        //     'learning-rate' : som.learningRate,
                        //     'squared-error' : squaredError,
                        //     'exponential-value' : Math.exp(-squaredError / (range * range)),
                        //     'activate' : activate
                        // });
                        if(activate >= som.threshold * som.learningRate) {
                            unit.weight.forEach(function(value, vidx) {
                                // adjust unit's each weight value
                                var bonusWeight = (bmu.weight[vidx] - value) * activate * som.learningRate;
                                // console.debug({
                                //     'weight-value' : value,
                                //     'bmu-weight-value' : value,
                                //     'activate' : activate
                                // });
                                unit.addWeight(vidx, bonusWeight);
                            });
                        }
                    }
                });
                // units.forEach(function(unit) {
                //     console.log('tr='+unit.weight[0]);
                // });
            }

            var trainTimer = setInterval(function() {
                if(counter == 0) {
                    clearInterval(trainTimer);
                    // console.log('train finished');
                } else {
                    som.trainSet.forEach(trainSample);
                    counter--;
                    // console.log('iteration ' + (som.iteration - counter));
                }
            }, som.trainInterval);

            // console.log('train complete');
            // this.units.forEach(function(unit) {
            //     console.log(unit.weight);
            // });
        }

        this.initialize(unitSize, weightLength);
    }

    // som unit class
    window.som.unit = function somUnit(weightLength) {
        this.weight = [];

        this.initialize = function(weightLength) {
            for(var i = 0; i < weightLength; i++)
                this.weight.push(Math.random());
        }

        this.getSquaredError = function(target) {
            // type check
            if(som.unit.prototype.isPrototypeOf(target)) {
                // console.log(this.weight.length);
                // console.log(target.weight.length);
                if(this.weight.length == target.weight.length) {
                    var squaredError = 0;
                    this.weight.forEach(function(value, idx) {
                        // get euclidean squared error
                        var delta = value - target.weight[idx];
                        // console.debug({
                        //     'this-value' : value,
                        //     'target-weight' : target.weight[idx],
                        //     'error-delta' : delta
                        // });
                        squaredError += delta * delta;
                    });
                    return squaredError;
                } else {
                    // console.log('not equal');
                    // console.log(this.weight);
                    throw 'Unit\'s weight dimension is not equal'
                }
            } else {
                // console.log('not unit');
                throw 'Param\'s type is not som.unit'
            }
        }

        this.addWeight = function(idx, value) {
            this.weight[idx] += value;
        }

        this.initialize(weightLength);
    }

    // register to window singleton instance
    window.som.prototype = new som();
    window.som.unit.prototype = new som.unit();

})(window);
