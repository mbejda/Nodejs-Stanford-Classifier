# Major Updates :
## Available Methods :
```
stanfordClassifier.train(string)

stanfordClassifier.trainAll(array)

stanfordClassifier.syncClassifier()

stanfordClassifier.getDataArray()

stanfordClassifier.getValuesArray()

stanfordClassifier.getFeatureCounts()

stanfordClassifier.getLabelsArray()

stanfordClassifier.getLabelsArray()

stanfordClassifier.trimData()

stanfordClassifier.trimLabels()

stanfordClassifier.trimToSize(int)

stanfordClassifier.numClass()

stanfordClassifier.numDatumsPerLabel()

stanfordClassifier.numFeatures()

stanfordClassifier.numFeatureTokens()

stanfordClassifier.numFeatureTypes()

stanfordClassifier.printSparseFeatureMatrix()

stanfordClassifier.printSVMLightFormat()

stanfordClassifier.randomize(int)

stanfordClassifier.size()

stanfordClassifier.summaryStatistics()

```


## Getting Started
Install the `stanford-classifier` Node.js module from the npm repository. The `stanford-classifier` Node.js module uses **Stanford Classifier v3.5.2** internally and has `node-java` as a dependency. Your environment should have Java properly configured to work with `node-java`. You can learn more about `node-java` configurations [here](https://github.com/joeferner/node-java). To install the `stanford-classifier` run the following in the terminal:
```
npm install stanford-classifier --save
```
The module will appear in the projects root node_modules directory. The Node.js module can be viewed in the npm repository https://www.npmjs.com/package/stanford-classifier.

## Dataset
The classifier needs to be trained with pre-trained data. Without trained data, the classifier will not work as expected and will not be accurate. Regardless of which classification algorithm is being used, the classifier needs a robust dataset to yield accurate classifications. I built a small dataset that contains organization and band Twitter descriptions. The dataset can be used to train the `stanford-classifier`. It can be downloaded [here](https://gist.github.com/mbejda/e57d29c887cbda0b5a8f#file-band-or-organization).

## Training And Classifying The Classifier
The `train()` method is used to train the `stanford-classifier` with a pre-trained dataset. Here is an example of how to use the `train()` method to train the `stanford-classifier`.

*Example :*
```
/// Dependencies
var stanfordClassifier = require('stanford-classifier');
var byline = require('byline');
var fs = require('fs');

/// Initialize the Stanford Classifier
var sc = new stanfordClassifier();


var mem = [];

/// Create a stream to read the dataset
var stream = byline(fs.createReadStream('dataset.txt', {
    encoding: 'utf8'
}));

/// Push each line into memory
stream.on('data', function(line) {
    mem.push(line);
});

/// Use the training dataset in memory to train the classifier dataset
stream.on('end', function() {
    for (var i = 0; i < mem.length; i++) {
        var line = mem[i];
        sc.train(line);
    }

/// Sync the classifier with the classifiers dataset
    sc.syncClassifier();
  
/// Use the classifier
  console.log(sc.classify('Our Twitter run by the band and crew to give you an inside look into our lives on the road'));
/// BAND
});
```
After the classifier has been trained use the `syncClassifier()` method to sync the trained dataset with the classifier.


## Customizing The Classifier
Options can be sent directly to the classifier when initializing the `stanford-classifier` instance. 
```
var sc = new stanfordClassifier(options);
```
The options can either be a path to a property file or an object. The default options are the following :
```
#
# Features
#
useClassFeature=true
1.useNGrams=true
1.usePrefixSuffixNGrams=true
1.maxNGramLeng=4
1.minNGramLeng=1
1.binnedLengths=10,20,30
#
# Printing
#
# printClassifier=HighWeight
printClassifierParam=200
#
# Mapping
#
goldAnswerColumn=0
displayedColumn=1
#
# Optimization
#
intern=true
sigma=3
useQN=true
QNsize=15
tolerance=1e-4

```

other options that can be used are [here](http://nlp.stanford.edu/nlp/javadoc/javanlp/edu/stanford/nlp/classify/ColumnDataClassifier.html "stanford classifer").

<hr>
## Resources
**NPM Repository :**<br>
[https://www.npmjs.com/package/stanford-classifier](https://www.npmjs.com/package/stanford-classifier)
<br>
**Github Repository:**<br>
[https://github.com/mbejda/Nodejs-Stanford-Classifier](https://github.com/mbejda/Nodejs-Stanford-Classifier)<br>
**Dataset:**<br>
[https://gist.github.com/mbejda/e57d29c887cbda0b5a8f#file-band-or-organization](https://gist.github.com/mbejda/e57d29c887cbda0b5a8f#file-band-or-organization)<br>

**Blog :**<br>
[http://www.mbejda.com/using-the-stanford-classifier-with-node/](http://www.mbejda.com/using-the-stanford-classifier-with-node/)


<br>
If you need any help, send me a tweet on twitter<br>
[@notmilobejda](https://twitter.com/notmilobejda).
<br>
![NPM](https://nodei.co/npm/stanford-classifier.png)(https://nodei.co/npm/stanford-classifier/)




