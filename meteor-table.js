var users = new Meteor.Collection("users");

if (Meteor.isClient) {
    Template.table.rows = function() {
        return users.find({}, {limit: 10});
    }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
