
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 538;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

// var endTime = new Date();
// endTime.setTime(endTime.getTime()+ 3600*1000)

var curShowTimeSeconds = 0

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]

window.onload = function(){
    
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;

    RADIUS = Math.round(WINDOW_WIDTH*4/5/108)-1 ;
    MARGIN_TOP =  Math.round(WINDOW_HEIGHT/5) ;
    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds()
    setInterval(function(){
        render( context );
        update(); //对当前的数据进行调整
    },50)
            
function update() { //时间产生小球，小球产生颜色，并附带物理的运动
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    
    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
    var nextSeconds = nextShowTimeSeconds % 60

    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 )
    var curSeconds = curShowTimeSeconds % 60

    if( nextSeconds != curSeconds) {
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
    
    // console.log( balls.length)
}           
      
function updateBalls(){

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;

    var c = 1.0;
    if( balls[i].y + RADIUS + balls[i].vy >= WINDOW_HEIGHT ){
        c = ( WINDOW_HEIGHT - (balls[i].y+ RADIUS) ) / balls[i].vy;
        // console.log( c );	
    }
        
    balls[i].y += balls[i].vy;
    balls[i].vy += c * balls[i].g;;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
        balls[i].vy = - Math.abs(balls[i].vy)*0.75;
        }
    }

    var cnt = 0
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
            balls[cnt++] = balls[i]

    while( balls.length > Math.min(300, cnt)){
        balls.pop(); // 性能优化，才能持续运行
    }
}

function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(), // Math.random()产生0到1之间的随机数
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5, // 向上抛
                    color: colors[ Math.floor( Math.random()*colors.length ) ] // Math.floor向下舍入
                }

                balls.push( aBall )
            }
}
function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    // var ret = endTime.getTime() - curTime.getTime();
    // ret = Math.round( ret/1000 )
    // return ret >= 0 ? ret : 0;
    var ret = curTime.getHours()*3600+ curTime.getMinutes()*60+curTime.getSeconds()
    return ret;
}

function render( cxt ){
    //对一个矩形空间内的图像进行一次刷新
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    var hours = parseInt( curShowTimeSeconds / 3600);
    var minutes = parseInt( (curShowTimeSeconds - hours * 3600)/60 )
    var seconds = curShowTimeSeconds % 60

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS + 1) , MARGIN_TOP , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);

    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){

    cxt.fillStyle = "rgb(0,102,153)";

    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                cxt.closePath()

                cxt.fill()
            }
    }

}