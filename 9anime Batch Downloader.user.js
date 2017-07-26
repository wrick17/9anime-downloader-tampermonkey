// ==UserScript==
// @name         9anime Batch Downloader
// @namespace    https://greasyfork.org/en/scripts/31118-9anime-batch-downloader
// @version      1.0
// @description  Download all episodes automatically. Hope you have IDM or some download manager, as all the files will be downloaded continuously. Open any episode page and choose the episodes to download and hit Start!
// @author       wrick17
// @match        https://9anime.to/watch/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if ($('#servers .ranger').length > 0) {

      var activeList = $('#servers .server[data-type="direct"] .episodes.active');
      $('#servers .server[data-type="direct"] .episodes.hidden li').appendTo(activeList);

      $('#servers .ranger').hide();
    }

    var episodesArray = [];
    $('#servers .server[data-type="direct"] .episodes.active li a').each(function(idx, el) {
      episodesArray.push( $(el).html() );
    });

    var interval = setInterval(function() {
      var downloadButton = $('.download.movie');
      var link = downloadButton.attr('href');

      if (link) {
        clearInterval(interval);
        $('#servers')
        .before('<button class="btn btn-primary btn-sm download-trigger" style="margin-bottom: 10px;">Download all of \'em!</button><div class="download-label" style="display: none; color: #9a9a9a; margin-bottom: 15px; ">Add the following links to your download manager and enjoy:</div>')
        .before('<textarea class="download-links" style="display: none; width: 100%; height: 200px; background: #0f0e13; color: #9a9a9a; border: none; margin-bottom: 10px;"></textarea>');
      }
    }, 100);

    $('body').on('click', '.download-trigger', function(e) {

      var downloadButton = $('.download.movie');
      var link = downloadButton.attr('href');

      var match = (/(.*)- (?:[0-9\-]+) -(.*)/g).exec(link);
      var start = match[1] + '- ';
      var end = ' -' + match[2] + '\n';


      var linksBlob = '';
      episodesArray.forEach(function(episode) {
        linksBlob += start + episode + end;
      });

      $('.download-links').val(linksBlob).show();
      $('.download-label').show();

    });

})();
