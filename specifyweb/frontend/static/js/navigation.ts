/// <reference path='jquery.d.ts'/>
/// <reference path='underscore.d.ts'/>
/// <reference path='backbone.d.ts'/>

import $ = require('jquery');
import _ = require('underscore');
import Backbone = require('backbone');

export = {
    navigate: function(url: string, options?: Backbone.NavigateOptions) : void {
        var origin = window.location.protocol + '//' + window.location.host;
        url = url.replace(RegExp('^' + origin), '');
        Backbone.history.navigate(url.replace(/^\/specify/, ''), options);
    },
    go: function(url: string) : void {
        this.navigate(url, true);
    },
    push: function(url: string) : void {
        this.navigate(url, {trigger: false, replace: true});
    },
    switchCollection: function(collection: any, nextUrl: string) : void {
        $.ajax({
            url: '/context/collection/',
            type: 'POST',
            data: _.isNumber(collection) ? collection : collection.id,
            processData: false
        }).done(function() {
            if (nextUrl) {
                window.location.assign(nextUrl);
            } else {
                window.location.reload();
            }
        });
    }
};
