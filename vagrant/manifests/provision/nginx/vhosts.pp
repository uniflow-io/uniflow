# Class: provision::nginx::vhosts
#
#
class provision::nginx::vhosts
{
  $sites_dir = $provision::params::sites_dir
  $nginx_dir = "${provision::params::templates_dir}/nginx"

  nginx::vhost { "phpinfo.darkwood.dev":
    root     => "${sites_dir}/php/Info",
    index    => "index.php",
    template => "${nginx_dir}/default.conf.erb"
  }

  nginx::vhost { "phpmyadmin.darkwood.dev":
    root     => "/usr/share/phpmyadmin",
    index    => "index.php",
    template => "${nginx_dir}/default.conf.erb"
  }

  nginx::vhost { "searchreplace.darkwood.dev":
    root     => "${sites_dir}/web",
    file     => "darkwood.searchreplace.dev",
    index    => "index.html",
    template => "${nginx_dir}/darkwood.searchreplace.dev.conf.erb"
  }
}
