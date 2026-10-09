import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';
import { fontSizes, spacing } from '../../global-class';

const FONT_INTER = 'Inter-VariableFont_opsz,wght';
const FONT_PRESS = 'PressStart2P-Regular';

const authStyles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────
  keyboardAvoid: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },

  // ── Background gradients (positioned absolute) ─────
  gradientPurple: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: darkTheme.glowPurple,
    opacity: 0.6,
  },
  gradientCyan: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: darkTheme.glowCyan,
    opacity: 0.4,
  },

  // ── Glass Card ─────────────────────────────────────
  glassCard: {
    marginHorizontal: 20,
    backgroundColor: darkTheme.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: darkTheme.border,
    paddingHorizontal: 28,
    paddingVertical: 36,
  },

  // ── Brand / Title ──────────────────────────────────
  brandText: {
    fontFamily: FONT_PRESS,
    fontSize: fontSizes.sm,
    color: darkTheme.purple,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: FONT_INTER,
    fontSize: 26,
    fontWeight: '700',
    color: darkTheme.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT_INTER,
    fontSize: 15,
    color: darkTheme.textMuted,
    textAlign: 'center',
    marginBottom: 28,
  },

  // ── Form ───────────────────────────────────────────
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontFamily: FONT_INTER,
    fontSize: 13,
    fontWeight: '500',
    color: darkTheme.textMuted,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: darkTheme.bgInput,
    borderWidth: 1,
    borderColor: darkTheme.borderInput,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: darkTheme.textPrimary,
    fontFamily: FONT_INTER,
    fontSize: 15,
  },
  inputFocused: {
    borderColor: darkTheme.borderFocus,
  },
  inputError: {
    borderColor: darkTheme.error,
  },
  errorText: {
    fontFamily: FONT_INTER,
    fontSize: 13,
    color: darkTheme.errorLight,
    marginTop: 4,
  },
  passwordToggle: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  passwordToggleText: {
    fontFamily: FONT_INTER,
    fontSize: 12,
    color: darkTheme.purple,
  },

  // ── Password strength ──────────────────────────────
  strengthContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  strengthWeak: {
    backgroundColor: darkTheme.error,
  },
  strengthMedium: {
    backgroundColor: '#F59E0B',
  },
  strengthStrong: {
    backgroundColor: darkTheme.success,
  },
  strengthLabel: {
    fontFamily: FONT_INTER,
    fontSize: 12,
    marginTop: 4,
  },

  // ── Buttons ────────────────────────────────────────
  buttonPrimary: {
    height: 52,
    backgroundColor: darkTheme.purple,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPrimaryDisabled: {
    opacity: 0.6,
  },
  buttonPrimaryText: {
    fontFamily: FONT_INTER,
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.textPrimary,
  },
  buttonOutline: {
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.borderInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonOutlineText: {
    fontFamily: FONT_INTER,
    fontSize: 16,
    fontWeight: '500',
    color: darkTheme.textPrimary,
  },
  buttonLink: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 4,
  },
  buttonLinkText: {
    fontFamily: FONT_INTER,
    fontSize: 14,
    color: darkTheme.cyan,
  },

  // ── Divider ────────────────────────────────────────
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: darkTheme.border,
  },
  dividerText: {
    fontFamily: FONT_INTER,
    fontSize: 13,
    color: darkTheme.textMuted,
    marginHorizontal: 14,
  },

  // ── Confirmation message (ForgotPassword) ──────────
  confirmationContainer: {
    backgroundColor: 'rgba(16,185,129,0.10)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.20)',
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  confirmationText: {
    fontFamily: FONT_INTER,
    fontSize: 14,
    color: darkTheme.success,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default authStyles;
