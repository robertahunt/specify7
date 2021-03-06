"use strict";

const $ = require('jquery');
const Q = require('q');
const Backbone = require('./backbone.js');

const UIPlugin = require('./uiplugin.js');
const schema = require('./schema.js');

const SetCollectionsView = Backbone.View.extend({
    __name__: "UserCollectionsUI",
    initialize({user, collections, allCollections}) {
        this.user = user;
        this.collections = collections;
        this.allCollections = allCollections;
    },
    render() {
        $('<select multiple style="width:100%">')
            .append(
                this.allCollections.map(
                    collection => $('<option>').text(collection.get('collectionname'))
                        .attr('value', collection.id)
                        .prop('selected', this.collections.includes(collection.id))
                ))
            .appendTo(this.el);

        const save = () => {
            this.collections = (this.$('select').val() || []).map(v => parseInt(v, 10));
            return Q($.ajax(`/context/user_collection_access/${this.user.id}/`, {
                method: 'PUT',
                data: JSON.stringify(this.collections),
                processData: false
            }));
        };

        this.$el.dialog({
            modal: true,
            title: 'Select user collection access.',
            close: function() { $(this).remove(); },
            buttons: {
                Save: function() { save().done(() => $(this).dialog('close')); },
                Cancel: function() { $(this).dialog('close'); }
            }
        });
        return this;
    }
});


module.exports =  UIPlugin.extend({
    __name__: "UserCollectionsPlugin",
    events: {
        'click': 'clicked'
    },
    initialize: function(options) {
        this.user = options.model;
        this.allCollections = new schema.models.Collection.LazyCollection();
    },
    render: function() {
        Q.all([this.user.fetch(), this.allCollections.fetch({limit:0})]).then(() => {
            this.$el.attr('value', 'Collections');
            this.user.isNew() && this.$el.attr('title', 'Save user first.').prop('disabled', true);
        });
        return this;
    },
    clicked: function(event) {
        $.get(`/context/user_collection_access/${this.user.id}/`).done(permitted => {
            new SetCollectionsView({
                user: this.user,
                collections: permitted,
                allCollections: this.allCollections
            }).render();
        });
    }
}, { pluginsProvided: ['UserCollectionsUI'] });

