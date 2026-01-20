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
  .then(([geojson, sawahData]) => {
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
          const data = sawahData[nama] || {};

          const html = `
            <div style="min-width:240px">
              <div style="font-size:16px; font-weight:800; margin-bottom:8px;">
                ${nama}
              </div>

              <div style="
                display:grid;
                grid-template-columns: 1fr auto;
                gap:6px 12px;
                font-size:13px;
              ">
                <div style="color:#374151">Luas Sawah</div>
                <div style="font-weight:800">${formatHa(data.luas_sawah_ha)}</div>

                <div style="color:#374151">Luas Baku</div>
                <div style="font-weight:800">${formatHa(data.luas_baku_ha)}</div>

                <div style="color:#374151">Realisasi</div>
                <div style="font-weight:800">${formatHa(data.realisasi_ha)}</div>

                <div style="color:#374151">IP Padi</div>
                <div style="font-weight:800">${formatPercent(data.ip_padi)}</div>
              </div>
            </div>
          `;

          l.bindPopup(html, { maxWidth: 300 }).openPopup();
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