import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter', // ID único de tu aplicación Capacitor
  appName: 'app-hayPan', // Nombre de tu aplicación
  webDir: 'www', // Directorio donde se encuentra tu aplicación web compilada
  bundledWebRuntime: false, // Opcional: si tu aplicación web está empaquetada dentro de la aplicación nativa
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    // Agrega otros plugins de Capacitor que puedas necesitar aquí
  },
  android: {
    // Configuración específica para Android
    allowMixedContent: true, // Permite contenido mixto (HTTP/HTTPS) en Android
  },
  server: {
    // Opcional: Configuración del servidor de desarrollo para Capacitor
    //url: 'http://192.168.0.15:8100', // URL del servidor de desarrollo
  },
  // Puedes agregar configuraciones específicas para iOS aquí si es necesario
};

export default config;
