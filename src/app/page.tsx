"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { 
  Search, 
  Sparkles, 
  Layers, 
  Settings, 
  Send, 
  ChevronRight, 
  Info, 
  Plus, 
  Check, 
  RotateCcw, 
  FileText, 
  SlidersHorizontal, 
  Terminal, 
  ArrowRight, 
  Activity, 
  Filter, 
  Trash2, 
  Grid, 
  List, 
  ArrowUpRight, 
  Hammer, 
  HelpCircle,
  TrendingUp,
  Boxes,
  Zap,
  ShieldCheck,
  RefreshCw,
  Truck,
  Wrench,
  Building2,
  Download,
  Maximize2,
  Package,
  Image
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// ==========================================
// TYPES & DATA DEFINITIONS
// ==========================================

interface Part {
  id: string
  name: string
  division: "siding" | "windows" | "metal" | "custom" | "gutter" | "fencing" | "fasteners"
  divisionLabel: string
  brand: "Ply Gem" | "Simonton" | "Mastic" | "MBCI" | "Star Building Systems" | "Environmental Stoneworks" | "Custom Fabricated" | "Metl-Span" | "Variform" | "Mueller" | "Leaf Relief" | "Performance Metals" | "D&D Hardware" | "Builder Series" | "Mira Premium"
  description: string
  weight: number // in lbs
  cost: number // in USD
  material: string
  finish: string
  specs: { label: string; value: string }[]
  svgBlueprint: React.ReactNode
  isSynthesized?: boolean
  hasPdfDatasheet?: boolean
  
  // High-fidelity schema fields from the new instructions
  category?: string
  subCategory?: string
  materialComposition?: string
  colors?: string[]
  compatibility?: string
  compliance?: string
}

// Custom-crafted high-end SVG vector blueprints for construction parts
const Blueprints = {
  vinylSiding: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-cyan-400 fill-none" strokeWidth="1.2">
      {/* Blueprint grid background */}
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(34, 211, 238, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" stroke="none" />
      
      {/* Siding Panel Profile (Double 4" Clapboard cross-section) */}
      <g className="stroke-cyan-500">
        {/* Top Nail Hem */}
        <path d="M 50 10 L 52 10 Q 55 10, 55 13 L 55 20 Q 55 22, 52 22 L 48 22" />
        {/* Slotted hole indicator */}
        <ellipse cx="51" cy="16" rx="1.5" ry="3" strokeWidth="1" className="stroke-cyan-400/60" />
        
        {/* Upper Panel Face (Clapboard 1) */}
        <path d="M 48 22 L 48 25 L 30 50" />
        {/* Butt Edge Interlock (Middle) */}
        <path d="M 30 50 L 32 50 C 35 50, 37 47, 37 44 L 37 42" />
        
        {/* Lower Panel Face (Clapboard 2) */}
        <path d="M 48 50 L 48 53 L 30 78" />
        {/* Bottom Lock / Interlock Hook */}
        <path d="M 30 78 L 32 78 C 36 78, 38 75, 38 71 L 38 67 C 38 65, 36 63, 33 63 L 31 63" />
      </g>
      
      {/* Measurement annotations */}
      <g strokeWidth="0.75" className="stroke-cyan-300/50 text-[5px] fill-cyan-400 font-mono">
        {/* Siding Height */}
        <line x1="68" y1="10" x2="68" y2="78" />
        <line x1="65" y1="10" x2="71" y2="10" />
        <line x1="65" y1="78" x2="71" y2="78" />
        <text x="72" y="47" textAnchor="start" fontSize="6" className="fill-cyan-400 font-bold">8.0" COVERAGE</text>
        
        {/* Thickness */}
        <line x1="22" y1="50" x2="22" y2="78" strokeDasharray="1 1" />
        <path d="M 48 25 L 56 25" />
        <text x="58" y="27" fontSize="5" className="fill-cyan-400/80">THICKNESS: 0.046"</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-cyan-400">DOUBLE 4" PROFILE</text>
      </g>
    </svg>
  ),
  starterStrip: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-emerald-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-emerald" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(52, 211, 153, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-emerald)" stroke="none" />
      
      {/* Starter Strip Metal Profile */}
      <g className="stroke-emerald-500">
        {/* Flat Backing Plate with punch holes */}
        <path d="M 45 15 L 45 65" />
        {/* Nailing Slot */}
        <rect x="43" y="25" width="4" height="10" rx="1" className="stroke-emerald-400/60" />
        <rect x="43" y="45" width="4" height="10" rx="1" className="stroke-emerald-400/60" />
        
        {/* Bottom Siding Hook Projection */}
        <path d="M 45 65 L 45 75 Q 45 80, 50 82 L 58 84 Q 63 85, 63 78 L 63 70 L 59 70" />
      </g>
      
      {/* Dimension mark lines */}
      <g strokeWidth="0.75" className="stroke-emerald-300/50 text-[5px] fill-emerald-400 font-mono">
        <line x1="28" y1="15" x2="28" y2="82" />
        <line x1="25" y1="15" x2="31" y2="15" />
        <line x1="25" y1="82" x2="31" y2="82" />
        <text x="20" y="50" textAnchor="middle" rotate="-90" fontSize="6" className="fill-emerald-400 font-bold">2.5" HEIGHT</text>
        
        <path d="M 63 70 L 75 70" />
        <text x="77" y="72" fontSize="5.5" className="fill-emerald-400/80">LOCK RECEPTACLE</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-emerald-400">GALVANIZED STARTER</text>
      </g>
    </svg>
  ),
  stoneCorner: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-amber-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-amber" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(251, 191, 36, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-amber)" stroke="none" />
      
      {/* 3D Isometric dry-stack stone corner block */}
      <g className="stroke-amber-500 fill-amber-500/10" strokeLinejoin="round">
        {/* Top Stone Layer Face Left */}
        <polygon points="50,40 25,28 25,50 50,62" />
        {/* Top Stone Layer Face Right */}
        <polygon points="50,40 75,28 75,50 50,62" />
        {/* Top Stone Top Face */}
        <polygon points="50,40 25,28 50,16 75,28" />
        
        {/* Middle Layer (Offset stone textures) */}
        <polygon points="50,62 30,52 30,72 50,82" className="stroke-amber-400/80" />
        <polygon points="50,62 70,52 70,72 50,82" className="stroke-amber-400/80" />
        
        {/* Bottom Layer */}
        <polygon points="50,82 25,70 25,90 50,102" />
        <polygon points="50,82 75,70 75,90 50,102" />
        
        {/* Structural joint outlines */}
        <path d="M 50,16 L 50,102" strokeDasharray="1.5 1.5" className="stroke-amber-300/40" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-amber-300/50 text-[5px] fill-amber-400 font-mono">
        <line x1="80" y1="28" x2="80" y2="90" />
        <line x1="77" y1="28" x2="83" y2="28" />
        <line x1="77" y1="90" x2="83" y2="90" />
        <text x="84" y="62" fontSize="5.5" className="fill-amber-400 font-bold">12" CORNER HGT</text>
        
        <text x="14" y="38" fontSize="5" className="fill-amber-400/80">90° REJECTION</text>
        <text x="50" y="112" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-amber-400">LEDGESTONE 90° CORNER</text>
      </g>
    </svg>
  ),
  windowSash: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-sky-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-sky" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-sky)" stroke="none" />
      
      {/* Vinyl double-hung window profile with triple chamber cavities */}
      <g className="stroke-sky-500">
        {/* Outer Frame Frame Box */}
        <rect x="25" y="15" width="50" height="75" rx="2" />
        {/* Inner Glazing Bead Channel */}
        <rect x="31" y="21" width="38" height="63" rx="1" className="stroke-sky-400/60" />
        
        {/* Insulated Dual Glass Panes */}
        <line x1="46" y1="25" x2="46" y2="80" strokeWidth="1" className="stroke-sky-300" />
        <line x1="54" y1="25" x2="54" y2="80" strokeWidth="1" className="stroke-sky-300" />
        {/* Spacer / Desiccant bar */}
        <rect x="46" y="48" width="8" height="6" className="fill-sky-500/10 stroke-sky-400" />
        
        {/* Thermal multi-cavity walls */}
        <path d="M 25 35 L 31 35 M 25 65 L 31 35 M 69 35 L 75 35 M 69 65 L 75 65" strokeWidth="0.75" strokeDasharray="1.5 1" />
        {/* Interlocking sash seal rail bottom */}
        <path d="M 20 90 L 80 90 M 20 15 L 80 15" strokeWidth="0.75" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-sky-300/50 text-[5px] fill-sky-400 font-mono">
        <text x="50" y="44" textAnchor="middle" fontSize="5" className="fill-sky-400 font-bold">LOW-E CAVITY</text>
        <path d="M 50 51 L 50 62 L 62 62" strokeWidth="0.5" />
        <text x="64" y="64" fontSize="4.5" className="fill-sky-400/75">ARGON SPACER</text>
        
        <line x1="18" y1="15" x2="18" y2="90" />
        <text x="12" y="55" rotate="-90" textAnchor="middle" fontSize="6.5" className="fill-sky-400 font-bold">36" WIDTH CLASS</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-sky-400">DOUBLE-HUNG GLAZING SASH</text>
      </g>
    </svg>
  ),
  balanceSpring: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-blue-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-blue" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(96, 165, 250, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-blue)" stroke="none" />
      
      {/* Coiled stainless steel tape spring balance */}
      <g className="stroke-blue-500">
        {/* Concentric spring coil lines */}
        <circle cx="50" cy="45" r="28" strokeDasharray="3 1" className="stroke-blue-400/50" />
        <circle cx="50" cy="45" r="24" />
        <circle cx="50" cy="45" r="18" />
        <circle cx="50" cy="45" r="11" />
        <circle cx="50" cy="45" r="5" className="fill-blue-500/20" />
        
        {/* Straight drawing ribbon tape coming out downward */}
        <path d="M 22 45 L 22 90" />
        {/* Anchor slot eyelet */}
        <circle cx="22" cy="85" r="2" className="fill-blue-400 stroke-none" />
        {/* High-tension housing clip */}
        <rect x="42" y="10" width="16" height="10" rx="1" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-blue-300/50 text-[5px] fill-blue-400 font-mono">
        <path d="M 22 85 L 12 85" />
        <text x="10" y="87" textAnchor="end" fontSize="5" className="fill-blue-400">ANCHOR HOLE</text>
        
        <path d="M 50 45 L 75 65" />
        <text x="77" y="67" fontSize="5" className="fill-blue-400 font-bold">15 LB SPRING</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-blue-400">SASH BALANCE RECOIL</text>
      </g>
    </svg>
  ),
  camLock: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-sky-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-sky-light" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-sky-light)" stroke="none" />
      
      {/* Cam Action Sash Lock with latch rotating guide */}
      <g className="stroke-sky-500">
        {/* Oval Mounting Base plate */}
        <rect x="25" y="40" width="50" height="22" rx="6" />
        {/* Left screw hole */}
        <circle cx="34" cy="51" r="2.5" />
        <line x1="30" y1="51" x2="38" y2="51" strokeWidth="0.5" />
        {/* Right screw hole */}
        <circle cx="66" cy="51" r="2.5" />
        <line x1="62" y1="51" x2="70" y2="51" strokeWidth="0.5" />
        
        {/* Center Rotating Cam Core */}
        <circle cx="50" cy="51" r="6" className="fill-sky-500/20" />
        {/* Swivel handle latch lever */}
        <path d="M 50 51 L 28 24 C 23 18, 14 26, 20 32 L 44 51" className="fill-sky-400/10" />
        
        {/* Locking swipe arc rotation path indicator */}
        <path d="M 50 31 A 20 20 0 0 1 70 51" strokeDasharray="2 2" className="stroke-sky-300/60" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-sky-300/50 text-[5px] fill-sky-400 font-mono">
        <line x1="34" y1="68" x2="66" y2="68" />
        <line x1="34" y1="65" x2="34" y2="71" />
        <line x1="66" y1="65" x2="66" y2="71" />
        <text x="50" y="76" textAnchor="middle" fontSize="6.5" className="fill-sky-400 font-bold">2.062" SCREW CENTER</text>
        
        <text x="73" y="32" fontSize="5" className="fill-sky-400/80">90° LOCK SWIVEL</text>
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-sky-400">CAM ACTION SASH LOCK</text>
      </g>
    </svg>
  ),
  standingSeam: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-orange-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-orange" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(251, 146, 60, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-orange)" stroke="none" />
      
      {/* MBCI Lok-Seam standing seam metal roof panel cross-section */}
      <g className="stroke-orange-500">
        {/* Left Side: Female Snap Rib */}
        <path d="M 15 50 L 15 15 C 15 11, 22 11, 22 15 L 22 25" />
        
        {/* Center Pan with strengthening striated ribs */}
        <path d="M 15 50 L 35 50 Q 37 47, 40 47 L 45 47 Q 48 50, 50 50 L 65 50" />
        
        {/* Right Side: Male Lock Profile and Clipping Flange */}
        <path d="M 65 50 L 65 20 C 65 17, 69 17, 71 20 L 71 52 L 85 52" />
        {/* Fastener screw hole guide */}
        <circle cx="78" cy="52" r="1.5" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-orange-300/50 text-[5px] fill-orange-400 font-mono">
        <line x1="15" y1="62" x2="71" y2="62" />
        <line x1="15" y1="59" x2="15" y2="65" />
        <line x1="71" y1="59" x2="71" y2="65" />
        <text x="43" y="70" textAnchor="middle" fontSize="6.5" className="fill-orange-400 font-bold">16.0" SEAM WIDTH</text>
        
        <line x1="10" y1="15" x2="10" y2="50" />
        <text x="4" y="32" fontSize="5.5" rotate="-90" textAnchor="middle" className="fill-orange-400 font-bold">1.75" SEAM HT</text>
        
        <path d="M 78 52 L 78 40 L 88 40" strokeWidth="0.5" />
        <text x="90" y="42" fontSize="4.5" className="fill-orange-400/80">FASTENER CLIP</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-orange-400">16" LOK-SEAM PROFILE</text>
      </g>
    </svg>
  ),
  insulatedPanel: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-orange-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-orange-heavy" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(251, 146, 60, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-orange-heavy)" stroke="none" />
      
      {/* Insulated metal wall panel section cut-away with textured insulation core */}
      <g className="stroke-orange-500">
        {/* Exterior steel skin (Top face) */}
        <path d="M 15 25 L 85 25" strokeWidth="1.5" />
        
        {/* Interior steel skin (Bottom face) */}
        <path d="M 15 55 L 85 55" strokeWidth="1.5" />
        
        {/* Polyurethane Foam Core Texture (Hatched or dotted) */}
        <g strokeWidth="0.5" className="stroke-orange-300/40">
          {[22, 32, 42, 52, 62, 72, 82].map((x) => (
            <g key={x}>
              <line x1={x} y1="25" x2={x - 6} y2="55" />
              <circle cx={x - 2} cy="35" r="0.75" />
              <circle cx={x - 4} cy="45" r="0.5" />
            </g>
          ))}
        </g>
        
        {/* Interlocking side joint profile left/right */}
        <path d="M 15 25 Q 11 25, 11 32 L 11 48 Q 11 55, 15 55" strokeWidth="1" strokeDasharray="2 1" />
        <path d="M 85 25 Q 89 25, 89 32 L 89 48 Q 89 55, 85 55" strokeWidth="1" strokeDasharray="2 1" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-orange-300/50 text-[5px] fill-orange-400 font-mono">
        <line x1="93" y1="25" x2="93" y2="55" />
        <line x1="90" y1="25" x2="96" y2="25" />
        <line x1="90" y1="55" x2="96" y2="55" />
        <text x="96" y="42" fontSize="5.5" className="fill-orange-400 font-bold">3.0" CORE</text>
        
        <text x="50" y="40" textAnchor="middle" fontSize="6.5" className="fill-orange-500 font-black tracking-widest bg-slate-900 px-1">PU FOAM CORE</text>
        <text x="18" y="21" fontSize="5" className="fill-orange-400/80">26 GA GALVALUME SKINS</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-orange-400">INSULATED WALL PANEL</text>
      </g>
    </svg>
  ),
  zPurlin: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-indigo-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-indigo" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(129, 140, 248, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-indigo)" stroke="none" />
      
      {/* Cold-formed steel Z-purlin diagonal perspective blueprint */}
      <g className="stroke-indigo-500">
        {/* Structural Profile shape */}
        {/* Top flange (Left) */}
        <path d="M 20 20 L 45 20" strokeWidth="1.5" />
        <path d="M 20 20 L 17 26" /> {/* Safety return lip */}
        
        {/* Web (Vertical center) */}
        <path d="M 45 20 L 30 75" strokeWidth="1.75" />
        
        {/* Bottom flange (Right) */}
        <path d="M 30 75 L 55 75" strokeWidth="1.5" />
        <path d="M 55 75 L 58 69" /> {/* Safety return lip */}
        
        {/* Perspective extrusion depth lines (drawn with dashed wireframe look) */}
        <path d="M 45 20 L 75 35 M 30 75 L 60 90 M 55 75 L 85 90" strokeDasharray="3 3" className="stroke-indigo-400/40" />
        <path d="M 75 35 L 60 90 L 85 90" strokeDasharray="2 2" className="stroke-indigo-300/40" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-indigo-300/50 text-[5px] fill-indigo-400 font-mono">
        <line x1="12" y1="20" x2="12" y2="75" />
        <line x1="9" y1="20" x2="15" y2="20" />
        <line x1="9" y1="75" x2="15" y2="75" />
        <text x="6" y="50" rotate="-90" textAnchor="middle" fontSize="6.5" className="fill-indigo-400 font-bold">8.0" WEB HGT</text>
        
        <text x="68" y="26" fontSize="5" className="fill-indigo-400/80">ASTM A653 GALV STEEL</text>
        <text x="38" y="85" fontSize="4.5" className="fill-indigo-400/70">PURLIN LAP MOUNTABLE</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-indigo-400">COLD-FORMED Z-PURLIN</text>
      </g>
    </svg>
  ),
  ridgeCap: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-orange-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-orange-light" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(251, 146, 60, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-orange-light)" stroke="none" />
      
      {/* Peaked flashing ridge cap profile */}
      <g className="stroke-orange-500">
        {/* Peak angle bend of 120 degrees */}
        <path d="M 15 50 L 50 30 L 85 50" strokeWidth="1.5" />
        
        {/* Water safety hems at edges */}
        <path d="M 15 50 L 11 48 L 13 45" />
        <path d="M 85 50 L 89 48 L 87 45" />
        
        {/* Roof line intersection guide */}
        <path d="M 11 58 L 50 38 L 89 58" strokeDasharray="3 2" className="stroke-orange-300/40" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-orange-300/50 text-[5px] fill-orange-400 font-mono">
        <path d="M 50 20 L 50 30" strokeWidth="0.5" />
        <text x="50" y="15" textAnchor="middle" fontSize="5.5" className="fill-orange-400 font-bold">120° BEND ANGLE</text>
        
        <line x1="15" y1="62" x2="85" y2="62" />
        <line x1="15" y1="59" x2="15" y2="65" />
        <line x1="85" y1="59" x2="85" y2="65" />
        <text x="50" y="70" textAnchor="middle" fontSize="6.5" className="fill-orange-400 font-bold">12.0" FLASHING WIDTH</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-orange-400">RIDGE CAP FLASHING</text>
      </g>
    </svg>
  ),
  handleSet: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-orange-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-orange-hdw" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(251, 146, 60, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-orange-hdw)" stroke="none" />
      <g className="stroke-orange-500">
        {/* Handle escutcheon plate */}
        <rect x="40" y="20" width="20" height="70" rx="4" />
        {/* Key cylinder cutouts */}
        <circle cx="50" cy="35" r="3.5" className="stroke-orange-400/60" />
        <path d="M 50 38.5 L 50 43 M 48 43 L 52 43" strokeWidth="1" className="stroke-orange-400/60" />
        {/* Screw mount holes */}
        <circle cx="50" cy="25" r="1.5" className="stroke-orange-300/40" />
        <circle cx="50" cy="85" r="1.5" className="stroke-orange-300/40" />
        {/* Lever Handle */}
        <path d="M 50 55 C 50 50, 60 50, 75 48 C 82 48, 85 53, 80 56 C 73 59, 58 58, 50 58" fill="rgba(251, 146, 60, 0.15)" strokeWidth="1.5" />
      </g>
      <g strokeWidth="0.75" className="stroke-orange-300/50 text-[5px] fill-orange-400 font-mono">
        <line x1="25" y1="25" x2="25" y2="85" />
        <line x1="22" y1="25" x2="28" y2="25" />
        <line x1="22" y1="85" x2="28" y2="85" />
        <text x="17" y="55" textAnchor="middle" rotate="-90" fontSize="5" className="fill-orange-400 font-bold">3.93" HOLE CTR</text>
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-orange-400">PATIO DOOR HANDLE</text>
      </g>
    </svg>
  ),
  gutterHanger: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-emerald-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-em-gut" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(52, 211, 153, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-em-gut)" stroke="none" />
      <g className="stroke-emerald-500">
        {/* Gutter Guard access panel perforated texture or hanger assembly */}
        <path d="M 20 50 L 80 50" strokeWidth="1.5" />
        {/* Hanger support clip */}
        <path d="M 20 50 Q 20 40, 25 35 L 35 35 Q 40 35, 45 42 L 55 42 L 75 50 Q 80 50, 80 55" />
        {/* Structural screw alignment */}
        <line x1="15" y1="30" x2="60" y2="55" strokeDasharray="3 2" className="stroke-emerald-400/50" />
        <path d="M 12 28 L 18 32 M 13 26 L 15 34" strokeWidth="1" className="stroke-emerald-400" />
      </g>
      <g strokeWidth="0.75" className="stroke-emerald-300/50 text-[5px] fill-emerald-400 font-mono">
        <text x="50" y="20" textAnchor="middle" fontSize="5.5" className="fill-emerald-400 font-bold">6.0" INTEGRAL ACCESS</text>
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-emerald-400">RAINWARE ACCESSORIES</text>
      </g>
    </svg>
  ),
  fencePost: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-indigo-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-indigo-post" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(129, 140, 248, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-indigo-post)" stroke="none" />
      <g className="stroke-indigo-500">
        {/* Outer square of vinyl post */}
        <rect x="25" y="25" width="50" height="50" rx="3" strokeWidth="1.5" />
        {/* Inner core thickness wall */}
        <rect x="28" y="28" width="44" height="44" rx="2" strokeWidth="0.75" strokeDasharray="2 1" className="stroke-indigo-400/50" />
        {/* Routed rail holes */}
        <rect x="25" y="38" width="5" height="24" rx="0.5" className="stroke-indigo-300/70 fill-indigo-500/10" />
        <rect x="70" y="38" width="5" height="24" rx="0.5" className="stroke-indigo-300/70 fill-indigo-500/10" />
      </g>
      <g strokeWidth="0.75" className="stroke-indigo-300/50 text-[5px] fill-indigo-400 font-mono">
        <line x1="25" y1="83" x2="75" y2="83" />
        <line x1="25" y1="80" x2="25" y2="86" />
        <line x1="75" y1="80" x2="75" y2="86" />
        <text x="50" y="91" textAnchor="middle" fontSize="6.5" className="fill-indigo-400 font-bold">5.0" x 5.0" PROFILE</text>
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-indigo-400">ROUTED VINYL POST</text>
      </g>
    </svg>
  ),
  cortexScrew: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-rose-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-rose-fast" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(244, 63, 94, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-rose-fast)" stroke="none" />
      <g className="stroke-rose-500">
        {/* Torx drive screw head */}
        <path d="M 30 25 L 70 25 L 60 35 L 53 35 L 53 85 L 47 85 L 47 35 L 40 35 Z" fill="rgba(244, 63, 94, 0.1)" />
        {/* Torx star drive socket representation */}
        <polygon points="50,27 52,30 55,30 53,32 54,35 50,33 46,35 47,32 45,30 48,30" className="stroke-rose-400/80 fill-rose-500/20" strokeWidth="0.5" />
        {/* Screw threads */}
        <path d="M 47 45 L 53 48 M 47 52 L 53 55 M 47 59 L 53 62 M 47 66 L 53 69 M 47 73 L 53 76 M 47 80 L 50 83" strokeWidth="1" />
        {/* Cortex plug cap */}
        <rect x="38" y="12" width="24" height="6" rx="1" className="stroke-rose-400 fill-rose-500/20" />
        <path d="M 44 18 L 44 24 M 56 18 L 56 24" strokeDasharray="1 1" className="stroke-rose-300/40" />
      </g>
      <g strokeWidth="0.75" className="stroke-rose-300/50 text-[5px] fill-rose-400 font-mono">
        <line x1="18" y1="25" x2="18" y2="85" />
        <line x1="15" y1="25" x2="21" y2="25" />
        <line x1="15" y1="85" x2="21" y2="85" />
        <text x="12" y="55" textAnchor="middle" rotate="-90" fontSize="5.5" className="fill-rose-400 font-bold">2.75" LENGTH</text>
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-rose-400">CORTEX FASTENER & PLUG</text>
      </g>
    </svg>
  ),
  customFabricated: (
    <svg viewBox="0 0 100 120" className="w-full h-full stroke-purple-400 fill-none" strokeWidth="1.2">
      <defs>
        <pattern id="grid-purple" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(192, 132, 252, 0.07)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-purple)" stroke="none" />
      
      {/* Custom structural fabrication icon (Extrusion / Press Brake Bend) */}
      <g className="stroke-purple-500">
        <rect x="20" y="20" width="60" height="60" rx="4" strokeWidth="1" strokeDasharray="3 3" className="stroke-purple-400/40" />
        
        {/* Custom bend cross-section */}
        <path d="M 25 25 L 35 25 L 35 55 L 65 55 L 65 75 L 75 75" strokeWidth="2" strokeLinecap="round" className="stroke-purple-400" />
        
        {/* Dynamic laser scan lines */}
        <line x1="20" y1="50" x2="80" y2="50" strokeWidth="0.75" className="stroke-purple-400 animate-pulse" />
        <polygon points="50,47 47,50 50,53 53,50" className="fill-purple-500 stroke-none" />
      </g>
      
      {/* Labels */}
      <g strokeWidth="0.75" className="stroke-purple-300/50 text-[5px] fill-purple-400 font-mono">
        <text x="50" y="14" textAnchor="middle" fontSize="5.5" className="fill-purple-400 font-bold tracking-wider animate-pulse">CNC INTERFEROMETER SCAN</text>
        <text x="50" y="90" textAnchor="middle" fontSize="5" className="fill-purple-400/80">FEA INTEGRITY RATED: 99.8%</text>
        
        {/* Title */}
        <text x="50" y="110" textAnchor="middle" fontSize="6.5" className="font-bold tracking-wider fill-purple-400 animate-pulse">CUSTOM CNC FLASHING</text>
      </g>
    </svg>
  )
}

