Cu.import("resource:///modules/dbg-server.jsm");

var DebuggerSample = {
  onLoad: function() {
    // Initialize the browser debugger.
    if (!DebuggerServer.initialized) {
      DebuggerServer.init();
      DebuggerServer.addBrowserActors();
    }

    // Add our actor implementations to the mix.
    DebuggerServer.addActors("chrome://sampledbg/content/sample-actors.js");

    try {
      // Open a TCP listener on arbitrarily-selected port 2929.  The
      // second parameter specifies a local-only (loopback device)
      // listener.  Change this parameter to 'false' to allow remote
      // connections to the server.
      DebuggerServer.openListener(2929, true);
    } catch(ex) {
      dump("Couldn't start debugging server: " + ex);
    }
  },
};

window.addEventListener("load", function () { DebuggerSample.onLoad(); },
                        false);
