
import { get } from "@vercel/edge-config";
import AlinkClientContent from "@/components/alink-client-content";

export default async function ALinkPage() {
  const proLink = await get<string>('ancoraLinkProUrl') || "https://pay.hotmart.com/C101007078D";
  const freeLink = await get<string>('video003Url') || "https://www.canva.com/design/DAGuV_Ke75Y/6ZJn2lzCgy4bd4wXorrY_A/view?utm_content=DAGuV_Ke75Y&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview";

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
