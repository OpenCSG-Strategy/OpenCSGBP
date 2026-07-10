/* OpenCSG regional community registry.
   Keep every city/community deep link in one place so maps, cases and partner
   references cannot drift to different destinations. */
(function(){
  const links = Object.freeze({
    yichang: Object.freeze({
      url: "https://sanxia.opencsg.com/",
      zh: "三峡（宜昌）社区",
      en: "Sanxia / Yichang Community"
    }),
    longgang: Object.freeze({
      url: "https://modelhub.lgdg.cc/",
      zh: "深圳龙岗社区",
      en: "Shenzhen Longgang Community"
    }),
    dongfang: Object.freeze({
      url: "https://openeast.opencsg.com/",
      zh: "海南东方市社区",
      en: "Hainan Dongfang Community"
    }),
    hongkong: Object.freeze({
      url: "https://occ.opencsg.hk/",
      zh: "香港社区",
      en: "Hong Kong Community"
    }),
    caict: Object.freeze({
      url: "https://aihub.caict.ac.cn/",
      zh: "工信部 · 中国信通院社区",
      en: "MIIT · CAICT AI Hub"
    }),
    singapore: Object.freeze({
      url: "https://sg.opencsg.com/",
      zh: "新加坡社区",
      en: "Singapore Community"
    })
  });

  const href = key => links[key]?.url || "#";
  const apply = (root = document) => {
    root.querySelectorAll?.("a[data-community-key]").forEach(anchor => {
      const item = links[anchor.dataset.communityKey];
      if (!item) return;
      anchor.href = item.url;
      anchor.target = "_self";
      if (!anchor.title) anchor.title = item.zh;
      if (!anchor.getAttribute("aria-label")) anchor.setAttribute("aria-label", `${item.zh} ↗`);
    });
  };

  window.OpenCSGCommunity = Object.freeze({links, href, apply});
})();
