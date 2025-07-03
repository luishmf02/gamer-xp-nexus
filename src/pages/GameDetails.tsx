
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    email: string;
  };
}

interface Rating {
  id: string;
  rating: number;
  created_at: string;
}

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [comment, setComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch game details
  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ['game', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          profiles (username, email)
        `)
        .eq('game_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch ratings
  const { data: ratings = [] } = useQuery({
    queryKey: ['ratings', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('game_id', id);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's rating
  const { data: userCurrentRating } = useQuery({
    queryKey: ['userRating', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('game_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  useEffect(() => {
    if (userCurrentRating) {
      setUserRating(userCurrentRating.rating);
    }
  }, [userCurrentRating]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          game_id: id,
          user_id: user.id,
          content
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi publicado com sucesso."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive"
      });
    }
  });

  // Add/update rating mutation
  const ratingMutation = useMutation({
    mutationFn: async (rating: number) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ratings')
        .upsert({
          game_id: id,
          user_id: user.id,
          rating
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings', id] });
      queryClient.invalidateQueries({ queryKey: ['userRating', id, user?.id] });
      toast({
        title: "Avaliação registrada!",
        description: "Sua avaliação foi salva com sucesso."
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a avaliação.",
        variant: "destructive"
      });
    }
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    if (comment.trim()) {
      addCommentMutation.mutate(comment.trim());
    }
  };

  const handleRatingClick = (rating: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setUserRating(rating);
    ratingMutation.mutate(rating);
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Jogo não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate('/games')}
          variant="outline"
          className="mb-6 border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Jogos
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Info */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <img 
                  src={game.image_url || '/placeholder.svg'} 
                  alt={game.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-white mb-4">{game.title}</h1>
                  <p className="text-gray-300 mb-4">{game.description}</p>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-2" />
                        <span className="text-yellow-400 font-medium text-lg">
                          {averageRating.toFixed(1)}
                        </span>
                        <span className="text-gray-400 ml-2">({ratings.length} avaliações)</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                      {game.price === 0 ? 'GRÁTIS' : `R$ ${game.price.toFixed(2)}`}
                    </div>
                  </div>

                  {/* User Rating */}
                  {user && (
                    <div className="mb-6">
                      <h3 className="text-white text-lg mb-2">Sua Avaliação:</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            disabled={ratingMutation.isPending}
                          >
                            <Star 
                              className={`w-6 h-6 transition-colors ${
                                star <= (hoveredRating || userRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-400'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Comments Section */}
          <div>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comentários ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add Comment Form */}
                {user ? (
                  <form onSubmit={handleSubmitComment} className="mb-6">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Escreva seu comentário..."
                      className="bg-gray-700 border-gray-600 text-white mb-4"
                      rows={3}
                    />
                    <Button
                      type="submit"
                      disabled={!comment.trim() || addCommentMutation.isPending}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {addCommentMutation.isPending ? 'Enviando...' : 'Comentar'}
                    </Button>
                  </form>
                ) : (
                  <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-300 mb-2">Faça login para comentar</p>
                    <Button
                      onClick={() => navigate('/auth')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Fazer Login
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-purple-400 font-medium">
                          {comment.profiles?.username || comment.profiles?.email}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <p className="text-gray-400 text-center py-8">
                      Nenhum comentário ainda. Seja o primeiro a comentar!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
