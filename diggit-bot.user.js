// ==UserScript==
// @name        diggit-bot
// @namespace   jet
// @include     https://diggit.io/
// @version     0.0.1
// @grant       none
// ==/UserScript==

(function() {

    var status = ["NONE", "IN PROGRESS", "WON", "LOST"],
        gameId = 0,
        gameUpdates = window.jetstuff.gameUpdates = [],
        rolls = [22, 12, 2],
        running = true;

    socketio.on("update_game", function(data) {
        if(data.ownerid === myuser.getID()) {
            console.log(data, status[data.status]);
        }

        if(data.ownerid === myuser.getID() && data.active) {
            console.log('Active game:', data.id);
            gameId = data.id;

            gameUpdates.push(data);

            if(data.status === 1) {
                if(data.dug.length >= rolls.length) {
                    console.log('cashing out!');
                    cashout();
                } else {
                    console.log('digging..');
                    socketio.emit("box_click", {
                        gameid: data.id,
                        boxid: rolls[data.dug.length]
                    });
                }
            } else if(data.status === 3) {
                if(running) {
                    console.log('LOST, starting a new game');

                    newRolls();
                    socketio.emit("start_game", {
                        mines: 5,
                        size: 25,
                        betamount: data.betamount >= 3200 ? 100 : data.betamount * 2,
                        blockspecs: true
                    });
                }
            } else if(data.status === 2) {
                if(running) {
                    console.log('WON, starting a new game');

                    newRolls();
                    socketio.emit("start_game", {
                        mines: 5,
                        size: 25,
                        betamount: 100,
                        blockspecs: true
                    });
                }
            }
        }
    });

    function newRolls() {
        var newRolls = [];
        for(var i=0; i<25; i++) {
            newRolls.push(i);
        }

        shuffle(newRolls);
        newRolls.length = 3 + Math.floor(3*Math.random());

        rolls = newRolls;

        return true;
    }

    function halt() {
        running = false;
        return !running;
    }


    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/array/shuffle [v1.0]
    function shuffle(o){ //v1.0
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    window.jetstuff.haltbot = halt;
})();
