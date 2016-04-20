var stanfordClassifier = require('../index.js');
var fs = require('fs');
describe("Stanford Classifier", function() {
    var sc = new stanfordClassifier();
    it("Training the classifier", function() {
        for(var i = 0; i < 50; i++){
            sc.train('CAT There is a cat on the roof.');
        }
        for(var i = 0; i < 50; i++){
            sc.train('DOG I have a pet dog.');
        }
        var stats = sc.summaryStatistics();
        expect(stats.numDatums).toEqual('100');
    });
    it("Testing the classifier", function() {
        sc.syncClassifier();
        expect(sc.classify('A dog goes woof.')).toEqual('DOG');
    });
});

describe("Stanford Classifier with propfile", function() {
    var scprop = new stanfordClassifier(__dirname+'/../classifier/demo.prop');

    it("Training the classifier", function() {
        for(var i = 0; i < 50; i++){
            scprop.train('CAT There is a cat on the roof.');
        }
        for(var i = 0; i < 50; i++){
            scprop.train('DOG I have a pet dog.');
        }
        var stats = scprop.summaryStatistics();
        expect(stats.numDatums).toEqual('100');
    });
    it("Testing the classifier", function() {
        scprop.syncClassifier();
        expect(scprop.classify('A dog goes woof.')).toEqual('DOG');

        fs.stat(__dirname+'/../classifier/demo.ser.gz', function(err, stat) {
            if(err === null) {
                console.log('File exists');
            } else if(err.code == 'ENOENT') {
                fs.writeFile('log.txt', 'Some log\n');
            } else {
                console.log('Some other error: ', err.code);
            }
        });
    });
});

describe("Stanford Classifier with propfile and training file", function() {
    var scprop = new stanfordClassifier(__dirname+'/../classifier/20news1.prop');

    it("Training the classifier", function() {
        fs.stat(__dirname+'/../20newsgroups4.ser.gz', function(err, stat) {
            if(err === null) {
                console.log('File exists');
            } else if(err.code == 'ENOENT') {
                fs.writeFile('log.txt', 'Some log\n');
            } else {
                console.log('Some other error: ', err.code);
            }

        });
        //expect(scprop.classify('A dog goes woof.')).toEqual('DOG');
    });
});


describe("Stanford Classifier serialize and load classifier", function() {
    var scload = new stanfordClassifier({loadClassifier: '20newsgroups4.ser.gz'});

    it("Testing the classifier", function() {
        expect(scload.classify('From: decay@cbnewsj.cb.att.com (dean.kaflowitz) Subject: Re: about the bible quiz answers Organization: AT&T Distribution: na Lines: 18  In article <healta.153.735242337@saturn.wwc.edu>, healta@saturn.wwc.edu (Tammy R Healy) writes: >  >  > #12) The 2 cheribums are on the Ark of the Covenant.  When God said make no  > graven image, he was refering to idols, which were created to be worshipped.  > The Ark of the Covenant wasn&apos;t wrodhipped and only the high priest could  > enter the Holy of Holies where it was kept once a year, on the Day of  > Atonement.  I am not familiar with, or knowledgeable about the original language, but I believe there is a word for "idol" and that the translator would have used the word "idol" instead of "graven image" had the original said "idol."  So I think you&apos;re wrong here, but then again I could be too.  I just suggesting a way to determine whether the interpretation you offer is correct.   Dean Kaflowitz '))
                .toEqual('alt.atheism');
    });
});
