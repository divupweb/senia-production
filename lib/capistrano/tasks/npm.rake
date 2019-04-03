require 'dotenv'

namespace :npm do
  desc 'npm install'
  task :install do
    load_env
    sh "npm install"
  end

  desc 'npm build'
  task :build do
    load_env
    sh "npm run build:prod"
  end

  desc 'npm test'
  task :test do
    load_env
    sh "printenv"
  end

  private

  def env_path
    [".env.#{fetch(:stage)}", '.env', '.env.example'].find { |path| File.exist? path }
  end

  def load_env
    Dotenv.load(env_path)
  end
end
