"use strict";

var $ = require('jquery');
var _ = require('underscore');

var schema         = require('./../schema.js');
var attachmentserverbase = require('./attachments.js');

function placeholderforlorisauthentication(notused) {
    return $.get('/attachment_gw/get_token/', { filename: 'asfdas' });
}

// It would be nice if we could clean this up so that this js file would be
// specific to the server type (e.g. Loris), not the instance (Loris running
// on server our_loris.example.org)
// the classic way would be to write a Class for the server type, let's say
// Loris (version 2 — assuming that upload would work for any version from 2.0
// to 2.9x)
//
// (ES6 example)
// class Loris2 {
//   constructor(name, url, file_upload_url) {
//     this.name = name;
//     this.url = url;
//     this.file_upload_url = file_upload_url;
//   }
// }
// note that the constructor above does not take the JS_SRC arg from the
// settings Python dictionary. Instead the dictionary would have a TYPE key,
// where the value could be Loris2 for the above class. The file could be called
// loris2.js using the convention that the filename is the snake case version of
// the camelcase class (convention over configuration).
// attachmentplugin.js when populating the drop down should reed the settings
// json and create an instance for every entry. It would pass the servername
// key as the name argument, so if your settings file that gets serialized as
// json
//
// 'LORIS': {
//            'URL': 'http://127.0.0.1:5050/loris',
//            'FILEUPLOAD_URL': 'http://127.0.0.1:5050/loris/upload_image',
//            'KEY': 'SECRET-KEY-HERE',
//            'JS_SRC':'attachmentserverpublic.js'
//           }
//
// it should call:
//   new Loris2("Loris", "http://127.0.0.1:5050/loris", "http://127.0.0.1:5050/loris/upload_image", "SECRET-KEY-HERE")
// it would basically iterate over all dictionaries, fetch each's TYPE key and use that as the class to call new on passing the other
// params as args
//
// Note:
// in ES5, the 'old' JavaScript, you'd use
// function Loris2(name, url, file_upload_url) {
//   this.name = name;
//   this.url = url;
//   this.file_upload_url = file_upload_url;
// }

var attachmentserverpublic = {
  servername: 'LORIS', // This is another case of coupling; this JavaScript should know about the server type, not the specific instance
  getThumbnail: function(attachment, scale) {
      scale || (scale = 256);
      var style = "max-width:" + scale + "px; " + "max-height:" + scale + "px;";
      var base_url = this.getSetting('base_url');
      var attachmentlocation = attachment.get('attachmentlocation');
      return placeholderforlorisauthentication(attachmentlocation).pipe(function(token) {
          return $('<img>', {src: `${base_url}/${attachmentlocation}/full/${scale},/0/default.jpg`, style: style});
      });
  },
  uploadFile: function(file, progressCB) {
      var formData = new FormData();
      var attachment;

      formData.append('media', file);
      var attachmentlocation = file.name;

      return $.ajax({
              url: this.getSetting('fileupload_url'),
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false
          }).pipe(() => {
          var attachment = new schema.models.Attachment.Resource({
              attachmentlocation: attachmentlocation,
              mimetype: file.type,
              origfilename: file.name,
              ispublic: 1,
              servername: this.servername
          });
          return attachment;
      });
  },
  openOriginal: function(attachment) {
      var attachmentlocation = attachment.get('origfilename');
      var base_url = this.getSetting('base_url');
      var src = `${base_url}/${attachmentlocation}/full/full/0/default.jpg`;
      window.open(src);
  }
};

module.exports = Object.assign(Object.create(attachmentserverbase), attachmentserverpublic);
