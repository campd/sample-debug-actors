Cu.import("resource:///modules/dbg-browser-server.jsm");

var DebuggerSample = {
  onLoad: function() {


    // Initialize the browser debugger.
    initBrowserDebugger();

    // Add our actor implementations to the mix.
    DebuggerServer.addActors("chrome://sampledbg/content/sample-actors.js");

    // Open a TCP listener on arbitrarily-selected port 2929.
    try {
      DebuggerServer.openListener(2929, true);
    } catch(ex) {
      dump("Couldn't start debugging server: " + ex);
    }
  },
};

window.addEventListener("load", function () { DebuggerSample.onLoad(); },
                        false);
