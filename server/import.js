
var fs = Npm.require('fs');

var comments   = new Meteor.Collection("comments");
var users      = new Meteor.Collection("users");
var usersTable = new Meteor.Collection("users-table");
var tables     = {
    comments: comments,
    users: users,
    'users-table' : usersTable
};

Meteor.startup(function () {
    var basedir = process.cwd().replace(/[.]meteor\/.*$/, '');
    console.log(basedir);
    console.log(tables);

    for ( var name in tables ) {
        console.log(name);
        var table = tables[name];
        if ( table.find().count() ) {
            console.info(name + ' has ' + table.find().count() + ' rows');
        }
        else {
            console.info('initialising ' + name);
            var data = fs.readFileSync(basedir + 'server/' + name + '.json', { encoding: 'utf8' });
            data = EJSON.parse(data);
            if (data) {
                for ( var i in data ) {
                    console.log(data[i]);
                    table.insert(data[i]);
                }
            }
            break;
        }
    }
});

