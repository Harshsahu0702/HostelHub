import Hyperspeed from './components/Hyperspeed';
import { hyperspeedPresets } from './components/hyperspeedPresets'; // if you created it
export default function ToggleLandingPage() {
  return (
    <div className="min-h-screen relative">
      {/* Hyperspeed will append its canvas (#lights) inside itself */}
      <Hyperspeed effectOptions={hyperspeedPresets.one} />

      {/* Your UI content — keep on top with z-10 or higher */}
      <div className="relative z-10">
        {/* rest of landing page / header / forms */}
      </div>
    </div>
  );
}
