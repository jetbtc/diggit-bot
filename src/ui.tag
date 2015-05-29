<jet-bot>
    <div>
        <div class="jetstuff-bothead clearfix">
            <div class="jetstuff-botlogo pull-left">autosweep</div>

            <div class="pull-right jetstuff-botdisplays">Show: <a>Settings</a> &bull; <a class="inactive">Stats + Chart</a> &bull; <a class="inactive">Controls</a></div>
        </div>

        <div show={ showLimitInfo } class="jetstuff-botlimit">
            <span><strong>autosweep</strong> halted. Buy this script to make bets higher than { this.limit }. Check the info for more information. <a href="" onclick={ toggleLimitInfo } >Dismiss</a>
        </div>

        <bot-controls bot={ opts.bot } id="jcontrols"></bot-controls>
        <bot-stats bot={ opts.bot } id="jstats"></bot-stats>
    </div>

    this.limit = 500000;
    this.showLimitInfo = false;

    toggleLimitInfo(e, b) {
        this.showLimitInfo = b || false;

        if(!e) {
            this.update();
        }
    }
</jet-bot>

<bot-controls>
    <div class="row">
        <div class="col-md-9">
            <div class="row">
                <div class="col-md-3">
                    <div class="form-group">
                        <label for="jsInitialBet">Start Bet <bot-help text="Your initial bet amount in satoshi."></label>
                        <input name="jsInitialBet" value="" class="form-control" oninput={ setInitialBet }>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="form-group">
                        <label for="jsMines">Mines</label>
                        <input name="jsMines" value="" class="form-control" oninput={ setMines }>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="form-group">
                        <label for="jsPrerolls">Prerolls <bot-help text="Number of 0 bets the bot will have to lose in a row before starting with the initial bet."></label>
                        <input name="jsPrerolls" value="" class="form-control" oninput={ setPrerolls }>
                    </div>
                </div>

                <div class="col-md-3">
                    <div class="form-group">
                        <label for="jsMaxBet">Max Streak <bot-help text=""></label>
                        <input name="jsMaxStreak" value="25600" class="form-control" oninput={ setMaxStreak }>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="jsTiles">Tiles <bot-help text="Enter a number or the tiles you want to dig. In case of a number, that many random tiles (newly set after each streak, not every game) the bot will attempt to reveal per game. Or enter a chain of tiles to reveal, ie: A5 E3 C1"></label>
                        <input name="jsTiles" value="A5" class="form-control" oninput={ setTiles }>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="form-group clearfix">
                        <label for="jsResetType">Reset after: <bot-help text="Initial bet in satoshi."></label>

                        <div class="checkbox"><label> <input name="jsResetOnMaxbet" value="win" type="checkbox" onchange={ setResetOnMaxbet }> Max bet </label></div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="form-group">
                        <label for="jsMultiplier">Multiplier <bot-help text="Initial bet in satoshi."></label>
                        <input name="jsMultiplier" value="2" class="form-control" oninput={ setMultiplier }>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="jetstuff-botControlInfo">
                <strong>Cost:</strong><br>
                { vCost }
            </div>
            <div class="jetstuff-botControlInfo">
                <strong>Highest bet:</strong><br>
                { vMaxBet }
            </div>
            <div class="jetstuff-botControlInfo">
                <strong>Win multiplier:</strong><br>
                { vMultiplier }
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <button onclick={ start } class="btn btn-green btn-block" show={ !bot.running }><i class="fa fa-play"></i> Start</button>
            <button onclick={ stop } class="btn btn-green btn-block" show={ bot.running } ><i class="fa fa-stop"></i> Stop</button>
        </div>
        <div class="col-md-2">
            <button onclick={ halt } class="btn btn-warn btn-block" disabled={ !bot.running } ><i class="fa fa-stop"></i> Halt</button>
        </div>
        <div class="col-md-8">
            <span class="jetstuff-bot-status">Status: { getCurrentStatus() }</span>
        </div>
    </div>

    var bot = this.bot = opts.bot,
        s = this.s = bot.settings,
        tileIndizes = [ 'A1', 'B1', 'C1', 'D1', 'E1',
                        'A2', 'B2', 'C2', 'D2', 'E2',
                        'A3', 'B3', 'C3', 'D3', 'E3',
                        'A4', 'B4', 'C4', 'D4', 'E4',
                        'A5', 'B5', 'C5', 'D5', 'E5'];

    this.tobtc = tobtc;

    // this.parent.on('update', this.update.bind(this))

    getValue(value) {
        if(currency == 'btc') {
            return value * satoshis;
        } else {
            return value * bits;
        }
    }

    start() {
        bot.start()
    }

    stop() {
        bot.halt(true)
    }

    halt() {
        bot.halt()
    }

    calcCost() {
        var total = 0,
            bet = s.initialBet,
            multiplier = s.multiplier,
            maxBet = s.maxBet,
            i = 0;

        if(multiplier < 1.001) {
            return '-';
        }

        do {
            i++;
            total += bet
            bet = Math.floor( bet*multiplier )
        } while( i < s.maxStreak );

        if(total) {
            return tobtc(total)
        } else {
            return "-"
        }
    }

    this.vCost = '-'
    this.vMaxBet = '-'
    this.vMultiplier = '-'

    calcSettings() {
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

            this.vCost = tobtc( cost )
            this.vMaxBet = tobtc( maxBet )
        }

        for(var i = 0; i < digs; i++) {
            multiplier *= (25 - i) / (25 - i - s.mines) * playeredge
        }

        this.vMultiplier = 'x' + multiplier.toFixed(3)
    }

    getCurrentStatus() {
        if(bot.running) {
            return "Running"
        } else if(!bot.running && bot.finishStreak) {
            return "Halting - Ending streak"
        } else {
            return "Halted"
        }
    }

    setInitialBet(e) {
        var amount = this.getValue(e.target.value);

        if(isNaN(amount)) {
            console.log('invalid initial bet')
        } else {
            bot.set('initialBet', amount)
        }
    }

    setMines(e) {
        var mines = parseInt( e.target.value )

        if(isNaN(mines) || mines < 0 || mines > 24) {
            console.log('invalid mine number')
        } else {
            s.mines = mines;
        }
    }
    setPrerolls(e) {
        var prerolls = parseInt( e.target.value )

        if(isNaN(prerolls)) {
            console.log('invalid mine number')
        } else {
            s.prerolls = prerolls
        }
    }

    getTiles() {
        var tiles = [];

        if(s.randomTiles) {
            return s.numRolls;
        }

        for(var i = 0; i < s.tiles.length; i++) {
            tiles[i] = tileIndizes[i];
        }
        tiles = tiles.join(' ');

        return tiles;
    }

    setTiles(e) {
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
    }

    setMaxStreak(e) {
        var streak = parseInt(e.target.value, 10)

        if(isNaN(amount)) {
            console.log('invalid initial bet');
        } else {
            bot.set('maxStreak', streak);
        }
    }
    setResetType(e) {
        var resetType = $('input[name=jsResetType]:checked', this.root).val();

        if( ['win', 'loss'].indexOf(resetType) > -1) {
            bot.set('resetType', resetType);
        } else {
            console.log('invalid reset type');
        }
    }
    setResetOnMaxbet(e) {
        var resetOnMaxbet = e.target.checked;

        bot.set('resetOnMaxbet', resetOnMaxbet);
    }
    setMultiplier(e) {
        var multiplier = parseFloat( e.target.value );

        if(isNaN(multiplier)) {
            console.log('invalid multiplier');
        } else {
            bot.set('multiplier', multiplier);
        }
    }

    updateTwoway() {
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

        this.limit = tobtc( 500000 )
    }

    $(function() {
        this.updateTwoway();
    }.bind(this));
    
    $('.setcurrencybtc').click(function() {
        this.updateTwoway();
    }.bind(this));
    $('.setcurrencybits').click(function() {
        this.updateTwoway();
    }.bind(this));

    this.on('update', function() {
        this.calcSettings();
        console.log('update');
    })

