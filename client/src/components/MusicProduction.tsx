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
import Waveform from "@/components/ui/waveform";

const musicFormSchema = z.object({
  lyrics: z.string().min(10, "Lyrics must be at least 10 characters"),
  style: z.string(),
  audioMastering: z.string(),
  aiModel: z.string(),
});

type MusicFormData = z.infer<typeof musicFormSchema>;

export default function MusicProduction() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MusicFormData>({
    resolver: zodResolver(musicFormSchema),
    defaultValues: {
      lyrics: "",
      style: "electronic",
      audioMastering: "dolby-atmos",
      aiModel: "composer-pro",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
  });

  const generateMusicMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/music", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Music Generated!",
        description: "Your music has been successfully generated.",
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

  const onSubmit = async (data: MusicFormData) => {
    try {
      setIsGenerating(true);
      
      const project = await createProjectMutation.mutateAsync({
        name: `Music - ${new Date().toLocaleDateString()}`,
        type: "music",
        content: { lyrics: data.lyrics },
        settings: {
          style: data.style,
          audioMastering: data.audioMastering,
          aiModel: data.aiModel,
        },
      });

      await generateMusicMutation.mutateAsync({
        projectId: project.id,
        ...data,
      });

    } catch (error) {
      console.error("Music generation error:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="feature-card glass-effect rounded-xl p-6 neon-border transition-all duration-300">
      <div className="flex items-center mb-4">
        <i className="fas fa-music text-3xl text-neon-blue mr-4"></i>
        <h3 className="text-xl font-semibold">Music Production</h3>
      </div>
      
      <img 
        src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400" 
        alt="Modern music studio equipment" 
        className="w-full h-32 object-cover rounded-lg mb-4" 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="lyrics"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Song Lyrics</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="h-24 bg-card border-gray-600 text-white placeholder-gray-500 focus:border-neon-blue"
                    placeholder="Write your song lyrics here...

Example:
In the digital age we rise
Through the code and neon lights
AI dreams and human hearts
Together we'll reach the stars..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-card border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronic">Style: Electronic</SelectItem>
                        <SelectItem value="pop">Style: Pop</SelectItem>
                        <SelectItem value="rock">Style: Rock</SelectItem>
                        <SelectItem value="jazz">Style: Jazz</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="audioMastering"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-card border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dolby-atmos">Audio: Dolby Atmos</SelectItem>
                        <SelectItem value="dts-x">Audio: DTS:X</SelectItem>
                        <SelectItem value="surround-7-1">Audio: 7.1 Surround</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <Waveform />
          
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="bg-gradient-to-r from-neon-blue to-neon-pink flex-1 py-2 px-4 rounded-lg text-white font-medium hover:scale-102 transition-transform"
            >
              <i className="fas fa-play mr-2"></i>
              {isGenerating ? "Generating..." : "Generate Music"}
            </Button>
            <Button 
              type="button" 
              variant="secondary"
              className="py-2 px-4 rounded-lg"
            >
              <i className="fas fa-cog"></i>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
