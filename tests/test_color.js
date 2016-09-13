var log4js = require('log4js');
var logger = log4js.getLogger();
//var logger = new log4js;
logger.setLevel('INFO');
logger.info("info");
logger.error("error");