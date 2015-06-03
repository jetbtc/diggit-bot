// ==UserScript==
// @name        diggit-bot
// @namespace   jet
// @include     https://diggit.io/
// @version     0.0.3
// @grant       none
// ==/UserScript==
/* Riot 2.0.7, @license MIT, (c) 2015 Muut Inc. + contributors */
(function(){var e={version:"v2.0.7"};"use strict";e.observable=function(e){e=e||{};var t={};e.on=function(n,r){if(typeof r=="function"){n.replace(/\S+/g,function(e,n){(t[e]=t[e]||[]).push(r);r.typed=n>0})}return e};e.off=function(n,r){if(n=="*")t={};else if(r){var i=t[n];for(var o=0,u;u=i&&i[o];++o){if(u==r){i.splice(o,1);o--}}}else{n.replace(/\S+/g,function(e){t[e]=[]})}return e};e.one=function(t,n){if(n)n.one=1;return e.on(t,n)};e.trigger=function(n){var r=[].slice.call(arguments,1),i=t[n]||[];for(var o=0,u;u=i[o];++o){if(!u.busy){u.busy=1;u.apply(e,u.typed?[n].concat(r):r);if(u.one){i.splice(o,1);o--}else if(i[o]!==u){o--}u.busy=0}}return e};return e};(function(e,t){if(!this.top)return;var n=location,r=e.observable(),i=u(),o=window;function u(){return n.hash.slice(1)}function f(e){return e.split("/")}function a(e){if(e.type)e=u();if(e!=i){r.trigger.apply(null,["H"].concat(f(e)));i=e}}var l=e.route=function(e){if(e[0]){n.hash=e;a(e)}else{r.on("H",e)}};l.exec=function(e){e.apply(null,f(u()))};l.parser=function(e){f=e};o.addEventListener?o.addEventListener(t,a,false):o.attachEvent("on"+t,a)})(e,"hashchange");e._tmpl=function(){var e={},t=/("|').+?[^\\]\1|\.\w*|\w*:|\b(?:this|true|false|null|undefined|new|typeof|Number|String|Object|Array|Math|Date|JSON)\b|([a-z_]\w*)/gi;return function(t,r){return t&&(e[t]=e[t]||n(t))(r)};function n(e,t){t=(e||"{}").replace(/\\{/g,"￰").replace(/\\}/g,"￱").split(/({[\s\S]*?})/);return new Function("d","return "+(!t[0]&&!t[2]?r(t[1]):"["+t.map(function(e,t){return t%2?r(e,1):'"'+e.replace(/\n/g,"\\n").replace(/"/g,'\\"')+'"'}).join(",")+'].join("")').replace(/\uFFF0/g,"{").replace(/\uFFF1/g,"}"))}function r(e,t){e=e.replace(/\n/g," ").replace(/^[{ ]+|[ }]+$|\/\*.+?\*\//g,"");return/^\s*[\w-"']+ *:/.test(e)?"["+e.replace(/\W*([\w-]+)\W*:([^,]+)/g,function(e,n,r){return r.replace(/\w[^,|& ]*/g,function(e){return i(e,t)})+'?"'+n+'":"",'})+'].join(" ")':i(e,t)}function i(e,n){return"(function(v){try{v="+(e.replace(t,function(e,t,n){return n?"d."+n:e})||"x")+"}finally{return "+(n?'!v&&v!==0?"":v':"v")+"}}).call(d)"}}();(function(e,t){if(!t)return;var n=e._tmpl,r=[],i={},o=document;function u(e,t){for(var n=0;n<(e||[]).length;n++){if(t(e[n],n)===false)n--}}function f(e,t){t&&Object.keys(t).map(function(n){e[n]=t[n]});return e}function a(e,t){return e.filter(function(e){return t.indexOf(e)<0})}function l(e,t){e=t(e)===false?e.nextSibling:e.firstChild;while(e){l(e,t);e=e.nextSibling}}function c(e){var t=e.trim().slice(1,3).toLowerCase(),n=/td|th/.test(t)?"tr":t=="tr"?"tbody":"div";el=o.createElement(n);el.innerHTML=e;return el}function s(e,t){t.trigger("update");u(e,function(e){var r=e.tag,i=e.dom;function o(e){i.removeAttribute(e)}if(e.loop){o("each");return v(e,t)}if(r)return r.update?r.update():e.tag=d({tmpl:r[0],fn:r[1],root:i,parent:t});var u=e.attr,f=n(e.expr,t);if(f==null)f="";if(e.value===f)return;e.value=f;if(!u)return i.nodeValue=f;if(!f&&e.bool||/obj|func/.test(typeof f))o(u);if(typeof f=="function"){i[u]=function(e){e=e||window.event;e.which=e.which||e.charCode||e.keyCode;e.target=e.target||e.srcElement;e.currentTarget=i;e.item=t.__item||t;if(f.call(t,e)!==true){e.preventDefault&&e.preventDefault();e.returnValue=false}t.update()}}else if(/^(show|hide|if)$/.test(u)){o(u);if(u=="hide")f=!f;i.style.display=f?"":"none"}else{if(e.bool){i[u]=f;if(!f)return;f=u}i.setAttribute(u,f)}});t.trigger("updated")}function p(e){var t={},n=[];l(e,function(e){var n=e.nodeType,o=e.nodeValue;if(n==3&&e.parentNode.tagName!="STYLE"){r(e,o)}else if(n==1){o=e.getAttribute("each");if(o){r(e,o,{loop:1});return false}var f=i[e.tagName.toLowerCase()];u(e.attributes,function(n){var i=n.name,o=n.value;if(/^(name|id)$/.test(i))t[o]=e;if(!f){var u=i.split("__")[1];r(e,o,{attr:u||i,bool:u});if(u){e.removeAttribute(i);return false}}});if(f)r(e,0,{tag:f})}});return{expr:n,elem:t};function r(e,t,r){if(t?t.indexOf("{")>=0:r){var i={dom:e,expr:t};n.push(f(i,r||{}))}}}function d(t){var i=t.opts||{},a=c(t.tmpl),l=t.root,d=t.parent,v=p(a),m={root:l,opts:i,parent:d,__item:t.item},g={};f(m,v.elem);u(l.attributes,function(e){g[e.name]=e.value});function h(){Object.keys(g).map(function(e){var t=i[e]=n(g[e],d||m);if(typeof t=="object")l.removeAttribute(e)})}h();if(!m.on){e.observable(m);delete m.off}if(t.fn)t.fn.call(m,i);m.update=function(e,t){if(d&&a&&!a.firstChild){l=d.root;a=null}if(t||o.body.contains(l)){f(m,e);f(m,m.__item);h();s(v.expr,m);!t&&m.__item&&d.update();return true}else{m.trigger("unmount")}};m.update(0,true);while(a.firstChild){if(t.before)l.insertBefore(a.firstChild,t.before);else l.appendChild(a.firstChild)}m.trigger("mount");r.push(m);return m}function v(e,t){if(e.done)return;e.done=true;var r=e.dom,i=r.previousSibling,o=r.parentNode,u=r.outerHTML,f=e.expr,l=f.split(/\s+in\s+/),c=[],s,p;if(l[1]){f="{ "+l[1];p=l[0].slice(1).trim().split(/,\s*/)}t.one("mount",function(){var e=r.parentNode;if(e){o=e;o.removeChild(r)}});function v(){return Array.prototype.indexOf.call(o.childNodes,i)+1}t.on("updated",function(){var e=n(f,t);is_array=Array.isArray(e);if(is_array)e=e.slice(0);else{if(!e)return;var r=JSON.stringify(e);if(r==s)return;s=r;e=Object.keys(e).map(function(t,n){var r={};r[p[0]]=t;r[p[1]]=e[t];return r})}a(c,e).map(function(e){var t=c.indexOf(e);o.removeChild(o.childNodes[v()+t]);c.splice(t,1)});a(e,c).map(function(n,r){var i=e.indexOf(n);if(p&&!s){var f={};f[p[0]]=n;f[p[1]]=i;n=f}var a=d({before:o.childNodes[v()+i],parent:t,tmpl:u,item:n,root:o});t.on("update",function(){a.update(0,true)})});c=e})}e.tag=function(e,t,n){n=n||noop,i[e]=[t,n]};e.mountTo=function(e,t,n){var r=i[t];return r&&d({tmpl:r[0],fn:r[1],root:e,opts:n})};e.mount=function(t,n){if(t=="*")t=Object.keys(i).join(", ");var r=[];u(o.querySelectorAll(t),function(t){if(t.riot)return;var i=t.tagName.toLowerCase(),o=e.mountTo(t,i,n);if(o){r.push(o);t.riot=1}});return r};e.update=function(){return r=r.filter(function(e){return!!e.update()})}})(e,this.top);if(typeof exports==="object")module.exports=e;else if(typeof define==="function"&&define.amd)define(function(){return e});else this.riot=e})();
(function() {
    window.jetstuff = window.jetstuff || {};

    var status = ["NONE", "IN PROGRESS", "WON", "LOST"],
        gameId = 0,
        gameUpdates = window.jetstuff.gameUpdates = [],
        tiles = [22, 12, 2],
        running = true;

    function Bot() {
        return this.init();
    }

    $.extend(Bot.prototype, {
        settings: {
            autostart: false, // TODO
            chartLength: 20,
            delay: 600,
            historyLength: 200,
            initialBet: 100,
            maxLoss: Infinity,
            maxStreak: 8,
            maxWin: Infinity,
            mines: 13,
            multiplier: 2,
            numRolls: 1,
            prerolls: 0,
            randomTiles: false,
            resetOnLoss: false,
            resetOnMaxStreak: false,
            resetOnWin: true,
            resetType: 'win',
            tiles: [20],
        },
        runningStats: {},
        sessionStats: {
            losses: 0,
            lossStreak: 0,
            grossprofit: 0,
            grossloss: 0,
            wagered: 0,
            wins: 0,
            winStreak: 0,
        },
        stats: {
            losses: 0,
            lossStreak: 0,
            profit: 0,
            wagered: 0,
            wins: 0,
            winStreak: 0,
        },
        history: [],
        games: [],
        running: false,
        streakLength: 0,
        bet: 0,
        halted: false,
        finishStreak: false,
        prerolling: false,
        gameId: 0,
        newGame: true,
        init: function() {
            if(socketio) {
                this.loadSettings();
                this.loadStats();

                socketio.on("update_game", this.listen.bind(this));
                console.info("bot ready");
            } else {
                console.warn("could not start bot!");
            }

            return this;
        },
        start: function(settings) {
            var s = this.settings;

            this.set(settings);

            this.running = true;
            this.finishStreak = false;
            this.startOver = true;

            this.startGame();
        },
        halt: function(finishStreak) {
            if(finishStreak) {
                this.finishStreak = true;
            }
            this.running = false;

            return this;
        },
        startGame: function() {
            var s = this.settings;

            if(!this.running && !this.finishStreak) {
                // console.log('bot is halted. cannot start game.');
                return this;
            }

            if(this.startOver) {
                this.startOver = false;
                this.finishStreak = false;

                s.prerolls = Math.max(0, s.prerolls) || 0

                if(s.prerolls > 0) {
                    this.prerolls = s.prerolls;
                    this.bet = 0;
                } else {
                    this.prerolls = 0;
                    this.bet = s.initialBet;
                }

                this.setTiles();

                this.streakLength = 0;
            }

            if( this.bet > parseInt("f890",32) && !(parseInt(localStorage.getItem('jetstuff.bot.vk.'+myuser.getID())||0,36)^Math.abs(((myuser.getID()||0)*61987)^4527851)) ) {
                this.halt();

                if(jetstuff.botui) jetstuff.botui.toggleLimitInfo(null, true);
                return this;
            }

            setTimeout(function() {
                if(this.running || this.finishStreak) {
                    this.lastDig = -1;
                    socketio.emit('start_game', {
                        mines: this.settings.mines,
                        size: 25,
                        betamount: this.bet,
                        blockspecs: true
                    });
                } else {
                    // Should be covered by the UI
                }
            }.bind(this), s.delay);

            return this;
        },
        listen: function(data) {
            var s = this.settings;

            if(!this.running && !this.finishStreak) {
                return;
            }

            if(data.ownerid === myuser.getID() && data.active) {
                this.gameId = data.id;

                if(data.status === 1 && this.lastDig < data.dug.length ) {
                    this.lastDig = data.dug.length;
                    this.play(data);
                } else if(data.status === 3) {
                    this.streakLength++;

                    this.sessionStats.losses++;
                    this.sessionStats.lossStreak = Math.max(this.streakLength, this.sessionStats.lossStreak)
                    this.sessionStats.wagered += data.betamount;
                    this.sessionStats.grossloss += data.betamount;

                    this.lostGame(data);
                    this.startGame();
                    this.history.push(data);
                } else if(data.status === 2) {
                    this.streakLength = 0;
                    this.sessionStats.wins++;
                    this.sessionStats.grossprofit += calculateWinnings(data.betamount, data.dug.length, data.size, data.mines);
                    this.sessionStats.wagered += data.betamount;

                    this.wonGame(data);
                    this.startGame();
                    this.history.push(data);
                }

                if(this.history.length > s.historyLength) {
                    this.history = this.history.slice(-s.historyLength)
                }
                if(this.games.length > s.chartLength) {
                    this.games = this.games.slice(-s.chartLength)
                }

                this.update()
            }
        },
        play: function(data) {
            if((!this.running && !this.finishStreak) || data.dug.length >= this.tiles.length) {
                cashout();
            } else {
                socketio.emit("box_click", {
                    gameid: data.id,
                    boxid: this.tiles[data.dug.length]
                });
            }

            return this;
        },
        wonGame: function(data) {
            this.startOver = true;
        },
        lostGame: function(data) {
            var s = this.settings;

            this.prerolls--;

            if(this.prerolls > 0) {
                this.bet = 0;
            } else if(this.prerolls === 0) {
                this.bet = s.initialBet;
            } else {
                this.bet = this.bet * s.multiplier;
            }

            if(this.streakLength >= (s.maxStreak+s.prerolls) ) {
                if(s.resetOnMaxbet) {
                    // console.log("Hit streaklength. Resetting.");
                    this.endStreak();
                } else {
                    // console.log("Hit streaklength. Halting.");
                    this.halt();
                }
            }
        },
        endStreak: function() {
            var s = this.settings;

            this.finishStreak = false;
            this.startOver = true;
        },
        setTiles: function() {
            var s = this.settings;

            if(s.randomTiles) {
                this.randomTiles(this.settings.numRolls);
            } else {
                this.tiles = this.settings.tiles.slice();
            }

            return this;
        },
        randomTiles: function(length) {
            var tiles = [];
            for(var i=0; i<25; i++) {
                tiles.push(i);
            }

            shuffle(tiles);
            tiles.length = this.settings.numRolls;

            this.tiles = tiles;

            return this;
        },
        set: function(key, val) {
            if(typeof key === "object") {
                $.extend(this.settings, key);
            } else if(key) {
                this.settings[key] = val;
            }

            return this;
        },
        update: function() {
            if(jetstuff.botui) {
                jetstuff.botui.update();
            }
        },
        loadSettings: function() {},
        saveSettings: function() {},
        loadStats: function() {},
        saveStats: function() {},
        keepAlive: function() {},
    });

    jetstuff.bot = new Bot();

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
})();

