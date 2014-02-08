
var Fiber = Npm.require('fibers');
var fs = Npm.require('fs');

var comments   = new Meteor.Collection("comments");
var users      = new Meteor.Collection("users");
var usersTable = new Meteor.Collection("users-table");
var tables     = {
    comments: comments,
    users: users,
    usersTable: usersTable
};

var init = Fiber(function (name, table) {
    var fiber = Fiber.current;

    fs.readFile('server/' + name + '.json', 'utf8', function (err, data) {
        if (err) {
            logger.error('Error: ' + err);
            return;
        }

        var data = EJSON.parse(data);
        logger.log('read server/' + name + '.json');
        fiber.run(data);
    });

    var data = Fiber.yield();
    if (data && data.settings) {

        for ( var i in data.settings ) {
            var name  = data.settings[i].name;
            var found = settings.findOne({ name : name });
            if ( found ) {
                logger.log('update ', name);
                settings.update(
                    { _id : found._id },
                    { $set : data.settings[i] }
                );
            }
            else {
                logger.log('setting ', name);
                settings.insert( data.settings[i] );
            }
        }
    }
});

for ( var name in tables ) {
    var table = tables[name];
    if ( table.find().count() ) break;

    Meteor.startup(function () {
        init.run(name, table);
    });

}

