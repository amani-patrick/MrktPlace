export type AgentBadge = "trusted_commissioner" | "quality_lister" | "quick_responder";

export interface AgentProfile {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  servesIn: string[];
  district: string;
  languages: string[];
  rentCount: number;
  saleCount: number;
  agency: string;
  agencyShort: string;
  rating: number;
  responseTime: string;
  phoneVerified: boolean;
  badges: AgentBadge[];
  whatsapp: string;
}