// Beautiful custom markdown parser and renderer for premium Gemini-style responses
function MarkdownRenderer({ text }: { text: string }) {
  if (!text) return null;

  // Split text by lines
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let inList = false;

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1 text-[11px] text-slate-700 leading-relaxed font-sans">
          {currentList}
        </ul>
      );
      currentList = [];
    }
    inList = false;
  };

  // Helper to parse inline styles like **bold**, *italic*, and `code`
  const parseInline = (inlineText: string) => {
    const parts = inlineText.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-slate-800">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-[#0f2d59] font-bold">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: number) => {
    if (inTable && (tableHeaders.length > 0 || tableRows.length > 0)) {
      elements.push(
        <div key={`table-wrapper-${key}`} className="my-2.5 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-left text-[11px] border-collapse">
            {tableHeaders.length > 0 && (
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">
                  {tableHeaders.map((h, i) => (
                    <th key={i} className="py-2 px-3">{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100 font-sans text-slate-600">
              {tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  {row.map((cell, i) => (
                    <td key={i} className="py-2 px-3">{parseInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for tables
    if (line.startsWith('|')) {
      flushList(i);
      inTable = true;
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Skip separator row (e.g. | :--- | :--- |)
      if (cells.every(cell => /^[:-\s]+$/.test(cell))) {
        continue;
      }

      if (tableHeaders.length === 0) {
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable(i);
    }

    // Check for headers
    if (line.startsWith('#')) {
      flushList(i);
      const level = line.match(/^#+/)?.[0].length || 1;
      const title = line.replace(/^#+\s*/, '');
      const cleanTitle = parseInline(title);
      
      if (level === 1) elements.push(<h1 key={i} className="text-[13px] font-extrabold text-slate-900 mt-3.5 mb-1.5 first:mt-0 font-sans leading-snug">{cleanTitle}</h1>);
      else if (level === 2) elements.push(<h2 key={i} className="text-xs font-extrabold text-slate-900 mt-3 mb-1.5 first:mt-0 font-sans leading-snug">{cleanTitle}</h2>);
      else if (level === 3) elements.push(<h3 key={i} className="text-[11.5px] font-bold text-slate-950 mt-2.5 mb-1 first:mt-0 font-sans leading-snug">{cleanTitle}</h3>);
      else elements.push(<h4 key={i} className="text-[11px] font-bold text-slate-900 mt-2 mb-1 first:mt-0 font-sans leading-snug">{cleanTitle}</h4>);
      continue;
    }

    // Check for list items
    if (line.startsWith('* ') || line.startsWith('- ')) {
      inList = true;
      const itemText = line.substring(2);
      currentList.push(<li key={`li-${i}`}>{parseInline(itemText)}</li>);
      continue;
    } else {
      flushList(i);
    }

    // Paragraph
    if (line !== '') {
      elements.push(<p key={i} className="text-[11px] text-slate-600 leading-relaxed font-sans font-normal my-1">{parseInline(line)}</p>);
    }
  }

  flushList(lines.length);
  flushTable(lines.length);

  return <div className="space-y-0.5">{elements}</div>;
}

const INITIAL_PARTS: Part[] = [
  // --- A. SIDING & TRIM ACCESSORIES (Mastic & Ply Gem) ---
  {
    id: "EPVST",
    name: "Horizontal EverPlank Starter Strip",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Ply Gem",
    description: "Heavy-duty starter profile engineered to establish and secure the initial course of EverPlank siding cladding systems.",
    weight: 2.1,
    cost: 8.50,
    material: "G90 Galvanized Steel",
    finish: "Mill Galvanized Zinc Coating",
    specs: [
      { label: "Steel Gauge", value: "22 Gauge" },
      { label: "Profile Height", value: "2.5 inches" },
      { label: "Overall Length", value: "10 feet 0 inches" },
      { label: "Corrosion Resistance", value: "G90 Hot-Dip Coating" }
    ],
    svgBlueprint: Blueprints.starterStrip,
    hasPdfDatasheet: true,
    category: "Siding",
    subCategory: "Trim Accessories",
    materialComposition: "G90 Galvanized Carbon Steel",
    colors: ["Zinc Mill Finish"],
    compatibility: "Requires #8 x 1-1/2\" Flat Head Wood Screws",
    compliance: "ASTM A653 Standard G90"
  },
  {
    id: "EPJCHL",
    name: "Horizontal EverPlank J-Channel",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Mastic",
    description: "Multi-purpose side trim channel designed to receive and finish siding panels at window/door edges. Requires two J-channels ordered back-to-back for inside corner applications.",
    weight: 1.4,
    cost: 11.20,
    material: "Impact-Resistant PVC",
    finish: "Cedar-Grain Matte Finish",
    specs: [
      { label: "Nominal Thickness", value: "0.046 inches" },
      { label: "Channel Opening", value: "3/4 inch" },
      { label: "Face Width", value: "1-1/8 inches" },
      { label: "Panel Length", value: "12 feet 6 inches" }
    ],
    svgBlueprint: Blueprints.customFabricated, // Resilient trim shape representation
    category: "Siding",
    subCategory: "Trim Accessories",
    materialComposition: "Impact-Resistant PVC Vinyl",
    colors: ["Musket Brown", "Evergreen", "Pebblestone Clay", "Sandalwood"],
    compatibility: "Requires two J-channels ordered back-to-back for inside corners",
    compliance: "ASTM D3679 Class A Fire Rated"
  },
  {
    id: "EPBB",
    name: "EverPlank 10” Board & Batten Vertical Siding Panel",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Mastic",
    description: "Premium co-extruded rigid vertical siding panels featuring a classic Board & Batten look with a realistic cedar-wood texture.",
    weight: 5.6,
    cost: 19.80,
    material: "Rigid Polymeric PVC",
    finish: "Extruded Woodgrain Matte",
    specs: [
      { label: "Panel Exposure", value: "10.0 inches" },
      { label: "Thickness", value: "0.048 inches" },
      { label: "Panel Length", value: "10 feet 0 inches" },
      { label: "Wind Capacity", value: "Up to 195 mph rating" }
    ],
    svgBlueprint: Blueprints.vinylSiding,
    category: "Siding",
    subCategory: "Siding Panels",
    materialComposition: "Co-Extruded Rigid Polymeric PVC",
    colors: ["Pebblestone Clay", "Sandalwood", "Aged Cedar", "White"],
    compatibility: "Requires #8 x 1-1/4\" Truss Head Wood Screws",
    compliance: "ASTM D3679 Compliant"
  },
  {
    id: "27845594-MB",
    name: "Adams Casing HD Exterior Moulding Trim",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Ply Gem",
    description: "High-definition cellular PVC casing moulding designed to add elegant, rich shadows and frame windows or door accent openings.",
    weight: 4.8,
    cost: 26.50,
    material: "Cellular PVC Polymer",
    finish: "Smooth White Semi-Gloss Finish",
    specs: [
      { label: "Nominal Face Width", value: "3-1/2 inches" },
      { label: "Profile Depth", value: "1.0 inch" },
      { label: "Standard Length", value: "16 feet 0 inches" },
      { label: "Tensile Strength", value: "ASTM D638: 2500 PSI" }
    ],
    svgBlueprint: Blueprints.stoneCorner, // Multi-step shadow profile
    category: "Siding",
    subCategory: "Moulding",
    materialComposition: "Cellular PVC Polymeric Composite",
    colors: ["Sandalwood", "Pebblestone Clay", "Bright White"],
    compatibility: "Requires Ply Gem Cortex Screws (27845655-C) & matching finish plugs",
    compliance: "AAMA 103 Compliant, ASTM D638"
  },

  // --- B. WINDOW AND DOOR COMPONENTS (Builder Series & Mira Premium) ---
  {
    id: "460031005",
    name: "Builder Series Sliding Patio Door Handle Set",
    division: "windows",
    divisionLabel: "Windows & Patio Doors",
    brand: "Builder Series",
    description: "Heavy-duty interior/exterior replacement handle kit for Builder Series sliding glass patio doors, complete with latch actuators and lock cylinder.",
    weight: 1.2,
    cost: 34.00,
    material: "Die-Cast Zinc Alloy",
    finish: "Powder Coated Classic Gloss",
    specs: [
      { label: "Screw Hole Centers", value: "3-15/16 inches" },
      { label: "Latching Mechanism", value: "Thumb-Latch Actuated" },
      { label: "Handing Design", value: "Reversible Left/Right" },
      { label: "Compatible Range", value: "1.5\" to 1.75\" door frame" }
    ],
    svgBlueprint: Blueprints.handleSet,
    category: "Windows & Doors",
    subCategory: "Hardware Assemblies",
    materialComposition: "Die-Cast Zinc & Stainless Steel Lock Gear",
    colors: ["Classic White", "Satin Nickel", "Oil Rubbed Bronze"],
    compatibility: "Requires #8-32 Oval Head Machine Screws",
    compliance: "AAMA 101 Certified Hardware"
  },
  {
    id: "420122000",
    name: "Mira Premium Dual Mortise Lock Keeper Strike",
    division: "windows",
    divisionLabel: "Windows & Patio Doors",
    brand: "Mira Premium",
    description: "Stainless steel dual-locking strike keeper designed to anchor locking hooks on Mira Premium series sliding doors to maximize forced-entry resistance.",
    weight: 0.6,
    cost: 14.25,
    material: "Hardened Stainless Steel",
    finish: "Zinc-Plated Natural Silver",
    specs: [
      { label: "Overall Length", value: "4-5/8 inches" },
      { label: "Hole Centers", value: "4-1/16 inches" },
      { label: "Lock Projection", value: "0.187 inches adjustable" },
      { label: "Security Certified", value: "Forced Entry Certified Level 10" }
    ],
    svgBlueprint: Blueprints.camLock,
    category: "Windows & Doors",
    subCategory: "Hardware Assemblies",
    materialComposition: "Hardened Stainless Steel",
    colors: ["Zinc Plated Finish"],
    compatibility: "Requires #8 x 1-1/4\" Flat Head Security Screws",
    compliance: "Grade 40 Forced Entry Resistance Certified"
  },
  {
    id: "HP3MAX-GP",
    name: "Mira Premium HP3Max Insulated Glass Package",
    division: "windows",
    divisionLabel: "Windows & Patio Doors",
    brand: "Mira Premium",
    description: "High-performance triple-glazing insulated glass package featuring Low-E coating, warm-edge spacers, and Argon insulating gas fill for maximum Energy Star thermal ratings.",
    weight: 38.5,
    cost: 185.00,
    material: "Dual Low-E Glass & Argon Gas",
    finish: "Clear Low-E Tint",
    specs: [
      { label: "Insulating Fill", value: "90% Argon Gas Filled" },
      { label: "NFRC U-Factor", value: "0.22 BTU/h·ft²·°F (Low)" },
      { label: "Solar Heat Gain (SHGC)", value: "0.21 (Optimized)" },
      { label: "Visible Transmittance", value: "0.52 (High Clarity)" }
    ],
    svgBlueprint: Blueprints.insulatedPanel,
    category: "Windows & Doors",
    subCategory: "Glass Packages",
    materialComposition: "Dual Low-E Coated Float Glass with Argon Gas Fill",
    colors: ["Clear Low-E Tint"],
    compatibility: "Direct fit for Mira Premium Series Window Sashes",
    compliance: "ENERGY STAR® Version 7.0 Northern & North-Central Zone Certified"
  },

  // --- C. GUTTER & RAINWARE SYSTEMS (Leaf Relief & Performance Metals) ---
  {
    id: "APSN62",
    name: "Leaf Relief 6\" Gutter Guard Access Panel",
    division: "gutter",
    divisionLabel: "Gutter & Rainware Solutions",
    brand: "Leaf Relief",
    description: "Removable perforated access panel for Leaf Relief gutter systems, allowing for quick cleaning, washing, and downspout maintenance access.",
    weight: 0.8,
    cost: 12.90,
    material: "Perforated Hardened Aluminum",
    finish: "Alodine Mill Corrosion Proof Finish",
    specs: [
      { label: "Panel Cover Width", value: "6.0 inches" },
      { label: "Panel Length", value: "12.0 inches" },
      { label: "Hole Diameter", value: "1/16\" Perforations" },
      { label: "Water Siphoning Rate", value: "Up to 29\" rain/hr" }
    ],
    svgBlueprint: Blueprints.gutterHanger,
    category: "Gutter Systems",
    subCategory: "Gutter Accessories",
    materialComposition: "High-Grade Hardened Aluminum",
    colors: ["Mill Finish", "Classic Copper", "Musket Brown"],
    compatibility: "Requires #8-18 x 1/2\" Self-Piercing Screws",
    compliance: "ASTM B209 Aluminum Sheet Standard"
  },
  {
    id: "IC6220",
    name: "Leaf Relief 6\" Inside Corner Mitre Guard",
    division: "gutter",
    divisionLabel: "Gutter & Rainware Solutions",
    brand: "Leaf Relief",
    description: "Pre-fabricated 90-degree inside corner miter piece featuring Leaf Relief perforated design to secure gutter junctions against debris entry.",
    weight: 1.1,
    cost: 16.50,
    material: "Formed 0.019\" Aluminum",
    finish: "Baked-on Enamel Solid Color",
    specs: [
      { label: "Gutter Fitting Size", value: "6.0 inches" },
      { label: "Pre-fabricated Angle", value: "90 Degree Inside Corner" },
      { label: "Water Drainage Area", value: "14.5 sq inches" }
    ],
    svgBlueprint: Blueprints.stoneCorner,
    category: "Gutter Systems",
    subCategory: "Gutter Accessories",
    materialComposition: "Formed 0.019\" Painted Aluminum",
    colors: ["White", "Musket Brown", "Evergreen"],
    compatibility: "Requires 1/8\" Pop Rivets or Gutter Sealant",
    compliance: "ASTM B209 Standard Class 1A"
  },
  {
    id: "ISM6",
    name: "Performance Metals 6\" Inside Bay Gutter Miter",
    division: "gutter",
    divisionLabel: "Gutter & Rainware Solutions",
    brand: "Performance Metals",
    description: "Factory-formed inside bay corner miter for 6-inch K-style gutter systems, ensuring watertight joints and seamless transition profiles.",
    weight: 1.3,
    cost: 18.20,
    material: "Architectural Aluminum",
    finish: "Polyester Clay Paint Finish",
    specs: [
      { label: "Gutter Profile", value: "Standard K-Style" },
      { label: "Miter Dimension", value: "6 inches" },
      { label: "Seaming Joint Gap", value: "0.062\" overlap tolerance" }
    ],
    svgBlueprint: Blueprints.ridgeCap,
    category: "Gutter Systems",
    subCategory: "Gutter Accessories",
    materialComposition: "0.027\" Architectural Aluminum",
    colors: ["Evergreen", "Musket Brown", "Pebblestone Clay"],
    compatibility: "Requires 1/8\" Pop Rivets and Gutter Caulking Sealant",
    compliance: "AAMA 1405.1 Compliant"
  },
  {
    id: "AM5HID",
    name: "Performance Metals 5\" Hidden Gutter Hanger",
    division: "gutter",
    divisionLabel: "Gutter & Rainware Solutions",
    brand: "Performance Metals",
    description: "Heavy-gauge extruded aluminum internal hidden gutter hanger clip equipped with a preloaded high-load structural screw.",
    weight: 0.25,
    cost: 2.10,
    material: "Extruded Structural Aluminum",
    finish: "Natural Unpainted Mill Finish",
    specs: [
      { label: "Hanger Size Fit", value: "5.0 inches" },
      { label: "Standard Fastener", value: "Pre-loaded #10 x 3\" Type 17 Screw" },
      { label: "Load Capacity", value: "ASTM Class 4: 250 lbs per hanger" }
    ],
    svgBlueprint: Blueprints.starterStrip,
    category: "Gutter Systems",
    subCategory: "Gutter Accessories",
    materialComposition: "Heavy-Gauge Extruded Aluminum",
    colors: ["Mill Finish"],
    compatibility: "Requires #10 x 3\" High-Load Wood Screws (included)",
    compliance: "ASTM B221 Extrusion Standard"
  },

  // --- D. FENCING & RAILING COMPONENTS (Ply Gem Fence & Rail) ---
  {
    id: "FNC-POST",
    name: "Ply Gem Fence Standard Routed Privacy Post",
    division: "fencing",
    divisionLabel: "Fencing & Railing Components",
    brand: "Ply Gem",
    description: "Standard routed square vinyl post designed to support vinyl interlocking privacy rails and privacy panels with high UV resistance.",
    weight: 12.5,
    cost: 42.00,
    material: "Structural Vinyl (PVC)",
    finish: "UV-Stabilized Smooth Matte",
    specs: [
      { label: "Post Dimensions", value: "5.0\" x 5.0\" Square" },
      { label: "Overall Length", value: "8 feet 0 inches" },
      { label: "Wall Thickness", value: "0.135 inches (Heavy Duty)" }
    ],
    svgBlueprint: Blueprints.fencePost,
    category: "Fencing",
    subCategory: "Post Profiles & Accessories",
    materialComposition: "UV-Stabilized Structural Vinyl (PVC)",
    colors: ["Khaki", "Almond", "White"],
    compatibility: "Requires standard classic cap trims and interlocking pickets",
    compliance: "ASTM F964 Structural Vinyl Standard"
  },
  {
    id: "FNC-CAP-GOTHIC",
    name: "Ply Gem Fence Gothic Post Cap Accent",
    division: "fencing",
    divisionLabel: "Fencing & Railing Components",
    brand: "Ply Gem",
    description: "Architectural gothic curve post cap engineered to fit 5x5 structural posts and protect post interiors from rain accumulation.",
    weight: 0.8,
    cost: 9.50,
    material: "High-Impact Vinyl (PVC)",
    finish: "Smooth Solid Tone Finish",
    specs: [
      { label: "Cap Base Size", value: "5.0\" x 5.0\" Post Fit" },
      { label: "Overall Height", value: "6.5 inches" },
      { label: "Overlap Lip Gap", value: "1.0 inch fitting overlap" }
    ],
    svgBlueprint: Blueprints.ridgeCap,
    category: "Fencing",
    subCategory: "Post Profiles & Accessories",
    materialComposition: "High-Impact UV-Stable Vinyl",
    colors: ["Khaki", "Almond", "Aged Cedar"],
    compatibility: "Requires PVC Solvent Weld Cement or friction-fit placement",
    compliance: "ASTM F964 Certified"
  },
  {
    id: "FNC-PCKT-TG",
    name: "Ply Gem Fence Tongue & Groove 1x8 Picket",
    division: "fencing",
    divisionLabel: "Fencing & Railing Components",
    brand: "Ply Gem",
    description: "Heavy-duty co-extruded interlocking tongue & groove picket panel for vinyl privacy fencing systems.",
    weight: 3.4,
    cost: 11.20,
    material: "Co-Extruded Rigid PVC",
    finish: "Woodgrain Cedar-Embossed finish",
    specs: [
      { label: "Picket Dimensions", value: "7/8\" x 11.3\" Profile" },
      { label: "Segment Length", value: "5 feet 0 inches" },
      { label: "Lock Design", value: "Interlocking Tongue & Groove" }
    ],
    svgBlueprint: Blueprints.vinylSiding,
    category: "Fencing",
    subCategory: "Picket Profiles",
    materialComposition: "Heavy-Duty Co-Extruded PVC",
    colors: ["Khaki", "Almond", "Aged Cedar"],
    compatibility: "Requires structural bottom rails and standard posts",
    compliance: "ASTM F964 Class A Impact Certified"
  },
  {
    id: "FNC-HW-ZLOKK",
    name: "D&D Gate Hardware Z-Lokk Magnetic Lockable Latch",
    division: "fencing",
    divisionLabel: "Fencing & Railing Components",
    brand: "D&D Hardware",
    description: "High-tech key-lockable magnetic latch assembly featuring dual 6-pin locks and an ergonomicADA-compliant gate pull handle.",
    weight: 2.8,
    cost: 89.00,
    material: "Fiber-Reinforced Polymer",
    finish: "Satin Jet Black Finish",
    specs: [
      { label: "Post-to-Gate Gap", value: "3/8\" to 1-1/2\" range" },
      { label: "Key Cylinder Type", value: "Dual 6-pin re-keyable brass locks" },
      { label: "Magnetic Latch force", value: "Tested up to 10,000 cycles" }
    ],
    svgBlueprint: Blueprints.camLock,
    category: "Fencing",
    subCategory: "Gate Hardware",
    materialComposition: "Engineered Polymer Body & Stainless Steel Lock Core",
    colors: ["Jet Black Matte"],
    compatibility: "Requires standard self-closing hinges and flat or routed vinyl posts",
    compliance: "ADA Compliant Gate Access standard"
  },

  // --- E. TECHNICAL FASTENERS & INSTALLATION SUPPLIES ---
  {
    id: "27848655-C",
    name: "Ply Gem Cortex Screws with Plugs",
    division: "fasteners",
    divisionLabel: "Technical Fasteners",
    brand: "Ply Gem",
    description: "Precision ACQ-approved corrosion proof face-screws provided with matching plug caps in smooth or woodgrain finish to conceal fastener heads in trim boards.",
    weight: 4.2,
    cost: 48.00,
    material: "Corrosion Proof Steel / Vinyl plugs",
    finish: "ACQ-Approved Rust Coating",
    specs: [
      { label: "Screw Length", value: "2-3/4 inches" },
      { label: "Thread Diameter", value: "#10 Gauge Core" },
      { label: "Plugs Included", value: "224 Screws / 300 Plugs / 2 Torx bits" }
    ],
    svgBlueprint: Blueprints.cortexScrew,
    category: "Fasteners",
    subCategory: "Screws & Rivets",
    materialComposition: "ACQ Rust-Resistant Carbon Steel with matching PVC Plugs",
    colors: ["Woodgrain Pebble Clay Plugs", "Smooth Sandalwood Plugs", "White Plugs"],
    compatibility: "Requires Ply Gem Cortex Torx Setting tool (included)",
    compliance: "ASTM B117 Salt Spray Standard"
  },
  {
    id: "HEX-915-GASKET",
    name: "Performance Metals #9 x 1-1/2\" Hex-Head Coated Gasket Screw",
    division: "fasteners",
    divisionLabel: "Technical Fasteners",
    brand: "Performance Metals",
    description: "High-grade carbon steel self-piercing hex head wood screw featuring an EPDM rubber washer gasket for watertight sealing in metal roofing/siding installations.",
    weight: 0.05,
    cost: 0.15,
    material: "Heat-Treated Steel & EPDM",
    finish: "Evergreen Polyester Coated Cap",
    specs: [
      { label: "Screw Length", value: "1-1/2 inches" },
      { label: "Thread Size", value: "#9 Gauge" },
      { label: "Hex Drive Head", value: "1/4\" Hex Nut Runner" }
    ],
    svgBlueprint: Blueprints.cortexScrew,
    category: "Fasteners",
    subCategory: "Screws & Rivets",
    materialComposition: "Heat-Treated Carbon Steel with EPDM Rubber Washer",
    colors: ["Evergreen Cap", "Musket Brown Cap", "Mill Finish Zinc"],
    compatibility: "Requires 1/4\" Hex Nut Runner setting driver",
    compliance: "ASTM F593 Corrosion Proof Standard"
  },

  // --- METAL & COMMERCIAL solutions (retained) ---
  {
    id: "MTL-ROF-201",
    name: "MBCI Lok-Seam Standing Seam Metal Roof Panel",
    division: "metal",
    divisionLabel: "Metal Roofing & Walls",
    brand: "MBCI",
    description: "Architectural-grade snap-together standing seam structural steel roofing panel. Features factory-applied sealant, 1.75\" seam ribs, and concealed fastening clip flanges.",
    weight: 17.5,
    cost: 38.00,
    material: "High-Tensile Galvalume Steel",
    finish: "Kynar 500 Signature Slate Grey",
    specs: [
      { label: "Steel Sheet Thickness", value: "24 Gauge (Premium)" },
      { label: "Cover Width", value: "16.0 inches" },
      { label: "Rib Seam Height", value: "1.75 inches" },
      { label: "Standard Panel Length", value: "10 feet (Shippable)" }
    ],
    svgBlueprint: Blueprints.standingSeam,
    category: "Metal Roofing",
    subCategory: "Roof Panels",
    materialComposition: "High-Tensile Galvalume Steel",
    colors: ["Slate Grey", "Cornerstone Navy", "Forest Green"],
    compatibility: "Requires #9 x 1-1/2\" Hex-Head Coated Gasket Screws",
    compliance: "ASTM A653 / UL Fire Class A"
  },
  {
    id: "MTL-WAL-202",
    name: "Metl-Span CF Insulated Metal Architectural Wall Panel",
    division: "metal",
    divisionLabel: "Metal Roofing & Walls",
    brand: "Metl-Span",
    description: "Commercial architectural exterior insulated sandwich panel. Features high-performance polyurethane core bonded between 26-gauge Galvalume steel skins with a thermal-break dry joint.",
    weight: 41.2,
    cost: 115.00,
    material: "PU Foam Core / Galvalume Steel",
    finish: "Flouropon Textured Sandstone",
    specs: [
      { label: "Panel Cover Width", value: "42.0 inches" },
      { label: "Insulating Core Thick.", value: "3.0 inches" },
      { label: "Overall Panel Length", value: "8 feet (Segment)" }
    ],
    svgBlueprint: Blueprints.insulatedPanel,
    category: "Metal Roofing",
    subCategory: "Wall Panels",
    materialComposition: "PU Foam Core / Galvalume Steel",
    colors: ["Sandstone", "Alabaster White"],
    compatibility: "Requires heavy duty structural attachment clips",
    compliance: "ASTM E84 Class 1 Fire Spread"
  },
  {
    id: "MTL-STR-203",
    name: "Star Building Systems Structural Z-Purlin Member",
    division: "metal",
    divisionLabel: "Metal Roofing & Walls",
    brand: "Star Building Systems",
    description: "Heavy-duty cold-formed secondary structural steel Z-member. Engineered to span between main portal rigid frames to support metal roof panel fast clips.",
    weight: 48.5,
    cost: 45.00,
    material: "Cold-Formed High-Strength Steel",
    finish: "Pre-Galvanized Protective Mill Coat",
    specs: [
      { label: "Web Depth (Height)", value: "8.0 inches" },
      { label: "Steel Base Thickness", value: "14 Gauge (0.075\")" },
      { label: "Overall Length", value: "12 feet" }
    ],
    svgBlueprint: Blueprints.zPurlin,
    category: "Metal Roofing",
    subCategory: "Structural Framing",
    materialComposition: "Cold-Formed High-Strength Steel",
    colors: ["Mill Galvanized Silver"],
    compatibility: "Requires 1/2\" structural grade A325 bolts",
    compliance: "ASTM A653 Grade 55 structural standard"
  },
  {
    id: "MTL-ACC-204",
    name: "MBCI Pre-Formed Peaked Ridge Cap Flashing Trim",
    division: "metal",
    divisionLabel: "Metal Roofing & Walls",
    brand: "MBCI",
    description: "Premium heavy-duty ridge flashing, pre-peaked to cover standing seam peaks. Designed with water-safety returned hems and weather seal compression lines.",
    weight: 6.8,
    cost: 24.50,
    material: "Prepainted Galvalume Carbon Steel",
    finish: "Kynar 500 Cornerstone Navy Blue",
    specs: [
      { label: "Steel Gauge Thickness", value: "26 Gauge" },
      { label: "Flat Sheet Width", value: "12.0 inches (Girth)" },
      { label: "Peak Angle Profile", value: "120 Degrees (Peaked)" }
    ],
    svgBlueprint: Blueprints.ridgeCap,
    category: "Metal Roofing",
    subCategory: "Trim Accessories",
    materialComposition: "Prepainted Galvalume Carbon Steel",
    colors: ["Navy Blue", "Slate Grey", "Forest Green"],
    compatibility: "Requires #9 x 1-1/2\" Hex-Head Coated Gasket Screws",
    compliance: "AZ50 Galvalume Alloy ASTM"
  }
]

// Technical code-support configurations for the Cornerstone Gemini Assistant
const PROMPT_HELPERS = [
  {
    title: "Siding Wind Resistance Guide",
    short: "Calculate wind capacity",
    prompt: "I am drafting an exterior specification for a coastal commercial resort located in a Category III Hurricane Zone with active design winds of 130 mph. Analyze the technical structural capacity of the Mastic Quest Vinyl Siding Panel (Double 4\" profile, 0.046\" thickness). Does its Tornado-Tough interlocking hem meet these windload pressures? Show your calculation methodology."
  },
  {
    title: "NFRC Window Energy Star Rating",
    short: "Analyze thermal ratings",
    prompt: "Provide an analytical review of the Simonton DaylightMax Double-Hung Glazing Sash. Specifically, analyze its heat insulation factors (NFRC U-factor, SHGC, and Visible Transmittance). Does this multi-chamber Argon-filled sash qualify for the Energy Star Version 7.0 standards in the Northern Zone? If so, explain why."
  },
  {
    title: "Standing Seam Purlin Spacing",
    short: "Purlin Span Span Table",
    prompt: "For a pre-engineered commercial warehouse roof utilizing MBCI 16\" Lok-Seam standing seam panels, what is the maximum recommended span spacing for Star Building Systems 8\" Z-purlins under a design snow load of 30 psf and a dead load of 10 psf? Please draft a structured load-capacity table according to ASTM standards."
  }
]

interface Message {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: string
  codeSnippet?: string
  tableData?: { label: string; value: string }[]
  imageUrl?: string // To support rendering of uploaded images inside the workspace
}

export default function Home() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS)
  const [gcsSyncing, setGcsSyncing] = useState<boolean>(true)
  const [gcsError, setGcsError] = useState<string | null>(null)
  const [showSplash, setShowSplash] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDivision, setActiveCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("name-asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Project Bill of Materials (BOM) state
  const [bom, setBom] = useState<{ part: Part; quantity: number }[]>([
    { part: INITIAL_PARTS[0], quantity: 24 }, // 24 siding panels
    { part: INITIAL_PARTS[1], quantity: 4 },  // 4 starter strips
    { part: INITIAL_PARTS[3], quantity: 6 },  // 6 window sashes
    { part: INITIAL_PARTS[6], quantity: 8 }   // 8 standing seam panels
  ])
  const [selectedPart, setSelectedPart] = useState<Part | null>(INITIAL_PARTS[0])

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Hello! I am your Cornerstone Technical Specifications Assistant. I have indexed our entire exterior parts library—including siding systems, high-efficiency window sashes, and pre-engineered commercial metal systems. Let me know if you need to calculate wind load tolerances, compare thermal U-factors, check structural span deflection limits, or configure custom components!",
      timestamp: "09:40"
    }
  ])
  const [chatInput, setChatInput] = useState("")
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null) // New image upload state
  const [activeTab, setActiveTab] = useState<string>("parts") // Track selected workspace tab

  // Custom Flashing/Trim Configurator State
  const [trimProfile, setTrimProfile] = useState<"j-channel" | "corner-post" | "ridge-cap" | "drip-edge" | "u-trim">("j-channel")
  const [trimLength, setTrimLength] = useState<number>(10) // in feet (5 - 30)
  const [trimGauge, setTrimGauge] = useState<string>("24 ga") // 22, 24, 26, 29
  const [trimMaterial, setTrimMaterial] = useState<string>("Galvalume Steel") // Steel, Aluminum, Vinyl
  const [trimColor, setTrimColor] = useState<string>("Cornerstone Navy") // Navy, White, Grey, Green, Sand, Bronze
  const [fabricatePrompt, setFabricatePrompt] = useState("")
  const [fabricateStep, setFabricateStep] = useState<number>(-1) // -1 is idle, 0 to 6 are steps, 7 is done
  const [newlyFabricatedPart, setNewlyFabricatedPart] = useState<Part | null>(null)
  
  // Cloud Storage PDF Datasheet State
  const [pdfLoading, setPdfLoading] = useState(false)
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null)

  // CAD Canvas State
  const [blueprintZoom, setBlueprintZoom] = useState<number>(1)
  const [blueprintPan, setBlueprintPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showBlueprintGrid, setShowBlueprintGrid] = useState<boolean>(true)
  const [showBlueprintAnnotations, setShowBlueprintAnnotations] = useState<boolean>(true)
  const [isDraggingBlueprint, setIsDraggingBlueprint] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // BOM Export / Quote Sheet State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [contractorName, setContractorName] = useState<string>("Cornerstone Custom Contracting")
  const [projectAddress, setProjectAddress] = useState<string>("100 Summit Ridge Blvd, Denver, CO 80201")
  const [projectContact, setProjectContact] = useState<string>("specs@cornerstonecustom.com")

  // Reset blueprint canvas view whenever the active selected part changes
  useEffect(() => {
    setBlueprintZoom(1)
    setBlueprintPan({ x: 0, y: 0 })
  }, [selectedPart])

  // Load dynamic GCS parts from Cloud Storage on app mount
  useEffect(() => {
    const loadGcsParts = async () => {
      try {
        const res = await fetch(`/api/gcs-parts?t=${Date.now()}`)
        const data = await res.json()
        if (data.error) {
          setGcsError(data.error)
        } else if (data.parts && Array.isArray(data.parts)) {
          // Map each part to its corresponding vector blueprint drawing
          const mappedParts = data.parts.map((part: any) => {
            let svgBlueprint = Blueprints.vinylSiding // default
            
            const lowerName = part.name.toLowerCase()
            if (part.division === "windows") {
              svgBlueprint = Blueprints.windowSash
            } else if (part.division === "fencing") {
              svgBlueprint = Blueprints.fencePost
            } else if (part.division === "gutter") {
              svgBlueprint = Blueprints.gutterHanger
            } else if (lowerName.includes("stone")) {
              svgBlueprint = Blueprints.stoneCorner
            } else if (lowerName.includes("screw") || lowerName.includes("fasten") || lowerName.includes("cortex")) {
              svgBlueprint = Blueprints.cortexScrew
            } else if (lowerName.includes("trim") || lowerName.includes("metals") || lowerName.includes("flashing")) {
              svgBlueprint = Blueprints.customFabricated
            } else if (lowerName.includes("starter")) {
              svgBlueprint = Blueprints.starterStrip
            }

            return {
              ...part,
              svgBlueprint
            }
          })
          
          // Merge dynamic GCS parts into parts catalog list
          setParts(prev => {
            const existingIds = new Set(prev.map(p => p.id))
            const uniqueNew = mappedParts.filter((p: any) => !existingIds.has(p.id))
            return [...prev, ...uniqueNew]
          })
        }
      } catch (err: any) {
        console.error("Failed to dynamically load parts from GCS back-end:", err)
        setGcsError(err.message || "Failed to establish cloud sync connection")
      } finally {
        setGcsSyncing(false)
      }
    }
    loadGcsParts()
  }, [])

  const handleViewDatasheet = async (partId: string) => {
    setPdfLoading(true)
    try {
      const res = await fetch(`/api/datasheets?partId=${partId}`)
      const data = await res.json()
      if (data.url) {
        setActivePdfUrl(data.url)
      } else {
        alert("Error loading datasheet: " + (data.error || "File not found."))
      }
    } catch (err) {
      console.error(err)
      alert("Failed to fetch PDF datasheet from cloud server.")
    } finally {
      setPdfLoading(false)
    }
  }
  
  // Ref for scrolling terminal to bottom
  const terminalBottomRef = useRef<HTMLDivElement>(null)

  // System calculations for Bill of Materials (BOM)
  const bomMetrics = useMemo(() => {
    const totalWeight = bom.reduce((sum, item) => sum + (item.part.weight * item.quantity), 0)
    const totalCost = bom.reduce((sum, item) => sum + (item.part.cost * item.quantity), 0)
    const activeComponentsCount = bom.reduce((sum, item) => sum + item.quantity, 0)
    
    // Shipping logistics recommendation based on cumulative weight
    let logisticsType = "Standard Courier Dispatch"
    let logisticsDesc = "Single parcel courier service (UPS / FedEx Freight)."
    if (totalWeight > 50 && totalWeight <= 500) {
      logisticsType = "LTL Freight Box Truck"
      logisticsDesc = "Less-Than-Truckload freight delivery with lift-gate service."
    } else if (totalWeight > 500 && totalWeight <= 4000) {
      logisticsType = "Heavy Duty Flatbed Gooseneck"
      logisticsDesc = "Medium-capacity flatbed cargo trailer with structural rack stabilization."
    } else if (totalWeight > 4000) {
      logisticsType = "Multi-Axle Semi Flatbed (Full Cargo Load)"
      logisticsDesc = "Class 8 heavy tractor-trailer optimized for wide architectural panels and structural framing."
    }

    return { totalWeight, totalCost, activeComponentsCount, logisticsType, logisticsDesc }
  }, [bom])

  // Real-time catalog filtering
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesSearch = 
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.divisionLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (part.category && part.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (part.subCategory && part.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (part.materialComposition && part.materialComposition.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (part.compliance && part.compliance.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (part.colors && part.colors.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
      
      const matchesDivision = activeDivision === "all" || part.division === activeDivision

      return matchesSearch && matchesDivision
    }).sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name)
      if (sortBy === "name-desc") return b.name.localeCompare(a.name)
      if (sortBy === "cost-asc") return a.cost - b.cost
      if (sortBy === "cost-desc") return b.cost - a.cost
      if (sortBy === "weight-asc") return a.weight - b.weight
      return b.weight - a.weight
    })
  }, [parts, searchQuery, activeDivision, sortBy])

  // Derived properties of the dynamically configured trim profile
  const configuredTrimSpecs = useMemo(() => {
    // Basic weight coefficient calculation based on gauge and material
    let gaugeMultiplier = 1.0
    if (trimGauge === "22 ga") gaugeMultiplier = 1.4
    if (trimGauge === "26 ga") gaugeMultiplier = 0.75
    if (trimGauge === "29 ga") gaugeMultiplier = 0.55
    
    let materialMultiplier = 1.0
    if (trimMaterial === "Painted Aluminum") materialMultiplier = 0.35
    if (trimMaterial === "Premium Vinyl") materialMultiplier = 0.15

    let profileComplexity = 1.0
    if (trimProfile === "corner-post") profileComplexity = 1.6
    if (trimProfile === "ridge-cap") profileComplexity = 1.3
    if (trimProfile === "u-trim") profileComplexity = 0.8

    // Calculate weight in lbs
    const weight = parseFloat((trimLength * 0.45 * gaugeMultiplier * materialMultiplier * profileComplexity).toFixed(1))
    // Calculate cost in USD
    const cost = parseFloat((trimLength * 1.85 * (gaugeMultiplier * 0.9 + 0.1) * (materialMultiplier * 1.1) * profileComplexity).toFixed(2))

    return { weight, cost }
  }, [trimProfile, trimLength, trimGauge, trimMaterial])

  // Dynamic SVG rendering reflecting configuration parameters (color and text tags)
  const renderConfiguredTrimSvg = () => {
    const strokeColor = 
      trimColor === "Cornerstone Navy" ? "#38bdf8" : 
      trimColor === "Classic White" ? "#f8fafc" : 
      trimColor === "Slate Grey" ? "#94a3b8" : 
      trimColor === "Forest Green" ? "#4ade80" : 
      trimColor === "Bronze Gold" ? "#fbbf24" : "#f59e0b" // Desert Sand

    const pName = trimProfile.toUpperCase().replace("-", " ")
    
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full fill-none" stroke={strokeColor} strokeWidth="1.5">
        <defs>
          <pattern id="grid-custom" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(192, 132, 252, 0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-custom)" stroke="none" />
        
        {/* Draw specific profile outlines */}
        {trimProfile === "j-channel" && (
          <g>
            <path d="M 55 25 L 55 75 L 35 75 L 35 60 L 45 60" />
            <circle cx="55" cy="35" r="1.5" stroke="rgba(192, 132, 252, 0.4)" />
            <circle cx="55" cy="55" r="1.5" stroke="rgba(192, 132, 252, 0.4)" />
          </g>
        )}
        {trimProfile === "corner-post" && (
          <g>
            <path d="M 25 35 L 25 75 L 65 75" />
            <path d="M 25 35 L 31 35 L 31 69 L 65 69 L 65 75" strokeDasharray="1.5 1.5" strokeWidth="1" stroke="rgba(192, 132, 252, 0.4)" />
          </g>
        )}
        {trimProfile === "ridge-cap" && (
          <g>
            <path d="M 15 65 L 50 35 L 85 65" />
            <path d="M 15 65 L 12 62 L 15 59 M 85 65 L 88 62 L 85 59" strokeWidth="1" />
          </g>
        )}
        {trimProfile === "drip-edge" && (
          <g>
            <path d="M 25 25 L 50 25 L 75 55 L 75 70" />
            <path d="M 75 70 L 71 68" strokeWidth="1" />
          </g>
        )}
        {trimProfile === "u-trim" && (
          <g>
            <path d="M 30 35 L 30 75 L 70 75 L 70 35" />
            <path d="M 30 35 L 34 35 M 70 35 L 66 35" strokeWidth="1" />
          </g>
        )}

        {/* Dynamic labels showing inputs */}
        <g strokeWidth="0.5" stroke="rgba(192, 132, 252, 0.4)" className="text-[5.5px] fill-purple-400 font-mono">
          <text x="50" y="15" textAnchor="middle" stroke="none" className="fill-purple-400 font-bold tracking-widest">{pName} PROFILE</text>
          
          <text x="50" y="93" textAnchor="middle" stroke="none" className="fill-purple-300 font-semibold">{trimLength} FT | {trimGauge} | {trimColor.toUpperCase()}</text>
          <text x="50" y="103" textAnchor="middle" stroke="none" className="fill-purple-400 font-bold">{configuredTrimSpecs.weight} LBS | ${configuredTrimSpecs.cost}</text>
        </g>
      </svg>
    )
  }

  // ==========================================
  // INTERACTIONS / EVENT HANDLERS
  // ==========================================

  // Add component to BOM
  const addToBom = (part: Part) => {
    setBom(prev => {
      const existing = prev.find(item => item.part.id === part.id)
      if (existing) {
        return prev.map(item => item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { part, quantity: 1 }]
    })
  }

  // Remove component from BOM
  const removeFromBom = (partId: string) => {
    setBom(prev => prev.filter(item => item.part.id !== partId))
  }

  // Adjust item quantity in BOM
  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromBom(partId)
      return
    }
    setBom(prev => prev.map(item => item.part.id === partId ? { ...item, quantity } : item))
  }

  // Download BOM as clean CSV spreadsheet
  const downloadBomCsv = () => {
    if (bom.length === 0) return
    let csvContent = "data:text/csv;charset=utf-8," 
      + "Part ID,Part Name,Division,Brand,Quantity,Unit Weight (lbs),Total Weight (lbs),Unit Cost (USD),Total Cost (USD)\n"
    
    bom.forEach(item => {
      const totalWt = item.part.weight * item.quantity
      const totalCst = item.part.cost * item.quantity
      csvContent += `"${item.part.id}","${item.part.name.replace(/"/g, '""')}","${item.part.division}","${item.part.brand}",${item.quantity},${item.part.weight},${totalWt.toFixed(2)},${item.part.cost},${totalCst.toFixed(2)}\n`
    })
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Cornerstone_BOM_Project_Quote_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Render interactive 2D Cargo Load Visualizer
  const renderCargoVisualizer = () => {
    const weight = bomMetrics.totalWeight
    let vehicleType: "courier" | "boxtruck" | "flatbed" | "semi" = "courier"
    let maxWeight = 100
    if (weight > 50 && weight <= 500) {
      vehicleType = "boxtruck"
      maxWeight = 1000
    } else if (weight > 500 && weight <= 4000) {
      vehicleType = "flatbed"
      maxWeight = 5000
    } else if (weight > 4000) {
      vehicleType = "semi"
      maxWeight = 25000
    }
    
    const pct = Math.min((weight / maxWeight) * 100, 100)
    
    return (
      <div className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 shadow-inner flex flex-col gap-2 mt-2 no-print">
        <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider text-orange-400">
          <span>ACTIVE CARGO CAPACITY VISUALIZER</span>
          <span>LOAD: {pct.toFixed(0)}%</span>
        </div>
        
        {/* 2D Vector Cargo Bay and Vehicle */}
        <div className="h-16 w-full flex items-end justify-center bg-slate-950 rounded-lg p-1.5 relative border border-slate-800/80 overflow-hidden">
          {/* Draw the specific vehicle profile path */}
          <svg viewBox="0 0 200 50" className="w-full h-full stroke-slate-500 fill-none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {/* Ground Line */}
            <line x1="5" y1="42" x2="195" y2="42" stroke="rgba(71, 85, 105, 0.4)" strokeDasharray="2 2" />
            
            {vehicleType === "courier" && (
              <g>
                {/* Delivery Courier Van Profile */}
                <path d="M 45 42 L 55 42 Q 57 42, 57 37 Q 57 35, 63 35 L 75 35 Q 85 35, 90 28 L 105 28 Q 110 28, 112 32 L 115 37 L 115 42 L 155 42 Q 158 42, 158 39 L 158 18 Q 158 15, 155 15 L 65 15 Q 60 15, 60 18 L 45 35 Z" className="stroke-slate-600 fill-slate-800/20" />
                {/* Wheels */}
                <circle cx="70" cy="42" r="5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="70" cy="42" r="2" className="fill-slate-400" />
                <circle cx="130" cy="42" r="5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="130" cy="42" r="2" className="fill-slate-400" />
                {/* Cargo Bay Area inside van */}
                <rect x="78" y="18" width="72" height="20" rx="1" className="stroke-orange-500/20 fill-orange-500/5" strokeDasharray="1.5 1.5" />
                {/* Render items as tiny filled blocks inside Cargo Bay */}
                <g className="fill-orange-400/80 stroke-orange-300/40" strokeWidth="0.5">
                  {bom.map((item, idx) => {
                    const blockWidth = Math.min(item.quantity * 1.5, 30);
                    const blockHeight = 8;
                    const xOffset = 80 + (idx * 16) % 55;
                    const yOffset = 30 - (Math.floor(idx / 3) * 9);
                    if (yOffset > 18) {
                      return <rect key={item.part.id} x={xOffset} y={yOffset} width={blockWidth} height={blockHeight} rx="0.5" />;
                    }
                    return null;
                  })}
                </g>
              </g>
            )}

            {vehicleType === "boxtruck" && (
              <g>
                {/* Box Truck Profile */}
                {/* Cab */}
                <path d="M 25 42 L 45 42 L 45 22 L 35 22 L 28 32 L 25 35 Z" className="stroke-slate-600 fill-slate-800/20" />
                {/* Cargo Box */}
                <rect x="48" y="12" width="125" height="30" rx="1.5" className="stroke-slate-600 fill-slate-800/10" />
                {/* Wheels */}
                <circle cx="35" cy="42" r="6" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="35" cy="42" r="2" className="fill-slate-400" />
                <circle cx="120" cy="42" r="6" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="120" cy="42" r="2" className="fill-slate-400" />
                <circle cx="134" cy="42" r="6" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="134" cy="42" r="2" className="fill-slate-400" />
                
                {/* Cargo Bay Area Inside Box */}
                <rect x="52" y="15" width="117" height="24" rx="1" className="stroke-cyan-500/20 fill-cyan-500/5" strokeDasharray="1.5 1.5" />
                {/* Dynamic Stacked cargo boxes inside bay */}
                <g strokeWidth="0.5">
                  {bom.map((item, idx) => {
                    // Color code by division
                    const colors = 
                      item.part.division === "siding" ? "fill-blue-500/75 stroke-blue-300/60" :
                      item.part.division === "windows" ? "fill-sky-500/75 stroke-sky-300/60" :
                      item.part.division === "metal" ? "fill-orange-500/75 stroke-orange-300/60" :
                      item.part.division === "custom" ? "fill-purple-500/75 stroke-purple-300/60" :
                      "fill-amber-500/75 stroke-amber-300/60";
                      
                    const blockWidth = Math.min(item.quantity * 2, 45);
                    const blockHeight = 10;
                    const xOffset = 55 + (idx * 28) % 85;
                    const yOffset = 27 - (Math.floor(idx / 3) * 11);
                    if (yOffset > 13) {
                      return <rect key={item.part.id} x={xOffset} y={yOffset} width={blockWidth} height={blockHeight} rx="0.5" className={colors} />;
                    }
                    return null;
                  })}
                </g>
              </g>
            )}

            {vehicleType === "flatbed" && (
              <g>
                {/* Medium flatbed truck */}
                {/* Cab */}
                <path d="M 15 42 L 35 42 L 35 24 L 28 24 L 20 32 L 15 35 Z" className="stroke-slate-600 fill-slate-800/20" />
                {/* Flatbed bed */}
                <line x1="35" y1="36" x2="185" y2="36" strokeWidth="2.5" className="stroke-slate-600" />
                <line x1="185" y1="36" x2="185" y2="42" className="stroke-slate-600" />
                {/* Wheels */}
                <circle cx="26" cy="42" r="5.5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="26" cy="42" r="2.2" className="fill-slate-400" />
                <circle cx="120" cy="42" r="5.5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="120" cy="42" r="2.2" className="fill-slate-400" />
                <circle cx="132" cy="42" r="5.5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="132" cy="42" r="2.2" className="fill-slate-400" />
                <circle cx="144" cy="42" r="5.5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.5" />
                <circle cx="144" cy="42" r="2.2" className="fill-slate-400" />
                
                {/* Stacked building pallets on the flatbed bed */}
                <g strokeWidth="0.5" className="stroke-slate-300/40">
                  {bom.map((item, idx) => {
                    const colors = 
                      item.part.division === "siding" ? "fill-blue-500/70" :
                      item.part.division === "windows" ? "fill-sky-500/70" :
                      item.part.division === "metal" ? "fill-orange-500/70" :
                      item.part.division === "custom" ? "fill-purple-500/70" :
                      "fill-amber-500/70";
                      
                    const blockWidth = Math.min(item.quantity * 2.5, 50);
                    const blockHeight = 12;
                    const xOffset = 38 + (idx * 38) % 115;
                    const yOffset = 24 - (Math.floor(idx / 3) * 13);
                    if (yOffset > 5) {
                      return (
                        <g key={item.part.id}>
                          <rect x={xOffset} y={yOffset} width={blockWidth} height={blockHeight} rx="0.5" className={colors} />
                          {/* Straps/Bindings holding cargo */}
                          <line x1={xOffset + blockWidth/2} y1={yOffset} x2={xOffset + blockWidth/2} y2={35} stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                        </g>
                      )
                    }
                    return null;
                  })}
                </g>
              </g>
            )}

            {vehicleType === "semi" && (
              <g>
                {/* Semi Class 8 Tractor Trailer */}
                {/* Tractor/Cab */}
                <path d="M 10 42 L 35 42 L 35 18 L 28 18 Q 24 18, 24 25 L 14 30 L 10 33 Z" className="stroke-slate-600 fill-slate-800/25" strokeWidth="1.2" />
                <circle cx="16" cy="42" r="5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.2" />
                <circle cx="28" cy="42" r="5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.2" />
                
                {/* Long Trailer Container */}
                <rect x="38" y="10" width="155" height="32" rx="2" className="stroke-slate-600 fill-slate-800/10" strokeWidth="1.2" />
                {/* Trailer Double-Axles */}
                <circle cx="162" cy="42" r="5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.2" />
                <circle cx="173" cy="42" r="5" className="stroke-slate-400 fill-slate-900" strokeWidth="1.2" />
                
                {/* Cargo Bay Area inside Trailer */}
                <rect x="42" y="13" width="147" height="26" rx="1.5" className="stroke-indigo-500/20 fill-indigo-500/5" strokeDasharray="1.5 1.5" />
                {/* Visual pallet racks inside semi trailer container */}
                <g strokeWidth="0.5">
                  {bom.map((item, idx) => {
                    const colors = 
                      item.part.division === "siding" ? "fill-blue-500/75 stroke-blue-300/50" :
                      item.part.division === "windows" ? "fill-sky-500/75 stroke-sky-300/50" :
                      item.part.division === "metal" ? "fill-orange-500/75 stroke-orange-300/50" :
                      item.part.division === "custom" ? "fill-purple-500/75 stroke-purple-300/50" :
                      "fill-amber-500/75 stroke-amber-300/50";
                      
                    const blockWidth = Math.min(item.quantity * 2.5, 60);
                    const blockHeight = 11;
                    const xOffset = 45 + (idx * 34) % 120;
                    const yOffset = 26 - (Math.floor(idx / 4) * 12);
                    if (yOffset > 12) {
                      return <rect key={item.part.id} x={xOffset} y={yOffset} width={blockWidth} height={blockHeight} rx="0.5" className={colors} />;
                    }
                    return null;
                  })}
                </g>
              </g>
            )}
          </svg>
        </div>
        
        {/* Legend & Details */}
        <div className="flex flex-wrap items-center justify-between gap-1 px-1 text-[8px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded bg-blue-500" /> <span>Siding</span>
            <span className="h-1.5 w-1.5 rounded bg-sky-500 ml-1" /> <span>Windows</span>
            <span className="h-1.5 w-1.5 rounded bg-orange-500 ml-1" /> <span>Metal</span>
            <span className="h-1.5 w-1.5 rounded bg-purple-500 ml-1" /> <span>Custom</span>
            <span className="h-1.5 w-1.5 rounded bg-amber-500 ml-1" /> <span>Fasteners</span>
          </div>
          <div className="text-orange-400 font-bold">
            MAX WT: {maxWeight.toLocaleString()} LBS
          </div>
        </div>
      </div>
    )
  }

  // Real-time Vertex AI Grounded Chat integration
  const handleSendMessage = async (textToSend?: string, attachedImg?: string) => {
    const query = textToSend || chatInput
    const img = attachedImg || uploadedImage
    if (!query.trim() && !img) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query || "Uploaded image for technical specification scanning.",
      imageUrl: img || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const currentHistory = [...chatMessages];

    setChatMessages(prev => [...prev, userMsg])
    if (!textToSend) setChatInput("")
    setUploadedImage(null) // clear local upload image buffer
    setIsAiTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history: currentHistory })
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();

      let text = data.text;
      if (data.groundedSource) {
        text += `\n\n---\n🛡️ **Answer grounded in official technical source:**\n👉 \`gs://conerstonepartlib/plygem/${data.groundedSource}\` (or corresponding folder)`;
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "ai",
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setChatMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error('Error in chat route:', error);
      const errMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "ai",
        text: "⚠️ **Connection Error:** I encountered an issue querying the Vertex AI grounded endpoint. Please make sure the backend is active or try a different query.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, errMsg])
    } finally {
      setIsAiTyping(false)
    }
  }

  // Interactive sheet metal trim fabrication sequence simulations
  const startFabricateSequence = () => {
    if (fabricateStep !== -1) return
    setNewlyFabricatedPart(null)
    setFabricateStep(0)
  }

  useEffect(() => {
    if (fabricateStep < 0 || fabricateStep > 6) return

    const timer = setTimeout(() => {
      if (fabricateStep < 6) {
        setFabricateStep(prev => prev + 1)
      } else {
        // Step 6: Create the newly fabricated custom trim part
        const pTypeLabel = trimProfile.toUpperCase().replace("-", " ")
        const randomIDNum = Math.floor(100 + Math.random() * 900)
        const generatedId = `CST-${trimProfile.slice(0, 3).toUpperCase()}-${randomIDNum}`
        
        const newTrimPart: Part = {
          id: generatedId,
          name: `${trimLength}' Custom Fabricated ${trimColor} ${pTypeLabel} Trim`,
          division: "custom",
          divisionLabel: "Custom Exterior Fabrications",
          brand: "Custom Fabricated",
          description: `Custom-configured press-brake fabricated building accessory. Custom designed length: ${trimLength} ft, material: ${trimMaterial}, thickness: ${trimGauge}, finished in electrostatically cured ${trimColor} powder-coat.`,
          weight: configuredTrimSpecs.weight,
          cost: configuredTrimSpecs.cost,
          material: trimMaterial,
          finish: `${trimColor} Electrostatic Coat`,
          specs: [
            { label: "Fabrication Machine", value: "CNC Brake Press 4000" },
            { label: "Fabrication Date", value: "July 2026" },
            { label: "Precision Margin", value: "±0.012 mm Laser Verified" },
            { label: "Steel/Poly Thickness", value: `${trimGauge} Profile` },
            { label: "Extrusion Length", value: `${trimLength}.0 feet` },
            { label: "Coating Adhesion", value: "Class 5B Crosshatch rated" }
          ],
          svgBlueprint: Blueprints.customFabricated,
          isSynthesized: true
        }

        setParts(prev => [newTrimPart, ...prev])
        setNewlyFabricatedPart(newTrimPart)
        setSelectedPart(newTrimPart)
        setFabricateStep(7) // Completed status
      }
    }, 900)

    return () => clearTimeout(timer)
  }, [fabricateStep, trimProfile, trimLength, trimGauge, trimMaterial, trimColor, configuredTrimSpecs])

  // Automatically scroll the terminal to the bottom as fabrication progresses
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [fabricateStep])

  const fabricationStepsText = [
    `Initializing custom architectural trim spec: ${trimProfile.toUpperCase()} / ${trimLength} FT / ${trimGauge} / ${trimColor.toUpperCase()}...`,
    "Loading raw substrate coil stock onto CNC mechanical mandrel rollers...",
    "Positioning material inside high-precision programmable laser-cutter bed...",
    "Executing CNC press brake multi-point folding sequence (90° hems and returned drip channels)...",
    `Applying electrostatically charged powder coating - Color tone: ${trimColor}...`,
    "Transferring trim to thermal curing kiln: Cured at 400°F (204°C) for maximum polymer bonding...",
    "Performing digital laser scan of profile cross-section. Deviation: <0.012mm (QUALITY PASSED)."
  ]

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#08152e] text-white relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        {/* Splash Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-2xl text-center px-6 flex flex-col items-center"
        >
          {/* Logo Animation */}
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-orange-500 blur-xl opacity-55 animate-pulse" />
            <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-orange-500 p-0.5 shadow-2xl flex items-center justify-center">
              <div className="h-full w-full rounded-[22px] bg-[#0f2d59] flex items-center justify-center">
                <Building2 className="h-10 w-10 text-orange-400" />
              </div>
            </div>
          </div>

          {/* Brand name */}
          <h2 className="text-[11px] font-extrabold tracking-[0.25em] text-orange-400 uppercase font-mono mb-2">Architectural Engineering Platform</h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            CORNERSTONE <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-orange-300">PARTS LIBRARY</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base mb-10 max-w-lg leading-relaxed">
            Access real-time engineering blueprints, design custom fabricated flashing, and compile professional Bills of Materials grounded in secure Cloud Storage specifications.
          </p>

          {/* Actions */}
          <button 
            onClick={() => setShowSplash(false)}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 to-orange-500 blur-md opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-[#0f2d59] hover:from-blue-500 hover:to-[#174384] text-white font-extrabold text-sm tracking-wide rounded-xl shadow-2xl transition duration-300 flex items-center gap-3 border border-blue-400/20">
              Launch Spec Workspace
              <ArrowRight className="h-4 w-4 text-orange-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Cloud storage connection specs footer */}
          <div className="mt-16 pt-8 border-t border-slate-800 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
             <div className="flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
               <span>Database Server: <strong>Online</strong></span>
             </div>
             <div className="flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
               <span>Bucket: <code>gs://conerstonepartlib</code></span>
             </div>
             <div className="flex items-center gap-2">
               <span>Core Engine: <strong>v7.0 (Turbopack)</strong></span>
             </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 bg-[#f8fafc] text-slate-900 font-sans min-h-screen relative overflow-hidden">
      {/* Premium background grid & light glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_24px] pointer-events-none opacity-50" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/3 blur-[120px] rounded-full pointer-events-none" />

      {/* ==========================================
          HEADER SYSTEM
          ========================================== */}
      <header className="sticky top-0 z-30 bg-[#0f2d59] text-white shadow-md border-b border-[#0b2447] px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSplash(true)}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity text-left cursor-pointer focus:outline-none"
            title="Return to Welcome Splash Screen"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-orange-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="h-full w-full rounded-[10px] bg-[#0f2d59] flex items-center justify-center">
                <Building2 className="h-5 w-5 text-orange-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-2">
                CORNERSTONE <span className="text-[#1a4f7c] font-medium">|</span> <span className="text-[10px] font-bold tracking-wide px-2.5 py-0.5 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">Parts Library</span>
              </h1>
              <p className="text-[9px] text-slate-300 uppercase tracking-widest font-mono font-bold">North American Exterior Cladding Database</p>
            </div>
          </button>
        </div>

        {/* Live BOM Metrics counter */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 bg-[#081f3c] border border-[#1b3a5f] rounded-xl px-4 py-1.5 font-mono text-[11px] text-slate-200 shadow-md">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">Database:</span>
              <span className="text-emerald-300 font-bold">Online</span>
            </div>
            <div className="h-3 w-px bg-[#1b3a5f]" />
            <div>
              <span className="text-slate-400">Project Weight:</span> <strong className="text-sky-300 font-bold">{bomMetrics.totalWeight.toFixed(1)} lbs</strong>
            </div>
            <div className="h-3 w-px bg-[#1b3a5f]" />
            <div>
              <span className="text-slate-400">Materials Est:</span> <strong className="text-emerald-300 font-bold">${bomMetrics.totalCost.toFixed(2)}</strong>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setBom([])
              setParts(INITIAL_PARTS)
              setSelectedPart(INITIAL_PARTS[0])
              setChatMessages([
                {
                  id: `m-reset-${Date.now()}`,
                  sender: "ai",
                  text: "Reset complete. All fabricated custom specifications, project BOMs, and physical loading constraints have been cleared. How can I assist you with your construction blueprints today?",
                  timestamp: "Restored"
                }
              ])
            }}
            className="text-xs gap-1.5 h-8 border-[#1b3a5f] hover:bg-[#15345b] text-slate-300 hover:text-white transition-colors cursor-pointer bg-[#0f2d59]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Database
          </Button>
        </div>
      </header>

      {/* ==========================================
          MAIN LAYOUT
          ========================================== */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
        
        {/* LEFT & CENTER WORKSPACE (Tabs: Parts Catalog, Fabricator, Chat) */}
        <section className={`${activeTab === "chat" ? "xl:col-span-12" : "xl:col-span-8"} flex flex-col gap-6 transition-all duration-300`}>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
              <TabsList className="bg-slate-200/80 p-1.5 border border-slate-300 rounded-2xl shadow-inner flex items-center h-12 gap-1.5">
                <TabsTrigger 
                  value="parts" 
                  className="text-xs font-extrabold py-2 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0f2d59] data-[state=active]:to-[#1d4f8f] data-[state=active]:text-white text-slate-600 hover:text-[#0f2d59] hover:bg-white/60 cursor-pointer flex items-center gap-2 transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-950/15 data-[state=active]:scale-[1.03] active:scale-95 select-none"
                >
                  <Boxes className="h-4 w-4 shrink-0" /> Parts Library
                </TabsTrigger>
                <TabsTrigger 
                  value="fabricator" 
                  className="text-xs font-extrabold py-2 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-slate-600 hover:text-purple-700 hover:bg-white/60 cursor-pointer flex items-center gap-2 transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-purple-700/15 data-[state=active]:scale-[1.03] active:scale-95 select-none"
                >
                  <Hammer className="h-4 w-4 shrink-0" /> Custom Flashing Configurator
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="text-xs font-extrabold py-2 px-4 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-500 data-[state=active]:text-white text-slate-600 hover:text-orange-600 hover:bg-white/60 cursor-pointer flex items-center gap-2 transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:shadow-orange-600/15 data-[state=active]:scale-[1.03] active:scale-95 select-none"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-orange-500 data-[state=active]:text-white" /> Gemini Technical Assistant
                </TabsTrigger>
              </TabsList>

              {/* Filtering & Sorting Controls inside Catalog view */}
              {activeTab === "parts" && (
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto animate-in fade-in duration-300">
                  <div className="relative flex-1 lg:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input 
                      placeholder="Search parts, brands, specs..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-8.5 text-xs bg-white border-slate-200 focus:border-[#0f2d59] rounded-lg text-slate-800 placeholder:text-slate-400 w-full lg:w-64 shadow-sm"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1">
                    <Button 
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={`h-7.5 w-7.5 rounded transition-all ${viewMode === "grid" ? "bg-white border border-slate-200 text-[#0f2d59] shadow-sm font-bold" : "text-slate-500 hover:text-[#0f2d59]"}`}
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={`h-7.5 w-7.5 rounded transition-all ${viewMode === "list" ? "bg-white border border-slate-200 text-[#0f2d59] shadow-sm font-bold" : "text-slate-500 hover:text-[#0f2d59]"}`}
                    >
                      <List className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* TAB 1: PRODUCT CATALOG GRID */}
            <TabsContent value="parts" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
              
              {gcsError && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-start gap-2.5 shadow-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs">!</span>
                  <div>
                    <div className="font-extrabold text-rose-900">Cloud Storage Connection Warning</div>
                    <div className="text-[11px] text-rose-700/90 mt-0.5 leading-relaxed">
                      Failed to dynamically fetch live parts from Cloud Storage: <strong>{gcsError}</strong>.
                      Please ensure your local shell has active Application Default Credentials (ADC) or credentials with read permissions for bucket <code>gs://conerstonepartlib</code>.
                    </div>
                  </div>
                </div>
              )}
              
              {/* Category Segment Selectors */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { id: "all", label: "All Exterior Systems" },
                  { id: "siding", label: "Siding, Stone & Trim" },
                  { id: "windows", label: "Windows & Doors" },
                  { id: "gutter", label: "Gutter & Rainware" },
                  { id: "fencing", label: "Fencing & Railing" },
                  { id: "fasteners", label: "Technical Fasteners" },
                  { id: "metal", label: "Metal Roofing & Walls" },
                  { id: "custom", label: "Custom Configured" }
                ].map((div) => (
                  <button
                    key={div.id}
                    onClick={() => setActiveCategory(div.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer shadow-sm ${
                      activeDivision === div.id 
                        ? "bg-[#0f2d59] border-[#0f2d59] text-white shadow-md shadow-blue-900/10" 
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {div.label}
                  </button>
                ))}
              </div>

              {/* Sort by selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 mb-3 px-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span>Displaying <strong>{filteredParts.length}</strong> matching building parts</span>
                  {gcsSyncing ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Syncing gs://conerstonepartlib...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live gs://conerstonepartlib
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3 text-slate-400" />
                  <span>Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700 focus:outline-none focus:border-[#0f2d59] shadow-sm cursor-pointer"
                  >
                    <option value="name-asc">Part Name (A-Z)</option>
                    <option value="name-desc">Part Name (Z-A)</option>
                    <option value="cost-asc">Price (Low to High)</option>
                    <option value="cost-desc">Price (High to Low)</option>
                    <option value="weight-asc">Weight (Light to Heavy)</option>
                    <option value="weight-desc">Weight (Heavy to Light)</option>
                  </select>
                </div>
              </div>

              {/* Grid / List display */}
              <AnimatePresence mode="popLayout">
                {filteredParts.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-200 rounded-2xl shadow-sm"
                  >
                    <Package className="h-12 w-12 text-slate-300 mb-4 animate-bounce" />
                    <h3 className="text-sm font-extrabold text-slate-800">No Building Parts Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">No items matching your search query are currently indexed. Try clearing filters or create a custom profile using our Custom Flashing Configurator!</p>
                  </motion.div>
                ) : viewMode === "grid" ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {filteredParts.map((part) => {
                      const brandBadgeColor = 
                        part.brand === "Mastic" ? "border-teal-200 text-teal-700 bg-teal-50" :
                        part.brand === "Ply Gem" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                        part.brand === "Simonton" ? "border-sky-200 text-sky-700 bg-sky-50" :
                        part.brand === "MBCI" ? "border-orange-200 text-orange-700 bg-orange-50" :
                        part.brand === "Star Building Systems" ? "border-indigo-200 text-indigo-700 bg-indigo-50" :
                        part.brand === "Environmental Stoneworks" ? "border-amber-200 text-amber-700 bg-amber-50" :
                        "border-purple-200 text-purple-700 bg-purple-50";

                      const borderSelection = selectedPart?.id === part.id ? "ring-2 ring-[#0f2d59] border-transparent shadow-md shadow-blue-900/10" : "border-slate-200 hover:border-slate-300 hover:shadow-sm";

                      return (
                        <motion.div
                          layout
                          key={part.id}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card 
                            onClick={() => setSelectedPart(part)}
                            className={`group bg-white transition-all cursor-pointer overflow-hidden ${borderSelection}`}
                          >
                            <div className="grid grid-cols-3 h-full">
                              
                              {/* Left blueprint block */}
                              <div className="col-span-1 bg-[#0b2447] p-3 flex items-center justify-center border-r border-slate-100 relative">
                                {part.svgBlueprint}
                                {part.isSynthesized && (
                                  <div className="absolute top-1.5 left-1.5">
                                    <span className="text-[7px] font-extrabold uppercase font-mono tracking-widest px-1 py-0.5 bg-purple-600 text-white rounded">CONFIGURED</span>
                                  </div>
                                )}
                              </div>

                              {/* Right details block */}
                              <div className="col-span-2 p-4 flex flex-col justify-between bg-white">
                                <div>
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${brandBadgeColor}`}>
                                      {part.brand}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 font-medium">#{part.id}</span>
                                  </div>
                                  <h3 className="text-xs font-bold leading-snug text-slate-800 group-hover:text-[#0f2d59] transition-colors line-clamp-1">
                                    {part.name}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                    {part.description}
                                  </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Weight / Price</span>
                                    <span className="text-xs font-semibold text-slate-700">{part.weight} lbs <span className="text-slate-300">/</span> <strong className="text-emerald-600">${part.cost.toFixed(2)}</strong></span>
                                  </div>
                                  
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPart(part)
                                      }}
                                      className="h-7 w-7 p-0 rounded-md border-slate-200 hover:bg-slate-50"
                                    >
                                      <Maximize2 className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                                    </Button>
                                    <Button 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        addToBom(part)
                                      }}
                                      className="h-7 px-2.5 text-[10px] font-bold bg-[#0f2d59] hover:bg-[#163c63] text-white rounded-md gap-1 flex items-center cursor-pointer shadow-sm"
                                    >
                                      <Plus className="h-3 w-3" /> Add
                                    </Button>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ) : (
                  // List / Table display
                  <motion.div 
                    layout
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-mono uppercase text-slate-500 font-bold">
                          <th className="py-2.5 px-4">Part Spec</th>
                          <th className="py-2.5 px-4">Division</th>
                          <th className="py-2.5 px-4">Brand</th>
                          <th className="py-2.5 px-4">Material</th>
                          <th className="py-2.5 px-4 text-right">Weight</th>
                          <th className="py-2.5 px-4 text-right">Unit Price</th>
                          <th className="py-2.5 px-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredParts.map((part) => (
                          <tr 
                            key={part.id}
                            onClick={() => setSelectedPart(part)}
                            className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedPart?.id === part.id ? "bg-slate-100/70 font-semibold" : ""}`}
                          >
                            <td className="py-3 px-4">
                              <div>
                                <span className="font-bold text-slate-800 line-clamp-1">{part.name}</span>
                                <span className="text-[10px] font-mono text-slate-400">#{part.id}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-500 text-[11px]">{part.divisionLabel}</td>
                            <td className="py-3 px-4 text-slate-700 font-medium">{part.brand}</td>
                            <td className="py-3 px-4 text-slate-500 line-clamp-1 max-w-[120px]">{part.material}</td>
                            <td className="py-3 px-4 text-right text-slate-700 font-mono">{part.weight} lbs</td>
                            <td className="py-3 px-4 text-right text-emerald-600 font-mono font-bold">${part.cost.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addToBom(part)
                                }}
                                className="h-7 px-2.5 text-[10px] font-bold bg-[#0f2d59] hover:bg-[#163c63] text-white rounded-md cursor-pointer shadow-sm"
                              >
                                <Plus className="h-3 w-3" /> Add
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* TAB 2: SHEET METAL & EXTRUSION TRIM CONFIGURATOR (FABRICATOR LAB) */}
            <TabsContent value="fabricator" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Configuration form panel */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center justify-between gap-1.5 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-purple-600" /> Extrusion Flashing Parameters
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">v7.2-active-lifecycle</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-5 leading-relaxed">Configure a custom aluminum, steel, or vinyl structural trim panel. Our press brake system will automatically bend and fabricate to your exact length.</p>
                    
                    <div className="flex flex-col gap-4">
                      
                      {/* Profile Shape */}
                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2 font-semibold">1. Select profile shape</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {[
                            { id: "j-channel", label: "J-Channel" },
                            { id: "corner-post", label: "Corner Post" },
                            { id: "ridge-cap", label: "Ridge Cap" },
                            { id: "drip-edge", label: "Drip Edge" },
                            { id: "u-trim", label: "U-Trim" }
                          ].map((style) => (
                            <button
                              key={style.id}
                              onClick={() => {
                                if (fabricateStep >= 0 && fabricateStep <= 6) return
                                if (fabricateStep === 7) setFabricateStep(-1)
                                setTrimProfile(style.id as any)
                              }}
                              className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer shadow-sm ${
                                trimProfile === style.id 
                                  ? "bg-purple-50 border-purple-600 text-purple-700 font-extrabold shadow-md shadow-purple-500/5" 
                                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
                              }`}
                            >
                              <span className="text-[10px] block font-mono">{style.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom length slider */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] uppercase font-mono text-slate-500 font-semibold">2. Custom Extrusion Length</label>
                          <span className="text-xs font-mono font-extrabold text-purple-600">{trimLength} feet</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="30" 
                          step="1"
                          value={trimLength}
                          onChange={(e) => {
                            if (fabricateStep >= 0 && fabricateStep <= 6) return
                            if (fabricateStep === 7) setFabricateStep(-1)
                            setTrimLength(parseInt(e.target.value))
                          }}
                          className="w-full accent-purple-600 bg-slate-200 h-1 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                          <span>5 ft (Min)</span>
                          <span>15 ft (Standard)</span>
                          <span>30 ft (Max-Extrusion limit)</span>
                        </div>
                      </div>

                      {/* Gauge Thickness & Substrate material */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 font-semibold">3. Steel Thickness / Gauge</label>
                          <select
                            value={trimGauge}
                            onChange={(e) => {
                              if (fabricateStep >= 0 && fabricateStep <= 6) return
                              if (fabricateStep === 7) setFabricateStep(-1)
                              setTrimGauge(e.target.value)
                            }}
                            className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-purple-600 w-full shadow-sm cursor-pointer"
                          >
                            <option value="22 ga">22 Gauge (Heavy Structural - 0.030")</option>
                            <option value="24 ga">24 Gauge (Standard Commercial - 0.024")</option>
                            <option value="26 ga">26 Gauge (Residential Premium - 0.018")</option>
                            <option value="29 ga">29 Gauge (Light Utility - 0.014")</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-mono text-slate-500 block mb-1.5 font-semibold">4. Substrate Material</label>
                          <select
                            value={trimMaterial}
                            onChange={(e) => {
                              if (fabricateStep >= 0 && fabricateStep <= 6) return
                              if (fabricateStep === 7) setFabricateStep(-1)
                              setTrimMaterial(e.target.value)
                            }}
                            className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 focus:outline-none focus:border-purple-600 w-full shadow-sm cursor-pointer"
                          >
                            <option value="Galvalume Steel">Galvalume Steel G90 Coating</option>
                            <option value="Painted Aluminum">High-Grade 3105 Aluminum</option>
                            <option value="Premium Vinyl">Impact-Resistant uPVC Poly</option>
                          </select>
                        </div>
                      </div>

                      {/* Electrostatic Finish Color */}
                      <div>
                        <label className="text-[10px] uppercase font-mono text-slate-500 block mb-2 font-semibold">5. Electrostatically Cured Finish Color</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {[
                            { name: "Cornerstone Navy", hex: "bg-blue-900 border-blue-400" },
                            { name: "Classic White", hex: "bg-slate-100 border-slate-300" },
                            { name: "Slate Grey", hex: "bg-slate-500 border-slate-400" },
                            { name: "Forest Green", hex: "bg-emerald-800 border-emerald-500" },
                            { name: "Bronze Gold", hex: "bg-yellow-800 border-yellow-500" },
                            { name: "Desert Sand", hex: "bg-amber-100 border-amber-300" }
                          ].map((col) => (
                            <button
                              key={col.name}
                              onClick={() => {
                                if (fabricateStep >= 0 && fabricateStep <= 6) return
                                if (fabricateStep === 7) setFabricateStep(-1)
                                setTrimColor(col.name)
                              }}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer shadow-sm ${
                                trimColor === col.name 
                                  ? "border-purple-600 bg-purple-50 font-extrabold text-purple-700 shadow-md shadow-purple-500/5" 
                                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
                              }`}
                            >
                              <div className={`h-4 w-4 rounded-full mx-auto ${col.hex} mb-1`} />
                              <span className="text-[8px] block leading-tight truncate font-semibold">{col.name.split(" ")[1]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Fabrication initiation button */}
                  <Button
                    onClick={startFabricateSequence}
                    disabled={fabricateStep !== -1}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold h-11 rounded-xl text-xs tracking-wider uppercase cursor-pointer shadow-md transition-all"
                  >
                    {fabricateStep === -1 ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Wrench className="h-4 w-4" /> Fabricate Custom Part
                      </span>
                    ) : fabricateStep < 7 ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" /> CNC Machine Fabrication in progress...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1">
                        <Check className="h-4 w-4 text-emerald-400 animate-bounce" /> CNC Fabrication Completed!
                      </span>
                    )}
                  </Button>
                </div>

                {/* Live rendering and fabrication terminal */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-[#0b2447] p-4 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center h-48 relative">
                    <div className="absolute top-2 right-3 font-mono text-[8px] text-purple-300">BLUEPRINT PREVIEW</div>
                    {renderConfiguredTrimSvg()}
                  </div>

                  {/* High-tech CNC machine status log terminal */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex-1 flex flex-col min-h-[160px] h-64">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-900 font-mono text-[9px] text-slate-500">
                      <span className="flex items-center gap-1"><Terminal className="h-3.5 w-3.5 text-purple-400" /> SYSTEM STATUS LOG</span>
                      <span>FAB_CNC_4000: v2.4</span>
                    </div>

                    <div className="flex-1 overflow-y-auto font-mono text-[10px] py-3 text-slate-300 space-y-1.5 select-text custom-scrollbar">
                      {fabricateStep === -1 ? (
                        <div className="text-slate-500 italic flex items-center justify-center h-full text-[11px]">
                          CNC Machine is currently idle. Click "Fabricate Custom Part" to begin bending and powder-coating.
                        </div>
                      ) : (
                        <>
                          {fabricationStepsText.map((stepMsg, index) => {
                            if (fabricateStep < index) return null
                            return (
                              <div key={index} className="flex gap-2">
                                <span className={index === fabricateStep ? "text-purple-400 animate-pulse" : "text-emerald-500 font-semibold"}>
                                  {index < fabricateStep ? "✓" : index === fabricateStep ? "▶" : "•"}
                                </span>
                                <span className={index === fabricateStep ? "text-white" : "text-slate-400"}>
                                  {stepMsg}
                                </span>
                              </div>
                            )
                          })}
                          
                          {fabricateStep === 7 && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="pt-3 border-t border-slate-900 mt-2 flex flex-col gap-2"
                            >
                              <div className="text-emerald-400 font-bold text-[11px]">✔ CUSTOM TRIM PANEL ADDED TO CATALOG SUCCESSFULLY!</div>
                              <div className="text-[10px] text-slate-400">
                                Assigned ID: <strong className="text-purple-400">{selectedPart?.id}</strong> | Name: {selectedPart?.name}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (selectedPart) addToBom(selectedPart)
                                }}
                                className="mt-1 h-7 text-[10px] font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-md self-start cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" /> Add Fabricated Trim to project BOM
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setFabricateStep(-1)}
                                className="h-7 text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-md self-start cursor-pointer"
                              >
                                Fabricate another trim panel
                              </Button>
                            </motion.div>
                          )}
                          <div ref={terminalBottomRef} />
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* TAB 3: GEMINI TECHNICAL ASSISTANT CHAT */}
            <TabsContent value="chat" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
              <div className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden h-auto max-h-[550px] shadow-sm transition-all duration-300">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span className="flex items-center gap-1.5 font-bold"><Sparkles className="h-3.5 w-3.5 text-orange-600 animate-pulse" /> GEMINI AI SPEC ENGINE</span>
                  <span className="text-[9px] text-slate-400 font-bold">KNOWLEDGE BASIS: CORNERSTONE BRANDS v7.0</span>
                </div>

                {/* Messages bubble container */}
                <div className="overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar bg-slate-50/30 flex-1">
                  {chatMessages.map((msg) => (
                    msg.id === "m-1" ? (
                      <div key={msg.id} className="w-full bg-orange-50/40 border border-orange-200/50 rounded-xl p-4 shadow-sm flex flex-col gap-2 relative animate-in fade-in duration-300">
                        <div className="flex items-center gap-2 text-orange-800 font-extrabold text-xs uppercase font-mono tracking-wider">
                          <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" /> Ask Me Anything
                        </div>
                        <p className="text-[11.5px] text-slate-700 leading-relaxed font-sans font-medium">
                          {msg.text}
                        </p>
                      </div>
                    ) : (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        {msg.sender === "ai" && (
                          <div className="h-7 w-7 rounded bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4" />
                          </div>
                        )}
                        <div className={`max-w-[85%] rounded-xl px-4 py-3 leading-relaxed flex flex-col gap-2 ${
                          msg.sender === "user" 
                            ? "bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/10" 
                            : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                        }`}>
                          {/* Render image inside bubble if present */}
                          {msg.imageUrl && (
                            <div className="relative rounded-lg overflow-hidden border border-slate-100 max-h-48 max-w-sm mb-2 shadow-sm bg-slate-100 shrink-0">
                              <img src={msg.imageUrl} alt="Uploaded component photographs" className="object-contain max-h-48 w-full" />
                            </div>
                          )}
                          <div className="text-[11px] font-sans prose prose-slate max-w-none">
                            <MarkdownRenderer text={msg.text} />
                          </div>

                          {/* Render specification tables in responses */}
                          {msg.tableData && (
                            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white mt-1 select-text shadow-sm">
                              <table className="w-full text-left text-[10px] font-mono border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                    <th className="py-1 px-3">Specification Factor</th>
                                    <th className="py-1 px-3 text-right">Value Rating</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {msg.tableData.map((row, idx) => (
                                    <tr key={idx}>
                                      <td className="py-1 px-3">{row.label}</td>
                                      <td className="py-1 px-3 text-right text-emerald-600 font-bold">{row.value}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <span className={`text-[8px] font-mono self-end ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>{msg.timestamp}</span>
                        </div>
                      </div>
                    )
                  ))}
                  
                  {isAiTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-7 w-7 rounded bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 animate-spin" />
                      </div>
                      <div className="bg-white rounded-xl px-4 py-3 text-slate-500 italic border border-slate-200 shadow-sm">
                        <span className="flex items-center gap-1">
                          Analyzing mechanical loads & scanning structural photographs...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat input box */}
                <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-2">
                  
                  {/* Quick Prompt Presets */}
                  <div className="flex items-center gap-1.5 pb-1 max-w-full overflow-x-auto custom-scrollbar no-print">
                    <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-wider select-none">Presets:</span>
                    {[
                      { label: "Window U-Factors", query: "Can you list and compare the thermal U-factor ratings of all the Simonton and builder series windows in our catalog in a markdown table?" },
                      { label: "Siding Wind Loads", query: "What are the structural wind-load capacities and wind-resistance ratings for Ply Gem and Mastic vinyl siding panels?" },
                      { label: "Snow Load Limits", query: "Calculate standard span deflection limits for MBCI and Metl-Span metal roofing panels under a 30 psf snow load." },
                      { label: "Warranty Summaries", query: "What are the standard structural and color fade warranty coverage periods across Ply Gem, Simonton, and Mastic systems?" }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(preset.query)}
                        className="text-[10px] font-semibold px-2.5 py-1 bg-[#fff2ea] hover:bg-orange-600 border border-orange-200 text-orange-800 hover:text-white rounded-full cursor-pointer transition-all duration-200 shadow-sm shrink-0 whitespace-nowrap active:scale-95 flex items-center gap-1"
                      >
                        💡 {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Uploaded image preview bar */}
                  {uploadedImage && (
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start text-[10px] text-slate-600 font-mono shadow-sm">
                      <div className="h-8 w-8 rounded overflow-hidden border border-slate-100 bg-slate-50">
                        <img src={uploadedImage} alt="Preview" className="object-cover h-full w-full" />
                      </div>
                      <span className="font-bold text-slate-700">Photo attached ready for Gemini scan</span>
                      <button 
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="h-4.5 w-4.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 flex items-center justify-center font-bold text-[9px] ml-2 cursor-pointer border border-slate-100 bg-white shadow-sm"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                    className="flex gap-2 items-center"
                  >
                    {/* Hidden file input */}
                    <input 
                      type="file"
                      accept="image/*"
                      id="chat-image-upload"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setUploadedImage(reader.result as string)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />

                    <Button 
                      type="button"
                      onClick={() => document.getElementById("chat-image-upload")?.click()}
                      className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-[#0f2d59] rounded-lg h-9.5 w-9.5 shrink-0 p-0 flex items-center justify-center cursor-pointer shadow-sm"
                      title="Upload component photograph"
                    >
                      <Image className="h-4.5 w-4.5" />
                    </Button>

                    <Input 
                      placeholder="e.g., 'What is the wind load rating for Mastic Quest siding?' or upload a photo..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="text-xs bg-white border-slate-200 text-slate-800 rounded-lg h-9.5 focus:border-[#0f2d59] placeholder:text-slate-400 shadow-sm flex-1"
                    />
                    <Button 
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-500 text-white rounded-lg h-9.5 px-4 cursor-pointer shadow-sm font-bold flex items-center gap-1 shrink-0"
                    >
                      <Send className="h-4 w-4" /> Send
                    </Button>
                  </form>
                  <p className="text-[10px] text-slate-400 px-1 mt-0.5">
                    💡 **Try asking:** <span className="italic text-slate-500">\"What is the thermal U-factor for Simonton DaylightMax?\"</span> or <span className="italic text-slate-500">\"Check purlin deflection for 30 psf snow load\"</span>, or attach a photo for a visual pattern scan.
                  </p>
                </div>
              </div>
            </TabsContent>

          </Tabs>

        </section>

        {/* RIGHT DRAWER: ACTIVE PART SPECS & PROJECT BOM (CART) */}
        {activeTab !== "chat" && (
          <section className="xl:col-span-4 flex flex-col gap-6 animate-in fade-in slide-in-from-right duration-300">
          
          {/* Active component spec panel */}
          {/* Active component spec panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-[#0f2d59]" /> Architectural Spec Sheet
            </h3>

            {selectedPart ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border border-blue-200 text-blue-800 bg-blue-50 uppercase font-mono">
                    {selectedPart.brand}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">#{selectedPart.id}</span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{selectedPart.name}</h4>

                {/* Interactive CAD Canvas Card */}
                <div className="mt-3 mb-1 bg-[#09172c] border border-[#1e2d44] rounded-xl overflow-hidden shadow-inner relative select-none">
                  <div className="h-44 w-full flex items-center justify-center relative overflow-hidden"
                       onMouseDown={(e) => {
                         setIsDraggingBlueprint(true);
                         setDragStart({ x: e.clientX - blueprintPan.x, y: e.clientY - blueprintPan.y });
                       }}
                       onMouseMove={(e) => {
                         if (isDraggingBlueprint) {
                           setBlueprintPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                         }
                       }}
                       onMouseUp={() => setIsDraggingBlueprint(false)}
                       onMouseLeave={() => setIsDraggingBlueprint(false)}
                       style={{ cursor: isDraggingBlueprint ? 'grabbing' : 'grab' }}
                  >
                    {/* Grid Background */}
                    {showBlueprintGrid && (
                      <div className="absolute inset-0 pointer-events-none opacity-25" style={{
                        backgroundImage: 'radial-gradient(rgba(34, 211, 238, 0.4) 1px, transparent 1px)',
                        backgroundSize: '12px 12px'
                      }} />
                    )}
                    
                    {/* Canvas Content */}
                    <div 
                      className={`h-full w-full p-4 select-none ${showBlueprintAnnotations ? "" : "[&_text]:hidden [&_line]:hidden [&_ellipse]:hidden [&_rect]:hidden [&_path]:opacity-100"}`}
                      style={{
                        transform: `scale(${blueprintZoom}) translate(${blueprintPan.x}px, ${blueprintPan.y}px)`,
                        transformOrigin: 'center',
                        transition: isDraggingBlueprint ? 'none' : 'transform 0.15s ease'
                      }}
                    >
                      {selectedPart.svgBlueprint}
                    </div>

                    {/* Canvas Info Badge */}
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 border border-slate-800 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-mono font-semibold tracking-wider text-cyan-400">
                      SCALE: {(blueprintZoom * 100).toFixed(0)}% | PAN: {blueprintPan.x.toFixed(0)},{blueprintPan.y.toFixed(0)} px
                    </div>
                  </div>

                  {/* Canvas Control Bar */}
                  <div className="bg-[#0b1f38] border-t border-[#1e2d44] px-3 py-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setBlueprintZoom(z => Math.min(z + 0.1, 3.0))}
                        className="h-6 w-6 rounded bg-[#09172c] hover:bg-[#152a44] border border-[#1e2d44] text-cyan-400 hover:text-cyan-300 flex items-center justify-center p-0"
                        title="Zoom In"
                      >
                        <span className="font-bold text-xs">+</span>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setBlueprintZoom(z => Math.max(z - 0.1, 0.5))}
                        className="h-6 w-6 rounded bg-[#09172c] hover:bg-[#152a44] border border-[#1e2d44] text-cyan-400 hover:text-cyan-300 flex items-center justify-center p-0"
                        title="Zoom Out"
                      >
                        <span className="font-bold text-xs">-</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => { setBlueprintZoom(1); setBlueprintPan({ x: 0, y: 0 }); }}
                        className="h-6 px-2 rounded bg-[#09172c] hover:bg-[#152a44] border border-[#1e2d44] text-[9px] font-mono font-semibold text-cyan-400 hover:text-cyan-300"
                        title="Reset Canvas"
                      >
                        RESET
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-[9px] font-mono text-slate-400 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={showBlueprintGrid} 
                          onChange={(e) => setShowBlueprintGrid(e.target.checked)}
                          className="rounded border-[#1e2d44] bg-[#09172c] text-cyan-500 focus:ring-0 h-3 w-3 cursor-pointer"
                        />
                        <span>GRID</span>
                      </label>
                      <label className="flex items-center gap-1 text-[9px] font-mono text-slate-400 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={showBlueprintAnnotations} 
                          onChange={(e) => setShowBlueprintAnnotations(e.target.checked)}
                          className="rounded border-[#1e2d44] bg-[#09172c] text-cyan-500 focus:ring-0 h-3 w-3 cursor-pointer"
                        />
                        <span>SPECS</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <MarkdownRenderer text={selectedPart.description} />
                </div>

                {/* Spec sheets details grid */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Base Material:</span>
                    <span className="text-slate-700 text-right font-medium">{selectedPart.material}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Exterior Finish:</span>
                    <span className="text-slate-700 text-right font-medium">{selectedPart.finish}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Part Unit Weight:</span>
                    <span className="text-slate-700 font-mono text-right font-bold">{selectedPart.weight} lbs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Unit List Price:</span>
                    <span className="text-emerald-600 font-mono font-bold text-right">${selectedPart.cost.toFixed(2)}</span>
                  </div>
                  
                  {selectedPart.category && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Category:</span>
                      <span className="text-slate-700 text-right font-medium">{selectedPart.category} ({selectedPart.subCategory})</span>
                    </div>
                  )}
                  {selectedPart.materialComposition && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Composition:</span>
                      <span className="text-slate-700 text-right font-medium">{selectedPart.materialComposition}</span>
                    </div>
                  )}
                  {selectedPart.colors && selectedPart.colors.length > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Colors/Finishes:</span>
                      <span className="text-slate-700 text-right font-medium text-[10px]">{selectedPart.colors.join(", ")}</span>
                    </div>
                  )}
                  {selectedPart.compatibility && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Compatibility:</span>
                      <span className="text-slate-700 text-right font-medium text-[10px] text-indigo-700 font-semibold">{selectedPart.compatibility}</span>
                    </div>
                  )}
                  {selectedPart.compliance && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-semibold">Compliance Rating:</span>
                      <span className="text-blue-700 text-right font-mono font-bold text-[10px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{selectedPart.compliance}</span>
                    </div>
                  )}
                  
                  {/* Detailed specific parameters */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-semibold">Fabrication Dimensions & Ratings</span>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPart.specs.map((sp, idx) => (
                        <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="text-[9px] text-slate-400 block leading-tight truncate">{sp.label}</span>
                          <span className="text-[10px] font-bold text-slate-700 block leading-tight mt-0.5">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5">
                  <Button 
                    onClick={() => addToBom(selectedPart)}
                    className="bg-[#0f2d59] hover:bg-[#163c63] text-white font-extrabold h-9 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Plus className="h-4 w-4" /> Add to BOM
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Programmatically generate and download an actual certified engineering CAD data sheet file
                      const specLines = [
                        `======================================================================`,
                        `               CORNERSTONE BRANDS ARCHITECTURAL SPEC SHEET            `,
                        `======================================================================`,
                        `Generated: ${new Date().toLocaleDateString()}`,
                        `System: Cornerstone Parts Library Platform (Firebase Production Server)`,
                        `----------------------------------------------------------------------`,
                        `COMPONENT METADATA:`,
                        `  - Part ID: #${selectedPart.id}`,
                        `  - Name: ${selectedPart.name}`,
                        `  - Brand: ${selectedPart.brand}`,
                        `  - Category: ${selectedPart.divisionLabel || "Exterior Structural Component"}`,
                        `  - Description: ${selectedPart.description}`,
                        `----------------------------------------------------------------------`,
                        `MATERIAL SPECIFICATIONS:`,
                        `  - Base Substrate: ${selectedPart.material}`,
                        `  - Finish / Coating: ${selectedPart.finish}`,
                        `  - Unit Weight: ${selectedPart.weight} lbs`,
                        `  - Est. List Price: $${selectedPart.cost.toFixed(2)} USD`,
                        `----------------------------------------------------------------------`,
                        `FABRICATION & ENGINEERING DIMENSIONS:`,
                      ];

                      selectedPart.specs.forEach((sp: any) => {
                        specLines.push(`  - ${sp.label}: ${sp.value}`);
                      });

                      specLines.push(
                        `----------------------------------------------------------------------`,
                        `STATUS: CERTIFIED STANDARD CAD-SPECIFICATION`,
                        `======================================================================`
                      );

                      const blob = new Blob([specLines.join("\n")], { type: "text/plain;charset=utf-8" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `Cornerstone_CAD_Spec_${selectedPart.id}.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 h-9 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm bg-white"
                  >
                    <Download className="h-3.5 w-3.5" /> Technical CAD
                  </Button>
                </div>

                {selectedPart.hasPdfDatasheet && (
                  <Button 
                    disabled={pdfLoading}
                    onClick={() => handleViewDatasheet(selectedPart.id)}
                    className="w-full mt-2 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-extrabold h-9 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {pdfLoading ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1 text-emerald-600" /> Generating Secure Link...
                      </>
                    ) : (
                      <>
                        <FileText className="h-3.5 w-3.5 text-emerald-600 mr-1" /> View Original PDF Datasheet
                      </>
                    )}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-slate-400 italic text-center py-10 text-[11px] leading-relaxed">
                Select any component in the catalog to inspect detailed structural specs and dimensioned CAD blueprints.
              </div>
            )}
          </div>

          {/* Project Bill of Materials (BOM) / Project Cart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex-1 flex flex-col shadow-sm min-h-[300px]">
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-orange-600" /> Project Bill of Materials</span>
              <span className="text-[10px] text-slate-400 font-mono font-bold">({bom.length} items)</span>
            </h3>

            {/* BOM items container */}
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[220px] custom-scrollbar">
              {bom.length === 0 ? (
                <div className="text-slate-400 italic text-center py-12 text-[11px] h-full flex items-center justify-center leading-relaxed">
                  Your project Bill of Materials (BOM) is empty. Add parts from the catalog to tally weights and forecast freight logistics.
                </div>
              ) : (
                bom.map((item) => (
                  <div 
                    key={item.part.id}
                    className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-extrabold text-slate-800 truncate leading-snug">{item.part.name}</h5>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-slate-400">
                        <span>#{item.part.id}</span>
                        <span>•</span>
                        <span>{item.part.weight} lbs</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">${item.part.cost.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Quantity adjuster */}
                      <div className="flex items-center bg-white rounded border border-slate-200 p-0.5 font-mono text-[11px] shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.part.id, item.quantity - 1)}
                          className="h-5 w-5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-slate-800 font-extrabold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.part.id, item.quantity + 1)}
                          className="h-5 w-5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => removeFromBom(item.part.id)}
                        className="h-6 w-6 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Freight & transport calculations */}
            {bom.length > 0 && (
              <div className="pt-3 border-t border-slate-200 mt-4 space-y-3">
                
                {/* Freight transport type prediction */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex gap-3 text-xs">
                  <div className="h-8.5 w-8.5 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Truck className="h-4.5 w-4.5 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-[11px] leading-tight font-sans">Logistics: {bomMetrics.logisticsType}</h5>
                    <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{bomMetrics.logisticsDesc}</p>
                  </div>
                </div>

                {/* Cargo Load Visualizer */}
                {renderCargoVisualizer()}

                <div className="space-y-1.5 text-xs text-slate-500 pt-1 font-mono">
                  <div className="flex justify-between">
                    <span>Total components count:</span>
                    <strong className="text-slate-800 font-bold">{bomMetrics.activeComponentsCount} pcs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total structural weight:</span>
                    <strong className="text-blue-700 font-bold">{bomMetrics.totalWeight.toFixed(1)} lbs</strong>
                  </div>
                  <div className="flex justify-between text-sm pt-1 border-t border-slate-100">
                    <span className="text-slate-700 font-extrabold">Project materials total:</span>
                    <strong className="text-emerald-600 font-extrabold text-sm">${bomMetrics.totalCost.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={downloadBomCsv}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300 font-extrabold h-9 rounded-lg text-xs cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" /> Download CSV
                  </Button>
                  <Button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold h-9 rounded-lg text-xs tracking-wider uppercase cursor-pointer shadow-md shadow-orange-600/10 flex items-center justify-center gap-1"
                  >
                    <FileText className="h-3.5 w-3.5" /> Print Quote
                  </Button>
                </div>
              </div>
            )}
          </div>

        </section>
        )}

        <AnimatePresence>
          {activePdfUrl && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
              >
                <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    <h3 className="font-extrabold tracking-wide text-sm">{selectedPart?.name} — Engineering Spec Sheet</h3>
                  </div>
                  <button 
                    onClick={() => setActivePdfUrl(null)}
                    className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer animate-in fade-in"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex-1 bg-slate-100">
                  <iframe 
                    src={`${activePdfUrl}#toolbar=1`} 
                    className="w-full h-full border-none" 
                    title="Ply Gem Engineering Datasheet"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {isExportModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            >
              {/* Inject standard print-media override CSS */}
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body {
                    background: white !important;
                    color: black !important;
                  }
                  header, footer, nav, aside, section, main, button, .no-print {
                    display: none !important;
                  }
                  #print-quote-sheet {
                    display: block !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                    color: black !important;
                  }
                }
              `}} />

              <motion.div 
                initial={{ scale: 0.95, y: 25 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 25 }}
                className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden no-print"
              >
                {/* Modal Header */}
                <div className="bg-[#0f2d59] text-white px-8 py-5 flex justify-between items-center shrink-0 border-b border-[#081f3c]">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-400" />
                    <div>
                      <h3 className="font-extrabold tracking-wide text-sm">Commercial Material Estimate & Quote</h3>
                      <p className="text-[10px] text-slate-300 font-mono">ESTIMATE ID: CBB-2026-90412</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      onClick={() => window.print()}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold h-9 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-600/10"
                    >
                      <Download className="h-3.5 w-3.5" /> Print / Save PDF
                    </Button>
                    <button 
                      onClick={() => setIsExportModalOpen(false)}
                      className="text-slate-300 hover:text-white font-bold text-xl cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Modal Body / Scrollable Quote Preview and Inputs */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex flex-col md:flex-row gap-6 custom-scrollbar">
                  
                  {/* Left Column: Client & Project Configuration Inputs */}
                  <div className="w-full md:w-80 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shrink-0 shadow-sm h-fit">
                    <h4 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase border-b border-slate-100 pb-1.5 mb-2">Quote Info Settings</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Contractor / Client Name</label>
                      <Input 
                        value={contractorName} 
                        onChange={(e) => setContractorName(e.target.value)}
                        className="text-xs border-slate-200 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Project Delivery Address</label>
                      <Input 
                        value={projectAddress} 
                        onChange={(e) => setProjectAddress(e.target.value)}
                        className="text-xs border-slate-200 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Contact Email / Phone</label>
                      <Input 
                        value={projectContact} 
                        onChange={(e) => setProjectContact(e.target.value)}
                        className="text-xs border-slate-200 bg-slate-50/50"
                      />
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-normal bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                      💡 **Tip:** Changes made to these fields instantly update the print sheet to the right! Print to save as a professional PDF.
                    </div>
                  </div>

                  {/* Right Column / Printable Area Preview */}
                  <div className="flex-1 bg-white border border-slate-200 shadow-lg rounded-2xl p-8 max-w-[680px] mx-auto overflow-y-auto" id="print-quote-sheet">
                    
                    {/* Invoice/Quote Header */}
                    <div className="flex justify-between items-start gap-4 border-b-2 border-slate-900 pb-6">
                      <div>
                        <h2 className="text-xl font-extrabold tracking-wide text-slate-900">CORNERSTONE BUILDING BRANDS</h2>
                        <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono font-bold">North American Exterior Cladding Supplier</p>
                        <p className="text-[10px] text-slate-600 mt-1 leading-normal">
                          5015 Oak Forest Dr, Houston, TX 77092<br />
                          orders@cornerstonebuildingbrands.com
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-[10px] tracking-widest uppercase rounded">MATERIAL ESTIMATE</div>
                        <p className="text-xs font-mono font-bold text-slate-700 mt-2">QUOTE #: CBB-2026-90412</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">DATE: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Client & Shipping Metadata Row */}
                    <div className="grid grid-cols-2 gap-6 py-6 text-xs">
                      <div>
                        <h4 className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">QUOTE ISSUED TO:</h4>
                        <strong className="text-slate-800 font-extrabold text-xs block">{contractorName}</strong>
                        <p className="text-slate-600 mt-1 leading-normal">{projectAddress}</p>
                        <p className="text-slate-500 font-mono text-[10px] mt-0.5">{projectContact}</p>
                      </div>
                      <div>
                        <h4 className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">SHIPPING LOGISTICS PREDICTION:</h4>
                        <strong className="text-slate-800 font-extrabold text-xs block">{bomMetrics.logisticsType}</strong>
                        <p className="text-slate-500 mt-1 leading-normal">{bomMetrics.logisticsDesc}</p>
                        <p className="text-[10px] font-mono text-slate-600 mt-1 font-semibold">EST. WEIGHT: <span className="text-slate-800 font-bold">{bomMetrics.totalWeight.toFixed(1)} lbs</span></p>
                      </div>
                    </div>

                    {/* Itemized Materials Table */}
                    <table className="w-full text-xs mt-4">
                      <thead>
                        <tr className="border-b border-slate-900 text-[10px] font-mono font-extrabold text-slate-500 uppercase text-left">
                          <th className="py-2 pr-2">PART ID</th>
                          <th className="py-2 pr-2">DESCRIPTION</th>
                          <th className="py-2 pr-2">BRAND</th>
                          <th className="py-2 pr-2 text-center">QTY</th>
                          <th className="py-2 pr-2 text-right">UNIT WT</th>
                          <th className="py-2 pr-2 text-right">UNIT PRICE</th>
                          <th className="py-2 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bom.map((item) => (
                          <tr key={item.part.id} className="text-slate-700">
                            <td className="py-2.5 font-mono text-[10px] font-bold text-slate-900">#{item.part.id}</td>
                            <td className="py-2.5 pr-2">
                              <span className="font-bold text-slate-900 block leading-tight">{item.part.name}</span>
                              <span className="text-[9px] text-slate-400 block leading-normal mt-0.5">{item.part.material} | {item.part.finish}</span>
                            </td>
                            <td className="py-2.5 text-slate-600 font-medium">{item.part.brand}</td>
                            <td className="py-2.5 text-center font-bold text-slate-900">{item.quantity}</td>
                            <td className="py-2.5 text-right font-mono text-[10px]">{item.part.weight} lbs</td>
                            <td className="py-2.5 text-right font-mono text-[10px]">${item.part.cost.toFixed(2)}</td>
                            <td className="py-2.5 text-right font-mono font-bold text-slate-950">${(item.part.cost * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Summary Totals Footer */}
                    <div className="border-t border-slate-300 mt-6 pt-4 flex flex-col items-end gap-1.5 text-xs text-slate-600">
                      <div className="flex justify-between w-64">
                        <span>Total Items:</span>
                        <strong className="text-slate-800 font-bold">{bomMetrics.activeComponentsCount} pcs</strong>
                      </div>
                      <div className="flex justify-between w-64">
                        <span>Total Cargo Weight:</span>
                        <strong className="text-slate-800 font-bold">{bomMetrics.totalWeight.toFixed(1)} lbs</strong>
                      </div>
                      <div className="flex justify-between w-64 border-t-2 border-slate-900 pt-2 text-sm text-slate-900">
                        <span className="font-extrabold">ESTIMATED MATERIALS COST:</span>
                        <strong className="text-slate-950 font-extrabold">${bomMetrics.totalCost.toFixed(2)} USD</strong>
                      </div>
                    </div>

                    {/* Standard Terms and Sign-off */}
                    <div className="border-t border-slate-200 mt-12 pt-6 text-[9px] text-slate-400 leading-normal space-y-2">
                      <p>
                        **Disclaimer:** This estimate is synthesized for architectural modeling purposes only. Ultimate wind-load, structural dead load, thermal deflection limits, and building code compliances must be certified by a licensed structural engineer in the target jurisdiction.
                      </p>
                      <p className="text-center font-mono font-bold tracking-wider uppercase pt-4">
                        THANK YOU FOR CHOOSING CORNERSTONE BUILDING BRANDS
                      </p>
                    </div>

                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
