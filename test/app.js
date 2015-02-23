var som = require('../src/som');

var s = new som(100, 3);

var i;

for(i = 0; i < 10; i++)
    s.trainSet.push(new som.Unit(3));

var trainer = s.train({
    iteration : 300,
    trainInterval : 0
});

// stop trainer while training
setTimeout(function() {
    clearInterval(trainer)
}, 1000);
