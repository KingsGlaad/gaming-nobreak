import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Imagem é obrigatória para gerar o avatar" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN não está configurado no servidor." },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: apiKey,
    });

    // Usando o modelo SDXL img2img para garantir disponibilidade
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: image, // base64 ou URL
          prompt: "a 3d render of a gamer character, pixar style, vibrant colors, clear face, high quality",
          negative_prompt: "ugly, blurry, deformed, low quality",
          prompt_strength: 0.65, // O quanto deve modificar a foto original
        }
      }
    );

    // O retorno costuma ser um array de URLs das imagens geradas
    const generatedUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ url: generatedUrl });
  } catch (error: any) {
    console.error("Erro ao gerar avatar 3D:", error);
    return NextResponse.json(
      { error: "Falha ao gerar o avatar 3D com a IA" },
      { status: 500 }
    );
  }
}
