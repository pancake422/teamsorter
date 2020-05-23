var input;
var playerlist = [];
var teams = [];
var _button;
var _input;
var _output;
var _plus;
var _minus;
var _display;

var nameSeparator = ":";

var team_size = 2;

var distribution_dir = "backwards";
var distribution_type = "high";

window.onload=function() {
    _button = document.getElementById("button");
    _input = document.getElementById("input");
    _output = document.getElementById("output");
    _plus = document.getElementById("plus");
    _minus = document.getElementById("minus");
    _display = document.getElementById("display");
    _button.onclick = function() {buttonPress()};
    _plus.onclick = function() {plusPress()};
    _minus.onclick = function() {minusPress()};
}

function buttonPress() {
    input = _input.value;
    var curr = "";
    playerlist = [];
    teams = [];
    //parse individual lines
    for(var i = 0; i < input.length; i++) {
        if(input.charCodeAt(i) != 10) {
            curr = curr + input.charAt(i);
        } else {
            playerlist.push(curr);
            curr = "";
        }
    }
    if(curr != "") {
        playerlist.push(curr);
    }
    //parse each line in to player names and mmr values
    for(var i = 0; i < playerlist.length; i++) {
        var curr = playerlist[i];
        var name = "";
        var mmr = "";
        var nameDone = false;
        for(var j = 0; j < curr.length; j++) {
            if(curr.charAt(j) == nameSeparator) {
                j++;
                nameDone = true;
            }
            if(nameDone) {
                mmr = mmr + curr.charAt(j);
            } else {
                name = name+ curr.charAt(j);
            }
        }
        playerlist[i] = {name: name, mmr: parseFloat(mmr)}
    }
    //remove whitespaces before and after names because I'm anal
    for(var i = 0; i < playerlist.length; i++) {
        var name = playerlist[i].name;
        while(name.charAt(0) == " ") {
            name = name.substr(1, name.length - 1);
        }
        while(name.charAt(name.length - 1) == " ") {
            name = name.substr(0, name.length - 1);
        }
        playerlist[i].name = name;
    }
    //generate appropriate number of empty teams
    var num_teams = Math.floor(playerlist.length / team_size);
    for(var i = 0; i < num_teams; i++) {
        teams.push([]);
    }
    //"bench" random players if numbers dont work out(for fairness)
    for(var i = 0; i < playerlist.length - num_teams * team_size; i++) {
        playerlist.splice(Math.floor(Math.random() * playerlist.length), 1);
    }
    //distribute players on to teams
    for(var i = 0; i < team_size; i++) {
        //controls "salt shaker" effect of distributing players.
        if(i/2 == Math.floor(i/2)) {
            //flip distribution_dir
            if(distribution_dir == "forward") {
                distribution_dir = "backwards";
            } else {
                distribution_dir = "forward";
            }
        }
        if((i-1) / 2 == Math.floor((i-1) / 2)) {
            //flip distribution_type
            if(distribution_type == "high") {
                distribution_type = "low";
            } else {
                distribution_type = "high";
            }
        }
        //put one player on to each team based on rules set above.
        if(distribution_dir == "forward") {
            for(var j = 0; j < teams.length; j++) {
                if(distribution_type == "high") {
                    teams[j].push(grabHighestMMR());
                } else {
                    teams[j].push(grabLowestMMR());
                }
            }
        } else {
            for(var j = teams.length - 1; j >= 0; j--) {
                if(distribution_type == "high") {
                    teams[j].push(grabHighestMMR());
                } else {
                    teams[j].push(grabLowestMMR());
                }
            }
        }
    }
    //output teams
    var output = "";
    for(var i = 0; i < num_teams; i++) {
        for(var j = 2; j < _output.cols; j++) {
            output = output + "-";
        }
        output = output + String.fromCharCode(10)
        output = output + "Team " + (i + 1) + ":" + String.fromCharCode(10);
        for(var j = 2; j < _output.cols; j++) {
            output = output + "-";
        }
        output = output + String.fromCharCode(10)
        for(var j = 0; j < team_size; j++) {
            output = output + "  " + teams[i][j].name + String.fromCharCode(10);
        }
    }
    
    //push output
    _output.value = output;
}

function grabLowestMMR() {
    var lowest = Infinity;
    var lowestID = 0;
    for(var i = 0; i < playerlist.length; i++) {
        if(playerlist[i].mmr < lowest) {
            lowest = playerlist[i].mmr;
            lowestID = i;
        }
    }
    return playerlist.splice(lowestID,1)[0];
}
function grabHighestMMR() {
    var highest = -Infinity;
    var highestID = 0;
    for(var i = 0; i < playerlist.length; i++) {
        if(playerlist[i].mmr > highest) {
            highest = playerlist[i].mmr;
            highestID = i;
        }
    }
    return playerlist.splice(highestID,1)[0];
}
function plusPress() {
    team_size++;
    _display.textContent = team_size;
    
}
function minusPress() {
    team_size--;
    if(team_size < 1) {
        team_size = 1;
    }
    _display.textContent = team_size;
    
}