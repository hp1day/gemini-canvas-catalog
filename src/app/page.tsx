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
  Package
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
  division: "siding" | "windows" | "metal" | "custom"
  divisionLabel: string
  brand: "Ply Gem" | "Simonton" | "Mastic" | "MBCI" | "Star Building Systems" | "Environmental Stoneworks" | "Custom Fabricated" | "Metl-Span"
  description: string
  weight: number // in lbs
  cost: number // in USD
  material: string
  finish: string
  specs: { label: string; value: string }[]
  svgBlueprint: React.ReactNode
  isSynthesized?: boolean
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

// Initial Parts List representing Cornerstone's primary divisions and brands
const INITIAL_PARTS: Part[] = [
  {
    id: "SID-VIN-001",
    name: "Mastic Quest Double 4\" Vinyl Siding Panel",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Mastic",
    description: "Premium vinyl siding panel with Tornado-Tough interlocking double-thick nail hem and realistic woodgrain cedar texture. Engineered to resist winds up to 240 mph.",
    weight: 5.3,
    cost: 14.50,
    material: "Impact-Resistant PVC Vinyl",
    finish: "Cedar-Grain Matte Finish",
    specs: [
      { label: "Nominal Thickness", value: "0.046 inches" },
      { label: "Profile Exposure", value: "8.0 inches (Double 4\")" },
      { label: "Panel Length", value: "12 feet 6 inches" },
      { label: "Flame Spread Index", value: "Class A (Fire Rated)" },
      { label: "Windload Capacity", value: "Up to 240 mph rating" },
      { label: "Interlock Design", value: "Tornado-Tough Double Hem" }
    ],
    svgBlueprint: Blueprints.vinylSiding
  },
  {
    id: "SID-ACC-002",
    name: "Ply Gem Heavy Duty Galvanized Siding Starter Strip",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Ply Gem",
    description: "Heavy-gauge galvanized steel base starter strip, precision-formed to lock and secure the initial course of exterior vinyl cladding panels.",
    weight: 1.8,
    cost: 5.25,
    material: "G90 Galvanized Carbon Steel",
    finish: "Zinc-Plated Mill Finish",
    specs: [
      { label: "Steel Gauge", value: "22 Gauge" },
      { label: "Profile Height", value: "2.5 inches" },
      { label: "Overall Length", value: "10 feet 0 inches" },
      { label: "Corrosion Resistance", value: "G90 Hot-Dip Coating" },
      { label: "Hole Punch Pattern", value: "1.0\" Slotted Eyelets" },
      { label: "Thermal Expansion Allow.", value: "0.25\" slider channels" }
    ],
    svgBlueprint: Blueprints.starterStrip
  },
  {
    id: "SID-STN-003",
    name: "Environmental Stoneworks dry-stack Ledgestone Corner",
    division: "siding",
    divisionLabel: "Siding, Stone & Trim",
    brand: "Environmental Stoneworks",
    description: "Hand-finished pre-cast concrete manufactured stone veneer corner unit. Replicates dry-stack ledgestone masonry with deep shadows, rich textures, and seamless corner wrap.",
    weight: 9.2,
    cost: 21.90,
    material: "Pre-Cast Portland Cement Concrete",
    finish: "Canyon Slate Earthtone Finish",
    specs: [
      { label: "Unit Height", value: "12.0 inches (Vertical)" },
      { label: "Left Leg Length", value: "8.0 inches (Exposed)" },
      { label: "Right Leg Length", value: "4.0 inches (Exposed)" },
      { label: "Water Absorption Ratio", value: "<8.0% (Meticulously Sealed)" },
      { label: "Compressive Strength", value: "3000 PSI Minimum" },
      { label: "Freeze-Thaw Performance", value: "ASTM C67 Compliant" }
    ],
    svgBlueprint: Blueprints.stoneCorner
  },
  {
    id: "WIN-DH-101",
    name: "Simonton DaylightMax Double-Hung Window Sash",
    division: "windows",
    divisionLabel: "Windows & Patio Doors",
    brand: "Simonton",
    description: "High-performance vinyl double-hung replacement window sash. Features double-strength Low-E glazing, multi-chamber thermal vinyl frames, and a dual-silicone weather-seal sweep.",
    weight: 26.5,
    cost: 95.00,
    material: "Multi-Cavity uPVC Structural Vinyl",
    finish: "Classic Extruded White Gloss",
    specs: [
      { label: "Overall Sash Width", value: "36.0 inches" },
      { label: "Overall Sash Height", value: "24.0 inches" },
      { label: "Glazing Spec", value: "Dual-Pane 1\" insulated Low-E" },
      { label: "Gas Cavity Fill", value: "90% Argon Gas Filled" },
      { label: "NFRC U-Factor Rating", value: "0.26 BTU/h·ft²·°F" },
      { label: "AAMA Structural Class", value: "Class LC-PG50 (Residential/Comm.)" }
    ],
    svgBlueprint: Blueprints.windowSash
  },
  {
    id: "WIN-ACC-102",
    name: "Ply Gem Constant Force Window Balance recoil assembly",
    division: "windows",
    divisionLabel: "Windows & Patio Doors",
    brand: "Ply Gem",
    description: "Heavy-duty 1/2-inch stainless steel coil tape sash balance system. Provides continuous, ultra-smooth, silent vertical sash lift and tension stabilization.",
    weight: 0.9,
    cost: 11.20,
    material: "High-Tensile 301 Stainless Steel",
    finish: "Natural Brushed Coil / Nylon Carrier",
    specs: [
      { label: "Tape Coil Width", value: "0.50 inches" },
      { label: "Weight Lifting Rating", value: "15.0 lbs Lift Capacity" },
      { label: "Travel Extension Limit", value: "38.0 inches max travel" },
      { label: "Cycles Life Durability", value: "10,000 full sashes lifts" },
      { label: "Recoil Spring Tension", value: "Constant 15.0 lbs pressure" },
      { label: "Nylon Carrier Spec", value: "Self-lubricating PTFE composite" }
    ],
    svgBlueprint: Blueprints.balanceSpring
  },
  {
    id: "WIN-HDW-103",
    name: "Simonton Heavy Duty Cam Action Window Sash Lock",
    division: "windows",
    divisionLabel: "Windows & Patio Doors",
    brand: "Simonton",
    description: "Architectural zinc die-cast cam action lock and keeper. Draws upper and lower sashes tightly together to compress sash seals, blocking water and air infiltration.",
    weight: 0.4,
    cost: 6.80,
    material: "Die-Cast Zinc Alloy",
    finish: "Powder Coated Oil Rubbed Bronze",
    specs: [
      { label: "Mounting Screw Center", value: "2.062 inches" },
      { label: "Lock Base Width", value: "1.12 inches" },
      { label: "Keeper Offset Gap", value: "0.312 inches offset" },
      { label: "Cam Throw Radius", value: "90 degrees positive stop" },
      { label: "Sash Pull-Together", value: "0.062\" latch compression draw" },
      { label: "Security Level", value: "Forced Entry Certified Level 10" }
    ],
    svgBlueprint: Blueprints.camLock
  },
  {
    id: "MTL-ROF-201",
    name: "MBCI Lok-Seam Standing Seam Metal Roof Panel",
    division: "metal",
    divisionLabel: "Metal & Commercial Solutions",
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
      { label: "Standard Panel Length", value: "10 feet (Shippable)" },
      { label: "Yield Strength Rating", value: "50,000 PSI structural" },
      { label: "UL Fire/Impact Class", value: "Class A Fire / Class 4 Hail" }
    ],
    svgBlueprint: Blueprints.standingSeam
  },
  {
    id: "MTL-WAL-202",
    name: "Metl-Span CF Insulated Metal Architectural Wall Panel",
    division: "metal",
    divisionLabel: "Metal & Commercial Solutions",
    brand: "Metl-Span",
    description: "Commercial architectural exterior insulated sandwich panel. Features high-performance polyurethane core bonded between 26-gauge Galvalume steel skins with a thermal-break dry joint.",
    weight: 41.2,
    cost: 115.00,
    material: "PU Foam Core / Galvalume Steel",
    finish: "Flouropon Textured Sandstone",
    specs: [
      { label: "Panel Cover Width", value: "42.0 inches" },
      { label: "Insulating Core Thick.", value: "3.0 inches" },
      { label: "Overall Panel Length", value: "8 feet (Segment)" },
      { label: "R-Value Thermal Resist.", value: "R-22.5 BTU/h·ft²·°F" },
      { label: "Inner Skin Thickness", value: "26 Gauge Galvalume" },
      { label: "Side Joint Seal", value: "Double tongue & groove vinyl gasket" }
    ],
    svgBlueprint: Blueprints.insulatedPanel
  },
  {
    id: "MTL-STR-203",
    name: "Star Building Systems Structural Z-Purlin Member",
    division: "metal",
    divisionLabel: "Metal & Commercial Solutions",
    brand: "Star Building Systems",
    description: "Heavy-duty cold-formed secondary structural steel Z-member. Engineered to span between main portal rigid frames to support metal roof panel fast clips.",
    weight: 48.5,
    cost: 45.00,
    material: "Cold-Formed High-Strength Steel",
    finish: "Pre-Galvanized Protective Mill Coat",
    specs: [
      { label: "Web Depth (Height)", value: "8.0 inches" },
      { label: "Steel Base Thickness", value: "14 Gauge (0.075\")" },
      { label: "Overall Length", value: "12 feet" },
      { label: "Steel Grade Rating", value: "ASTM A653 Grade 55" },
      { label: "Mounting Flange Widths", value: "2.5\" top flange / 2.25\" bot flange" },
      { label: "Lap Splice Capability", value: "Standard 2.0' lap overlapping holes" }
    ],
    svgBlueprint: Blueprints.zPurlin
  },
  {
    id: "MTL-ACC-204",
    name: "MBCI Pre-Formed Peaked Ridge Cap Flashing Trim",
    division: "metal",
    divisionLabel: "Metal & Commercial Solutions",
    brand: "MBCI",
    description: "Premium heavy-duty ridge flashing, pre-peaked to cover standing seam peaks. Designed with water-safety returned hems and weather seal compression lines.",
    weight: 6.8,
    cost: 24.50,
    material: "Prepainted Galvalume Carbon Steel",
    finish: "Kynar 500 Cornerstone Navy Blue",
    specs: [
      { label: "Steel Gauge Thickness", value: "26 Gauge" },
      { label: "Flat Sheet Width", value: "12.0 inches (Girth)" },
      { label: "Peak Angle Profile", value: "120 Degrees (Peaked)" },
      { label: "Trim Segment Length", value: "10 feet 0 inches" },
      { label: "Side Safety Returned Hem", value: "0.50\" returned safety drip edge" },
      { label: "Substrate Coating Spec", value: "AZ50 Galvalume Alloy" }
    ],
    svgBlueprint: Blueprints.ridgeCap
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
}

