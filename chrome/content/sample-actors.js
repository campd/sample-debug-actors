var gSerialNumber = 0;

/*======================
 * Tab-lifetime actor.
 */

function SampleTabActor(aTab)
{
  this.conn = aTab.conn;
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
    return { "pong": this.serial };
  },

  /**
   * The disconnect method is called when the protocol no longer needs
   * this actor.  For tab actors this might happen when the tab is
   * closed.
   */
  disconnect: function() {
    // Remove our tab actor property so that we don't
    // return ourselves again from the request handler.
    delete aTab._sampleTabActor;
  },
};

/**
 * Hook up request types for this actor.
 */
SampleTabActor.prototype.requestTypes = {
  "ping": SampleTabActor.prototype.onPing
};

/**
 * The request handler for "sampleTabActor". Adds its actor to the tab
 * actor's tabActorPool, which will last as long as the actor.
 */
function sampleTabActorHandler(aTab, aRequest) {
  // Reuse a previously-created actor, if any.
  if (aTab._sampleTabActor) {
    return aTab._sampleTabActor;
  }
  let actor = new SampleTabActor(aTab);
  aTab._sampleTabActor = actor;
  aTab.tabActorPool.addActor(actor);
  return actor.grip();
}

/*
 * The first parameter is the name of the request type that will be
 * used by clients to fetch the actor. */
DebuggerServer.addTabRequest("sampleTabActor", sampleTabActorHandler);

/*=========================
 * Context-lifetime actor.
 */

function SampleContextActor(aTab)
{
  this.conn = aTab.conn;
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
    // Remove our context actor property so that we don't return
    // ourselves again from the request handler.
    delete aTab._sampleTabActor;
  },
};

/**
 * Hook up request types for this actor.
 */
SampleContextActor.prototype.requestTypes = {
  "ping": SampleContextActor.prototype.onPing
};

/**
 * The request handler for "sampleContextActor". Adds its actor to the tab
 * actor's contextActorPool, which will last until the next navigation
 * or the tab is closed.
 */
function sampleContextActorHandler(aTab, aRequest) {
  // Reuse a previously-created actor, if any.
  if (aTab._sampleContextActor) {
    return aTab._sampleContextActor;
  }
  let actor = new SampleContextActor(aTab);
  aTab._sampleContextActor = actor;
  aTab.contextActorPool.addActor(actor);
  return actor.grip();
}

/*
 * The first parameter is the name of the request type that will be
 * used by clients to fetch the actor. */
DebuggerServer.addTabRequest("sampleContextActor", sampleContextActorHandler);
