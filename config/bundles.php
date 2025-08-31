<?php

declare(strict_types=1);

use ApiPlatform\Symfony\Bundle\ApiPlatformBundle;
use BabDev\PagerfantaBundle\BabDevPagerfantaBundle;
use Bazinga\Bundle\JsTranslationBundle\BazingaJsTranslationBundle;
use Doctrine\Bundle\DoctrineBundle\DoctrineBundle;
use Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle;
use Doctrine\Bundle\MigrationsBundle\DoctrineMigrationsBundle;
use FOS\RestBundle\FOSRestBundle;
use FriendsOfBehat\SymfonyExtension\Bundle\FriendsOfBehatSymfonyExtensionBundle;
use Knp\Bundle\GaufretteBundle\KnpGaufretteBundle;
use Knp\Bundle\MenuBundle\KnpMenuBundle;
use League\FlysystemBundle\FlysystemBundle;
use Lexik\Bundle\JWTAuthenticationBundle\LexikJWTAuthenticationBundle;
use Liip\ImagineBundle\LiipImagineBundle;
use Payum\Bundle\PayumBundle\PayumBundle;
use Stof\DoctrineExtensionsBundle\StofDoctrineExtensionsBundle;
use Sylius\Abstraction\StateMachine\SyliusStateMachineAbstractionBundle;
use Sylius\Behat\Application\SyliusTestPlugin\SyliusTestPlugin;
use Sylius\Bundle\AddressingBundle\SyliusAddressingBundle;
use Sylius\Bundle\AdminBundle\SyliusAdminBundle;
use Sylius\Bundle\ApiBundle\SyliusApiBundle;
use Sylius\Bundle\AttributeBundle\SyliusAttributeBundle;
use Sylius\Bundle\ChannelBundle\SyliusChannelBundle;
use Sylius\Bundle\CoreBundle\SyliusCoreBundle;
use Sylius\Bundle\CurrencyBundle\SyliusCurrencyBundle;
use Sylius\Bundle\CustomerBundle\SyliusCustomerBundle;
use Sylius\Bundle\FixturesBundle\SyliusFixturesBundle;
use Sylius\Bundle\GridBundle\SyliusGridBundle;
use Sylius\Bundle\InventoryBundle\SyliusInventoryBundle;
use Sylius\Bundle\LocaleBundle\SyliusLocaleBundle;
use Sylius\Bundle\MailerBundle\SyliusMailerBundle;
use Sylius\Bundle\MoneyBundle\SyliusMoneyBundle;
use Sylius\Bundle\OrderBundle\SyliusOrderBundle;
use Sylius\Bundle\PaymentBundle\SyliusPaymentBundle;
use Sylius\Bundle\PayumBundle\SyliusPayumBundle;
use Sylius\Bundle\ProductBundle\SyliusProductBundle;
use Sylius\Bundle\PromotionBundle\SyliusPromotionBundle;
use Sylius\Bundle\ResourceBundle\SyliusResourceBundle;
use Sylius\Bundle\ReviewBundle\SyliusReviewBundle;
use Sylius\Bundle\ShippingBundle\SyliusShippingBundle;
use Sylius\Bundle\ShopBundle\SyliusShopBundle;
use Sylius\Bundle\TaxationBundle\SyliusTaxationBundle;
use Sylius\Bundle\TaxonomyBundle\SyliusTaxonomyBundle;
use Sylius\Bundle\ThemeBundle\SyliusThemeBundle;
use Sylius\Bundle\UiBundle\SyliusUiBundle;
use Sylius\Bundle\UserBundle\SyliusUserBundle;
use Sylius\MolliePlugin\SyliusMolliePlugin;
use Sylius\PayPalPlugin\SyliusPayPalPlugin;
use Sylius\TwigExtra\Symfony\SyliusTwigExtraBundle;
use Sylius\TwigHooks\SyliusTwigHooksBundle;
use SyliusLabs\DoctrineMigrationsExtraBundle\SyliusLabsDoctrineMigrationsExtraBundle;
use Symfony\Bundle\DebugBundle\DebugBundle;
use Symfony\Bundle\FrameworkBundle\FrameworkBundle;
use Symfony\Bundle\MakerBundle\MakerBundle;
use Symfony\Bundle\MonologBundle\MonologBundle;
use Symfony\Bundle\SecurityBundle\SecurityBundle;
use Symfony\Bundle\TwigBundle\TwigBundle;
use Symfony\Bundle\WebProfilerBundle\WebProfilerBundle;
use Symfony\UX\Autocomplete\AutocompleteBundle;
use Symfony\UX\Icons\UXIconsBundle;
use Symfony\UX\LiveComponent\LiveComponentBundle;
use Symfony\UX\StimulusBundle\StimulusBundle;
use Symfony\UX\TwigComponent\TwigComponentBundle;
use Symfony\WebpackEncoreBundle\WebpackEncoreBundle;
use Symfonycasts\SassBundle\SymfonycastsSassBundle;

