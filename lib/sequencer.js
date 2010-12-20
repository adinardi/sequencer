/*
Copyright 2010 Angelo R. DiNardi (angelo@dinardi.name)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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

bind = function(scope, fn, args) {
    return function() {
        var fnArgs = null;
        if (args)
        {
            fnArgs = concat([args], arguments);
        }
        fn.apply(scope, fnArgs || arguments);
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
    //this.nextLoop = bind(this, Sequencer._nextLoop);
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

Sequencer.prototype.nextFn = function(args)
{
    var fn = this._functions.shift();
    
    return bind(this._scope, fn, this);
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

Sequencer.prototype.clone = function() {
    var seq = new Sequencer(this._scope);
    seq._functions = this._functions.slice(0);

    return seq;
};

exports.Sequencer = Sequencer;
