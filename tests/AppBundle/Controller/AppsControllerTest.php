<?php

namespace Tests\AppBundle\Controller;

class AppsControllerTest extends CommonWebTestCase
{
    public function getHostParameter()
    {
        return 'hosts_apps';
    }

    /**
     * @dataProvider urlProvider
     */
    public function testPageIsSuccessful($url)
    {
        $this->validatePageUrl($url);
    }

    /**
     * @dataProvider urlProvider
     */
    public function testW3C($url)
    {
        $this->validateW3CUrl($url);
    }

    public function urlProvider()
    {
        $commonUrls = array(
            array('/profil/matyo'),
            array('/en/profile/matyo'),
            array('/de/profil/matyo'),
            array('/login'),
            array('/inscription'),
            array('/en/register'),
            array('/de/registrieren'),
            //array('/inscription/confimer-email'),
            //array('/en/register/check-email'),
            //array('/de/registrieren/check-email'),
            //array('/inscription/confirmation/{token}'),
            //array('/en/register/confirm/{token}'),
            //array('/de/registrieren/confirm/{token}'),
            //array('/inscription/valide'),
            //array('/en/register/confirmed'),
            //array('/de/registrieren/confirmed'),
            array('/resetting/request'),
            array('/en/resetting/request'),
            array('/de/resetting/request'),
            //array('/resetting/send-email'),
            //array('/en/resetting/send-email'),
            //array('/de/resetting/send-email'),
            //array('/resetting/check-email'),
            //array('/en/resetting/check-email'),
            //array('/de/resetting/check-email'),
            //array('/resetting/reset/{token}'),
            //array('/en/resetting/reset/{token}'),
            //array('/de/resetting/reset/{token}'),
        );

        return array_merge($commonUrls, array(
            array('/'),
            array('/en'),
            array('/de'),
            array('/plan-du-site'),
            array('/en/sitemap'),
            array('/de/sitemap'),
            array('/sitemap.xml'),
            array('/en/sitemap.xml'),
            array('/de/sitemap.xml'),
            array('/rss'),
            array('/en/rss'),
            array('/de/rss'),
            array('/contact'),
            array('/en/contact'),
            array('/de/kontakt'),

            array('/en/zmesh'),
            array('/de/zmesh'),
            array('/zmesh'),
            array('/en/zmesh/conception'),
            array('/de/zmesh/conception'),
            array('/zmesh/conception'),
        ));
    }
}
