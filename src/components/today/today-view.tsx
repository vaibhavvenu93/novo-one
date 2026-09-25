import { AgentActivity } from "@/components/today/agent-activity";
import { AttentionFeed } from "@/components/today/attention-feed";
import { BrandGrid } from "@/components/today/brand-grid";
import { MetricStrip } from "@/components/today/metric-strip";
import { MorningBrief } from "@/components/today/morning-brief";
import { OpportunityFeed } from "@/components/today/opportunity-feed";

export function TodayView() {
  return (
    <div className="today-view">
      <MorningBrief />
      <MetricStrip />
      <AttentionFeed />
      <BrandGrid />
      <OpportunityFeed />
      <AgentActivity />
    </div>
  );
}