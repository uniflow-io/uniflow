<?php

namespace Darkwood\UserBundle\EventListener;

use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class ProfileEditListener implements EventSubscriberInterface
{
    private $router;

    public function __construct(UrlGeneratorInterface $router)
    {
        $this->router = $router;
    }
    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return array(
            FOSUserEvents::PROFILE_EDIT_INITIALIZE => 'onProfileEditInitialize',
        );
    }

    public function onProfileEditInitialize(GetResponseUserEvent $event)
    {
        $user = $event->getUser();
        $request = $event->getRequest();

        if(!$request->isMethod('GET') && $user->getEmail() == 'demo@uniflow.fr') {
            $url = $this->router->generate('fos_user_profile_edit');

            $event->setResponse(new RedirectResponse($url));
        }
    }
}