
function init(){
    document.getElementById('main').innerHTML='<canvas id="canvas" height="400" width="400"></canvas>'
    var to_draw=document.getElementById('canvas').getContext('2d')
    console.log(to_draw)
    var p=new draw(to_draw)
    p.init()
    window.setInterval(function(){
        //p.clear()
        p.draw_line()
    },30)

}

class draw{
    constructor(ctx){
        this.ctx=ctx
        this.count=0   
    }
    init(){
        this.ctx.lineWidth='1'
        this.ctx.beginPath()
        this.ctx.moveTo(0,0)
        this.ctx.lineTo(400,400)
        this.ctx.stroke()
        this.ctx.save()
    }
    draw_line(){
        this.ctx.restore()
        this.ctx.stroke()
        //this.ctx.save()
        //this.ctx.beginPath()
        this.ctx.moveTo(0,this.count*5)
        this.ctx.lineTo(400,this.count*5)
        this.ctx.stroke()
        this.count++
    }
    clear(){
        this.ctx.clearRect(0,0,400,400)
    }
}