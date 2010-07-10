concat = function(a, b)
{
    var c = [];
    for (var x in a)
    {
        c.push(a[x]);
    }
    
    for (var x in b)
    {
        c.push(b[x]);
    }
    
    return c;
};

bind = function(scope, fn) {
    return function() {
        fn.apply(scope, arguments);
    };
};


function Sequencer(scope /* arguments: functions */)
{
    this._scope = scope;
    this._position = 0;
    this._functions = [];
    
    this.params = {};
    
    for (var iter = 1, fn; fn = arguments[iter]; iter++)
    {
        this._functions.push(fn);
    }

    this.next = bind(this, Sequencer._callback);
}

Sequencer._callback = function()
{
    this._next(arguments);
};

/**
 * Parameter object which functions can store data in to pass along.
 */
Sequencer.prototype.params = null;

Sequencer.prototype.run = function()
{
    this._next(arguments);
};

Sequencer.prototype._next = function(args)
{
    var fn = this._functions.shift();
    
//    var boundFn = b(this._scope, fn);
    var results = fn.apply(this._scope, concat([this], args));
    
    if (results)
    {
        this._next(results);
    }
};

exports.Sequencer = Sequencer;