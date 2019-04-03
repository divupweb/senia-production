require "capistrano/scm/plugin"

copy_plugin = self

namespace :copy do

  desc "Archive files to #{copy_plugin.archive_name}"
  task :create_archive do |_t|
    include_dir  = fetch(:include_dir)
    exclude_dir  = Array(fetch(:exclude_dir))

    exclude_args = exclude_dir.map { |dir| "--exclude '#{dir}'" }

    tar_verbose = fetch(:tar_verbose, true) ? 'v' : ''
    tar_format = fetch(:tar_format)
    sh 'mkdir -p tmp'
    FileList[include_dir].exclude(copy_plugin.archive_name) do |f|
      cmd = ['tar', "-#{tar_format}cf#{tar_verbose}", copy_plugin.archive_path, *exclude_args, "#{f}/*"]
      sh cmd.join(' ')
    end.resolve
  end

  desc "Deploy #{copy_plugin.archive_name} to release_path"
  task :deploy_archive do |_t|
    archive_path = copy_plugin.archive_path
    raise "File #{archive_path} not found" unless File.exist? archive_path
    tar_roles = fetch(:tar_roles, :all)
    tar_format = fetch(:tar_format)

    on roles(tar_roles) do |_role|
      puts "==> release_path: #{release_path} is created on #{tar_roles} roles <=="
      execute :mkdir, "-p", release_path

      tmp_file = capture("mktemp")
      upload!(archive_path, tmp_file)
      execute :tar, "-x#{tar_format}f", tmp_file, "-C", release_path
      execute :rm, tmp_file
    end
  end

  task :clean do |_t|
    archive_path = copy_plugin.archive_path
    next unless File.exist? archive_path
    puts "Remove local tmp file #{archive_path}"
    File.delete archive_path
  end

  task :set_current_revision do |_t|
    set :current_revision, copy_plugin.revision
  end

  task :set_current_branch do |_t|
    branch = copy_plugin.branch
    puts "Current branch: #{branch}"
    set :branch, branch
  end

  task create_release: :set_current_branch
  task create_release: 'npm:install'
  task create_release: 'npm:build'
  task create_release: :clean
  task create_release: :create_archive
  task create_release: :deploy_archive
end
