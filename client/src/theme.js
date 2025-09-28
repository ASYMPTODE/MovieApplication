import { createTheme } from '@mui/material/styles'

// Palette: 
// Primary Text & Icons: #212121
// Secondary Text: #757575
// Background primary: #FFFFFF
// Background secondary/cards: #F5F5F5
// Accent/CTA: #0288D1

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0288D1' },
    background: { default: '#FFFFFF', paper: '#F5F5F5' },
    text: { primary: '#212121', secondary: '#757575' }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } }
    },
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 2px 8px rgba(0,0,0,0.06)' } }
    }
  }
})
