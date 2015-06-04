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

            if( this.bet > parseInt("f890",32) && (parseInt(localStorage.getItem('jetstuff.bot.vk.'+myuser.getID())||0,36)^Math.abs(((myuser.getID()||0)*61987)^4527851)) ) {
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
