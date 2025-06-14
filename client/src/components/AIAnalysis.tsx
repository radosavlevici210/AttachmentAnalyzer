import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const analysisFormSchema = z.object({
  content: z.string().min(5, "Content must be at least 5 characters"),
  type: z.enum(["youtube", "lyrics", "script"]),
});

type AnalysisFormData = z.infer<typeof analysisFormSchema>;

export default function AIAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<AnalysisFormData>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      content: "",
      type: "youtube",
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalysisFormData) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (result) => {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: "Content has been successfully analyzed.",
      });
      setIsAnalyzing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  const onSubmit = async (data: AnalysisFormData) => {
    setIsAnalyzing(true);
    await analyzeMutation.mutateAsync(data);
  };

  return (
    <div className="feature-card glass-effect rounded-xl p-6 neon-border transition-all duration-300">
      <div className="flex items-center mb-4">
        <i className="fas fa-brain text-3xl text-neon-pink mr-4"></i>
        <h3 className="text-xl font-semibold">AI Content Analysis</h3>
      </div>
      
      <img 
        src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=400" 
        alt="AI technology neural network interface" 
        className="w-full h-32 object-cover rounded-lg mb-4" 
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-400">YouTube URL or Content</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="bg-card border-gray-600 text-white placeholder-gray-500 focus:border-neon-pink"
                    placeholder="https://youtube.com/watch?v=... or paste content"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="bg-card rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">AI Analysis Results</h4>
            {analysisResult ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mood Detection:</span>
                  <span className="text-neon-green">
                    {analysisResult.mood.description} ({Math.round(analysisResult.mood.rating * 10)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Genre Classification:</span>
                  <span className="text-neon-blue">{analysisResult.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span>Complexity Score:</span>
                  <span className="text-neon-pink">{analysisResult.complexity}/10</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Mood Detection:</span>
                  <span className="text-gray-500">Pending analysis...</span>
                </div>
                <div className="flex justify-between">
                  <span>Genre Classification:</span>
                  <span className="text-gray-500">Pending analysis...</span>
                </div>
                <div className="flex justify-between">
                  <span>Complexity Score:</span>
                  <span className="text-gray-500">Pending analysis...</span>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-neon-pink to-purple-600 w-full py-2 px-4 rounded-lg text-white font-medium hover:scale-102 transition-transform"
          >
            <i className="fas fa-search mr-2"></i>
            {isAnalyzing ? "Analyzing..." : "Analyze Content"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
