// ==UserScript==
// @name         9anime Batch Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download all episodes automatically. Hope you have IDM or some download manager, as all the files will be downloaded continuously. Open any episode page and choose the episodes to download and hit Start!
// @author       wrick17
// @match        https://9anime.to/watch/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  var href = '';
  var cssBlob = '.download-section { margin-bottom: 20px; } .batch-download, .cancel-download { display: inline-block; margin-bottom: 0; font-weight: 400; text-align: center; vertical-align: middle; touch-action: manipulation; cursor: pointer; border: 1px solid transparent; white-space: nowrap; padding: 0 17px; font-size: 13px; border-radius: 2px; -ms-user-select: none; user-select: none; color: #B4B4B4; background-color: #51286A; border-color: #51286A; height: 36px; line-height: 36px; } input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; } input[type="number"] { -moz-appearance: textfield; } .start, .end { background: #0f0e13; text-transform: none; cursor: text; -webkit-border-radius: 2px; -khtml-border-radius: 2px; -moz-border-radius: 2px; -ms-border-radius: 2px; -o-border-radius: 2px; border-radius: 2px; height: 36px; border: 1px solid transparent; padding-right: 10px; padding-left: 10px; appearance: none; -webkit-appearance: none; text-align: center; } .to-span { margin: 0 10px; }';
  function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
  }
  addGlobalStyle(cssBlob);
  $('#servers').before('<div class="download-section"></div>');
  $('.alert.alert-warning').hide();
  console.log('horrible');
  var timeout;

  function initiateDownload(continueFlag) {
	var episodes = $('#servers .server:first-child .episodes li').length;
	var currentEpisode = Number($('#servers .server:first-child .episodes li a.active').html());
	var maxEpisode = Number(localStorage.getItem('maxEpisode') || $('.download-section .end').val());
	var startEpisode = Number(localStorage.getItem('startEpisode') || $('.download-section .start').val());

	localStorage.setItem('currentEpisode', currentEpisode);

	if (!continueFlag) {
	  if ($('.toggler.autoplay .fa').hasClass('fa-square-o')) {
		$('.toggler.autoplay .fa').removeClass('fa-square-o').addClass('fa-check-square-o');
	  }
	  localStorage.setItem('maxEpisode', maxEpisode);
	  localStorage.setItem('startEpisode', startEpisode);
	}

	if (!continueFlag && currentEpisode !== startEpisode) {
	  $('#servers .server:first-child .episodes li:nth-child('+ startEpisode +') a').click();
	  reloadDownloadOption();
	  return;
	}
	function searchForDownload() {
	  if ($('.download.movie')[0].href.length && (href != $('.download.movie')[0].href)) {
		href = $('.download.movie')[0].href;
		// console.log(currentEpisode, '->');
		window.open($('.download.movie')[0].href);
		if (currentEpisode < maxEpisode) {
		  $('#servers .server:first-child .episodes li:nth-child('+ (currentEpisode+1) +') a').click();
		} else {
		  stopDownload();
		}
		reloadDownloadOption();
	  } else {
		clearTimeout(timeout);
		timeout = setTimeout(function() {
		  console.log('calling again');
		  searchForDownload();
		}, 1000);
	  }
	}
	searchForDownload();
  }

  function stopDownload() {
	clearTimeout(timeout);
	localStorage.removeItem('currentEpisode');
	localStorage.removeItem('maxEpisode');
	localStorage.removeItem('startEpisode');
	reloadDownloadOption();
  }

  function reloadDownloadOption() {
	var currentEp = localStorage.getItem('currentEpisode');
	if (currentEp) {
	  $('.download-section').html('<button class="cancel-download">Cancel Download</button>');
	  initiateDownload(true);
	} else {
	  var episodes = $('#servers .server:first-child .episodes li').length;
	  $('.download-section').html('');
	  $('.download-section').append('<input value="1" min="1" max="'+ episodes +'" type="number" class="start" />');
	  $('.download-section').append('<span class="to-span"> to </span>');
	  $('.download-section').append('<input type="number" value="'+ episodes +'" min="1" max="'+ episodes +'" class="end" /><span>&nbsp;&nbsp;&nbsp;</span>');
	  $('.download-section').append('<button class="batch-download">Start Download</button>');
	}
  }
  reloadDownloadOption();

  $('body').on('click', '.batch-download', function(e) {
	initiateDownload();
  });

  $('body').on('click', '.cancel-download', stopDownload);

  $('body').on('change', '.start', function(e) {
	var value = $(this).val();
	$('.end').attr('min', value);
  });

  $('body').on('change', '.end', function(e) {
	var value = $(this).val();
	$('.start').attr('max', value);
  });
})();