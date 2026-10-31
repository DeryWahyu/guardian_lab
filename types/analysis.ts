/**
 * Guardian Lab — Threat Analysis Type Definitions
 * Shared contracts for URL detection, QR analysis, forensic storage, and dual-mode presentation.
 */

export type AnalysisMode = "human" | "geek";

export interface TechnicalEvidence {
  [key: string]: unknown;
  entropy?: number;
  typosquatTarget?: string;
  levenshteinDistance?: number;
  similarityScore?: number;
  c2Endpoints?: string[];
  botTokens?: string[];
  permissions?: string[];
  suspiciousDexStrings?: string[];
  suspiciousTld?: string;
  suspiciousKeywords?: string[];
  httpHeaders?: Record<string, string>;
  ipReputation?: {
    ip?: string;
    asn?: string;
    country?: string;
    abuseScore?: number;
  };
  domainAgeDays?: number;
  tldRisk?: string;
}

export interface EmergencyActionPlan {
  ifNotClicked: string | string[];
  ifAlreadyInstalledOrFilled: string | string[];
}

export interface ThreatAnalysisResult {
  id?: string;
  target: string;
  type: "URL" | "QR" | "APK";
  riskLevel:
    | "SAFE"
    | "WARNING"
    | "DANGEROUS"
    | "PHISHING"
    | "MALWARE"
    | "CRITICAL"
    | "HIGH"
    | "MEDIUM"
    | "LOW";
  riskScore: number; // 0 - 100
  scamCategory: string;
  humanFriendlySummary: string;
  deceptionTricks: string[];
  technicalEvidence: TechnicalEvidence;
  emergencyActionPlan: EmergencyActionPlan;
  defangedTarget: string;
}

export interface ResultPresenterProps {
  result: ThreatAnalysisResult | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}
