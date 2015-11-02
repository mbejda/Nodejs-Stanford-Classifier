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
         throw new Error('Missing string')
    }
    self.dataSet.addSync(self.classifier.makeDatumFromStringsSync(string.split(' ')));
};
stanfordClassifier.prototype.syncClassifier = function() {
    var self = this;
    if(!self.dataSet){
        throw  new Error('No dataset found')
    }
    self.train =  self.classifier.makeClassifierSync(self.dataSet);
};
stanfordClassifier.prototype.classify = function(string) {
    var self = this;
    if(string == undefined || string == ''){
        throw  new Error('Missing string')
    }
    var data = self.train.classOfSync(self.classifier.makeDatumFromStringsSync(string.split(' ')));
    return data;
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