return [
    FrameworkBundle::class => ['all' => true],
    MonologBundle::class => ['all' => true],
    SecurityBundle::class => ['all' => true],
    TwigBundle::class => ['all' => true],
    DoctrineBundle::class => ['all' => true],
    SyliusStateMachineAbstractionBundle::class => ['all' => true],
    SyliusOrderBundle::class => ['all' => true],
    SyliusMoneyBundle::class => ['all' => true],
    SyliusCurrencyBundle::class => ['all' => true],
    SyliusLocaleBundle::class => ['all' => true],
    SyliusProductBundle::class => ['all' => true],
    SyliusChannelBundle::class => ['all' => true],
    SyliusAttributeBundle::class => ['all' => true],
    SyliusTaxationBundle::class => ['all' => true],
    SyliusShippingBundle::class => ['all' => true],
    SyliusPaymentBundle::class => ['all' => true],
    SyliusMailerBundle::class => ['all' => true],
    SyliusPromotionBundle::class => ['all' => true],
    SyliusAddressingBundle::class => ['all' => true],
    SyliusInventoryBundle::class => ['all' => true],
    SyliusTaxonomyBundle::class => ['all' => true],
    SyliusUserBundle::class => ['all' => true],
    SyliusCustomerBundle::class => ['all' => true],
    SyliusUiBundle::class => ['all' => true],
    SyliusReviewBundle::class => ['all' => true],
    SyliusCoreBundle::class => ['all' => true],
    SyliusResourceBundle::class => ['all' => true],
    SyliusGridBundle::class => ['all' => true],
    KnpGaufretteBundle::class => ['all' => true],
    KnpMenuBundle::class => ['all' => true],
    LiipImagineBundle::class => ['all' => true],
    PayumBundle::class => ['all' => true],
    StofDoctrineExtensionsBundle::class => ['all' => true],
    BabDevPagerfantaBundle::class => ['all' => true],
    DoctrineMigrationsBundle::class => ['all' => true],
    SyliusFixturesBundle::class => ['all' => true],
    SyliusPayumBundle::class => ['all' => true],
    SyliusThemeBundle::class => ['all' => true],
    SyliusAdminBundle::class => ['all' => true],
    SyliusShopBundle::class => ['all' => true],
    DebugBundle::class => ['dev' => true, 'test' => true, 'test_cached' => true],
    WebProfilerBundle::class => ['dev' => true, 'test' => true, 'test_cached' => true],
    FriendsOfBehatSymfonyExtensionBundle::class => ['test' => true, 'test_cached' => true],
    SyliusTestPlugin::class => ['test' => true, 'test_cached' => true],
    ApiPlatformBundle::class => ['all' => true],
    LexikJWTAuthenticationBundle::class => ['all' => true],
    SyliusApiBundle::class => ['all' => true],
    SyliusLabsDoctrineMigrationsExtraBundle::class => ['all' => true],
    FlysystemBundle::class => ['all' => true],
    WebpackEncoreBundle::class => ['all' => true],
    SyliusTwigHooksBundle::class => ['all' => true],
    TwigComponentBundle::class => ['all' => true],
    LiveComponentBundle::class => ['all' => true],
    AutocompleteBundle::class => ['all' => true],
    StimulusBundle::class => ['all' => true],
    SyliusTwigExtraBundle::class => ['all' => true],
    UXIconsBundle::class => ['all' => true],
    FOSRestBundle::class => ['all' => true],
    SyliusPayPalPlugin::class => ['all' => true],
    BazingaJsTranslationBundle::class => ['all' => true],
    SyliusMolliePlugin::class => ['all' => true],
    DoctrineFixturesBundle::class => ['dev' => true, 'test' => true],
    MakerBundle::class => ['dev' => true],
    SymfonycastsSassBundle::class => ['all' => true],
];
