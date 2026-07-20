# Visual Vertical Slice

## Goal

Version 1 is a local visual test for the 2.5D battle presentation. It deliberately validates composition, movement, and feedback before combat rules or Web3 work.

## Current Scene

- The arena renders at its native 1672x941 logical size inside a full-browser letterboxed canvas frame.
- The purple player mage holds the left side of the arena.
- The red mage holds the right side on the same ground line at a comparable visual scale.
- `ArrowRight` is the only active move and plays the player medium attack.
- `ArrowLeft`, `ArrowDown`, and `ArrowUp` report Small Attack, Shield, and Big Attack as coming soon.
- The upper HUD includes a Fullscreen button that enters browser fullscreen for the battle stage.
- Inputs are ignored while the medium sequence is active.
- The hit presents a floating 25 damage label, reduces health, and spends its matching mana cost.
- After the player recovers, the demon automatically charges and drops a meteor on the player for a presentation-only 50 damage hit.
- Both combatants display 100-point health and mana bars above the arena.
- Zero health displays defeated art and a large result label before the conclusion page opens.

## Scene Timeline

1. Both mages idle with a small vertical breathing loop.
2. ArrowRight swaps the player to the cast pose and begins the charge beat.
3. Purple cast glow, ground glow, arena tint, slight scale increase, and camera reframe build together.
4. The medium projectile launches from the player cast anchor as a layered plasma blast with an inner beam, outer ribbon, and trailing motes.
5. The projectile reaches the enemy hit anchor.
6. Enemy recoil, impact flash, sparks, 25 damage label, and camera shake play together.
7. The demon charges, the meteor falls from above, then disappears on impact as a procedural orange explosion, player recoil, 50 damage label, and heavy camera shake play together.
8. The scene restores position, opacity, scale, tint, camera, and idle art before accepting another cast.

## Runtime Objects

| Object               | Type   | Responsibility                                                   |
| -------------------- | ------ | ---------------------------------------------------------------- |
| Arena                | actor  | Draws the fixed dungeon artwork                                  |
| Player mage          | actor  | Swaps idle and cast art and provides the cast-side composition   |
| Enemy mage           | actor  | Displays the right-background opponent and recoil response       |
| Projectile           | actor  | Carries the supplied medium spell from cast anchor to hit anchor |
| Presentation effects | actors | Draws glow, arena tint, impact, sparks, and damage label         |
| Battle scene         | scene  | Owns the elapsed-time visual sequence and camera restoration     |

## 2.5D Translation

The supplied images remain flat artwork. The scene uses equal-ground side-by-side staging, ground shadows, spell-colored lighting overlays, and layered projectile effects. It does not rotate the art, crop either mage during a cast, or claim to create a true over-the-shoulder camera angle.

## Acceptance Criteria

- It runs in a browser without a wallet, backend, or testnet dependency.
- Both transparent mage assets composite cleanly over the arena.
- The player attack reads from left to right and terminates at the enemy rather than the image center by accident.
- Cast and impact effects use the purple spell palette consistently.
- The enemy recoil and 25 label are readable without a health system.
- Repeated inputs do not stack projectile or effect actors.

## Review Questions

1. Is the player-left, enemy-right composition readable at the test display size?
2. Does the foreground player scale create enough depth without hiding the arena?
3. Does the camera movement feel cinematic rather than like an arbitrary zoom?
4. Is the medium impact satisfying without additional visual noise?
5. Does the next iteration need angle-specific art, or is this reframing sufficient?

## Next Step

After local review, add only the next approved move or feedback improvement. Health, turns, enemy attacks, shielding, and Web3 connections remain separate later milestones.

## Sources

- [Excalibur scenes](https://excaliburjs.com/docs/scenes/)
- [Excalibur graphics](https://excaliburjs.com/docs/graphics/)
- [Excalibur cameras](https://excaliburjs.com/docs/cameras)
