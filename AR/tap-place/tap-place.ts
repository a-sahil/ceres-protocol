import * as ecs from '@8thwall/ecs'

ecs.registerComponent({
  name: 'Tap Place',
  schema: {
    prefabToSpawn: ecs.eid,
    minScale: ecs.f32,
    maxScale: ecs.f32,
  },
  schemaDefaults: {
    minScale: 1.0,
    maxScale: 3.0,
  },
  data: {
  },
  stateMachine: ({world, eid, schemaAttribute, dataAttribute}) => {
    const toCooldown = ecs.defineTrigger()

    ecs.defineState('default')
      .initial()
      .listen(eid, ecs.input.SCREEN_TOUCH_START, (e) => {
        const {prefabToSpawn, minScale, maxScale} = schemaAttribute.get(eid)

        if (prefabToSpawn) {
          const {worldPosition} = e.data as any
          const newInstance = world.createEntity(prefabToSpawn)
          const randomScale = Math.random() * (maxScale - minScale) + minScale

          ecs.Position.set(world, newInstance, worldPosition)
          ecs.ScaleAnimation.set(world, newInstance, {
            fromX: 0,
            fromY: 0,
            fromZ: 0,
            toX: randomScale,
            toY: randomScale,
            toZ: randomScale,
            duration: 400,
            loop: false,
            easeOut: true,
            easingFunction: 'Quadratic',
          })

          toCooldown.trigger()
        } else {
          console.error('Couldn\'t create an instance. Did you forget to set prefabToSpawn in the properties?')
        }
      })
      .onTrigger(toCooldown, 'cooldown')

    ecs.defineState('cooldown')
      .wait(500, 'default')
  },
})
