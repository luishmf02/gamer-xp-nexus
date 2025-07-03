
import { useState } from 'react';
import { Star, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data do usuário
  const userStats = {
    totalComments: 15,
    totalRatings: 8,
    averageRating: 4.2,
    favoriteGenre: 'RPG'
  };

  const userComments = [
    {
      id: 1,
      game: 'Cyberpunk 2077',
      comment: 'Jogo incrível! A história é envolvente e os gráficos são impressionantes.',
      rating: 5,
      date: '2024-01-15'
    },
    {
      id: 2,
      game: 'The Witcher 3',
      comment: 'Um dos melhores RPGs já criados. Recomendo para todos!',
      rating: 5,
      date: '2024-01-10'
    },
    {
      id: 3,
      game: 'Counter-Strike 2',
      comment: 'Ótima jogabilidade competitiva, mas precisa de mais mapas.',
      rating: 4,
      date: '2024-01-08'
    }
  ];

  const userRatings = [
    { game: 'Cyberpunk 2077', rating: 5, date: '2024-01-15' },
    { game: 'The Witcher 3', rating: 5, date: '2024-01-10' },
    { game: 'Counter-Strike 2', rating: 4, date: '2024-01-08' },
    { game: 'FIFA 24', rating: 3, date: '2024-01-05' }
  ];

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
              <div className="text-2xl font-bold text-white">{userStats.averageRating.toFixed(1)}</div>
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
                    <h3 className="text-lg font-semibold text-white">{comment.game}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(comment.rating)}</div>
                      <span className="text-sm text-gray-400">{comment.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{comment.comment}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:text-white hover:bg-red-600">
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4 mt-6">
            {userRatings.map((rating, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{rating.game}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex">{renderStars(rating.rating)}</div>
                      <span className="text-sm text-gray-400">{rating.date}</span>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-400 hover:text-white">
                        Alterar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
