//load-map
  const map = L.map("map").setView([-7.5, 112.7], 8);
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 16,
      attribution: "Tiles &copy; Esri",
    }
  ).addTo(map);

//warna-wilayah
  function hashColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 55%)`;
  }

//formating-ha
  function formatHa(val) {
    if (val === undefined || val === null) return "-";
    return `${Number(val).toLocaleString("id-ID")} ha`;
  }
//formating-persentase
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

// label-nama
        const labelPoint = turf.pointOnFeature(feature);
        const [lng, lat] = labelPoint.geometry.coordinates;

        L.marker([lat, lng], {
          icon: L.divIcon({
          className: "kabkot-label",
          html: nama
        }),
        interactive: false
        }).addTo(map);
        

//popup-detail 
        l.on("click", () => {
          const data = dataluas[nama] || {};
          const diLuas = data?.di_luas || 0;

          const tebuCarry = data?.tebu?.mt1 || 0;

        const totalMT1 =
          (data?.padi?.mt1 || 0) +
          (data?.palawija?.mt1 || 0) +
          (data?.lain_lain?.mt1 || 0) +
          tebuCarry;
                
        const totalMT2 =
          (data?.padi?.mt2 || 0) +
          (data?.palawija?.mt2 || 0) +
          (data?.lain_lain?.mt2 || 0) +
          tebuCarry;
                
        const totalMT3 =
          (data?.padi?.mt3 || 0) +
          (data?.palawija?.mt3 || 0) +
          (data?.lain_lain?.mt3 || 0) +
          tebuCarry;
                
// total tahunan (tebu 1x saja)
        const totalALL =
          (data?.padi?.total || 0) +
          (data?.palawija?.total || 0) +
          (data?.lain_lain?.total || 0) +
          tebuCarry;



          const html = `
  <div style="font-size:16px; font-weight:800; margin-bottom:10px;">
    ${nama} 
    <span style="font-size:12px; color:#6b7280; font-weight:800;">
      (${formatHa(diLuas)})
    </span>
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
          <td style="padding:6px 4px; text-align:right; font-weight:700;">
            ${formatHa(tebuCarry)}
          </td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">
            ${formatHa(tebuCarry)}
          </td>
          <td style="padding:6px 4px; text-align:right; font-weight:700;">
            ${formatHa(tebuCarry)}
          </td>
          <td style="padding:6px 4px; text-align:right; font-weight:800;">
            ${formatHa(tebuCarry)}
          </td>
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
        <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(totalMT1)}</td>
        <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(totalMT2)}</td>
        <td style="padding:6px 4px; text-align:right; font-weight:800;">${formatHa(totalMT3)}</td>
        <td style="padding:6px 4px; text-align:right; font-weight:900;">${formatHa(totalALL)}</td>
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