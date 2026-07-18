# 2.5D Presentation

## Definition

The game uses a 2.5D presentation, not 3D gameplay.

- Characters are 2D images.
- Version 1 uses one fixed 2D arena image plus 2D characters and spell art.
- Cast, projectile, impact, and damage feedback use 2D graphics and image actors.
- Camera reframing, relative character scale, lighting overlays, shadows, and foreground-background placement create perceived depth.

No runtime 3D meshes, 3D camera orbit, skeletal 3D rigs, or physics-based destruction are required for the first iteration.

## Required Camera Framings

### Normal Battle View

```text
Player: left side
Enemy: right side on the same ground line
Both actors visible
Wide arena composition
Foreground visible but non-obscuring
```

This is the resting composition. It must be easy to read at a glance and leave safe space for future Svelte HUD elements.

### Player Attack View

```text
Both mages remain visible at comparable scale during the cast
Projectile moves from left to right toward the enemy chest anchor
The camera remains in the complete arena framing
The arena receives a restrained purple tint
The impact uses a short shake and a floating damage label
```

This is a cinematic reframe, not a different 3D viewpoint. It uses the supplied player cast image and restores the normal view before the next input.

## Layer Stack

Version 1 renders these layers from back to front:

1. Primary combat arena.
2. Mage shadows.
3. Enemy and player mages.
4. Cast glow, projectile, impact glow, and sparks.
5. Full-screen purple tint.

Use z-order and independently positioned actors or graphics. Every layer must have one owner in the scene so its parallax behavior is predictable.

## Parallax Contract

Parallax is deferred because the current arena is one opaque image. The camera movement is intentionally small so it does not reveal empty background edges.

```text
foreground: largest offset
arena: medium offset
distant structures: small offset
sky: minimal offset
```

When separated foreground and distant layers arrive, store their offsets as named configuration values instead of placing them directly in attack timing code.

## Depth Cues

Use coordinated, low-cost effects rather than actual geometry:

- Keep both side-by-side mages in the frame throughout the attack.
- Add separated foreground layers only after the art supports independent movement.
- Add a restrained spell-color tint during the wind-up.
- Use an actor shadow beneath each mage.
- Add a ground glow matching the spell color.
- Use a small number of procedural sparks at impact.
- Add short camera shake at impact only.
- Return every temporary effect to baseline before the next attack.

Depth-of-field blur, fog, and parallax are deferred. First validate the composition with tint, scale, shadows, and camera reframe. If blur is added later, keep it subtle and test mobile performance.

## Lighting Contract

Spell lighting is coordinated color, not physically simulated light.

For every spell define:

```text
spell color
caster tint
ground-glow tint
fog tint
target rim-light tint
impact-flash tint
```

The same palette should drive the projectile, the casting effect, and the impact. This is more important to the perceived quality than complex light simulation.

## Perspective Rules

- Use character art rendered from a matching three-quarter viewpoint.
- Keep the foot anchor on the same arena plane for both mages.
- Match character scale to the background perspective.
- Do not mix a side-profile mage with a low cinematic background.
- Do not claim the camera has orbited an actor unless a separate angle asset actually exists.

## Two Asset Strategies

### Reframing With One Asset Set

Use one battle-view pose per state and create emphasis through scale, position, cropping, overlays, and parallax.

Benefits:

- Lowest asset count.
- Fastest route to a local prototype.
- Sufficient for the first visual slice.

Limit:

- It is a cinematic reframe, not a genuine camera-angle change.

### Swapping To Angle-Specific Assets

Use separate illustrated assets, such as:

```text
enemy-battle-view
enemy-attack-front
player-battle-view
player-defence-close
```

Benefits:

- Stronger perspective change.
- More convincing attack and defense close-ups.

Cost:

- More art generation and consistency work.
- More animation state and asset loading rules.

The first visual slice uses reframing with one asset set unless angle-specific art is supplied before implementation.

## Sources

- [Excalibur cameras](https://excaliburjs.com/docs/cameras)
- [Excalibur camera API](https://excaliburjs.com/api/class/Camera)
- [Excalibur graphics](https://excaliburjs.com/docs/graphics)
- [Excalibur particles](https://excaliburjs.com/docs/particles/)
- [Excalibur graphics context](https://excaliburjs.com/docs/graphics-context)
