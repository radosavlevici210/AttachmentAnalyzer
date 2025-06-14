export default function Waveform() {
  return (
    <div className="bg-card rounded-lg p-3">
      <div className="flex items-center justify-center h-12">
        {Array.from({ length: 20 }, (_, i) => (
          <div 
            key={i} 
            className="waveform-bar" 
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}
