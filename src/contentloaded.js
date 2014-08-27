/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.3
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

function onDOMReady (win, fn) {
	
	var modern = doc[addEventListener],
	
	addEventListener = 'addEventListener',
	
	done = false,
	
	windows = 1,
	
	fns = {
		win : win,
		fns
	},

	adder = (function () {
		return modern
		?	function (o, e, fn) {o[addEventListener] (e, fn, false)}
		:	function (o, e, fn) {o['attachEvent'] ('on' + e, fn)}
	})(),
	
	remover = (function () {
		return modern
		?	function (o, e, fn) {o['removeEventListener'] (e, fn, false)}
		:	function (o, e, fn) {o['detachEvent'] ('on' + e, fn)}
	})(),
	
	events = function (adderOrRemover) {
		modern
			? adderOrRemover (doc, 'DOMContentLoaded', init)
			: adderOrRemover (doc, 'readystatechange', init)
		adderOrRemover (win, 'load', init)
	},
	
	// @win window reference
	// @fn function reference
	contentLoaded = function (win, fn) {

		var top = true,

		doc = win.document, root = doc.documentElement,

		init = function(e) {
			if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
			if (!done && (done = true)) {
				events (remover);
				fn.call(win, e.type || e);
			}
		},

		poll = function() {
			try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
			init('poll');
		};

		if (doc.readyState == 'complete') fn.call(win, 'lazy');
		else {
			if (!modern && root.doScroll) {
				try { top = !win.frameElement; } catch(e) { }
				if (top) poll();
			}
			events (adder)
		}
	}
	
	return function (win, fn) {
		done
		? fn.call (win);	//	DOM is ready, immediately call function
		: contentLoaded (win, fn)
	}
}
