window.Assignment_Two_Test = window.classes.Assignment_Two_Test =
class Assignment_Two_Test extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),
 
                                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                                //        (Requirement 1)
                        sun    : new Subdivision_Sphere(4), 
                        planet1: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
                        planet2: new Subdivision_Sphere(3),
                        planet3: new Subdivision_Sphere(4),
                        planet4: new Subdivision_Sphere(4),
                        moon   : new (Subdivision_Sphere.prototype.make_flat_shaded_version())(1),

                        sphere1: new Subdivision_Sphere(1),
                        sphere2: new Subdivision_Sphere(2),
                        sphere3: new Subdivision_Sphere(3),
                        sphere4: new Subdivision_Sphere(4),

                        planet5: new (Grid_Sphere.prototype.make_flat_shaded_version())(15,15)      
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:1 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
            sun_color    : context.get_instance( Phong_Shader ).material(Color.of(1,0,0,1), {ambient: 1}),
            planet1_color: context.get_instance( Phong_Shader ).material(Color.of(0.66,0.66,1,1), {specularity: 0}),
            planet2_color: context.get_instance( Phong_Shader ).material(Color.of(0,.5,0,1), {specularity: 1, diffusivity: 0.50}),
            planet3_color: context.get_instance( Phong_Shader ).material(Color.of(0.7,0.35,0.3,1), {specularity: 1, diffusivity: 1}),
            planet4_color: context.get_instance( Phong_Shader ).material(Color.of(0,0,0.4,1), {specularity: 0.9, smoothness: 100}),
            planet5_color: context.get_instance( Phong_Shader ).material(Color.of(1,1,1,1), {specularity: 1, diffusivity: 1}),
            moon_color   : context.get_instance( Phong_Shader ).material(Color.of(0,0.4,0.3,1))
          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        //necessary variables
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        var w = 2*Math.PI/10;
        var w_ring = 2*Math.PI/5;
        var rad = 2 * Math.abs(Math.sin(w*t)) + 1;
        let model_transform = Mat4.identity();
        //make light at origin
        this.lights = [new Light(Vec.of(0,0,0,1), Color.of(rad/3,0,1-rad/3,1), 10**rad)];
        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)
        // this.shapes.torus2.draw( graphics_state, Mat4.identity(), this.materials.test );

        this.planet_1 = Mat4.identity().times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation([5,0,0]));//.times(Mat4.rotation(t,Vec.of(1,0,0)));
        this.planet_2 = Mat4.identity().times(Mat4.rotation(0.9*t,Vec.of(0,1,0))).times(Mat4.translation([8,0,0]));//.times(Mat4.rotation(t,Vec.of(1,0,0)));
        this.planet_3 = Mat4.identity().times(Mat4.rotation(0.8*t,Vec.of(0,1,0))).times(Mat4.translation([11,0,0]));//.times(Mat4.rotation(t,Vec.of(1,0,0)));      
        this.planet_4 = Mat4.identity().times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([14,0,0]));//.times(Mat4.rotation(t,Vec.of(1,0,0)));
        this.moon     = Mat4.identity().times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([14,0,0])).times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([3,0,0]));
        this.planet_5 = Mat4.identity().times(Mat4.rotation(0.5*t,Vec.of(0,1,0))).times(Mat4.translation([20,0,0]));


        //sun
        model_transform = model_transform.times(Mat4.scale([rad,rad,rad]));
        this.shapes.sun.draw( graphics_state, model_transform, this.materials.sun_color.override({color: Color.of(rad/3,0,1-rad/3,1)}));

        //planet 1
        model_transform = model_transform.times(Mat4.scale([1/rad,1/rad,1/rad])).times(Mat4.rotation(t,Vec.of(0,1,0))).times(Mat4.translation([5,0,0])).times(Mat4.rotation(t,Vec.of(0,1,0)));
        this.shapes.planet1.draw( graphics_state, model_transform, this.materials.planet1_color);

        //planet 2
        model_transform = Mat4.identity().times(Mat4.rotation(0.9*t, Vec.of(0,1,0))).times(Mat4.translation([8,0,0])).times(Mat4.rotation(t,Vec.of(0,1,0)));
        if (t % 2 == 0){
         this.shapes.planet2.draw( graphics_state, model_transform, this.materials.planet2_color.override({gourand : 1})); 
        }
        else{
          this.shapes.planet2.draw( graphics_state, model_transform, this.materials.planet2_color);
        }

        //planet 3
        model_transform = Mat4.identity().times(Mat4.rotation(0.8*t, Vec.of(0,1,0))).times(Mat4.rotation(Math.sin(w_ring*t)/2,Vec.of(1,0,0))).times(Mat4.translation([11,0,0])).times(Mat4.rotation(t,Vec.of(1,1,0)));
        this.shapes.planet3.draw( graphics_state, model_transform, this.materials.planet3_color);
        model_transform = model_transform.times(Mat4.scale([0.7,0.7,0.01]));
        this.shapes.torus.draw( graphics_state, model_transform, this.materials.ring);

        //planet 4 and moon
        model_transform = Mat4.identity().times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([14,0,0])).times(Mat4.rotation(t,Vec.of(0,1,0)));
        this.shapes.planet4.draw( graphics_state, model_transform, this.materials.planet4_color.override({gourand:1}));
        model_transform = Mat4.identity().times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([14,0,0])).times(Mat4.rotation(0.7*t,Vec.of(0,1,0))).times(Mat4.translation([3,0,0])).times(Mat4.rotation(t,Vec.of(0,1,0)));
        this.shapes.moon.draw( graphics_state, model_transform, this.materials.moon_color);

        //planet 5
        model_transform = Mat4.identity().times(Mat4.rotation(0.5*t,Vec.of(0,1,0))).times(Mat4.translation([20,0,0])).times(Mat4.rotation(t,Vec.of(0,1,0)));
        this.shapes.planet5.draw( graphics_state, model_transform, this.materials.planet5_color);  

        //planet model matrix
        if( this.attached != null){
          var desired = Mat4.inverse(this.attached().times(Mat4.translation([0,0,5])));
          desired = desired.map((desired,attached) => Vec.from(graphics_state.camera_transform[attached]).mix(desired,0.1));
          graphics_state.camera_transform = desired;
        }
  }
}


// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        {
          gl_Position = projection_camera_transform * model_transform * vec4(object_space_pos,1.0); 
          position =    model_transform * vec4(object_space_pos,1) ;
          center = model_transform * vec4(0,0,0,1);
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        vec4 brown = vec4(0.4,0.2,0,1);
        void main()
        {
          gl_FragColor = vec4(brown.xy * (sin(distance(center, position)*32.0)+1.0), brown.z,brown.w);
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        const circle_points = Array( rows ).fill( Vec.of( 1,0,0 ) )
                                           .map( (p,i,a) => 
                                                    Mat4.rotation(  i/(a.length - 1) * Math.PI - Math.PI/2, Vec.of( 0,-1,0 ) ) 
                                                    .times( p.to4(1) ).to3() );

        Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] );

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }