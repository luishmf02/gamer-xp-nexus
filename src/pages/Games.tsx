
import { useState, useEffect } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import GameCard from '@/components/GameCard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Game {
  id: string;
  title: string;
  price: number;
  category: string;
  image_url?: string;
  description?: string;
  rating?: number;
  rating_count?: number;
}

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: games = [], isLoading, error } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      console.log('Fetching games...');
      const { data, error } = await supabase
        .from('games')
        .select('*');
      
      if (error) {
        console.error('Error fetching games:', error);
        throw error;
      }

      console.log('Games fetched:', data);
      
      // Get ratings for each game
      const gamesWithRatings = await Promise.all(
        data.map(async (game) => {
          const { data: avgRating } = await supabase
            .rpc('get_game_rating', { game_uuid: game.id });
          
          const { data: ratingCount } = await supabase
            .rpc('get_game_rating_count', { game_uuid: game.id });

          return {
            ...game,
            rating: avgRating || 0,
            rating_count: ratingCount || 0
          };
        })
      );

      return gamesWithRatings;
    }
  });

  const categories = ['all', 'RPG', 'FPS', 'Strategy', 'Sports', 'Racing'];

  const filteredGames = games.filter((game: Game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando jogos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Erro ao carregar jogos</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Loja Gamer XP
          </h1>
          <p className="text-xl text-gray-300">Descubra os melhores jogos e compartilhe suas experiências</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar jogos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game: Game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              Nenhum jogo encontrado com os filtros aplicados.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;
