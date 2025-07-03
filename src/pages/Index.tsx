
import { Link } from 'react-router-dom';
import { Gamepad2, Star, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Catálogo Completo',
      description: 'Descubra milhares de jogos de todas as categorias e plataformas'
    },
    {
      icon: Star,
      title: 'Sistema de Avaliação',
      description: 'Avalie jogos e veja as opiniões de outros gamers'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Participe de discussões e compartilhe suas experiências'
    },
    {
      icon: Trophy,
      title: 'Dashboard Pessoal',
      description: 'Acompanhe suas avaliações e comentários em um só lugar'
    }
  ];

  const featuredGames = [
    {
      id: 1,
      title: 'Cyberpunk 2077',
      rating: 4.2,
      image: '/placeholder.svg',
      price: 59.99
    },
    {
      id: 2,
      title: 'The Witcher 3',
      rating: 4.8,
      image: '/placeholder.svg',
      price: 39.99
    },
    {
      id: 3,
      title: 'Counter-Strike 2',
      rating: 4.5,
      image: '/placeholder.svg',
      price: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Loja Gamer XP
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A sua plataforma definitiva para descobrir, avaliar e comentar sobre os melhores jogos do mundo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Explorar Jogos
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  Meu Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Por que escolher a Loja Gamer XP?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Oferecemos a melhor experiência para descobrir e avaliar jogos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Games Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Jogos em Destaque
          </h2>
          <p className="text-xl text-gray-300">
            Confira os jogos mais populares da nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredGames.map((game) => (
            <Card key={game.id} className="group bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-yellow-400 font-medium">{game.rating}</span>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {game.price === 0 ? 'GRÁTIS' : `R$ ${game.price.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/games">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Ver Todos os Jogos
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-y border-purple-500/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar sua jornada gamer?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se à nossa comunidade e descubra os melhores jogos
          </p>
          <Link to="/games">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6"
            >
              Começar Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
