export const TEMPLATE_PROMPTS: Record<string, string> = {
  studio_01:
    "Change the background to an elegant flower-filled dressing room with flowing white sheer curtains, bright yellow marigold wreaths, an antique wooden vanity with mirror, soft morning sunlight filtering through. Photographic style, magazine quality.",
  studio_02:
    "Change the background to a pastel birthday party studio with colorful balloons in mint green, lavender, soft pink and pale yellow, a tiered cupcake stand, dreamy bokeh lighting. Photographic style, soft studio lighting.",
  studio_03:
    "Change the background to a fresh spring outdoor scene with pastel cherry blossoms, soft warm sunlight, gentle bokeh, pastel colors. Photographic style, cheerful and bright.",
  studio_04:
    "Change the background to a lush flower wall arch filled with pink peonies, blue hydrangeas, yellow daisies and purple roses, fresh green grass on the floor, bright cheerful daylight. Photographic style, vibrant colors.",
  studio_05:
    "Change the background to a cinematic portrait studio with deep moody lighting, soft flowing white drapery, scattered dried flowers and eucalyptus, dramatic chiaroscuro lighting like a fashion magazine cover. Photographic style, editorial quality.",
  studio_06:
    "Change the background to an elaborate vintage studio scene with deep forest green velvet drapery, an antique carved wooden cabinet, vintage globe and old leather-bound books, abundant fresh yellow lemons arranged in decorative piles, yellow forsythia and white daisies in ceramic vases, wooden parquet floor. Rich warm interior lighting, photographic fine-art portrait style, magazine editorial quality.",
  jp_01:
    "Change the background to a traditional Japanese shrine setting during autumn shichi-go-san celebration: vermillion red torii gates, golden ginkgo leaves scattered on stone pathways, traditional lanterns, soft warm afternoon sunlight, blurred autumn bokeh. Photographic style, magazine quality, warm cinematic tones.",
  jp_03:
    "Change the background to a magnificent cherry blossom scene in full bloom, pink sakura petals falling gently, soft natural spring sunlight, dreamy bokeh of blossoms, pastel pink and blue sky. Photographic style, ethereal atmosphere.",
  jp_06:
    "Change the background to a Japanese summer festival scene at twilight: red paper lanterns glowing warmly, wooden festival stalls blurred in background, fireworks in the night sky, warm summer evening atmosphere. Photographic style, cinematic warm tones.",
  jp_08:
    "Change the background to a traditional Japanese new year scene: a shrine gate in soft morning light, stacked kagamimochi decorations, pine and bamboo arrangements (kadomatsu), subtle snow on rooftops, warm lanterns. Photographic style, serene traditional atmosphere.",
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
