# Character Image → Overworld Sprite Sheet

## Purpose

Transform a reference image of a single character or creature into a clean, consistent **4-direction overworld pixel-art sprite sheet** suitable for an early-2000s Japanese handheld creature-collecting RPG.

The input image defines the character's identity.

The output must preserve that identity while simplifying it into a tiny, readable videogame overworld sprite.

This skill is designed to be reusable recursively for many different characters.

***

# INPUT

Required:

* `REFERENCE_IMAGE`: image containing the character to convert.

Optional parameters:

* `OUTPUT_NAME`: character or asset name.
* `BACKGROUND`: `transparent` or `dark_charcoal`.
* `GRID`: defaults to `4x4`.
* `FRAMES_PER_DIRECTION`: defaults to `4`.
* `DIRECTIONS`: defaults to:
  * front
  * back
  * left
  * right

If no optional parameters are provided, use the defaults.

***

# OBJECTIVE

Using the supplied reference image, create a pixel-art overworld sprite sheet of the SAME character.

Do not redesign the character unnecessarily.

Do not reinterpret it as a different creature.

Preserve its most recognizable visual characteristics while adapting proportions and details for very small pixel-art readability.

The final result should feel like an overworld character sprite from an early-2000s Japanese handheld monster-collecting RPG, while remaining an original asset and not copying any existing franchise character.

***

# STEP 1 — ANALYZE CHARACTER IDENTITY

Before generating the sprite sheet, internally identify the character's defining traits.

Extract:

### Silhouette

* overall body shape
* head/body proportion
* limb length
* major appendages
* ears, leaves, horns, tails, hair, wings, etc.

### Face

* eye shape
* eye color
* mouth/expression
* major facial markings

### Palette

Identify approximately:

* primary body color
* secondary body color
* darkest outline/shadow color
* highlight color
* eye colors
* accessory colors

### Signature traits

Identify 3–7 visual characteristics without which the character would stop being recognizable.

Examples:

* one large leaf attached to the head
* oval green body
* amber eyes
* red boots
* curled tail
* oversized ears
* blue scarf

These traits are **identity anchors** and MUST survive the pixel-art conversion.

***

# STEP 2 — SIMPLIFY FOR PIXEL ART

Convert the design into a small overworld sprite.

Use:

* compact chibi proportions
* strong silhouette
* limited palette
* crisp hard-edged pixels
* no antialiasing
* no smooth vector edges
* simplified anatomy
* exaggerated signature traits when necessary for readability
* high contrast between adjacent regions

Small details that cannot survive sprite resolution should be removed.

Identity anchors should instead be slightly exaggerated.

Example:

If the reference character has a distinctive leaf, the leaf should remain clearly visible even if it needs to become proportionally larger.

***

# STEP 3 — SPRITE STYLE

Visual target:

> early-2000s Japanese handheld creature-collecting RPG overworld sprite

Characteristics:

* small chibi overworld proportions
* limited color palette
* approximately 16-bit / 32-bit era visual language
* strong dark pixel outline
* selective highlights
* simple 2–4 tone shading per material
* readable at very small size
* cute but not overly detailed
* compact videogame-map character proportions
* clear directionality
* consistent lighting across every frame

Do NOT reproduce or trace any existing copyrighted character.

Use only the general visual language of handheld overworld pixel art.

***

# STEP 4 — SPRITE SHEET STRUCTURE

Generate exactly:

## 16 frames

Arrange as:

```
FRONT_1   FRONT_2   FRONT_3   FRONT_4
BACK_1    BACK_2    BACK_3    BACK_4
LEFT_1    LEFT_2    LEFT_3    LEFT_4
RIGHT_1   RIGHT_2   RIGHT_3   RIGHT_4

```

This is a strict **4 × 4 grid**.

Every tile must have identical dimensions.

Every sprite must:

* be centered inside its tile
* use the same scale
* have the same baseline
* have equivalent visual mass
* leave sufficient empty space around the character
* never overlap another tile

***

