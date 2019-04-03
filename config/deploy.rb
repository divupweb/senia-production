# config valid only for current version of Capistrano
lock "3.8.1"

set :application, 'food-farm-ui'
set :include_dir, 'dist'
set :deploy_to, '/data/food-farm-ui'
set :tar_verbose, false

set :rollbar_env, proc { fetch :stage }
set :rollbar_role, proc { :app }
set :rollbar_token, -> { ENV['ROLLBAR_SERVER_TOKEN'] }