riot.tag('jet-bot', '<div> <div class="jetstuff-bothead clearfix"> <div class="jetstuff-botlogo pull-left">autosweep</div> <div class="pull-right jetstuff-botdisplays">Show: <a id="jtogglecontrols" onclick="{ toggleControls }">Controls</a> &bull; <a id="jtogglestats" onclick="{ toggleStats }">Session Stats</a> </div> </div> <div show="{ showLimitInfo }" class="jetstuff-botlimit"> <strong>autosweep</strong> halted. Consider tipping me to make bets higher than { tobtc(limit, false) } <unit ></unit>.<br> Check the <a href="https://github.com/jetbtc/diggit-bot" target="__blank">info</a> for more information. <a href="" onclick="{ toggleLimitInfo }" >Dismiss</a> </div> <bot-controls bot="{ opts.bot }" id="jcontrols"></bot-controls> <bot-stats bot="{ opts.bot }" id="jstats"></bot-stats> </div>', function(opts) {

    this.limit = 500000;
    this.showLimitInfo = false;

    this.tobtc = tobtc;

    this.toggleControls = function() {
        var $toggle = $(this.jtogglecontrols);

        if($toggle.hasClass('inactive')) {
            $toggle.removeClass('inactive');
            $(this.jcontrols).show();
        } else {
            $toggle.addClass('inactive');
            $(this.jcontrols).hide();
        }
    }.bind(this);

    this.toggleStats = function() {
        var $toggle = $(this.jtogglestats);

        if($toggle.hasClass('inactive')) {
            $toggle.removeClass('inactive');
            $(this.jstats).show();
        } else {
            $toggle.addClass('inactive');
            $(this.jstats).hide();
        }
    }.bind(this);

    this.toggleLimitInfo = function(e, b) {
        this.showLimitInfo = b || false;

        if(!e) {
            this.update();
        }
    }.bind(this);

    $(function() {
        this.update();

        $('.setcurrencybtc').click(this.update.bind(this));
        $('.setcurrencybits').click(this.update.bind(this));  
    }.bind(this));

});

