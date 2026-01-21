const map = L.map("map").setView([-7.5, 112.7], 8);

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 16,
    attribution: "Tiles &copy; Esri",
  }
).addTo(map);

function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 55%)`;
}

function formatHa(val) {
  if (val === undefined || val === null) return "-";
  return `${Number(val).toLocaleString("id-ID")} ha`;
}

function formatPercent(val) {
  if (val === undefined || val === null) return "-";
  return `${Number(val).toLocaleString("id-ID")} %`;
}

Promise.all([
  fetch("./data/38-kabkot.geojson").then((r) => r.json()),
  fetch("./data/data-kabkot.json").then((r) => r.json()),
])
  .then(([geojson, dataluas]) => {
    const layer = L.geoJSON(geojson, {
      style: (feature) => {
        const p = feature.properties || {};
        const nama = p.Kabupaten || "Wilayah";

        return {
          color: "#1f2937",
          weight: 1,
          fillColor: hashColor(nama),
          fillOpacity: 0.45,
        };
      },

      onEachFeature: (feature, l) => {
        const p = feature.properties || {};
        const nama = p.Kabupaten || "Wilayah";

        l.on("click", () => {
          const data = dataluas[nama] || {};

          const html = `
  <div style="min-width:360px">
    <div style="font-size:16px; font-weight:800; margin-bottom:10px;">
      ${nama}
    </div>

    <table style="width:100%; border-collapse:collapse; font-size:13px;">
      <thead>
        <tr style="border-bottom:1px solid #e5e7eb;">
          <th style="text-align:left; padding:6px 4px;">Komoditas</th>
          <th style="text-align:right; padding:6px 4px;">MT1</th>
          <th style="text-align:right; padding:6px 4px;">MT2</th>
          <th style="text-align:right; padding:6px 4px;">MT3</th>
          <th style="text-align:right; padding:6px 4px;">Total</th>
        </tr>
      </thead>

      <tbody>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:6px 4px; color:#374151;">Padi</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.padi?.mt1)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.padi?.mt2)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.padi?.mt3)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.padi?.total)}</td>
        </tr>

        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:6px 4px; color:#374151;">Palawija</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.palawija?.mt1)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.palawija?.mt2)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.palawija?.mt3)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.palawija?.total)}</td>
        </tr>

        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:6px 4px; color:#374151;">Tebu</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.tebu?.mt1)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.tebu?.mt2)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.tebu?.mt3)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.tebu?.total)}</td>
        </tr>

        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:6px 4px; color:#374151;">Lain-lain</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.lain_lain?.mt1)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.lain_lain?.mt2)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">${formatHa(data?.lain_lain?.mt3)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.lain_lain?.total)}</td>
        </tr>

        <tr>
          <td style="padding:6px 4px; color:#111827; font-weight:800;">TOTAL</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.total?.mt1)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.total?.mt2)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(data?.total?.mt3)}</td>
          <td style="padding:6px 4px; text-align:right; font-weight:900;">${formatHa(data?.total?.total)}</td>
        </tr>
      </tbody>
    </table>
  </div>
`;

          l.bindPopup(html, { maxWidth: 420 }).openPopup();
        });

        //hover-map
        l.on("mouseover", () => {
          l.setStyle({ weight: 3, fillOpacity: 0.65 });
        });

        l.on("mouseout", () => {
          layer.resetStyle(l);
        });
      },
    }).addTo(map);

    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  })
  .catch((err) => console.error("Gagal load data:", err));