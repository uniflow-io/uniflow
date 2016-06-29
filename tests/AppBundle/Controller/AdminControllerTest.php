<?php

namespace Tests\AppBundle\Controller;

class AdminControllerTest extends CommonWebTestCase
{
    public function getHostParameter()
    {
        return 'hosts_admin';
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

    /**
     * @dataProvider urlProviderAuth
     */
    public function testPageIsAuth($url)
    {
        $client = $this->getClient();
        $client->request('GET', $url);

        $this->assertTrue($client->getResponse()->isRedirect('https://admin.darkwood.dev/login'));
    }

    public function urlProvider()
    {
        $commonUrls = array(
            array('/login'),
        );

        return array_merge($commonUrls, array());
    }

    public function urlProviderAuth()
    {
        $commonUrls = array(
        );

        return array_merge($commonUrls, array(
            array('/fr'),
            array('/en'),
            array('/de'),
        ));
    }

}
