
;(function(LearnTool){

    // =======================================================================
    // # Private
    // =======================================================================
    var states = {
        GOAL: 1
    };

    var actions = {
        LEFT: -1,
        RIGHT: +1
    }

    var Q = {
        data: {},
        reset: function(){
            this.data = {};
        },
        update: function(s, a, value){
            this.data[[s, a]] = value;
        },
        get: function(s, a){
            var value = this.data[[s, a]];
            return value? value : 0;
        }
    };

    function V(s){
        var a, r;
        var max = -Infinity;
        for(var name in actions){
            r = Q.get(s, actions[name])
            if(max < r){
                max = r;
            }
        }
        return max;
    }

    function argmaxQ_a(s){
        var a, r;
        var max = -Infinity;
        var argmax = 0;
        for(var name in actions){
            r = Q.get(s, actions[name])
            if(max < r){
                max = r;
                argmax = actions[name];
            }
        }
        return argmax;
    }


    function randomState(N){
        return Math.round(Math.random()*(N-1)) + 1;
    }

    function randomAction(){
        return (Math.random() < 0.5)? -1 : 1;
    }


    // =======================================================================
    // # Class
    // =======================================================================
    var QLearner = {
        //initialized: false,

        N: 5,
        gamma: 0.99,
        epsilon: 1,
        state: undefined,
        action: undefined,

        showQ: function(){
            console.log(Q.data);
        },
        getQ: function(){
            return Q.data;
        },
        reset: function(){
            this.state = randomState(this.N);
            Q.reset();
        },

        runEpisodes: function(options, active){
            options = options || {};
            options.episodes = Math.round(options.episodes);
            options.episodes = isNaN(options.episodes)? this.N*this.N : options.episodes;
            options = options || {};
            var self = this;

            if(options.episodes <= 0){
                console.log("!!!!!!!!!!!!!!!! DONE !!!!!!!!!!!!!!!!!!");
                return;
            }
            options.episodes -= 1;

            if(!active){
                _whenDone = options.whenDone;
                options.whenDone = function(){
                    console.log("END ", options.episodes, 'episode');
                    self.runEpisodes(options, true);
                    _whenDone && _whenDone();
                };
            }
            self.runEpisode(options);
        },
        runEpisode: function(options, active){
            // new random state if episode newly started
            if(!active){
                this.state = randomState(this.N);
            }
            var self = this;
            var success = false;
            options = options || {};

            setTimeout(function(){
                success = self.step();
                if(!success){
                    options.eachStep && options.eachStep();
                    self.runEpisode(options, true);
                } else {
                    options.whenDone && options.whenDone();
                }
            }, options.delay || 10);
        },
        step: function(){

            var nextState;
            this.prevState = this.state;
            var maxQValue = 0;

            var takeGreedyAction = (Math.random() <= this.epsilon);

            if(this.greedy){
                // e-Greedy action; e = 0
                // at = arg maxaQ (st , a)
                this.action = argmaxQ_a(this.state);
            } else {
                // Exlploration:
                // select one among all possible actions for the current state
                this.action = randomAction();
            }


            nextState = this.state + this.action;

            // using this possible action, consider going to the next state
            // -> get maximum Q value for this next state based on all possible actions
            if(nextState > 1){
                //maxQValue = 0;              // all possible states have 0 reward
                //maxQValue = Q.get(nextState, this.action);
                maxQValue = V(nextState);

            } else if(nextState === 1) {
                maxQValue = 1;
            }
            Q.update(this.state, this.action, this.gamma * maxQValue);

            // -> set next state as current state
            this.state = nextState;

            // prevent running out to the right
            if(this.state > this.N){
                this.state = this.prevState;
            }
            if(this.state <= 0){
                this.state = this.prevState;
            }



            if(this.state === states.GOAL){
                //this.state = randomState(this.N);
                return true;
            }
        }
    };
    QLearner.reset();

    // =======================================================================
    // # Public
    // =======================================================================

    LearnTool.QLearner = QLearner;

}(window.LearnTool = window.LearnTool || {}))
