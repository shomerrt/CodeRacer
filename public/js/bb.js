var View = Backbone.View.extend({
  el: 'body',

  events: {
    'click #loginButton': 'login',
    'click #logoutButton': 'logout',
    'click #exeBtn': 'execute'
  },

  login: function(event) {
    console.log('hi');
    var fbRoot = new Firebase('https://flickering-fire-9251.firebaseio.com/');
    var auth = new FirebaseSimpleLogin(fbRoot, function(err, user) {
      if (err) {
        console.log(err);
      } else if (user) {
        // user authenticated with Firebase
        fbRoot.child("users").child(user.uid).set({displayName: user.displayName, provider: user.provider, id: user.id});
        var hash = user.uid.substring(user.uid.indexOf(":")+1);
        // var loginBtn = document.getElementById('loginButton');
        // loginBtn.appendChild(document.createTextNode( 'Hello '+ user.displayName));

        $("#loginButton").html('Log out');
        $.ajax({
          type: 'GET',
          url: '/login',
          data: {id: hash}
        });
      } else {
        // user is logged out
        console.log('logged out');

      }
    });
    auth.login('facebook');
    auth.logout();
    fbRoot.on('child_added', function(snapshot) {
      var msg = snapshot.val();
      console.log("message: " + msg);
    });
  },

  logout: function(event) {
    $.ajax({
      type: 'GET',
      url: '/logout',
        success: $("#logoutButton").html('Log in')
    });
      var listRef = new Firebase("https://flickering-fire-9251.firebaseio.com/presence/");
      var userRef = listRef.child('facebook:'+req.session.user);

      userRef.remove();

      // Number of online users is the number of objects in the presence list.
      listRef.on("child_removed", function(snap) {
          $('#numActive').html('Currently Playing: ' + snap.numChildren());
      });
  },

  execute: function(event) {
    var editor = ace.edit("firepad-container");
    var codeToExe = editor.getValue();
    var result = eval(codeToExe);
    var consolPanel = document.getElementById('consoleOutput');
    var newNode = document.createElement('p');
    newNode.appendChild(document.createTextNode(result));
    $("#consoleOutput").html(newNode);
  }
});