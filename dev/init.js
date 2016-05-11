var fs = require('fs');
var path = require('path');
var paginate = require('handlebars-paginate');
exports.outLocation = '../';

var cached = {};

var header = fs.readFileSync(path.resolve(__dirname + '/partials/header.hbs'));
var footer = fs.readFileSync(path.resolve(__dirname + '/partials/footer.hbs'));
var below_header = fs.readFileSync(path.resolve(__dirname + '/partials/below_header.hbs'));
var above_footer = fs.readFileSync(path.resolve(__dirname + '/partials/above_footer.hbs'));
var pagination = fs.readFileSync(path.resolve(__dirname + '/partials/pagination.hbs'));

function chunk (arr, len) {

    var chunks = [],
      i = 0,
      n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }

    return chunks;
}

exports.handlebars = function(Handlebars){

    Handlebars.registerHelper('paginate', paginate);

    Handlebars.registerHelper('p_link', function (n, dir, options) {
        if (n == 1){
            return './index.html';
        } else {
            return './ipage-' + n + '.html';
        }
    });

    Handlebars.registerPartial({
        header: header.toString(),
        footer: footer.toString(),
        below_header : below_header.toString(),
        above_footer : above_footer.toString(),
        pagination : pagination.toString()
    });

    Handlebars.registerHelper('lists', function(str, options) {
        var lists;
        var items;
        if (str){
            lists = path.resolve(__dirname + '/data/lists/' + str);
            lists = require(lists);
        }

        this.list = lists;

        var template = new Handlebars.compile(options.fn(this));

        var out = template();
        return out;
    });

    Handlebars.registerHelper('products', function(str, options) {
        // console.log(exports.page_config);
        var page = exports.current.page;
        var dir = path.dirname(page);
        var name = path.basename(page, '.hbs');

        var items;
        var data;
        var lists = path.resolve(__dirname + '/data/' + str);

        if (!cached[lists]){
            data = cached[lists] = require(lists);
            cached[lists].chunks = data.items;
            cached[lists].chunks = chunk(cached[lists].chunks, 100);
            data.total = cached[lists].chunks.length;
        } else {
            data = cached[lists];
        }

        data._page = data._page || 1;

        this.pagination = {
            page: data._page,
            pageCount: data.total
        };

        var chunks = data.chunks;

        data.items = chunks.shift();
        var template = new Handlebars.compile(options.fn(data));
        var out = template();

        if (chunks.length > 0){
            data._page++;
            var pagecontent = fs.readFileSync(page).toString("utf8");
            var file_name = 'ipage-' + data._page + '.hbs';
            var new_file = path.resolve(dir + '/' + file_name);
            fs.writeFileSync(new_file, pagecontent);
            exports.current.hbs.push(file_name);
        }
        return out;
    });
};

exports.data = {
    "javascript" : [],

    "fonts" : [
        "https://fonts.googleapis.com/css?family=Dosis",
        "https://fonts.googleapis.com/css?family=Lobster"
    ],

    "description" : "Mehyar.co - middle east food supplier",
    "title" : "Mehyar.co"
};
