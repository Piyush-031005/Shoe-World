export interface ProductDefinition {
  id: string;
  name: string;
  category: "Hero" | "Sports" | "Boot" | "Formal" | "Slipper" | "Crocs";
  environment: {
    ground: "studio" | "stone" | "snow" | "track" | "rock" | "marble" | "wood" | "grass";
    weather: "clear" | "mist" | "wind" | "warm" | "sunlight";
    fogColor: string;
    fogDensity: number;
  };
  physics: {
    orbitRadius: number; // Distance from center in constellation
    orbitSpeed: number;  // Speed of rotation
    weight: number;      // Inertia / mass feel
    hoverForce: number;  // How much it pulls toward camera on hover
  };
  cameraPreset: "low-angle" | "eye-level" | "macro" | "orbit";
  materials: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export const PRODUCTS: ProductDefinition[] = [
  {
    id: "hero-1",
    name: "The Journey Core",
    category: "Hero",
    environment: {
      ground: "studio",
      weather: "clear",
      fogColor: "#050508",
      fogDensity: 0.05,
    },
    physics: { orbitRadius: 0, orbitSpeed: 0, weight: 1.5, hoverForce: 0 },
    cameraPreset: "orbit",
    materials: { primaryColor: "#2A2A2A", secondaryColor: "#F0EDE8" },
  },
  {
    id: "sports-1",
    name: "Aero Velocity",
    category: "Sports",
    environment: {
      ground: "track",
      weather: "mist",
      fogColor: "#A8C8E8", // Cold mist
      fogDensity: 0.08,
    },
    physics: { orbitRadius: 4, orbitSpeed: 0.15, weight: 0.8, hoverForce: 1.2 },
    cameraPreset: "eye-level",
    materials: { primaryColor: "#8B1A1A", secondaryColor: "#FFFFFF" },
  },
  {
    id: "boot-1",
    name: "Himalaya Trek",
    category: "Boot",
    environment: {
      ground: "rock",
      weather: "wind",
      fogColor: "#1A1A1F", // Graphite
      fogDensity: 0.04,
    },
    physics: { orbitRadius: 6, orbitSpeed: 0.08, weight: 2.0, hoverForce: 0.5 },
    cameraPreset: "low-angle",
    materials: { primaryColor: "#6B3A1F", secondaryColor: "#2A2A2A" },
  },
  {
    id: "formal-1",
    name: "Midnight Oxford",
    category: "Formal",
    environment: {
      ground: "marble",
      weather: "warm",
      fogColor: "#110D0A", // Warm dark
      fogDensity: 0.02,
    },
    physics: { orbitRadius: 5, orbitSpeed: 0.1, weight: 1.2, hoverForce: 0.8 },
    cameraPreset: "eye-level",
    materials: { primaryColor: "#111111", secondaryColor: "#333333" },
  },
  {
    id: "crocs-1",
    name: "Valley Clog",
    category: "Crocs",
    environment: {
      ground: "grass",
      weather: "sunlight",
      fogColor: "#1B3A2A", // Forest green tint
      fogDensity: 0.03,
    },
    physics: { orbitRadius: 7, orbitSpeed: 0.12, weight: 0.6, hoverForce: 1.5 },
    cameraPreset: "eye-level",
    materials: { primaryColor: "#1B3A2A", secondaryColor: "#B87333" },
  },
];
