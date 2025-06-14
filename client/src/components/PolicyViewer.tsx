import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText, Scale, Settings } from 'lucide-react';

export function PolicyViewer() {
  const [selectedPolicy, setSelectedPolicy] = useState('overview');

  const policies = [
    {
      id: 'overview',
      title: 'AI/AGI Overview',
      icon: <Settings className="w-4 h-4" />,
      status: 'Active',
      description: 'Comprehensive AI/AGI system overview and capabilities',
      content: `
# AI Studio Pro - Quantum Neural System

## System Capabilities
- **Unlimited Movie Production**: Professional script-to-video generation with 8K/4K/IMAX quality
- **Unlimited Music Creation**: Advanced lyrics-to-music generation with professional mastering
- **Professional Voice Generation**: Text-to-speech with multiple voice profiles
- **AI Content Analysis**: Comprehensive content analysis with mood detection

## Neural Processing Features
- Quantum Neural Processing with advanced pattern recognition
- Invisible Neural Operations for optimal efficiency
- Real-time Quantum Data Processing and forecasting
- Background Neural Optimization for seamless operation

## Production Standards
- Professional-grade quality settings (8K/4K/IMAX/HD)
- Advanced audio enhancements (Dolby Atmos/DTS:X/Surround)
- Batch processing with unlimited parallel generation
- Real-time progress tracking and timeline visualization
      `
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield className="w-4 h-4" />,
      status: 'Enforced',
      description: 'Data protection and privacy safeguards',
      content: `
# Security & Privacy Policy

## Data Protection
- **Quantum Encryption**: Military-grade quantum encryption for all data
- **Neural Data Anonymization**: Advanced anonymization techniques
- **Secure Storage**: Quantum-protected data storage systems
- **Background Privacy Monitoring**: Invisible privacy compliance monitoring

## Access Control
- Multi-factor authentication and authorization
- Role-based access control for different user levels
- Comprehensive audit trails for all activities
- Emergency access controls and monitoring

## Privacy Rights
- Complete protection of neural patterns and data
- User control over personal data collection and usage
- Right to data deletion and portability
- Transparent data processing practices with clear consent
      `
    },
    {
      id: 'compliance',
      title: 'Legal Compliance',
      icon: <Scale className="w-4 h-4" />,
      status: 'Verified',
      description: 'International standards and legal framework',
      content: `
# Legal Compliance Framework

## International Standards
- **ISO/IEC 23053**: Framework for AI risk management
- **IEEE Standards**: AI system design and implementation
- **EU AI Act**: Compliance with European AI regulations
- **GDPR/CCPA**: Data protection and privacy regulations

## IP Protection
- **Worldwide Master License**: Global intellectual property protection
- **Patent Protection**: International patent coverage
- **Copyright Compliance**: Respect for third-party IP rights
- **Trademark Protection**: Brand and identity safeguards

## Regulatory Framework
- Complete operational transparency with neural invisibility
- Advanced quantum neural safety protocols
- Full compliance with emerging AGI regulations
- Continuous monitoring and compliance updates
      `
    },
    {
      id: 'usage',
      title: 'Usage Guidelines',
      icon: <FileText className="w-4 h-4" />,
      status: 'Active',
      description: 'Permitted uses and ethical guidelines',
      content: `
# Usage Guidelines & Ethical Framework

## Permitted Uses
✅ **Educational & Research**
- Academic research and development
- Educational demonstrations and training
- Scientific experimentation and analysis

✅ **Business & Commercial**
- Legitimate business process optimization
- Customer service enhancement
- Performance monitoring and improvement

✅ **Creative & Personal**
- Personal productivity enhancement
- Creative assistance and collaboration
- Content creation and optimization

## Prohibited Uses
❌ **Harmful Activities**
- Developing weapons or harmful technologies
- Creating deepfakes or misleading content
- Surveillance without proper authorization

❌ **Illegal Activities**
- Criminal activity facilitation
- Copyright or intellectual property violation
- Privacy invasion or unauthorized access

## Ethical Principles
- Human-centric design prioritizing welfare and safety
- Fairness and non-discrimination in all processes
- Transparency and explainability in AI decisions
- Privacy protection and data minimization
      `
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Enforced': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'Verified': return 'bg-purple-500/20 text-purple-700 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI/AGI Policy Center</h1>
            <p className="text-sm text-muted-foreground">Comprehensive governance and compliance framework</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Tabs value={selectedPolicy} onValueChange={setSelectedPolicy} className="h-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {policies.map((policy) => (
              <TabsTrigger
                key={policy.id}
                value={policy.id}
                className="flex items-center gap-2"
              >
                {policy.icon}
                <span className="hidden sm:inline">{policy.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {policies.map((policy) => (
            <TabsContent key={policy.id} value={policy.id} className="h-full mt-0">
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {policy.icon}
                      {policy.title}
                    </CardTitle>
                    <Badge className={getStatusColor(policy.status)}>
                      {policy.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{policy.description}</p>
                </CardHeader>
                <CardContent className="pt-0 h-[calc(100%-120px)]">
                  <ScrollArea className="h-full">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                        {policy.content.trim()}
                      </pre>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="p-6 border-t border-border/40 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Document Version: 2.0 | Effective: January 14, 2025</div>
          <div>Contact: ervin210@icloud.com | Verification: 310B97F3DB3CCB7D</div>
        </div>
      </div>
    </div>
  );
}