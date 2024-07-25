const ANIM = {
    /** Create new Animator object.
     * @param subject - js object to animate its fields
     */
    create: function(subject){
        return {
            subject: subject,   // Object to animate its properties
            activeAnimations: [], // Animations that play currently

            animations: {},     // Object to store all the animations

            /**Update the animator. Used in setInterval or requestAnimationFrame
            @param deltaTime - time passed sins the last frame*/
            update: function(deltaTime){
                for (let i = this.activeAnimations.length-1; i >= 0 ; i--) {
                    let anim = this.activeAnimations[i];
                    if(anim.finished) this.activeAnimations.splice(i, 1);
                    anim.update(deltaTime);
                }
            },

            /** Set the animation as active, reset it and start playing
             * @param animName - name of animation to play*/
            play: function(animName){
                for (let i = 0; i < this.activeAnimations.length; i++) {
                    let anim = this.activeAnimations[i];
                    if(anim.name === animName)
                        return;
                }
                this.activeAnimations.push(this.animations[animName]);
            },

            reset: function(animName){
                this.animations[animName].reset();
            },

            /** Clear active animation var and stop the animation playing */
            stop: function(animName){
                for (let i = this.activeAnimations.length-1; i >= 0 ; i--) {
                    let anim = this.activeAnimations[i];
                    if(anim.name === animName)
                        this.activeAnimations.splice(i, 1);
                }
            },

            setAnimationDuration: function(animName, duration){
                let animation = this.animations[animName];
                let scale =  duration / animation.totalTime;
                animation.totalTime = duration;

                for (let i = 0; i < animation.actions.length; i++) {
                    const action = animation.actions[i];
                    action.duration *= scale;
                    action.startTime *= scale;;
                    action.scale = 1 / action.duration;
                }
                animation.reset();
            },

            /** Create a new animation
             * @param name - string name of the animaton
             * @param loop - bool define is it will be played repeatably
             */
            addAnimation: function(name, loop=false){
                this.animations[name] = {
                    name: name,         // Store the name of animation
                    totalTime: 0,       // Duration of the animation. Sets automatically with adding new actions
                    currentTime: 0,     // Time counter of the animation
                    finished: false,    // If its true and loop var is false animation will be stopped
                    loop: loop,         // Determines is the animation play continuously until its stoped manualy
                    actions: [],        // Storage for all the actions
                    update: function(deltaTime){ // Tick function. deltaTime - time passed sins last update
                        if(this.finished)
                            return;

                        for (let i = 0; i < this.actions.length; i++) { // Update all the actions
                            this.actions[i].update(deltaTime, this.currentTime);
                        }

                        if(this.currentTime > this.totalTime){ // Check if the animation is finished and repeat it if its setup accordingly 
                            if(this.loop){
                                this.reset();
                            }else{
                                this.finished = true;
                            }
                        }

                        this.currentTime += deltaTime; // Increment the animation timer
                    },
                    reset: function(){ // Reset the animation and its actions
                        this.currentTime = 0;
                        this.finished = false;
                        for (let i = 0; i < this.actions.length; i++) {
                            this.actions[i].reset();
                        }
                    },
                    addAction: function(action, endTime){
                        this.actions.push(action);
                        if(endTime > this.totalTime) // Change animation total time if it's action last longer
                            this.totalTime = endTime;
                    }
                }
            },
            
            /** Createa new action to interpolate between two vectors
             * @param animName string. Name fo animation to add this action
             * @param objPropertyName string. Name of property (vector) to animate
             * @param startTime number. Start of the action in seconds sins animation started
             * @param endTime number. Time when the action ends
             * @param startVec Vec. Refference to the start position vector
             * @param endVec Vec. Refference to the end position vector
             */
            addVecAction: function(animName, objPropertyName, startTime, endTime, startVec, endVec){
                let newAction = {
                    subject: undefined, // Object to animate
                    propertyName: objPropertyName, // Object vector property name to change
                    startTime: startTime, // Action begin time
                    currentTime: 0,      // Aciton time counter
                    duration: endTime - startTime,
                    scale: 1 / (endTime - startTime), // Scale variable to calculate time of interpolation properly
                    finished: false,     // Finish action flag
                    startVec: startVec,  // Start positon vector reference
                    endVec: endVec,      // End positon vector reference
                    update: function(deltaTime, animationTime){
                        if(this.finished) // Skip everything if the acion ended
                            return;

                        if(animationTime < this.startTime) // Wait the action begin time
                            return;

                        this.currentTime += deltaTime * this.scale; // Calculate t value for lepr function (beetwen 0 and 1)

                        Vec.lerp(this.startVec, this.endVec, this.subject[this.propertyName], this.currentTime); // Change the obj vector with the lerp function
                        
                        if(this.currentTime >= 1){ // Stop the action if its time is over
                            Vec.copy(this.subject[this.propertyName], this.endVec);
                            this.finished = true;
                        }

                    },
                    reset: function(){ // Resets the action properties to start state
                        this.finished = false;
                        this.currentTime = 0;
                    }
                }
                newAction.subject = this.subject; // Add a parent object whose properties we will change
                this.animations[animName].addAction(newAction, endTime);
            },
            /** Createa new action to change cpecified value over time
             * @param animName string. Name fo animation to add this action
             * @param objPropertyName string. Name of property (nuber value) to animate
             * @param startTime number. Start of the action in seconds sins animation started
             * @param duration number. Duration of the action in seconds
             * @param startValue number. Refference to the start value
             * @param finalValue number. Refference to the end value
             */
            addValueAction: function(animName, objPropertyName, startTime, endTime, startValue, finalValue){
                let newAction = {
                    subject: undefined, // Object those property we will animate
                    propertyName: objPropertyName, // Object value property name to change
                    startTime: startTime, // Action begin time
                    currentTime: 0,      // Aciton time counter
                    duration: endTime - startTime,
                    scale: 1 / (endTime - startTime), // Scale variable to calculate time of interpolation properly
                    finished: false,     // Finish action flag
                    startValue: startValue,  // Start value
                    difference: finalValue - startValue,      // Difference - the value to adding over time
                    finalValue: finalValue,  // End value
                    
                    update: function(deltaTime, animationTime){
                        if(this.finished) // Skip everything if the acion ended
                            return;

                        if(animationTime < this.startTime) // Wait the action begin time
                            return;
                        
                        this.currentTime += deltaTime * this.scale; // Calculate the time scale to add proper portion of the value over time

                        this.subject[this.propertyName] = this.startValue + this.difference * this.currentTime;

                        if(this.currentTime >= 1){ // Stop the action if its time is over
                            this.subject[this.propertyName] = this.finalValue;
                            this.finished = true;
                        }
                    },
                    reset: function(){ // Resets the action properties to start state
                        this.finished = false;
                        this.currentTime = 0;
                    }
                }
                newAction.subject = this.subject; // Add a parent object whose properties we will change
                this.animations[animName].addAction(newAction, endTime);
            },
            /** Createa new action to call cpecified function
             * @param animName string. Name fo animation to add this action
             * @param objPropertyName string. Name of funciton to call
             * @param startTime number. Start of the action in seconds sins animation started
             */
            addFuncAction: function(animName, objPropertyName, startTime){
                let newAction = {
                    subject: undefined, // Object those property we will animate
                    propertyName: objPropertyName, // Object function name to change
                    startTime: startTime, // Action begin time
                    duration: 0,
                    finished: false,      // Finish action flag
                    
                    update: function(deltaTime, animationTime){
                        if(this.finished) // Skip everything if the acion ended
                            return;

                        if(animationTime < this.startTime) // Wait the action begin time
                            return;

                        this.subject[this.propertyName]();
                        this.finished = true;
                    },
                    reset: function(){ // Resets the action properties to start state
                        this.finished = false;
                    }
                }
                newAction.subject = this.subject; // Add a parent object whose properties we will change
                this.animations[animName].addAction(newAction, startTime);
            }
        }
    }
}

const TWEEN = {
    tweenList: [],
    update: function(deltaTime){
        for (let i = this.tweenList.length-1; i >= 0 ; i--) {
            if(this.tweenList[i].finished){
                this.tweenList.splice(i, 1);
                continue;
            }
            this.tweenList[i].update(deltaTime);
        }
    },
    vec: function(vecLink, startState, endState, time){
        let newTween = {
            vecLink: vecLink,
            startState: Vec.fromVector(startState),
            endState: Vec.fromVector(endState),
            finished: false,
            t: 0,
            scale: 1 / time,
            update: function(deltaTime){
                this.t += deltaTime * this.scale;
                Vec.lerp(this.startState, this.endState, vecLink, this.t);
                if(this.t >= 1){
                    Vec.copy(this.vecLink, this.endState);
                    this.finished = true;
                }
            }
        }
        this.tweenList.push(newTween);
        return newTween;
    }
}