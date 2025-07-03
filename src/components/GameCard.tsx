
import { useState } from 'react';
import { Star, MessageCircle, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: number;
  title: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  description: string;
}

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleViewDetails = () => {
    toast({
      title: "Detalhes do Jogo",
      description: `Visualizando detalhes de ${game.title}`,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-400" />
        );
      }
    }
    return stars;
  };

  return (
    <Card 
      className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <CardContent className="p-0">
        {/* Game Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={game.image} 
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {game.price === 0 ? 'GRÁTIS' : `R$ ${game.price.toFixed(2)}`}
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-black/60 text-white px-2 py-1 rounded text-xs">
              {game.category}
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {game.title}
          </h3>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {game.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {renderStars(game.rating)}
            </div>
            <span className="text-yellow-400 font-medium">
              {game.rating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm">
              (128 avaliações)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Jogo Adicionado",
                  description: `${game.title} foi adicionado ao carrinho!`,
                });
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              className="border-gray-600 text-gray-400 hover:text-white hover:border-purple-500"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Comentários",
                  description: `Visualizando comentários de ${game.title}`,
                });
              }}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