# STEP 5 — WALK CYCLE

Each direction contains four frames.

Use this structure:

### Frame 1

Neutral / idle stance.

### Frame 2

First walking step.

* one leg forward
* opposite arm moves naturally
* body shifts subtly

### Frame 3

Passing / alternate stance.

### Frame 4

Opposite walking step.

The animation should be subtle.

Do NOT radically change:

* facial design
* body size
* accessories
* leaf/hair/tail size
* colors
* proportions

between frames.

The character must look like the same model in all sixteen frames.

***

# STEP 6 — DIRECTIONAL CONSISTENCY

## Front

Show the identifying facial features clearly.

## Back

Correctly remove facial elements that would not be visible.

Preserve:

* body silhouette
* accessories
* hair
* leaf
* ears
* tail
* clothing
* footwear

as appropriate.

Do not draw a front-facing face on the back-facing sprite.

## Left

Produce a believable left-facing profile.

## Right

Produce a believable right-facing profile.

Left and right views should be consistent mirrors of the same physical character unless asymmetrical design elements require differences.

Maintain asymmetry correctly.

Example:

If the character has one leaf tilted toward its left side, its orientation must remain spatially coherent when the character turns.

***

# STEP 7 — PIXEL CONSISTENCY

All frames must share:

* identical palette
* identical outline thickness
* identical sprite scale
* identical lighting direction
* identical anatomy
* identical accessory design
* identical eye color
* identical material treatment

Never allow image generation drift where different frames accidentally create different versions of the character.

Character consistency has higher priority than pose variety.

***

# STEP 8 — BACKGROUND

Default:

```
dark charcoal neutral background

```

Use a flat, non-distracting background similar to a videogame sprite-sheet preview.

Preferred approximate value:

```
#242628

```

If transparent output is supported and `BACKGROUND=transparent`, use real alpha transparency.

Do NOT generate:

* scenery
* floors
* shadows extending outside the sprite
* UI
* text
* logos
* grid labels
* decorative elements

***

# MASTER IMAGE-GENERATION PROMPT

When using an image-generation model capable of reference images, construct the request using the following template.

***

Using the supplied reference image as the character identity source, transform this exact character into a small overworld-style pixel-art videogame sprite.

Preserve the character's defining identity, silhouette, color palette, facial traits, clothing/accessories, and signature visual elements.

The result must look like an original overworld character from an early-2000s Japanese handheld creature-collecting RPG.

Do not copy or reproduce any existing franchise character.

Simplify the reference design for tiny pixel-art readability using compact chibi proportions, crisp hard pixels, a limited palette, dark pixel outlines, high-contrast shading, and clear silhouettes.

Signature features from the reference image must remain immediately recognizable even at small sprite scale.

Create exactly 16 sprites arranged in a perfectly regular 4 × 4 sprite sheet.

Layout:

Row 1:\
front-facing idle/walk animation, 4 frames.

Row 2:\
back-facing idle/walk animation, 4 frames.

Row 3:\
left-facing idle/walk animation, 4 frames.

Row 4:\
right-facing idle/walk animation, 4 frames.

Each row contains:

1. neutral / idle frame
2. first walking step
3. passing / alternate frame
4. opposite walking step

Maintain extremely strong character consistency across all sixteen frames.

The character's:

* proportions
* body shape
* palette
* accessories
* facial design
* signature features
* sprite scale
* outline
* lighting

must stay identical between frames.

Only pose and viewing direction should change.

All sprites must occupy the same approximate bounding box and stand on the same baseline.

Use clean, intentional pixel art rather than a pixelated painting.

Avoid antialiasing, soft edges, painterly gradients, 3D rendering, smooth vector lines, excessive detail, or high-resolution illustration techniques.

Use a restrained retro pixel-art palette and two-to-four shading levels per material.

Every direction must be geometrically plausible.

The back-facing sprite must genuinely show the back of the character rather than displaying front-facing facial features.

Left and right profiles must represent the same character accurately.

