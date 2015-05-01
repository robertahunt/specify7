/// <reference path='jquery.d.ts'/>
/// <reference path='underscore.d.ts'/>
/// <reference path='backbone.d.ts'/>
/// <reference path='jquery-ui.d.ts'/>

import $ = require('jquery');
import _ = require('underscore');
import Backbone = require('backbone');

class UserTools extends Backbone.View<any> {
    className: string;
    __name__: string;

    user: any;
    tools: [any];

    events() {
        return {
            'click .user-tool': 'clicked'
        }
    }
    constructor(options) {
        super(options);
        this.user = options.user;
        this.tools = options.tools;
    }
    render() {
        var table = $('<table>').appendTo(this.el);
        table.append('<tr><td><a href="/accounts/logout/">Log out</a></td></tr>');
        table.append('<tr><td><a href="/accounts/password_change/">Change password</a></td></tr>');
        table.append(this.tools.map(this.makeItem));

        this.$el.dialog({
            modal: true,
            title: "User Tools",
            close: function() { $(this).remove(); },
            buttons: [
                {text: 'Cancel', click: function() { $(this).dialog('close'); }}
            ]
        });
        return this;
    }
    makeItem(toolDef) {
        var tr = $('<tr>');
        $('<a>', { href: '/specify/task/' + toolDef.task + '/', 'class': 'user-tool' })
            .text(toolDef.title)
            .appendTo($('<td>').appendTo(tr));
        return tr[0];
    }
    clicked(event) {
        event.preventDefault();
        this.$el.dialog('close');

        var index = this.$('.user-tool').index(event.currentTarget);
        this.tools[index].execute();
    }
}

UserTools.prototype.__name__ = "UserTools";
UserTools.prototype.className = "table-list-dialog";

export = UserTools;