import Phaser from "phaser";

class BaseScene extends Phaser.Scene{

    constructor(key,config){
        super(key);
        this.config = config;
    }
    create(){
        this.add.image(0,0,'sky').setOrigin(0);
        if(this.config.canGoBack){
            const backBtn = this.add.image(this.config.width -10,this.config.height -10 ,'back').
            setOrigin(1)
            .setInteractive();

            backBtn.on('pointerup',()=>{
                this.scene.start('MenuScene');
            })
        }
    }
    createMenu(menu,setupMenuEvents){
        let lastMenuPositionY = 0;
        menu.forEach(item =>{
            const menuPosition = [this.config.width/2,this.config.height/2 + lastMenuPositionY -50];
            item.textGo = this.add.text(...menuPosition,item.text,{fontSize:'32px',fill:'#FFF'})
            .setOrigin(0.5,1);
            lastMenuPositionY += 42;
            setupMenuEvents(item);
        })    
    }
}

export default BaseScene;