#========HOSTS

44.44.44.54 searchreplace.darkwood.dev

#========VAGRANT

vagrant up

scp -i puphpet/files/dot/ssh/id_rsa ~/.ssh/id_rsa vagrant@searchreplace.darkwood.dev:~/.ssh/id_rsa
scp -i puphpet/files/dot/ssh/id_rsa ~/.ssh/id_rsa.pub vagrant@searchreplace.darkwood.dev:~/.ssh/id_rsa.pub