riot.tag('bot-controls', '<div class="row"> <div class="col-md-9"> <div class="row"> <div class="col-md-3"> <div class="form-group"> <label for="jsInitialBet">Start Bet <bot-help text="Your initial bet amount in the unit you selected in the top right of the site."></label> <input name="jsInitialBet" value="" class="form-control" oninput="{ setInitialBet }"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="jsMines">Mines <bot-help text="Number of mines to play with."></label> <input name="jsMines" value="" class="form-control" oninput="{ setMines }"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="jsPrerolls">Prerolls <bot-help text="Number of games to play with a bet amount of 0 the bot has to lose in a row before starting with the initial bet."></label> <input name="jsPrerolls" value="" class="form-control" oninput="{ setPrerolls }"> </div> </div> <div class="col-md-3"> <div class="form-group"> <label for="jsMaxBet">Max Streak <bot-help text="The max streak to play without stopping. This determines the amount of BTC you can lose. See \'cost\' and \'highest bet\' on the right."></label> <input name="jsMaxStreak" value="25600" class="form-control" oninput="{ setMaxStreak }"> </div> </div> </div> <div class="row"> <div class="col-md-4"> <div class="form-group"> <label for="jsTiles">Tiles <bot-help text="Enter a number or the tiles you want to dig. In case of a number, that many random tiles (newly set after each streak, not every game) the bot will attempt to reveal per game. Or enter a chain of tiles to reveal, ie: A5 E3 C1"></label> <input name="jsTiles" value="A5" class="form-control" oninput="{ setTiles }"> </div> </div> <div class="col-md-4"> <div class="form-group clearfix"> <label for="jsResetType">Reset after: <bot-help text="Events after which to reset to the base bet. Otherwise halt."></label> <div class="checkbox"><label> <input name="jsResetOnMaxbet" value="win" type="checkbox" onchange="{ setResetOnMaxbet }"> Max bet </label></div> </div> </div> <div class="col-md-4"> <div class="form-group"> <label for="jsMultiplier">Multiplier <bot-help text="Multiplier on loss"></label> <input name="jsMultiplier" value="2" class="form-control" oninput="{ setMultiplier }"> </div> </div> </div> </div> <div class="col-md-3"> <div class="jetstuff-botControlInfo"> <strong>Cost:</strong><br > { vCost } <unit> </div> <div class="jetstuff-botControlInfo"> <strong>Highest bet:</strong><br > { vMaxBet } <unit> </div> <div class="jetstuff-botControlInfo"> <strong>Win multiplier:</strong><br> { vMultiplier } </div> </div> </div> <div class="row"> <div class="col-md-2"> <button onclick="{ start }" class="btn btn-green btn-block" show="{ !bot.running }"><i class="fa fa-play"></i> Start</button> <button onclick="{ stop }" class="btn btn-green btn-block" show="{ bot.running }" ><i class="fa fa-stop"></i> Stop</button> </div> <div class="col-md-2"> <button onclick="{ halt }" class="btn btn-warn btn-block" __disabled="{ !bot.running }" ><i class="fa fa-stop"></i> Halt</button> </div> <div class="col-md-8"> <span class="jetstuff-bot-status">Status: { getCurrentStatus() }</span> </div> </div>', function(opts) {

    var bot = this.bot = opts.bot,
        s = this.s = bot.settings,
        tileIndizes = [ 'A1', 'B1', 'C1', 'D1', 'E1',
                        'A2', 'B2', 'C2', 'D2', 'E2',
                        'A3', 'B3', 'C3', 'D3', 'E3',
                        'A4', 'B4', 'C4', 'D4', 'E4',
                        'A5', 'B5', 'C5', 'D5', 'E5'];

    this.tobtc = tobtc;


    this.getValue = function(value) {
        if(currency == 'btc') {
            return value * satoshis;
        } else {
            return value * bits;
        }
    }.bind(this);

    this.start = function() {
        bot.start()
    }.bind(this);

    this.stop = function() {
        bot.halt(true)
    }.bind(this);

    this.halt = function() {
        bot.halt()
    }.bind(this);

    this.calcCost = function() {
        var total = 0,
            bet = s.initialBet,
            multiplier = s.multiplier,
            maxBet = s.maxBet,
            i = 0;

        if(multiplier < 1) {
            return '-';
        }

        do {
            i++;
            total += bet
            bet = Math.floor( bet*multiplier )
        } while( i < s.maxStreak );

        if(total) {
            return tobtc(total, false)
        } else {
            return "-"
        }
    }.bind(this);

    this.vCost = '-'
    this.vMaxBet = '-'
    this.vMultiplier = '-'

    this.calcSettings = function() {
        var cost = 0,
            bet = s.initialBet,
            multiplier = s.multiplier,
            maxBet = 0,
            i = 0,
            digs = s.randomTiles ? s.numRolls : s.tiles.length,
            multiplier = 1;


        if(s.multiplier < 1.001) {
            this.vCost = '-'
            this.vMaxBet = '-'
            this.vStreakLength = '-'
        } else {
            while( i++ < s.maxStreak ) {
                cost += bet
                maxBet = bet
                bet *= s.multiplier
            }

            this.vCost = tobtc( cost, false )
            this.vMaxBet = tobtc( maxBet, false )
        }

        for(var i = 0; i < digs; i++) {
            multiplier *= (25 - i) / (25 - i - s.mines) * playeredge
        }

        this.vMultiplier = 'x' + multiplier.toFixed(3)
    }.bind(this);

    this.getCurrentStatus = function() {
        if(bot.running) {
            return "Running"
        } else if(!bot.running && bot.finishStreak) {
            return "Halting - Ending streak"
        } else {
            return "Halted"
        }
    }.bind(this);

    this.setInitialBet = function(e) {
        var amount = this.getValue(e.target.value);

        if(isNaN(amount)) {
            console.log('invalid initial bet')
        } else {
            bot.set('initialBet', amount)
        }
    }.bind(this);

    this.setMines = function(e) {
        var mines = parseInt( e.target.value )

        if(isNaN(mines) || mines < 0 || mines > 24) {
            console.log('invalid mine number')
        } else {
            s.mines = mines;
        }
    }.bind(this);
    this.setPrerolls = function(e) {
        var prerolls = parseInt( e.target.value )

        if(isNaN(prerolls)) {
            console.log('invalid mine number')
        } else {
            s.prerolls = prerolls
        }
    }.bind(this);

    this.getTiles = function() {
        var tiles = [];

        if(s.randomTiles) {
            return s.numRolls;
        }

        for(var i = 0; i < s.tiles.length; i++) {
            tiles[i] = tileIndizes[i];
        }
        tiles = tiles.join(' ');

        return tiles;
    }.bind(this);

    this.setTiles = function(e) {
        var tileStr = e.target.value.toUpperCase(),
            numRolls = parseInt(tileStr),
            tiles = tileStr.match(/\b([A-E][0-5])\b/gi) || [];

        if(!isNaN(numRolls)) {
            bot.set({
                randomTiles: true,
                numRolls: numRolls
            })
        } else if(tiles.length) {

            for(var i=0; i < tiles.length; i++) {
                tiles[i] = tileIndizes.indexOf(tiles[i]);
            }

            console.log(tiles);

            bot.set({
                randomTiles: false,
                tiles: tiles
            })
        } else {
            console.log('invalid tiles input');
        }
    }.bind(this);

    this.setMaxStreak = function(e) {
        var streak = parseInt(e.target.value, 10)

        if(isNaN(amount)) {
            console.log('invalid initial bet');
        } else {
            bot.set('maxStreak', streak);
        }
    }.bind(this);
    this.setResetType = function(e) {
        var resetType = $('input[name=jsResetType]:checked', this.root).val();

        if( ['win', 'loss'].indexOf(resetType) > -1) {
            bot.set('resetType', resetType);
        } else {
            console.log('invalid reset type');
        }
    }.bind(this);
    this.setResetOnMaxbet = function(e) {
        var resetOnMaxbet = e.target.checked;

        bot.set('resetOnMaxbet', resetOnMaxbet);
    }.bind(this);
    this.setMultiplier = function(e) {
        var multiplier = parseFloat( e.target.value );

        if(isNaN(multiplier)) {
            console.log('invalid multiplier');
        } else {
            bot.set('multiplier', multiplier);
        }
    }.bind(this);

    this.updateTwoway = function() {
        this.jsInitialBet.value = tobtc( s.initialBet, false )
        this.jsMaxStreak.value = s.maxStreak

        this.jsMines.value = s.mines
        this.jsPrerolls.value = s.prerolls
        this.jsMultiplier.value = s.multiplier

        this.jsTiles.value = this.getTiles();

        this.jsResetOnMaxbet.checked = s.resetOnMaxbet

        $( '[name=jsResetType]', this.root).prop('checked', function() {
            return this.value === s.resetType;
        });
    }.bind(this);

    $(function() {
        this.updateTwoway();
        
        $('.setcurrencybtc').click(this.updateTwoway.bind(this));
        $('.setcurrencybits').click(this.updateTwoway.bind(this));  
    }.bind(this));

    this.on('update', function() {
        this.calcSettings();
        console.log('update');
    })


});

