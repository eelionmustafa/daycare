import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * "Pyet Mësimin Kreativ" — a friendly digital receptionist for new visitors.
 * With an AI key configured it answers via a live model; without one it
 * falls back to a curated knowledge base, so the widget always works.
 * It never discusses prices — families are invited to call instead.
 */
export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Mesazh i zbrazët." }, { status: 400 });
  }
  const trimmed = messages.slice(-10).map((m) => ({
    role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
    content: String(m.content).slice(0, 1000),
  }));

  const s = await getSettings();
  const facts = `
Emri: ${s.site_name} — ${s.tagline}.
Moshat: ${s.ages}.
Adresa: ${s.address}.
Telefoni: ${s.phone}.
Email: ${s.email}.
Orari: ${s.hours}.
Facebook: ${s.facebook_url}.
Regjistrimi bëhet online në faqen /regjistrohu ose me telefon.
Si duket dita: nga ora 07:00 deri 12:30 fëmijët bëjnë detyrat e shtëpisë, përgatiten për teste në lëndë të ndryshme, bëjnë aktivitete kreative, dalin në park e natyrë dhe festojnë festat zyrtare; hanë mëngjes dhe drekë para se të shkojnë në shkollë. Në orën 13:00 mësueset i dërgojnë vetë fëmijët në shkollë. Pas orarit shkollor, mësueset i marrin nga shkolla dhe i kthejnë te qendra, ku presin deri sa vijnë prindërit, më së largu deri në 17:30.
Ofrohen edhe orë shtesë si kurse për fëmijët që kanë nevojë për ndihmë shtesë me mësimet, pas orarit shkollor.
Prezenca mbahet çdo ditë nga stafi dhe prindërit e shohin në portalin e prindërve.
Pagesat: faturat shfaqen në portalin e prindërve; pranohen pagesa në qendër ose me bankë.`;

  const gatewayKey = process.env.AI_GATEWAY_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (gatewayKey || anthropicKey) {
    const system = `Ti je "Pyet Mësimin Kreativ", recepsionistja digjitale e ngrohtë e qendrës ditore Mësimi Kreativ. Përgjigju shkurt (2-4 fjali), ngrohtësisht dhe natyrshëm në gjuhën që të shkruan vizitori (zakonisht shqip). Përdor vetëm këto fakte:
${facts}
Rregulla të rëndësishme:
- KURRË mos përmend çmime, tarifa apo shuma parash. Nëse pyesin për çmime, thuaj me mirësjellje se për detajet e pagesës është më mirë të flasin direkt me qendrën në ${s.phone}.
- Mos shpik fakte. Nëse nuk e di përgjigjen, sugjero të kontaktojnë në ${s.phone} ose ${s.email}.
- Fto vizitorët të regjistrohen online ose të vijnë për një vizitë.`;

    try {
      if (gatewayKey) {
        const res = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${gatewayKey}`,
          },
          body: JSON.stringify({
            model: "anthropic/claude-haiku-4-5",
            max_tokens: 400,
            messages: [{ role: "system", content: system }, ...trimmed],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } else if (anthropicKey) {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 400,
            system,
            messages: trimmed,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data.content?.[0]?.text;
          if (reply) return NextResponse.json({ reply });
        }
      }
    } catch {
      // fall through to the knowledge base
    }
  }

  const lastUser = [...trimmed].reverse().find((m) => m.role === "user")?.content ?? "";
  return NextResponse.json({ reply: answerFromKnowledgeBase(lastUser, s) });
}

function answerFromKnowledgeBase(q: string, s: Record<string, string>): string {
  const t = q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has("cmim", "pages", "kushton", "price", "cost", "tarif", "sa eshte", "euro")) {
    return `Për detajet rreth pagesave ju lutemi na kontaktoni direkt në ${s.phone} — do t'ju sqarojmë gjithçka me kënaqësi dhe pa asnjë obligim.`;
  }
  if (has("regjistr", "enroll", "aplik", "anetar", "pranoni femij")) {
    return `Regjistrimi është shumë i thjeshtë! Plotësoni formularin online te faqja "Regjistro fëmijën" dhe ne ju kontaktojmë brenda ditës. Nëse preferoni, mund të na telefononi në ${s.phone} ose të vini për një vizitë — fëmijët tuaj janë të mirëseardhur ta shohin qendrën para se të vendosni.`;
  }
  if (has("mosh", "vjec", "age", "sa vjet")) {
    return `Ne presim fëmijë të moshës ${s.ages} — pra fëmijë të shkollës fillore. Nëse fëmija juaj është afër këtyre moshave, na shkruani ose telefononi në ${s.phone} dhe e shohim bashkë.`;
  }
  if (has("orar", "ora", "hours", "hapur", "mbyllur", "kur punoni")) {
    return `Jemi të hapur ${s.hours}. Nga 07:00 deri 12:30 fëmijët bëjnë detyra, përgatiten për teste, bëjnë aktivitete dhe dalin në park; hanë mëngjes e drekë; në 13:00 mësueset i dërgojnë në shkollë, e pas shkollës i marrin përsëri dhe presin te qendra deri sa vijnë prindërit, më së largu deri 17:30.`;
  }
  if (has("shkoll", "transport", "shoqer", "kush i merr")) {
    return `Mësueset tona i shoqërojnë vetë fëmijët në shkollë në orën 13:00, dhe po ato i marrin pas mbarimit të orarit shkollor për t'i kthyer te qendra.`;
  }
  if (has("kurs", "ndihm shtes", "vështirës", "teste", "provim")) {
    return `Për fëmijët që kanë nevojë për më shumë kohë me një lëndë, ofrojmë orë shtesë si kurse, pas orarit shkollor. Na kontaktoni në ${s.phone} për të biseduar për rastin e fëmijës suaj.`;
  }
  if (has("ku ndodheni", "adres", "lokacion", "vendndodh", "where", "location", "ku jeni", "gjej")) {
    return `Na gjeni në: ${s.address}. Në faqen e kontaktit kemi edhe hartën. Ejani për një vizitë. Ju presim!`;
  }
  if (has("kontakt", "telefon", "email", "contact", "thirr")) {
    return `Na kontaktoni kur të doni: në telefonin ${s.phone} ose me email në ${s.email}. Përgjigjemi gjatë orarit ${s.hours}.`;
  }
  if (has("aktivitet", "activities", "cfare bejne", "program", "detyr", "mesim", "lexim")) {
    return `Dita te ne është plot: detyrat e shtëpisë, përgatitje për teste, aktivitete kreative, dalje në park e natyrë dhe festimi i festave zyrtare — para se fëmijët të shkojnë në shkollë në orën 13:00. Shikoni galerinë tonë — fotot tregojnë më shumë se fjalët!`;
  }
  if (has("prezenc", "attendance", "mungoi", "vijueshm")) {
    return `Prezencën e mban stafi ynë çdo ditë me listë të thjeshtë, dhe ju si prind e shihni historikun në portalin e prindërve në çdo moment.`;
  }
  if (has("siguri", "safe", "kujdes")) {
    return `Siguria është gjëja e parë te ne: stafi ynë i njeh fëmijët me emër, prezenca mbahet çdo ditë dhe prindërit njoftohen për çdo gjë të rëndësishme. Ejani për një vizitë dhe shihni vetë ambientin.`;
  }
  if (has("faleminderit", "flm", "thank")) {
    return `S'ka përse! Jemi këtu për çdo pyetje tjetër. Ju presim me kënaqësi te Mësimi Kreativ!`;
  }
  if (has("pershendetje", "tung", "hello", "hi", "ckemi", "mire")) {
    return `Përshëndetje dhe mirë se vini! Unë jam asistentja e Mësimit Kreativ. Më pyesni për orarin, moshat, aktivitetet, regjistrimin apo si të na gjeni.`;
  }
  return `Pyetje e mirë! Për t'ju përgjigjur saktë, më së miri na kontaktoni direkt në ${s.phone} ose ${s.email}. Ndërkohë mund t'ju tregoj për orarin, moshat, aktivitetet ose si bëhet regjistrimi — çfarë ju intereson?`;
}
