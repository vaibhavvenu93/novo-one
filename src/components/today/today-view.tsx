import { FounderBrief } from "@/components/today/founder-brief";
import { MetricStrip } from "@/components/today/metric-strip";
import { AttentionFeed } from "@/components/today/attention-feed";
import { OpportunityStack } from "@/components/today/opportunity-stack";
import { BrandPulse } from "@/components/today/brand-pulse";
import { AgentFeed } from "@/components/today/agent-feed";

export function TodayView() {
  return (
    <div className="today-view">
      <FounderBrief />

      <MetricStrip />

      <div className="today-primary-grid">
        <AttentionFeed />
        <OpportunityStack />
      </div>

      <BrandPulse />

      <AgentFeed />
    </div>
  );
}