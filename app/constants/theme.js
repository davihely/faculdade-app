// Salvar em: constants/theme.js
export const COLORS = {
  primary: '#4F46E5',    // Roxo principal (botões)
  white: '#FFFFFF',      // Branco
  black: '#111827',      // Preto (textos fortes)
  grayLight: '#F9FAFB',  // Fundo de tela (HomeScreen)
  grayMedium: '#F3F4F6', // Fundo de input (LoginScreen)
  grayDark: '#6B7280',   // Texto secundário (subtítulos)
  grayBorder: '#E5E7EB', // Bordas
  textPrimary: '#1F2937',
  textSecondary: '#374151',
  textMuted: '#9CA3AF',
};

export const SIZES = {
  base: 8,
  padding: 16,
  paddingHorizontal: 24,
  radius: 12,
  // ... outros tamanhos
};

export const STYLES = {
  // Estilo de input padrão (baseado no LoginScreen)
  input: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.grayMedium,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
  },
  // Botão principal padrão
  buttonPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonPrimaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
};