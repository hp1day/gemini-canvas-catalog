import { NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

export const dynamic = 'force-dynamic';


const storage = new Storage();
const BUCKET_NAME = 'conerstonepartlib';

// In-memory cache to prevent redundant costly network calls to GCS
let cachedParts: any[] | null = null;

export async function GET() {
  try {
    // Return from cache if already loaded
    if (cachedParts && cachedParts.length > 0) {
      console.log(`Serving ${cachedParts.length} catalog parts directly from in-memory cache.`);
      return NextResponse.json({ parts: cachedParts });
    }

    console.log("Cache miss. Initiating dynamic fetch from gs://conerstonepartlib/plygem/");
    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix: 'plygem/' });
    
    const pdfFiles = files.filter(file => file.name.toLowerCase().endsWith('.pdf'));

    const parts = pdfFiles.map(file => {
      const fileName = file.name;
      const baseName = fileName.split('/').pop()?.slice(0, -4) || "";
      
      let cleanName = baseName
        .replace(/^PGW_/, "Ply Gem ")
        .replace(/^PWG_/, "Ply Gem ")
        .replace(/^PW_/, "Ply Gem ")
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\d{8,}/, "") // remove trailing numeric hashes/IDs
        .trim();

      cleanName = cleanName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

      const baseNameLower = baseName.toLowerCase();
      let division: "siding" | "windows" | "metal" | "custom" | "gutter" | "fencing" | "fasteners" = "windows";
      let divisionLabel = "High-Efficiency Window Systems";
      let category = "Windows";
      let subCategory = "Residential Windows";
      let materialComposition = "Premium Multi-Chamber Vinyl";
      let finish = "Enviro-White Matte";
      let weight = 38.5;
      let cost = 299.00;

      if (baseNameLower.includes("fence") || baseNameLower.includes("rail") || baseNameLower.includes("post") || baseNameLower.includes("gate")) {
        division = "fencing";
        divisionLabel = "High-End Vinyl Fencing & Railings";
        category = "Fencing";
        subCategory = "Vinyl Privacy Fencing";
        materialComposition = "UV-Stabilized Impact PVC";
        finish = "Classic White Texture";
        weight = 18.2;
        cost = 89.50;
      } else if (baseNameLower.includes("gutter") || baseNameLower.includes("leaf_relief")) {
        division = "gutter";
        divisionLabel = "Seamless Rain Gutter Systems";
        category = "Gutter Systems";
        subCategory = "Gutter Protection";
        materialComposition = "Aluma-Flow Premium Aluminum";
        finish = "Weather-Shield Metallic";
        weight = 5.4;
        cost = 34.90;
      } else if (baseNameLower.includes("stone")) {
        division = "siding";
        divisionLabel = "Siding & Exterior Accents";
        category = "Siding";
        subCategory = "Stone Veneer Cladding";
        materialComposition = "Cast Architectural Stone";
        finish = "Natural Shale Face";
        weight = 64.0;
        cost = 145.00;
      } else if (baseNameLower.includes("metals") || baseNameLower.includes("trim") || baseNameLower.includes("moulding") || baseNameLower.includes("soffit") || baseNameLower.includes("shutter")) {
        division = "siding";
        divisionLabel = "Siding & Exterior Accents";
        category = "Siding";
        subCategory = "Trim & Accent Accessories";
        materialComposition = "High-Tensile Aluminum Coil";
        finish = "Kynar Paint Finish";
        weight = 12.0;
        cost = 59.95;
      } else if (baseNameLower.includes("variform") || baseNameLower.includes("siding")) {
        division = "siding";
        divisionLabel = "Siding & Exterior Accents";
        category = "Siding";
        subCategory = "Vinyl Cladding Panels";
        materialComposition = "Extruded Rigid PVC Siding";
        finish = "Embossed Woodgrain Cedar";
        weight = 4.2;
        cost = 12.50;
      } else if (baseNameLower.includes("cortex") || baseNameLower.includes("screw") || baseNameLower.includes("fasten")) {
        division = "fasteners";
        divisionLabel = "Structural Fastening Solutions";
        category = "Fasteners";
        subCategory = "Cortex Hidden Fasteners";
        materialComposition = "Case-Hardened Carbon Steel";
        finish = "Rust-Shield Galvanized";
        weight = 2.5;
        cost = 45.00;
      } else {
        // Window & Door defaults
        division = "windows";
        divisionLabel = "High-Efficiency Window Systems";
        if (baseNameLower.includes("door") || baseNameLower.includes("patio")) {
          category = "Doors";
          subCategory = "Sliding Patio Doors";
          materialComposition = "Heavy-Duty Vinyl & Low-E Glass";
          finish = "Desert Sand Matte";
          weight = 185.0;
          cost = 899.00;
        } else {
          category = "Windows";
          subCategory = "Single-Hung & Casement";
          materialComposition = "Multi-Chamber Argon-Filled Vinyl";
          finish = "Enviro-White Matte";
          weight = 42.0;
          cost = 329.00;
        }
      }

      const specs = [
        { label: "Cloud Document Reference", value: baseName },
        { label: "File Name in Bucket", value: file.name },
        { label: "Engineering Standard", value: "AAMA / WDMA Certified" },
        { label: "Thermal Efficiency", value: division === "windows" ? "U-Factor: 0.28 | SHGC: 0.22" : "N/A" }
      ];

      return {
        id: file.name.slice(0, -4),
        name: cleanName,
        division,
        divisionLabel,
        brand: "Ply Gem",
        description: `Authentic engineering specification and reference document sourced directly from gs://${BUCKET_NAME}/${file.name}. Highly optimized design compliant with local building codes, structural wind load limits, and thermal efficiency requirements.`,
        weight,
        cost,
        material: materialComposition,
        finish,
        specs,
        hasPdfDatasheet: true,
        isSynthesized: true,
        category,
        subCategory,
        materialComposition,
        compliance: "ASTM Structural Standard compliant",
        colors: ["Enviro-White", "Desert Sand", "Bronze", "Clay"]
      };
    });

    // Save to memory cache
    cachedParts = parts;
    console.log(`Successfully cached ${parts.length} dynamic GCS parts.`);

    return NextResponse.json({ parts });
  } catch (error: any) {
    console.error("Error fetching parts from GCS:", error);
    return NextResponse.json({ error: error.message || "Failed to load GCS parts" }, { status: 500 });
  }
}
