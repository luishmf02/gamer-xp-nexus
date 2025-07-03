
import { useState } from 'react';
import { Star, MessageCircle, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  price: number;
  rating?: number;
  category: string;
  image_url?: string;
  description?: string;
  rating_count?: number;
}

interface GameCardProps {
  game: Game;
  onGameClick?: (game: Game) => void;
}

const GameCard = ({ game, onGameClick }: GameCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGameClick = () => {
    if (onGameClick) {
      onGameClick(game);
    } else {
      // Navigate to game details page
      navigate(`/games/${game.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth');
      return;
    }
    // Add to cart logic here
    console.log('Adding to cart:', game.title);
  };

  return (
    <Card 
      className="group bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleGameClick}
    >
      <CardContent className="p-0">
        <div className="relative h-48">
          <img 
            src={game.image_url || '/placeholder.svg'} 
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
            
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-yellow-400 font-medium">
                    {game.rating ? game.rating.toFixed(1) : '0.0'}
                  </span>
                </div>
                {game.rating_count && (
                  <div className="flex items-center text-gray-300">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{game.rating_count}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {game.price === 0 ? 'GRÁTIS' : `R$ ${game.price.toFixed(2)}`}
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              {game.price === 0 ? 'Baixar' : 'Comprar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
