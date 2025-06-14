import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const voiceFormSchema = z.object({
  text: z.string().min(5, "Text must be at least 5 characters"),
  voice: z.string(),
  speed: z.string(),
});

type VoiceFormData = z.infer<typeof voiceFormSchema>;

export default function VoiceGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<VoiceFormData>({
    resolver: zodResolver(voiceFormSchema),
    defaultValues: {
      text: "",
      voice: "professional-male",
      speed: "normal",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
  });

  const generateVoiceMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/voice", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Voice Generated!",
        description: "Your voice has been successfully generated.",
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const onSubmit = async (data: VoiceFormData) => {
    try {
      setIsGenerating(true);
      
      const project = await createProjectMutation.mutateAsync({
        name: `Voice - ${new Date().toLocaleDateString()}`,
        type: "voice",
        content: { text: data.text },
        settings: {
          voice: data.voice,
          speed: data.speed,
        },
      });

      await generateVoiceMutation.mutateAsync({
        projectId: project.id,
        ...data,
      });

    } catch (error) {
      console.error("Voice generation error:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="feature-card glass-effect rounded-xl p-6 neon-border transition-all duration-300">
      <div className="flex items-center mb-4">
        <i className="fas fa-microphone text-3xl text-yellow-400 mr-4"></i>
        <h3 className="text-xl font-semibold">Voice Generation</h3>
      </div>
      
      <img 
        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400" 
        alt="Professional recording studio microphone" 
        className="w-full h-32 object-cover rounded-lg mb-4" 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Text to Speech</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="h-20 bg-card border-gray-600 text-white placeholder-gray-500 focus:border-yellow-400"
                    placeholder="Enter text to convert to speech..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-card border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional-male">Voice: Professional Male</SelectItem>
                        <SelectItem value="professional-female">Voice: Professional Female</SelectItem>
                        <SelectItem value="narrator">Voice: Narrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="speed"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-card border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Speed: Slow</SelectItem>
                        <SelectItem value="normal">Speed: Normal</SelectItem>
                        <SelectItem value="fast">Speed: Fast</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isGenerating}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 w-full py-2 px-4 rounded-lg text-white font-medium hover:scale-102 transition-transform"
          >
            <i className="fas fa-volume-up mr-2"></i>
            {isGenerating ? "Generating..." : "Generate Voice"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
