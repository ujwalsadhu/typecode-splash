if(!tc){ var tc = {}; }

(function(tc){
  if(!tc.particle){ tc.particle = {}; }
  
  tc.particle.panel = function(app){
    var _me, _domRef, _context, mouseforce;
    _me = this;
    
    this.template =  "<div id='particle-panel'>\
      <canvas id='buff1'></canvas>\
      <canvas id='buff2'></canvas>\
    </div>";
    
    this.initialize = function(){
      tc.util.log('particle.panel.initialize');
      app.Y.augment(_me,app.Y.EventTarget);
      return _me;
    }
    
    this.add_squares = function(arr){
      var i;
      for(i = 0; i < arr.length; i++){
        if(arr[i].s < 3){ return; }
        (function(sq){
          var i, j, ax, ay;
          ax = ( 200 + sq.x );
          ay = ( sq.y );
          
          _context.add_particle({
            pos:{
              x:tc.util.rand(0,_domRef.get('winWidth')),
              y:tc.util.rand(0,_domRef.get('winHeight'))
            },
            radius:sq.s/2,
            anchored:true,
            anchor:{
              x:ax,
              y:ay
            }
          });
        })(arr[i]);
      }
    }
    
    this.render = function(selector){
      tc.util.log('question_panel.appendTo');
      
      if(!selector){ selector = app.selector; }
      app.Y.one(selector).append(_me.template);
      _domRef = app.Y.one("#particle-panel");
      _domRef.getElementsByTagName('canvas').set("width",_domRef.get('winWidth'));
      _domRef.getElementsByTagName('canvas').set("height",_domRef.get('winHeight'));
      _domRef.set("width",_domRef.get('winWidth'));
      _domRef.set("height",_domRef.get('winHeight'));
      
      _domRef.on('mousemove',function(e){
        if(mouseforce){
          mouseforce.pos.setElements([e.clientX, e.clientY]);
        }
      });
      
      _context = tc.particle.context(app,_domRef,{
        bounds:{
          min_x: 0,
          max_x: _domRef.get('winWidth'),
          min_y: 0,
          max_y: _domRef.get('winHeight')
        }
      });
      _context.start();
      
      _context.add_force({
        id:'mouseforce',
        pos:{
          x:500,
          y:500
        },
        strength:-3,
        radius:200
      });
      
      return _me;
      
      //adds a grid of squares:
      (function(){
        var i, j, ax, ay;
        for(i = 0; i < 15; i++){
          for(j = 0; j < 15; j++){
            ax = ( (_domRef.get('winWidth')/2-100) + (i * 12) );
            ay = ( (_domRef.get('winHeight')/2-100) + (j * 12) );
            _context.add_particle(new tc.particle.particle(app,{
              pos:{
                x:tc.util.rand(0,_domRef.get('winWidth')),
                y:tc.util.rand(0,_domRef.get('winHeight'))
              },
              anchored:true,
              anchor:{
                x:ax,
                y:ay
              },
              draw:function(context,frame){
                context.fillStyle = this.fill;
                context.fillRect(
                  this.pos.elements[0]-this.options.radius,
                  this.pos.elements[1]-this.options.radius,
                  this.options.radius*2,
                  this.options.radius*2
                );
              }
            }));
          }
        }
      })();
      
      
      return _me;
    }
  
  
    return this.initialize();
  }
})(tc);