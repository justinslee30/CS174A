window.Assignment_Four_Scene = window.classes.Assignment_Four_Scene =
class Assignment_Four_Scene extends Scene_Component
{ constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
    { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:

      const r = context.width/context.height;
      //console.log(r);
      context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

      const shapes = {
      		body:       new Cube(),
      		wheels:     new Torus(20,20),
      		sphere:     new Subdivision_Sphere(4),
      		ground:		new Cube(),
      		building:   new Cube(),
      		wall: 	    new Cube(),
      		boundary: 	new Cube(),
      		spiderman:  new Cube(),
      		AABB: 		new Cube(),
      		lamp: new Lamp(),
      		ball: new Subdivision_Sphere(4),
      		arrow:	new Triangle(),
      		coin:		new Capped_Cylinder(10,10),
      		web: 		new Capped_Cylinder(20,20)
      }
      this.submit_shapes( context, shapes );

      this.materials =
      { tan:   context.get_instance( Phong_Shader ).material( Color.of( 1,0.87,0.68,1 ) ),		// Color: Navajowhite
      	gray:  context.get_instance( Phong_Shader ).material( Color.of( 0.86,0.86,0.86, 1) ),	// Color: Gainsboro
      	silver:context.get_instance( Phong_Shader ).material( Color.of( 0.74,0.74,0.74, 1) ),	// Color: Silver
      	white: context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1) ),
      	pure_white: context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1), {ambient: 1} ),
      	light: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1)),
      	black: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1) ),
      	yellow:context.get_instance( Phong_Shader ).material( Color.of (1,1,0,1) ),
      	red:   context.get_instance( Phong_Shader ).material( Color.of (1,0.2,0.2,1) ),
      	pure_red: context.get_instance( Phong_Shader ).material( Color.of (1,0,0,1), {ambient: 1, specularity: 0} ),
      	blue:  context.get_instance( Phong_Shader ).material( Color.of (0.2,0.6,0.8,1) ),
      	green: context.get_instance( Phong_Shader ).material( Color.of (0.18,0.55,0.34,1) ),
      	AABB:  context.get_instance( Phong_Shader ).material( Color.of( 1,0,0,0.25) ),
      	buildings: [
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/1.png", true) } ),
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/2.png", true) } ),
			context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/buildings/3.png", true) } )	
      	],
      	ground: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/ground.png", true) }),
      	sky: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/sky-solid.png", true) }),
      	skyWall: context.get_instance( Phong_Shader ).material( Color.of( 0,0,0,1 ), { ambient: 1, texture: context.get_instance("assets/textures/sky-wall.png", true) }),
      	invisible: context.get_instance( Phong_Shader ).material( Color.of( 0,1,0,0.1 ) ),
      	coin: context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient: 0.8, specular: 1 } ),
      	spider_design: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1), {ambient: 1, texture: context.get_instance("assets/textures/spiderLogo.png", true)})
      }

	  this.lights = [ new Light( Vec.of( 0,50,0,1 ), Color.of( 0,1,1,1 ), 100000 ) ];

	  //JUSTIN - sounds
	  this.sounds = {web: new Audio("assets/sounds/web.wav"),
	  				 fly: new Audio("assets/sounds/fly.wav"),
	  				 go: new Audio("assets/sounds/go.wav"),
	  				 gwg: new Audio("assets/sounds/go_web_go.wav"),
	  				 shazam: new Audio("assets/sounds/shazam.wav"),
	  				 uua: new Audio("assets/sounds/up_up_and_away.wav"),
	  				 coin: new Audio("assets/sounds/coin.wav")};
	  				 
	  this.strings = ["web","fly","go","gwg","shazam","uua","coin"];

	  // JOSH - Spiderman object
	  this.spiderman = new Spiderman( context.globals.graphics_state );

	  //spiderman. its transform is copied from display(), crappy but we're changing it later so w/e
	  const spidermanShape = {
	  	body: { positions: this.shapes.spiderman.positions, transform: this.spiderman.model_transform.times(Mat4.scale([.5,1,1])) }
	  };

	  // JOSH - Pointer capture and mouse controls
	  document.getElementById("canvas1").addEventListener( "click", () => {document.getElementById("canvas1").requestPointerLock();} );	// Click inside canvas to capture cursor
	  document.body.addEventListener( "mousemove", (m) => {
	  	if (document.pointerLockElement === document.getElementById("canvas1"))
	  	  this.spiderman.camera_swivel( m ); } );
	  document.body.addEventListener( "mousedown", () => {
	  	if (document.pointerLockElement === document.getElementById("canvas1")) {
			this.spiderman.change_web();
	  		this.play_sound(this.strings[Math.floor(Math.random()*6)]);
	  	} } );
	  document.body.addEventListener( "mouseup", () => {
	  	if (document.pointerLockElement === document.getElementById("canvas1"))
	  	  this.spiderman.change_web();
	  })

	  // JOSH - Implement Minsoo's smooth motion
	  this.movement_directions = { forward: false, backward: false, left: false, right: false };

	  // ================= GLADYS - generate world & buildings statically, since they'll never change.

	  // Initialize game
	  const numCoins = 15;
	  this.coinCounter = new CoinCounter(numCoins);

	  // generate world with inputted size
	  this.worldTransforms = new WorldTransforms(75,50,50,8,numCoins);

	  // now format all world objects for collision manager.

	  // boundaries (NSEW, ground, ceiling)
	  const boundaryTransforms = this.worldTransforms.getTransforms().boundaries;
	  let boundaryShapes = {};
	  for (let boundaryTransformStr in boundaryTransforms) {
	  	const boundaryTransform = boundaryTransforms[boundaryTransformStr];
	  	boundaryShapes[boundaryTransformStr] = {
	  		positions: this.shapes.wall.positions,
	  		transform: boundaryTransform
	  	};
	  }

	  // buildings
	  let buildingShapes = [];
	  const buildingTransforms = this.worldTransforms.getTransforms().buildings;
	  for (let i=0; i<buildingTransforms.length; i++) {
	  	  const buildingTransform = buildingTransforms[i];
		  buildingShapes.push({
		  	positions: this.shapes.building.positions,
		  	transform: buildingTransform
		  });
	  }
	  // while you're at it, generate building objects with random textures
	  this.buildings = [];
	  for (let i=0; i<buildingTransforms.length; i++) {
	  	  const buildingTransform = buildingTransforms[i];
		  const buildingMat = this.materials.buildings[Math.floor(Math.random()*this.materials.buildings.length)];
      	  this.buildings.push(new Building(buildingMat, buildingTransform));
	  }

	  //lampposts
	  let lampShapes = [];
	  const lampTransforms = this.worldTransforms.getTransforms().lampposts;
	  for (let i=0; i<lampTransforms.length; i++) {
	  	const lampTransform = lampTransforms[i];
		lampShapes.push({
			lamppost: {
				positions: this.shapes.lamp.positions,
				transform: lampTransform
			}
		})
	  }

     // People
	  this.people = [];
	  var changer = 5;
	  const peopleTransforms = this.worldTransforms.getTransforms().people;
	  for (let i=4; i<peopleTransforms.length; i+=changer) {
	  	this.people.push(new Person(peopleTransforms[i].times(Mat4.rotation(1.57,[0,1,0])), this.shapes.body, this.shapes.sphere, this.materials.green, this.materials.white, this.materials.black, this.materials.tan));
	  	changer = (changer == 5) ? 2 : 5;
	  }

	  // cars
	  this.cars = [];
	  //var changer = 3;
	  const carTransforms = this.worldTransforms.getTransforms().cars;
	  for (let i=7; i<carTransforms.length - 5; i+=changer) {
	  	this.cars.push(new Car(carTransforms[i], this.shapes.body, this.shapes.wheels, this.materials.blue, this.materials.black, this.materials.white, this.materials.yellow, this.materials.red));
	  	changer = (changer == 3) ? 4 : 3;
	  }
	 var carArray = [];
	 for (let i=0; i<this.cars.length; i++)
	 {
		var position_array = [], node_array = [];
		this.cars[i].get_array(position_array, node_array);
		for(let j=0; j<position_array.length; j++)
		{
			carArray.push(
			{	car:	{ positions: node_array[0].shape.positions, transform: position_array[0] },
				hood:	{ positions: node_array[1].shape.positions, transform: position_array[1] } })
		}
	 }	 

	  // coins
  	  let coinShapes = [];
	  const coinTransforms = this.worldTransforms.getTransforms().coins;
	  for (let i=0; i<coinTransforms.length; i++) {
	  	  const coinTransform = coinTransforms[i];
		  coinShapes.push({
		  	positions: this.shapes.coin.positions,
		  	transform: coinTransform
		  });
	  };

	  // TODO: lampposts, cars, people
	  /*
		note to daniel & justin about how to prepare collisionmanager for your game object. This wont do anything now,
		but collisionmanager will eventually use this info to detect any collisions b/w your game object and something else.

		1) for each game object, prepare a "shapes" Javascript object. e.g. for a person, its shapes object would look like
			  {
                //1st person
                torso: { positions: [], transform: Mat4 }, 
                head: { positions: [], transform: Mat4 },
                ...
              }
          where the {} brackets make it a JS object whose properties are set to "torso" and "head" to represent
          subshapes of the person. Each subshape must have 2 properties. 
          	1. 1st property is "positions", which is the array returned by this.shapes.[person drawable].positions, 
          	where [person drawable] is the shape you use in main-scene to draw the person. 
          	2. 2nd property is "transform", which is the transform matrix of that subshape. Note that this must be
          	a global matrix, i.e. the matrix you'll ultimately call draw on. No local matrices!!
       2) compile the game objects into an array. e.g. for people, the array would look like
		  [ 	
		  	  {
				//1st person
				torso: { positions: [], transform: Mat4 }, 
				head: { positions: [], transform: Mat4 },
				...
			  },
			  { 
				//2nd
				torso: { positions: [], transform: Mat4 }, 
				head: { positions: [], transform: Mat4 } 
				...
			  },
			  ...
		]
	  3) pass this array as the appropriate parameter into CollisionManager's constructor below. Check collision-manager
	  for the details.
	  */
	  
	  this.collisionManager = new CollisionManager(boundaryShapes, buildingShapes, lampShapes, spidermanShape, "body", [], "torso", [], "car", null, coinShapes); 
	  this.spiderman.setCollisionManager( this.collisionManager );


	  // ============= end of static world generation
    }
    play_sound( name, volume = 1 )
	{ if( 0 < this.sounds[ name ].currentTime && this.sounds[ name ].currentTime < .3 ) return;
	  this.sounds[ name ].currentTime = 0;
	  this.sounds[ name ].volume = Math.min(Math.max(volume, 0), 1);;
	  this.sounds[ name ].play();
	}
    make_control_panel()
    { // Takes user input for button presses
        this.key_triggered_button( "Move Forward", [ "w" ], () => this.movement_directions.forward = true, undefined,
        													                          () => this.movement_directions.forward = false );
        this.key_triggered_button( "Move Left", [ "a" ], () => this.movement_directions.left = true, undefined,
        												                         () => this.movement_directions.left = false );
        this.key_triggered_button( "Move Backward", [ "s" ], () => this.movement_directions.backward = true, undefined,
        													                           () => this.movement_directions.backward = false );
        this.key_triggered_button( "Move Right", [ "d" ], () => this.movement_directions.right = true, undefined,
        												                          () => this.movement_directions.right = false );
    	this.key_triggered_button( "Bird's-Eye View", [ "m" ], () => { this.spiderman.camera_toggle_birdseye(); } );
		this.key_triggered_button( "Look forward", ["v"], () => { this.spiderman.camera_look_forward(); } );
		this.key_triggered_button( "Jump", [ " " ], () => { this.spiderman.jump(); } );
		this.key_triggered_button( "Reset position (Go home)", ["h"], () => { 
			this.spiderman.model_transform = Mat4.translation([0,1,0]);
			this.spiderman.reset_position(); } );
    }
    display( graphics_state )
    { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
      const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
     
	  const allWorldTransforms = this.worldTransforms.getTransforms();

	  //draw ground and ceiling
	  const groundTransform = allWorldTransforms.ground;
	  this.shapes.ground.draw( graphics_state, groundTransform, this.materials.ground);
	  const ceilingTransform = allWorldTransforms.ceiling;
	  this.shapes.ground.draw( graphics_state, ceilingTransform, this.materials.sky);

	  //draw walls
	  const wallTransforms = allWorldTransforms.walls;
	  for (let dirString in wallTransforms) {
	  	const transform = wallTransforms[dirString];
	  	this.shapes.wall.draw(graphics_state, transform, this.materials.skyWall);
	  }
	  
	  // draw all buildings
	  for (let i=0; i<this.buildings.length; i++) {
	  	const building = this.buildings[i];
	  	const transform = building.get_transform();
	  	const material = building.get_material();
	  	this.shapes.building.draw( graphics_state, transform, material );
	  	//this.shapes.AABB.draw( graphics_state, transform, this.materials.AABB); //Uncomment to see building AABBs in red
	  }

	  // draw all coins
	  const coinTransforms = allWorldTransforms.coins;
	  for (let i=0; i<coinTransforms.length; i++) {
	  	const transform = coinTransforms[i]
			.times(Mat4.rotation(Math.PI*t/2, Vec.of(0,1,0)))
			.times(Mat4.translation([0,Math.cos(2*t)/4,0]));
	 	this.shapes.coin.draw( graphics_state, transform, this.materials.coin);	
	  }
 	 /*
 	 // For debugging: draw coins' AABBs
	 const coinsAABBs = this.collisionManager.AABBs.coins;
	 for (let i=0; i<coinsAABBs.length; i++) {
	 	this.shapes.AABB.draw( graphics_state, coinsAABBs[i].getTransformMatrix(), this.materials.AABB);
	 }
	 */
	  
     // Draw all people
     var peopleArray = [];
     const peopleTranslateMatrix = Mat4.translation([0,0,-15*dt]);
     for (let i=0; i<this.people.length; i++)
	 	{
	 		var position_array = [], node_array = [];
	 		this.people[i].get_array(position_array, node_array);
	 		for(let j=0; j<position_array.length; j++)
	 		{
	 			node_array[j].shape.draw( graphics_state, position_array[j], node_array[j].color);
	 		}

	 		peopleArray.push(
	 			{	id:		i,
	 				body:   { positions: this.shapes.body.positions,    transform: position_array[0].times(Mat4.translation([0,-1,0]).times(Mat4.scale([1.25,3.5,3.3]))) } })
	 		
	 		// Can add a boolean here to determine if person will move or not
 	 		var tempHolder1 = this.people[i].torso.position.times(peopleTranslateMatrix);
 	 		if (this.collisionManager.tryMovePerson(peopleArray[i], "body"))
 	 			{
					if (this.people[i].move(tempHolder1) >= 100)
						this.people[i].turn_around();
 	 			}
//			this.people[i].move(peopleTranslateMatrix);
	 	}

     // Draw all cars
	 var carArray = [];
	 const carTranslateMatrix = Mat4.translation([0,0,Math.cos(2*(t%(2*Math.PI)))/5]);
	 const wheelRotationMatrix = Mat4.rotation(Math.cos(2*(t%(2*Math.PI)))/10,[0,0,1]);
	 for (let i=0; i<this.cars.length; i++)
	 {
		var position_array = [], node_array = [];
		this.cars[i].get_array(position_array, node_array);
		for(let j=0; j<position_array.length; j++)
		{
			node_array[j].shape.draw( graphics_state, position_array[j], node_array[j].color);
		}

		carArray.push(
			{	id:		i,
				car:	{ positions: node_array[0].shape.positions, transform: position_array[0] },
				hood:	{ positions: node_array[1].shape.positions, transform: position_array[1] } })

		// Can add a boolean here to determine if cars will move or not
		var tempHolder2 = this.cars[i].car.position.times(carTranslateMatrix);
		if (this.collisionManager.tryMoveCar(carArray[i], "car"))
		{
			this.cars[i].move(tempHolder2, wheelRotationMatrix);
// 			if (this.cars[i].move(tempHolder2, wheelRotationMatrix) >= 100)
// 				this.cars[i].turn_around();
		}
//		this.cars[i].move(carTranslateMatrix, wheelRotationMatrix);

	 }	 
	 /*
	 // For debugging: draw peoples' AABBs
	 const peopleAABBs = this.collisionManager.AABBs.people;
	 for (let i=0; i<peopleAABBs.length; i++) {
	 	this.shapes.AABB.draw( graphics_state, peopleAABBs[i].getTransformMatrix(), this.materials.AABB);
	 }
	 */

	  // GLADYS - draw justin's lamppost
	  const lampTransforms = allWorldTransforms.lampposts;
	  for (let i=0; i<lampTransforms.length; i++) {
	  	const currTransform = lampTransforms[i];
	  	this.shapes.lamp.draw( graphics_state, currTransform, this.materials.gray);
	  	//this.shapes.ball.draw(graphics_state,Mat4.identity().times(Mat4.translation([7.5,8,4])).times(Mat4.scale([0.8,0.8,0.8])),this.materials.light);
	  }

	  // JOSH - Use model transform stored in Spiderman object.
	  const spidermanPosMatrix = this.spiderman.model_transform.times(Mat4.scale([.5,1,1]));

	  // Check if Spiderman swings into a building and update contact status accordingly
	  var hitNonBuilding = false;
	  if (!this.spiderman.contact)
		if (this.spiderman.webbed) {
		  let check_collision = {body: {positions: this.shapes.spiderman.positions, transform: spidermanPosMatrix}};
		  let inContact = !this.collisionManager.tryMoveSpiderman(check_collision, "body");
		  if (!this.collisionManager.getBoundaryThatSpidermanJustHit()) 
		  	this.spiderman.change_contact(inContact, "body");
		  else	
		  	this.spiderman.change_web();
		  this.spiderman.change_contact(!this.collisionManager.tryMoveSpiderman(check_collision, "body"));
		}
	  
      // Update Spiderman's transform and draw
	  if (!this.spiderman.camera.inBirdsEye) {
	  	this.spiderman.physics_update();
	  	if (this.spiderman.webbed)
	  		this.shapes.web.draw(graphics_state, spidermanPosMatrix.times(Mat4.translation([0,100,0])).times(Mat4.scale([0.1,100,0.1])),this.materials.pure_white)
	  	this.shapes.spiderman.draw( graphics_state, spidermanPosMatrix, this.materials.tan );
	  }
	  else {
	  	let scale = 1.3+0.25*Math.cos(10*t);
	  	this.shapes.arrow.draw( graphics_state, spidermanPosMatrix.times(Mat4.rotation(Math.PI/2,Vec.of(-1,0,0))).times(Mat4.scale(Vec.of(4,6,6).times(scale))), this.materials.pure_red );
	  	this.shapes.arrow.draw( graphics_state, spidermanPosMatrix.times(Mat4.rotation(Math.PI/2,Vec.of(-1,0,0))).times(Mat4.scale(Vec.of(-4,6,6).times(scale))), this.materials.pure_red );
      }

	  // Update AABB of all dynamic objects (except coins since AABB doesn't need to change much for it)

	  this.collisionManager.regenerateSpidermanAABB({ body: { positions: this.shapes.spiderman.positions, transform: spidermanPosMatrix } }, "body");
	  // Limit # of AABB updates
	  var count = 0;
	  if (count == 0)	
	  {
		this.collisionManager.regenerateCarsAABBs(carArray, "car");
		this.collisionManager.regeneratePeopleAABBs(peopleArray, "body"); 
	 	//this.collisionManager.updatePeopleAABBsWithTranslationMatrix(peopleTranslateMatrix); //Gladys' faster AABB for translations ONLY
	 	 count++;
	  }
	  else if (count == 10)
	  	count = 0;
	  else
	  	count++;

	  // Check input and move Spiderman for the next frame
	  
	  for (let dirString in this.movement_directions) {
		  if (this.movement_directions[dirString]) {
		  	// Can SM move in the direction desired input by the keyboard?
		  	const nextTransform = this.spiderman.simulate_keyboard_move(dirString).times(Mat4.scale([.5,1,1]));
			const nextSpidermanShape = {
				body: { positions: this.shapes.spiderman.positions, transform: nextTransform }
			};
			
        const canMove = this.collisionManager.tryMoveSpiderman(nextSpidermanShape, "body");
			
		    // If hit boundary, highlight it
		    const boundaryTransform = this.collisionManager.getBoundaryThatSpidermanJustHit();
		    if (boundaryTransform != null) {
		  	  this.shapes.boundary.draw( graphics_state, boundaryTransform.times(Mat4.scale([1.01,1.01,1.01])), this.materials.AABB);
		    }
        
        	//if hit coin, remove it and its AABB. Update coin counter display. Generate new coin in untaken cell
			const coinTransform = this.collisionManager.getCoinThatSpidermanJustHit();
			if (coinTransform != null) {
				this.worldTransforms.removeCoinTransform(coinTransform);
				this.collisionManager.removeCoinAABB(coinTransform);
				this.play_sound(this.strings[6]);
				this.coinCounter.incrementCount();
				let newTransform = this.worldTransforms.generateNewCoinTransform();
				this.collisionManager.generateCoinAABB({ positions: this.shapes.coin.positions, transform: newTransform });
			}
        
		    // Move SM appropriately
		    else if (canMove // Regular collisions
				  || this.collisionManager.findBuildingThatSpidermanHits(nextSpidermanShape, "body") ) // Make an exception when SM hits a building
		    {
			  this.spiderman.setNextShape(nextSpidermanShape);
			  this.spiderman.keyboard_move(dirString);	// spiderman.keyboard_move will handle cases where spiderman hits a building
		    }
        
		}
	 }
 }
}