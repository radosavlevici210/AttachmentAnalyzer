export default function Timeline() {
  return (
    <div className="bg-card rounded-lg p-4 mb-6">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Production Timeline</span>
        <span>43.0 Hours Total</span>
      </div>
      <div className="timeline-bar rounded-full">
        <div className="timeline-scanner"></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Pre-production</span>
        <span>Recording</span>
        <span>Post-production</span>
        <span>Export</span>
      </div>
    </div>
  );
}
