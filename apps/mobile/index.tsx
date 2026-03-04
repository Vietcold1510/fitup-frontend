import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent đảm bảo rằng môi trường Expo được thiết lập chính xác
// và App.tsx được render làm gốc của ứng dụng.
registerRootComponent(App);