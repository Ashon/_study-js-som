'use strict';

// som namespace
var Som = function Som(unitSize, weightLength) {
  this.units = [];
  this.trainSet = [];
  this.threshold = 0.05;
  this.learningRate = 0.3;
  this.range = 30;
  this.iteration = 300;
  this.weightLength = weightLength;

  // train timer clock
  this.trainInterval = 10;

  for (var i = 0; i < unitSize; i++)
    this.units.push(new Som.Unit(weightLength));
};
Som.prototype = {
  units: [],
  trainSet: [],
  threshold: 0.05,
  learningRate: 0.3,
  range: 30,
  iteration: 300,
  weightLength: 0,
  // train timer clock
  trainInterval: 10,

  // get best matching unit
  getBMU: function(target) {
    if (this.units.length > 0) {
      var units = this.units;
      var bmu = units[0];
      units.forEach(function(unit) {
        if (target.getSquaredError(unit) < target.getSquaredError(bmu)) {
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
  },
  train: function(trainOption) {

    // console.log('train iteration start');
    var som = this;

    // load train option
    if(typeof(trainOption) == 'object') {
      if('threshold' in trainOption)
        som.threshold = trainOption.threshold;
      if('learningRate' in trainOption)
        som.learningRate = trainOption.learningRate;
      if('range' in trainOption)
        som.range = trainOption.range;
      if('iteration' in trainOption)
        som.iteration = trainOption.iteration;
      if('trainInterval' in trainOption)
        som.trainInterval = trainOption.trainInterval;
    }

    var units = som.units;

    var counter = som.iteration;
    var range = som.range * (counter / som.iteration);

    var trainSample = function(sample) {
      var bmu = som.getBMU(sample);
      // console.log({'bmu' : bmu});
      units.forEach(function(unit) {
        // console.log(unit);
        if (bmu != unit) {
          var squaredError = unit.getSquaredError(bmu);
          var activate = som.learningRate * Math.exp(-squaredError / (range * range));
          // console.info({
          //     'unit-weight' : unit.weight,
          //     'bmu-weight' : bmu.weight,
          //     'learning-rate' : som.learningRate,
          //     'squared-error' : squaredError,
          //     'exponential-value' : Math.exp(-squaredError / (range * range)),
          //     'activate' : activate
          // });
          if (activate >= som.threshold * som.learningRate) {
            unit.weight.forEach(function(value, vidx) {
              // adjust unit's each weight value
              var bonusWeight = (bmu.weight[vidx] - value) * activate * som.learningRate;
              // console.info({
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
    };

    var trainTimer = setInterval(function() {
      if (counter === 0) {
        clearInterval(trainTimer);
        // console.log('train finished');
      } else {
        som.trainSet.forEach(trainSample);
        counter--;
        console.log('iteration ' + (som.iteration - counter));
      }
    }, som.trainInterval);

    return trainTimer;
    // console.log('train complete');
    // this.units.forEach(function(unit) {
    //     console.log(unit.weight);
    // });
  }
};

// som unit class
Som.Unit = function SomUnit(weightLength) {
  this.weight = [];
  for (var i = 0; i < weightLength; i++)
    this.weight.push(Math.random());
};
Som.Unit.prototype = {
  weight: [],
  getSquaredError: function(target) {
    // type check
    if (Som.Unit.prototype.isPrototypeOf(target)) {
      // console.log(this.weight.length);
      // console.log(target.weight.length);
      if (this.weight.length == target.weight.length) {
        var squaredError = 0;
        this.weight.forEach(function(value, idx) {
          // get euclidean squared error
          var delta = value - target.weight[idx];
          // console.info({
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
        throw 'Unit\'s weight dimension is not equal';
      }
    } else {
      // console.log('not unit');
      throw 'Param\'s type is not som.unit';
    }
  },
  addWeight: function(idx, value) {
    this.weight[idx] += value;
  }
};

// export module
module.exports = Som;
module.exports.Unit = Som.Unit;
