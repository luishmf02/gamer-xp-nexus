
import { useState } from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import GameCard from '@/components/GameCard';

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data para demonstração
  const games = [
    {
      id: 1,
      title: 'Cyberpunk 2077',
      price: 59.99,
      rating: 4.2,
      category: 'RPG',
      image: '/placeholder.svg',
      description: 'Um RPG de ação futurístico em mundo aberto'
    },
    {
      id: 2,
      title: 'The Witcher 3',
      price: 39.99,
      rating: 4.8,
      category: 'RPG',
      image: '/placeholder.svg',
      description: 'RPG épico de fantasia medieval'
    },
    {
      id: 3,
      title: 'Counter-Strike 2',
      price: 0,
      rating: 4.5,
      category: 'FPS',
      image: '/placeholder.svg',
      description: 'O FPS competitivo mais popular do mundo'
    }
  ];

  const categories = ['all', 'RPG', 'FPS', 'Strategy', 'Sports', 'Racing'];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            {filteredGames.map(game => (
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
