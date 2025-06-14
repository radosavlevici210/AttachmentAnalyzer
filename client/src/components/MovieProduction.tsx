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

const movieFormSchema = z.object({
  script: z.string().min(10, "Script must be at least 10 characters"),
  duration: z.number().min(1).max(300),
  quality: z.string(),
  aiModel: z.string(),
  audioEnhancement: z.string(),
});

type MovieFormData = z.infer<typeof movieFormSchema>;

export default function MovieProduction() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      script: "",
      duration: 120,
      quality: "4k",
      aiModel: "cinematic-pro",
      audioEnhancement: "dolby-atmos",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
  });

  const generateMovieMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/movie", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Movie Generated!",
        description: "Your movie has been successfully generated.",
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

  const onSubmit = async (data: MovieFormData) => {
    try {
      setIsGenerating(true);
      
      // Create project
      const project = await createProjectMutation.mutateAsync({
        name: `Movie - ${new Date().toLocaleDateString()}`,
        type: "movie",
        content: { script: data.script },
        settings: {
          duration: data.duration,
          quality: data.quality,
          aiModel: data.aiModel,
          audioEnhancement: data.audioEnhancement,
        },
      });

      // Generate movie
      await generateMovieMutation.mutateAsync({
        projectId: project.id,
        ...data,
      });

    } catch (error) {
      console.error("Movie generation error:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="feature-card glass-effect rounded-xl p-6 neon-border transition-all duration-300">
      <div className="flex items-center mb-4">
        <i className="fas fa-film text-3xl text-neon-green mr-4"></i>
        <h3 className="text-xl font-semibold">Movie Production</h3>
      </div>
      
      <img 
        src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400" 
        alt="Professional video production studio" 
        className="w-full h-32 object-cover rounded-lg mb-4" 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="script"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">Movie Script</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="h-24 bg-card border-gray-600 text-white placeholder-gray-500 focus:border-neon-green"
                    placeholder="Write your movie script here...

Example:
FADE IN:
EXT. FUTURISTIC CITY - NIGHT
Neon lights pierce through the darkness as AI-controlled vehicles glide silently through the streets..."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                      <SelectTrigger className="bg-card border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">Duration: 30 Minutes</SelectItem>
                        <SelectItem value="60">Duration: 1 Hour</SelectItem>
                        <SelectItem value="90">Duration: 1.5 Hours</SelectItem>
                        <SelectItem value="120">Duration: 2 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-card border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8k">Quality: 8K Ultra</SelectItem>
                        <SelectItem value="4k">Quality: 4K Ultra</SelectItem>
                        <SelectItem value="imax">Quality: IMAX</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              type="submit" 
              disabled={isGenerating}
              className="btn-gradient flex-1 py-2 px-4 rounded-lg text-white font-medium"
            >
              <i className="fas fa-play mr-2"></i>
              {isGenerating ? "Generating..." : "Generate Movie"}
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
