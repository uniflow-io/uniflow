<?php

namespace Darkwood\UserBundle\Security\Core;

use Darkwood\UserBundle\Entity\User;
use Facebook\Facebook;
use FOS\UserBundle\Model\UserManagerInterface;
use HWI\Bundle\OAuthBundle\OAuth\Response\UserResponseInterface;
use HWI\Bundle\OAuthBundle\Security\Core\User\FOSUBUserProvider as BaseClass;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\User\UserInterface;

class FOSUBUserProvider extends BaseClass
{
    /**
     * {@inheritdoc}
     */
    public function loadUserByOAuthUserResponse(UserResponseInterface $response)
    {
        $username = $response->getUsername();

        $user = $this->userManager->findUserBy(array($this->getProperty($response) => $username));
        if (null === $user || null === $username) {
            $service = $response->getResourceOwner()->getName();
            $setter = 'set'.ucfirst($service);
            $setter_id = $setter.'Id';

            // create new user here
            $user = $this->userManager->createUser();
            $user->$setter_id($username);

            /*if ($service == 'facebook') {
                $user->setUsername($response->getNickname());
            } else {
                $user->setUsername($response->getUsername());
            }*/

            //I have set all requested data with the user's username
            //modify here with relevant data
            $user->setEmail($username.'@'.$service);
            $user->setPassword(md5(uniqid()));
            $user->setEnabled(true);
            $this->userManager->updateUser($user);
        }

        return $user;
    }
}
