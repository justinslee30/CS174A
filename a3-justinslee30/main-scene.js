window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,5 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        const shapes = { box:   new Cube(),
                         box_2: new Cube(),
                         custom: new (Custom_Shape.prototype.make_flat_shaded_version())(),
                         axis:  new Axis_Arrows()
                       }
        for (var i = 0; i < 24; i++){
            for (var j = 0; j < 2; j++){
                 shapes.box_2.texture_coords[i][j] = shapes.box_2.texture_coords[i][j] * 2; 
            }
        }
        this.submit_shapes( context, shapes );

        // TODO:  Create the materials required to texture both cubes with the correct images and settings.
        //        Make each Material from the correct shader.  Phong_Shader will work initially, but when 
        //        you get to requirements 6 and 7 you will need different ones.
        this.materials =
          { phong: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), {ambient: 0.2} ),
            OP   : context.get_instance( Texture_Scroll_X ).material( Color.of( 0,0,0,1 ), {ambient:1 , texture: context.get_instance("assets/OP.jpg",true)}),
            BO   : context.get_instance( Texture_Rotate ).material( Color.of( 0,0,0,1 ), {ambient:1 , texture: context.get_instance("assets/BO.png",false)})          }

        this.lights = [ new Light( Vec.of( -5,5,5,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

        this.increment = true;
        this.model_transform_box1 = Mat4.identity().times(Mat4.translation([-2,0,0]));
        this.model_transform_box2 = Mat4.identity().times(Mat4.translation([2,0,0]));

        // TODO:  Create any variables that needs to be remembered from frame to frame, such as for incremental movements over time.

      }
    make_control_panel()
      { // TODO:  Implement requirement #5 using a key_triggered_button that responds to the 'c' key.
       this.key_triggered_button( "(Un)pause rotation", ["c"], function() { if (this.increment){this.increment = false}else{this.increment = true} } ); this.new_line();

      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;

        if (this.increment){
            // TODO:  Draw the required boxes. Also update their stored matrices.
            //this.shapes.axis.draw( graphics_state, Mat4.identity(), this.materials.phong );
            this.model_transform_box1 = this.model_transform_box1.times(Mat4.rotation(Math.PI * dt, Vec.of(1,0,0)));
            this.shapes.box.draw( graphics_state, this.model_transform_box1, this.materials.BO);
            this.model_transform_box2 = this.model_transform_box2.times(Mat4.rotation(2*Math.PI/3 * dt,Vec.of(0,1,0)));
            this.shapes.box_2.draw( graphics_state, this.model_transform_box2, this.materials.OP);
        }
        else{
            this.shapes.box.draw( graphics_state, this.model_transform_box1, this.materials.BO);
            this.shapes.box_2.draw( graphics_state, this.model_transform_box2, this.materials.OP);
        }
        this.shapes.custom.draw( graphics_state, Mat4.identity().times(Mat4.translation([0,-2,0])).times(Mat4.rotation(-Math.PI/7,Vec.of(1,0,0))).times(Mat4.rotation(-Math.PI/4,Vec.of(0,1,0))), this.materials.phong);
      }
  }

class Texture_Scroll_X extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #6.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }
          //maybe need to just change the texture array
          vec4 new_tex_coord = vec4(f_tex_coord,1.0,1.0);
          mat4 tran = mat4(1.0,0.0,0.0,0.0,
                           0.0,1.0,0.0,0.0,
                           0.0,0.0,1.0,0.0,
                           2.0 * mod(animation_time,100.0),0.0,0.0,1.0); 
          vec2 final_answer = (tran * new_tex_coord).xy;
                                           // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          vec4 tex_color = texture2D( texture, (tran*new_tex_coord).xy );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

class Texture_Rotate extends Phong_Shader
{ fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
    {
      // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
      return `
        uniform sampler2D texture;
        void main()
        { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
            return;
          }
          float pi = 3.14159265359;
          vec4 new_tex_coord = vec4(f_tex_coord,1.0,1.0);
          mat4 tran = mat4(1.0,0.0,0.0,0.0,
                           0.0,1.0,0.0,0.0,
                           0.0,0.0,1.0,0.0,
                           0.5,0.5,0.0,1.0);
          mat4 rota_z = mat4(cos(-(pi/2.0) * mod(animation_time,100.0)),sin(-(pi/2.0) * mod(animation_time,100.0)),0.0,0.0,
                             -sin(-(pi/2.0) * mod(animation_time,100.0)),cos(-(pi/2.0) * mod(animation_time,100.0)),0.0,0.0,
                             0.0,0.0,1.0,0.0,
                             0.0,0.0,0.0,1.0);  
          mat4 trani = mat4(1.0,0.0,0.0,0.0,
                            0.0,1.0,0.0,0.0,
                            0.0,0.0,1.0,0.0,
                           -0.5,-0.5,0.0,1.0);
          vec2 final_answer = (tran * rota_z * trani * new_tex_coord).xy;
                                           // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                            // Phong shading is not to be confused with the Phong Reflection Model.
          vec4 tex_color = texture2D( texture, final_answer );                         // Sample the texture image in the correct place.
                                                                                      // Compute an initial (ambient) color:
          if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w); 
          else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
          gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
        }`;
    }
}

//Extra Credit 1
window.Custom_Shape = window.classes.Custom_Shape =
class Custom_Shape extends Shape     
  { constructor()
      { super( "positions", "normals", "texture_coords" );
        Cube.insert_transformed_copy_into(this,[], Mat4.identity().times(Mat4.rotation(Math.PI/4,Vec.of(0,1,0))).times(Mat4.scale([0.5,0.5,0.5])).times(Mat4.translation([0,0,1])));
        for (var i = 0; i < 4; i++){
           //top and bottom   
           Tetrahedron.insert_transformed_copy_into(this,[], Mat4.scale([0.5*Math.sqrt(2),0.5*Math.sqrt(2),0.5*Math.sqrt(2)]).times(Mat4.translation([0.5,0.5*Math.sqrt(2),0.5])).times(Mat4.rotation(i * Math.PI/2, Vec.of(0,1,0))));
           Tetrahedron.insert_transformed_copy_into(this,[], Mat4.scale([0.5*Math.sqrt(2),-0.5*Math.sqrt(2),0.5*Math.sqrt(2)]).times(Mat4.translation([0.5,0.5*Math.sqrt(2),0.5])).times(Mat4.rotation(i * Math.PI/2, Vec.of(0,1,0))));
           //sides
           Tetrahedron.insert_transformed_copy_into(this,[], Mat4.scale([0.5*Math.sqrt(2),0.5*Math.sqrt(2),0.5*Math.sqrt(2)]).times(Mat4.rotation(Math.PI/2,Vec.of(1,0,1))).times(Mat4.translation([0.5,0.5*Math.sqrt(2),0.5])).times(Mat4.rotation(i * Math.PI/2, Vec.of(0,1,0))));
           Tetrahedron.insert_transformed_copy_into(this,[], Mat4.scale([0.5*Math.sqrt(2),0.5*Math.sqrt(2),0.5*Math.sqrt(2)]).times(Mat4.rotation(3 * Math.PI/ 2,Vec.of(1,0,1))).times(Mat4.translation([0.5,0.5*Math.sqrt(2),0.5])).times(Mat4.rotation(i * Math.PI/2, Vec.of(0,1,0))));
        }
  } }