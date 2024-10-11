// import { registerSW } from "virtual:pwa-register";
//
// const updateSW = registerSW({
//   immediate: true,
//   onNeedRefresh() {
//     const confirmReload = confirm(
//       "Hay una nueva versión disponible. ¿Quieres actualizar?",
//     );
//     if (confirmReload) {
//       updateSW(); // Forzar la actualización
//     }
//   },
//   onRegisteredSW(swScriptUrl) {
//     // eslint-disable-next-line no-console
//     console.log("SW registered: ", swScriptUrl);
//   },
//   onOfflineReady() {
//     // eslint-disable-next-line no-console
//     console.log("PWA application ready to work offline");
//   },
// });
