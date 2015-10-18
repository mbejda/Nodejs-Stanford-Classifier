The [Stanford classifier](http://nlp.stanford.edu/software/classifier.shtml "stanford classifier") is one of the most powerful free classifying libraries available. Given the right amount of data, it can be used to classify blocks of texts with good accuracy. This post is about integrating and using the Stanford Classifier with Node.js. 

## Getting started
Install the `stanford-classifier` Node.js module from the npm repository. The `stanford-classifier` Node.js module uses **Stanford Classifier v3.5.2** internally and has `node-java` as a dependecy. Your environment should have Java properly configured to work with `node-java`. To install the `stanford-classifier` run the following in the terminal:
```
npm install stanford-classifier --save
```
The module will appear in the projects root node_modules directory. 

## Training The Classifier
The classifier needs to be trained with pre-trained data. Without trained data, the classifier will not work as expected and will not be accurate. Regardless of which classification algorithm is being used, Naive Bayes or max entropy, the classifier needs a robust dataset to yield accurate classifications. I built a small dataset that contains organization and band Twitter descriptions. The dataset can be used to train the `stanford-classifier`. It can be downloaded from the Gist below. 
<script src="https://gist.github.com/mbejda/e57d29c887cbda0b5a8f.js"></script>

## Classifying With The Classifier
The `train()` method is used to train the `stanford-classifier` with the pre-trained dataset. Here is an example of how to use the `train()` method to train the `stanford-classifier`.

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
After the classifier has been trained, the `syncClassifier()` method syncs the trained dataset with the classifier. 


## Customizing The Classifier
Options can be sent directly to the classifier when initializing the `stanford-classifier` instance. 
```
var sc = new stanfordClassifier(options);
```
The options can either be a path to a property file or an object with options. The default options are the following : 
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

other options can be used are [here](http://nlp.stanford.edu/nlp/javadoc/javanlp/edu/stanford/nlp/classify/ColumnDataClassifier.html "stanford classifer").

If you need any help, send me a tweet on twitter
[@notmilobejda]('https://twitter.com/notmilobejda).

Enjoy*

