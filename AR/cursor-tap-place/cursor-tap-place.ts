import * as ecs from '@8thwall/ecs'  // Import the 8th Wall ECS library

// Register a new ECS component called 'cursor-tap-to-place'
ecs.registerComponent({
  name: 'cursor-tap-place',  // Component name
  schema: {
    cursorEntity: ecs.eid,   // Entity representing the placement cursor
    ground: ecs.eid,         // The ground entity to detect placements
    placedEntity: ecs.eid,   // Entity that will be placed at the selected position

    // @label Cursor Y Height
    yHeight: ecs.f32,  // The height offset for the cursor above the ground

    growOnPlace: ecs.boolean,  // Boolean flag to determine if the placed entity should grow

    // Growth speed setting (only visible if growOnPlace=true)
    // @condition growOnPlace=true
    // @label Grow Speed (milliseconds)
    growSpeed: ecs.i32,

    // Scale settings for final entity size (only visible if growOnPlace=true)
    // @group start Final Scale:vector3
    // @group condition growOnPlace=true
    finalX: ecs.f32,
    finalY: ecs.f32,
    finalZ: ecs.f32,
    // @group end

    // Easing function options for scaling animation (only visible if growOnPlace=true)
    // @enum Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back, Bounce
    // @condition growOnPlace=true
    easingFunction: ecs.string,
  },

  // Default values for the component's schema
  schemaDefaults: {
    growOnPlace: true,            // Default to enabling growth animation
    yHeight: 0,                   // Default cursor height above the ground
    growSpeed: 1000,              // Default animation duration: 1 second
    finalX: 1,
    finalY: 1,
    finalZ: 1,                    // Default final scale (1x original size)
    easingFunction: 'Quadratic',  // Default easing function
  },

  // Data storage for final placement coordinates and rotation
  data: {
    finalPositionX: ecs.f32,
    finalPositionY: ecs.f32,
    finalPositionZ: ecs.f32,
    finalRotationX: ecs.f32,
    finalRotationY: ecs.f32,
    finalRotationZ: ecs.f32,
    finalRotationW: ecs.f32,
  },

  // Define the state machine for controlling object placement logic
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    // Extract relevant schema attributes for easy access
    const {cursorEntity, ground, growSpeed, growOnPlace, placedEntity} = schemaAttribute.get(eid)

    // Store the cursor's smoothed position
    const current = {x: 0, y: 0, z: 0}
    const placeObject = ecs.defineTrigger()  // Event trigger for placing the object

    // Define the 'Active' state where the cursor follows the raycast hit position
    ecs.defineState('Active')
      .initial()  // This is the default starting state
      .onEnter(() => {
        // Make the cursor visible when entering the 'Active' state
        ecs.Hidden.remove(world, cursorEntity)
      })
      .onExit(() => {
        // Hide the cursor when leaving the 'Active' state
        ecs.Hidden.set(world, cursorEntity)
      })
      .onTick(() => {
        // Cast a ray from the camera's position and forward direction using 8th Wall raycaster
        const intersects = world.raycastFrom(eid)

        // Filter results to only include the ground entity
        const groundIntersects = intersects.filter(hit => hit.eid === ground)

        if (groundIntersects.length > 0) {
          // Get the intersection point (where the user intends to place the object)
          const {x, y, z} = groundIntersects[0].point
          const speed = 0.4  // Smoothing factor for cursor movement

          // Smoothly move the cursor towards the intersection point
          current.x += (x - current.x) * speed
          current.y = schemaAttribute.get(eid).yHeight  // Apply user-defined height offset
          current.z += (z - current.z) * speed

          // Update the cursor entity's position
          world.setPosition(cursorEntity, current.x, current.y, current.z)

          // Get the camera's position for cursor orientation
          // Note: This component should be attached to the camera entity for proper functionality
          const cameraPosition = ecs.Position.get(world, eid)

          // Make the cursor face the camera for better visibility
          ecs.LookAtAnimation.set(world, cursorEntity, {
            targetX: cameraPosition.x,
            targetZ: cameraPosition.z,
          })
        }
      })
      // Listen for a screen tap event to place the object at the cursor's position
      .listen(world.events.globalId, ecs.input.SCREEN_TOUCH_START, (e) => {
        // Store the final placement coordinates
        dataAttribute.cursor(eid).finalPositionX = current.x
        dataAttribute.cursor(eid).finalPositionY = current.y
        dataAttribute.cursor(eid).finalPositionZ = current.z

        // Capture the cursor's current rotation for the placed entity
        const cursorRotation = world.transform.getWorldQuaternion(cursorEntity)
        dataAttribute.cursor(eid).finalRotationX = cursorRotation.x
        dataAttribute.cursor(eid).finalRotationY = cursorRotation.y
        dataAttribute.cursor(eid).finalRotationZ = cursorRotation.z
        dataAttribute.cursor(eid).finalRotationW = cursorRotation.w

        // Trigger the 'Placed' state transition
        placeObject.trigger()
      })
      .onTrigger(placeObject, 'Placed')  // Transition to the 'Placed' state when triggered

    // Define the 'Placed' state where the object is positioned and optionally animated
    ecs.defineState('Placed')
      .onEnter(() => {
        // Retrieve stored final placement position and rotation
        const {finalPositionX, finalPositionY, finalPositionZ, finalRotationX, finalRotationY, finalRotationZ, finalRotationW} = dataAttribute.get(eid)

        // Ensure the placed entity exists before setting its position and rotation
        if (placedEntity != null) {
          world.setPosition(placedEntity, finalPositionX, finalPositionY, finalPositionZ)
          world.setQuaternion(placedEntity, finalRotationX, finalRotationY, finalRotationZ, finalRotationW)
        }

        // Make the placed entity visible
        ecs.Hidden.remove(world, schemaAttribute.get(eid).placedEntity)

        // If the growOnPlace flag is enabled, animate the entity's scale
        if (growOnPlace) {
          const {finalX, finalY, finalZ, easingFunction} = schemaAttribute.get(eid)
          world.time.setTimeout(() => {
            ecs.ScaleAnimation.set(world, eid, {
              target: placedEntity,  // Target entity to scale
              loop: false,           // Only play animation once
              duration: growSpeed,   // Set animation duration
              easeOut: true,         // Use ease-out effect
              easingFunction,        // Use selected easing function
              fromX: 0,
              fromY: 0,
              fromZ: 0,              // Start scale (invisible)
              toX: finalX,           // Final scale X
              toY: finalY,           // Final scale Y
              toZ: finalZ,           // Final scale Z
            })
          }, 200)                    // Small delay before scaling begins
        }
      })
      .onExit(() => {
        // Hide the placed entity when leaving this state
        ecs.Hidden.set(world, placedEntity)
      })
  },
})
