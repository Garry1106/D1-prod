import { LucideIcon } from "lucide-react";

export interface Industry {
  name: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  benefits: string[];
  features: string[];
}

export interface Metric {
  label: string;
  value: string;
}

export interface Product {
  title: string;
  description: string;
  details: string[];
  metrics: Metric[];
  image: string;
  comingSoon?: boolean;
}
