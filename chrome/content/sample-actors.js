var gSerialNumber = 0

/*======================
 * Tab-lifetime actor.
 */

function SampleTabActor(aConnection, aTab) {
  this.conn = aConnection;
  this.tab = aTab;
  this.serial = gSerialNumber++;
}

SampleTabActor.prototype = {
  /**
   * actorPrefix will be included in the actor id, to make packet
   * debugging easier.  Optional.
   */
  actorPrefix: "sampleTab",

  /**
   * The grip method returns a jsonable object that describes
   * the actor.
   */
  grip: function() {
    return { actor: this.actorID, // actorID is set when you add the actor to a pool.
             serial: this.serial };
  },

  /**
   * ping request handler, returns a "pong" packet.  See
   * prototype.requestTypes below.
   */
  onPing: function(aRequest) {
    // The "from" attribute is not provided, the protocol handler will
    // add that for us.
    return { "pong": this.serial }
  },

  /**
   * The disconnect method is called when the protocol no longer needs
   * this actor.  For tab actors this might happen when the tab is
   * closed.
   */
  disconnect: function() {
  },
};

/**
 * Hook up request types for this actor.
 */
SampleTabActor.prototype.requestTypes = {
  "ping": SampleTabActor.prototype.onPing
};

/**
 * A factory for creating tab-lifetime actors.
 *
 * The factory function is handed a connection, a tab-lifetime actor
 * pool, and the browser tab element.  In most
 * cases you'll want to add the actor to the provided actor pool.
 */
function sampleTabActorFactory(aConnection, aPool, aTab) {
  let actor = new SampleTabActor(aConnection, aTab);
  aPool.addActor(actor);
  return actor;
}

/*
 * The first parameter is the name of the request type that will be
 * used by clients to fetch the actor. */
DebuggerServer.tabActorFactory("sampleTabActor", sampleTabActorFactory);

/*=========================
 * Context-lifetime actor.
 */

function SampleContextActor(aConnection, aTab) {
  this.conn = aConnection;
  this.tab = aTab;
  this.serial = gSerialNumber++;
}

SampleContextActor.prototype = {
  /**
   * actorPrefix will be included in the actor id, to make packet
   * debugging easier.  Optional.
   */
  actorPrefix: "sampleContext",

  /**
   * The grip method returns a jsonable object that describes
   * the actor.
   */
  grip: function() {
    return { actor: this.actorID, // actorID is set when you add the actor to a pool.
             serial: this.serial };
  },

  /**
   * ping request handler, returns a "pong" packet.  See
   * prototype.requestTypes below.
   */
  onPing: function(aRequest) {
    // The "from" attribute is not provided, the protocol handler will
    // add that for us.
    return { "pong": this.serial }
  },

  /**
   * The disconnect method is called when the protocol no longer needs
   * this actor.  For context actors this might happen when the tab is
   * navigated.
   */
  disconnect: function() {
  },
};

/**
 * Hook up request types for this actor.
 */
SampleContextActor.prototype.requestTypes = {
  "ping": SampleContextActor.prototype.onPing
};

/**
 * A factory for creating context-lifetime actors.
 *
 * The factory function is handed a connection, a context-lifetime actor
 * pool, and the browser tab element.  In most
 * cases you'll want to add the actor to the provided actor pool.
 */
function sampleContextActorFactory(aConnection, aPool, aTab) {
  let actor = new SampleContextActor(aConnection, aTab);
  aPool.addActor(actor);
  return actor;
}

/*
 * The first parameter is the name of the request type that will be
 * used by clients to fetch the actor. */
DebuggerServer.contextActorFactory("sampleContextActor", sampleContextActorFactory);
