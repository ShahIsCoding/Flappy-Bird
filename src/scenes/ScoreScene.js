import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene{
    constructor(config){
        super('ScoreScene',{...config,canGoBack: true});
    }

    create(){
        super.create();
        const bestScore = localStorage.getItem('bestScore');
        const position = [this.config.width *0.3,this.config.height / 2];
        this.add.text(...position,`Best Score : ${bestScore}`,{fontSize:'40px',fill:'#FFF'});
    }
}

export default ScoreScene;