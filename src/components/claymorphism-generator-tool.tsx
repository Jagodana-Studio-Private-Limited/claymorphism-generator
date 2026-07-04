"use client";

import { useState, useMemo, useCallback } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolEvents } from "@/lib/analytics";

interface ClayConfig {
  bgColor: string;
  shadowDark: string;
  shadowLight: string;
  borderRadius: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  innerHighlight: boolean;
  innerOpacity: number;
  width: number;
  height: number;
  padding: number;
}

const PRESETS: { name: string; emoji: string; config: Partial<ClayConfig> }[] = [
  {
    name: "Coral",
    emoji: "🍑",
    config: {
      bgColor: "#FF6B6B",
      shadowDark: "#c94343",
      shadowLight: "#ff9e9e",
    },
  },
  {
    name: "Sky",
    emoji: "💙",
    config: {
      bgColor: "#4FC3F7",
      shadowDark: "#0288d1",
      shadowLight: "#81d4fa",
    },
  },
  {
    name: "Mint",
    emoji: "🌿",
    config: {
      bgColor: "#66BB6A",
      shadowDark: "#2e7d32",
      shadowLight: "#a5d6a7",
    },
  },
  {
    name: "Lavender",
    emoji: "💜",
    config: {
      bgColor: "#CE93D8",
      shadowDark: "#7b1fa2",
      shadowLight: "#e1bee7",
    },
  },
  {
    name: "Sunshine",
    emoji: "☀️",
    config: {
      bgColor: "#FFD54F",
      shadowDark: "#f9a825",
      shadowLight: "#fff9c4",
    },
  },
  {
    name: "Peach",
    emoji: "🍊",
    config: {
      bgColor: "#FFAB76",
      shadowDark: "#e65100",
      shadowLight: "#ffccbc",
    },
  },
];

