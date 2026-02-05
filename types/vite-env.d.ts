/// <reference types="vite/client" />

// Declare CSS module imports with ?url query parameter
declare module '*.css?url' {
  const content: string
  export default content
}
