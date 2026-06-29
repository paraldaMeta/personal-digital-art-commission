/* Personal Digital Art Commission standalone page */
(function(root){
"use strict";

const ASSETS = {
  hero: "assets/art-commission/hero.jpg",
  footer: "assets/art-commission/footer.jpg"
};

const PACKAGES = [
  {
    key: "small",
    label: "灵河小像",
    price: 88,
    tag: "头像 / 单人",
    bullets: ["1 张精修数字小像", "紫金灵性头像构图", "适合社交头像与名片"]
  },
  {
    key: "scroll",
    label: "万象绘卷",
    price: 288,
    tag: "推荐",
    bullets: ["完整人物与场景设计", "莲花、云气、法器细节", "适合礼物、封面与展示"]
  },
  {
    key: "body",
    label: "本体显影",
    price: 588,
    tag: "全身 / 高细节",
    bullets: ["全身人物与法相氛围", "多轮方案微调", "适合品牌视觉与收藏"]
  }
];

const OPTION_SETS = {
  style: [
    ["immortal", "仙侠紫金"],
    ["lotus", "莲华观想"],
    ["deity", "神祇法相"],
    ["dream", "梦境星河"]
  ],
  subject: [
    ["self", "个人肖像"],
    ["couple", "双人合像"],
    ["guardian", "守护灵像"],
    ["brand", "品牌主视觉"]
  ],
  use: [
    ["avatar", "头像"],
    ["poster", "海报"],
    ["gift", "赠礼"],
    ["ritual", "空间装饰"]
  ],
  palette: [
    ["violet", "紫金"],
    ["moon", "月白"],
    ["jade", "青莲"],
    ["ember", "赤金"]
  ],
  delivery: [
    ["digital", "高清数字图"],
    ["print", "印刷尺寸"],
    ["layered", "分层源文件"]
  ],
  addon: [
    ["none", "无附加"],
    ["rush", "加急 +66"],
    ["commercial", "商用 +188"],
    ["source", "源文件 +128"]
  ]
};

const MYTH_SYSTEMS = [
  {key: "guanyin", label: "观音", icon: "ॐ", prompt: "faint Guanyin / Avalokitesvara mural line drawing in the background, compassionate stillness, halo circle"},
  {key: "buddha", label: "佛像", icon: "ॐ", prompt: "ancient Buddha mural figure behind the subject, quiet hand mudra, low-contrast gold-brown line art"},
  {key: "guangong", label: "关公", icon: "ॐ", prompt: "subtle Guan Gong guardian presence, solemn loyal protector energy, antique temple mural treatment"},
  {key: "xuannv", label: "九天玄女", icon: "ॐ", prompt: "Nine Heavens Xuannv-inspired sacred feminine presence, old silk painting restraint, celestial but understated"},
  {key: "taishang", label: "太上老君", icon: "ॐ", prompt: "Taishang Laojun-inspired Daoist sage line drawing, ancient scroll atmosphere, quiet numinous wisdom"},
  {key: "caishen", label: "财神", icon: "ॐ", prompt: "subtle Caishen wealth deity motif, antique gold mineral pigment, auspicious but not flashy"}
];

const SPIRIT_ANIMALS = [
  {key: "dragon", label: "龙", icon: "♞", prompt: "a restrained Chinese dragon motif in faded mural lines, cloud coils, antique mineral pigment"},
  {key: "zhuque", label: "朱雀", icon: "羽", prompt: "Vermilion Bird / Zhuque feather motif, elegant wing lines, muted cinnabar accent"},
  {key: "fox", label: "狐狸", icon: "爪", prompt: "white fox spirit companion, quiet gaze, delicate fur linework"},
  {key: "wolf", label: "狼", icon: "爪", prompt: "wolf guardian silhouette, solemn protective energy, low-contrast ink lines"},
  {key: "qilin", label: "麒麟", icon: "♞", prompt: "qilin auspicious beast, deer-dragon silhouette, antique gold line drawing"},
  {key: "pixiu", label: "貔貅", icon: "♞", prompt: "pixiu guardian beast, compact protective form, old temple carving feel"},
  {key: "phoenix", label: "凤凰", icon: "羽", prompt: "phoenix feather train, flowing line rhythm, mineral blue-green accents"},
  {key: "snake", label: "蛇", icon: "♞", prompt: "serpent spirit motif, elegant coil, quiet ritual symbolism"},
  {key: "tiger", label: "老虎", icon: "爪", prompt: "tiger guardian presence, soft but powerful stripes, antique mural style"},
  {key: "peacock", label: "孔雀", icon: "羽", prompt: "ivory white peacock with long feather train, turquoise eye spots, delicate filaments"}
];

const ADDON_PRICE = {none: 0, rush: 66, commercial: 188, source: 128};
const DEFAULT_GEN = {
  baseUrl: "https://api.openai.com/v1",
  model: "gpt-image-1",
  size: "1024x1536"
};

function esc(x){
  return String(x == null ? "" : x).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}

function stateFrom(opt){
  opt = opt || {};
  return {
    pack: opt.pack || "scroll",
    style: opt.style || "immortal",
    subject: opt.subject || "self",
    use: opt.use || "poster",
    palette: opt.palette || "violet",
    delivery: opt.delivery || "digital",
    addon: opt.addon || "none",
    myth: opt.myth || "guanyin",
    animal: opt.animal || "dragon",
    customRequest: opt.customRequest || "",
    referenceName: opt.referenceName || ""
  };
}

function optionLabel(name, key){
  const hit = (OPTION_SETS[name] || []).find(x => x[0] === key);
  return hit ? hit[1] : key;
}

function packageByKey(key){
  return PACKAGES.find(p => p.key === key) || PACKAGES[1];
}

function mythByKey(key){
  return MYTH_SYSTEMS.find(x => x.key === key) || MYTH_SYSTEMS[0];
}

function animalByKey(key){
  return SPIRIT_ANIMALS.find(x => x.key === key) || SPIRIT_ANIMALS[0];
}

function calc(st){
  const pack = packageByKey(st.pack);
  const addon = ADDON_PRICE[st.addon] || 0;
  return {pack, addon, total: pack.price + addon};
}

function briefFor(st){
  const c = calc(st);
  return [
    `项目：${c.pack.label}（${c.pack.tag}）`,
    `预算：¥${c.total}`,
    `风格：${optionLabel("style", st.style)}，主色：${optionLabel("palette", st.palette)}`,
    `主体：${optionLabel("subject", st.subject)}，用途：${optionLabel("use", st.use)}`,
    `神话体系：${mythByKey(st.myth).label}；灵兽体系：${animalByKey(st.animal).label}`,
    `交付：${optionLabel("delivery", st.delivery)}；附加：${optionLabel("addon", st.addon)}`,
    "画面关键词：旧绢佛画、敦煌壁画、矿物颜料、棕褐底色、象牙白人物、细线描、圆光、佛像或护法暗线稿、安静仪式感",
    st.referenceName ? `参考图片：${st.referenceName}` : "参考图片：未上传",
    st.customRequest ? `个性化需求：${st.customRequest}` : "个性化需求：待补充",
    "制作要求：先确认人物气质、用途和禁忌，再出构图方向；不能臆造客户未提供的肖像细节。"
  ].join("\n");
}

function imagePromptFor(st){
  const c = calc(st);
  const style = optionLabel("style", st.style);
  const subject = optionLabel("subject", st.subject);
  const use = optionLabel("use", st.use);
  const palette = optionLabel("palette", st.palette);
  const myth = mythByKey(st.myth);
  const animal = animalByKey(st.animal);
  const custom = st.customRequest ? `Client custom requirement: ${st.customRequest}.` : "Client custom requirement: not provided; do not invent personal details.";
  const reference = st.referenceName ? `A reference image named ${st.referenceName} was supplied by the client; treat it as private visual reference if available to the generation workflow.` : "No reference image is attached; avoid inventing exact likeness.";
  const detail = c.pack.key === "small" ? "upper body portrait composition" :
    c.pack.key === "body" ? "full body sacred figure composition" :
    "full character and environment poster composition";
  return [
    "Create a refined vertical East Asian mythic artwork on aged silk or linen canvas texture.",
    `Commission settings: ${style}; subject: ${subject}; usage: ${use}; selected palette label: ${palette}.`,
    `Composition: ${detail}; quiet foreground figure in ivory white or pale mineral color, serene closed or half-closed eyes, long flowing hair, elegant thin ink contour lines, restrained hand gesture, poetic negative space.`,
    `Selected myth system: ${myth.label}; ${myth.prompt}.`,
    `Selected spirit animal: ${animal.label}; ${animal.prompt}.`,
    `${custom} ${reference}`,
    "Core visual language: Dunhuang mural texture, Song/Yuan Buddhist painting, old silk scroll painting, Japanese bijin-ga elegance, mineral pigment, muted sepia brown, antique gold, warm umber, ivory white, very subtle blue-green accents only.",
    "Background: faded Buddhist mural wall, faint halo circle, Guanyin/Buddha/guardian deity as low-contrast line drawing, temple-wall atmosphere, woven fabric grain, antique patina, soft flat lighting, no glossy highlights.",
    "Mood: still, devotional, quiet, collected, sacred but understated; collectible art print rather than modern fantasy poster.",
    "Avoid: neon purple, shiny violet-gold fantasy, glossy digital art, cyberpunk, 3D render, photorealism, western fantasy armor, game character design, excessive sparkles, modern fashion, text, watermark, logo, harsh contrast, plastic skin, over-detailed background, cheap poster look.",
    `Client brief: ${briefFor(st).replace(/\n/g, "; ")}`
  ].join("\n");
}

function styleBlock(){
  return `<style>
html{scroll-behavior:smooth;scroll-padding-top:42px;scroll-snap-type:y proximity}
[data-art-snap]{scroll-snap-align:start;scroll-snap-stop:always}
.art-page{--bg:#111120;--panel:#202033;--panel2:#292741;--panel3:#17172a;--violet:#6e18b2;--violet2:#8a22d6;--gold:#f1c25a;--gold2:#c08222;--ink:#fff8ff;--muted:#c2b3cf;--line:rgba(255,255,255,.11);font-family:"Noto Serif SC","Songti SC","SimSun",serif;color:var(--ink);background:var(--bg);overflow:hidden}
.art-page *{box-sizing:border-box}
.art-image{background:#311365}
.art-image img{display:block;width:100%;height:auto}
.art-top-visual{height:clamp(440px,64vh,780px);overflow:hidden}
.art-top-visual img{height:100%;object-fit:cover;object-position:center 30%}
.art-bottom-visual img{height:auto}
.art-wrap{max-width:1180px;margin:0 auto}
.art-nav{display:flex;align-items:center;justify-content:center;gap:32px;height:46px;background:#eee6ef;color:#625370;font-size:13px;letter-spacing:.1em}
.art-nav b{color:#7a2bc5}.art-nav a{color:#625370;text-decoration:none}
.art-hero{position:relative;text-align:center;padding:62px 22px 66px;background:radial-gradient(circle at 16% 16%,rgba(255,255,255,.13),transparent 17%),radial-gradient(circle at 88% 34%,rgba(255,255,255,.1),transparent 18%),linear-gradient(145deg,#461066,#7818ba 62%,#4d087e);border-top:5px solid #33104e}
.art-hero h1{margin:0 0 18px;font-size:clamp(34px,7vw,72px);font-weight:500;letter-spacing:.09em;line-height:1.1;text-shadow:0 3px 18px rgba(0,0,0,.28)}
.art-hero p{margin:0 auto 28px;max-width:820px;color:#f1dff7;font-size:clamp(15px,2.2vw,20px);line-height:1.9}
.art-cta,.art-action,.art-price-cta{border:0;border-radius:999px;background:linear-gradient(180deg,#ffdc77,#d79a24);color:#321900;font-weight:800;cursor:pointer;box-shadow:0 14px 28px rgba(216,154,36,.25)}
.art-cta{padding:13px 30px;font-size:15px}
.art-action{padding:11px 18px;font-size:14px}.art-action.secondary{background:#26243b;color:#f4e7ff;border:1px solid var(--line);box-shadow:none}
.art-section{padding:42px 22px;background:#151528}
.art-section:nth-of-type(odd){background:#121325}
.art-section h2{max-width:1180px;margin:0 auto 22px;font-size:28px;font-weight:500;letter-spacing:.1em;color:#f8e4be}
.art-card-grid,.art-price-grid,.art-mini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:1180px;margin:0 auto}
.art-info-card,.art-price-card,.art-mini-card,.art-brief,.art-generator,.art-proof{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:8px;box-shadow:0 18px 42px rgba(0,0,0,.18)}
.art-info-card,.art-mini-card{padding:24px;min-height:178px}
.art-info-card i,.art-mini-card i{display:inline-flex;width:32px;height:32px;border-radius:9px;align-items:center;justify-content:center;background:rgba(138,34,214,.18);color:var(--gold);font-style:normal;margin-bottom:14px}
.art-info-card h3,.art-mini-card h3{margin:0 0 10px;font-size:17px;color:#fff}.art-info-card p,.art-mini-card p{margin:0;color:var(--muted);font-size:13px;line-height:1.8}
.art-price-card{position:relative;color:var(--ink);padding:22px;text-align:left;cursor:pointer;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.art-price-card:hover,.art-price-card.on{transform:translateY(-3px);border-color:rgba(241,194,90,.72);box-shadow:0 18px 46px rgba(105,24,177,.32)}
.art-price-card.on:before{content:"最受欢迎";position:absolute;left:0;right:0;top:0;height:27px;background:linear-gradient(90deg,#9c6b19,#f1c25a,#9c6b19);color:#2a1503;text-align:center;font-size:12px;font-weight:800;line-height:27px;border-radius:8px 8px 0 0}
.art-price-card.on{padding-top:42px}
.art-price-tag{display:block;color:var(--gold);font-size:13px;margin-bottom:8px}.art-price-card strong{display:block;font-size:18px;margin-bottom:14px}
.art-price-card b{font-size:31px;color:var(--gold);margin-left:6px}.art-price-card small{font-size:12px;color:var(--muted);margin-left:2px}
.art-price-card ul{margin:0 0 20px;padding-left:18px;color:#e0d2ea;font-size:13px;line-height:1.8}
.art-price-cta{display:inline-flex;padding:8px 16px;background:linear-gradient(90deg,#7431e6,#b33dff);color:#fff;box-shadow:none;font-size:12px}
.art-total{max-width:1180px;margin:18px auto 0;padding:17px 20px;border:1px solid rgba(241,194,90,.22);background:rgba(241,194,90,.08);border-radius:8px;color:#decff0;display:flex;align-items:center;justify-content:space-between;gap:12px}
.art-total b{font-size:30px;color:var(--gold)}.art-total span{font-size:13px;color:var(--muted)}
.art-config{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:1180px;margin:22px auto 0}
.art-options{display:grid;grid-template-columns:1fr 1fr;gap:12px}.art-option{background:rgba(255,255,255,.035);border:1px solid var(--line);border-radius:8px;padding:13px}.art-option-title{font-size:13px;color:var(--gold);margin-bottom:9px}.art-pills{display:flex;flex-wrap:wrap;gap:8px}
.art-pill{border:1px solid rgba(255,255,255,.15);background:#1b1a2d;color:#eee3f7;border-radius:999px;padding:8px 11px;font-size:13px;cursor:pointer}.art-pill.on{background:linear-gradient(90deg,#6d27df,#a836ff);border-color:transparent;color:#fff}
.art-system-panel{max-width:1180px;margin:22px auto 0;display:grid;grid-template-columns:1fr 1.5fr .95fr;gap:28px;padding:22px 0 8px}
.art-system-title{display:flex;align-items:center;gap:11px;margin:0 0 18px;color:#fff;font-size:22px;font-weight:800;letter-spacing:.05em}
.art-system-title i{display:inline-flex;align-items:center;justify-content:center;color:var(--gold);font-style:normal;font-size:24px;line-height:1}
.art-tile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.art-system-tile{min-height:108px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:linear-gradient(180deg,#302e49,#25243d);color:#f5effb;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 12px 28px rgba(0,0,0,.18);transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}
.art-system-tile:hover,.art-system-tile.on{transform:translateY(-2px);border-color:rgba(241,194,90,.75);box-shadow:0 0 0 1px rgba(241,194,90,.22),0 0 26px rgba(241,194,90,.24),inset 0 1px 0 rgba(255,255,255,.08)}
.art-system-tile .art-tile-icon{height:32px;color:var(--gold);font-size:31px;font-weight:800;line-height:1}
.art-system-tile .art-tile-label{font-size:17px;font-weight:800}
.art-custom-card{height:100%;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:linear-gradient(180deg,#292741,#202033);padding:28px 26px;box-shadow:0 18px 42px rgba(0,0,0,.18)}
.art-custom-card p{margin:0 0 22px;color:#f1ebf9;font-size:17px;font-weight:800;line-height:1.7}
.art-upload{position:relative;display:flex;min-height:150px;border:2px dashed rgba(138,85,236,.48);border-radius:8px;align-items:center;justify-content:center;text-align:center;background:#24233c;color:#d9ccef;cursor:pointer;margin-bottom:22px;overflow:hidden}
.art-upload input{position:absolute;inset:0;opacity:0;cursor:pointer}
.art-upload strong{display:block;color:#f0e5ff;font-size:16px;margin-top:8px}.art-upload small{display:block;color:#9f91b5;margin-top:8px}.art-upload i{display:block;color:var(--gold);font-style:normal;font-size:32px}
.art-custom-text{width:100%;min-height:145px;resize:vertical;border:1px solid rgba(255,255,255,.08);border-radius:7px;background:#141326;color:#f8edff;padding:16px;font:inherit;font-size:16px;line-height:1.55;margin-bottom:22px}
.art-submit-custom{width:100%;border:0;border-radius:999px;background:linear-gradient(90deg,#7b2de8,#b642ff);color:#fff;font-weight:900;font-size:17px;padding:15px 18px;cursor:pointer;box-shadow:0 12px 28px rgba(142,54,243,.32)}
.art-custom-status{min-height:22px;color:#d9ccef;font-size:13px;line-height:1.6;margin-top:12px}
.art-brief{padding:20px}.art-brief pre,.art-prompt{white-space:pre-wrap;margin:0;color:#efe3f7;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.7}
.art-generator{max-width:1180px;margin:0 auto;padding:22px}.art-gen-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:18px}.art-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}.art-field{display:grid;gap:7px}.art-field label{font-size:12px;color:var(--gold)}.art-field input,.art-field select{width:100%;border:1px solid var(--line);border-radius:8px;background:#19182b;color:#f8edff;padding:11px 12px;font:inherit}
.art-field.wide{grid-column:1/-1}.art-gen-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.art-output{min-height:360px;border:1px dashed rgba(241,194,90,.35);border-radius:8px;background:#141326;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#aa9bb8;text-align:center;padding:18px}.art-output img{display:block;width:100%;height:auto;border-radius:6px}.art-status{margin-top:12px;color:#cbbbd8;font-size:13px;line-height:1.6}
.art-proof{max-width:1180px;margin:22px auto 0;padding:22px 26px;display:flex;align-items:center;justify-content:space-between;gap:18px}.art-proof b{font-size:26px}.art-proof small{color:var(--muted);font-size:14px;line-height:1.8}.art-proof .heart{color:#ff5974;font-size:34px;margin-right:8px}
@media(max-width:960px){.art-system-panel{grid-template-columns:1fr;gap:24px}.art-system-title{font-size:20px}.art-system-tile{min-height:96px}}
@media(max-width:840px){html{scroll-padding-top:0;scroll-snap-type:y proximity}.art-nav{gap:12px;overflow:auto;justify-content:flex-start;padding:0 14px}.art-top-visual{height:clamp(360px,62vh,560px)}.art-card-grid,.art-price-grid,.art-mini-grid,.art-config,.art-options,.art-gen-grid,.art-fields{grid-template-columns:1fr}.art-section{padding:32px 15px}.art-hero{padding:44px 16px 50px}.art-total,.art-proof{align-items:flex-start;flex-direction:column}.art-field.wide{grid-column:auto}.art-shell-top{position:static!important}.art-shell-spacer{display:none!important}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto;scroll-snap-type:none}[data-art-snap]{scroll-snap-align:none}}
  </style>`;
}

function packageCards(st){
  const c = calc(st);
  return `<div class="art-price-grid">` + PACKAGES.map(p => {
    const on = st.pack === p.key;
    return `<button type="button" class="art-price-card${on ? " on" : ""}" data-art-opt="pack" data-art-value="${p.key}">
      <span class="art-price-tag">${esc(p.tag)}</span>
      <strong>${esc(p.label)} <b>${p.price}</b><small>元起</small></strong>
      <ul>${p.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
      <span class="art-price-cta">${on ? "当前选择" : "选择此档"}</span>
    </button>`;
  }).join("") + `</div><div class="art-total"><div>当前估算 <b>¥${c.total}</b></div><span>${esc(c.pack.label)} · ${esc(optionLabel("addon", st.addon))}</span></div>`;
}

function optionButtons(name, st){
  const labels = {style:"视觉风格", subject:"人物主体", use:"使用目的", palette:"主色", delivery:"交付", addon:"附加服务"};
  return `<div class="art-option"><div class="art-option-title">${esc(labels[name] || name)}</div><div class="art-pills">` +
    OPTION_SETS[name].map(([key, label]) =>
      `<button type="button" class="art-pill${st[name] === key ? " on" : ""}" data-art-opt="${name}" data-art-value="${key}">${esc(label)}</button>`
    ).join("") + `</div></div>`;
}

function systemTiles(title, icon, items, stateKey, current){
  return `<div class="art-system-group">
    <h3 class="art-system-title"><i>${esc(icon)}</i><span>${esc(title)}</span></h3>
    <div class="art-tile-grid">
      ${items.map(item => `<button type="button" class="art-system-tile${current === item.key ? " on" : ""}" data-art-opt="${stateKey}" data-art-value="${item.key}" aria-pressed="${current === item.key ? "true" : "false"}">
        <span class="art-tile-icon">${esc(item.icon)}</span>
        <span class="art-tile-label">${esc(item.label)}</span>
      </button>`).join("")}
    </div>
  </div>`;
}

function customPanel(st){
  return `<div class="art-custom-card">
    <h3 class="art-system-title"><i>♥</i><span>个性化定制</span></h3>
    <p>欢迎提供您自家小动物的清晰照片，或您供奉仙家的相关信息，我们将据此进行专属设计。</p>
    <label class="art-upload" for="art-reference-file">
      <input id="art-reference-file" type="file" accept="image/jpeg,image/png,image/webp">
      <span><i>☁</i><strong>${st.referenceName ? esc(st.referenceName) : "上传您的参考图片"}</strong><small>支持 JPG、PNG 格式</small></span>
    </label>
    <textarea class="art-custom-text" id="art-custom-request" placeholder="请描述您的个性化需求...">${esc(st.customRequest)}</textarea>
    <button type="button" class="art-submit-custom" id="art-submit-custom">提交定制需求</button>
    <div class="art-custom-status" id="art-custom-status">${st.customRequest || st.referenceName ? "已写入当前创作 brief 与出图提示词。" : ""}</div>
  </div>`;
}

function systemPicker(st){
  return `<div class="art-system-panel" id="art-systems" data-art-snap>
    ${systemTiles("神话体系", "◆", MYTH_SYSTEMS, "myth", st.myth)}
    ${systemTiles("灵兽体系", "♞", SPIRIT_ANIMALS, "animal", st.animal)}
    ${customPanel(st)}
  </div>`;
}

function generatorBlock(st){
  const prompt = imagePromptFor(st);
  const gen = Object.assign({}, DEFAULT_GEN, root.ART_GEN_SETTINGS || {});
  return `<section class="art-section" id="art-generate" data-art-snap>
    <h2>生成图片</h2>
    <div class="art-generator">
      <div class="art-gen-grid">
        <div>
          <div class="art-fields">
            <div class="art-field">
              <label for="art-base-url">图片 API 地址</label>
              <input id="art-base-url" value="${esc(gen.baseUrl)}" autocomplete="off">
            </div>
            <div class="art-field">
              <label for="art-model">图片模型</label>
              <input id="art-model" value="${esc(gen.model)}" autocomplete="off">
            </div>
            <div class="art-field">
              <label for="art-size">画幅</label>
              <select id="art-size">
                ${["1024x1024","1024x1536","1536x1024"].map(s => `<option value="${s}"${gen.size === s ? " selected" : ""}>${s}</option>`).join("")}
              </select>
            </div>
            <div class="art-field">
              <label for="art-api-key">API Key</label>
              <input id="art-api-key" type="password" placeholder="只在本浏览器本次请求中使用" autocomplete="off">
            </div>
            <div class="art-field wide">
              <label>当前图片提示词</label>
              <pre class="art-prompt" id="art-prompt">${esc(prompt)}</pre>
            </div>
          </div>
          <div class="art-gen-actions">
            <button type="button" class="art-action" id="art-generate-btn">生成图片</button>
            <button type="button" class="art-action secondary" id="art-copy-prompt">复制提示词</button>
          </div>
          <div class="art-status" id="art-status">图片生成需要支持 OpenAI 兼容 /images/generations 的模型；文本模型只能生成文案，不能直接出图。</div>
        </div>
        <div class="art-output" id="art-output">生成结果会显示在这里</div>
      </div>
    </div>
  </section>`;
}

function shell(st){
  return styleBlock() + `<div class="art-page">
    <div class="art-image art-top-visual" data-art-snap><img src="${ASSETS.hero}" alt="专属数字艺术创作顶部视觉"></div>
    <nav class="art-nav"><b>专属数字艺术</b><a href="#art-rules">设计规范</a><a href="#art-config">定制套餐</a><a href="#art-generate">生成图片</a><a href="#art-notes">重要须知</a></nav>
    <section class="art-hero" data-art-snap>
      <h1>专属数字艺术创作</h1>
      <p>用东方神性、紫金光感与个人气质，定制一张可用于头像、礼物、品牌与空间陈设的数字艺术作品。</p>
      <button type="button" class="art-cta" data-art-scroll="#art-config">开始配置</button>
    </section>
    <section class="art-section" id="art-rules" data-art-snap>
      <h2>设计规范（必读）</h2>
      <div class="art-card-grid">
        <article class="art-info-card"><i>光</i><h3>沟通与气质</h3><p>先确认人物状态、用途、禁忌与参考方向，再进入构图。可提供照片，但不会泄露隐私。</p></article>
        <article class="art-info-card"><i>构</i><h3>构图与细节</h3><p>重点处理人物神态、衣纹、莲花、云气、光晕与法器，不做粗糙拼贴。</p></article>
        <article class="art-info-card"><i>人</i><h3>人物比例</h3><p>默认东方幻想审美，可偏仙侠、神祇、梦境或品牌主视觉；复杂需求需先确认。</p></article>
      </div>
    </section>
    <section class="art-section" id="art-config" data-art-snap>
      <h2>套餐与配置</h2>
      ${packageCards(st)}
      ${systemPicker(st)}
      <div class="art-config">
        <div class="art-options">${["style","subject","use","palette","delivery","addon"].map(k => optionButtons(k, st)).join("")}</div>
        <div class="art-brief"><pre>${esc(briefFor(st))}</pre></div>
      </div>
    </section>
    ${generatorBlock(st)}
    <section class="art-section" id="art-notes" data-art-snap>
      <h2>重要须知</h2>
      <div class="art-mini-grid">
        <article class="art-mini-card"><i>一</i><h3>第一稿</h3><p>第一稿用于确认方向，重点看整体气质、构图和配色。</p></article>
        <article class="art-mini-card"><i>期</i><h3>制作周期</h3><p>标准周期随复杂度变化；加急只压缩排期，不降低精修标准。</p></article>
        <article class="art-mini-card"><i>权</i><h3>版权声明</h3><p>默认个人使用；商用、分层源文件和二次授权需单独选择。</p></article>
      </div>
      <div class="art-proof"><div><b>安心事业</b><br><small>每一张都按你的用途整理创作 brief，减少反复沟通成本。</small></div><div><span class="heart">♥</span><b>10,000+</b><br><small>灵感收藏与案例参考</small></div></div>
    </section>
    <div class="art-image art-bottom-visual" data-art-snap><img src="${ASSETS.footer}" alt="专属数字艺术创作底部视觉"></div>
  </div>`;
}

function saveGenSettings(){
  root.ART_GEN_SETTINGS = {
    baseUrl: valueOf("art-base-url") || DEFAULT_GEN.baseUrl,
    model: valueOf("art-model") || DEFAULT_GEN.model,
    size: valueOf("art-size") || DEFAULT_GEN.size
  };
}

function valueOf(id){
  const el = root.document && root.document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setStatus(msg){
  const el = root.document && root.document.getElementById("art-status");
  if(el) el.textContent = msg;
}

function setOutput(html){
  const el = root.document && root.document.getElementById("art-output");
  if(el) el.innerHTML = html;
}

function extractImage(json){
  const candidates = [];
  if(json && Array.isArray(json.data)) candidates.push.apply(candidates, json.data);
  if(json && Array.isArray(json.images)) candidates.push.apply(candidates, json.images);
  if(json && Array.isArray(json.output)) candidates.push.apply(candidates, json.output);
  for(const item of candidates){
    if(!item) continue;
    if(item.b64_json) return "data:image/png;base64," + item.b64_json;
    if(item.url) return item.url;
    if(item.image_url) return item.image_url.url || item.image_url;
    if(Array.isArray(item.content)){
      for(const c of item.content){
        if(c && c.image_url) return c.image_url.url || c.image_url;
        if(c && c.b64_json) return "data:image/png;base64," + c.b64_json;
      }
    }
  }
  return "";
}

async function copyPrompt(){
  const prompt = root.document.getElementById("art-prompt");
  if(!prompt) return;
  try{
    await root.navigator.clipboard.writeText(prompt.textContent);
    setStatus("提示词已复制。");
  }catch(_err){
    setStatus("当前浏览器不允许直接复制，请手动选中提示词复制。");
  }
}

async function generateImage(){
  saveGenSettings();
  const key = valueOf("art-api-key");
  const baseUrl = valueOf("art-base-url") || DEFAULT_GEN.baseUrl;
  const model = valueOf("art-model") || DEFAULT_GEN.model;
  const size = valueOf("art-size") || DEFAULT_GEN.size;
  const promptEl = root.document.getElementById("art-prompt");
  const prompt = promptEl ? promptEl.textContent.trim() : imagePromptFor(stateFrom(root.ART_STATE));
  if(!key){
    setStatus("缺少 API Key。图片生成必须使用支持图片接口的服务。");
    return;
  }
  if(!model || /flash|chat|text|reason|turbo/i.test(model)){
    setStatus("当前模型名看起来是文本模型。请换成图片模型，例如 gpt-image-1，或你的服务商提供的 image generation 模型。");
    return;
  }
  const url = baseUrl.replace(/\/+$/, "") + "/images/generations";
  setStatus("正在请求图片生成接口...");
  setOutput("生成中，请稍等。");
  try{
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + key
      },
      body: JSON.stringify({model, prompt, size, n: 1})
    });
    const text = await res.text();
    let json = {};
    try{ json = JSON.parse(text); }catch(_err){}
    if(!res.ok){
      const detail = json.error && (json.error.message || json.error.code) || text.slice(0, 240);
      throw new Error(detail || ("HTTP " + res.status));
    }
    const src = extractImage(json);
    if(!src) throw new Error("接口返回里没有可识别的图片 URL 或 b64_json。");
    setOutput(`<img src="${esc(src)}" alt="生成的数字艺术作品">`);
    setStatus("图片已生成。");
  }catch(err){
    setOutput("没有生成图片。");
    setStatus("生成失败：" + (err && err.message ? err.message : String(err)));
  }
}

