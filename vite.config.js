import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // ✅ Updated Vite config
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000', // 👈 your FastAPI backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })
// export default defineConfig({
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000", // 👈 this must match your backend port
//         changeOrigin: true,
//       },
//     },
//   },
// });
