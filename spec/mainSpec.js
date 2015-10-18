var stanfordClassifier = require('../index.js');
var sc = new stanfordClassifier();
describe("Stanford Classifier", function() {
    it("Training the classifier", function() {
        for(var i = 0; i < 50; i++){
            sc.train('CAT There is a cat on the roof.')
        }
        for(var i = 0; i < 50; i++){
            sc.train('DOG I have a pet dog.')
        }
        var stats = sc.summaryStatistics();
        expect(stats['numDatums']).toEqual('100');
    });
    it("Testing the classifier", function() {
        sc.syncClassifier();
        expect(sc.classify('A dog goes woof.')).toEqual('DOG');
    });
});