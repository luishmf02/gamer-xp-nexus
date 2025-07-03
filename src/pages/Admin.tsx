
import { useState } from 'react';
import { Plus, Edit, Trash2, BarChart3, Users, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [newGame, setNewGame] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: ''
  });

  // Mock data para o admin
  const adminStats = {
    totalGames: 25,
    totalUsers: 1250,
    totalComments: 850,
    totalRatings: 650
  };

  const games = [
    { id: 1, title: 'Cyberpunk 2077', price: 59.99, category: 'RPG', status: 'Ativo' },
    { id: 2, title: 'The Witcher 3', price: 39.99, category: 'RPG', status: 'Ativo' },
    { id: 3, title: 'Counter-Strike 2', price: 0, category: 'FPS', status: 'Ativo' }
  ];

  const handleAddGame = () => {
    if (!newGame.title || !newGame.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: `Jogo "${newGame.title}" adicionado com sucesso!`,
    });

    setNewGame({ title: '', price: '', category: '', description: '', image: '' });
    setIsAddGameOpen(false);
  };

  const handleDeleteGame = (gameTitle: string) => {
    toast({
      title: "Jogo Removido",
      description: `"${gameTitle}" foi removido do sistema.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-300">
            Gerencie jogos, usuários e conteúdo da Loja Gamer XP
          </p>
        </div>

        {/* Stats Cards */}
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
                        value={newGame.image}
                        onChange={(e) => setNewGame({...newGame, image: e.target.value})}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <Button onClick={handleAddGame} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                      Adicionar Jogo
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
                    <th className="text-left p-2">Status</th>
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
                        <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm">
                          {game.status}
                        </span>
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
                            onClick={() => handleDeleteGame(game.title)}
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
