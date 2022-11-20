module.exports = {
  apps: [{
    name: "anigram",
    script: "./build/index.js"
  }],
  deploy: {
    production: {
      user: "anigram",
      host: process.env.HOST,
      key: "~/.ssh/id_rsa",
      ref: "origin/master",
      repo: "git@github.com:saburovser/nyaagram.git",
      path: "/var/www/anigram",
      "post-deploy": "npm i && npx tsc && pm2 restart anigram"
    }
  }
}
