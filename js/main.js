

// ? function reward(s){
// ?     return (s === 1)? 1 : 0;
// ? }


var total_episodes = 0;
var can = document.getElementById('canvas');
var ctx = can.getContext('2d');


function drawStates(c, N, currentState, goalState){
    var w = c.canvas.width;
    var h = c.canvas.height;
    var stateSize = w/N;
    var stateDist = w/N * 0.5;
    stateSize = stateSize - (stateSize - stateDist);


    for(var i = 1; i <= N; i++){
        c.strokeStyle = 'transparent';
        c.fillStyle = 'transparent';
        c.lineWidth = 1;
        if(i === currentState){
            if(learner.greedyActionTaken){
                c.fillStyle = 'yellow';
            } else {
                c.fillStyle = 'green';
            }
            if(currentState === goalState){
                //c.fillStyle = 'red';
                c.strokeStyle = 'red';
                c.lineWidth = 5;
            }
        } else if(i === goalState) {
            c.strokeStyle = 'red';
        } else {
            c.strokeStyle = 'black';
        }

        var x = stateDist/2 + (i-1)*stateSize + (i-1)*stateDist;
        var y = h/2 - stateSize/2;

        c.fillRect(x, y, stateSize, stateSize);
        c.strokeRect(x, y, stateSize, stateSize);

        if(i === currentState){
            c.fillStyle = 'gray';
            y = y+stateSize/4;
            var arrWidth = stateSize/2;
            var arrX;
            if(learner.state > learner.prevState){
                arrX = x-stateSize+stateDist/3+3*arrWidth/4;
                c.beginPath();
                c.moveTo(arrX, y);

                c.lineTo(arrX+arrWidth/2, y+arrWidth/2);
                c.lineTo(arrX, y+arrWidth);

                c.lineTo(arrX, y+3*arrWidth/4);
                c.lineTo(arrX-arrWidth, y+3*arrWidth/4);
                c.lineTo(arrX-arrWidth, y+arrWidth/4);
                c.lineTo(arrX, y+arrWidth/4);
                c.fill();

            } else if(learner.state < learner.prevState){
                arrX = x+stateSize+stateDist/3;
                c.beginPath();
                c.moveTo(arrX, y);
                c.lineTo(arrX-arrWidth/2, y+arrWidth/2);
                c.lineTo(arrX, y+arrWidth);

                c.lineTo(arrX, y+3*arrWidth/4);
                c.lineTo(arrX+arrWidth, y+3*arrWidth/4);
                c.lineTo(arrX+arrWidth, y+arrWidth/4);
                c.lineTo(arrX, y+arrWidth/4);
                c.fill();
            }
        }


//        if(i === currentState){
//            c.strokeStyle = 'green';
//            c.beginPath();
//            //c.moveTo();
//            //c.lineTo();
//            c.stroke();
//        }

        c.fillStyle = 'black';
        c.textAlign = 'left';
        c.textBaseline = 'top';
        c.font = 'bold 12px sans-serif'
        c.fillText(i, x, h/2 + stateSize/2 + 5);

    }
    c.fillStyle = 'black';
    c.fillText('Episode: '+total_episodes, 10, 10);
    c.fillText('Epsilon: '+learner.epsilon.toFixed(4), 10, 25);

    c.textAlign = 'center';
    if(learner.greedyActionTaken){
        c.fillStyle = 'red';
        c.textAlign = 'center';
        c.fillText('GREEDY!', w/2, 25);
    } else {
        c.fillStyle = 'green';
        c.fillText('EXPLORE!', w/2, 25);
    }


}

function debug() {
    var out = document.getElementById('debug');
    //out.innerHTML = JSON.stringify(Q);
    var tmpl_qTable = _.template(document.getElementById('q-table').innerHTML);
    out.innerHTML = tmpl_qTable({
        N: learner.N,
        Q: learner.getQ()
    });

//    out.innerHTML = '';
//    out.innerHTML += '.| left | right';
//    out.innerHTML += '<br>';
//    out.innerHTML += '================';
//    out.innerHTML += '<br>';
//    for(var i = 0; i < learner.N; i++){
//        out.innerHTML += i + '|';
//        out.innerHTML += '<br>';
//        out.innerHTML += '.|--------------';
//        out.innerHTML += '<br>';
//    }

}