const DEFAULT_CONFIG: ClayConfig = {
  bgColor: "#FF6B6B",
  shadowDark: "#c94343",
  shadowLight: "#ff9e9e",
  borderRadius: 28,
  shadowBlur: 20,
  shadowSpread: 0,
  shadowOffsetX: 8,
  shadowOffsetY: 8,
  innerHighlight: true,
  innerOpacity: 60,
  width: 200,
  height: 200,
  padding: 32,
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function buildBoxShadow(cfg: ClayConfig): string {
  const dark = hexToRgb(cfg.shadowDark);
  const light = hexToRgb(cfg.shadowLight);

  const darkShadow = dark
    ? `rgba(${dark.r}, ${dark.g}, ${dark.b}, 0.5)`
    : "rgba(0, 0, 0, 0.3)";
  const lightShadow = light
    ? `rgba(${light.r}, ${light.g}, ${light.b}, 0.8)`
    : "rgba(255, 255, 255, 0.7)";

  const layers = [
    `${cfg.shadowOffsetX}px ${cfg.shadowOffsetY}px ${cfg.shadowBlur}px ${cfg.shadowSpread}px ${darkShadow}`,
    `-${Math.round(cfg.shadowOffsetX * 0.5)}px -${Math.round(cfg.shadowOffsetY * 0.5)}px ${Math.round(cfg.shadowBlur * 0.7)}px ${cfg.shadowSpread}px ${lightShadow}`,
  ];

  if (cfg.innerHighlight) {
    const insetOpacity = cfg.innerOpacity / 100;
    layers.push(
      `inset 0 2px ${Math.round(cfg.shadowBlur * 0.5)}px 0 rgba(255, 255, 255, ${insetOpacity.toFixed(2)})`
    );
  }

  return layers.join(",\n  ");
}

function buildCSS(cfg: ClayConfig): string {
  const boxShadow = buildBoxShadow(cfg);
  return `.clay-element {
  background-color: ${cfg.bgColor};
  border-radius: ${cfg.borderRadius}px;
  box-shadow:
  ${boxShadow};
  padding: ${cfg.padding}px;
}`;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step = 1, unit = "px", onChange }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <label className="text-muted-foreground">{label}</label>
        <span className="font-mono text-xs font-medium tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-border accent-brand"
      />
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-muted-foreground flex-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="w-20 h-8 rounded-md border border-border bg-background px-2 text-xs font-mono"
          maxLength={7}
        />
        <div className="relative">
          <div
            className="w-8 h-8 rounded-md border border-border cursor-pointer overflow-hidden"
            style={{ backgroundColor: value }}
          >
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClaymorphismGeneratorTool() {
  const [cfg, setCfg] = useState<ClayConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  const update = useCallback(<K extends keyof ClayConfig>(key: K, value: ClayConfig[K]) => {
    setCfg((prev) => ({ ...prev, [key]: value }));
    setActivePreset(-1);
  }, []);

  const applyPreset = useCallback((idx: number) => {
    const preset = PRESETS[idx];
    setCfg((prev) => ({ ...prev, ...preset.config }));
    setActivePreset(idx);
    ToolEvents.toolUsed("preset");
  }, []);

  const reset = useCallback(() => {
    setCfg(DEFAULT_CONFIG);
    setActivePreset(0);
  }, []);

  const css = useMemo(() => buildCSS(cfg), [cfg]);
  const boxShadow = useMemo(() => buildBoxShadow(cfg), [cfg]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
      toast.success("CSS copied to clipboard!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy CSS");
    }
  }, [css]);

  const previewStyle = {
    backgroundColor: cfg.bgColor,
    borderRadius: `${cfg.borderRadius}px`,
    boxShadow: boxShadow,
    width: `${cfg.width}px`,
    height: `${cfg.height}px`,
    padding: `${cfg.padding}px`,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    transition: "all 0.2s ease",
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[1fr_420px] gap-6">
        {/* Preview Panel */}
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Preview</h2>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, i) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activePreset === i
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-background text-muted-foreground hover:border-brand/50 hover:text-foreground"
                }`}
              >
                <span>{preset.emoji}</span>
                {preset.name}
              </button>
            ))}
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 min-h-64 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-40 dot-pattern" />
            <div style={previewStyle} className="relative z-10 shadow-none">
              <span className="text-white/80 text-sm font-medium select-none">
                Clay Element
              </span>
            </div>
          </div>

          {/* CSS Output */}
          <div className="rounded-xl border border-border/50 bg-background overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
              <span className="text-xs font-mono text-muted-foreground">CSS</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-7 gap-1.5 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy CSS
                  </>
                )}
              </Button>
            </div>
            <pre className="p-4 text-xs font-mono text-foreground/80 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {css}
            </pre>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-6 space-y-6">
          <h2 className="font-semibold text-lg">Controls</h2>

          {/* Colors */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Colors
            </h3>
            <ColorPicker
              label="Background"
              value={cfg.bgColor}
              onChange={(v) => update("bgColor", v)}
            />
            <ColorPicker
              label="Dark Shadow"
              value={cfg.shadowDark}
              onChange={(v) => update("shadowDark", v)}
            />
            <ColorPicker
              label="Light Shadow"
              value={cfg.shadowLight}
              onChange={(v) => update("shadowLight", v)}
            />
          </div>

          {/* Shadows */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Shadow
            </h3>
            <Slider
              label="Offset X"
              value={cfg.shadowOffsetX}
              min={0}
              max={40}
              onChange={(v) => update("shadowOffsetX", v)}
            />
            <Slider
              label="Offset Y"
              value={cfg.shadowOffsetY}
              min={0}
              max={40}
              onChange={(v) => update("shadowOffsetY", v)}
            />
            <Slider
              label="Blur"
              value={cfg.shadowBlur}
              min={0}
              max={60}
              onChange={(v) => update("shadowBlur", v)}
            />
            <Slider
              label="Spread"
              value={cfg.shadowSpread}
              min={-20}
              max={20}
              onChange={(v) => update("shadowSpread", v)}
            />
          </div>

          {/* Inner Highlight */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Inner Highlight
              </h3>
              <button
                onClick={() => update("innerHighlight", !cfg.innerHighlight)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  cfg.innerHighlight ? "bg-brand" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    cfg.innerHighlight ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {cfg.innerHighlight && (
              <Slider
                label="Opacity"
                value={cfg.innerOpacity}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => update("innerOpacity", v)}
              />
            )}
          </div>

          {/* Shape */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Shape
            </h3>
            <Slider
              label="Border Radius"
              value={cfg.borderRadius}
              min={0}
              max={60}
              onChange={(v) => update("borderRadius", v)}
            />
            <Slider
              label="Width"
              value={cfg.width}
              min={80}
              max={320}
              onChange={(v) => update("width", v)}
            />
            <Slider
              label="Height"
              value={cfg.height}
              min={80}
              max={320}
              onChange={(v) => update("height", v)}
            />
            <Slider
              label="Padding"
              value={cfg.padding}
              min={8}
              max={64}
              onChange={(v) => update("padding", v)}
            />
          </div>

          <Button
            onClick={handleCopy}
            className="w-full gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy CSS
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
