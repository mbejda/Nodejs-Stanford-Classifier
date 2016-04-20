var java = require('java');
var PropertiesReader = require('properties-reader');
var cp = require('child_process');

java.classpath.push(__dirname+'/classifier/slf4j-api.jar');
java.classpath.push(__dirname+'/classifier/slf4j-simple.jar');
java.classpath.push(__dirname+'/classifier/stanford-classifier.jar');

var stanfordClassifier = function(properties) {
    var self = this;
    self.properties = java.newInstanceSync("java.util.Properties");

    if (properties === undefined) {
        properties = __dirname+'/classifier/demo.prop';
    }

    if (typeof properties == "string") {
      var propread = PropertiesReader(properties);
      var p = propread.getAllProperties();
      for(var key in p){
          self.properties.setPropertySync(key, p[key]);
      }
    }

    if (typeof properties == "object") {
      for(var key in properties){
          self.properties.setPropertySync(key, properties[key]);
      }
    }

    var hasSpawned = false;
    if (self.properties.getPropertySync('trainFile', '') !== ''){
        hasSpawned = true;
        var tempfilepath = self.properties.getPropertySync('trainFile')+'.ser.gz';

        if (self.properties.getPropertySync('serializeTo', '') === ''){
            self.properties.setPropertySync('serializeTo', tempfilepath);
        }
        if (self.properties.getPropertySync('loadClassifier', '') === '' && self.properties.getPropertySync('serializeTo', '') === '')
            self.properties.setPropertySync('loadClassifier', tempfilepath);
        else if (self.properties.getPropertySync('loadClassifier', '') === '' && self.properties.getPropertySync('serializeTo', '') !== '')
            self.properties.setPropertySync('loadClassifier', self.properties.getPropertySync('serializeTo'));

        if (typeof properties == "string") {
            var child =cp.spawn('java', ['-mx1800m',
                                        '-cp', __dirname+'/classifier/*:.',
                                        'edu.stanford.nlp.classify.ColumnDataClassifier',
                                        '-prop', properties]);

            child.stdout.on('data', function(data) {
              console.log('stdout: '+ data);
            });

            child.stderr.on('data', function(data) {
              console.log('stderr: '+ data);
            });

            child.on('close', function(code){
                console.log('child process closed with code ' + code);
            });

            child.on('exit', function(code) {
              console.log('child process exited with code ' + code);
              self.columnDataClassifier = java.newInstanceSync('edu.stanford.nlp.classify.ColumnDataClassifier', self.properties);
            });

        }
    }

    self.useCDCClassifier = (self.properties.getPropertySync('loadClassifier', '') !== '' || self.properties.getPropertySync('trainFile', '') !== '') ? true : false;
    self.dataSet =   java.newInstanceSync("edu.stanford.nlp.classify.Dataset");

    if (!hasSpawned)
        self.columnDataClassifier = java.newInstanceSync('edu.stanford.nlp.classify.ColumnDataClassifier', self.properties);


};

stanfordClassifier.prototype.train = function(string) {
    var self = this;
    if(!string || string === ''){
        throw new Error('Missing string');
    }
    self.dataSet.addSync(self.columnDataClassifier.makeDatumFromLineSync(string.replace(' ','\t')));
};
stanfordClassifier.prototype.trainAll = function(array) {
    var self = this;
    if(!array || !Array.isArray(array)){
        throw new Error('Missing array');
    }
    var datums = [];
    var list = java.newInstanceSync("java.util.ArrayList");
    array.forEach(function(string){
        list.addSync(self.columnDataClassifier.makeDatumFromLineSync(string.replace(' ','\t')));
    });
    self.dataSet.addAllSync(list);
};
stanfordClassifier.prototype.syncClassifier = function() {
    var self = this;
    if(!self.dataSet){
        throw new Error('No dataset found');
    }
    self.classifier =  self.columnDataClassifier.makeClassifierSync(self.dataSet);

    if (self.properties.getPropertySync('serializeTo', '') !== ''){
      var fos = java.newInstanceSync('java.io.FileOutputStream', self.properties.getPropertySync('serializeTo'));
      var oos = java.newInstanceSync('java.io.ObjectOutputStream', fos);
      oos.writeObject(self.classifier, function(){
          oos.closeSync();
      });

    }
};
stanfordClassifier.prototype.classify = function(string) {
    var self = this;
    if(string === undefined || string === ''){
        throw new Error('Missing string');
    }
    var data;
    if (self.useCDCClassifier){
        data = self.columnDataClassifier.classOfSync(self.columnDataClassifier.makeDatumFromStringsSync(string.replace(/\t/g, ' ').split(' ')));
    }else{
        data = self.classifier.classOfSync(self.columnDataClassifier.makeDatumFromStringsSync(string.replace(/\t/g, ' ').split(' ')));
    }
    return data;
};
stanfordClassifier.prototype.getDataArray = function() {
    var self = this;
    return self.dataSet.getDataArraySync();
};
stanfordClassifier.prototype.getValuesArray = function() {
    var self = this;
    return self.dataSet.getValuesArraySync();
};
stanfordClassifier.prototype.getFeatureCounts = function() {
    var self = this;
    return self.dataSet.getFeatureCountsSync();
};
stanfordClassifier.prototype.getLabelsArray = function() {
    var self = this;
    return self.dataSet.getLabelsArraySync();
};
stanfordClassifier.prototype.getLabelsArray = function() {
    var self = this;
    return self.dataSet.getLabelsArraySync();
};
stanfordClassifier.prototype.trimData = function() {
    var self = this;
    return self.dataSet.trimDataSync();
};
stanfordClassifier.prototype.trimLabels = function() {
    var self = this;
    return self.dataSet.trimLabelsSync();
};
stanfordClassifier.prototype.trimToSize = function(size) {
    var self = this;
    return self.dataSet.trimToSizeSync(size);
};
stanfordClassifier.prototype.numClasses = function() {
    var self = this;
    return self.dataSet.numClassesSync();
};
stanfordClassifier.prototype.numDatumsPerLabel = function() {
    var self = this;
    return self.dataSet.numDatumsPerLabelSync();
};
stanfordClassifier.prototype.numFeatures = function() {
    var self = this;
    return self.dataSet.numFeaturesSync();
};
stanfordClassifier.prototype.numFeatureTokens = function() {
    var self = this;
    return self.dataSet.numFeatureTokensSync();
};
stanfordClassifier.prototype.numFeatureTypes = function() {
    var self = this;
    return self.dataSet.numFeatureTypesSync();
};
stanfordClassifier.prototype.printSparseFeatureMatrix = function() {
    var self = this;
    return self.dataSet.printSparseFeatureMatrixSync();
};
stanfordClassifier.prototype.printSVMLightFormat = function() {
    var self = this;
    return self.dataSet.printSVMLightFormatSync();
};
stanfordClassifier.prototype.randomize = function(int) {
    var self = this;
    return self.dataSet.randomizeSync(int);
};
stanfordClassifier.prototype.size = function() {
    var self = this;
    return self.dataSet.sizeSync();
};
stanfordClassifier.prototype.summaryStatistics = function(string) {
    var self = this;
    if(!self.dataSet){
        throw   new Error('No dataset found');
    }
    var statistics = {};
    var rawStats = self.dataSet.toSummaryStatisticsSync();
    var rawStatsArray = rawStats.split(/\r?\n/);
    for(var i = 0; i < rawStatsArray.length;i++){
        var temp = rawStatsArray[i].split(':');
        statistics[temp[0].trim()] = temp[1].trim();
    }
    return statistics;
};
module.exports = stanfordClassifier;