function redraw(){
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0, 0, can.width, can.height);
    ctx.strokeRect(0, 0, can.width, can.height);
    drawStates(ctx, learner.N, learner.state, 1);
}

function update() {
    redraw(ctx);

    //var elemTotalEpisodes = document.getElementById('total-episodes');
    //elemTotalEpisodes.innerHTML = total_episodes;

    debug();
}

var buttonTimeout = 1000;
function setStepButtons(enable){
    var disable = (enable)? false : true;
    document.getElementById('step-explore').disabled = disable;
    document.getElementById('step-exploit').disabled = disable;
    document.getElementById('e-step').disabled = disable;

    if(disable){
        learner.prevState = undefined;
        learner.greedyActionTaken = false;
    }
}
function setNumberOfStates(numStates){
    learner.N = numStates;
    resetLearner();
}

function runQLearnerStepExploration(times) {
    learner.epsilon = 1;
    var success = learner.step(times);
    console.log(learner.prevState, '-->', learner.state);
    update();

    if(success){
        setStepButtons(false);
        learner.randomState();
        setTimeout(function(){
            update();
            setStepButtons(true);
        }, buttonTimeout);
    }
}
function runQLearnerStepGreedy(times) {
    learner.epsilon = 0;
    var success = learner.step(times);
    console.log(learner.prevState, '-->', learner.state);
    update();

    console.log(success);
    if(success){
        setStepButtons(false);
        learner.randomState();
        setTimeout(function(){
            update();
            setStepButtons(true);
        }, buttonTimeout);
    }
}
function runQLearnerStepEpsilon(times) {
    learner.epsilon= +document.getElementById('epsilon').value;
    var success = learner.step(times);
    console.log(learner.prevState, '-->', learner.state);
    update();

    if(success){
        setStepButtons(false);
        learner.randomState();
        setTimeout(function(){
            update();
            setStepButtons(true);
        }, buttonTimeout);
    }
}

function runQLearnerEpsilon() {
    learner.epsilon= +document.getElementById('epsilon').value;
    runQLearner();
}
function runQLearnerExploration() {
    learner.epsilon = 1;
    runQLearner();
}
function runQLearnerGreedy() {
    learner.epsilon = 0;
    runQLearner();
}

function runQLearnerDecreaseEpsilon(doContinue) {
    learner.epsilon = doContinue? learner.epsilon : +document.getElementById('initial-epsilon').value;
    runQLearner(0.9);
}


function runQLearner(epsilonChangeRate) {
    //learner.runEpisode(times || learner.N * learner.N, function(){
    setStepButtons(false);
    learner.runEpisodes({
        episodes: +document.getElementById('episodes-per-run').value || 5,
        //delay: 200,
        //delay: 10,
        eachStep: function(){
            //console.log('step', learner.state)
            console.log(learner.prevState, '-->', learner.state);
            update();
        },
        eachEpisode: function(){
            //console.log('[ ===== GOAL ===== ] (', episodes, ')');
            console.log('[ ===== GOAL ===== ]');
            total_episodes++;
            if(epsilonChangeRate){
                learner.epsilon *= epsilonChangeRate;
            }

            update();
            setStepButtons(false);      // basically: reset prevState and greedyActionTaken
            setTimeout(function(){
                learner.randomState();
                update();
            }, learner.episodeDelay/2);
        },
        whenDone: function(){
            console.log("!!!!!!!!!!!!!!!! DONE !!!!!!!!!!!!!!!!!!");
            update();
            setStepButtons(true);
        }
    });
    update();
}

function resetLearner() {
    total_episodes = 0;
    learner.reset();
    update()
}

function setDelay(delay) {
    learner.stepDelay = delay;
}

// Setup
// ==================================================

var learner = LearnTool.QLearner;
learner.N = +document.getElementById('num-of-states').value || 5;
learner.gamma = +document.getElementById('gamma').value || 0.9;
document.getElementById('delay').value = document.getElementById('delay-current').innerHTML = learner.stepDelay = 300;

// Visualization
// ==================================================
update();


