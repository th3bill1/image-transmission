const apiUrl = process.env.services__api__http__0 || 'http://localhost:5174';

module.exports = {
  '/api': {
    target: apiUrl,
    secure: false,
    changeOrigin: true,
    logLevel: 'warn'
  }
};
