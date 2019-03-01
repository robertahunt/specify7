"use strict";

var $ = require('jquery');
var _ = require('underscore');


var api         = require('./specifyapi.js');
var UIPlugin    = require('./uiplugin.js');
var settings = require('./attachmentsettings.js');

// If possible, this could be improved if we could glob the entire
// ./attachments/ directory and require every .js file in it
const serverPlugins = [
    require('./attachments/attachments.js'),
    require('./attachments/attachmentserverpublic.js')
];


module.exports =  UIPlugin.extend({
        __name__: "AttachmentsPlugin",
        events: {
            'change :file': 'fileSelected',
            'click .specify-attachment-display a': 'openOriginal'
        },
        render: function() {
            var self = this;
            if (serverPlugins.find(plugin => plugin.servername === 'PRIVATE') == null) { // As commented in attachments/attechmentserverpublic.js, this coupling of the js class to the config is unfortunate. The js class should be completely oblivious to the actual server instances, only know about the types (e.g. Specify WAS, LORIS, IIP). It would make more sense to declare a default server in the settings file, then look if the default server is present. On the other hand, we need to remember that the default server possible should not bne public
                self.$el.replaceWith('<div>Attachment server unavailable.</div>');
                return this;
            }
            var control = $('<div class="specify-attachment-container">');
            self.$el.replaceWith(control);
            self.setElement(control);

            if (self.model && self.model.get('attachment')) {
                self.model.rget('attachment', true).done(function(attachment) {
                    self.displayAttachment(attachment);
                });
            } else {
                self.addAttachment();
            }
            return this;
        },
        addAttachment: function() {
            this.$el.append(
                $('<form enctype="multipart/form-data">').append(
                    'Attachment Server: ',
                    $('<select selected="PRIVATE" id="attachmentserver">').append( // related to above; apart from that this should not be a hard coded name, but the name of the server set as default
                        Object.keys(settings).map(
                            server => $('<option>', {value: server})
                                .text(server.charAt(0).toUpperCase() + server.substring(1).toLowerCase())
                        )
                    ),
                    '<input type="file" name="file">'
                )
            );
         },
        fileSelected: function(evt) {
            var files = this.$(':file').get(0).files;
            if (files.length === 0) return;

            this.startUpload(files[0]);
        },
        startUpload: function(file) {
            var self = this;

            self.progressBar = $('<div class="attachment-upload-progress">').progressbar();

            self.progressDialog = $('<div>', {title: 'Uploading'})
                .appendTo(self.el)
                .append(self.progressBar)
                .dialog({ modal:true });

            var sel = this.$('#attachmentserver').get(0);
            var selected = sel.options[sel.selectedIndex];
            var plugin = serverPlugins.find(plugin => plugin.servername === selected.value); // same dependency on the servername; should be server type. The setup file should provide server name, and the type which then would be used to identify which JS class to send the messages to; the Python dictionaries for each server name should have a key that specifies the type, so you could have a 'MY_IIIF' that is 'TYPE': 'LORIS', and to be really sure, we might even specify a version number range (so you can state that your plugin has been tested with Loris versions 4.0 through 8.5)
            if (plugin == null) {
                console.error("no attachment plugin for server type:", selected.value);
                return;
            }

            plugin.uploadFile(file, function(progressEvt) {
                self.uploadProgress(progressEvt);
            }).done(function(attachment) {
                self.uploadComplete(attachment);
            });
        },
        uploadProgress: function (evt) {
            var self = this;
            if (evt.lengthComputable) {
                self.progressBar.progressbar('option', {
                    value: evt.loaded,
                    max: evt.total
                });
            } else {
                self.progressBar.progressbar('option', 'value', false);
            }
        },
        uploadComplete: function(attachment) {
            var self = this;
            self.trigger('uploadcomplete', attachment);
            self.model && self.model.set('attachment', attachment);
            self.displayAttachment(attachment);
            self.progressDialog.dialog('close');
        },
        displayAttachment: function(attachment) {
            this.$el.empty().append('<div class="specify-attachment-display">');

            const plugin = serverPlugins.find(
                plugin => plugin.servername === (attachment.get('ispublic') ? 'LORIS' : 'PRIVATE')
            );

            plugin.getThumbnail(attachment).done(img => {
                $('<a>').append(img).appendTo(this.$('.specify-attachment-display'));
            });
        },
        openOriginal: function(evt) {
            evt.preventDefault();
            this.model.rget('attachment', true).done(function(attachment) {
                const plugin = serverPlugins.find(
                    plugin => plugin.servername === (attachment.get('ispublic') ? 'LORIS' : 'PRIVATE')
                );
                plugin.openOriginal(attachment);
            });
        }
    }, { pluginsProvided: ['AttachmentPlugin'] });
