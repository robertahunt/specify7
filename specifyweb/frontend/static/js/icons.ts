/// <reference path='jquery.d.ts'/>
/// <reference path='underscore.d.ts'/>

/// <amd-dependency path='text!resources/icons_datamodel.xml!noinline'/>
/// <amd-dependency path='text!resources/icons_disciplines.xml!noinline'/>
/// <amd-dependency path='text!resources/icons_imgproc.xml!noinline'/>
/// <amd-dependency path='text!resources/icons_plugins.xml!noinline'/>
/// <amd-dependency path='text!resources/icons.xml!noinline'/>

import $ = require('jquery');
import _ = require('underscore');

declare var require;

var datamodelIcons  = require('text!resources/icons_datamodel.xml!noinline');
var disciplineIcons = require('text!resources/icons_disciplines.xml!noinline');
var imgprocIcons    = require('text!resources/icons_imgproc.xml!noinline');
var pluginIcons     = require('text!resources/icons_plugins.xml!noinline');
var defaultIcons    = require('text!resources/icons.xml!noinline');


var iconGroups: _.Dictionary<XMLDocument> = {
    datamodel: $.parseXML(datamodelIcons),
    discipline: $.parseXML(disciplineIcons),
    imgproc: $.parseXML(imgprocIcons),
    plugin: $.parseXML(pluginIcons),
    'default': $.parseXML(defaultIcons)
};

var iconDirs = {
    datamodel: '/images/datamodel/',
    discipline: '/images/discipline/',
    imgproc: '/images/imgproc/',
    plugin: '/images/',
    'default': '/images/'
};

function findIconInXML(icon: string, xml: XMLDocument, cycleDetect?: {}) : JQuery {
    var iconNode = $('icon[name="' + icon + '"]', xml);
    cycleDetect = cycleDetect || {};
    if (cycleDetect[icon]) throw new Error('circular_reference_in_icons');
    if (iconNode.attr('alias')) {
        cycleDetect[icon] = true;
        return findIconInXML(iconNode.attr('alias'), xml, cycleDetect);
    }
    return iconNode;
}

export = {
    getIcon: function (icon: string) : string {
        var group, iconFile;
        _.find(iconGroups, function(xml: XMLDocument, name: string) : boolean {
            var iconNode = findIconInXML(icon, xml);
            if (iconNode.length) {
                group = name;
                iconFile = iconNode.attr('file');
                return true;
            }
            return false;
        });

        if (group) {
            return iconDirs[group] + iconFile;
        } else {
            console.warn("unknown icon:", icon); 
            return '/images/unknown.png';
        }
    }
};
