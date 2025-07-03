
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminChart = () => {
  // Fetch chart data
  const { data: chartData } = useQuery({
    queryKey: ['adminChartData'],
    queryFn: async () => {
      const [gamesData, commentsData, ratingsData, categoriesData] = await Promise.all([
        supabase.from('games').select('created_at').order('created_at'),
        supabase.from('comments').select('created_at').order('created_at'),
        supabase.from('ratings').select('created_at').order('created_at'),
        supabase.from('games').select('category')
      ]);

      // Process data for monthly growth chart
      const monthlyData = [];
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      
      for (let i = 0; i < 12; i++) {
        const month = new Date().getMonth() - 11 + i;
        const year = new Date().getFullYear() + Math.floor(month / 12);
        const monthIndex = ((month % 12) + 12) % 12;
        
        const monthStart = new Date(year, monthIndex, 1);
        const monthEnd = new Date(year, monthIndex + 1, 0);
        
        const gamesCount = gamesData.data?.filter(game => {
          const date = new Date(game.created_at);
          return date >= monthStart && date <= monthEnd;
        }).length || 0;
        
        const commentsCount = commentsData.data?.filter(comment => {
          const date = new Date(comment.created_at);
          return date >= monthStart && date <= monthEnd;
        }).length || 0;
        
        const ratingsCount = ratingsData.data?.filter(rating => {
          const date = new Date(rating.created_at);
          return date >= monthStart && date <= monthEnd;
        }).length || 0;
        
        monthlyData.push({
          month: months[monthIndex],
          jogos: gamesCount,
          comentarios: commentsCount,
          avaliacoes: ratingsCount
        });
      }

      // Process data for categories pie chart
      const categoryCount = new Map();
      categoriesData.data?.forEach(game => {
        categoryCount.set(game.category, (categoryCount.get(game.category) || 0) + 1);
      });
      
      const pieData = Array.from(categoryCount.entries()).map(([category, count]) => ({
        name: category,
        value: count
      }));

      return { monthlyData, pieData };
    }
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Growth Chart */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Crescimento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="jogos" fill="#8B5CF6" name="Jogos" />
              <Bar dataKey="comentarios" fill="#10B981" name="Comentários" />
              <Bar dataKey="avaliacoes" fill="#F59E0B" name="Avaliações" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Categories Pie Chart */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Jogos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData?.pieData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData?.pieData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChart;
