import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-overlay': 'var(--gradient-overlay)',
      },
      boxShadow: {
        'elegant': 'var(--shadow-elegant)',
        'card': 'var(--shadow-card)',
        'button': 'var(--shadow-button)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Accordion
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        
        // Page transitions
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        
        // Scale animations
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.95)", opacity: "0" },
        },
        
        // Slide animations
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-down": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        
        // Bounce animations
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        
        // Pulse animations
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        
        // Spin variations
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        
        // Wiggle
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        
        // Shake
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        
        // Float
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        
        // Glow
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--primary))" },
          "50%": { boxShadow: "0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))" },
        },
      },
      animation: {
        // Default animations
        "accordion-down": "accordion-down 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Page transitions
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fade-out 0.3s cubic-bezier(0.4, 0, 1, 1)",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-out": "scale-out 0.3s cubic-bezier(0.4, 0, 1, 1)",
        
        // Slide animations
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-right": "slide-out-right 0.4s cubic-bezier(0.4, 0, 1, 1)",
        "slide-in-left": "slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-up": "slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-down": "slide-in-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        
        // Interactive animations
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "shake": "shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        
        // Combined animations
        "enter": "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
        "exit": "fade-out 0.3s ease-out, scale-out 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
