import BaseScene from "./BaseScene";

class PlayScene extends BaseScene{
    constructor(config){
        super('PlayScene',config);

        this.bird = null;
        this.pipes = null;

        this.flapVelocity = 300;
        this.numberOfPipes = 4;
        this.score = 0;
        this.scoreText = '';
        this.difficultyText = '';
        this.screenCenter = [this.config.width /2,this.config.height/2];
        this.isPause = false;
        this.initialTime = 3;
        this.fontOptions = {fontSize:'30px',fill:'#fff'} 
        this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy':{
                pipeHorizontalDistanceRange : [300 ,450],
                pipeOpeningDistanceRange : [150 ,250],
                sceneVelocity : 200
            },
            'normal':{
                pipeHorizontalDistanceRange : [280 ,430],
                pipeOpeningDistanceRange : [140 ,190],
                sceneVelocity : 450
            },
            'hard':{
                pipeHorizontalDistanceRange : [250 ,310],
                pipeOpeningDistanceRange : [120 ,150],
                sceneVelocity : 600
            }
        }
    }

    create(){
        super.create();
        this.createBird();
        this.createPipes();
        this.createColiders();
        this.createScore();
        this.createPause();
        this.handleInput();
        this.listenEvents();
        this.increaseDifficulty();
        
        this.anims.create({
            key:'fly',
            frames:this.anims.generateFrameNumbers('bird',{start:8,end:15}),
            frameRate:8,
            repeat:-1 // -1 for inifinty 
        });

        this.bird.play('fly');
    }
    update(){
        this.checkGameStatus();
        this.recyclePipes();
    }
    createBird(){ 
        this.bird  = this.physics.add.sprite(this.config.startPosition.x,this.config.startPosition.y,'bird')
        .setScale(2)
        .setFlipX(true)
        .setOrigin(0);
        this.bird.setBodySize(this.bird.width,this.bird.height - 8,true);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }
    createPipes(){
        this.pipes = this.physics.add.group();

        for(let i =0;i < this.numberOfPipes;i++){
            const upperpipe =  this.pipes.create(0,0,'pipe')
            .setImmovable(true)
            .setOrigin(0,1);
            const lowerpipe =  this.pipes.create(0,0,'pipe')
            .setImmovable(true)
            .setOrigin(0,0);    
            
            this.placePipe(upperpipe,lowerpipe);
        }
        this.pipes.setVelocityX(-this.difficulties[this.currentDifficulty].sceneVelocity);
    }
    createColiders(){
        this.physics.add.collider(this.bird, this.pipes, this.gameOver,null,this);
    }
    createScore(){
        this.score = 0;
        this.scoreText = this.add.text(16,16,`Score : ${this.score}`,this.fontOptions);

        this.difficultyText = this.add.text(this.config.width - 250,16,`Mode : ${this.currentDifficulty}`,this.fontOptions);

        const bestScore = localStorage.getItem('bestScore');
        this.add.text(16,52,`Best Score:${bestScore || 0}`,{fontSize:'20px',fill:'#fff'});
        
    } 
    createPause(){
       const pauseBtn =  this.add.image(this.config.width - 20, this.config.height - 20,'pause')
        .setScale(2)
        .setOrigin(1)
        .setInteractive();
        pauseBtn.on('pointerdown',()=>{
            this.isPause = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
    }
    handleInput(){
        this.input.on('pointerdown',this.flap,this);
        this.input.keyboard.on('keydown_SPACE',this.flap,this);
    }
    checkGameStatus(){
        if(this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0){
            this.gameOver();
        }
    }
    placePipe(Upipe,Lpipe){

            const difficulty = this.difficulties[this.currentDifficulty];
            const rightMostX = this.getRightMostPipe();
            const pipeVerticalDistance   = Phaser.Math.Between(...difficulty.pipeOpeningDistanceRange);
            const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
            const pipeVerticalPositions  = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
            
            Upipe.x = rightMostX + pipeHorizontalDistance;
            Upipe.y = pipeVerticalPositions;
        
            Lpipe.x = Upipe.x;
            Lpipe.y = Upipe.y + pipeVerticalDistance;
    }
    getRightMostPipe(){
        let rightMostX = 0;
        this.pipes.getChildren().forEach(pipe => {
            rightMostX = Math.max(rightMostX,pipe.x);
        });
        return rightMostX;
    }
    flap(){
        if(this.isPause) {return ;}
        this.bird.body.velocity.y = -this.flapVelocity;
    }
    recyclePipes(){
        let temp = [];// temproray pipes array
        this.pipes.getChildren().forEach(pipe =>{
            if(pipe.x <= 0){ //pipe.x < 0 add to temp
                temp.push(pipe);
                if(temp.length == 2){
                    this.placePipe(...temp);
                    this.increaseScore();
                    this.increaseDifficulty();
                    //place temp pipes to end
                }
            }
        });
    }
    gameOver(){
        this.physics.pause();
        this.bird.setTint(0xEE4824); 

        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if(!bestScore || this.score > bestScore){
            localStorage.setItem('bestScore',this.score);
        }
        this.time.addEvent({
            delay:1000,
            callback:() => {
                this.scene.restart();                
            },
            loop:false
        })
    }
    increaseScore(){
        this.score++;
        this.scoreText.setText(`Score : ${this.score}`);
        this.difficultyText.setText(`Mode : ${this.currentDifficulty}`);
    }
    listenEvents(){
        if(this.pauseEvent){return ; }
        this.pauseEvent = this.events.on('resume',()=>{
            this.countDownText = this.add.text(...this.screenCenter, ' Fly in '+ this.initialTime,this.fontOptions ).setOrigin(0.5);
            this.timeEvent = this.time.addEvent({
                delay:1000,
                callback: () => this.countDown(),
                callbackScope: this,
                loop: true 
            })
        })
    }
    countDown(){
        debugger
        console.log('countDown');
        this.initialTime--;
        this.countDownText.setText('Fly in: '+this.initialTime);
        if(this.initialTime <= 0){
            this.countDownText.setText(' ');
            this.physics.resume();
            this.isPause = false;
            this.timeEvent.remove();
        }

    }
    increaseDifficulty(){
        if(this.score <= 5){this.currentDifficulty = 'easy';console.log(this.score,'  ',this.currentDifficulty)}
        if(this.score>=6  && this.score <= 15 ) {this.currentDifficulty = 'normal';console.log(this.score,'  ',this.currentDifficulty)}
        if(this.score >= 16){this.currentDifficulty = 'hard';console.log(this.score,'  ',this.currentDifficulty)}
    }
    // 
}

export default PlayScene;