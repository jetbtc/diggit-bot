<jet-bot>
    <div>
        <div class="jetstuff-bothead clearfix">
            <div class="jetstuff-botlogo pull-left">autosweep</div>

            <div class="pull-right jetstuff-botdisplays">Show: <a>Settings</a> &bull; <a class="inactive">Stats + Chart</a> &bull; <a class="inactive">Controls</a></div>
        </div>

        <bot-controls bot={ opts.bot }></bot-controls>
    </div>
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
                        <label for="jsMaxBet">Max Bet <bot-help text="The highest possible bet the bot will make. This is your most important loss control. Use it wisely."></label>
                        <input name="jsMaxBet" value="25600" class="form-control" oninput={ setMaxbet }>
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
                        <div>
                            <label class="radio-inline"> <input name="jsResetType" value="win" type="radio" onchange={ setResetType }> Win </label>
                            <label class="radio-inline"> <input name="jsResetType" value="loss" type="radio" onchange={ setResetType }> Loss </label>
                        </div>
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
                <strong>Loss potential:</strong><br>
                12800000
            </div>
            <div class="jetstuff-botControlInfo">
                <strong>Max streak length:</strong><br>
                14<br>
            </div>
            <div class="jetstuff-botControlInfo">
                <strong>Win multiplier:</strong><br>
                x2.13
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <button class="btn btn-green btn-block"><i class="fa fa-stop"></i> Stop</button>
        </div>
        <div class="col-md-2">
            <button class="btn btn-green btn-block"><i class="fa fa-pause"></i> Pause</button>
        </div>
        <div class="col-md-8">
            <span class="jetstuff-bot-status">Current Bot Status</span>
        </div>
    </div>

    var bot = this.bot = opts.bot,
        s = this.s = bot.settings

    this.tobtc = tobtc;

    getValue(value) {
        if(currency == 'btc') {
            return value * satoshis;
        } else {
            return value * bits;
        }
    }

    setInitialBet(e) {
        var amount = this.getValue(e.target.value);

        if(isNaN(amount)) {
            console.log('invalid initial bet');
        } else {
            bot.set('initialBet', amount);
        }
    }

    setMines(e) {
        var mines = parseInt( e.target.value );

        if(isNaN(mines) || mines < 0 || mines > 24) {
            console.log('invalid mine number');
        } else {
            s.mines = mines;
        }
    }
    setPrerolls(e) {
        var prerolls = parseInt( e.target.value );

        if(isNaN(prerolls)) {
            console.log('invalid mine number');
        } else {
            s.prerolls = prerolls;
        }
    }

    getTiles() {
        var tiles = [],
            tileIndizes = [ 'A1', 'B1', 'C1', 'D1', 'E1',
                            'A2', 'B2', 'C2', 'D2', 'E2',
                            'A3', 'B3', 'C3', 'D3', 'E3',
                            'A4', 'B4', 'C4', 'D4', 'E4',
                            'A5', 'B5', 'C5', 'D5', 'E5'];

        if(s.tiles instanceof Array) {
            for(var i = 0; i < s.tiles.length; i++) {
                tiles[i] = tileIndizes[i];
            }
            tiles = tiles.join(' ');
        } else {
            tiles = parseInt(s.tiles, 10);
        }

        return tiles;
    }

    setTiles(e) {
        var tileStr = e.target.value.toUpperCase(),
            numRolls = parseInt(tileStr),
            tiles = tileStr.match(/\b([A-E][0-5])\b/gi) || []
            tileIndizes = [ 'A1', 'B1', 'C1', 'D1', 'E1',
                            'A2', 'B2', 'C2', 'D2', 'E2',
                            'A3', 'B3', 'C3', 'D3', 'E3',
                            'A4', 'B4', 'C4', 'D4', 'E4',
                            'A5', 'B5', 'C5', 'D5', 'E5'];

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

    setMaxbet(e) {
        var amount = this.getValue(e.target.value);

        if(isNaN(amount)) {
            console.log('invalid initial bet');
        } else {
            bot.set('maxBet', amount);
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

    update_twoway() {
        this.jsInitialBet.value = tobtc( s.initialBet, false )
        this.jsMaxBet.value = tobtc( s.maxBet, false )

        this.jsMines.value = s.mines
        this.jsPrerolls.value = s.prerolls
        this.jsMultiplier.value = s.multiplier

        this.jsTiles = this.getTiles();

        this.jsResetOnMaxbet.checked = s.resetOnMaxbet

        $( '[name=jsResetType]', this.root).prop('checked', function() {
            return this.value === s.resetType;
        });
    }

    $(function() {
        this.update_twoway();
    }.bind(this));
    
    $('.setcurrencybtc').click(function() {
        this.update_twoway();
    }.bind(this));
    $('.setcurrencybits').click(function() {
        this.update_twoway();
    }.bind(this));

    this.on('update', function() {
        console.log('update');
    })

</bot-controls>


<bot-stats>
    <span>Chart goes here</span>
</bot-stats>

<bot-history>

</bot-history>

<bot-help>
    <span class="jetstuff-bothelp">? <span>{ opts.text }</span></span>
</bot-help>

window.jetstuff = window.jetstuff || {};

$('<style>').append('{{styles}}').appendTo(document.head)
$('<jet-bot>').addClass('jetstuff-bot').prependTo('.mfmainbox')
jetstuff.botui = riot.mount('jet-bot', {bot: jetstuff.bot})
console.info('botui built')
