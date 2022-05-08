function init(){
    my_game=new game
    my_game.init()
    my_game.draw.to_draw.addEventListener('mousemove',function(event){
        my_game.draw.coord=event.clientX
        my_game.draw.calmap()
        my_game.draw.clear()
        my_game.draw.draw_temp()
    })
    my_game.draw.to_draw.addEventListener('click',function(event) {
        my_game.makestep()
    })
}

class game{

    constructor(name1='p1',name2='p2',mapsize=[8,8]){
        this.player_list=[new player(name1,0,'Chess_kdt45.svg.png','black'),new player(name2,1,'Chess_qdt45.svg.png','red')]
        this.mapsize=mapsize
    }

    init(){
        var to_draw=document.createElement('canvas')
        to_draw.id='canvas1'
        to_draw.height=window.innerHeight
        to_draw.width=window.innerWidth
        document.getElementById('main').appendChild(to_draw)
        this.map=[]
        for (var i=0;i<this.mapsize[0];i++){
            var temp=[]
            for (var j=0;j<this.mapsize[1];j++){
                temp.push(2)
            }
            this.map.push(temp)
        }
        this.draw=new draw(0,this.mapsize,this.map,[this.player_list[0].icon,this.player_list[1].icon])
        this.draw.init()
        this.draw.drawBG()
        this.operator=[[1,1],[1,-1],[0,1],[1,0]]
        this.turn=0
    }

    makestep(){
        if(this.draw.index_temp[0]!='illegal'){
            this.map[this.draw.index_temp[0]][this.draw.index_temp[1]]=this.turn
            this.last=this.draw.index_temp//最后一步
            this.draw.map=this.map
            this.draw.makestep(this.draw.index_temp,this.turn)
            this.player_list[this.turn].pos.push(this.draw.index_temp)
            this.turn=(this.turn+1)%2 
        }
        else{
            this.draw.alert()
        }
        this.draw.drawIC()
        this.draw.calmap()
        this.judge()
        if(this.is_win){
            this.draw.win()
        }
    }

    judge(){
        var indicator=this.map[this.last[0]][this.last[1]]
        this.is_win=false
        for(const x of this.operator){
            var count=1
            for(var i=1;i<4;i++){
                try {
                    if(this.map[this.last[0]+(i*x[0])][this.last[1]+(i*x[1])]==indicator){
                        count++
                    }
                    else{
                        break
                    }
                } 
                catch (error) {
                    break
                }
            }
            for(var i=-1;i>-4;i--){
                try {
                    if(this.map[this.last[0]+(i*x[0])][this.last[1]+(i*x[1])]==indicator){
                        count++
                    }
                    else{
                        break
                    }
                } 
                catch (error) {
                    break
                }
            }
            if(count==4){
                this.is_win=true
                console.log('win')
                break
            }
        }
    }

}

class draw{
    constructor(seq,mapsize,map,icon_list){
        this.seq=seq
        this.mapsize=mapsize
        this.map=map
        this.icon_list=icon_list
        this.to_draw=document.getElementById('canvas1')
        this.ctx=this.to_draw.getContext('2d') 
        this.square=(Math.min(this.to_draw.height,this.to_draw.width))
        this.indicator=1
    }

    init(){
        this.imglist=[]
        for(const i of this.icon_list){
            var temp=document.createElement('img')
            temp.id=i
            temp.src=i
            this.imglist.push(temp)
        }
    }

    makestep(last,indicator){
        this.last=last
        this.indicator=indicator
        this.done=false
    }

    calmap(){//时间间隔调用&鼠标移动调用
        var operator=[]
        for(const i of this.x_range){
            operator.push(Math.abs(i-this.coord))
        }
        var yIndex=0
        for(var i=0;i<operator.length;i++){
            if(operator[i]<operator[yIndex]){
                yIndex=i
            }
        }
        var xIndex=0
        for(var i=this.mapsize[0]-1;i>0;i--){
            if(this.map[i][yIndex]==2){
                xIndex=i
                break
            }
            if(this.map[0][yIndex]!=2){
                xIndex='illegal'
                break
            }
        }
        this.index_temp=[xIndex,yIndex]
    }

    drawBG(){
        var ctx=this.ctx
        ctx.lineWidth='3'
        ctx.strokeStyle='black'
        ctx.beginPath();
        ctx.lineJoin='round'
        for(var i=0;i<(this.mapsize[0]+1);i++){
            ctx.moveTo(((this.to_draw.width/2)-(this.square/2)),
            ((this.to_draw.height/2)-(this.square/2)+(i*this.square/this.mapsize[0])))
            ctx.lineTo(((this.to_draw.width/2)+(this.square/2)),
            ((this.to_draw.height/2)-(this.square/2)+(i*this.square/this.mapsize[0])))
        }
        for(var j=0;j<(this.mapsize[1]+1);j++){
            ctx.moveTo(((this.to_draw.width/2)-(this.square/2)+(j*this.square/this.mapsize[1])),
            ((this.to_draw.height/2)-(this.square/2)))
            ctx.lineTo(((this.to_draw.width/2)-(this.square/2)+(j*this.square/this.mapsize[1])),
            ((this.to_draw.height/2)+(this.square/2)))
        }
        ctx.save()
        ctx.stroke()
        this.x_range=[]
        for(var i=0;i<this.mapsize[1];i++){
            this.x_range.push((this.to_draw.width/2)-(this.square/2)+((i+1/2)*(this.square/this.mapsize[1])))
        }
    }

    drawIC(){
        var ctx=this.ctx
        ctx.restore()
        for(var i=0;i<this.mapsize[0];i++){
            for(var j=0;j<this.mapsize[1];j++){
                if(this.map[i][j]!=2){
                    ctx.drawImage(this.imglist[this.map[i][j]],
                        (this.to_draw.width/2)-(this.square/2)+(j*this.square/this.mapsize[1]),
                        (this.to_draw.height/2)-(this.square/2)+(i*this.square/this.mapsize[0]),
                        this.square/this.mapsize[0],this.square/this.mapsize[1])
                }
            }
        }
        /*if(this.done==false){ 
            ctx.drawImage(this.imglist[this.indicator],
                (this.to_draw.width/2)-(this.square/2)+(this.last[1]*this.square/this.mapsize[1]),
                (this.to_draw.height/2)-(this.square/2)+(this.last[0]*this.square/this.mapsize[0]),
                this.square/this.mapsize[0],this.square/this.mapsize[1])
            this.done=true
        }*/
        ctx.save()
    }

    draw_temp(){
        this.drawBG()
        this.drawIC()
        var ctx=this.ctx
        if(this.index_temp[0]!='illegal'){//refresh//&&this.done==true
            //ctx.beginPath()
            ctx.drawImage(this.imglist[1-this.indicator],
                ((this.to_draw.width/2)-(this.square/2)+(this.index_temp[1]*this.square/this.mapsize[1])),
                ((this.to_draw.height/2)-(this.square/2)+(this.index_temp[0]*this.square/this.mapsize[0])),
                this.square/this.mapsize[0],this.square/this.mapsize[1])
        }
        ctx.stroke()
    }
    
    clear(){
        var ctx=this.ctx
        ctx.clearRect(0,0,this.to_draw.width,this.to_draw.height)
    }

    win(){//to be completed
        var indicator=this.map[this.last[0]][this.last[1]]
        indicator++
        alert('Player '+indicator+' won')
    }
}

class player{

    constructor(name,seq,icon,color){
        this.name=name
        this.seq=seq
        this.icon=icon
        this.color=color
        this.pos=[]
    }

    makestep(x,y){
        this.pos.push([x,y])
    }

}