function snapOffset(){
  const shell = root.document && root.document.querySelector(".art-shell-top");
  if(!shell) return 0;
  const fixed = root.getComputedStyle(shell).position === "fixed";
  return fixed ? Math.round(shell.getBoundingClientRect().height) : 0;
}

function snapTop(el){
  return Math.max(0, Math.round(root.scrollY + el.getBoundingClientRect().top - snapOffset()));
}

function snapPoints(){
  return Array.from(root.document.querySelectorAll("[data-art-snap]"));
}

function scrollToSnap(el){
  root.scrollTo({top: snapTop(el), behavior: "smooth"});
}

function nextSnap(dir){
  const points = snapPoints();
  if(!points.length) return null;
  const y = root.scrollY + snapOffset();
  if(dir > 0){
    return points.find(el => snapTop(el) > root.scrollY + 48) || points[points.length - 1];
  }
  for(let i = points.length - 1; i >= 0; i--){
    if(snapTop(points[i]) < y - 48) return points[i];
  }
  return points[0];
}

function isSnapInteractive(target){
  return !!(target && target.closest && target.closest("input,select,textarea,button,.art-output,.art-prompt"));
}

function bindSnapScroll(){
  if(root.ART_SNAP_BOUND || root.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.ART_SNAP_BOUND = true;
  let lockedUntil = 0;
  root.addEventListener("wheel", e => {
    if(isSnapInteractive(e.target) || e.ctrlKey || Math.abs(e.deltaY) < 18) return;
    const now = Date.now();
    if(now < lockedUntil){
      e.preventDefault();
      return;
    }
    const target = nextSnap(e.deltaY > 0 ? 1 : -1);
    if(!target) return;
    e.preventDefault();
    lockedUntil = now + 720;
    scrollToSnap(target);
  }, {passive: false});
}

function refreshCreativeText(){
  const st = stateFrom(root.ART_STATE);
  const brief = root.document.querySelector(".art-brief pre");
  const prompt = root.document.getElementById("art-prompt");
  if(brief) brief.textContent = briefFor(st);
  if(prompt) prompt.textContent = imagePromptFor(st);
}

function bindCustomPanel(){
  const doc = root.document;
  const file = doc.getElementById("art-reference-file");
  const text = doc.getElementById("art-custom-request");
  const submit = doc.getElementById("art-submit-custom");
  const status = doc.getElementById("art-custom-status");
  if(file) file.addEventListener("change", () => {
    const picked = file.files && file.files[0];
    root.ART_STATE = Object.assign(stateFrom(root.ART_STATE), {referenceName: picked ? picked.name : ""});
    const label = doc.querySelector(".art-upload strong");
    if(label) label.textContent = picked ? picked.name : "上传您的参考图片";
    if(status) status.textContent = picked ? "参考图片名称已写入当前创作 brief。图片本体仍保留在本地浏览器。" : "";
    refreshCreativeText();
  });
  if(text) text.addEventListener("input", () => {
    root.ART_STATE = Object.assign(stateFrom(root.ART_STATE), {customRequest: text.value.trim()});
    refreshCreativeText();
  });
  if(submit) submit.addEventListener("click", () => {
    root.ART_STATE = Object.assign(stateFrom(root.ART_STATE), {customRequest: text ? text.value.trim() : ""});
    if(status) status.textContent = "已写入当前创作 brief 与出图提示词。";
    refreshCreativeText();
  });
}

function bind(){
  const doc = root.document;
  doc.querySelectorAll("[data-art-opt]").forEach(btn => {
    btn.addEventListener("click", () => {
      root.ART_STATE = Object.assign(stateFrom(root.ART_STATE), {[btn.dataset.artOpt]: btn.dataset.artValue});
      renderStandalone();
    });
  });
  doc.querySelectorAll("[data-art-scroll]").forEach(btn => {
    btn.addEventListener("click", () => {
      const el = doc.querySelector(btn.dataset.artScroll);
      if(el) scrollToSnap(el);
    });
  });
  const generate = doc.getElementById("art-generate-btn");
  const copy = doc.getElementById("art-copy-prompt");
  if(generate) generate.addEventListener("click", generateImage);
  if(copy) copy.addEventListener("click", copyPrompt);
  ["art-base-url", "art-model", "art-size"].forEach(id => {
    const el = doc.getElementById(id);
    if(el) el.addEventListener("change", saveGenSettings);
  });
  bindCustomPanel();
  bindSnapScroll();
}

function renderStandalone(container){
  const el = container || root.document && root.document.getElementById("art-app");
  if(!el) return;
  root.ART_STATE = stateFrom(root.ART_STATE);
  el.innerHTML = shell(root.ART_STATE);
  bind();
}

root.ART = {
  PACKAGES,
  OPTION_SETS,
  stateFrom,
  calc,
  briefFor,
  imagePromptFor,
  renderStandalone
};

})(typeof window !== "undefined" ? window : globalThis);