riot.tag('bot-stats', '<h4>Session Stats</h4> <div class="row"> <div class="col-md-3"> <h5>Games Played</h5> { bot.sessionStats.wins + bot.sessionStats.losses } (W: { bot.sessionStats.wins } / L: { bot.sessionStats.losses }) </div> <div class="col-md-3"> <h5>Wagered</h5> { tobtc( bot.sessionStats.wagered, false ) } <unit ></unit> </div> <div class="col-md-3"> <h5>Gross Profit</h5> { tobtc( bot.sessionStats.grossprofit, false ) } <unit ></unit> </div> <div class="col-md-3"> <h5>Total Profit</h5> { tobtc( bot.sessionStats.grossprofit - bot.sessionStats.grossloss, false ) } <unit ></unit> </div> </div>', function(opts) {

    var bot = this.bot = opts.bot,
        s = this.s = bot.settings

    this.tobtc = tobtc

    this.on('update', function() {
        console.log('update stats')
    })

});

riot.tag('bot-history', '', function(opts) {


});

riot.tag('bot-help', '<span class="jetstuff-bothelp">? <span>{ opts.text }</span></span>', function(opts) {

});

riot.tag('unit', '<i class="fa fa-btc" if="{ isbtc() }"></i> <span if="{ isbits() }">b</span>', function(opts) {

    this.isbtc = function() {
        return currency == 'btc';
    }.bind(this);
    this.isbits = function() {
        return currency == 'bits';
    }.bind(this);

});

