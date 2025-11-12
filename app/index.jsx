import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona imediatamente para o login, de forma segura
  return <Redirect href="/view/loginView" />;
}