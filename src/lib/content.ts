import portaria from "@/assets/portaria.jpg.asset.json";
import pavimentacao from "@/assets/pavimentacao.jpg.asset.json";
import sinalizacao from "@/assets/sinalizacao.jpg.asset.json";
import manta from "@/assets/manta.jpg.asset.json";
import laje from "@/assets/laje.jpg.asset.json";
import rampa from "@/assets/rampa.jpg.asset.json";
import corrimao from "@/assets/corrimao.jpg.asset.json";
import areacomum from "@/assets/areacomum.jpg.asset.json";
import caixa from "@/assets/caixa.jpg.asset.json";
import tubulacao from "@/assets/tubulacao.jpg.asset.json";
import revestimento from "@/assets/revestimento.jpg.asset.json";
import acabamento from "@/assets/acabamento.jpg.asset.json";
import areaMolhada from "@/assets/area-molhada.jpg.asset.json";
import preparo from "@/assets/preparo-area-molhada.jpg.asset.json";
import imper from "@/assets/impermeabilizacao.jpg.asset.json";

export const WHATSAPP = "5561994498778";
export const WHATSAPP_DISPLAY = "(61) 99449-8778";

export type Kind = "externas" | "impermeabilizacao" | "infraestrutura" | "acabamentos";
export const FILTERS: { id: "todas" | Kind; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "externas", label: "Áreas externas" },
  { id: "impermeabilizacao", label: "Impermeabilização" },
  { id: "infraestrutura", label: "Infraestrutura" },
  { id: "acabamentos", label: "Acabamentos" },
];

export const PROJECTS: { id: string; title: string; category: string; kind: Kind; photos: { src: string; alt: string }[] }[] = [
  { id: "portaria", title: "Portaria e pavimentação", category: "Áreas externas", kind: "externas", photos: [
    { src: portaria.url, alt: "Portaria de condomínio com sinalização de acesso" },
    { src: pavimentacao.url, alt: "Pavimentação e faixas de travessia na entrada do condomínio" },
    { src: sinalizacao.url, alt: "Piso e demarcação em área externa de edifício" } ] },
  { id: "impermeabilizacao", title: "Impermeabilização de lajes", category: "Proteção contra umidade", kind: "impermeabilizacao", photos: [
    { src: manta.url, alt: "Equipe trabalhando na aplicação de manta em uma laje" },
    { src: laje.url, alt: "Manta impermeabilizante instalada em uma cobertura" } ] },
  { id: "acessibilidade", title: "Acessos e áreas comuns", category: "Reformas", kind: "externas", photos: [
    { src: rampa.url, alt: "Acesso em rampa com área verde ao lado" },
    { src: corrimao.url, alt: "Lateral da rampa e proteção do acesso" },
    { src: areacomum.url, alt: "Equipe e equipamentos em área comum em obra" } ] },
  { id: "infraestrutura", title: "Infraestrutura hidráulica", category: "Infraestrutura", kind: "infraestrutura", photos: [
    { src: caixa.url, alt: "Estrutura em alvenaria com tubulação em seu interior" },
    { src: tubulacao.url, alt: "Tubulação instalada em uma vala no canteiro" } ] },
  { id: "revestimento", title: "Pisos e revestimentos", category: "Acabamentos", kind: "acabamentos", photos: [
    { src: revestimento.url, alt: "Piso assentado em ambiente interno" },
    { src: acabamento.url, alt: "Assentamento de revestimento em área molhada" } ] },
  { id: "areas-molhadas", title: "Impermeabilização interna", category: "Áreas molhadas", kind: "impermeabilizacao", photos: [
    { src: areaMolhada.url, alt: "Equipe executando uma etapa de impermeabilização em área interna" },
    { src: preparo.url, alt: "Preparação da superfície para impermeabilização em área molhada" },
    { src: imper.url, alt: "Aplicação de manta em ambiente interno" } ] },
];

export function whatsappLink(msg: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
