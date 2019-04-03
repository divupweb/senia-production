require 'dotenv'
require 'capistrano/setup'
require 'capistrano/deploy'
require 'rollbar/capistrano3'

require_relative 'lib/capistrano/scm/copy'
install_plugin Capistrano::CopyPlugin

Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
