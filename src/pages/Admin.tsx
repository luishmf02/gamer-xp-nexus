
import { useState } from 'react';
import { Plus, Edit, Trash2, BarChart3, Users, Gamepad2, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminChart from '@/components/AdminChart';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image_url: ''
  });

  // Fetch games
  const { data: games = [] } = useQuery({
    queryKey: ['adminGames'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch admin stats
  const { data: adminStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const [gamesCount, usersCount, commentsCount, ratingsCount] = await Promise.all([
        supabase.from('games').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('comments').select('id', { count: 'exact', head: true }),
        supabase.from('ratings').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalGames: gamesCount.count || 0,
        totalUsers: usersCount.count || 0,
        totalComments: commentsCount.count || 0,
        totalRatings: ratingsCount.count || 0
      };
    }
  });

  // Add game mutation
  const addGameMutation = useMutation({
    mutationFn: async (gameData: typeof newGame) => {
      const { data, error } = await supabase
        .from('games')
        .insert({
          title: gameData.title,
          description: gameData.description,
          price: parseFloat(gameData.price) || 0,
          category: gameData.category,
          image_url: gameData.image_url || null
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGames'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      setNewGame({ title: '', price: '', category: '', description: '', image_url: '' });
      setIsAddGameOpen(false);
      toast({
        title: "Sucesso!",
        description: `Jogo "${newGame.title}" adicionado com sucesso!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o jogo.",
        variant: "destructive"
      });
    }
  });

  // Delete game mutation
  const deleteGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGames'] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast({
        title: "Jogo Removido",
        description: "O jogo foi removido do sistema.",
      });
    }
  });

  const handleAddGame = () => {
    if (!newGame.title || !newGame.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    addGameMutation.mutate(newGame);
  };

  const handleDeleteGame = (gameId: string, gameTitle: string) => {
    if (confirm(`Tem certeza que deseja excluir "${gameTitle}"?`)) {
      deleteGameMutation.mutate(gameId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Painel Administrativo
              </h1>
              <p className="text-gray-300 mt-2">
                Área restrita para administradores do sistema
              </p>
            </div>
            <Button
              onClick={() => navigate('/admin/interactions')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Gerenciar Interações
            </Button>
          </div>
          <p className="text-gray-300">
            Gerencie jogos, usuários e conteúdo da Loja Gamer XP
          </p>
        </div>

        {/* Stats Cards */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total de Jogos
                </CardTitle>
                <Gamepad2 className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{adminStats.totalGames}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total de Usuários
                </CardTitle>
                <Users className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{adminStats.totalUsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total de Comentários
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{adminStats.totalComments}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total de Avaliações
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{adminStats.totalRatings}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        <AdminChart />

        {/* Games Management */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Gerenciar Jogos</CardTitle>
              
              <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Jogo
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Jogo</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título do Jogo *</Label>
                      <Input
                        id="title"
                        value={newGame.title}
                        onChange={(e) => setNewGame({...newGame, title: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Preço (R$)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newGame.price}
                        onChange={(e) => setNewGame({...newGame, price: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select value={newGame.category} onValueChange={(value) => setNewGame({...newGame, category: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="RPG">RPG</SelectItem>
                          <SelectItem value="FPS">FPS</SelectItem>
                          <SelectItem value="Strategy">Strategy</SelectItem>
                          <SelectItem value="Sports">Sports</SelectItem>
                          <SelectItem value="Racing">Racing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newGame.description}
                        onChange={(e) => setNewGame({...newGame, description: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image">URL da Imagem</Label>
                      <Input
                        id="image"
                        value={newGame.image_url}
                        onChange={(e) => setNewGame({...newGame, image_url: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleAddGame} 
                      disabled={addGameMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      {addGameMutation.isPending ? 'Adicionando...' : 'Adicionar Jogo'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2">Título</th>
                    <th className="text-left p-2">Preço</th>
                    <th className="text-left p-2">Categoria</th>
                    <th className="text-left p-2">Criado em</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b border-gray-700/50">
                      <td className="p-2">{game.title}</td>
                      <td className="p-2">
                        {game.price === 0 ? 'Grátis' : `R$ ${game.price.toFixed(2)}`}
                      </td>
                      <td className="p-2">{game.category}</td>
                      <td className="p-2">
                        {new Date(game.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-400 hover:bg-red-600"
                            onClick={() => handleDeleteGame(game.id, game.title)}
                            disabled={deleteGameMutation.isPending}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
