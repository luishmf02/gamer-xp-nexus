
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?recovery=true`
      });

      if (error) throw error;

      toast({
        title: "Código enviado!",
        description: "Verifique seu e-mail para o código de recuperação."
      });
      
      setStep('code');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso."
      });
      
      onBack();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-center">
          {step === 'email' ? 'Recuperar Senha' : 'Nova Senha'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <Label htmlFor="recovery-email" className="text-white">E-mail</Label>
              <Input
                id="recovery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Digite seu e-mail"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full border-gray-600 text-gray-400"
            >
              Voltar ao Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password" className="text-white">Nova Senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password" className="text-white">Confirmar Nova Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full border-gray-600 text-gray-400"
            >
              Voltar ao Login
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordRecovery;
