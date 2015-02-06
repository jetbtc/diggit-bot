<jet-bot>
    <div>
        <div class="jetstuff-bothead clearfix">
            <div class="jetstuff-botlogo pull-left">autosweep</div>

            <div class="pull-right jetstuff-botdisplays">Show: <a>Settings</a> &bull; <a class="inactive">Stats + Chart</a> &bull; <a class="inactive">Controls</a></div>
        </div>

        <div class="row">
            <div class="col-md-9">
                <div class="row">
                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="jsInitialBet">Start Bet <bot-help text="Your initial bet amount in satoshi."></label>
                            <input name="jsInitialBet" value="100" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="jsMines">Mines</label>
                            <input name="jsMines" value="13" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="jsPrerolls">Prerolls <bot-help text="Number of 0 bets the bot will have to lose in a row before starting with the initial bet."></label>
                            <input name="jsPrerolls" value="0" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="form-group">
                            <label for="jsMaxBet">Max Bet <bot-help text="The highest possible bet the bot will make. This is your most important loss control. Use it wisely."></label>
                            <input name="jsMaxBet" value="25600" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="jsTiles">Tiles <bot-help text="Enter a number or the tiles you want to dig. In case of a number, that many random tiles (newly set after each streak, not every game) the bot will attempt to reveal per game. Or enter a chain of tiles to reveal, ie: A5 E3 C1"></label>
                            <input name="jsTiles" value="A5" class="form-control">
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="form-group clearfix">
                            <label for="jsResetType">Reset after: <bot-help text="Initial bet in satoshi."></label>
                            <div>
                                <label class="radio-inline"> <input name="jsResetType" value="win" type="radio"> Win </label>
                                <label class="radio-inline"> <input name="jsResetType" value="loss" type="radio"> Loss </label>
                            </div>
                            <div class="checkbox"><label> <input name="jsResetOnMaxbet" value="win" type="checkbox"> Max bet </label></div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="jsMultiplier">Multiplier <bot-help text="Initial bet in satoshi."></label>
                            <input name="jsMultiplier" value="2" class="form-control">
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
    </div>

    var bot = jetstuff.bot,
        s = bot.settings

    setInitialBet = function(e) {
        console.log("change", e);
    }

</jet-bot>

<bot-chart>
    <span>Chart goes here</span>
</bot-chart>

<bot-info>

</bot-info>

<bot-help>
    <span class="jetstuff-bothelp">? <span>{ opts.text }</span></span>
</bot-help>

$('<style>').append('{{styles}}').appendTo(document.head)
$('<jet-bot>').addClass('jetstuff-bot').prependTo('.mfmainbox')
riot.mount('jet-bot', {name: 'Jet'})
