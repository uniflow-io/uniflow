# Class: provision
#
#
class provision
{
  # php
  include provision::params
  include apt, php, php::fpm

  include provision::php::modules
  include provision::php::pools

  # nginx
  class { "nginx":
    ensure        => present,
    default_vhost => "default"
  }

  include provision::nginx::vhosts

  # percona
  include provision::percona::config

  class { "percona":
    server          => true,
    manage_repo     => true,
    percona_version => "5.5",
    require         => Class["apt"]
  }

  include provision::percona::databases
  include provision::percona::rights

  # composer
  class { 'composer':
    command_name => 'composer',
    target_dir   => '/usr/local/bin',
    auto_update  => true
  }

  # phpmyadmin
  package { "phpmyadmin":
    ensure  => installed,
    require => Package["php5-cgi"]
  }
}

include provision