export default function Home() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS)
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

  // Custom Flashing/Trim Configurator State
  const [trimProfile, setTrimProfile] = useState<"j-channel" | "corner-post" | "ridge-cap" | "drip-edge" | "u-trim">("j-channel")
  const [trimLength, setTrimLength] = useState<number>(10) // in feet (5 - 30)
  const [trimGauge, setTrimGauge] = useState<string>("24 ga") // 22, 24, 26, 29
  const [trimMaterial, setTrimMaterial] = useState<string>("Galvalume Steel") // Steel, Aluminum, Vinyl
  const [trimColor, setTrimColor] = useState<string>("Cornerstone Navy") // Navy, White, Grey, Green, Sand, Bronze
  const [fabricatePrompt, setFabricatePrompt] = useState("")
  const [fabricateStep, setFabricateStep] = useState<number>(-1) // -1 is idle, 0 to 6 are steps, 7 is done
  const [newlyFabricatedPart, setNewlyFabricatedPart] = useState<Part | null>(null)
  
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
        part.divisionLabel.toLowerCase().includes(searchQuery.toLowerCase())
      
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

  // Simulated AI response triggering on prompt template or custom search
  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || chatInput
    if (!query.trim()) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setChatMessages(prev => [...prev, userMsg])
    if (!textToSend) setChatInput("")
    setIsAiTyping(true)

    // Generate response matching actual structural and thermal engineering formulas
    setTimeout(() => {
      let responseText = ""
      let codeSnippet = ""
      let tableData: { label: string; value: string }[] | undefined = undefined

      const norm = query.toLowerCase()

      if (norm.includes("siding") || norm.includes("wind") || norm.includes("pressure") || norm.includes("hurricane")) {
        responseText = "### Siding Wind Resistance Technical Report\nBased on your prompt constraints of a **130 mph design wind speed (Category III Hurricane Zone)**, the siding cladding assembly must withstand specific negative pressure wind loads.\n\nAccording to **ASCE 7-22 (Minimum Design Loads for Buildings)**, the design wind pressure $P$ is computed based on Exposure Category C, building height, and localized wall zone factors.\n\nFor an average wall height of 30 feet, a 130 mph wind generates a localized negative design pressure of approximately **-28.5 psf** (pounds per square foot) on standard wall zones, rising up to **-44.2 psf** at building corner zones (Zone 5).\n\n**Mastic Quest Double 4\" Vinyl Siding** has been meticulously tested under ASTM D5206 and is certified up to a maximum load of **-62.5 psf** (representing 240 mph safety margins), when installed using G90 steel starter strips and fastener spacings of 16\" on-center. It meets and exceeds these design requirements by a comfortable safety margin."
        tableData = [
          { label: "Design Wind Velocity", value: "130 mph" },
          { label: "Wall Zone 4 Design Pressure", value: "-28.5 psf" },
          { label: "Wall Zone 5 (Corner) Pressure", value: "-44.2 psf" },
          { label: "Mastic Quest Test Capacity", value: "-62.5 psf (ASTM D5206)" },
          { label: "Corner Safety Factor", value: "1.41 (Passed)" },
          { label: "Fastener Requirement", value: "8d Ring-Shank Nails spaced 16\" o.c." }
        ]
      } else if (norm.includes("window") || norm.includes("thermal") || norm.includes("energy") || norm.includes("u-factor") || norm.includes("star")) {
        responseText = "### Simonton DaylightMax Glazing thermal Analysis\nYes, the **Simonton DaylightMax Double-Hung Window Sash** meets and qualifies for the rigorous **Energy Star Version 7.0 Northern Zone** standards. \n\nLet's evaluate the thermal transfer mechanics. In the Northern Zone, Energy Star 7.0 requires a maximum **U-Factor $\\le 0.22$** for windows with a Solar Heat Gain Coefficient (SHGC) of any value, or a **U-Factor of 0.23 - 0.24** with an $\\text{SHGC} \\ge 0.35$ (to utilize solar gain for cold climates).\n\nWhen customized with our dual-pane 1\" insulated Low-E glazing, multi-chamber uPVC structural chambers, and 90% Argon Gas fills, the Simonton DaylightMax delivers an NFRC-certified **U-Factor of 0.22 BTU/h·ft²·°F** and an **SHGC of 0.28**. This completely blocks conductive heat transfer during cold northern winters, retaining interior heat while allowing beautiful visible light transmission (VT: 0.52)."
        tableData = [
          { label: "Northern Zone Limit (ES 7.0)", value: "U-Factor <= 0.22" },
          { label: "DaylightMax Certified U-Factor", value: "0.22 BTU/h·ft²·°F (Qualified)" },
          { label: "Solar Heat Gain (SHGC)", value: "0.28 (Optimized)" },
          { label: "Visible Transmittance (VT)", value: "0.52 (High Clarity)" },
          { label: "Structural Rating", value: "AAMA LC-PG50" },
          { label: "Gas Filling", value: "90% Argon Gas Seal" }
        ]
      } else if (norm.includes("seam") || norm.includes("purlin") || norm.includes("snow") || norm.includes("span") || norm.includes("spacing")) {
        responseText = "### Commercial Roof Structural Span Tables\nFor a warehouse roof system clad with **MBCI 16\" Lok-Seam standing seam panels (24-gauge)** supporting a **30 psf live snow load** and **10 psf dead load** (total load: 40 psf), secondary framing spacing is calculated using the moment capacity of cold-formed steel and deflection criteria of L/180.\n\nUsing **Star Building Systems 8\" structural Z-purlins (14-gauge)** with ASTM A653 Grade 55 steel, we run structural flexure calculations. A single span purlin can safely support the 40 psf gravity load with a maximum spacing of **5 feet 0 inches on-center**, yielding a deflection of 0.38\" (which is less than the L/180 limit of 0.80\" across a standard 12-foot span). If snow drifts create localized pockets up to 50 psf, we recommend reducing the purlin spacing at the bays to **4 feet 0 inches on-center**."
        tableData = [
          { label: "Total Uniform Design Load", value: "40.0 psf" },
          { label: "Purlin Height & Gauge", value: "8.0 inches (14 Gauge)" },
          { label: "Purlin Span Length", value: "12 feet 0 inches" },
          { label: "Max spacing (40 psf Load)", value: "5' 0\" On-Center" },
          { label: "Max spacing (50 psf Drift)", value: "4' 0\" On-Center" },
          { label: "Calculated Flexural stress", value: "22,500 PSI (Safe limit 33,000 PSI)" },
          { label: "Deflection Ratio", value: "L/380 (Passed L/180 standard)" }
        ]
      } else {
        responseText = "I've processed your custom architectural requirements. I recommend aligning this request with components like the **" + parts[0].name + "** or our high-grade **" + parts[6].name + "**. Let me know if you would like me to draft structural span load profiles, check window wind-load resistance, or evaluate local thermal coefficient compliance!"
      }

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: "ai",
        text: responseText,
        codeSnippet,
        tableData,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setChatMessages(prev => [...prev, aiMsg])
      setIsAiTyping(false)
    }, 1500)
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
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-orange-500 p-0.5 shadow-lg flex items-center justify-center">
            <div className="h-full w-full rounded-[10px] bg-[#0f2d59] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-orange-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider text-white flex items-center gap-2">
              CORNERSTONE <span className="text-[#1a4f7c] font-medium">|</span> <span className="text-[10px] font-bold tracking-wide px-2.5 py-0.5 bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">Parts Catalog System</span>
            </h1>
            <p className="text-[9px] text-slate-300 uppercase tracking-widest font-mono font-bold">North American Exterior Cladding Database</p>
          </div>
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
        <section className="xl:col-span-8 flex flex-col gap-6">
          
          <Tabs defaultValue="parts" className="w-full flex flex-col flex-1">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
              <TabsList className="bg-slate-200 p-1 border border-slate-300 rounded-xl shadow-inner">
                <TabsTrigger value="parts" className="text-xs font-bold py-1.5 px-3 rounded-lg data-[state=active]:bg-[#0f2d59] data-[state=active]:text-white text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 transition-all">
                  <Boxes className="h-3.5 w-3.5" /> Product Catalog
                </TabsTrigger>
                <TabsTrigger value="fabricator" className="text-xs font-bold py-1.5 px-3 rounded-lg data-[state=active]:bg-purple-700 data-[state=active]:text-white text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 transition-all">
                  <Hammer className="h-3.5 w-3.5" /> Custom Flashing Configurator
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-xs font-bold py-1.5 px-3 rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 transition-all">
                  <Sparkles className="h-3.5 w-3.5" /> Gemini Technical Assistant
                </TabsTrigger>
              </TabsList>

              {/* Filtering & Sorting Controls inside Catalog view */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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
            </div>

            {/* TAB 1: PRODUCT CATALOG GRID */}
            <TabsContent value="parts" className="mt-0 focus-visible:ring-0 focus-visible:outline-none">
              
              {/* Category Segment Selectors */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { id: "all", label: "All Exterior Systems" },
                  { id: "siding", label: "Siding & Stone" },
                  { id: "windows", label: "Windows & Patio Doors" },
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
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
                <span>Displaying <strong>{filteredParts.length}</strong> matching building parts</span>
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
                    <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Wrench className="h-4 w-4 text-purple-600" /> Extrusion Flashing Parameters
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
                                if (fabricateStep !== -1) return
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
                            if (fabricateStep !== -1) return
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
                              if (fabricateStep !== -1) return
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
                              if (fabricateStep !== -1) return
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
                                if (fabricateStep !== -1) return
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
                
                {/* Chat message dialog panel */}
                <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden h-full shadow-sm">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                    <span className="flex items-center gap-1.5 font-bold"><Sparkles className="h-3.5 w-3.5 text-orange-600 animate-pulse" /> GEMINI AI SPEC ENGINE</span>
                    <span className="text-[9px] text-slate-400 font-bold">KNOWLEDGE BASIS: CORNERSTONE BRANDS v7.0</span>
                  </div>

                  {/* Messages bubble container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs custom-scrollbar bg-slate-50/30">
                    {chatMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
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
                          <div className="whitespace-pre-line text-[11.5px] font-sans prose prose-slate max-w-none">
                            {msg.text}
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
                    ))}
                    
                    {isAiTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="h-7 w-7 rounded bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                          <Sparkles className="h-4 w-4 animate-spin" />
                        </div>
                        <div className="bg-white rounded-xl px-4 py-3 text-slate-500 italic border border-slate-200 shadow-sm">
                          <span className="flex items-center gap-1">
                            Analyzing mechanical loads & searching exterior architectural standards...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat input box */}
                  <div className="p-3 border-t border-slate-200 bg-slate-50/50">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSendMessage()
                      }}
                      className="flex gap-2"
                    >
                      <Input 
                        placeholder="Ask about windload rating, thermal U-factor, purlin span spacing..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="text-xs bg-white border-slate-200 text-slate-800 rounded-lg h-9.5 focus:border-[#0f2d59] placeholder:text-slate-400 shadow-sm"
                      />
                      <Button 
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-500 text-white rounded-lg h-9.5 px-4 cursor-pointer shadow-sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Pre-loaded help templates panel */}
                <div className="lg:col-span-4 flex flex-col gap-3 h-full">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 flex-1 flex flex-col shadow-sm">
                    <h3 className="text-xs font-bold font-mono tracking-widest text-slate-500 uppercase border-b border-slate-100 pb-2 mb-3">Specification Templates</h3>
                    <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">Select a template below to simulate detailed engineering calculations for Cornerstone exterior components.</p>
                    
                    <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                      {PROMPT_HELPERS.map((helper) => (
                        <Card 
                          key={helper.title}
                          onClick={() => handleSendMessage(helper.prompt)}
                          className="p-3 border-slate-200 hover:border-orange-500/50 hover:bg-orange-50/20 bg-slate-50 cursor-pointer group transition-all shadow-sm"
                        >
                          <h4 className="text-[11.5px] font-extrabold text-slate-800 group-hover:text-orange-600 transition-colors">{helper.title}</h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{helper.prompt}</p>
                          <span className="text-[9px] font-bold text-orange-600 group-hover:underline flex items-center gap-1.5 mt-2">
                            {helper.short} <ArrowRight className="h-3 w-3" />
                          </span>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </TabsContent>

          </Tabs>

        </section>

        {/* RIGHT DRAWER: ACTIVE PART SPECS & PROJECT BOM (CART) */}
        <section className="xl:col-span-4 flex flex-col gap-6">
          
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
                <p className="text-[11px] text-slate-600 leading-relaxed mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedPart.description}
                </p>

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

                <Button 
                  onClick={() => {
                    alert(`Finalizing specification list. Generated comprehensive Excel BOM and certified CAD export for ${bomMetrics.activeComponentsCount} components. Preparing shipment forecast via ${bomMetrics.logisticsType}.`)
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold h-9 rounded-lg text-xs tracking-wider uppercase cursor-pointer shadow-md shadow-orange-600/10"
                >
                  Generate CAD & Spec Quote
                </Button>
              </div>
            )}
          </div>

        </section>

      </main>
    </div>
  )
}
