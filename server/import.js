
var Fiber = Npm.require('fibers');
var fs = Npm.require('fs');

var comments   = new Meteor.Collection("comments");
var users      = new Meteor.Collection("users");
var usersTable = new Meteor.Collection("users-table");
var tables     = {
    comments: comments,
    users: users,
    'users-table' : usersTable
};
var basedir = process.cwd().replace(/[.]meteor\/.*$/, '');
console.log(basedir);

var init = Fiber(function (me) {
    var name = me[0];
    var table = me[1];
    var fiber = Fiber.current;
    console.info('in init of ' + name)

    fs.readFile(basedir + 'server/' + name + '.json', 'utf8', function (err, data) {
        if (err) {
            console.error('Error: ' + err);
            return;
        }

        var data = EJSON.parse(data);
        console.log('read ' + basedir + 'server/' + name + '.json');
        fiber.run(data);
    });

    var data = Fiber.yield();
    console.log(name, data);
    if (data) {
        for ( var i in data ) {
            try {
            table.insert(data[i]);
            } catch(e) { console.error('failed to insert', e ); }
        }
    }
});

Meteor.startup(function () {
    for ( var name in tables ) {
        var table = tables[name];
        if ( table.find().count() ) {
            console.info(name + ' has ' + table.find().count() + ' rows');
        }
        else {
            console.info('initialising ' + name);
            init.run([name, table]);
            break;
        }
    }
});

