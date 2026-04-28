export const TEMPLATE_PROMPTS: Record<string, string> = {

  // ===== カテゴリA：おすすめ =====

  studio_purple:
    "Change the background to a vibrant purple solid color backdrop (deep violet, rich saturation, slight gradient from top to bottom for depth). Place a single minimalist white ceramic coffee cup with saucer beside the subject on a clean white surface. The lighting is bright editorial studio lighting with soft shadows. Shot on Hasselblad medium format with 80mm lens, f/4, sharp focus, magazine cover aesthetic, Korean pet studio style. Conceptual portrait, color blocking composition, modern fashion photography, Vogue-quality production.",
  studio_tropical:
    "Change the background to a turquoise blue painted wall with a large silver disco ball hanging from above. Surround the subject with abundant fresh palm leaves on both sides, golden sun-ray pattern radiating behind, two pink plastic flamingo decorations, and a yellow shaggy rug beneath. Bright vibrant tropical lighting, joyful summer atmosphere. Shot on medium format with 50mm lens, f/2.8, editorial color photography, Wes Anderson meets Miami beach club aesthetic, saturated colors but balanced composition.",
  studio_neon:
    "Change the background to a lush vertical garden wall covered in artificial green boxwood hedge with hanging pink wisteria and tropical plants. Above the subject, a glowing yellow neon sign in cursive script reading romantic words. The subject sits on a rich teak wood bench. Warm neon glow mixed with daylight, cafe-courtyard vibe, Bali villa meets LA aesthetic. Shot on Sony A7 with 35mm lens, f/2, golden hour ambient lighting, Instagram-worthy boutique pet cafe photography.",
  studio_artwall:
    "Change the background to a hand-painted abstract mural wall with bold organic shapes in sage green and dusty pink (large rounded blob shapes, retro flat color illustration style). Modern minimalist composition, plenty of empty wall space. Subject sits in front, soft daylight from the side. Shot on Fujifilm X-T5 with 23mm lens, f/2.8, editorial flat-lay-meets-portrait style, Apartamento magazine aesthetic, Scandinavian-Korean modern interior photography.",

  // ===== カテゴリB：スタジオ =====

  studio_pinksalon:
    "Change the background to a dreamy pastel pink pet grooming salon scene rendered in soft 3D-like quality: pink arched walls, an oval mirror on the back wall, a pink leather barber chair, pink shelves with mint and white grooming products, brushes in a glass cup, soft pink overall lighting. Cute, whimsical, slightly surreal atmosphere like a Pixar animation still. Shot in editorial product photography style, soft diffused lighting, hyper-clean composition, modern beauty salon aesthetic.",
  studio_minimal:
    "Change the background to a pure white seamless studio backdrop, completely clean and minimal. Add a single elegant element beside the subject: a small white ceramic vase with a single white flower, or a simple white modern stool. Bright soft studio lighting from the front, gentle shadow beneath the subject. Shot on Hasselblad H6D with 100mm lens, f/5.6, perfect exposure, fashion editorial minimalism, Jil Sander campaign aesthetic, museum-quality portrait photography.",
  studio_powderblue:
    "Change the background to a soft powder blue solid color backdrop (pale baby blue, slight gradient). Place a single small minimalist prop beside the subject: a vintage white teacup, or a small bouquet of white baby's breath flowers. Bright airy studio lighting with soft shadows. Shot on Phase One with 80mm lens, f/4, dreamy yet sharp portrait, Kinfolk magazine aesthetic, Scandinavian editorial photography, calm and refined mood.",
  studio_midcentury:
    "Change the background to a stylish mid-century modern interior: warm beige wall with a single piece of abstract geometric art (Bauhaus inspired, terracotta and mustard tones), a vintage walnut wood side table, a small ceramic table lamp with a brass base, a few hardcover design books stacked nearby. Warm golden afternoon light streaming from the side, casting soft shadows. Shot on Leica M11 with 50mm Summilux lens, f/2, Wes Anderson meets Architectural Digest aesthetic, refined and sophisticated mood, editorial home interior photography.",

  // ===== カテゴリC：記念日 =====

  event_xmasmodern:
    "Change the background to a bold modern Christmas scene: deep forest green wall as backdrop, abundant fuchsia pink and silver disco-ball ornaments arranged on a white snow-textured floor, a hot pink mirror-tile Christmas tree on the side, a vintage garland of colorful retro Christmas ornaments hanging across the top of the frame (including pink trees, glass beads, candy decorations). Warm fairy lights bokeh in the background. Shot on Canon R5 with 50mm lens, f/2.5, editorial holiday photography, magazine spread aesthetic, modern playful Christmas, Anna Sui meets Vogue holiday issue.",
  event_xmasclassic:
    "Change the background to a beautifully decorated traditional Christmas tree scene: a tall lush evergreen tree with frosted snow-tipped branches, golden and red glass ornaments, twinkling warm white fairy lights, a few oversized golden Christmas baubles on a white faux-fur rug at the base. Warm cozy ambient lighting, candle glow tones, Christmas morning atmosphere. Shot on Sony A7R IV with 85mm lens, f/1.8, dreamy bokeh, Hallmark holiday card aesthetic with editorial quality, nostalgic and heartwarming mood.",
  event_valentine:
    "Change the background to a romantic Valentine's Day setup: soft blush pink seamless backdrop, scattered red and pink rose petals on a white surface, a few oversized red heart-shaped balloons floating gently above, a small white ceramic vase with fresh red roses and baby's breath nearby, soft pink ribbons. Dreamy diffused lighting with a slight dreamy haze. Shot on medium format with 105mm lens, f/2.8, editorial Valentine's Day photography, Vogue magazine February issue aesthetic, romantic yet refined.",
  event_birthday:
    "Change the background to a joyful birthday celebration scene: a soft pastel mint and lavender wall, a colorful tassel garland hanging across the top (mint, blush pink, gold, lavender), a 2-tier white frosted birthday cake with thin candles on a wooden cake stand to the side, a few helium balloons in pastel pink, mint, and gold floating, scattered confetti on the floor. Bright joyful lighting, festive but refined atmosphere. Shot on Fujifilm GFX with 63mm lens, f/2.8, editorial party photography, Kinfolk meets Pinterest birthday styling, happy and elegant.",
};

export const PRESERVE_INSTRUCTION =
  "Keep the subject (dog, cat, or child) in the exact same position, scale, pose, facial expression, colors and markings, clothing and accessories, exactly as they appear in the input photo. Do not change the subject's features in any way.";

export function buildFullPrompt(templateId: string): string {
  const templatePrompt = TEMPLATE_PROMPTS[templateId];
  if (!templatePrompt) {
    throw new Error(`Template not found: ${templateId}`);
  }
  return `${templatePrompt} ${PRESERVE_INSTRUCTION}`;
}
