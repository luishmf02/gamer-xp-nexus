
import { useState } from 'react';
import { Star, MessageCircle, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Fetch user comments
  const { data: userComments = [] } = useQuery({
    queryKey: ['userComments', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          games (title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user ratings
  const { data: userRatings = [] } = useQuery({
    queryKey: ['userRatings', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          id,
          rating,
          created_at,
          games (title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userComments', user.id] });
      toast({
        title: "Comentário excluído",
        description: "Seu comentário foi removido com sucesso."
      });
    }
  });

  // Delete rating mutation
  const deleteRatingMutation = useMutation({
    mutationFn: async (ratingId: string) => {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRatings', user.id] });
      toast({
        title: "Avaliação excluída",
        description: "Sua avaliação foi removida com sucesso."
      });
    }
  });

  const userStats = {
    totalComments: userComments.length,
    totalRatings: userRatings.length,
    averageRating: userRatings.length > 0 
      ? (userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length).toFixed(1)
      : '0.0',
    favoriteGenre: 'RPG' // This could be calculated from user's ratings
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Meu Dashboard
          </h1>
          <p className="text-gray-300">
            Gerencie suas avaliações e comentários
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Comentários
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.totalComments}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total de Avaliações
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.totalRatings}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Média de Avaliação
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.averageRating}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Gênero Favorito
              </CardTitle>
              <Calendar className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{userStats.favoriteGenre}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="comments" className="data-[state=active]:bg-purple-600">
              Meus Comentários
            </TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-purple-600">
              Minhas Avaliações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="space-y-4 mt-6">
            {userComments.map((comment) => (
              <Card key={comment.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-white">{comment.games?.title}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{comment.content}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-600 text-red-400 hover:text-white hover:bg-red-600"
                      onClick={() => deleteCommentMutation.mutate(comment.id)}
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {userComments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Você ainda não fez nenhum comentário.</p>
                <Button
                  onClick={() => navigate('/games')}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Explorar Jogos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4 mt-6">
            {userRatings.map((rating) => (
              <Card key={rating.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{rating.games?.title}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex">{renderStars(rating.rating)}</div>
                      <span className="text-sm text-gray-400">
                        {new Date(rating.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-600 text-red-400 hover:text-white hover:bg-red-600"
                        onClick={() => deleteRatingMutation.mutate(rating.id)}
                        disabled={deleteRatingMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {userRatings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Você ainda não fez nenhuma avaliação.</p>
                <Button
                  onClick={() => navigate('/games')}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Explorar Jogos
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
