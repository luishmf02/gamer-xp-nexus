
import { useState } from 'react';
import { MessageCircle, Star, Trash2, Eye, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminInteractions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedComment, setSelectedComment] = useState<any>(null);

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ['userRole', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  if (userRole === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Acesso Negado</h1>
          <p className="text-gray-300 mb-4">Você precisa ser administrador para acessar esta página.</p>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-blue-600">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  // Fetch all comments with game and user info
  const { data: allComments = [] } = useQuery({
    queryKey: ['adminComments'],
    queryFn: async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id, game_id')
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      if (!commentsData || commentsData.length === 0) {
        return [];
      }

      // Get game info
      const gameIds = [...new Set(commentsData.map(comment => comment.game_id))];
      const { data: gamesData } = await supabase
        .from('games')
        .select('id, title')
        .in('id', gameIds);

      // Get user profiles
      const userIds = [...new Set(commentsData.map(comment => comment.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);
      
      const gamesMap = new Map((gamesData || []).map(game => [game.id, game]));
      const profilesMap = new Map((profilesData || []).map(profile => [profile.id, profile]));
      
      return commentsData.map(comment => ({
        ...comment,
        game: gamesMap.get(comment.game_id),
        user: profilesMap.get(comment.user_id)
      }));
    }
  });

  // Fetch all ratings with game and user info
  const { data: allRatings = [] } = useQuery({
    queryKey: ['adminRatings'],
    queryFn: async () => {
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('id, rating, created_at, user_id, game_id')
        .order('created_at', { ascending: false });
      
      if (ratingsError) throw ratingsError;
      
      if (!ratingsData || ratingsData.length === 0) {
        return [];
      }

      // Get game info
      const gameIds = [...new Set(ratingsData.map(rating => rating.game_id))];
      const { data: gamesData } = await supabase
        .from('games')
        .select('id, title')
        .in('id', gameIds);

      // Get user profiles
      const userIds = [...new Set(ratingsData.map(rating => rating.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);
      
      const gamesMap = new Map((gamesData || []).map(game => [game.id, game]));
      const profilesMap = new Map((profilesData || []).map(profile => [profile.id, profile]));
      
      return ratingsData.map(rating => ({
        ...rating,
        game: gamesMap.get(rating.game_id),
        user: profilesMap.get(rating.user_id)
      }));
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComments'] });
      toast({
        title: "Comentário excluído",
        description: "O comentário foi removido com sucesso."
      });
    }
  });

  // Delete rating mutation
  const deleteRatingMutation = useMutation({
    mutationFn: async (ratingId: string) => {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminRatings'] });
      toast({
        title: "Avaliação excluída",
        description: "A avaliação foi removida com sucesso."
      });
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Gerenciar Interações
          </h1>
          <p className="text-gray-300">
            Gerencie comentários e avaliações dos usuários
          </p>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="comments" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-800/50 border-gray-700">
            <TabsTrigger value="comments" className="data-[state=active]:bg-purple-600">
              Comentários ({allComments.length})
            </TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-purple-600">
              Avaliações ({allRatings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comments" className="space-y-4 mt-6">
            {allComments.map((comment) => (
              <Card key={comment.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {comment.game?.title || 'Jogo não encontrado'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <User className="w-4 h-4 mr-1" />
                        <span>{comment.user?.username || comment.user?.email || 'Usuário não encontrado'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{comment.content}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-blue-600 text-blue-400 hover:text-white hover:bg-blue-600"
                      onClick={() => setSelectedComment(comment)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
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
            
            {allComments.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum comentário encontrado.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4 mt-6">
            {allRatings.map((rating) => (
              <Card key={rating.id} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {rating.game?.title || 'Jogo não encontrado'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <User className="w-4 h-4 mr-1" />
                        <span>{rating.user?.username || rating.user?.email || 'Usuário não encontrado'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(rating.created_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center">
                        {renderStars(rating.rating)}
                        <span className="ml-2 text-yellow-400 font-medium">
                          {rating.rating}/5
                        </span>
                      </div>
                    </div>
                    
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
                </CardContent>
              </Card>
            ))}
            
            {allRatings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhuma avaliação encontrada.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Comment Detail Modal */}
        <Dialog open={!!selectedComment} onOpenChange={() => setSelectedComment(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Comentário</DialogTitle>
            </DialogHeader>
            {selectedComment && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400">Jogo:</h3>
                  <p className="text-white">{selectedComment.game?.title}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400">Usuário:</h3>
                  <p className="text-white">
                    {selectedComment.user?.username || selectedComment.user?.email || 'Usuário não encontrado'}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400">Data:</h3>
                  <p className="text-white">
                    {new Date(selectedComment.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400">Comentário:</h3>
                  <p className="text-gray-300 bg-gray-700/50 p-4 rounded-lg">
                    {selectedComment.content}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminInteractions;
