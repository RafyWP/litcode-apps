
import { get } from "@vercel/edge-config";
import AlinkClientContent from "@/components/alink-client-content";

export default async function ALinkPage() {
  const defaultProLink = "https://pay.hotmart.com/C101007078D";
  const defaultFreeLink = "https://www.canva.com/design/DAGuV_Ke75Y/6ZJn2lzCgy4bd4wXorrY_A/view?utm_content=DAGuV_Ke75Y&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview";

  let proLink = defaultProLink;
  let freeLink = defaultFreeLink;

  try {
    const [proLinkResult, freeLinkResult] = await Promise.all([
      get<string>('ancoraLinkProUrl'),
      get<string>('video003Url')
    ]);
    proLink = proLinkResult || defaultProLink;
    freeLink = freeLinkResult || defaultFreeLink;
  } catch (error) {
    // Fail gracefully if Edge Config is not available (e.g., in local development)
    // The default links will be used.
  }

  return (
    <>
      <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center w-full">
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary">
            VENDA TUDO, EM TODO LUGAR
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold mt-2">Âncora Link <span className="text-accent">PRO</span></h1>
          <p className="text-muted-foreground mt-4 md:text-base">
              Venda infoprodutos, mentorias e achadinhos inserindo Links Clicáveis dentro dos vídeos. <br className="hidden md:inline" />
              Transforme seu TikTok em uma Loja Completa, sem depender do TikTok Shop.
          </p>
          <AlinkClientContent proLink={proLink} freeLink={freeLink} />
        </div>
      </div>
    </>
  );
}
