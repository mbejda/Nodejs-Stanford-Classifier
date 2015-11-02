var java = require('java');
java.classpath.push(__dirname+'/classifier/stanford-classifier.jar');
var stanfordClassifier = function(properties) {
    var self = this;
    if (typeof properties == "string") {
        var list = properties;
    }
    if (typeof properties == "object") {
        var list = java.newInstanceSync("java.util.Properties");
        for(var key in properties){
            list.setPropertySync(key, properties[key]);
        }
    }
    if (list == undefined) {
        list = __dirname+'/classifier/demo.prop';
    }
    self.classifier = java.newInstanceSync('edu.stanford.nlp.classify.ColumnDataClassifier', list);
    self.dataSet =   java.newInstanceSync("edu.stanford.nlp.classify.Dataset");
};
stanfordClassifier.prototype.train = function(string) {
    var self = this;
    if(!string || string == ''){
        throw new Error('Missing string');
        return;
    }
    self.dataSet.addSync(self.classifier.makeDatumFromLineSync(string.replace(' ','\t')))
};
stanfordClassifier.prototype.trainAll = function(array) {
    var self = this;
    if(!array || !Array.isArray(array)){
        throw new Error('Missing array');
        return;
    }
    var datums = [];
    var list = java.newInstanceSync("java.util.ArrayList");
    array.forEach(function(string){
        list.addSync(self.classifier.makeDatumFromLineSync(string.replace(' ','\t')))
    });
    self.dataSet.addAllSync(list)
};
stanfordClassifier.prototype.syncClassifier = function() {
    var self = this;
    if(!self.dataSet){
        throw new Error('No dataset found');
        return;
    }
    self.train =  self.classifier.makeClassifierSync(self.dataSet);
};
stanfordClassifier.prototype.classify = function(string) {
    var self = this;
    if(string == undefined || string == ''){
        throw new Error('Missing string');
        return;
    }
    var data = self.train.classOfSync(self.classifier.makeDatumFromStringsSync(string.replace(/\t/g, ' ').split(' ')));
    return data;
};
stanfordClassifier.prototype.getDataArray = function() {
    var self = this;
    return self.dataSet.getDataArraySync()
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
    return self.dataSet.sizeSync()
};
stanfordClassifier.prototype.summaryStatistics = function(string) {
    var self = this;
    if(!self.dataSet){
        throw   new Error('No dataset found')
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