/**
 * Load this script in xpcshell and connect...
 */
const Cc = Components.classes;
const Cu = Components.utils;

Cu.import("resource://gre/modules/devtools/dbg-client.jsm");

var gTransport = null;
var gQuit = false;

function connect(aPort, aHost) {
  gTransport = debuggerSocketConnect(aHost ? aHost : "localhost", aPort);
  gTransport.hooks = {
    onClosed: function() {
      print("Connection closed, quitting.");
      gQuit = true;
    },
    onPacket: function(aPacket) {
      print("Got: " + JSON.stringify(aPacket));
    }
  };
  gTransport.ready();
}

try {
  dump("Connecting to port " + arguments[0] + "\n");
  connect(arguments[0], arguments[1]);
} catch(ex) {
  dump("Couldn't connect: " + ex);
  quit(1);
}

let mainThread = Cc["@mozilla.org/thread-manager;1"].getService().mainThread;

dump("Enter a blank line to display pending packets.\n");

while (!gQuit) {
  while(mainThread.hasPendingEvents()) {
    try {
      mainThread.processNextEvent(true);
    } catch(ex) {
      dump("Got exception: " + ex + "\n");
    }
  }

  let cmd = readline();
  if (cmd != "") {
    try {
      let packet = JSON.parse(cmd);
      gTransport.send(packet);
    } catch(ex) {
      dump("Couldn't parse packet\n");
    }
  }
}
while (mainThread.hasPendingEvents())
  mainThread.processNextEvent(true);
