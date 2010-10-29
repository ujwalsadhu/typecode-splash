if(!tc){ var tc = {}; }

(function(tc) {
  if(!tc.particle){ tc.particle = {}; }
  
  tc.particle.particle = function(options){
    var _me, o;
    _me = this;
    
    var pos,last_pos,
        vel,
        frc;
    
    _me.options = {
      pos:{x:0,y:0},
      vel:{x:0,y:0},
      frc:{x:0,y:0},
      anchored:false,
      anchor:{x:0,y:0},
      damping:0.95,
      radius:5,
      draw:function(context){
        context.beginPath();
        context.arc(this.pos.elements[0], this.pos.elements[1], this.o.radius, 0, (2*Math.PI), false);
        context.fill();
        context.closePath();
      },
      color:"000000",
      opacity:0.50,
      attraction_coefficient: 1.0,
      data:{}
    };
    
    (function(){
      var i;
      for(i in options){
        _me.options[i] = options[i];
      }
    })();
    
    o = this.options;
    
    this.initialize = function(){
      _me.pos = Vector.create([o.pos.x, o.pos.y]);
      last_pos = Vector.create([o.pos.x, o.pos.y]);
      vel = Vector.create([o.vel.x, o.vel.y]);
      frc = Vector.create([o.frc.x, o.frc.y]);
      if(o.anchored && o.anchor){
        _me.anchor = Vector.create([o.anchor.x,o.anchor.y]);
      }
      _me.hovered = false;
    }
    
    _me.worker = function(new_worker){
      if(new_worker){
        _me.worker = new_worker;
      } else {
        return _me.worker;
      }
    }
    
    _me.name = function(new_name){
      if(new_name){
        _me.options.name = new_name;
      } else {
        return _me.options.name;
      }
    }
    
    _me.pos = function(new_pos){
      if(new_pos){
        _me.pos = new_pos;
      } else {
        return _me.pos;
      }
    }
    
    _me.vel = function(new_vel){
      if(new_vel){
        vel = new_vel;
      } else {
        return vel;
      }
    }
    
    _me.frc = function(new_frc){
      if(new_frc){
        frc = new_frc;
      } else {
        return frc;
      }
    }
    
    _me.radius = function(new_radius){
      if(new_radius){
        _me.options.radius = new_radius;
      } else {
        return _me.options.radius;
      }
    }
    
    _me.reset_forces = function(){
      frc.setElements([0, 0]);
    }
    
    _me.add_forces = function(forces){
      var i,distance, length, pct, normal_distance;
      for(i in forces){
        distance = _me.pos.subtract(forces[i].pos);
        length = Math.sqrt(distance.dot(distance));
        if(length < forces[i].radius){
          pct = 1 - (length / forces[i].radius);
          normal_distance = distance.multiply(1/length);
          frc.elements[0] = frc.elements[0] - normal_distance.elements[0] * 
            forces[i].strength * pct * o.attraction_coefficient;
          frc.elements[1] = frc.elements[1] - normal_distance.elements[1] * 
            forces[i].strength * pct * o.attraction_coefficient;
        }
      }
    }
    
    _me.handle_anchor = function(){
      if(!_me.anchor){ return; }
      var distance, length, pct, normal_distance;
      distance = _me.pos.subtract(_me.anchor);
      length = Math.sqrt(distance.dot(distance));
      pct = 1.0 - (length / 1000);
      normal_distance = distance.multiply(1/length);
      frc.elements[0] = frc.elements[0] - normal_distance.elements[0] * 2 * pct;
      frc.elements[1] = frc.elements[1] - normal_distance.elements[1] * 2 * pct;
    }
    
    _me.collide_with_particles = function(particles,j){
      for(var i = 0; i < particles.length; i++){
        if(i != j){
          var distance = _me.pos.subtract(particles[i].pos())
          var length = Math.sqrt(distance.dot(distance))
          if(length < (o.radius + particles[i].radius())+2){
            var pct = 1 - (length / (o.radius + particles[i].radius() + 2))
            var normal_distance = distance.multiply((1/(length/4)))
            frc.elements[0] = frc.elements[0] - normal_distance.elements[0] * -0.7// * pct
            frc.elements[1] = frc.elements[1] - normal_distance.elements[1] * -0.7// * pct
          }
        }
      }
    }
    
    _me.stop = function(){
      frc.setElements([0, 0])
      vel.setElements([0, 0])
    }
    
    _me.add_damping = function(){
      vel = vel.multiply(_me.options.damping);
    }
    
    _me.contains_vector = function(_mp){
      var distance = _me.pos.subtract(_mp)
      var length = Math.sqrt(distance.dot(distance))
      if(length < o.radius){
        return true
      } else {
        return false
      }
    }
    
    _me.no_hover = function(){
      
    }
    
    _me.hover = function(){
      vel = vel.multiply(0)
    }
    
    _me.click = function(){
      
    }
    
    _me.bounce_off_walls = function(bounds){
      var b_did_i_collide;
      b_did_i_collide = false;
      
      if(_me.pos.elements[0] < bounds.min_x + o.radius){
        _me.pos.elements[0] = o.radius;
        b_did_i_collide = true;
        vel.elements[0] = vel.elements[0] * -1.0;
      }else if(_me.pos.elements[0] > bounds.max_x - o.radius){
        _me.pos.elements[0] = bounds.max_x - o.radius;
        b_did_i_collide = true;
        vel.elements[0] = vel.elements[0] * -1.0;
      }
      
      if(_me.pos.elements[1] < bounds.min_y + o.radius){
        _me.pos.elements[1] = o.radius;
        b_did_i_collide = true;
        vel.elements[1] = vel.elements[1] * -1.0;
      }else if(_me.pos.elements[1] > bounds.max_y - o.radius){
        _me.pos.elements[1] = bounds.max_y - o.radius;
        b_did_i_collide = true;
        vel.elements[1] = vel.elements[1] * -1.0;
      }
      
      if(b_did_i_collide){
        vel = vel.multiply(0.3);
      }
    }
    
    _me.update = function(){
      if(_me.hovered){
        vel = vel.add(frc.multiply(0.6));
      } else {
        vel = vel.add(frc);
      }
      
      _me.pos = _me.pos.add(vel).multiply(0.5).add(last_pos.multiply(0.5));
      last_pos = _me.pos;
    }
    
    _me.get = function(){
      var me;
      me = {
        pos:[_me.pos.elements[0],_me.pos.elements[1]],
        radius:o.radius
      }
      return me;
    }
    
    return this.initialize();
  }
})(tc);