Keep all distinctive accessories and asymmetric features spatially coherent as the character rotates.

Place the sixteen sprites evenly on a plain dark-charcoal sprite-sheet background with generous uniform spacing.

No scenery.

No environment.

No UI.

No labels.

No grid numbers.

No logo.

No text.

No watermark.

The finished result should look like a production-ready overworld sprite sheet from a polished handheld JRPG.

***

# NEGATIVE CONSTRAINTS

Explicitly avoid:

* realistic rendering
* painterly rendering
* smooth digital illustration
* 3D models
* vector art
* antialiased lines
* blurred pixels
* inconsistent sprite scales
* random costume changes
* missing accessories
* altered colors
* extra limbs
* duplicated limbs
* incorrect back-facing faces
* inconsistent leaf/hair/tail positions
* characters touching each other
* frames with different resolutions
* uneven spacing
* scenery
* text
* logos
* existing franchise characters

***

# VALIDATION

After generation, inspect the resulting sprite sheet.

The generation PASSES only if all conditions below are satisfied.

## Grid

* exactly 4 columns
* exactly 4 rows
* exactly 16 sprites

## Directions

* row 1 = front
* row 2 = back
* row 3 = left
* row 4 = right

## Identity

The character is recognizably the same as the reference image.

All important identity anchors remain present.

## Consistency

All frames use the same:

* body proportions
* palette
* outfit/accessories
* facial structure
* pixel density
* sprite scale

## Animation

Walking frames show visible but modest pose changes.

## Pixel quality

The result reads as deliberately authored pixel art rather than an illustration with a pixelation filter.

***

# AUTOMATIC RETRY RULE

If one or more validation criteria fail, regenerate the sprite sheet.

Do not silently accept incorrect results.

On regeneration, preserve the reference image and append specific corrections based on the failure.

Example:

```
CORRECTION PASS:

The previous result failed sprite consistency.

Regenerate while preserving the original character reference.

Fix the following:

- use exactly 16 frames
- maintain identical body proportions
- make row 2 genuinely back-facing
- preserve the character's head accessory in every direction
- make all sprites the same size
- preserve the exact same palette
- align all feet to the same baseline

Do not introduce any redesign.

```

Repeat validation after every regeneration.

Maximum recommended retries:

```
3

```

If the third attempt still fails, keep the best result and report which constraints remain imperfect.

***

# RECURSIVE USAGE

This skill must be character-independent.

For every new execution:

1. receive a new `REFERENCE_IMAGE`
2. ignore the identity of previously processed characters
3. analyze the new reference image
4. extract its identity anchors
5. create the sprite sheet
6. validate the result
7. retry if required
8. save/export the final asset
9. proceed to the next input image

Never let visual features from a previously processed character leak into the next character.

Treat every input image as a new character identity.

***

# OPTIONAL OUTPUT FILE NAMING

Use:

```
<character_name>_overworld_spritesheet.png

```

Example:

```
oliver_overworld_spritesheet.png

```

For multiple characters:

```
assets/sprites/overworld/<character_name>_overworld_spritesheet.png

```

***

# OLIVER REFERENCE EXAMPLE

For a character such as Oliver, analysis might produce:

```
Identity anchors:
- anthropomorphic olive-shaped body
- olive-green primary color
- single large green leaf on head
- amber/brown expressive eyes
- happy open mouth
- thin green limbs
- oversized shiny red boots

```

The sprite-generation stage must preserve all seven traits while simplifying them to sprite scale.

The same process must automatically derive equivalent identity anchors for every future reference image.

***

# PRIORITY ORDER

When constraints conflict, use this order:

1. character identity
2. consistency between frames
3. readable silhouette
4. correct direction
5. animation clarity
6. pixel-art authenticity
7. tiny decorative details

Never sacrifice character identity merely to add more detail.

***

# SUCCESS CONDITION

The task is complete when the generated sheet contains sixteen coherent, production-usable overworld sprites that unmistakably represent the character shown in the input reference image and can plausibly be sliced into animation frames by a game engine.
