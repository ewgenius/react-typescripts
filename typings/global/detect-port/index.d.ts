declare module 'detect-port' {
  const detect: (defaultPort: number) => Promise<number>;
  export = detect;
}