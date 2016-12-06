
var through = require("through2"),
	fs = require("fs"),
	path = require('path'),
	Q = require('q');


var htmlStr = '',
	inHtml = '',
	url = '';

function tohtml(opt) {

	opt = opt || {};

	function aggregateFiles(file, enc, callback) {

		// 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
		if (file.isNull()) {
		    this.push(file);
		    return cb();
		}

		// 插件不支持对 Stream 对直接操作，跑出异常
		if (file.isStream()) {
		    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		    return cb();
		}

		// 将文件内容转成字符串，并调用 preprocess 组件进行预处理
		// 然后将处理后的字符串，再转成Buffer形式

		if (file.isBuffer()) {
			htmlStr = textReplace(file, opt);
		}
		file.contents = new Buffer(htmlStr);

		// 下面这两句基本是标配啦，可以参考下 through2 的API
		this.push(file);

		callback();
	}
	return through.obj(aggregateFiles);
}


function textReplace(file, opt) {
	var reg = /\<\!\-\-\#insert\s+file=\"([\w\/\.]+)\"\s+\-\-\>/;
	var text = file.contents.toString('utf8');
	while(reg.test(text)) {
		text = text.replace(reg, (arg1,arg2) => {
			//console.log(path.join(path.dirname(file.path), arg2))
			url = path.join(path.dirname(file.path), arg2);
			inHtml = urlToHtml(url, opt);

			if (opt.note) {
				inHtml = notefn(arg2, "begin") + inHtml + notefn(arg2, "end");
			}
			return inHtml;
		});
	}
	return text;
}

function notefn(url, type) {
	var str = `\n<!-- ========== ${url}   ${type} ===========-->\n`;
	return str;
}

function urlToHtml(url, opt) {
	var defer = Q.defer();
	url = url.replace(/\\/g,"/")
	fs.exists(url, (exists) =>{
		if(!exists) {
			console.log(url);
			console.log('文件不存在');
		}
	});
	var res = fs.readFileSync(url.replace(/\\/g,"/"),"utf8") ;
	return res;
}


module.exports = tohtml;