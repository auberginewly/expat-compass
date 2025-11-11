import type { ThemeConfig } from 'antd'
import { theme as antdTheme } from 'antd'

export const lightTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#4C6CF7',
    colorInfo: '#7A5CFF',
    borderRadius: 12,
    fontFamily: `'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    colorBgLayout: '#F7F9FF',
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      borderRadius: 999,
    },
    Layout: {
      headerBg: 'transparent',
      bodyBg: '#F7F9FF',
    },
    Card: {
      borderRadiusLG: 24,
      colorBorderSecondary: 'rgba(43,110,242,0.2)',
    },
  },
}

export const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#7A5CFF',
    colorBgLayout: '#0F172A',
    colorTextBase: '#E1E9FF',
    borderRadius: 12,
    fontFamily: `'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Layout: {
      headerBg: 'rgba(15, 23, 42, 0.85)',
      bodyBg: '#0F172A',
    },
    Button: {
      borderRadius: 999,
    },
  },
}

