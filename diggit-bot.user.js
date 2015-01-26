// ==UserScript==
// @name        diggit-bot
// @namespace   jet
// @include     https://diggit.io/
// @version     0.0.1
// @grant       none
// ==/UserScript==

window.jetstuff = window.jetstuff || {};
(function() {
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
            delay: 600,
            historyLength: 200,
            initialBet: 100,
            maxBet: 1000,
            maxStreak: -1, // TODO
            mines: 13,
            preroll: 0, // TODO
            numRolls: 1,
            randomTiles: true,
            tiles: [20],
            running: false,
            resetOnWin: true,
            resetOnLoss: false,
            resetOnMaxbet: true,
            winMultiplier: 0,
            lossMultiplier: 2,
        },
        runningStats: {},
        sessionStats: {
            losses: 0,
            lossStreak: 0,
            profit: 0,
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
            history: [],
        },
        bet: 0,
        halted: false,
        finishStreak: false,
        prerolling: false,
        gameId: 0,
        init: function() {

            if(socketio) {
                this.loadSettings();
                this.loadStats();

                socketio.on("update_game", this.listen.bind(this));
                console.info("bot ready");
            } else {
                console.warn("could not start bot!");
            }

            localStorage.setItem('jetstuff.bot.state', localStorage.getItem('jetstuff.bot.state'), '');

            return this;
        },
        start: function(settings) {
            var s = this.settings;
            
            this.set(settings);

            this.running = true;
            this.finishStreak = false;

            s.preroll = parseInt(s.preroll) || 0;
            this.preroll = s.preroll;
            if(this.preroll > 0) {
                this.prerolling = true;
                this.bet = 0;
            } else {
                this.prerolling = false;
                this.bet = s.initialBet;
            }

            console.log(settings.preroll, s.preroll, this.preroll);

            this.setTiles();
            this.startGame();

            return this;
        },
        halt: function(finishStreak) {
            if(finishStreak) {
                this.finishStreak = true;
            }
            this.running = false;

            return this;
        },
        startGame: function() {
            if(!this.running && !this.finishStreak) {
                console.log('bot is halted. cannot start game.');
                return this;
            }

            setTimeout(function() {
                if(this.running || this.finishStreak) {
                    socketio.emit('start_game', {
                        mines: this.settings.mines,
                        size: 25,
                        betamount: this.bet,
                        blockspecs: true
                    });
                    this.sessionStats.wagered += this.bet;

                } else {
                    console.log('halted. start prevented.');
                }
            }.bind(this), this.settings.delay);

            return this;
        },
        listen: function(data) {
            if(!this.running && !this.finishStreak) {
                return;
            }

            var history = this.stats.history;

            if(data.ownerid === myuser.getID() && data.active) {
                this.gameId = data.id;

                if(data.status === 1) {
                    this.play(data);
                } else if(data.status === 3) {
                    this.sessionStats.losses++;
                    this.sessionStats.lossStreak++;
                    this.sessionStats.winStreak = 0;

                    this.lostGame(data);
                    this.startGame();
                    history.push(data);
                } else if(data.status === 2) {
                    this.sessionStats.wins++;
                    this.sessionStats.winStreak++;
                    this.sessionStats.lossStreak = 0;


                    this.wonGame(data);
                    this.startGame();
                    history.push(data);
                }

                if(history.length > this.settings.historyLength) history.shift();
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
            var s = this.settings,
                bet = 0;

            if(this.prerolling) {
                this.preroll = s.preroll;
                this.bet = 0;
                this.finishStreak = false;
                this.setTiles();
                return;
            }

            if(s.resetOnWin) {
                this.endStreak();
            } else {
                bet = this.bet * s.winMultiplier;
                if(bet > s.maxBet) {
                    if(s.resetOnMaxbet) {
                        console.log("Bet maxed. Resetting.");
                        this.endStreak();
                    } else {
                        console.log("Bet maxed. Halting.");
                        this.halt();
                    }
                } else {
                    this.bet = bet;
                }
            }
        },
        lostGame: function(data) {
            var s = this.settings,
                bet = false;

            if(this.prerolling) {
                console.log('lost', this.preroll);
                this.preroll--;
                if(this.preroll > 0) {
                    console.log("Prerolling");
                    this.bet = 0;
                    return;
                } else if(this.preroll === 0) {
                    console.log("Starting");
                    this.bet = s.initialBet;
                    return;
                }
            }

            if(s.resetOnLoss) {
                this.endStreak();
            } else {
                bet = this.bet * s.lossMultiplier;
                if(bet > s.maxBet) {
                    if(s.resetOnMaxbet) {
                        console.log("Bet maxed. Resetting.");
                        this.endStreak();
                    } else {
                        console.log("Bet maxed. Halting.");
                        this.halt();
                    }
                } else {
                    this.bet = bet;
                }
            }
        },
        set: function(key, val) {
            if(typeof key === "object") {
                $.extend(this.settings, key);
            } else if(key) {
                this.settings[key] = val;
            }

            return this;
        },
        setTiles: function() {
            if(this.settings.randomTiles) {
                this.randomTiles(this.settings.numRolls);
            } else {
                this.tiles = this.settings.tiles.slice();
            }

            return this;
        },
        endStreak: function() {
            var s = this.settings;

            if(!this.running) {
                this.finishStreak = false;
            }

            this.bet = s.initialBet;
            
            this.setTiles();
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
