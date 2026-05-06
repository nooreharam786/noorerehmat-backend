import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesStrip } from "@/components/home/FeaturesStrip";
import { StatsBar } from "@/components/home/StatsBar";
import { InfoColumns } from "@/components/home/InfoColumns";
import { Testimonials } from "@/components/home/Testimonials";
import { LuckyDrawHighlight } from "@/components/home/LuckyDrawHighlight";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesStrip />
      <StatsBar />
      <InfoColumns />
      <LuckyDrawHighlight />
      <Testimonials />
    </Layout>
  );
};

export default Index;
