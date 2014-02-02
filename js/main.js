

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
            c.fillStyle = 'green';
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

function runQLearnerStepExploration(times) {
    learner.greedy = false;
    var success = learner.step(times);
    console.log(learner.prevState, '-->', learner.state);
    update();
    if(success){
        learner.randomState();
    }
}
function runQLearnerStepExploitation(times) {
    learner.greedy = true;
    var success = learner.step(times);
    console.log(learner.prevState, '-->', learner.state);
    update();
    if(success){
        learner.randomState();
    }
}

function runQLearnerExploration(times) {
    learner.greedy = false;
    runQLearner(times);
}
function runQLearnerGreedy(times) {
    learner.greedy = true;
    runQLearner(times);
}


function runQLearner(times) {
    //learner.runEpisode(times || learner.N * learner.N, function(){
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
            update();
        },
        whenDone: function(){
            console.log("!!!!!!!!!!!!!!!! DONE !!!!!!!!!!!!!!!!!!");
            update();
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
learner.N = 5;
learner.gamma = 0.8;
document.getElementById('delay').value = document.getElementById('delay-current').innerHTML = learner.stepDelay = 300;

// Visualization
// ==================================================
update();


