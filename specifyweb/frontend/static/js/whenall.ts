/// <reference path='jquery.d.ts'/>
/// <reference path='underscore.d.ts'/>

import $ = require('jquery');
import _ = require('underscore');

export = function(deferreds: [any]) : JQueryPromise<[any]> {
    return $.when.apply($, _(deferreds).toArray()).pipe(function() { return _(arguments).toArray(); });
};