</bot-controls>

<bot-stats>
    <h4>Session Stats</h4>
    <div class="row">
        <div class="col-md-3">
            <h5>Games Played</h5>
            { bot.sessionStats.wins + bot.sessionStats.losses }
            (W: { bot.sessionStats.wins } / L: { bot.sessionStats.losses })
        </div>
        <div class="col-md-3">
            <h5>Wagered</h5>
            { tobtc( bot.sessionStats.wagered ) }
        </div>
        <div class="col-md-3">
            <h5>Gross Profit</h5>
            { tobtc( bot.sessionStats.grossprofit ) }
        </div>
        <div class="col-md-3">
            <h5>Total Profit</h5>
            { tobtc( bot.sessionStats.grossprofit - bot.sessionStats.grossloss ) }
        </div>
    </div>

    var bot = this.bot = opts.bot,
        s = this.s = bot.settings

    this.tobtc = tobtc

    this.on('update', function() {
        console.log('update stats')
    })
</bot-stats>

<bot-history>

</bot-history>

<bot-help>
    <span class="jetstuff-bothelp">? <span>{ opts.text }</span></span>
</bot-help>

window.jetstuff = window.jetstuff || {};

$('<style>').append('{{styles}}').appendTo(document.head)
$('<jet-bot>').addClass('jetstuff-bot').prependTo('.mfmainbox')

jetstuff.botui = riot.mount('jet-bot', {bot: jetstuff.bot})[0]
console.info('botui built')
