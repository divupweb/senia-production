require "capistrano/scm/plugin"
require "capistrano/scm/git"

module Capistrano
  class CopyPlugin < ::Capistrano::SCM::Plugin
    def set_defaults
      set_if_empty :temp_dir, './tmp'
      set_if_empty :include_dir, '.'
      set_if_empty :tar_verbose, true
      set_if_empty :archive_name, 'archive.tar.xz'
      set_if_empty :tar_format, 'J'
    end

    def define_tasks
      eval_rakefile File.expand_path('../tasks/copy.rake', __FILE__)
    end

    def register_hooks
      after 'deploy:new_release_path', 'copy:create_release'
      before "deploy:set_current_revision", "copy:set_current_revision"
      after 'deploy:finished', 'copy:clean'
    end

    def revision
      `git rev-list --max-count=1 HEAD`
    end

    def branch
      `git rev-parse --abbrev-ref HEAD`
    end

    def archive_name
      fetch(:archive_name)
    end

    def archive_path
      temp_dir = fetch(:temp_dir)
      File.join(temp_dir, archive_name)
    end
  end
end
