<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Symfony\Component\Intl\Exception\NotImplementedException;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200303204237 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"assets', 'flow":"@uniflow-io/assets-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"bash', 'flow":"@uniflow-io/bash-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"canvas', 'flow":"@uniflow-io/canvas-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"if', 'flow":"@uniflow-io/if-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"javascript', 'flow":"@uniflow-io/javascript-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"object', 'flow":"@uniflow-io/object-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"prompt', 'flow":"@uniflow-io/prompt-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"regex', 'flow":"@uniflow-io/regex-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"text-list', 'flow":"@uniflow-io/text-list-flow')
EOF
);
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"text', 'flow":"@uniflow-io/text-flow')
EOF
        );
        $this->addSql(<<<EOF
UPDATE program SET data = REPLACE(data, 'flow":"while', 'flow":"@uniflow-io/while-flow')
EOF
        );
    }

    public function down(Schema $schema) : void
    {
        throw new NotImplementedException('down not implemented');
    }
}