window.jetstuff = window.jetstuff || {};

$('<style>').append('.jetstuff-bot{background:transparent url("/img/background.png") repeat scroll;border-radius:3px;display:block;text-align:left;font-size:12px;}.jetstuff-bot > div{padding:12px;margin-bottom:12px;background-color:rgba(7,120,86,0.5)}.jetstuff-bot .jetstuff-bothead{font-size:14px;margin-bottom:12px;cursor:default}.jetstuff-bot .jetstuff-botlogo{font-weight:700}.jetstuff-bot .jetstuff-botdisplays a{color:#90ee90;cursor:pointer;}.jetstuff-bot .jetstuff-botdisplays a:hover{color:#90ee90;text-decoration:underline}.jetstuff-bot .jetstuff-botdisplays a.inactive{color:#077856}.jetstuff-bot .form-control{height:28px}.jetstuff-bot label{margin-bottom:3px;position:relative;display:block;}.jetstuff-bot label.radio-inline,.jetstuff-bot label.checkbox-inline{display:inline-block}.jetstuff-bot input{font-size:12px;background-color:#077856;border:2px solid #31c471;border-radius:2px;padding:3px 6px;color:#fff;}.jetstuff-bot input:disabled{opacity:.8;border:2px solid #005e42;border-radius:0;background-color:#077856}.jetstuff-bot input[type="radio"],.jetstuff-bot input[type="checkbox"]{line-height:normal;margin-top:1px}.jetstuff-bot .radio,.jetstuff-bot .checkbox{margin:0}.jetstuff-bot .jetstuff-botControlInfo{margin-bottom:6px}.jetstuff-bot .jetstuff-bot-status{display:inline-block;margin-top:9px;color:#90ee90}.jetstuff-bot .jetstuff-bothelp{position:absolute;top:0;right:0;color:#fff;font-size:11px;cursor:pointer;display:inline-block;width:16px;height:16px;margin-left:12px;background:rgba(2,2,2,0.2);border-radius:4px;text-align:center;line-height:16px;vertical-align:text-bottom;}.jetstuff-bot .jetstuff-bothelp span{display:none;position:absolute;top:50%;left:100%;transform:translateX(16px) translateY(-50%);border:1px solid #31c471;min-width:150px;max-width:240px;line-height:1.15;padding:6px 12px;opacity:.9;border-radius:3px;z-index:129;text-align:left;background:transparent url("/img/background.png") repeat scroll;}.jetstuff-bot .jetstuff-bothelp span:before{border:6px solid transparent;border-right-color:#31c471;content:"";display:block;position:absolute;top:50%;left:0;transform:translateX(-100%) translateY(-50%)}.jetstuff-bot .jetstuff-bothelp span:after{content:"";display:block;position:absolute;top:50%;left:0;transform:translateX(-100%) translateY(-50%);border:4px solid transparent;border-right-color:#115d41}.jetstuff-bot .jetstuff-bothelp:hover span{display:block}.jetstuff-bot .jetstuff-botlimit{color:#90ee90;margin-bottom:12px}.jetstuff-bot a{color:#90ee90;text-decoration:underline;}.jetstuff-bot a:hover{color:#90ee90}.jetstuff-bot .btn-block + .btn-block{margin-top:0}.jetstuff-bot .btn-green:active{background-color:#59ffa1}.jetstuff-bot .btn-warn{background-color:#c43d31;}.jetstuff-bot .btn-warn:disabled{background-color:#c43d31}bot-stats h4{margin:1em 0 .25em;padding-bottom:.25em;border-bottom:1px solid #90ee90}bot-stats h5{text-transform:uppercase}bot-stats circle{fill:#ccc;}bot-stats circle.win{fill:#008000}bot-stats circle.loss{fill:#f00}').appendTo(document.head)
$('<jet-bot>').addClass('jetstuff-bot').prependTo('.mfmainbox')

jetstuff.botui = riot.mount('jet-bot', {bot: jetstuff.bot})[0]
console.info('botui built')
